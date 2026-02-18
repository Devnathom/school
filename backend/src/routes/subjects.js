const express = require('express');
const router = express.Router();

// Mock subjects database
let subjects = [
  { id: 1, code: 'SCI101', name: 'วิทยาศาสตร์พื้นฐาน', department: 'วิทยาศาสตร์', credits: 2, teacherId: 1, teacherName: 'ประสิทธิ์ สอนดี', description: 'วิชาวิทยาศาสตร์พื้นฐานสำหรับ ม.ต้น' },
  { id: 2, code: 'MAT101', name: 'คณิตศาสตร์พื้นฐาน', department: 'คณิตศาสตร์', credits: 2, teacherId: 2, teacherName: 'สมพร รักวิชา', description: 'วิชาคณิตศาสตร์พื้นฐานสำหรับ ม.ต้น' },
  { id: 3, code: 'ENG101', name: 'ภาษาอังกฤษพื้นฐาน', department: 'ภาษาต่างประเทศ', credits: 2, teacherId: 3, teacherName: 'วิไล ภาษาเด่น', description: 'วิชาภาษาอังกฤษพื้นฐาน' },
  { id: 4, code: 'THA101', name: 'ภาษาไทย', department: 'ภาษาไทย', credits: 2, teacherId: 4, teacherName: 'สุชาติ ไทยแท้', description: 'วิชาภาษาไทยพื้นฐาน' },
  { id: 5, code: 'ART101', name: 'ศิลปะ', department: 'ศิลปะ', credits: 1, teacherId: 5, teacherName: 'อรุณ ศิลป์งาม', description: 'วิชาศิลปะพื้นฐาน' },
  { id: 6, code: 'PHY201', name: 'ฟิสิกส์', department: 'วิทยาศาสตร์', credits: 3, teacherId: 1, teacherName: 'ประสิทธิ์ สอนดี', description: 'วิชาฟิสิกส์เพิ่มเติม' },
  { id: 7, code: 'CHE201', name: 'เคมี', department: 'วิทยาศาสตร์', credits: 3, teacherId: 1, teacherName: 'ประสิทธิ์ สอนดี', description: 'วิชาเคมีเพิ่มเติม' },
  { id: 8, code: 'MAT201', name: 'คณิตศาสตร์เพิ่มเติม', department: 'คณิตศาสตร์', credits: 3, teacherId: 2, teacherName: 'สมพร รักวิชา', description: 'วิชาคณิตศาสตร์เพิ่มเติม' },
];

let nextId = 9;

// Get all subjects
router.get('/', (req, res) => {
  const { search, department } = req.query;
  let filteredSubjects = [...subjects];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredSubjects = filteredSubjects.filter(s =>
      s.name.toLowerCase().includes(searchLower) ||
      s.code.toLowerCase().includes(searchLower)
    );
  }

  if (department) {
    filteredSubjects = filteredSubjects.filter(s => s.department === department);
  }

  res.json(filteredSubjects);
});

// Get single subject
router.get('/:id', (req, res) => {
  const subject = subjects.find(s => s.id === parseInt(req.params.id));
  if (!subject) {
    return res.status(404).json({ message: 'ไม่พบวิชา' });
  }
  res.json(subject);
});

// Create subject
router.post('/', (req, res) => {
  const newSubject = {
    id: nextId++,
    ...req.body
  };
  subjects.push(newSubject);
  res.status(201).json(newSubject);
});

// Update subject
router.put('/:id', (req, res) => {
  const index = subjects.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'ไม่พบวิชา' });
  }
  subjects[index] = { ...subjects[index], ...req.body };
  res.json(subjects[index]);
});

// Delete subject
router.delete('/:id', (req, res) => {
  const index = subjects.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'ไม่พบวิชา' });
  }
  subjects.splice(index, 1);
  res.json({ message: 'ลบวิชาเรียบร้อยแล้ว' });
});

module.exports = router;
