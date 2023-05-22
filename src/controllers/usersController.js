import { db } from '../database/database.connection.js';

export async function getUserData(_req, res) {
  const userId = res.locals.user.id;

  try {
    const userResult = await db.query(`SELECT users.name FROM users WHERE users.id = $1`, [userId]);
    const result = await db.query(`
    SELECT users.id, users.name, COALESCE(SUM(urls."visitCount"), 0) AS totalVisits, 
    urls.id AS urlId, urls."shortUrl", urls.url, urls."visitCount" AS urlVisitCount
    FROM users
    LEFT JOIN urls ON users.id = urls."userId"
    WHERE users.id = $1
    GROUP BY users.id, users.name, urls.id, urls."shortUrl", urls.url, urls."visitCount"
    `, [userId]);

    const totalVisitsResult = await db.query(`
    SELECT COALESCE(SUM("visitCount"), 0) AS totalVisits
    FROM urls
    WHERE "userId" = $1
    `, [userId]);
    const totalVisits = totalVisitsResult.rows[0].totalvisits || 0;

    const responseObject = {
      id: userId,
      name: userResult.rows[0].name,
      visitCount: Number(totalVisits),
      shortenedUrls: result.rows.map((row) => ({
        id: row.urlid,
        shortUrl: row.shortUrl,
        url: row.url,
        visitCount: row.urlvisitcount,
      })),
    };

    return res.status(200).send(responseObject);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}
