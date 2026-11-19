const { COOKIE_NAME, verifyToken, clearTokenCookie } = require('../utils/token');

// Verifica la cookie con el JWT y que el usuario siga activo en la base de datos.
// Si todo es correcto deja los datos del usuario en req.user = { id_usuario, rol }.
const authenticate = (req, res, next) => {
    const token = req.cookies ? req.cookies[COOKIE_NAME] : null;
    if (!token) return res.status(401).json({ message: "No autenticado" });

    let payload;
    try {
        payload = verifyToken(token);
    } catch (err) {
        clearTokenCookie(res);
        return res.status(401).json({ message: "Sesión inválida o expirada" });
    }

    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('select id_usuario, rol, estado from usuarios where id_usuario = ?', [payload.id_usuario], (err, users) => {
            if (err) return res.status(500).json(err);
            // el usuario fue eliminado, inactivado o bloqueado después de iniciar sesión
            if (users.length === 0 || users[0].estado !== 'activo') {
                clearTokenCookie(res);
                return res.status(401).json({ message: "Usuario no autorizado" });
            }
            // se usa el rol actual de la base de datos por si cambió después del login
            req.user = { id_usuario: users[0].id_usuario, rol: users[0].rol };
            next();
        });
    });
};

module.exports = authenticate;
