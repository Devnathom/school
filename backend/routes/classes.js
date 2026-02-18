const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    const [classes] = await db.query('SELECT * FROM classes WHERE school_id = ? ORDER BY id DESC', [schoolId]);
    res.render('classes/index', { title: 'จัดการชั้นเรียน', page: 'classes', classes, user: req.session.user, success: req.query.success || null, error: req.query.error || null });
  } catch (error) {
    res.render('classes/index', { title: 'จัดการชั้นเรียน', page: 'classes', classes: [], user: req.session.user, success: null, error: error.message });
  }
});

router.post('/add', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    const { name, level, section, room, capacity } = req.body;
    await db.query(
      'INSERT INTO classes (school_id, name, level, section, room, capacity, year) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [schoolId, name, level, section, room, capacity || 40, 2567]
    );
    res.redirect('/app/classes?success=เพิ่มชั้นเรียนสำเร็จ');
  } catch (error) {
    res.redirect('/app/classes?error=' + error.message);
  }
});

router.get('/delete/:id', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    await db.query('DELETE FROM classes WHERE id = ? AND school_id = ?', [req.params.id, schoolId]);
    res.redirect('/app/classes?success=ลบชั้นเรียนสำเร็จ');
  } catch (error) {
    res.redirect('/app/classes?error=' + error.message);
  }
});

module.exports = router;
