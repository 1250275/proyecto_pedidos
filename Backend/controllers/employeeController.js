const crypto = require('crypto');

const controller = {};

// Columnas públicas del empleado (nunca se devuelve la credencial)
const publicColumns = 'id_empleado, nombre, apellidos, dni, email, cargo, fecha_ingreso, fecha_nacimiento';

// Genera el hash SHA-256 de la credencial (equivale a SHA2(valor, 256) en MySQL)
const hashCredential = (credential) => crypto.createHash('sha256').update(String(credential)).digest('hex');

// Listar todos los registros
controller.list = (req, res) => {
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('select ' + publicColumns + ' from empleado', (err, employees) => {
            if (err) return res.status(500).json(err);
            res.json(employees);
        });
    });
};

// Obtener un registro por su id
controller.edit = (req, res) => {
    const { id } = req.params;
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('select ' + publicColumns + ' from empleado where id_empleado = ?', [id], (err, employee) => {
            if (err) return res.status(500).json(err);
            if (employee.length === 0) return res.status(404).json({ message: "Registro no encontrado" });
            res.json(employee[0]);
        });
    });
};

// Insertar un registro (la credencial se guarda como hash)
controller.save = (req, res) => {
    const data = { ...req.body };
    if (data.credencial) data.credencial = hashCredential(data.credencial);
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('insert into empleado set ?', [data], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Registro Guardado", id: result.insertId });
        });
    });
};

// Actualizar un registro (si no se envía credencial, se conserva la actual)
controller.update = (req, res) => {
    const { id } = req.params;
    const newEmployee = { ...req.body };
    if (newEmployee.credencial) {
        newEmployee.credencial = hashCredential(newEmployee.credencial);
    } else {
        delete newEmployee.credencial;
    }
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('update empleado set ? where id_empleado = ?', [newEmployee, id], (err, result) => {
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
        conn.query('delete from empleado where id_empleado = ?', [id], (err, result) => {
            if (err) return res.status(500).json(err);
            if (result.affectedRows === 0) return res.status(404).json({ message: "Registro no encontrado" });
            res.json({ message: "Registro Eliminado" });
        });
    });
};

module.exports = controller;
