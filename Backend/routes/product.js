const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const ROLES = require('../constants/roles');

// Todas las rutas requieren sesión iniciada
router.use(authenticate);

// Roles que pueden insertar y actualizar (eliminar es solo para el administrador)
const canWrite = authorize(ROLES.ADMIN, ROLES.WAREHOUSE);
const canDelete = authorize(ROLES.ADMIN);

// Rutas de la tabla producto
router.get('/', productController.list);                       // listar todos (todos los roles)
router.post('/', canWrite, productController.save);            // insertar
router.delete('/:id', canDelete, productController.delete);    // eliminar por id
router.get('/:id', productController.edit);                    // obtener por id (todos los roles)
router.post('/:id', canWrite, productController.update);       // actualizar por id

module.exports = router;
