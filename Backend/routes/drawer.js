const express = require('express');
const router = express.Router();

const drawerController = require('../controllers/drawerController');

// Rutas de la tabla gaveta
router.get('/', drawerController.list);          // listar todos
router.post('/', drawerController.save);         // insertar
router.delete('/:id', drawerController.delete);  // eliminar por id
router.get('/:id', drawerController.edit);       // obtener por id
router.post('/:id', drawerController.update);    // actualizar por id

module.exports = router;
