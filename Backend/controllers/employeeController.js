const controller = {};

// Columnas del empleado (el acceso al sistema se maneja en la tabla usuarios)
const publicColumns = 'id_empleado, nombre, apellidos, dni, email, cargo, fecha_ingreso, fecha_nacimiento';

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

// Insertar un registro
controller.save = (req, res) => {
    const data = req.body;
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('insert into empleado set ?', [data], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Registro Guardado", id: result.insertId });
        });
    });
};

// Actualizar un registro
controller.update = (req, res) => {
    const { id } = req.params;
    const newEmployee = req.body;
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
