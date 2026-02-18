const express = require('express');
const router = express.Router();

// Mock attendance database
let attendance = [
  { id: 1, studentId: 1, studentName: 'สมชาย ใจดี', classId: 1, className: 'ม.1/1', date: '2024-01-15', status: 'present', note: '' },
  { id: 2, studentId: 2, studentName: 'สมหญิง รักเรียน', classId: 1, className: 'ม.1/1', date: '2024-01-15', status: 'present', note: '' },
  { id: 3, studentId: 3, studentName: 'วิชัย เก่งมาก', classId: 2, className: 'ม.1/2', date: '2024-01-15', status: 'absent', note: 'ลาป่วย' },
  { id: 4, studentId: 4, studentName: 'มานี สุขสันต์', classId: 2, className: 'ม.1/2', date: '2024-01-15', status: 'present', note: '' },
  { id: 5, studentId: 5, studentName: 'ปิติ ยินดี', classId: 3, className: 'ม.2/1', date: '2024-01-15', status: 'late', note: 'มาสาย 15 นาที' },
  { id: 6, studentId: 1, studentName: 'สมชาย ใจดี', classId: 1, className: 'ม.1/1', date: '2024-01-16', status: 'present', note: '' },
  { id: 7, studentId: 2, studentName: 'สมหญิง รักเรียน', classId: 1, className: 'ม.1/1', date: '2024-01-16', status: 'absent', note: 'ลากิจ' },
];

let nextId = 8;

// Get attendance records
router.get('/', (req, res) => {
  const { classId, date, studentId } = req.query;
  let filteredAttendance = [...attendance];

  if (classId) {
    filteredAttendance = filteredAttendance.filter(a => a.classId === parseInt(classId));
  }

  if (date) {
    filteredAttendance = filteredAttendance.filter(a => a.date === date);
  }

  if (studentId) {
    filteredAttendance = filteredAttendance.filter(a => a.studentId === parseInt(studentId));
  }

  res.json(filteredAttendance);
});

// Get attendance summary
router.get('/summary', (req, res) => {
  const { classId, month, year } = req.query;
  
  let filteredAttendance = [...attendance];
  
  if (classId) {
    filteredAttendance = filteredAttendance.filter(a => a.classId === parseInt(classId));
  }

  const summary = {
    total: filteredAttendance.length,
    present: filteredAttendance.filter(a => a.status === 'present').length,
    absent: filteredAttendance.filter(a => a.status === 'absent').length,
    late: filteredAttendance.filter(a => a.status === 'late').length,
    leave: filteredAttendance.filter(a => a.status === 'leave').length,
  };

  summary.presentRate = summary.total > 0 ? ((summary.present / summary.total) * 100).toFixed(1) : 0;

  res.json(summary);
});

// Create or update attendance
router.post('/', (req, res) => {
  const { studentId, classId, date, status, note } = req.body;
  
  // Check if attendance record exists
  const existingIndex = attendance.findIndex(
    a => a.studentId === studentId && a.date === date
  );

  if (existingIndex !== -1) {
    // Update existing record
    attendance[existingIndex] = { ...attendance[existingIndex], status, note };
    return res.json(attendance[existingIndex]);
  }

  // Create new record
  const newAttendance = {
    id: nextId++,
    ...req.body
  };
  attendance.push(newAttendance);
  res.status(201).json(newAttendance);
});

// Bulk create attendance
router.post('/bulk', (req, res) => {
  const { records } = req.body;
  const createdRecords = [];

  records.forEach(record => {
    const existingIndex = attendance.findIndex(
      a => a.studentId === record.studentId && a.date === record.date
    );

    if (existingIndex !== -1) {
      attendance[existingIndex] = { ...attendance[existingIndex], ...record };
      createdRecords.push(attendance[existingIndex]);
    } else {
      const newRecord = {
        id: nextId++,
        ...record
      };
      attendance.push(newRecord);
      createdRecords.push(newRecord);
    }
  });

  res.status(201).json(createdRecords);
});

module.exports = router;
