const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    const [subjects] = await db.query('SELECT * FROM subjects WHERE school_id = ? ORDER BY id DESC', [schoolId]);
    res.render('subjects/index', { title: 'จัดการรายวิชา', page: 'subjects', subjects, user: req.session.user, success: req.query.success || null, error: req.query.error || null });
  } catch (error) {
    res.render('subjects/index', { title: 'จัดการรายวิชา', page: 'subjects', subjects: [], user: req.session.user, success: null, error: error.message });
  }
});

router.post('/add', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    const { code, name, department, credits, description } = req.body;
    await db.query(
      'INSERT INTO subjects (school_id, code, name, department, credits, description) VALUES (?, ?, ?, ?, ?, ?)',
      [schoolId, code, name, department, credits || 1, description]
    );
    res.redirect('/app/subjects?success=เพิ่มรายวิชาสำเร็จ');
  } catch (error) {
    res.redirect('/app/subjects?error=' + error.message);
  }
});

router.get('/delete/:id', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    await db.query('DELETE FROM subjects WHERE id = ? AND school_id = ?', [req.params.id, schoolId]);
    res.redirect('/app/subjects?success=ลบรายวิชาสำเร็จ');
  } catch (error) {
    res.redirect('/app/subjects?error=' + error.message);
  }
});

module.exports = router;
