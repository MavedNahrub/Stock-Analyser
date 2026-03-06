import { Router, Response } from 'express';
import pool from '../db.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/alerts — list all alerts for the user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT * FROM alerts WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user?.id]
        );
        return res.json(result.rows);
    } catch (err: any) {
        console.error('Alerts fetch error:', err.message);
        return res.status(500).json({ error: 'Failed to fetch alerts' });
    }
});

// POST /api/alerts — create an alert for the user
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    const { symbol, target_price, direction } = req.body;

    if (!symbol || !target_price || !direction) {
        return res.status(400).json({ error: 'symbol, target_price, and direction are required' });
    }

    if (!['above', 'below'].includes(direction)) {
        return res.status(400).json({ error: 'direction must be "above" or "below"' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO alerts (user_id, symbol, target_price, direction)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [req.user?.id, symbol.toUpperCase(), target_price, direction]
        );
        return res.status(201).json(result.rows[0]);
    } catch (err: any) {
        console.error('Alert create error:', err.message);
        return res.status(500).json({ error: 'Failed to create alert' });
    }
});

// DELETE /api/alerts/:id — delete an alert
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM alerts WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, req.user?.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Alert not found or unauthorized' });
        }
        return res.json({ deleted: result.rows[0] });
    } catch (err: any) {
        console.error('Alert delete error:', err.message);
        return res.status(500).json({ error: 'Failed to delete alert' });
    }
});

// PATCH /api/alerts/:id/trigger — mark alert as triggered
router.patch('/:id/trigger', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'UPDATE alerts SET is_triggered = TRUE WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Alert not found' });
        }
        return res.json(result.rows[0]);
    } catch (err: any) {
        console.error('Alert trigger error:', err.message);
        return res.status(500).json({ error: 'Failed to trigger alert' });
    }
});

export default router;
