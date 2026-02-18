const express = require('express');
const router = express.Router();

// Mock grades database
let grades = [
  { id: 1, studentId: 1, studentName: 'สมชาย ใจดี', subjectId: 1, subjectName: 'วิทยาศาสตร์พื้นฐาน', classId: 1, className: 'ม.1/1', semester: 1, year: 2567, midterm: 35, final: 40, assignment: 18, total: 93, grade: 'A' },
  { id: 2, studentId: 1, studentName: 'สมชาย ใจดี', subjectId: 2, subjectName: 'คณิตศาสตร์พื้นฐาน', classId: 1, className: 'ม.1/1', semester: 1, year: 2567, midterm: 30, final: 35, assignment: 15, total: 80, grade: 'A' },
  { id: 3, studentId: 2, studentName: 'สมหญิง รักเรียน', subjectId: 1, subjectName: 'วิทยาศาสตร์พื้นฐาน', classId: 1, className: 'ม.1/1', semester: 1, year: 2567, midterm: 38, final: 42, assignment: 20, total: 100, grade: 'A' },
  { id: 4, studentId: 2, studentName: 'สมหญิง รักเรียน', subjectId: 2, subjectName: 'คณิตศาสตร์พื้นฐาน', classId: 1, className: 'ม.1/1', semester: 1, year: 2567, midterm: 25, final: 30, assignment: 12, total: 67, grade: 'B' },
  { id: 5, studentId: 3, studentName: 'วิชัย เก่งมาก', subjectId: 1, subjectName: 'วิทยาศาสตร์พื้นฐาน', classId: 2, className: 'ม.1/2', semester: 1, year: 2567, midterm: 28, final: 32, assignment: 14, total: 74, grade: 'B+' },
  { id: 6, studentId: 4, studentName: 'มานี สุขสันต์', subjectId: 1, subjectName: 'วิทยาศาสตร์พื้นฐาน', classId: 2, className: 'ม.1/2', semester: 1, year: 2567, midterm: 22, final: 25, assignment: 10, total: 57, grade: 'C+' },
  { id: 7, studentId: 5, studentName: 'ปิติ ยินดี', subjectId: 1, subjectName: 'วิทยาศาสตร์พื้นฐาน', classId: 3, className: 'ม.2/1', semester: 1, year: 2567, midterm: 40, final: 45, assignment: 20, total: 105, grade: 'A' },
];

let nextId = 8;

// Calculate grade from total score
function calculateGrade(total) {
  if (total >= 80) return 'A';
  if (total >= 75) return 'B+';
  if (total >= 70) return 'B';
  if (total >= 65) return 'C+';
  if (total >= 60) return 'C';
  if (total >= 55) return 'D+';
  if (total >= 50) return 'D';
  return 'F';
}

// Get grades
router.get('/', (req, res) => {
  const { studentId, subjectId, classId, semester, year } = req.query;
  let filteredGrades = [...grades];

  if (studentId) {
    filteredGrades = filteredGrades.filter(g => g.studentId === parseInt(studentId));
  }

  if (subjectId) {
    filteredGrades = filteredGrades.filter(g => g.subjectId === parseInt(subjectId));
  }

  if (classId) {
    filteredGrades = filteredGrades.filter(g => g.classId === parseInt(classId));
  }

  if (semester) {
    filteredGrades = filteredGrades.filter(g => g.semester === parseInt(semester));
  }

  if (year) {
    filteredGrades = filteredGrades.filter(g => g.year === parseInt(year));
  }

  res.json(filteredGrades);
});

// Get grade statistics
router.get('/statistics', (req, res) => {
  const { classId, subjectId, semester, year } = req.query;
  let filteredGrades = [...grades];

  if (classId) filteredGrades = filteredGrades.filter(g => g.classId === parseInt(classId));
  if (subjectId) filteredGrades = filteredGrades.filter(g => g.subjectId === parseInt(subjectId));
  if (semester) filteredGrades = filteredGrades.filter(g => g.semester === parseInt(semester));
  if (year) filteredGrades = filteredGrades.filter(g => g.year === parseInt(year));

  if (filteredGrades.length === 0) {
    return res.json({ average: 0, highest: 0, lowest: 0, gradeDistribution: {} });
  }

  const totals = filteredGrades.map(g => g.total);
  const gradeDistribution = {};
  filteredGrades.forEach(g => {
    gradeDistribution[g.grade] = (gradeDistribution[g.grade] || 0) + 1;
  });

  res.json({
    average: (totals.reduce((a, b) => a + b, 0) / totals.length).toFixed(2),
    highest: Math.max(...totals),
    lowest: Math.min(...totals),
    gradeDistribution
  });
});

// Create grade
router.post('/', (req, res) => {
  const { midterm = 0, final = 0, assignment = 0 } = req.body;
  const total = midterm + final + assignment;
  const grade = calculateGrade(total);

  const newGrade = {
    id: nextId++,
    ...req.body,
    total,
    grade
  };
  grades.push(newGrade);
  res.status(201).json(newGrade);
});

// Update grade
router.put('/:id', (req, res) => {
  const index = grades.findIndex(g => g.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'ไม่พบข้อมูลเกรด' });
  }

  const { midterm, final, assignment } = { ...grades[index], ...req.body };
  const total = midterm + final + assignment;
  const grade = calculateGrade(total);

  grades[index] = { ...grades[index], ...req.body, total, grade };
  res.json(grades[index]);
});

// Delete grade
router.delete('/:id', (req, res) => {
  const index = grades.findIndex(g => g.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'ไม่พบข้อมูลเกรด' });
  }
  grades.splice(index, 1);
  res.json({ message: 'ลบข้อมูลเกรดเรียบร้อยแล้ว' });
});

module.exports = router;
