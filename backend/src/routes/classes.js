const express = require('express');
const router = express.Router();

// Mock classes database
let classes = [
  { id: 1, name: 'ม.1/1', level: 'ม.1', section: '1', year: 2567, teacherId: 1, teacherName: 'ประสิทธิ์ สอนดี', room: '101', studentCount: 35, capacity: 40 },
  { id: 2, name: 'ม.1/2', level: 'ม.1', section: '2', year: 2567, teacherId: 2, teacherName: 'สมพร รักวิชา', room: '102', studentCount: 32, capacity: 40 },
  { id: 3, name: 'ม.2/1', level: 'ม.2', section: '1', year: 2567, teacherId: 3, teacherName: 'วิไล ภาษาเด่น', room: '201', studentCount: 38, capacity: 40 },
  { id: 4, name: 'ม.2/2', level: 'ม.2', section: '2', year: 2567, teacherId: 4, teacherName: 'สุชาติ ไทยแท้', room: '202', studentCount: 36, capacity: 40 },
  { id: 5, name: 'ม.3/1', level: 'ม.3', section: '1', year: 2567, teacherId: 5, teacherName: 'อรุณ ศิลป์งาม', room: '301', studentCount: 34, capacity: 40 },
  { id: 6, name: 'ม.3/2', level: 'ม.3', section: '2', year: 2567, teacherId: 1, teacherName: 'ประสิทธิ์ สอนดี', room: '302', studentCount: 33, capacity: 40 },
];

let nextId = 7;

// Get all classes
router.get('/', (req, res) => {
  const { level, year } = req.query;
  let filteredClasses = [...classes];

  if (level) {
    filteredClasses = filteredClasses.filter(c => c.level === level);
  }

  if (year) {
    filteredClasses = filteredClasses.filter(c => c.year === parseInt(year));
  }

  res.json(filteredClasses);
});

// Get single class
router.get('/:id', (req, res) => {
  const classItem = classes.find(c => c.id === parseInt(req.params.id));
  if (!classItem) {
    return res.status(404).json({ message: 'ไม่พบชั้นเรียน' });
  }
  res.json(classItem);
});

// Create class
router.post('/', (req, res) => {
  const newClass = {
    id: nextId++,
    ...req.body,
    studentCount: 0
  };
  classes.push(newClass);
  res.status(201).json(newClass);
});

// Update class
router.put('/:id', (req, res) => {
  const index = classes.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'ไม่พบชั้นเรียน' });
  }
  classes[index] = { ...classes[index], ...req.body };
  res.json(classes[index]);
});

// Delete class
router.delete('/:id', (req, res) => {
  const index = classes.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'ไม่พบชั้นเรียน' });
  }
  classes.splice(index, 1);
  res.json({ message: 'ลบชั้นเรียนเรียบร้อยแล้ว' });
});

module.exports = router;
