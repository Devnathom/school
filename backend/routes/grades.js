const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [grades] = await db.query(`
      SELECT g.*, s.firstName, s.lastName, s.studentId as stdId, sub.name as subjectName 
      FROM grades g 
      LEFT JOIN students s ON g.studentId = s.id 
      LEFT JOIN subjects sub ON g.subjectId = sub.id 
      ORDER BY g.id DESC
    `);
    const [students] = await db.query('SELECT * FROM students');
    const [subjects] = await db.query('SELECT * FROM subjects');
    res.render('grades/index', { title: 'จัดการเกรด', page: 'grades', grades, students, subjects });
  } catch (error) {
    res.render('grades/index', { title: 'จัดการเกรด', page: 'grades', grades: [], students: [], subjects: [], error: error.message });
  }
});

router.post('/add', async (req, res) => {
  try {
    const { studentId, subjectId, midterm, final, assignment } = req.body;
    const total = parseFloat(midterm || 0) + parseFloat(final || 0) + parseFloat(assignment || 0);
    let grade = 'F';
    if (total >= 80) grade = 'A';
    else if (total >= 75) grade = 'B+';
    else if (total >= 70) grade = 'B';
    else if (total >= 65) grade = 'C+';
    else if (total >= 60) grade = 'C';
    else if (total >= 55) grade = 'D+';
    else if (total >= 50) grade = 'D';

    await db.query(
      'INSERT INTO grades (studentId, subjectId, midterm, final, assignment, total, grade, semester, year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [studentId, subjectId, midterm || 0, final || 0, assignment || 0, total, grade, 1, 2567]
    );
    res.redirect('/grades?success=บันทึกเกรดสำเร็จ');
  } catch (error) {
    res.redirect('/grades?error=' + error.message);
  }
});

module.exports = router;
