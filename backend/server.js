const express = require('express');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();

const app = express();
const { requireLogin } = require('./middleware/auth');
const db = require('./db');

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Trust proxy (Hostinger uses reverse proxy)
app.set('trust proxy', 1);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Session Store (persistent - survives server restarts)
const sessionStoreOptions = {
  host: '127.0.0.1',
  user: 'u456476753_school',
  password: 'Nathom48140_',
  database: 'u456476753_school',
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 7 * 24 * 60 * 60 * 1000,
  createDatabaseTable: true,
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
};
const sessionStore = new MySQLStore(sessionStoreOptions);

// Session
app.use(session({
  key: 'schoolms_sid',
  secret: process.env.SESSION_SECRET || 'school-secret-key-2024-secure',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Public Routes (Landing, Login, Register)
app.use('/', require('./routes/auth'));

// Super Admin Routes
app.use('/admin', require('./routes/admin'));

// Protected Routes (require login)
app.use('/app', requireLogin, require('./routes/index'));
app.use('/app/students', requireLogin, require('./routes/students'));
app.use('/app/teachers', requireLogin, require('./routes/teachers'));
app.use('/app/classes', requireLogin, require('./routes/classes'));
app.use('/app/subjects', requireLogin, require('./routes/subjects'));
app.use('/app/attendance', requireLogin, require('./routes/attendance'));
app.use('/app/grades', requireLogin, require('./routes/grades'));
app.use('/app/academic-years', requireLogin, require('./routes/academic-years'));
app.use('/app/rooms', requireLogin, require('./routes/rooms'));
app.use('/app/timetable', requireLogin, require('./routes/timetable'));
app.use('/api', require('./routes/api'));

// 404 handler
app.use((req, res) => {
  res.status(404).render('404');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).render('404');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SchoolMS Server running on port ${PORT}`);
});

module.exports = app;
