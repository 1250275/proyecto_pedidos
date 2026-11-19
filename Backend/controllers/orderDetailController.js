const controller = {};

// Listar todos los registros
controller.list = (req, res) => {
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('select * from detalle_pedido', (err, orderDetails) => {
            if (err) return res.status(500).json(err);
            res.json(orderDetails);
        });
    });
};

// Obtener un registro por su llave compuesta (id_pedido, id_producto)
controller.edit = (req, res) => {
    const { orderId, productId } = req.params;
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('select * from detalle_pedido where id_pedido = ? and id_producto = ?', [orderId, productId], (err, orderDetail) => {
            if (err) return res.status(500).json(err);
            if (orderDetail.length === 0) return res.status(404).json({ message: "Registro no encontrado" });
            res.json(orderDetail[0]);
        });
    });
};

// Insertar un registro
controller.save = (req, res) => {
    const data = req.body;
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('insert into detalle_pedido set ?', [data], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Registro Guardado" });
        });
    });
};

// Actualizar un registro
controller.update = (req, res) => {
    const { orderId, productId } = req.params;
    const newOrderDetail = req.body;
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('update detalle_pedido set ? where id_pedido = ? and id_producto = ?', [newOrderDetail, orderId, productId], (err, result) => {
            if (err) return res.status(500).json(err);
            if (result.affectedRows === 0) return res.status(404).json({ message: "Registro no encontrado" });
            res.json({ message: "Registro Actualizado" });
        });
    });
};

// Eliminar un registro
controller.delete = (req, res) => {
    const { orderId, productId } = req.params;
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('delete from detalle_pedido where id_pedido = ? and id_producto = ?', [orderId, productId], (err, result) => {
            if (err) return res.status(500).json(err);
            if (result.affectedRows === 0) return res.status(404).json({ message: "Registro no encontrado" });
            res.json({ message: "Registro Eliminado" });
        });
    });
};

module.exports = controller;
