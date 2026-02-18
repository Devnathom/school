const express = require('express');
const router = express.Router();

// Dashboard
router.get('/', (req, res) => {
  res.render('dashboard', {
    title: 'แดชบอร์ด',
    page: 'dashboard',
    success: req.query.success || null,
    error: req.query.error || null
  });
});

// Login
router.get('/login', (req, res) => {
  res.render('login', { title: 'เข้าสู่ระบบ' });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@school.com' && password === 'admin123') {
    req.session.user = { email, name: 'ผู้ดูแลระบบ', role: 'admin' };
    res.redirect('/');
  } else {
    res.render('login', { title: 'เข้าสู่ระบบ', error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
