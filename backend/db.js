const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

if (process.env.DATABASE_URL) {
  pool = mysql.createPool(process.env.DATABASE_URL);
} else {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'u456476753_school',
    password: process.env.DB_PASS || 'Nathom48140_',
    database: process.env.DB_NAME || 'u456476753_school',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

module.exports = pool;
