const { HttpError, isPositiveInteger, runTransaction } = require('../utils/transaction');
const { updateOrderTotal } = require('../utils/drawer');

const controller = {};

const lockProduct = async (db, productId) => {
    const [products] = await db.query(
        'select nombre, precio_venta, stock from producto where id_producto = ? for update',
        [productId]
    );
    if (products.length === 0) throw new HttpError(404, "Producto no encontrado");
    return { ...products[0], precio_venta: Number(products[0].precio_venta) };
};

const lockDetail = async (db, orderId, productId) => {
    const [details] = await db.query(
        'select cantidad, sub_total from detalle_pedido where id_pedido = ? and id_producto = ? for update',
        [orderId, productId]
    );
    if (details.length === 0) throw new HttpError(404, "Registro no encontrado");
    return details[0];
};


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

// Insertar un registro: descuenta el stock y recalcula el total del pedido y su gaveta
controller.save = (req, res) => {
    const { id_pedido, id_producto, cantidad } = req.body;
    if (!id_pedido || !id_producto || !isPositiveInteger(cantidad)) {
        return res.status(400).json({ message: "Debe enviar id_pedido, id_producto y una cantidad entera mayor que 0" });
    }
    const quantity = Number(cantidad);

    runTransaction(req, res, async (db) => {
        const product = await lockProduct(db, id_producto);
        if (quantity > product.stock) {
            throw new HttpError(400, `Stock insuficiente: solo hay ${product.stock} unidades de ${product.nombre}`);
        }
        const sub_total = (product.precio_venta * quantity).toFixed(2);
        await db.query('insert into detalle_pedido set ?', [{ id_pedido, id_producto, cantidad: quantity, sub_total }]);
        await db.query('update producto set stock = stock - ? where id_producto = ?', [quantity, id_producto]);
        await updateOrderTotal(db, id_pedido);
        return { message: "Registro Guardado", sub_total };
    });
};

// Actualizar la cantidad: ajusta el stock por la diferencia y conserva el precio unitario original
controller.update = (req, res) => {
    const { orderId, productId } = req.params;
    const { cantidad } = req.body;
    if (!isPositiveInteger(cantidad)) {
        return res.status(400).json({ message: "Debe enviar una cantidad entera mayor que 0" });
    }
    const quantity = Number(cantidad);

    runTransaction(req, res, async (db) => {
        const detail = await lockDetail(db, orderId, productId);
        const product = await lockProduct(db, productId);
        const difference = quantity - detail.cantidad;
        if (difference > product.stock) {
            throw new HttpError(400, `Stock insuficiente: solo hay ${product.stock} unidades más de ${product.nombre}`);
        }
        const unitPrice = Number(detail.sub_total) / detail.cantidad;
        const sub_total = (unitPrice * quantity).toFixed(2);
        await db.query(
            'update detalle_pedido set cantidad = ?, sub_total = ? where id_pedido = ? and id_producto = ?',
            [quantity, sub_total, orderId, productId]
        );
        await db.query('update producto set stock = stock - ? where id_producto = ?', [difference, productId]);
        await updateOrderTotal(db, orderId);
        return { message: "Registro Actualizado", sub_total };
    });
};

// Eliminar un registro: devuelve el stock y recalcula el total del pedido y su gaveta
controller.delete = (req, res) => {
    const { orderId, productId } = req.params;

    runTransaction(req, res, async (db) => {
        const detail = await lockDetail(db, orderId, productId);
        await db.query('delete from detalle_pedido where id_pedido = ? and id_producto = ?', [orderId, productId]);
        await db.query('update producto set stock = stock + ? where id_producto = ?', [detail.cantidad, productId]);
        await updateOrderTotal(db, orderId);
        return { message: "Registro Eliminado" };
    });
};

module.exports = controller;
