const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [classes] = await db.query('SELECT * FROM classes ORDER BY id DESC');
    res.render('classes/index', { title: 'จัดการชั้นเรียน', page: 'classes', classes });
  } catch (error) {
    res.render('classes/index', { title: 'จัดการชั้นเรียน', page: 'classes', classes: [], error: error.message });
  }
});

router.post('/add', async (req, res) => {
  try {
    const { name, level, section, room, capacity } = req.body;
    await db.query(
      'INSERT INTO classes (name, level, section, room, capacity, year) VALUES (?, ?, ?, ?, ?, ?)',
      [name, level, section, room, capacity || 40, 2567]
    );
    res.redirect('/classes?success=เพิ่มชั้นเรียนสำเร็จ');
  } catch (error) {
    res.redirect('/classes?error=' + error.message);
  }
});

router.get('/delete/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM classes WHERE id = ?', [req.params.id]);
    res.redirect('/classes?success=ลบชั้นเรียนสำเร็จ');
  } catch (error) {
    res.redirect('/classes?error=' + error.message);
  }
});

module.exports = router;
