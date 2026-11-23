const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const ROLES = require('../constants/roles');

// Todas las rutas requieren sesión iniciada
router.use(authenticate);

// Roles que pueden insertar y actualizar (eliminar es solo para el administrador)
const canWrite = authorize(ROLES.ADMIN, ROLES.CASHIER);
const canDelete = authorize(ROLES.ADMIN);

// Rutas de la tabla pedido
router.get('/', orderController.list);                       // listar todos (todos los roles)
router.post('/', canWrite, orderController.save);            // insertar
router.post('/checkout', canWrite, orderController.checkout); // registrar una venta desde el carrito (antes de /:id)
router.delete('/:id', canDelete, orderController.delete);    // eliminar por id
router.get('/:id', orderController.edit);                    // obtener por id (todos los roles)
router.post('/:id', canWrite, orderController.update);       // actualizar por id

module.exports = router;
