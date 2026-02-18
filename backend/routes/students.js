const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    const [students] = await db.query('SELECT * FROM students WHERE school_id = ? ORDER BY id DESC', [schoolId]);
    res.render('students/index', { title: 'จัดการนักเรียน', page: 'students', students, user: req.session.user });
  } catch (error) {
    res.render('students/index', { title: 'จัดการนักเรียน', page: 'students', students: [], user: req.session.user, error: error.message });
  }
});

router.get('/add', (req, res) => {
  res.render('students/form', { title: 'เพิ่มนักเรียน', page: 'students', student: null, user: req.session.user });
});

router.post('/add', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    const { firstName, lastName, email, phone, classId, gender } = req.body;
    const [result] = await db.query('SELECT COUNT(*) as count FROM students WHERE school_id = ?', [schoolId]);
    const studentId = `STD${String(result[0].count + 1).padStart(3, '0')}`;
    
    await db.query(
      'INSERT INTO students (school_id, studentId, firstName, lastName, email, phone, classId, gender, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [schoolId, studentId, firstName, lastName, email, phone, classId || null, gender, 'active']
    );
    res.redirect('/app/students?success=เพิ่มนักเรียนสำเร็จ');
  } catch (error) {
    res.redirect('/app/students?error=' + error.message);
  }
});

router.get('/edit/:id', async (req, res) => {
  try {
    const [students] = await db.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
    res.render('students/form', { title: 'แก้ไขนักเรียน', page: 'students', student: students[0] });
  } catch (error) {
    res.redirect('/students?error=' + error.message);
  }
});

router.post('/edit/:id', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, classId, gender, status } = req.body;
    await db.query(
      'UPDATE students SET firstName=?, lastName=?, email=?, phone=?, classId=?, gender=?, status=? WHERE id=?',
      [firstName, lastName, email, phone, classId || null, gender, status, req.params.id]
    );
    res.redirect('/students?success=แก้ไขข้อมูลสำเร็จ');
  } catch (error) {
    res.redirect('/students?error=' + error.message);
  }
});

router.get('/delete/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM students WHERE id = ?', [req.params.id]);
    res.redirect('/students?success=ลบนักเรียนสำเร็จ');
  } catch (error) {
    res.redirect('/students?error=' + error.message);
  }
});

module.exports = router;
