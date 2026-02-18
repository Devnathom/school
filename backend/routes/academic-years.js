const express = require('express');
const router = express.Router();
const db = require('../db');

// List academic years
router.get('/', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    const [years] = await db.query(
      'SELECT * FROM academic_years WHERE school_id = ? ORDER BY year DESC, semester DESC',
      [schoolId]
    );
    res.render('academic-years/index', {
      title: 'จัดการปีการศึกษา',
      page: 'academic-years',
      user: req.session.user,
      years,
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (error) {
    res.render('academic-years/index', {
      title: 'จัดการปีการศึกษา',
      page: 'academic-years',
      user: req.session.user,
      years: [],
      success: null,
      error: error.message
    });
  }
});

// Add academic year
router.post('/add', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    const { year, semester, name, start_date, end_date } = req.body;

    await db.query(
      'INSERT INTO academic_years (school_id, year, semester, name, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [schoolId, year, semester, name || `ปีการศึกษา ${year} ภาคเรียนที่ ${semester}`, start_date || null, end_date || null, 'planning']
    );
    res.redirect('/app/academic-years?success=เพิ่มปีการศึกษาสำเร็จ');
  } catch (error) {
    res.redirect('/app/academic-years?error=' + encodeURIComponent(error.message));
  }
});

// Set as current
router.get('/:id/set-current', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    await db.query('UPDATE academic_years SET is_current = FALSE WHERE school_id = ?', [schoolId]);
    await db.query('UPDATE academic_years SET is_current = TRUE, status = ? WHERE id = ? AND school_id = ?', ['active', req.params.id, schoolId]);
    res.redirect('/app/academic-years?success=ตั้งเป็นปีการศึกษาปัจจุบันแล้ว');
  } catch (error) {
    res.redirect('/app/academic-years?error=' + encodeURIComponent(error.message));
  }
});

// Delete
router.get('/:id/delete', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    await db.query('DELETE FROM timetable WHERE academic_year_id = ? AND school_id = ?', [req.params.id, schoolId]);
    await db.query('DELETE FROM class_subjects WHERE academic_year_id = ? AND school_id = ?', [req.params.id, schoolId]);
    await db.query('DELETE FROM periods WHERE academic_year_id = ? AND school_id = ?', [req.params.id, schoolId]);
    await db.query('DELETE FROM academic_years WHERE id = ? AND school_id = ?', [req.params.id, schoolId]);
    res.redirect('/app/academic-years?success=ลบปีการศึกษาสำเร็จ');
  } catch (error) {
    res.redirect('/app/academic-years?error=' + encodeURIComponent(error.message));
  }
});

// Manage periods for an academic year
router.get('/:id/periods', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    const [[academicYear]] = await db.query('SELECT * FROM academic_years WHERE id = ? AND school_id = ?', [req.params.id, schoolId]);
    if (!academicYear) return res.redirect('/app/academic-years?error=ไม่พบปีการศึกษา');

    const [periods] = await db.query(
      'SELECT * FROM periods WHERE academic_year_id = ? AND school_id = ? ORDER BY period_order',
      [req.params.id, schoolId]
    );
    res.render('academic-years/periods', {
      title: 'จัดการคาบเรียน',
      page: 'academic-years',
      user: req.session.user,
      academicYear,
      periods,
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (error) {
    res.redirect('/app/academic-years?error=' + encodeURIComponent(error.message));
  }
});

// Add period
router.post('/:id/periods/add', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    const { name, start_time, end_time, period_order, is_break } = req.body;
    await db.query(
      'INSERT INTO periods (school_id, academic_year_id, name, start_time, end_time, period_order, is_break) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [schoolId, req.params.id, name, start_time, end_time, period_order, is_break === 'on' ? 1 : 0]
    );
    res.redirect(`/app/academic-years/${req.params.id}/periods?success=เพิ่มคาบเรียนสำเร็จ`);
  } catch (error) {
    res.redirect(`/app/academic-years/${req.params.id}/periods?error=` + encodeURIComponent(error.message));
  }
});

// Delete period
router.get('/:id/periods/:periodId/delete', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    await db.query('DELETE FROM periods WHERE id = ? AND school_id = ?', [req.params.periodId, schoolId]);
    res.redirect(`/app/academic-years/${req.params.id}/periods?success=ลบคาบเรียนสำเร็จ`);
  } catch (error) {
    res.redirect(`/app/academic-years/${req.params.id}/periods?error=` + encodeURIComponent(error.message));
  }
});

// Generate default periods
router.get('/:id/periods/generate-default', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    const ayId = req.params.id;

    // Delete existing periods first
    await db.query('DELETE FROM periods WHERE academic_year_id = ? AND school_id = ?', [ayId, schoolId]);

    const defaultPeriods = [
      { name: 'คาบที่ 1', start: '08:30', end: '09:20', order: 1, is_break: 0 },
      { name: 'คาบที่ 2', start: '09:20', end: '10:10', order: 2, is_break: 0 },
      { name: 'พักเบรค', start: '10:10', end: '10:30', order: 3, is_break: 1 },
      { name: 'คาบที่ 3', start: '10:30', end: '11:20', order: 4, is_break: 0 },
      { name: 'คาบที่ 4', start: '11:20', end: '12:10', order: 5, is_break: 0 },
      { name: 'พักกลางวัน', start: '12:10', end: '13:00', order: 6, is_break: 1 },
      { name: 'คาบที่ 5', start: '13:00', end: '13:50', order: 7, is_break: 0 },
      { name: 'คาบที่ 6', start: '13:50', end: '14:40', order: 8, is_break: 0 },
      { name: 'คาบที่ 7', start: '14:40', end: '15:30', order: 9, is_break: 0 },
    ];

    for (const p of defaultPeriods) {
      await db.query(
        'INSERT INTO periods (school_id, academic_year_id, name, start_time, end_time, period_order, is_break) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [schoolId, ayId, p.name, p.start, p.end, p.order, p.is_break]
      );
    }
    res.redirect(`/app/academic-years/${ayId}/periods?success=สร้างคาบเรียนมาตรฐานแล้ว`);
  } catch (error) {
    res.redirect(`/app/academic-years/${req.params.id}/periods?error=` + encodeURIComponent(error.message));
  }
});

module.exports = router;
