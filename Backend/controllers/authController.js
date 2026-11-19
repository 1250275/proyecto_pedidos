const { signToken, setTokenCookie, clearTokenCookie } = require('../utils/token');
const { MIN_PASSWORD_LENGTH, isValidPassword, hashPassword, comparePassword } = require('../utils/password');

const controller = {};

// Intentos fallidos permitidos antes de bloquear al usuario
const MAX_FAILED_ATTEMPTS = 5;

const INVALID_CREDENTIALS = { message: "Usuario o contraseña incorrectos" };
const BLOCKED_USER = { message: "Usuario bloqueado por intentos fallidos. Contacte al administrador." };
const INACTIVE_USER = { message: "Usuario inactivo. Contacte al administrador." };

// Iniciar sesión: valida usuario y contraseña, y guarda el JWT en una cookie httpOnly
controller.login = (req, res) => {
    const { nombre_usuario, contrasena } = req.body;
    if (!nombre_usuario || !contrasena) {
        return res.status(400).json({ message: "Debe enviar nombre_usuario y contrasena" });
    }

    req.getConnection(async (error, conn) => {
        if (error) return res.status(500).json(error);
        try {
            const db = conn.promise();
            const [users] = await db.query(
                'select id_usuario, nombre_usuario, contrasena_hash, rol, estado, intentos_fallidos from usuarios where nombre_usuario = ?',
                [nombre_usuario]
            );
            // no se indica si el usuario existe o no
            if (users.length === 0) return res.status(401).json(INVALID_CREDENTIALS);

            const user = users[0];
            if (user.estado === 'bloqueado') return res.status(403).json(BLOCKED_USER);
            if (user.estado === 'inactivo') return res.status(403).json(INACTIVE_USER);

            const isValid = await comparePassword(contrasena, user.contrasena_hash);
            if (!isValid) {
                const failedAttempts = user.intentos_fallidos + 1;
                const newStatus = failedAttempts >= MAX_FAILED_ATTEMPTS ? 'bloqueado' : user.estado;
                await db.query(
                    'update usuarios set intentos_fallidos = ?, estado = ? where id_usuario = ?',
                    [failedAttempts, newStatus, user.id_usuario]
                );
                if (newStatus === 'bloqueado') return res.status(403).json(BLOCKED_USER);
                return res.status(401).json(INVALID_CREDENTIALS);
            }

            await db.query(
                'update usuarios set intentos_fallidos = 0, ultimo_acceso = now() where id_usuario = ?',
                [user.id_usuario]
            );
            setTokenCookie(res, signToken({ id_usuario: user.id_usuario, rol: user.rol }));
            res.json({
                message: "Inicio de sesión correcto",
                usuario: { id_usuario: user.id_usuario, nombre_usuario: user.nombre_usuario, rol: user.rol }
            });
        } catch (err) {
            res.status(500).json(err);
        }
    });
};

// Cerrar sesión: elimina la cookie del token
controller.logout = (req, res) => {
    clearTokenCookie(res);
    res.json({ message: "Sesión cerrada" });
};

// Datos del usuario que inició sesión (el frontend lo usa para restaurar la sesión)
controller.me = (req, res) => {
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query(
            'select u.id_usuario, u.nombre_usuario, u.rol, u.estado, u.ultimo_acceso, e.id_empleado, e.nombre, e.apellidos ' +
            'from usuarios u join empleado e on e.id_empleado = u.id_empleado where u.id_usuario = ?',
            [req.user.id_usuario],
            (err, users) => {
                if (err) return res.status(500).json(err);
                if (users.length === 0) return res.status(404).json({ message: "Registro no encontrado" });
                res.json(users[0]);
            }
        );
    });
};

// Cambiar la contraseña propia (requiere la contraseña actual)
controller.changePassword = (req, res) => {
    const { contrasena_actual, contrasena_nueva } = req.body;
    if (!contrasena_actual || !isValidPassword(contrasena_nueva)) {
        return res.status(400).json({
            message: "Debe enviar contrasena_actual y una contrasena_nueva de al menos " + MIN_PASSWORD_LENGTH + " caracteres"
        });
    }

    req.getConnection(async (error, conn) => {
        if (error) return res.status(500).json(error);
        try {
            const db = conn.promise();
            const [users] = await db.query('select contrasena_hash from usuarios where id_usuario = ?', [req.user.id_usuario]);
            if (users.length === 0) return res.status(404).json({ message: "Registro no encontrado" });

            const isValid = await comparePassword(contrasena_actual, users[0].contrasena_hash);
            if (!isValid) return res.status(400).json({ message: "La contraseña actual es incorrecta" });

            const newHash = await hashPassword(contrasena_nueva);
            await db.query('update usuarios set contrasena_hash = ? where id_usuario = ?', [newHash, req.user.id_usuario]);
            res.json({ message: "Contraseña actualizada" });
        } catch (err) {
            res.status(500).json(err);
        }
    });
};

module.exports = controller;
