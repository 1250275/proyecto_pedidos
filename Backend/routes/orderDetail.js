const express = require('express');
const router = express.Router();

const orderDetailController = require('../controllers/orderDetailController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const ROLES = require('../constants/roles');

// Todas las rutas requieren sesión iniciada
router.use(authenticate);

// Roles que pueden insertar y actualizar (eliminar es solo para el administrador)
const canWrite = authorize(ROLES.ADMIN, ROLES.CASHIER);
const canDelete = authorize(ROLES.ADMIN);

// Rutas de la tabla detalle_pedido (llave compuesta: id_pedido, id_producto)
router.get('/', orderDetailController.list);                                       // listar todos (todos los roles)
router.post('/', canWrite, orderDetailController.save);                            // insertar
router.delete('/:orderId/:productId', canDelete, orderDetailController.delete);    // eliminar por llave compuesta
router.get('/:orderId/:productId', orderDetailController.edit);                    // obtener por llave compuesta (todos los roles)
router.post('/:orderId/:productId', canWrite, orderDetailController.update);       // actualizar por llave compuesta

module.exports = router;
