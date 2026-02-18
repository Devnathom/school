const express = require('express');
const router = express.Router();
const db = require('../db');

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [[students]] = await db.query('SELECT COUNT(*) as count FROM students');
    const [[teachers]] = await db.query('SELECT COUNT(*) as count FROM teachers');
    const [[classes]] = await db.query('SELECT COUNT(*) as count FROM classes');
    const [[subjects]] = await db.query('SELECT COUNT(*) as count FROM subjects');
    
    res.json({
      students: students.count,
      teachers: teachers.count,
      classes: classes.count,
      subjects: subjects.count
    });
  } catch (error) {
    res.json({ students: 0, teachers: 0, classes: 0, subjects: 0 });
  }
});

// API endpoints for AJAX
router.get('/students', async (req, res) => {
  try {
    const [students] = await db.query('SELECT * FROM students ORDER BY id DESC');
    res.json(students);
  } catch (error) {
    res.json([]);
  }
});

router.delete('/students/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM students WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

module.exports = router;
