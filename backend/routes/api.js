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

router.get('/subjects', async (req, res) => {
  try {
    const [subjects] = await db.query('SELECT * FROM subjects ORDER BY code');
    res.json(subjects);
  } catch (error) {
    res.json([]);
  }
});

router.get('/teachers', async (req, res) => {
  try {
    const [teachers] = await db.query('SELECT * FROM teachers WHERE status = ? ORDER BY firstName', ['active']);
    res.json(teachers);
  } catch (error) {
    res.json([]);
  }
});

router.get('/rooms', async (req, res) => {
  try {
    const [rooms] = await db.query('SELECT * FROM rooms WHERE is_active = TRUE ORDER BY name');
    res.json(rooms);
  } catch (error) {
    res.json([]);
  }
});

module.exports = router;
