const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');

// Rutas de la tabla pedido
router.get('/', orderController.list);          // listar todos
router.post('/', orderController.save);         // insertar
router.delete('/:id', orderController.delete);  // eliminar por id
router.get('/:id', orderController.edit);       // obtener por id
router.post('/:id', orderController.update);    // actualizar por id

module.exports = router;
