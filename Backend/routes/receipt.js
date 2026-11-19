const express = require('express');
const router = express.Router();

const receiptController = require('../controllers/receiptController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const ROLES = require('../constants/roles');

// Todas las rutas requieren sesión iniciada
router.use(authenticate);

// Roles que pueden insertar y actualizar (eliminar es solo para el administrador)
const canWrite = authorize(ROLES.ADMIN, ROLES.CASHIER);
const canDelete = authorize(ROLES.ADMIN);

// Rutas de la tabla comprobante
router.get('/', receiptController.list);                       // listar todos (todos los roles)
router.post('/', canWrite, receiptController.save);            // insertar
router.delete('/:id', canDelete, receiptController.delete);    // eliminar por id
router.get('/:id', receiptController.edit);                    // obtener por id (todos los roles)
router.post('/:id', canWrite, receiptController.update);       // actualizar por id

module.exports = router;
