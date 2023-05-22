import { db } from '../database/database.connection.js';
import { nanoid } from 'nanoid';

export async function createShortUrl (req, res) {
    const { url } = req.body;
    const shortUrl = nanoid(8);
    const userId = res.locals.user.id;

    try {
        const insertUrl = await db.query(`
        INSERT INTO urls (url, "shortUrl", "userId") 
        VALUES ($1, $2, $3)`, [url,shortUrl, userId]);
        return res.status(201).send({id: userId, shortUrl: shortUrl});
    } catch (err) {
        return res.status(500).send(err.message);
    }
}