import { db } from '../database/database.connection.js';
import { nanoid } from 'nanoid';

export async function createShortUrl (req, res) {
    const { url } = req.body;
    const shortUrl = nanoid(8);
    const userId = res.locals.user.id;

    try {
        await db.query(`INSERT INTO urls (url, "shortUrl", "userId") 
        VALUES ($1, $2, $3)`, [url,shortUrl, userId]);
        return res.status(201).send({id: userId, shortUrl: shortUrl});
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function getUrlById (req, res) {
    const { id } = req.params;

    try {
        const url = await db.query(`SELECT * FROM urls WHERE id=$1`, [id]);
        if (!url.rowCount) return res.sendStatus(404);
        return res.status(200).send({
            id: url.rows[0].id,
            shortUrl: url.rows[0].shortUrl,
            url: url.rows[0].url,
        });
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function openUrl (req, res) {
    const { shortUrl } = req.params;

    try {
        const url = await db.query(`UPDATE urls
        SET "visitCount" = "visitCount" + 1
        WHERE "shortUrl" = $1
        RETURNING *;
        `, [shortUrl]);
        if (!url.rowCount) return res.sendStatus(404);
        return res.redirect(url.rows[0].url);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

