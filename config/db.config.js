// Load environment variables from .env file
require('dotenv').config();

const { Pool } = require('pg');


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err.stack);
  } else {
    console.log('✅ Database connected successfully at', res.rows[0].now);
  }
});

// Export the pool to be used by our models/controllers
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool: pool, 
};
