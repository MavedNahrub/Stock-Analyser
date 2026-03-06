import { Router, Response } from 'express';
import pool from '../db.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/portfolio — list all holdings for the logged-in user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT * FROM portfolio WHERE user_id = $1 ORDER BY added_at DESC',
            [req.user?.id]
        );
        return res.json(result.rows);
    } catch (err: any) {
        console.error('Portfolio fetch error:', err.message);
        return res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
});

// POST /api/portfolio — add a holding for the logged-in user
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    const { symbol, company_name, quantity, purchase_price } = req.body;

    if (!symbol || !quantity || !purchase_price) {
        return res.status(400).json({ error: 'symbol, quantity, and purchase_price are required' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO portfolio (user_id, symbol, company_name, quantity, purchase_price)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [req.user?.id, symbol.toUpperCase(), company_name || symbol.toUpperCase(), quantity, purchase_price]
        );
        return res.status(201).json(result.rows[0]);
    } catch (err: any) {
        console.error('Portfolio add error:', err.message);
        return res.status(500).json({ error: 'Failed to add to portfolio' });
    }
});

// DELETE /api/portfolio/:id — remove a holding
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM portfolio WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, req.user?.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Entry not found or unauthorized' });
        }
        return res.json({ deleted: result.rows[0] });
    } catch (err: any) {
        console.error('Portfolio delete error:', err.message);
        return res.status(500).json({ error: 'Failed to delete from portfolio' });
    }
});

export default router;
