const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();

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

// Routes
app.use('/', require('./routes/index'));
app.use('/students', require('./routes/students'));
app.use('/teachers', require('./routes/teachers'));
app.use('/classes', require('./routes/classes'));
app.use('/subjects', require('./routes/subjects'));
app.use('/attendance', require('./routes/attendance'));
app.use('/grades', require('./routes/grades'));
app.use('/api', require('./routes/api'));

// 404 handler
app.use((req, res) => {
  res.status(404).render('404');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
