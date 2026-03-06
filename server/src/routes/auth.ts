import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_production';

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password || password.length < 6) {
        return res.status(400).json({ error: 'Valid email and password (min 6 chars) are required' });
    }

    let client;
    try {
        client = await pool.connect();

        // Check if user exists
        const userCheck = await client.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password and insert
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const result = await client.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
            [email, passwordHash]
        );

        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ user, token });
    } catch (err: any) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Failed to register user' });
    } finally {
        if (client) client.release();
    }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    let client;
    try {
        client = await pool.connect();

        const result = await client.query('SELECT id, email, password_hash FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ user: { id: user.id, email: user.email }, token });
    } catch (err: any) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Failed to login' });
    } finally {
        if (client) client.release();
    }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query('SELECT id, email, created_at FROM users WHERE id = $1', [req.user?.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err: any) {
        console.error('Get user error:', err);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    } finally {
        if (client) client.release();
    }
});

export default router;
