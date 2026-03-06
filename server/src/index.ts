import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { runMigrations } from './migrate.js';
import stocksRouter from './routes/stocks.js';
import portfolioRouter from './routes/portfolio.js';
import alertsRouter from './routes/alerts.js';
import searchRouter from './routes/search.js';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
    credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/stocks', stocksRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/search', searchRouter);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
async function start() {
    try {
        console.log('🔄 Running database migrations...');
        await runMigrations();

        app.listen(PORT, () => {
            console.log(`🚀 StockPulse server running on http://localhost:${PORT}`);
            console.log(`   Health: http://localhost:${PORT}/api/health`);
            console.log(`   Stocks: http://localhost:${PORT}/api/stocks/:symbol`);
            console.log(`   Portfolio: http://localhost:${PORT}/api/portfolio`);
            console.log(`   Alerts: http://localhost:${PORT}/api/alerts`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
}

start();
