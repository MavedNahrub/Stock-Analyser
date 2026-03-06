import pool from './db.js';
import bcrypt from 'bcryptjs';

async function testRegistration() {
    let client;
    try {
        console.log("Connecting to DB...");
        client = await pool.connect();
        console.log("Connected!");

        const email = 'test_debug@gmail.com';
        const password = 'password123';

        console.log("Checking if user exists...");
        const userCheck = await client.query('SELECT id FROM users WHERE email = $1', [email]);

        console.log("Generating salt...");
        const salt = await bcrypt.genSalt(10);
        console.log("Hashing password...");
        const passwordHash = await bcrypt.hash(password, salt);

        console.log("Inserting user...");
        const result = await client.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
            [email, passwordHash]
        );

        console.log("Success:", result.rows[0]);
    } catch (e: any) {
        console.error("DEBUG ERROR:", e.message);
    } finally {
        if (client) client.release();
    }
}

testRegistration();
