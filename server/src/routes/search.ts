import { Router } from 'express';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();
const router = Router();

// GET /api/search?q=reliance → returns matching stock symbols
router.get('/', async (req, res) => {
    const query = (req.query.q as string || '').trim();

    if (!query || query.length < 1) {
        return res.json([]);
    }

    try {
        const result = await yahooFinance.search(query, { quotesCount: 8, newsCount: 0 });

        const suggestions = (result.quotes || [])
            .filter((q: any) => q.isYahooFinance && (q.quoteType === 'EQUITY' || q.quoteType === 'ETF'))
            .map((q: any) => ({
                symbol: q.symbol,
                name: q.shortname || q.longname || q.symbol,
                exchange: q.exchDisp || q.exchange || '',
                type: q.quoteType,
            }));

        return res.json(suggestions);
    } catch (err: any) {
        console.error('Search error:', err.message);
        return res.status(500).json({ error: 'Search failed' });
    }
});

export default router;
