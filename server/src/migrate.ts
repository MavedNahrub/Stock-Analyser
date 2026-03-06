import pool from './db.js';

export async function runMigrations() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS stock_cache (
        symbol VARCHAR(20) PRIMARY KEY,
        data JSONB NOT NULL,
        fetched_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS portfolio (
        id SERIAL PRIMARY KEY,
        symbol VARCHAR(20) NOT NULL,
        company_name VARCHAR(255),
        quantity DECIMAL NOT NULL,
        purchase_price DECIMAL NOT NULL,
        added_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS alerts (
        id SERIAL PRIMARY KEY,
        symbol VARCHAR(20) NOT NULL,
        target_price DECIMAL NOT NULL,
        direction VARCHAR(5) NOT NULL CHECK (direction IN ('above', 'below')),
        is_triggered BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(50) PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);

    console.log('✅ Database migrations completed successfully');
  } catch (err) {
    console.error('❌ Migration error:', err);
    throw err;
  } finally {
    client.release();
  }
}
