const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const { requireSuperAdmin } = require('../middleware/auth');

// Apply super admin check to all routes
router.use(requireSuperAdmin);

// Dashboard
router.get('/', async (req, res) => {
  try {
    const [[schoolCount]] = await db.query('SELECT COUNT(*) as count FROM schools');
    const [[userCount]] = await db.query('SELECT COUNT(*) as count FROM users');
    const [[studentCount]] = await db.query('SELECT COUNT(*) as count FROM students');
    const [[teacherCount]] = await db.query('SELECT COUNT(*) as count FROM teachers');
    
    const [recentSchools] = await db.query(`
      SELECT s.*, p.name as plan_name, p.slug as plan_slug 
      FROM schools s 
      LEFT JOIN plans p ON s.plan_id = p.id 
      ORDER BY s.created_at DESC LIMIT 5
    `);
    
    const [planStats] = await db.query(`
      SELECT p.*, COUNT(s.id) as school_count 
      FROM plans p 
      LEFT JOIN schools s ON p.id = s.plan_id 
      GROUP BY p.id
    `);
    
    res.render('admin/dashboard', {
      title: 'Super Admin Dashboard',
      page: 'dashboard',
      user: req.session.user,
      stats: {
        schools: schoolCount.count,
        users: userCount.count,
        students: studentCount.count,
        teachers: teacherCount.count
      },
      recentSchools,
      planStats,
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (error) {
    res.render('admin/dashboard', {
      title: 'Super Admin Dashboard',
      page: 'dashboard',
      user: req.session.user,
      stats: { schools: 0, users: 0, students: 0, teachers: 0 },
      recentSchools: [],
      planStats: [],
      success: null,
      error: error.message
    });
  }
});

// Schools List
router.get('/schools', async (req, res) => {
  try {
    const [schools] = await db.query(`
      SELECT s.*, p.name as plan_name, p.slug as plan_slug,
        (SELECT COUNT(*) FROM students WHERE school_id = s.id) as student_count,
        (SELECT COUNT(*) FROM teachers WHERE school_id = s.id) as teacher_count
      FROM schools s 
      LEFT JOIN plans p ON s.plan_id = p.id 
      ORDER BY s.created_at DESC
    `);
    const [plans] = await db.query('SELECT * FROM plans WHERE is_active = TRUE');
    
    res.render('admin/schools', {
      title: 'จัดการโรงเรียน',
      page: 'schools',
      user: req.session.user,
      schools,
      plans,
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (error) {
    res.redirect('/admin?error=' + error.message);
  }
});

// Add School
router.post('/schools/add', async (req, res) => {
  try {
    const { name, slug, email, phone, plan_id, status, admin_name, admin_password } = req.body;
    
    // Create school
    const [result] = await db.query(
      'INSERT INTO schools (name, slug, email, phone, plan_id, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, slug, email, phone, plan_id || 1, status || 'active']
    );
    
    // Create admin user
    const hashedPassword = await bcrypt.hash(admin_password, 10);
    const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const [existingUsername] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    const finalUsername = existingUsername.length > 0 ? username + result.insertId : username;
    
    await db.query(
      'INSERT INTO users (school_id, username, email, password, name, role) VALUES (?, ?, ?, ?, ?, ?)',
      [result.insertId, finalUsername, email, hashedPassword, admin_name, 'school_admin']
    );
    
    res.redirect('/admin/schools?success=เพิ่มโรงเรียนสำเร็จ');
  } catch (error) {
    res.redirect('/admin/schools?error=' + error.message);
  }
});

// School Detail
router.get('/schools/:id', async (req, res) => {
  try {
    const [[school]] = await db.query(`
      SELECT s.*, p.name as plan_name, p.slug as plan_slug
      FROM schools s
      LEFT JOIN plans p ON s.plan_id = p.id
      WHERE s.id = ?
    `, [req.params.id]);
    if (!school) return res.redirect('/admin/schools?error=ไม่พบโรงเรียน');
    
    const [users] = await db.query('SELECT * FROM users WHERE school_id = ?', [req.params.id]);
    const [[studentCount]] = await db.query('SELECT COUNT(*) as count FROM students WHERE school_id = ?', [req.params.id]);
    const [[teacherCount]] = await db.query('SELECT COUNT(*) as count FROM teachers WHERE school_id = ?', [req.params.id]);
    const [[classCount]] = await db.query('SELECT COUNT(*) as count FROM classes WHERE school_id = ?', [req.params.id]);
    
    res.render('admin/school-detail', {
      title: school.name,
      page: 'schools',
      user: req.session.user,
      school,
      schoolUsers: users,
      stats: { students: studentCount.count, teachers: teacherCount.count, classes: classCount.count },
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (error) {
    res.redirect('/admin/schools?error=' + error.message);
  }
});

// Change School Status
router.get('/schools/:id/status/:status', async (req, res) => {
  try {
    await db.query('UPDATE schools SET status = ? WHERE id = ?', [req.params.status, req.params.id]);
    res.redirect('/admin/schools?success=เปลี่ยนสถานะสำเร็จ');
  } catch (error) {
    res.redirect('/admin/schools?error=' + error.message);
  }
});

// Delete School
router.get('/schools/:id/delete', async (req, res) => {
  try {
    const schoolId = req.params.id;
    await db.query('DELETE FROM grades WHERE school_id = ?', [schoolId]);
    await db.query('DELETE FROM attendance WHERE school_id = ?', [schoolId]);
    await db.query('DELETE FROM students WHERE school_id = ?', [schoolId]);
    await db.query('DELETE FROM teachers WHERE school_id = ?', [schoolId]);
    await db.query('DELETE FROM classes WHERE school_id = ?', [schoolId]);
    await db.query('DELETE FROM subjects WHERE school_id = ?', [schoolId]);
    await db.query('DELETE FROM users WHERE school_id = ?', [schoolId]);
    await db.query('DELETE FROM schools WHERE id = ?', [schoolId]);
    res.redirect('/admin/schools?success=ลบโรงเรียนสำเร็จ');
  } catch (error) {
    res.redirect('/admin/schools?error=' + error.message);
  }
});

// Plans
router.get('/plans', async (req, res) => {
  try {
    const [plans] = await db.query(`
      SELECT p.*, COUNT(s.id) as school_count 
      FROM plans p 
      LEFT JOIN schools s ON p.id = s.plan_id 
      GROUP BY p.id
    `);
    
    res.render('admin/plans', {
      title: 'จัดการแพ็กเกจ',
      page: 'plans',
      user: req.session.user,
      plans,
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (error) {
    res.redirect('/admin?error=' + error.message);
  }
});

// Update Plan
router.post('/plans/update', async (req, res) => {
  try {
    const { id, name, price, max_students, max_teachers, max_classes } = req.body;
    await db.query(
      'UPDATE plans SET name = ?, price = ?, max_students = ?, max_teachers = ?, max_classes = ? WHERE id = ?',
      [name, price, max_students, max_teachers, max_classes, id]
    );
    res.redirect('/admin/plans?success=อัปเดตแพ็กเกจสำเร็จ');
  } catch (error) {
    res.redirect('/admin/plans?error=' + error.message);
  }
});

// Users
router.get('/users', async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT u.*, s.name as school_name 
      FROM users u 
      LEFT JOIN schools s ON u.school_id = s.id 
      ORDER BY u.created_at DESC
    `);
    
    res.render('admin/users', {
      title: 'จัดการผู้ใช้',
      page: 'users',
      user: req.session.user,
      users,
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (error) {
    res.redirect('/admin?error=' + error.message);
  }
});

module.exports = router;
