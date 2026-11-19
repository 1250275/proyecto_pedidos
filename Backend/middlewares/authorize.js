// Permite el acceso solo a los roles indicados. Se usa después de authenticate.
// Ejemplo: router.post('/', authenticate, authorize(ROLES.ADMIN, ROLES.CASHIER), controller.save);
const authorize = (...allowedRoles) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "No autenticado" });
    if (!allowedRoles.includes(req.user.rol)) {
        return res.status(403).json({ message: "No tiene permisos para realizar esta acción" });
    }
    next();
};

module.exports = authorize;
