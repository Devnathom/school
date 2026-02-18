const express = require('express');
const router = express.Router();
const db = require('../db');

const DAY_NAMES = ['', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'];

// Helper: get current academic year
async function getCurrentAY(schoolId) {
  const [[ay]] = await db.query(
    'SELECT * FROM academic_years WHERE school_id = ? AND is_current = TRUE LIMIT 1',
    [schoolId]
  );
  return ay;
}

// Helper: detect conflicts
async function detectConflicts(schoolId, ayId) {
  const conflicts = [];

  // 1. Teacher conflicts: same teacher at same day+period
  const [teacherConflicts] = await db.query(`
    SELECT t1.id as id1, t2.id as id2,
      t1.day_of_week, p.name as period_name, p.start_time, p.end_time,
      tc.firstName as teacher_first, tc.lastName as teacher_last,
      c1.name as class1_name, c2.name as class2_name,
      s1.name as subject1_name, s2.name as subject2_name
    FROM timetable t1
    JOIN timetable t2 ON t1.teacher_id = t2.teacher_id
      AND t1.day_of_week = t2.day_of_week
      AND t1.period_id = t2.period_id
      AND t1.id < t2.id
      AND t1.academic_year_id = t2.academic_year_id
    JOIN periods p ON t1.period_id = p.id
    JOIN teachers tc ON t1.teacher_id = tc.id
    JOIN classes c1 ON t1.class_id = c1.id
    JOIN classes c2 ON t2.class_id = c2.id
    JOIN subjects s1 ON t1.subject_id = s1.id
    JOIN subjects s2 ON t2.subject_id = s2.id
    WHERE t1.academic_year_id = ? AND t1.school_id = ?
  `, [ayId, schoolId]);

  teacherConflicts.forEach(c => {
    conflicts.push({
      type: 'teacher',
      severity: 'danger',
      icon: 'fa-chalkboard-teacher',
      message: `ครู ${c.teacher_first} ${c.teacher_last} สอนซ้อนกัน วัน${DAY_NAMES[c.day_of_week]} ${c.period_name} (${c.start_time}-${c.end_time})`,
      detail: `${c.class1_name} (${c.subject1_name}) ชนกับ ${c.class2_name} (${c.subject2_name})`,
      ids: [c.id1, c.id2]
    });
  });

  // 2. Room conflicts: same room at same day+period
  const [roomConflicts] = await db.query(`
    SELECT t1.id as id1, t2.id as id2,
      t1.day_of_week, p.name as period_name, p.start_time, p.end_time,
      r.name as room_name,
      c1.name as class1_name, c2.name as class2_name
    FROM timetable t1
    JOIN timetable t2 ON t1.room_id = t2.room_id
      AND t1.day_of_week = t2.day_of_week
      AND t1.period_id = t2.period_id
      AND t1.id < t2.id
      AND t1.academic_year_id = t2.academic_year_id
    JOIN periods p ON t1.period_id = p.id
    JOIN rooms r ON t1.room_id = r.id
    JOIN classes c1 ON t1.class_id = c1.id
    JOIN classes c2 ON t2.class_id = c2.id
    WHERE t1.academic_year_id = ? AND t1.school_id = ? AND t1.room_id IS NOT NULL
  `, [ayId, schoolId]);

  roomConflicts.forEach(c => {
    conflicts.push({
      type: 'room',
      severity: 'warning',
      icon: 'fa-door-open',
      message: `ห้อง ${c.room_name} ถูกใช้ซ้อนกัน วัน${DAY_NAMES[c.day_of_week]} ${c.period_name} (${c.start_time}-${c.end_time})`,
      detail: `${c.class1_name} ชนกับ ${c.class2_name}`,
      ids: [c.id1, c.id2]
    });
  });

  return conflicts;
}

// Main timetable view
router.get('/', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    const ay = await getCurrentAY(schoolId);
    if (!ay) {
      return res.render('timetable/index', {
        title: 'ตารางเรียน',
        page: 'timetable',
        user: req.session.user,
        noAY: true,
        classes: [], periods: [], timetableData: {}, conflicts: [],
        selectedClassId: null, dayNames: DAY_NAMES,
        success: null, error: 'กรุณาสร้างและเลือกปีการศึกษาปัจจุบันก่อน'
      });
    }

    const [classes] = await db.query('SELECT * FROM classes WHERE school_id = ? ORDER BY name', [schoolId]);
    const [periods] = await db.query(
      'SELECT * FROM periods WHERE academic_year_id = ? AND school_id = ? ORDER BY period_order',
      [ay.id, schoolId]
    );

    const selectedClassId = req.query.class_id || (classes.length > 0 ? classes[0].id : null);

    // Get timetable entries for selected class
    let timetableData = {};
    if (selectedClassId) {
      const [entries] = await db.query(`
        SELECT t.*, s.name as subject_name, s.code as subject_code,
          tc.firstName as teacher_first, tc.lastName as teacher_last,
          r.name as room_name, p.period_order
        FROM timetable t
        JOIN subjects s ON t.subject_id = s.id
        JOIN teachers tc ON t.teacher_id = tc.id
        LEFT JOIN rooms r ON t.room_id = r.id
        JOIN periods p ON t.period_id = p.id
        WHERE t.academic_year_id = ? AND t.class_id = ? AND t.school_id = ?
        ORDER BY t.day_of_week, p.period_order
      `, [ay.id, selectedClassId, schoolId]);

      entries.forEach(e => {
        const key = `${e.day_of_week}_${e.period_id}`;
        timetableData[key] = e;
      });
    }

    const conflicts = await detectConflicts(schoolId, ay.id);

    res.render('timetable/index', {
      title: 'ตารางเรียน',
      page: 'timetable',
      user: req.session.user,
      noAY: false,
      academicYear: ay,
      classes,
      periods,
      timetableData,
      conflicts,
      selectedClassId: parseInt(selectedClassId),
      dayNames: DAY_NAMES,
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (error) {
    res.render('timetable/index', {
      title: 'ตารางเรียน',
      page: 'timetable',
      user: req.session.user,
      noAY: true,
      classes: [], periods: [], timetableData: {}, conflicts: [],
      selectedClassId: null, dayNames: DAY_NAMES,
      success: null, error: error.message
    });
  }
});

// Class-Subjects management (what to schedule)
router.get('/class-subjects', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    const ay = await getCurrentAY(schoolId);
    if (!ay) return res.redirect('/app/academic-years?error=กรุณาเลือกปีการศึกษาปัจจุบันก่อน');

    const [classes] = await db.query('SELECT * FROM classes WHERE school_id = ? ORDER BY name', [schoolId]);
    const [subjects] = await db.query('SELECT * FROM subjects WHERE school_id = ? ORDER BY name', [schoolId]);
    const [teachers] = await db.query('SELECT * FROM teachers WHERE school_id = ? AND status = ? ORDER BY firstName', [schoolId, 'active']);
    const [classSubjects] = await db.query(`
      SELECT cs.*, c.name as class_name, s.name as subject_name, s.code as subject_code,
        t.firstName as teacher_first, t.lastName as teacher_last
      FROM class_subjects cs
      JOIN classes c ON cs.class_id = c.id
      JOIN subjects s ON cs.subject_id = s.id
      JOIN teachers t ON cs.teacher_id = t.id
      WHERE cs.academic_year_id = ? AND cs.school_id = ?
      ORDER BY c.name, s.name
    `, [ay.id, schoolId]);

    res.render('timetable/class-subjects', {
      title: 'จัดวิชาเรียน',
      page: 'timetable',
      user: req.session.user,
      academicYear: ay,
      classes, subjects, teachers, classSubjects,
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (error) {
    res.redirect('/app/timetable?error=' + encodeURIComponent(error.message));
  }
});

// Add class-subject
router.post('/class-subjects/add', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    const ay = await getCurrentAY(schoolId);
    const { class_id, subject_id, teacher_id, periods_per_week } = req.body;
    await db.query(
      'INSERT INTO class_subjects (school_id, academic_year_id, class_id, subject_id, teacher_id, periods_per_week) VALUES (?, ?, ?, ?, ?, ?)',
      [schoolId, ay.id, class_id, subject_id, teacher_id, periods_per_week || 1]
    );
    res.redirect('/app/timetable/class-subjects?success=เพิ่มรายวิชาสำเร็จ');
  } catch (error) {
    res.redirect('/app/timetable/class-subjects?error=' + encodeURIComponent(error.message));
  }
});

// Delete class-subject
router.get('/class-subjects/delete/:id', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    await db.query('DELETE FROM class_subjects WHERE id = ? AND school_id = ?', [req.params.id, schoolId]);
    res.redirect('/app/timetable/class-subjects?success=ลบรายวิชาสำเร็จ');
  } catch (error) {
    res.redirect('/app/timetable/class-subjects?error=' + encodeURIComponent(error.message));
  }
});

// Add single timetable entry (manual)
router.post('/add', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    const ay = await getCurrentAY(schoolId);
    const { class_id, subject_id, teacher_id, room_id, day_of_week, period_id } = req.body;

    await db.query(
      'INSERT INTO timetable (school_id, academic_year_id, class_id, subject_id, teacher_id, room_id, day_of_week, period_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [schoolId, ay.id, class_id, subject_id, teacher_id, room_id || null, day_of_week, period_id]
    );
    res.redirect(`/app/timetable?class_id=${class_id}&success=เพิ่มตารางเรียนสำเร็จ`);
  } catch (error) {
    const classId = req.body.class_id || '';
    res.redirect(`/app/timetable?class_id=${classId}&error=` + encodeURIComponent(error.message));
  }
});

// Delete timetable entry
router.get('/delete/:id', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    const [[entry]] = await db.query('SELECT class_id FROM timetable WHERE id = ? AND school_id = ?', [req.params.id, schoolId]);
    await db.query('DELETE FROM timetable WHERE id = ? AND school_id = ?', [req.params.id, schoolId]);
    res.redirect(`/app/timetable?class_id=${entry ? entry.class_id : ''}&success=ลบรายการสำเร็จ`);
  } catch (error) {
    res.redirect('/app/timetable?error=' + encodeURIComponent(error.message));
  }
});

// ==========================================
// AUTO-SCHEDULING ALGORITHM
// ==========================================
router.post('/auto-generate', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    const ay = await getCurrentAY(schoolId);
    if (!ay) return res.redirect('/app/timetable?error=ไม่พบปีการศึกษาปัจจุบัน');

    // Get all needed data
    const [classSubjects] = await db.query(
      'SELECT * FROM class_subjects WHERE academic_year_id = ? AND school_id = ?',
      [ay.id, schoolId]
    );
    const [periods] = await db.query(
      'SELECT * FROM periods WHERE academic_year_id = ? AND school_id = ? AND is_break = FALSE ORDER BY period_order',
      [ay.id, schoolId]
    );
    const [rooms] = await db.query(
      'SELECT * FROM rooms WHERE school_id = ? AND is_active = TRUE ORDER BY name',
      [schoolId]
    );

    if (classSubjects.length === 0) {
      return res.redirect('/app/timetable/class-subjects?error=กรุณาเพิ่มรายวิชาสำหรับชั้นเรียนก่อน');
    }
    if (periods.length === 0) {
      return res.redirect('/app/academic-years?error=กรุณาตั้งค่าคาบเรียนก่อน');
    }

    // Delete existing non-locked entries
    await db.query(
      'DELETE FROM timetable WHERE academic_year_id = ? AND school_id = ? AND is_locked = FALSE',
      [ay.id, schoolId]
    );

    // Build scheduling tasks: expand class_subjects into individual period slots
    const tasks = [];
    for (const cs of classSubjects) {
      for (let i = 0; i < cs.periods_per_week; i++) {
        tasks.push({
          class_id: cs.class_id,
          subject_id: cs.subject_id,
          teacher_id: cs.teacher_id
        });
      }
    }

    // Shuffle tasks for better distribution
    for (let i = tasks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tasks[i], tasks[j]] = [tasks[j], tasks[i]];
    }

    // Sort tasks by constraint level (teachers with most subjects first)
    const teacherLoad = {};
    tasks.forEach(t => {
      teacherLoad[t.teacher_id] = (teacherLoad[t.teacher_id] || 0) + 1;
    });
    tasks.sort((a, b) => teacherLoad[b.teacher_id] - teacherLoad[a.teacher_id]);

    // Track occupied slots
    const classSlots = {};    // classId_day_periodId -> true
    const teacherSlots = {};  // teacherId_day_periodId -> true
    const roomSlots = {};     // roomId_day_periodId -> true

    // Load locked entries
    const [lockedEntries] = await db.query(
      'SELECT * FROM timetable WHERE academic_year_id = ? AND school_id = ? AND is_locked = TRUE',
      [ay.id, schoolId]
    );
    lockedEntries.forEach(e => {
      classSlots[`${e.class_id}_${e.day_of_week}_${e.period_id}`] = true;
      teacherSlots[`${e.teacher_id}_${e.day_of_week}_${e.period_id}`] = true;
      if (e.room_id) roomSlots[`${e.room_id}_${e.day_of_week}_${e.period_id}`] = true;
    });

    // Track how many periods each subject already has per day per class
    const classSubjectDayCount = {}; // classId_subjectId_day -> count

    const days = [1, 2, 3, 4, 5]; // Mon-Fri
    let placed = 0;
    let failed = 0;

    for (const task of tasks) {
      let bestSlot = null;
      let bestScore = -1;

      for (const day of days) {
        for (const period of periods) {
          const classKey = `${task.class_id}_${day}_${period.id}`;
          const teacherKey = `${task.teacher_id}_${day}_${period.id}`;

          // Check class and teacher availability
          if (classSlots[classKey] || teacherSlots[teacherKey]) continue;

          // Score this slot (prefer spreading subjects across days)
          const csdKey = `${task.class_id}_${task.subject_id}_${day}`;
          const dayCount = classSubjectDayCount[csdKey] || 0;

          // Prefer days where this subject hasn't been scheduled yet
          let score = 10 - dayCount * 5;
          // Prefer earlier periods slightly
          score += (periods.length - period.period_order) * 0.1;
          // Add small random factor
          score += Math.random() * 0.5;

          if (score > bestScore) {
            bestScore = score;
            bestSlot = { day, period_id: period.id };
          }
        }
      }

      if (bestSlot) {
        // Find available room
        let roomId = null;
        for (const room of rooms) {
          const roomKey = `${room.id}_${bestSlot.day}_${bestSlot.period_id}`;
          if (!roomSlots[roomKey]) {
            roomId = room.id;
            roomSlots[roomKey] = true;
            break;
          }
        }

        await db.query(
          'INSERT INTO timetable (school_id, academic_year_id, class_id, subject_id, teacher_id, room_id, day_of_week, period_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [schoolId, ay.id, task.class_id, task.subject_id, task.teacher_id, roomId, bestSlot.day, bestSlot.period_id]
        );

        classSlots[`${task.class_id}_${bestSlot.day}_${bestSlot.period_id}`] = true;
        teacherSlots[`${task.teacher_id}_${bestSlot.day}_${bestSlot.period_id}`] = true;

        const csdKey = `${task.class_id}_${task.subject_id}_${bestSlot.day}`;
        classSubjectDayCount[csdKey] = (classSubjectDayCount[csdKey] || 0) + 1;

        placed++;
      } else {
        failed++;
      }
    }

    const msg = `จัดตารางอัตโนมัติเสร็จ: สำเร็จ ${placed} รายการ` + (failed > 0 ? `, ไม่สามารถจัด ${failed} รายการ (คาบเต็ม)` : '');
    res.redirect('/app/timetable?success=' + encodeURIComponent(msg));
  } catch (error) {
    res.redirect('/app/timetable?error=' + encodeURIComponent(error.message));
  }
});

// Conflict analysis page
router.get('/conflicts', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    const ay = await getCurrentAY(schoolId);
    if (!ay) return res.redirect('/app/academic-years?error=กรุณาเลือกปีการศึกษาปัจจุบันก่อน');

    const conflicts = await detectConflicts(schoolId, ay.id);

    // Teacher workload analysis
    const [teacherWorkload] = await db.query(`
      SELECT t.id, t.firstName, t.lastName,
        COUNT(tt.id) as total_periods,
        COUNT(DISTINCT tt.day_of_week) as teaching_days,
        GROUP_CONCAT(DISTINCT CONCAT(c.name) SEPARATOR ', ') as classes
      FROM teachers t
      LEFT JOIN timetable tt ON t.id = tt.teacher_id AND tt.academic_year_id = ?
      LEFT JOIN classes c ON tt.class_id = c.id
      WHERE t.school_id = ? AND t.status = 'active'
      GROUP BY t.id
      ORDER BY total_periods DESC
    `, [ay.id, schoolId]);

    // Class schedule completeness
    const [classLoad] = await db.query(`
      SELECT c.id, c.name,
        COUNT(tt.id) as scheduled_periods,
        COALESCE(SUM(cs_needed.total_needed), 0) as total_needed
      FROM classes c
      LEFT JOIN timetable tt ON c.id = tt.class_id AND tt.academic_year_id = ?
      LEFT JOIN (
        SELECT class_id, SUM(periods_per_week) as total_needed
        FROM class_subjects WHERE academic_year_id = ? AND school_id = ?
        GROUP BY class_id
      ) cs_needed ON c.id = cs_needed.class_id
      WHERE c.school_id = ?
      GROUP BY c.id
      ORDER BY c.name
    `, [ay.id, ay.id, schoolId, schoolId]);

    res.render('timetable/conflicts', {
      title: 'วิเคราะห์ตารางเรียน',
      page: 'timetable',
      user: req.session.user,
      academicYear: ay,
      conflicts,
      teacherWorkload,
      classLoad,
      dayNames: DAY_NAMES,
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (error) {
    res.redirect('/app/timetable?error=' + encodeURIComponent(error.message));
  }
});

// Teacher timetable view
router.get('/teacher/:teacherId', async (req, res) => {
  try {
    const schoolId = req.session.user.school_id;
    const ay = await getCurrentAY(schoolId);
    if (!ay) return res.redirect('/app/timetable?error=ไม่พบปีการศึกษาปัจจุบัน');

    const [[teacher]] = await db.query('SELECT * FROM teachers WHERE id = ? AND school_id = ?', [req.params.teacherId, schoolId]);
    if (!teacher) return res.redirect('/app/timetable?error=ไม่พบข้อมูลครู');

    const [periods] = await db.query(
      'SELECT * FROM periods WHERE academic_year_id = ? AND school_id = ? ORDER BY period_order',
      [ay.id, schoolId]
    );

    const [entries] = await db.query(`
      SELECT t.*, s.name as subject_name, s.code as subject_code,
        c.name as class_name, r.name as room_name, p.period_order
      FROM timetable t
      JOIN subjects s ON t.subject_id = s.id
      JOIN classes c ON t.class_id = c.id
      LEFT JOIN rooms r ON t.room_id = r.id
      JOIN periods p ON t.period_id = p.id
      WHERE t.teacher_id = ? AND t.academic_year_id = ? AND t.school_id = ?
      ORDER BY t.day_of_week, p.period_order
    `, [req.params.teacherId, ay.id, schoolId]);

    const timetableData = {};
    entries.forEach(e => {
      timetableData[`${e.day_of_week}_${e.period_id}`] = e;
    });

    res.render('timetable/teacher-view', {
      title: `ตารางสอน - ${teacher.firstName} ${teacher.lastName}`,
      page: 'timetable',
      user: req.session.user,
      teacher,
      academicYear: ay,
      periods,
      timetableData,
      dayNames: DAY_NAMES,
      success: null, error: null
    });
  } catch (error) {
    res.redirect('/app/timetable?error=' + encodeURIComponent(error.message));
  }
});

module.exports = router;
