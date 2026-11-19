const controller = {};

// Listar todos los registros
controller.list = (req, res) => {
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('select * from comprobante', (err, receipts) => {
            if (err) return res.status(500).json(err);
            res.json(receipts);
        });
    });
};

// Obtener un registro por su id
controller.edit = (req, res) => {
    const { id } = req.params;
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('select * from comprobante where codigo_comprobante = ?', [id], (err, receipt) => {
            if (err) return res.status(500).json(err);
            if (receipt.length === 0) return res.status(404).json({ message: "Registro no encontrado" });
            res.json(receipt[0]);
        });
    });
};

// Insertar un registro
controller.save = (req, res) => {
    const data = req.body;
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('insert into comprobante set ?', [data], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Registro Guardado", id: data.codigo_comprobante });
        });
    });
};

// Actualizar un registro
controller.update = (req, res) => {
    const { id } = req.params;
    const newReceipt = req.body;
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('update comprobante set ? where codigo_comprobante = ?', [newReceipt, id], (err, result) => {
            if (err) return res.status(500).json(err);
            if (result.affectedRows === 0) return res.status(404).json({ message: "Registro no encontrado" });
            res.json({ message: "Registro Actualizado" });
        });
    });
};

// Eliminar un registro
controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('delete from comprobante where codigo_comprobante = ?', [id], (err, result) => {
            if (err) return res.status(500).json(err);
            if (result.affectedRows === 0) return res.status(404).json({ message: "Registro no encontrado" });
            res.json({ message: "Registro Eliminado" });
        });
    });
};

module.exports = controller;
