import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || '208.167.233.53',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'comic_db',
  user: process.env.DB_USER || 'comic',
  password: process.env.DB_PASSWORD || 'comic123456',
});

export default pool;
