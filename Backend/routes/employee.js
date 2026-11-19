const express = require('express');
const router = express.Router();

const employeeController = require('../controllers/employeeController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const ROLES = require('../constants/roles');

// Todas las rutas requieren sesión iniciada
router.use(authenticate);

// Roles que pueden insertar y actualizar (eliminar es solo para el administrador)
const canWrite = authorize(ROLES.ADMIN);
const canDelete = authorize(ROLES.ADMIN);

// Rutas de la tabla empleado
router.get('/', employeeController.list);                       // listar todos (todos los roles)
router.post('/', canWrite, employeeController.save);            // insertar
router.delete('/:id', canDelete, employeeController.delete);    // eliminar por id
router.get('/:id', employeeController.edit);                    // obtener por id (todos los roles)
router.post('/:id', canWrite, employeeController.update);       // actualizar por id

module.exports = router;
