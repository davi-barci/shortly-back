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

export async function signIn (req, res) {
    const { email, password } = req.body;

    try{
        const user = await db.query(`SELECT * FROM users WHERE email=$1`, [email]);

        if (!user.rowCount) return res.status(401).send("E-mail não cadastrado");
        if (!bcrypt.compareSync(password, user.rows[0].password)) return res.status(401).send("Senha incorreta");
          
        const token = uuid();

        await db.query(
          `INSERT INTO sessions ("userId",token)
                VALUES ($1,$2)`,
          [user.rows[0].id, token]
        );
        res.status(200).send({ token: token });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

