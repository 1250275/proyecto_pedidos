const express = require('express');
const router = express.Router();

const productSupplierController = require('../controllers/productSupplierController');

// Rutas de la tabla detalle_proveedores (llave compuesta: id_producto, id_proveedor)
router.get('/', productSupplierController.list);                  // listar todos
router.post('/', productSupplierController.save);                 // insertar
router.delete('/:productId/:supplierId', productSupplierController.delete);  // eliminar por llave compuesta
router.get('/:productId/:supplierId', productSupplierController.edit);       // obtener por llave compuesta
router.post('/:productId/:supplierId', productSupplierController.update);    // actualizar por llave compuesta

module.exports = router;
