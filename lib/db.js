const { Pool } = require('pg');

// Without DATABASE_URL, pg would silently fall back to PGHOST/localhost defaults and try an
// unrelated local database. Instead, fail fast: callers already catch and log query errors.
const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : {
      query: () => Promise.reject(new Error('Database not configured (DATABASE_URL is not set)')),
      end: () => Promise.resolve(),
    };

module.exports = pool;
