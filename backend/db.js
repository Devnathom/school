const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'u456476753_school',
  password: 'Nathom48140_',
  database: 'u456476753_school',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
