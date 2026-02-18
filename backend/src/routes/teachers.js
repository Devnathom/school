const express = require('express');
const router = express.Router();

// Mock teachers database
let teachers = [
  { id: 1, teacherId: 'TCH001', firstName: 'ประสิทธิ์', lastName: 'สอนดี', email: 'prasit@school.com', phone: '081-111-1111', department: 'วิทยาศาสตร์', subjects: ['ฟิสิกส์', 'เคมี'], position: 'หัวหน้ากลุ่มสาระ', education: 'ปริญญาโท สาขาฟิสิกส์', status: 'active', hireDate: '2015-05-01', salary: 35000 },
  { id: 2, teacherId: 'TCH002', firstName: 'สมพร', lastName: 'รักวิชา', email: 'somporn@school.com', phone: '082-222-2222', department: 'คณิตศาสตร์', subjects: ['คณิตศาสตร์พื้นฐาน', 'คณิตศาสตร์เพิ่มเติม'], position: 'ครูผู้สอน', education: 'ปริญญาตรี สาขาคณิตศาสตร์', status: 'active', hireDate: '2018-05-01', salary: 28000 },
  { id: 3, teacherId: 'TCH003', firstName: 'วิไล', lastName: 'ภาษาเด่น', email: 'wilai@school.com', phone: '083-333-3333', department: 'ภาษาต่างประเทศ', subjects: ['ภาษาอังกฤษ'], position: 'ครูผู้สอน', education: 'ปริญญาตรี สาขาภาษาอังกฤษ', status: 'active', hireDate: '2019-05-01', salary: 26000 },
  { id: 4, teacherId: 'TCH004', firstName: 'สุชาติ', lastName: 'ไทยแท้', email: 'suchat@school.com', phone: '084-444-4444', department: 'ภาษาไทย', subjects: ['ภาษาไทย', 'วรรณคดี'], position: 'ครูผู้สอน', education: 'ปริญญาตรี สาขาภาษาไทย', status: 'active', hireDate: '2017-05-01', salary: 30000 },
  { id: 5, teacherId: 'TCH005', firstName: 'อรุณ', lastName: 'ศิลป์งาม', email: 'arun@school.com', phone: '085-555-5555', department: 'ศิลปะ', subjects: ['ทัศนศิลป์', 'ดนตรี'], position: 'ครูผู้สอน', education: 'ปริญญาตรี สาขาศิลปกรรม', status: 'active', hireDate: '2020-05-01', salary: 24000 },
];

let nextId = 6;

// Get all teachers
router.get('/', (req, res) => {
  const { search, department, status } = req.query;
  let filteredTeachers = [...teachers];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredTeachers = filteredTeachers.filter(t =>
      t.firstName.toLowerCase().includes(searchLower) ||
      t.lastName.toLowerCase().includes(searchLower) ||
      t.teacherId.toLowerCase().includes(searchLower) ||
      t.email.toLowerCase().includes(searchLower)
    );
  }

  if (department) {
    filteredTeachers = filteredTeachers.filter(t => t.department === department);
  }

  if (status) {
    filteredTeachers = filteredTeachers.filter(t => t.status === status);
  }

  res.json(filteredTeachers);
});

// Get single teacher
router.get('/:id', (req, res) => {
  const teacher = teachers.find(t => t.id === parseInt(req.params.id));
  if (!teacher) {
    return res.status(404).json({ message: 'ไม่พบครู' });
  }
  res.json(teacher);
});

// Create teacher
router.post('/', (req, res) => {
  const newTeacher = {
    id: nextId++,
    teacherId: `TCH${String(nextId).padStart(3, '0')}`,
    ...req.body,
    hireDate: new Date().toISOString().split('T')[0]
  };
  teachers.push(newTeacher);
  res.status(201).json(newTeacher);
});

// Update teacher
router.put('/:id', (req, res) => {
  const index = teachers.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'ไม่พบครู' });
  }
  teachers[index] = { ...teachers[index], ...req.body };
  res.json(teachers[index]);
});

// Delete teacher
router.delete('/:id', (req, res) => {
  const index = teachers.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'ไม่พบครู' });
  }
  teachers.splice(index, 1);
  res.json({ message: 'ลบข้อมูลครูเรียบร้อยแล้ว' });
});

module.exports = router;
