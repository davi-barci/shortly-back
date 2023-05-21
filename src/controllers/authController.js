import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { db } from '../database/database.connection.js';

export async function signUp (req, res) {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    
    try {
        const user = await db.query(
            `INSERT INTO users (name,email,password)
            SELECT $1,$2,$3
            WHERE NOT EXISTS (
              SELECT 1 FROM users WHERE email = $2
            );`,
            [name, email, hash]
        );
        if (!user.rowCount) return res.status(409).send("E-mail já cadastrado");
        return res.sendStatus(201);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};


