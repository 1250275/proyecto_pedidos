const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const ROLES = require('../constants/roles');

// Todas las rutas de usuarios son solo para el administrador
router.use(authenticate, authorize(ROLES.ADMIN));

// Rutas de la tabla usuarios
router.get('/', userController.list);                          // listar todos
router.post('/', userController.save);                         // insertar
router.delete('/:id', userController.delete);                  // eliminar por id
router.get('/:id', userController.edit);                       // obtener por id
router.post('/:id', userController.update);                    // actualizar por id
router.post('/:id/password', userController.resetPassword);    // restablecer contraseña

module.exports = router;
