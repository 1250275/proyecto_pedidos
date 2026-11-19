const express = require('express');
const router = express.Router();

const receiptController = require('../controllers/receiptController');

// Rutas de la tabla comprobante
router.get('/', receiptController.list);          // listar todos
router.post('/', receiptController.save);         // insertar
router.delete('/:id', receiptController.delete);  // eliminar por id
router.get('/:id', receiptController.edit);       // obtener por id
router.post('/:id', receiptController.update);    // actualizar por id

module.exports = router;
