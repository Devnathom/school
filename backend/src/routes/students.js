const express = require('express');
const router = express.Router();

// Mock students database
let students = [
  { id: 1, studentId: 'STD001', firstName: 'สมชาย', lastName: 'ใจดี', email: 'somchai@school.com', phone: '081-234-5678', classId: 1, className: 'ม.1/1', gender: 'male', birthDate: '2010-05-15', address: '123 ถ.สุขุมวิท กรุงเทพฯ', parentName: 'นายสมศักดิ์ ใจดี', parentPhone: '089-123-4567', status: 'active', createdAt: '2024-01-15' },
  { id: 2, studentId: 'STD002', firstName: 'สมหญิง', lastName: 'รักเรียน', email: 'somying@school.com', phone: '082-345-6789', classId: 1, className: 'ม.1/1', gender: 'female', birthDate: '2010-08-20', address: '456 ถ.พหลโยธิน กรุงเทพฯ', parentName: 'นางสมศรี รักเรียน', parentPhone: '089-234-5678', status: 'active', createdAt: '2024-01-15' },
  { id: 3, studentId: 'STD003', firstName: 'วิชัย', lastName: 'เก่งมาก', email: 'wichai@school.com', phone: '083-456-7890', classId: 2, className: 'ม.1/2', gender: 'male', birthDate: '2010-03-10', address: '789 ถ.ลาดพร้าว กรุงเทพฯ', parentName: 'นายวิเชียร เก่งมาก', parentPhone: '089-345-6789', status: 'active', createdAt: '2024-01-16' },
  { id: 4, studentId: 'STD004', firstName: 'มานี', lastName: 'สุขสันต์', email: 'manee@school.com', phone: '084-567-8901', classId: 2, className: 'ม.1/2', gender: 'female', birthDate: '2010-11-25', address: '321 ถ.รัชดา กรุงเทพฯ', parentName: 'นางมาลี สุขสันต์', parentPhone: '089-456-7890', status: 'active', createdAt: '2024-01-16' },
  { id: 5, studentId: 'STD005', firstName: 'ปิติ', lastName: 'ยินดี', email: 'piti@school.com', phone: '085-678-9012', classId: 3, className: 'ม.2/1', gender: 'male', birthDate: '2009-07-08', address: '654 ถ.สีลม กรุงเทพฯ', parentName: 'นายประเสริฐ ยินดี', parentPhone: '089-567-8901', status: 'active', createdAt: '2024-01-17' },
];

let nextId = 6;

// Get all students
router.get('/', (req, res) => {
  const { search, classId, status } = req.query;
  let filteredStudents = [...students];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredStudents = filteredStudents.filter(s =>
      s.firstName.toLowerCase().includes(searchLower) ||
      s.lastName.toLowerCase().includes(searchLower) ||
      s.studentId.toLowerCase().includes(searchLower) ||
      s.email.toLowerCase().includes(searchLower)
    );
  }

  if (classId) {
    filteredStudents = filteredStudents.filter(s => s.classId === parseInt(classId));
  }

  if (status) {
    filteredStudents = filteredStudents.filter(s => s.status === status);
  }

  res.json(filteredStudents);
});

// Get single student
router.get('/:id', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) {
    return res.status(404).json({ message: 'ไม่พบนักเรียน' });
  }
  res.json(student);
});

// Create student
router.post('/', (req, res) => {
  const newStudent = {
    id: nextId++,
    studentId: `STD${String(nextId).padStart(3, '0')}`,
    ...req.body,
    createdAt: new Date().toISOString().split('T')[0]
  };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

// Update student
router.put('/:id', (req, res) => {
  const index = students.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'ไม่พบนักเรียน' });
  }
  students[index] = { ...students[index], ...req.body };
  res.json(students[index]);
});

// Delete student
router.delete('/:id', (req, res) => {
  const index = students.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'ไม่พบนักเรียน' });
  }
  students.splice(index, 1);
  res.json({ message: 'ลบนักเรียนเรียบร้อยแล้ว' });
});

module.exports = router;
