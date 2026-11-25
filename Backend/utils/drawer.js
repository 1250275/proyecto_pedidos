const { HttpError } = require('./transaction');

const round = (value) => Math.round(Number(value) * 100) / 100;

// Suma (o resta, si el monto es negativo) dinero a una caja
const adjustDrawer = async (db, drawerId, amount) => {
    const value = round(amount);
    if (value === 0) return;
    try {
        const [result] = await db.query(
            'update caja set monto_dinero = monto_dinero + ? where id_caja = ?',
            [value, drawerId]
        );
        if (result.affectedRows === 0) throw new HttpError(400, "Caja no encontrada");
    } catch (err) {
        if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
            throw new HttpError(400, `La caja ${drawerId} no tiene suficiente dinero para devolver L ${(-value).toFixed(2)}`);
        }
        throw err;
    }
};

// Recalcula pedido.total con su detalle y mueve la diferencia a la caja del pedido
const updateOrderTotal = async (db, orderId) => {
    const [orders] = await db.query('select total, id_caja from pedido where id_pedido = ? for update', [orderId]);
    if (orders.length === 0) throw new HttpError(404, "Pedido no encontrado");
    const [sums] = await db.query(
        'select coalesce(sum(sub_total), 0) as total from detalle_pedido where id_pedido = ?',
        [orderId]
    );
    const newTotal = round(sums[0].total);
    await db.query('update pedido set total = ? where id_pedido = ?', [newTotal, orderId]);
    await adjustDrawer(db, orders[0].id_caja, newTotal - Number(orders[0].total));
};

module.exports = { round, adjustDrawer, updateOrderTotal };
