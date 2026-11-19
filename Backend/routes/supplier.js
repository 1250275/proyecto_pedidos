const express = require('express');
const router = express.Router();

const supplierController = require('../controllers/supplierController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const ROLES = require('../constants/roles');

// Todas las rutas requieren sesión iniciada
router.use(authenticate);

// Roles que pueden insertar y actualizar (eliminar es solo para el administrador)
const canWrite = authorize(ROLES.ADMIN, ROLES.WAREHOUSE);
const canDelete = authorize(ROLES.ADMIN);

// Rutas de la tabla proveedor
router.get('/', supplierController.list);                       // listar todos (todos los roles)
router.post('/', canWrite, supplierController.save);            // insertar
router.delete('/:id', canDelete, supplierController.delete);    // eliminar por id
router.get('/:id', supplierController.edit);                    // obtener por id (todos los roles)
router.post('/:id', canWrite, supplierController.update);       // actualizar por id

module.exports = router;
