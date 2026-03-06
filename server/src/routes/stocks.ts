import { Router } from 'express';
import pool from '../db.js';
import { fetchStockData } from '../services/yahooFinance.js';

const router = Router();

// GET /api/stocks/:symbol — fetch stock data (cached or live from Yahoo Finance)
router.get('/:symbol', async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();

    try {
        // Check cache first (data less than 15 minutes old)
        const cached = await pool.query(
            `SELECT data, fetched_at FROM stock_cache
       WHERE symbol = $1 AND fetched_at > NOW() - INTERVAL '15 minutes'`,
            [symbol]
        );

        if (cached.rows.length > 0) {
            console.log(`📦 Cache hit for ${symbol}`);
            return res.json({
                source: 'cache',
                data: cached.rows[0].data,
                cachedAt: cached.rows[0].fetched_at,
            });
        }

        // Fetch from Yahoo Finance (no API key needed!)
        console.log(`🌐 Fetching live data for ${symbol} from Yahoo Finance...`);
        const stockData = await fetchStockData(symbol);

        // Cache the result (upsert)
        await pool.query(
            `INSERT INTO stock_cache (symbol, data, fetched_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (symbol) DO UPDATE SET data = $2, fetched_at = NOW()`,
            [symbol, JSON.stringify(stockData)]
        );

        return res.json({
            source: 'live',
            data: stockData,
        });
    } catch (err: any) {
        console.error(`Error fetching stock ${symbol}:`, err.message);
        return res.status(500).json({
            error: err.message || 'Failed to fetch stock data',
        });
    }
});

export default router;
