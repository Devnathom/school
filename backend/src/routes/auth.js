const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock users database
let users = [
  {
    id: 1,
    email: 'admin@school.com',
    password: '$2a$10$XQxBtVQ6Y5X5X5X5X5X5XOXQxBtVQ6Y5X5X5X5X5X5X5X5X5X5X5', // password: admin123
    name: 'ผู้ดูแลระบบ',
    role: 'admin',
    avatar: null
  }
];

// Initialize with hashed password
(async () => {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  users[0].password = hashedPassword;
})();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'school-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
  }
});

// Get current user
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'ไม่พบ Token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'school-secret-key');
    const user = users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar
    });
  } catch (error) {
    res.status(401).json({ message: 'Token ไม่ถูกต้อง' });
  }
});

module.exports = router;
