const express = require('express');
const router = express.Router();
const db = require('../db');

// List rooms
router.get('/', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    const [rooms] = await db.query(
      'SELECT * FROM rooms WHERE school_id = ? ORDER BY name',
      [schoolId]
    );
    res.render('rooms/index', {
      title: 'จัดการห้องเรียน',
      page: 'rooms',
      user: req.session.user,
      rooms,
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (error) {
    res.render('rooms/index', {
      title: 'จัดการห้องเรียน',
      page: 'rooms',
      user: req.session.user,
      rooms: [],
      success: null,
      error: error.message
    });
  }
});

// Add room
router.post('/add', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    const { name, building, capacity, room_type } = req.body;
    await db.query(
      'INSERT INTO rooms (school_id, name, building, capacity, room_type) VALUES (?, ?, ?, ?, ?)',
      [schoolId, name, building || null, capacity || 40, room_type || 'classroom']
    );
    res.redirect('/app/rooms?success=เพิ่มห้องเรียนสำเร็จ');
  } catch (error) {
    res.redirect('/app/rooms?error=' + encodeURIComponent(error.message));
  }
});

// Delete room
router.get('/delete/:id', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    await db.query('DELETE FROM rooms WHERE id = ? AND school_id = ?', [req.params.id, schoolId]);
    res.redirect('/app/rooms?success=ลบห้องเรียนสำเร็จ');
  } catch (error) {
    res.redirect('/app/rooms?error=' + encodeURIComponent(error.message));
  }
});

module.exports = router;
