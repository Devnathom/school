const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [subjects] = await db.query('SELECT * FROM subjects ORDER BY id DESC');
    res.render('subjects/index', { title: 'จัดการรายวิชา', page: 'subjects', subjects });
  } catch (error) {
    res.render('subjects/index', { title: 'จัดการรายวิชา', page: 'subjects', subjects: [], error: error.message });
  }
});

router.post('/add', async (req, res) => {
  try {
    const { code, name, department, credits, description } = req.body;
    await db.query(
      'INSERT INTO subjects (code, name, department, credits, description) VALUES (?, ?, ?, ?, ?)',
      [code, name, department, credits || 1, description]
    );
    res.redirect('/subjects?success=เพิ่มรายวิชาสำเร็จ');
  } catch (error) {
    res.redirect('/subjects?error=' + error.message);
  }
});

router.get('/delete/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM subjects WHERE id = ?', [req.params.id]);
    res.redirect('/subjects?success=ลบรายวิชาสำเร็จ');
  } catch (error) {
    res.redirect('/subjects?error=' + error.message);
  }
});

module.exports = router;
