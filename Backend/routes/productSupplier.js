const express = require('express');
const router = express.Router();

const productSupplierController = require('../controllers/productSupplierController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const ROLES = require('../constants/roles');

// Todas las rutas requieren sesión iniciada
router.use(authenticate);

// Roles que pueden insertar y actualizar (eliminar es solo para el administrador)
const canWrite = authorize(ROLES.ADMIN, ROLES.WAREHOUSE);
const canDelete = authorize(ROLES.ADMIN);

// Rutas de la tabla detalle_proveedores (llave compuesta: id_producto, id_proveedor)
router.get('/', productSupplierController.list);                                          // listar todos (todos los roles)
router.post('/', canWrite, productSupplierController.save);                               // insertar
router.delete('/:productId/:supplierId', canDelete, productSupplierController.delete);    // eliminar por llave compuesta
router.get('/:productId/:supplierId', productSupplierController.edit);                    // obtener por llave compuesta (todos los roles)
router.post('/:productId/:supplierId', canWrite, productSupplierController.update);       // actualizar por llave compuesta

module.exports = router;
