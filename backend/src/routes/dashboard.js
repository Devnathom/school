const express = require('express');
const router = express.Router();

// Dashboard statistics
router.get('/stats', (req, res) => {
  res.json({
    totalStudents: 208,
    totalTeachers: 25,
    totalClasses: 18,
    totalSubjects: 32,
    attendanceRate: 94.5,
    averageGrade: 75.8
  });
});

// Recent activities
router.get('/activities', (req, res) => {
  res.json([
    { id: 1, type: 'student', action: 'เพิ่มนักเรียนใหม่', description: 'สมชาย ใจดี ถูกเพิ่มเข้าระบบ', timestamp: '2024-01-16T10:30:00', user: 'Admin' },
    { id: 2, type: 'attendance', action: 'บันทึกการเข้าเรียน', description: 'บันทึกการเข้าเรียนชั้น ม.1/1', timestamp: '2024-01-16T09:00:00', user: 'ครูประสิทธิ์' },
    { id: 3, type: 'grade', action: 'บันทึกเกรด', description: 'บันทึกเกรดวิชาคณิตศาสตร์ ม.2/1', timestamp: '2024-01-15T14:30:00', user: 'ครูสมพร' },
    { id: 4, type: 'teacher', action: 'อัปเดตข้อมูลครู', description: 'อัปเดตข้อมูลครูวิไล', timestamp: '2024-01-15T11:00:00', user: 'Admin' },
    { id: 5, type: 'class', action: 'สร้างชั้นเรียนใหม่', description: 'สร้างชั้นเรียน ม.4/1', timestamp: '2024-01-14T16:00:00', user: 'Admin' },
  ]);
});

// Attendance chart data
router.get('/attendance-chart', (req, res) => {
  res.json([
    { month: 'ม.ค.', present: 95, absent: 3, late: 2 },
    { month: 'ก.พ.', present: 93, absent: 4, late: 3 },
    { month: 'มี.ค.', present: 96, absent: 2, late: 2 },
    { month: 'เม.ย.', present: 94, absent: 4, late: 2 },
    { month: 'พ.ค.', present: 92, absent: 5, late: 3 },
    { month: 'มิ.ย.', present: 95, absent: 3, late: 2 },
  ]);
});

// Grade distribution
router.get('/grade-distribution', (req, res) => {
  res.json([
    { grade: 'A', count: 45, fill: '#22c55e' },
    { grade: 'B+', count: 38, fill: '#84cc16' },
    { grade: 'B', count: 52, fill: '#eab308' },
    { grade: 'C+', count: 35, fill: '#f97316' },
    { grade: 'C', count: 25, fill: '#ef4444' },
    { grade: 'D+', count: 10, fill: '#dc2626' },
    { grade: 'D', count: 3, fill: '#b91c1c' },
  ]);
});

// Upcoming events
router.get('/events', (req, res) => {
  res.json([
    { id: 1, title: 'ประชุมผู้ปกครอง', date: '2024-01-20', time: '09:00', type: 'meeting', location: 'หอประชุม' },
    { id: 2, title: 'สอบกลางภาค', date: '2024-01-25', time: '08:30', type: 'exam', location: 'ทุกห้องเรียน' },
    { id: 3, title: 'กิจกรรมกีฬาสี', date: '2024-02-01', time: '07:30', type: 'activity', location: 'สนามกีฬา' },
    { id: 4, title: 'วันหยุดตรุษจีน', date: '2024-02-10', time: '-', type: 'holiday', location: '-' },
  ]);
});

// Announcements
router.get('/announcements', (req, res) => {
  res.json([
    { id: 1, title: 'แจ้งกำหนดการสอบกลางภาค', content: 'กำหนดสอบกลางภาควันที่ 25-29 มกราคม 2567', priority: 'high', createdAt: '2024-01-16', author: 'ฝ่ายวิชาการ' },
    { id: 2, title: 'ประกาศรับสมัครนักเรียนใหม่', content: 'เปิดรับสมัครนักเรียนใหม่ปีการศึกษา 2568', priority: 'medium', createdAt: '2024-01-15', author: 'ฝ่ายทะเบียน' },
    { id: 3, title: 'กิจกรรมวันเด็ก', content: 'ขอเชิญร่วมกิจกรรมวันเด็กแห่งชาติ', priority: 'low', createdAt: '2024-01-10', author: 'ฝ่ายกิจการนักเรียน' },
  ]);
});

module.exports = router;
