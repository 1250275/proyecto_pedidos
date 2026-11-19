const express = require('express');
const router = express.Router();

const complaintController = require('../controllers/complaintController');

// Rutas de la tabla reclamo
router.get('/', complaintController.list);          // listar todos
router.post('/', complaintController.save);         // insertar
router.delete('/:id', complaintController.delete);  // eliminar por id
router.get('/:id', complaintController.edit);       // obtener por id
router.post('/:id', complaintController.update);    // actualizar por id

module.exports = router;
