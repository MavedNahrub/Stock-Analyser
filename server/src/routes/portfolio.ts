import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// GET /api/portfolio — list all holdings
router.get('/', async (_req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM portfolio ORDER BY added_at DESC'
        );
        return res.json(result.rows);
    } catch (err: any) {
        console.error('Portfolio fetch error:', err.message);
        return res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
});

// POST /api/portfolio — add a holding
router.post('/', async (req, res) => {
    const { symbol, company_name, quantity, purchase_price } = req.body;

    if (!symbol || !quantity || !purchase_price) {
        return res.status(400).json({ error: 'symbol, quantity, and purchase_price are required' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO portfolio (symbol, company_name, quantity, purchase_price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
            [symbol.toUpperCase(), company_name || symbol.toUpperCase(), quantity, purchase_price]
        );
        return res.status(201).json(result.rows[0]);
    } catch (err: any) {
        console.error('Portfolio add error:', err.message);
        return res.status(500).json({ error: 'Failed to add to portfolio' });
    }
});

// DELETE /api/portfolio/:id — remove a holding
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM portfolio WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Entry not found' });
        }
        return res.json({ deleted: result.rows[0] });
    } catch (err: any) {
        console.error('Portfolio delete error:', err.message);
        return res.status(500).json({ error: 'Failed to delete from portfolio' });
    }
});

export default router;
