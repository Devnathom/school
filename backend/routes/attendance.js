const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [classes] = await db.query('SELECT * FROM classes ORDER BY name');
    res.render('attendance/index', { title: 'เช็คชื่อ', page: 'attendance', classes, students: [], selectedClass: null });
  } catch (error) {
    res.render('attendance/index', { title: 'เช็คชื่อ', page: 'attendance', classes: [], students: [], error: error.message });
  }
});

router.get('/class/:classId', async (req, res) => {
  try {
    const [classes] = await db.query('SELECT * FROM classes ORDER BY name');
    const [students] = await db.query('SELECT * FROM students WHERE classId = ?', [req.params.classId]);
    res.render('attendance/index', { 
      title: 'เช็คชื่อ', 
      page: 'attendance', 
      classes, 
      students, 
      selectedClass: req.params.classId 
    });
  } catch (error) {
    res.redirect('/attendance?error=' + error.message);
  }
});

router.post('/save', async (req, res) => {
  try {
    const { classId, date, attendance } = req.body;
    for (const studentId in attendance) {
      const status = attendance[studentId];
      await db.query(
        'INSERT INTO attendance (studentId, classId, date, status) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE status = ?',
        [studentId, classId, date, status, status]
      );
    }
    res.redirect('/attendance/class/' + classId + '?success=บันทึกการเช็คชื่อสำเร็จ');
  } catch (error) {
    res.redirect('/attendance?error=' + error.message);
  }
});

module.exports = router;
