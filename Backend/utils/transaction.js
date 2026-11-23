class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

const isPositiveInteger = (value) => Number.isInteger(Number(value)) && Number(value) > 0;

// Ejecuta las consultas en una transacción: si algo falla no se guarda nada
const runTransaction = (req, res, work) => {
    req.getConnection(async (error, conn) => {
        if (error) return res.status(500).json(error);
        const db = conn.promise();
        try {
            await db.beginTransaction();
            const response = await work(db);
            await db.commit();
            res.json(response);
        } catch (err) {
            await db.rollback().catch(() => {});
            if (err instanceof HttpError) return res.status(err.status).json({ message: err.message });
            res.status(500).json(err);
        }
    });
};

module.exports = { HttpError, isPositiveInteger, runTransaction };
