const { HttpError } = require('./transaction');

const round = (value) => Math.round(Number(value) * 100) / 100;

// Suma (o resta, si el monto es negativo) dinero a una gaveta
const adjustDrawer = async (db, drawerId, amount) => {
    const value = round(amount);
    if (value === 0) return;
    try {
        const [result] = await db.query(
            'update gaveta set monto_dinero = monto_dinero + ? where id_gaveta = ?',
            [value, drawerId]
        );
        if (result.affectedRows === 0) throw new HttpError(400, "Gaveta no encontrada");
    } catch (err) {
        if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
            throw new HttpError(400, `La gaveta ${drawerId} no tiene suficiente dinero para devolver L ${(-value).toFixed(2)}`);
        }
        throw err;
    }
};

// Recalcula pedido.total con su detalle y mueve la diferencia a la gaveta del pedido
const updateOrderTotal = async (db, orderId) => {
    const [orders] = await db.query('select total, id_gaveta from pedido where id_pedido = ? for update', [orderId]);
    if (orders.length === 0) throw new HttpError(404, "Pedido no encontrado");
    const [sums] = await db.query(
        'select coalesce(sum(sub_total), 0) as total from detalle_pedido where id_pedido = ?',
        [orderId]
    );
    const newTotal = round(sums[0].total);
    await db.query('update pedido set total = ? where id_pedido = ?', [newTotal, orderId]);
    await adjustDrawer(db, orders[0].id_gaveta, newTotal - Number(orders[0].total));
};

module.exports = { round, adjustDrawer, updateOrderTotal };
