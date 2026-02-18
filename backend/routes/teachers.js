const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    const [teachers] = await db.query('SELECT * FROM teachers WHERE school_id = ? ORDER BY id DESC', [schoolId]);
    res.render('teachers/index', { title: 'จัดการครู', page: 'teachers', teachers, user: req.session.user, success: req.query.success || null, error: req.query.error || null });
  } catch (error) {
    res.render('teachers/index', { title: 'จัดการครู', page: 'teachers', teachers: [], user: req.session.user, success: null, error: error.message });
  }
});

router.get('/add', (req, res) => {
  res.render('teachers/form', { title: 'เพิ่มครู', page: 'teachers', teacher: null, user: req.session.user });
});

router.post('/add', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    const { firstName, lastName, email, phone, department, position } = req.body;
    const [result] = await db.query('SELECT COUNT(*) as count FROM teachers WHERE school_id = ?', [schoolId]);
    const teacherId = `TCH${String(result[0].count + 1).padStart(3, '0')}`;
    
    await db.query(
      'INSERT INTO teachers (school_id, teacherId, firstName, lastName, email, phone, department, position, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [schoolId, teacherId, firstName, lastName, email, phone, department, position, 'active']
    );
    res.redirect('/app/teachers?success=เพิ่มครูสำเร็จ');
  } catch (error) {
    res.redirect('/app/teachers?error=' + error.message);
  }
});

router.get('/delete/:id', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    await db.query('DELETE FROM teachers WHERE id = ? AND school_id = ?', [req.params.id, schoolId]);
    res.redirect('/app/teachers?success=ลบข้อมูลครูสำเร็จ');
  } catch (error) {
    res.redirect('/app/teachers?error=' + error.message);
  }
});

module.exports = router;
