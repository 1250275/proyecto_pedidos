const ROLES = require('../constants/roles');
const { MIN_PASSWORD_LENGTH, isValidPassword, hashPassword } = require('../utils/password');

const controller = {};

const VALID_ROLES = Object.values(ROLES);
const VALID_STATUSES = ['activo', 'inactivo', 'bloqueado'];

// Nunca se devuelve contrasena_hash
const selectUsers =
    "select u.id_usuario, u.id_empleado, concat(e.nombre, ' ', e.apellidos) as nombre_empleado, " +
    "u.nombre_usuario, u.rol, u.estado, u.intentos_fallidos, u.ultimo_acceso, u.fecha_creacion " +
    "from usuarios u join empleado e on e.id_empleado = u.id_empleado";

const INVALID_ROLE = { message: "rol inválido. Valores permitidos: " + VALID_ROLES.join(', ') };
const INVALID_STATUS = { message: "estado inválido. Valores permitidos: " + VALID_STATUSES.join(', ') };
const INVALID_PASSWORD = { message: "La contraseña debe tener al menos " + MIN_PASSWORD_LENGTH + " caracteres" };

// Listar todos los registros
controller.list = (req, res) => {
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query(selectUsers + ' order by u.id_usuario', (err, users) => {
            if (err) return res.status(500).json(err);
            res.json(users);
        });
    });
};

// Obtener un registro por su id
controller.edit = (req, res) => {
    const { id } = req.params;
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query(selectUsers + ' where u.id_usuario = ?', [id], (err, user) => {
            if (err) return res.status(500).json(err);
            if (user.length === 0) return res.status(404).json({ message: "Registro no encontrado" });
            res.json(user[0]);
        });
    });
};

// Insertar un registro (la contraseña se recibe en texto plano y se guarda como hash bcrypt)
controller.save = (req, res) => {
    const { id_empleado, nombre_usuario, contrasena, rol, estado } = req.body;
    if (!id_empleado || !nombre_usuario || !rol) {
        return res.status(400).json({ message: "Debe enviar id_empleado, nombre_usuario, contrasena y rol" });
    }
    if (!VALID_ROLES.includes(rol)) return res.status(400).json(INVALID_ROLE);
    if (estado !== undefined && !VALID_STATUSES.includes(estado)) return res.status(400).json(INVALID_STATUS);
    if (!isValidPassword(contrasena)) return res.status(400).json(INVALID_PASSWORD);

    req.getConnection(async (error, conn) => {
        if (error) return res.status(500).json(error);
        try {
            const data = { id_empleado, nombre_usuario, rol, contrasena_hash: await hashPassword(contrasena) };
            if (estado !== undefined) data.estado = estado;
            const [result] = await conn.promise().query('insert into usuarios set ?', [data]);
            res.json({ message: "Registro Guardado", id: result.insertId });
        } catch (err) {
            res.status(500).json(err);
        }
    });
};

// Actualizar un registro (solo nombre_usuario, rol y estado; la contraseña tiene su propio endpoint)
controller.update = (req, res) => {
    const { id } = req.params;
    const { nombre_usuario, rol, estado } = req.body;

    const newUser = {};
    if (nombre_usuario !== undefined) newUser.nombre_usuario = nombre_usuario;
    if (rol !== undefined) {
        if (!VALID_ROLES.includes(rol)) return res.status(400).json(INVALID_ROLE);
        newUser.rol = rol;
    }
    if (estado !== undefined) {
        if (!VALID_STATUSES.includes(estado)) return res.status(400).json(INVALID_STATUS);
        newUser.estado = estado;
        // reactivar (o desbloquear) reinicia los intentos fallidos
        if (estado === 'activo') newUser.intentos_fallidos = 0;
    }
    if (Object.keys(newUser).length === 0) {
        return res.status(400).json({ message: "Debe enviar al menos uno de: nombre_usuario, rol, estado" });
    }
    // el administrador no puede quitarse su propio acceso
    const isSelf = Number(id) === req.user.id_usuario;
    if (isSelf && ((newUser.rol && newUser.rol !== ROLES.ADMIN) || (newUser.estado && newUser.estado !== 'activo'))) {
        return res.status(400).json({ message: "No puede quitarse el rol de administrador ni desactivar su propio usuario" });
    }

    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('update usuarios set ? where id_usuario = ?', [newUser, id], (err, result) => {
            if (err) return res.status(500).json(err);
            if (result.affectedRows === 0) return res.status(404).json({ message: "Registro no encontrado" });
            res.json({ message: "Registro Actualizado" });
        });
    });
};

// Eliminar un registro
controller.delete = (req, res) => {
    const { id } = req.params;
    if (Number(id) === req.user.id_usuario) {
        return res.status(400).json({ message: "No puede eliminar su propio usuario" });
    }
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('delete from usuarios where id_usuario = ?', [id], (err, result) => {
            if (err) return res.status(500).json(err);
            if (result.affectedRows === 0) return res.status(404).json({ message: "Registro no encontrado" });
            res.json({ message: "Registro Eliminado" });
        });
    });
};

// Restablecer la contraseña de un usuario (administrador, sin conocer la actual)
controller.resetPassword = (req, res) => {
    const { id } = req.params;
    const { contrasena_nueva } = req.body;
    if (!isValidPassword(contrasena_nueva)) return res.status(400).json(INVALID_PASSWORD);

    req.getConnection(async (error, conn) => {
        if (error) return res.status(500).json(error);
        try {
            const newHash = await hashPassword(contrasena_nueva);
            const [result] = await conn.promise().query('update usuarios set contrasena_hash = ? where id_usuario = ?', [newHash, id]);
            if (result.affectedRows === 0) return res.status(404).json({ message: "Registro no encontrado" });
            res.json({ message: "Contraseña restablecida" });
        } catch (err) {
            res.status(500).json(err);
        }
    });
};

module.exports = controller;
