const express = require('express');
const router = express.Router();

const drawerController = require('../controllers/drawerController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const ROLES = require('../constants/roles');

// Todas las rutas requieren sesión iniciada
router.use(authenticate);

// Roles que pueden insertar y actualizar (eliminar es solo para el administrador)
const canWrite = authorize(ROLES.ADMIN);
const canDelete = authorize(ROLES.ADMIN);

// Rutas de la tabla gaveta
router.get('/', drawerController.list);                       // listar todos (todos los roles)
router.post('/', canWrite, drawerController.save);            // insertar
router.delete('/:id', canDelete, drawerController.delete);    // eliminar por id
router.get('/:id', drawerController.edit);                    // obtener por id (todos los roles)
router.post('/:id', canWrite, drawerController.update);       // actualizar por id

module.exports = router;
