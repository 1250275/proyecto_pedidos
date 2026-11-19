// Roles fijos del sistema (única fuente de verdad; coinciden con el ENUM de usuarios.rol)
const ROLES = Object.freeze({
    ADMIN: 'Administrador',
    CASHIER: 'Cajero',
    WAREHOUSE: 'Bodeguero'
});

module.exports = ROLES;
