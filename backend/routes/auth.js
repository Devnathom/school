const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');

// Landing Page
router.get('/', (req, res) => {
  if (req.session.user) {
    if (req.session.user.role === 'super_admin') {
      return res.redirect('/admin');
    }
    return res.redirect('/app');
  }
  res.render('landing');
});

// Redirect old /dashboard to new location
router.get('/dashboard', (req, res) => {
  if (req.session.user) {
    if (req.session.user.role === 'super_admin') {
      return res.redirect('/admin');
    }
    return res.redirect('/app');
  }
  res.redirect('/login');
});

// Register Page
router.get('/register', (req, res) => {
  const plan = req.query.plan || 'free';
  res.render('register', { plan, error: null, success: null });
});

// Register POST
router.post('/register', async (req, res) => {
  try {
    const { schoolName, schoolSlug, adminName, email, phone, password, plan } = req.body;
    
    // Check if slug exists
    const [existing] = await db.query('SELECT id FROM schools WHERE slug = ?', [schoolSlug]);
    if (existing.length > 0) {
      return res.render('register', { plan, error: 'URL โรงเรียนนี้ถูกใช้งานแล้ว', success: null });
    }
    
    // Check if email exists
    const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.render('register', { plan, error: 'อีเมลนี้ถูกใช้งานแล้ว', success: null });
    }
    
    // Get plan ID
    const [plans] = await db.query('SELECT id FROM plans WHERE slug = ?', [plan || 'free']);
    const planId = plans.length > 0 ? plans[0].id : 1;
    
    // Create school
    const [schoolResult] = await db.query(
      'INSERT INTO schools (name, slug, email, phone, plan_id, status) VALUES (?, ?, ?, ?, ?, ?)',
      [schoolName, schoolSlug, email, phone, planId, 'active']
    );
    const schoolId = schoolResult.insertId;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate username from email prefix
    const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Check username uniqueness
    const [existingUsername] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    const finalUsername = existingUsername.length > 0 ? username + schoolId : username;
    
    // Create admin user
    await db.query(
      'INSERT INTO users (school_id, username, email, password, name, role) VALUES (?, ?, ?, ?, ?, ?)',
      [schoolId, finalUsername, email, hashedPassword, adminName, 'school_admin']
    );
    
    res.render('register', { plan, error: null, success: 'สมัครใช้งานสำเร็จ! กรุณาเข้าสู่ระบบ' });
  } catch (error) {
    console.error('Register error:', error);
    res.render('register', { plan: req.body.plan || 'free', error: 'เกิดข้อผิดพลาด: ' + error.message, success: null });
  }
});

// Login Page
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/app');
  }
  res.render('login', { title: 'เข้าสู่ระบบ', error: null });
});

// Login POST
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const [users] = await db.query(
      `SELECT u.*, s.name as school_name, s.slug as school_slug, s.status as school_status 
       FROM users u 
       LEFT JOIN schools s ON u.school_id = s.id 
       WHERE u.username = ? AND u.is_active = TRUE`,
      [username]
    );
    
    if (users.length === 0) {
      return res.render('login', { title: 'เข้าสู่ระบบ', error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }
    
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.render('login', { title: 'เข้าสู่ระบบ', error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }
    
    // Check school status
    if (user.school_id && user.school_status !== 'active') {
      return res.render('login', { title: 'เข้าสู่ระบบ', error: 'โรงเรียนของคุณถูกระงับการใช้งาน' });
    }
    
    // Update last login
    await db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
    
    // Regenerate session to prevent session fixation
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      school_id: user.school_id,
      school_name: user.school_name,
      school_slug: user.school_slug
    };
    const redirectUrl = user.role === 'super_admin' ? '/admin' : '/app';
    
    req.session.regenerate(function(err) {
      if (err) {
        console.error('Session regenerate error:', err);
      }
      req.session.user = userData;
      req.session.save(function(err) {
        if (err) {
          console.error('Session save error:', err);
        }
        res.redirect(redirectUrl);
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { title: 'เข้าสู่ระบบ', error: 'เกิดข้อผิดพลาด' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(function(err) {
    if (err) console.error('Logout error:', err);
    res.clearCookie('schoolms_sid');
    res.redirect('/');
  });
});

module.exports = router;
