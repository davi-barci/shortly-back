import { db } from "../database/database.connection.js";

export async function authValidation(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if(!token) return res.sendStatus(401);

    try {
        const session = await db.query(`SELECT * FROM sessions WHERE token=$1;`, [token]);
        if (!session.rowCount) return res.sendStatus(401);
        res.locals.user = session.rows[0];
        next();
    } catch (err) {
        return res.status(500).send(err.message);
    }
}