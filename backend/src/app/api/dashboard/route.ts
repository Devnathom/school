import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    stats: {
      totalStudents: 208,
      totalTeachers: 25,
      totalClasses: 18,
      totalSubjects: 32,
      attendanceRate: 94.5,
      averageGrade: 75.8,
    },
    activities: [
      { id: 1, type: "student", action: "เพิ่มนักเรียนใหม่", description: "สมชาย ใจดี ถูกเพิ่มเข้าระบบ", timestamp: "2024-01-16T10:30:00", user: "Admin" },
      { id: 2, type: "attendance", action: "บันทึกการเข้าเรียน", description: "บันทึกการเข้าเรียนชั้น ม.1/1", timestamp: "2024-01-16T09:00:00", user: "ครูประสิทธิ์" },
      { id: 3, type: "grade", action: "บันทึกเกรด", description: "บันทึกเกรดวิชาคณิตศาสตร์ ม.2/1", timestamp: "2024-01-15T14:30:00", user: "ครูสมพร" },
    ],
    events: [
      { id: 1, title: "ประชุมผู้ปกครอง", date: "2024-01-20", time: "09:00", type: "meeting", location: "หอประชุม" },
      { id: 2, title: "สอบกลางภาค", date: "2024-01-25", time: "08:30", type: "exam", location: "ทุกห้องเรียน" },
      { id: 3, title: "กิจกรรมกีฬาสี", date: "2024-02-01", time: "07:30", type: "activity", location: "สนามกีฬา" },
    ],
    announcements: [
      { id: 1, title: "แจ้งกำหนดการสอบกลางภาค", content: "กำหนดสอบกลางภาควันที่ 25-29 มกราคม 2567", priority: "high", createdAt: "2024-01-16", author: "ฝ่ายวิชาการ" },
      { id: 2, title: "ประกาศรับสมัครนักเรียนใหม่", content: "เปิดรับสมัครนักเรียนใหม่ปีการศึกษา 2568", priority: "medium", createdAt: "2024-01-15", author: "ฝ่ายทะเบียน" },
    ],
  });
}
