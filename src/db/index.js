const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/miniblog';

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL environment variable is not set. Using fallback default connection string. Create a .env file based on .env.example if needed.');
}

const pool = new Pool({
  connectionString,
});

pool.on('error', (err) => {
  console.error('Postgres pool error', err);
  process.exit(1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
