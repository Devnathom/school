# ระบบบริหารจัดการโรงเรียน (School Management System)

ระบบบริหารจัดการโรงเรียนครบวงจร พัฒนาด้วย Next.js และ Node.js

## 🚀 Features

- **แดชบอร์ด** - ภาพรวมข้อมูลโรงเรียน สถิติ และกราฟแสดงผล
- **จัดการนักเรียน** - เพิ่ม แก้ไข ลบ และค้นหาข้อมูลนักเรียน
- **จัดการครู** - จัดการข้อมูลครูและบุคลากร
- **ชั้นเรียน** - จัดการชั้นเรียนและห้องเรียน
- **รายวิชา** - จัดการรายวิชาและหลักสูตร
- **เช็คชื่อ** - บันทึกการเข้าเรียนของนักเรียน
- **จัดการเกรด** - บันทึกและจัดการผลการเรียน
- **ประกาศ** - ระบบประกาศและข่าวสาร

## 🛠 Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts (สำหรับกราฟ)
- Lucide Icons

### Backend
- Node.js
- Express.js
- JWT Authentication

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm หรือ yarn

### Setup

1. Clone repository
```bash
git clone https://github.com/Devnathom/school.git
cd school
```

2. ติดตั้ง dependencies สำหรับ Frontend
```bash
cd frontend
npm install
```

3. ติดตั้ง dependencies สำหรับ Backend
```bash
cd ../backend
npm install
```

## 🚀 Running the Application

### เริ่มต้น Backend Server
```bash
cd backend
npm run dev
```
Backend จะทำงานที่ http://localhost:5000

### เริ่มต้น Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend จะทำงานที่ http://localhost:3000

## 🔐 Login Credentials (Demo)

- **Email:** admin@school.com
- **Password:** admin123

## 📁 Project Structure

```
school/
├── frontend/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── (dashboard)/ # Dashboard layout group
│   │   │   │   ├── dashboard/
│   │   │   │   ├── students/
│   │   │   │   ├── teachers/
│   │   │   │   ├── classes/
│   │   │   │   ├── subjects/
│   │   │   │   ├── attendance/
│   │   │   │   ├── grades/
│   │   │   │   ├── announcements/
│   │   │   │   └── settings/
│   │   │   └── login/
│   │   ├── components/      # React components
│   │   │   └── ui/          # shadcn/ui components
│   │   └── lib/             # Utilities
│   └── package.json
│
├── backend/                  # Node.js Backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   │   ├── auth.js
│   │   │   ├── students.js
│   │   │   ├── teachers.js
│   │   │   ├── classes.js
│   │   │   ├── subjects.js
│   │   │   ├── attendance.js
│   │   │   ├── grades.js
│   │   │   └── dashboard.js
│   │   └── server.js        # Express server
│   ├── .env
│   └── package.json
│
└── README.md
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Teachers
- `GET /api/teachers` - Get all teachers
- `GET /api/teachers/:id` - Get teacher by ID
- `POST /api/teachers` - Create teacher
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher

### Classes
- `GET /api/classes` - Get all classes
- `POST /api/classes` - Create class
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class

### Subjects
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

### Attendance
- `GET /api/attendance` - Get attendance records
- `GET /api/attendance/summary` - Get attendance summary
- `POST /api/attendance` - Save attendance
- `POST /api/attendance/bulk` - Save bulk attendance

### Grades
- `GET /api/grades` - Get grades
- `GET /api/grades/statistics` - Get grade statistics
- `POST /api/grades` - Create grade
- `PUT /api/grades/:id` - Update grade
- `DELETE /api/grades/:id` - Delete grade

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activities` - Get recent activities
- `GET /api/dashboard/events` - Get upcoming events
- `GET /api/dashboard/announcements` - Get announcements

## 📄 License

MIT License
