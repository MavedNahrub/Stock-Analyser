import pg from 'pg';

const pool = new pg.Pool({
    connectionString: 'postgresql://postgres:1290@localhost:5432/stockpulse',
    connectionTimeoutMillis: 5000,
});

async function main() {
    try {
        const client = await pool.connect();
        console.log('✅ Database connection successful!');

        // Check if users table exists
        const tables = await client.query(`
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);
        console.log('Tables:', tables.rows.map(r => r.table_name));

        client.release();
    } catch (err: any) {
        console.error('❌ Database connection FAILED:', err.message);
    } finally {
        await pool.end();
    }
}

main();
