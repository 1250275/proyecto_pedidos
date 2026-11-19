const express = require('express');
const router = express.Router();

const complaintController = require('../controllers/complaintController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const ROLES = require('../constants/roles');

// Todas las rutas requieren sesión iniciada
router.use(authenticate);

// Roles que pueden insertar y actualizar (eliminar es solo para el administrador)
const canWrite = authorize(ROLES.ADMIN, ROLES.CASHIER);
const canDelete = authorize(ROLES.ADMIN);

// Rutas de la tabla reclamo
router.get('/', complaintController.list);                       // listar todos (todos los roles)
router.post('/', canWrite, complaintController.save);            // insertar
router.delete('/:id', canDelete, complaintController.delete);    // eliminar por id
router.get('/:id', complaintController.edit);                    // obtener por id (todos los roles)
router.post('/:id', canWrite, complaintController.update);       // actualizar por id

module.exports = router;
