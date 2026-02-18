# วิธี Deploy บน Hostinger Shared Hosting

## Domain: school.onestore.cloud

---

## วิธีที่ 1: Deploy Backend API อย่างเดียว (แนะนำ)

### ขั้นตอนที่ 1: เตรียมไฟล์ Backend
1. ไปที่ Hostinger Panel > **เว็บไซต์** > **ตัวจัดการไฟล์**
2. เข้าไปที่ `public_html`
3. **ลบไฟล์ทั้งหมด** ใน public_html (ถ้ามี)
4. อัพโหลดไฟล์ทั้งหมดจากโฟลเดอร์ `backend/`

### ขั้นตอนที่ 2: ตั้งค่า Node.js บน Hostinger
1. ไปที่ **ขั้นสูง** > **Node.js**
2. ตั้งค่าดังนี้:
   - **Node.js version:** 20.x หรือ 22.x
   - **Application root:** `/public_html`
   - **Application entry file:** `index.js`
   - **Package manager:** npm

### ขั้นตอนที่ 3: ติดตั้ง Dependencies
1. คลิก **Restart** ใน Node.js panel
2. หรือใช้ SSH:
   ```bash
   cd public_html
   npm install
   ```

### ขั้นตอนที่ 4: ทดสอบ
- เปิด https://school.onestore.cloud
- ควรเห็น JSON: `{ "status": "ok", "message": "School Management System API" }`

---

## วิธีที่ 2: Deploy Full Stack (Frontend + Backend)

### Option A: ใช้ Subdomain แยก
- `api.school.onestore.cloud` → Backend
- `school.onestore.cloud` → Frontend

### Option B: รวมเป็น Full Stack Next.js
(ต้องย้าย API routes ไปอยู่ใน Next.js)

---

## โครงสร้างไฟล์ที่ต้องอัพโหลด (Backend)

```
public_html/
├── index.js              # Entry point
├── package.json
├── .env                  # สร้างไฟล์นี้บน server
└── src/
    ├── server.js
    └── routes/
        ├── auth.js
        ├── students.js
        ├── teachers.js
        ├── classes.js
        ├── subjects.js
        ├── attendance.js
        ├── grades.js
        └── dashboard.js
```

## ไฟล์ .env ที่ต้องสร้างบน Server
สร้างไฟล์ `.env` ใน `public_html/`:
```
PORT=3000
JWT_SECRET=your-super-secret-key-change-this
NODE_ENV=production
```

---

## Troubleshooting

### ปัญหา: Cannot GET /
- ตรวจสอบว่า `index.js` อยู่ใน `public_html`
- ตรวจสอบ Application entry file ใน Node.js panel

### ปัญหา: 502 Bad Gateway
- รอสักครู่แล้ว refresh
- ตรวจสอบ logs ใน Node.js panel

### ปัญหา: Module not found
- ลบ `node_modules` แล้วรัน `npm install` ใหม่
