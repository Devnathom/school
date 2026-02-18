const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [teachers] = await db.query('SELECT * FROM teachers ORDER BY id DESC');
    res.render('teachers/index', { title: 'จัดการครู', page: 'teachers', teachers });
  } catch (error) {
    res.render('teachers/index', { title: 'จัดการครู', page: 'teachers', teachers: [], error: error.message });
  }
});

router.get('/add', (req, res) => {
  res.render('teachers/form', { title: 'เพิ่มครู', page: 'teachers', teacher: null });
});

router.post('/add', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, department, position } = req.body;
    const [result] = await db.query('SELECT COUNT(*) as count FROM teachers');
    const teacherId = `TCH${String(result[0].count + 1).padStart(3, '0')}`;
    
    await db.query(
      'INSERT INTO teachers (teacherId, firstName, lastName, email, phone, department, position, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [teacherId, firstName, lastName, email, phone, department, position, 'active']
    );
    res.redirect('/teachers?success=เพิ่มครูสำเร็จ');
  } catch (error) {
    res.redirect('/teachers?error=' + error.message);
  }
});

router.get('/delete/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM teachers WHERE id = ?', [req.params.id]);
    res.redirect('/teachers?success=ลบข้อมูลครูสำเร็จ');
  } catch (error) {
    res.redirect('/teachers?error=' + error.message);
  }
});

module.exports = router;
