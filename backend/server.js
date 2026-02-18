const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();
const { requireLogin } = require('./middleware/auth');

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'school-secret-key',
  resave: false,
  saveUninitialized: false
}));

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SchoolMS Server running on port ${PORT}`);
});

module.exports = app;
