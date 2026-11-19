const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');

// Rutas de autenticación
router.post('/login', authController.login);                                  // iniciar sesión (público)
router.post('/logout', authController.logout);                                // cerrar sesión
router.get('/me', authenticate, authController.me);                           // usuario actual
router.post('/change-password', authenticate, authController.changePassword); // cambiar contraseña propia

module.exports = router;
