const controller = {};

// Listar todos los registros
controller.list = (req, res) => {
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('select * from detalle_proveedores', (err, productSuppliers) => {
            if (err) return res.status(500).json(err);
            res.json(productSuppliers);
        });
    });
};

// Obtener un registro por su llave compuesta (id_producto, id_proveedor)
controller.edit = (req, res) => {
    const { productId, supplierId } = req.params;
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('select * from detalle_proveedores where id_producto = ? and id_proveedor = ?', [productId, supplierId], (err, productSupplier) => {
            if (err) return res.status(500).json(err);
            if (productSupplier.length === 0) return res.status(404).json({ message: "Registro no encontrado" });
            res.json(productSupplier[0]);
        });
    });
};

// Insertar un registro
controller.save = (req, res) => {
    const data = req.body;
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('insert into detalle_proveedores set ?', [data], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Registro Guardado" });
        });
    });
};

// Actualizar un registro
controller.update = (req, res) => {
    const { productId, supplierId } = req.params;
    const newProductSupplier = req.body;
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('update detalle_proveedores set ? where id_producto = ? and id_proveedor = ?', [newProductSupplier, productId, supplierId], (err, result) => {
            if (err) return res.status(500).json(err);
            if (result.affectedRows === 0) return res.status(404).json({ message: "Registro no encontrado" });
            res.json({ message: "Registro Actualizado" });
        });
    });
};

// Eliminar un registro
controller.delete = (req, res) => {
    const { productId, supplierId } = req.params;
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('delete from detalle_proveedores where id_producto = ? and id_proveedor = ?', [productId, supplierId], (err, result) => {
            if (err) return res.status(500).json(err);
            if (result.affectedRows === 0) return res.status(404).json({ message: "Registro no encontrado" });
            res.json({ message: "Registro Eliminado" });
        });
    });
};

module.exports = controller;
