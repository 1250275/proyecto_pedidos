const express = require('express');
const router = express.Router();

const roleController = require('../controllers/roleController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const ROLES = require('../constants/roles');

// Rutas de roles (solo administrador)
router.get('/', authenticate, authorize(ROLES.ADMIN), roleController.list);   // listar roles

module.exports = router;
