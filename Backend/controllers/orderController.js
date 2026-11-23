const { HttpError, isPositiveInteger, runTransaction } = require('../utils/transaction');
const { adjustDrawer } = require('../utils/drawer');

const controller = {};

const RECEIPT_PREFIX = '000-001-01-';

// Listar todos los registros
controller.list = (req, res) => {
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('select * from pedido', (err, orders) => {
            if (err) return res.status(500).json(err);
            res.json(orders);
        });
    });
};

// Obtener un registro por su id
controller.edit = (req, res) => {
    const { id } = req.params;
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('select * from pedido where id_pedido = ?', [id], (err, order) => {
            if (err) return res.status(500).json(err);
            if (order.length === 0) return res.status(404).json({ message: "Registro no encontrado" });
            res.json(order[0]);
        });
    });
};

// Insertar un registro (el total empieza en 0 y lo calcula el detalle)
controller.save = (req, res) => {
    const { total, ...data } = req.body;
    req.getConnection((error, conn) => {
        if (error) return res.status(500).json(error);
        conn.query('insert into pedido set ?', [data], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Registro Guardado", id: result.insertId });
        });
    });
};

// Actualizar un registro: si cambia la gaveta, el total del pedido pasa a la nueva gaveta
controller.update = (req, res) => {
    const { id } = req.params;
    const { total, id_pedido, ...newOrder } = req.body;
    if (Object.keys(newOrder).length === 0) {
        return res.status(400).json({ message: "Debe enviar al menos uno de: dni_cliente, id_empleado, id_gaveta" });
    }

    runTransaction(req, res, async (db) => {
        const [orders] = await db.query('select total, id_gaveta from pedido where id_pedido = ? for update', [id]);
        if (orders.length === 0) throw new HttpError(404, "Registro no encontrado");
        const order = orders[0];
        await db.query('update pedido set ? where id_pedido = ?', [newOrder, id]);
        if (newOrder.id_gaveta !== undefined && Number(newOrder.id_gaveta) !== order.id_gaveta) {
            await adjustDrawer(db, order.id_gaveta, -order.total);
            await adjustDrawer(db, newOrder.id_gaveta, order.total);
        }
        return { message: "Registro Actualizado" };
    });
};

// Eliminar un registro: devuelve el stock de sus productos y resta su total de la gaveta
controller.delete = (req, res) => {
    const { id } = req.params;

    runTransaction(req, res, async (db) => {
        const [orders] = await db.query('select total, id_gaveta from pedido where id_pedido = ? for update', [id]);
        if (orders.length === 0) throw new HttpError(404, "Registro no encontrado");
        await db.query(
            'update producto p join detalle_pedido d on d.id_producto = p.id_producto ' +
            'set p.stock = p.stock + d.cantidad where d.id_pedido = ?',
            [id]
        );
        await db.query('delete from pedido where id_pedido = ?', [id]);
        await adjustDrawer(db, orders[0].id_gaveta, -orders[0].total);
        return { message: "Registro Eliminado" };
    });
};

// Registrar una venta completa desde el carrito: pedido, detalle, stock, comprobante y gaveta
controller.checkout = (req, res) => {
    const { dni_cliente, id_gaveta, productos } = req.body;
    if (!dni_cliente || !id_gaveta) {
        return res.status(400).json({ message: "Debe enviar dni_cliente e id_gaveta" });
    }
    if (!Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({ message: "El carrito está vacío" });
    }
    const quantities = new Map();
    for (const item of productos) {
        if (!isPositiveInteger(item?.id_producto) || !isPositiveInteger(item?.cantidad)) {
            return res.status(400).json({ message: "Cada producto debe tener id_producto y una cantidad entera mayor que 0" });
        }
        const id = Number(item.id_producto);
        quantities.set(id, (quantities.get(id) || 0) + Number(item.cantidad));
    }
    const productIds = [...quantities.keys()].sort((a, b) => a - b);

    runTransaction(req, res, async (db) => {
        const [employees] = await db.query('select id_empleado from usuarios where id_usuario = ?', [req.user.id_usuario]);
        if (employees.length === 0) throw new HttpError(400, "El usuario no tiene un empleado asociado");
        const id_empleado = employees[0].id_empleado;

        const [customers] = await db.query('select dni_cliente from cliente where dni_cliente = ?', [dni_cliente]);
        if (customers.length === 0) throw new HttpError(400, "Cliente no encontrado");
        const [drawers] = await db.query('select id_gaveta from gaveta where id_gaveta = ? for update', [id_gaveta]);
        if (drawers.length === 0) throw new HttpError(400, "Gaveta no encontrada");

        const [products] = await db.query(
            'select id_producto, nombre, precio_venta, stock from producto where id_producto in (?) for update',
            [productIds]
        );
        const lines = productIds.map((id) => {
            const product = products.find((p) => p.id_producto === id);
            if (!product) throw new HttpError(404, `Producto ${id} no encontrado`);
            const cantidad = quantities.get(id);
            if (cantidad > product.stock) {
                throw new HttpError(400, `Stock insuficiente: solo hay ${product.stock} unidades de ${product.nombre}`);
            }
            const precio = Number(product.precio_venta);
            return { id_producto: id, nombre: product.nombre, cantidad, precio_unitario: precio.toFixed(2), sub_total: (precio * cantidad).toFixed(2) };
        });
        const total = lines.reduce((sum, line) => sum + Number(line.sub_total), 0).toFixed(2);

        const [order] = await db.query('insert into pedido set ?', [{ total, dni_cliente, id_empleado, id_gaveta }]);
        const id_pedido = order.insertId;
        await db.query(
            'insert into detalle_pedido (id_pedido, id_producto, cantidad, sub_total) values ?',
            [lines.map((line) => [id_pedido, line.id_producto, line.cantidad, line.sub_total])]
        );
        for (const line of lines) {
            await db.query('update producto set stock = stock - ? where id_producto = ?', [line.cantidad, line.id_producto]);
        }

        const [last] = await db.query(
            "select max(cast(substring_index(codigo_comprobante, '-', -1) as unsigned)) as ultimo from comprobante where codigo_comprobante like ? for update",
            [RECEIPT_PREFIX + '%']
        );
        const codigo_comprobante = RECEIPT_PREFIX + String(Number(last[0].ultimo || 0) + 1).padStart(8, '0');
        await db.query('insert into comprobante set ?', [{ codigo_comprobante, id_pedido }]);

        await adjustDrawer(db, id_gaveta, total);

        const [saved] = await db.query('select fecha_hora from pedido where id_pedido = ?', [id_pedido]);
        return {
            message: "Venta registrada",
            id_pedido,
            codigo_comprobante,
            fecha_hora: saved[0].fecha_hora,
            dni_cliente,
            id_empleado,
            id_gaveta: Number(id_gaveta),
            total,
            productos: lines
        };
    });
};

module.exports = controller;
