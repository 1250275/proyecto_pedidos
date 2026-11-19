const express = require('express');
const router = express.Router();

const customerController = require('../controllers/customerController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const ROLES = require('../constants/roles');

// Todas las rutas requieren sesión iniciada
router.use(authenticate);

// Roles que pueden insertar y actualizar (eliminar es solo para el administrador)
const canWrite = authorize(ROLES.ADMIN, ROLES.CASHIER);
const canDelete = authorize(ROLES.ADMIN);

// Rutas de la tabla cliente
router.get('/', customerController.list);                       // listar todos (todos los roles)
router.post('/', canWrite, customerController.save);            // insertar
router.delete('/:id', canDelete, customerController.delete);    // eliminar por id
router.get('/:id', customerController.edit);                    // obtener por id (todos los roles)
router.post('/:id', canWrite, customerController.update);       // actualizar por id

module.exports = router;
