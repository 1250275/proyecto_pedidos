const express = require('express');
const router = express.Router();

const orderDetailController = require('../controllers/orderDetailController');

// Rutas de la tabla detalle_pedido (llave compuesta: id_pedido, id_producto)
router.get('/', orderDetailController.list);                  // listar todos
router.post('/', orderDetailController.save);                 // insertar
router.delete('/:orderId/:productId', orderDetailController.delete);  // eliminar por llave compuesta
router.get('/:orderId/:productId', orderDetailController.edit);       // obtener por llave compuesta
router.post('/:orderId/:productId', orderDetailController.update);    // actualizar por llave compuesta

module.exports = router;
