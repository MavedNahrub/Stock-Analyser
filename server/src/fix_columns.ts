import pg from 'pg';

const pool = new pg.Pool({
    connectionString: 'postgresql://postgres:1290@localhost:5432/stockpulse',
});

async function main() {
    try {
        await pool.query('ALTER TABLE stock_cache ALTER COLUMN symbol TYPE VARCHAR(20)');
        console.log('✅ stock_cache.symbol widened to VARCHAR(20)');
        await pool.query('ALTER TABLE portfolio ALTER COLUMN symbol TYPE VARCHAR(20)');
        console.log('✅ portfolio.symbol widened to VARCHAR(20)');
        await pool.query('ALTER TABLE alerts ALTER COLUMN symbol TYPE VARCHAR(20)');
        console.log('✅ alerts.symbol widened to VARCHAR(20)');
    } catch (err: any) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

main();
