// Shared data store for API routes

export const students = [
  { id: 1, studentId: "STD001", firstName: "สมชาย", lastName: "ใจดี", email: "somchai@school.com", phone: "081-234-5678", classId: 1, className: "ม.1/1", gender: "male", birthDate: "2010-05-15", address: "123 ถ.สุขุมวิท กรุงเทพฯ", parentName: "นายสมศักดิ์ ใจดี", parentPhone: "089-123-4567", status: "active", createdAt: "2024-01-15" },
  { id: 2, studentId: "STD002", firstName: "สมหญิง", lastName: "รักเรียน", email: "somying@school.com", phone: "082-345-6789", classId: 1, className: "ม.1/1", gender: "female", birthDate: "2010-08-20", address: "456 ถ.พหลโยธิน กรุงเทพฯ", parentName: "นางสมศรี รักเรียน", parentPhone: "089-234-5678", status: "active", createdAt: "2024-01-15" },
  { id: 3, studentId: "STD003", firstName: "วิชัย", lastName: "เก่งมาก", email: "wichai@school.com", phone: "083-456-7890", classId: 2, className: "ม.1/2", gender: "male", birthDate: "2010-03-10", address: "789 ถ.ลาดพร้าว กรุงเทพฯ", parentName: "นายวิเชียร เก่งมาก", parentPhone: "089-345-6789", status: "active", createdAt: "2024-01-16" },
  { id: 4, studentId: "STD004", firstName: "มานี", lastName: "สุขสันต์", email: "manee@school.com", phone: "084-567-8901", classId: 2, className: "ม.1/2", gender: "female", birthDate: "2010-11-25", address: "321 ถ.รัชดา กรุงเทพฯ", parentName: "นางมาลี สุขสันต์", parentPhone: "089-456-7890", status: "active", createdAt: "2024-01-16" },
  { id: 5, studentId: "STD005", firstName: "ปิติ", lastName: "ยินดี", email: "piti@school.com", phone: "085-678-9012", classId: 3, className: "ม.2/1", gender: "male", birthDate: "2009-07-08", address: "654 ถ.สีลม กรุงเทพฯ", parentName: "นายประเสริฐ ยินดี", parentPhone: "089-567-8901", status: "active", createdAt: "2024-01-17" },
];

export const teachers = [
  { id: 1, teacherId: "TCH001", firstName: "ประสิทธิ์", lastName: "สอนดี", email: "prasit@school.com", phone: "081-111-1111", department: "วิทยาศาสตร์", subjects: ["ฟิสิกส์", "เคมี"], position: "หัวหน้ากลุ่มสาระ", education: "ปริญญาโท สาขาฟิสิกส์", status: "active", hireDate: "2015-05-01", salary: 35000 },
  { id: 2, teacherId: "TCH002", firstName: "สมพร", lastName: "รักวิชา", email: "somporn@school.com", phone: "082-222-2222", department: "คณิตศาสตร์", subjects: ["คณิตศาสตร์พื้นฐาน", "คณิตศาสตร์เพิ่มเติม"], position: "ครูผู้สอน", education: "ปริญญาตรี สาขาคณิตศาสตร์", status: "active", hireDate: "2018-05-01", salary: 28000 },
  { id: 3, teacherId: "TCH003", firstName: "วิไล", lastName: "ภาษาเด่น", email: "wilai@school.com", phone: "083-333-3333", department: "ภาษาต่างประเทศ", subjects: ["ภาษาอังกฤษ"], position: "ครูผู้สอน", education: "ปริญญาตรี สาขาภาษาอังกฤษ", status: "active", hireDate: "2019-05-01", salary: 26000 },
  { id: 4, teacherId: "TCH004", firstName: "สุชาติ", lastName: "ไทยแท้", email: "suchat@school.com", phone: "084-444-4444", department: "ภาษาไทย", subjects: ["ภาษาไทย", "วรรณคดี"], position: "ครูผู้สอน", education: "ปริญญาตรี สาขาภาษาไทย", status: "active", hireDate: "2017-05-01", salary: 30000 },
  { id: 5, teacherId: "TCH005", firstName: "อรุณ", lastName: "ศิลป์งาม", email: "arun@school.com", phone: "085-555-5555", department: "ศิลปะ", subjects: ["ทัศนศิลป์", "ดนตรี"], position: "ครูผู้สอน", education: "ปริญญาตรี สาขาศิลปกรรม", status: "active", hireDate: "2020-05-01", salary: 24000 },
];

export const classes = [
  { id: 1, name: "ม.1/1", level: "ม.1", section: "1", year: 2567, teacherId: 1, teacherName: "ประสิทธิ์ สอนดี", room: "101", studentCount: 35, capacity: 40 },
  { id: 2, name: "ม.1/2", level: "ม.1", section: "2", year: 2567, teacherId: 2, teacherName: "สมพร รักวิชา", room: "102", studentCount: 32, capacity: 40 },
  { id: 3, name: "ม.2/1", level: "ม.2", section: "1", year: 2567, teacherId: 3, teacherName: "วิไล ภาษาเด่น", room: "201", studentCount: 38, capacity: 40 },
  { id: 4, name: "ม.2/2", level: "ม.2", section: "2", year: 2567, teacherId: 4, teacherName: "สุชาติ ไทยแท้", room: "202", studentCount: 36, capacity: 40 },
  { id: 5, name: "ม.3/1", level: "ม.3", section: "1", year: 2567, teacherId: 5, teacherName: "อรุณ ศิลป์งาม", room: "301", studentCount: 34, capacity: 40 },
  { id: 6, name: "ม.3/2", level: "ม.3", section: "2", year: 2567, teacherId: 1, teacherName: "ประสิทธิ์ สอนดี", room: "302", studentCount: 33, capacity: 40 },
];

export const subjects = [
  { id: 1, code: "SCI101", name: "วิทยาศาสตร์พื้นฐาน", department: "วิทยาศาสตร์", credits: 2, teacherId: 1, teacherName: "ประสิทธิ์ สอนดี", description: "วิชาวิทยาศาสตร์พื้นฐานสำหรับ ม.ต้น" },
  { id: 2, code: "MAT101", name: "คณิตศาสตร์พื้นฐาน", department: "คณิตศาสตร์", credits: 2, teacherId: 2, teacherName: "สมพร รักวิชา", description: "วิชาคณิตศาสตร์พื้นฐานสำหรับ ม.ต้น" },
  { id: 3, code: "ENG101", name: "ภาษาอังกฤษพื้นฐาน", department: "ภาษาต่างประเทศ", credits: 2, teacherId: 3, teacherName: "วิไล ภาษาเด่น", description: "วิชาภาษาอังกฤษพื้นฐาน" },
  { id: 4, code: "THA101", name: "ภาษาไทย", department: "ภาษาไทย", credits: 2, teacherId: 4, teacherName: "สุชาติ ไทยแท้", description: "วิชาภาษาไทยพื้นฐาน" },
  { id: 5, code: "ART101", name: "ศิลปะ", department: "ศิลปะ", credits: 1, teacherId: 5, teacherName: "อรุณ ศิลป์งาม", description: "วิชาศิลปะพื้นฐาน" },
  { id: 6, code: "PHY201", name: "ฟิสิกส์", department: "วิทยาศาสตร์", credits: 3, teacherId: 1, teacherName: "ประสิทธิ์ สอนดี", description: "วิชาฟิสิกส์เพิ่มเติม" },
  { id: 7, code: "CHE201", name: "เคมี", department: "วิทยาศาสตร์", credits: 3, teacherId: 1, teacherName: "ประสิทธิ์ สอนดี", description: "วิชาเคมีเพิ่มเติม" },
  { id: 8, code: "MAT201", name: "คณิตศาสตร์เพิ่มเติม", department: "คณิตศาสตร์", credits: 3, teacherId: 2, teacherName: "สมพร รักวิชา", description: "วิชาคณิตศาสตร์เพิ่มเติม" },
];

export const attendance = [
  { id: 1, studentId: 1, studentName: "สมชาย ใจดี", classId: 1, className: "ม.1/1", date: "2024-01-15", status: "present", note: "" },
  { id: 2, studentId: 2, studentName: "สมหญิง รักเรียน", classId: 1, className: "ม.1/1", date: "2024-01-15", status: "present", note: "" },
  { id: 3, studentId: 3, studentName: "วิชัย เก่งมาก", classId: 2, className: "ม.1/2", date: "2024-01-15", status: "absent", note: "ลาป่วย" },
  { id: 4, studentId: 4, studentName: "มานี สุขสันต์", classId: 2, className: "ม.1/2", date: "2024-01-15", status: "present", note: "" },
  { id: 5, studentId: 5, studentName: "ปิติ ยินดี", classId: 3, className: "ม.2/1", date: "2024-01-15", status: "late", note: "มาสาย 15 นาที" },
];

export const grades = [
  { id: 1, studentId: 1, studentName: "สมชาย ใจดี", subjectId: 1, subjectName: "วิทยาศาสตร์พื้นฐาน", classId: 1, className: "ม.1/1", semester: 1, year: 2567, midterm: 35, final: 40, assignment: 18, total: 93, grade: "A" },
  { id: 2, studentId: 1, studentName: "สมชาย ใจดี", subjectId: 2, subjectName: "คณิตศาสตร์พื้นฐาน", classId: 1, className: "ม.1/1", semester: 1, year: 2567, midterm: 30, final: 35, assignment: 15, total: 80, grade: "A" },
  { id: 3, studentId: 2, studentName: "สมหญิง รักเรียน", subjectId: 1, subjectName: "วิทยาศาสตร์พื้นฐาน", classId: 1, className: "ม.1/1", semester: 1, year: 2567, midterm: 38, final: 42, assignment: 20, total: 100, grade: "A" },
  { id: 4, studentId: 2, studentName: "สมหญิง รักเรียน", subjectId: 2, subjectName: "คณิตศาสตร์พื้นฐาน", classId: 1, className: "ม.1/1", semester: 1, year: 2567, midterm: 25, final: 30, assignment: 12, total: 67, grade: "B" },
  { id: 5, studentId: 3, studentName: "วิชัย เก่งมาก", subjectId: 1, subjectName: "วิทยาศาสตร์พื้นฐาน", classId: 2, className: "ม.1/2", semester: 1, year: 2567, midterm: 28, final: 32, assignment: 14, total: 74, grade: "B+" },
  { id: 6, studentId: 4, studentName: "มานี สุขสันต์", subjectId: 1, subjectName: "วิทยาศาสตร์พื้นฐาน", classId: 2, className: "ม.1/2", semester: 1, year: 2567, midterm: 22, final: 25, assignment: 10, total: 57, grade: "C+" },
  { id: 7, studentId: 5, studentName: "ปิติ ยินดี", subjectId: 1, subjectName: "วิทยาศาสตร์พื้นฐาน", classId: 3, className: "ม.2/1", semester: 1, year: 2567, midterm: 40, final: 45, assignment: 20, total: 105, grade: "A" },
];
