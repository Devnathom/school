const express = require('express');
const router = express.Router();

// Dashboard
router.get('/', (req, res) => {
  res.render('dashboard', {
    title: 'แดชบอร์ด',
    page: 'dashboard',
    user: req.session.user,
    success: req.query.success || null,
    error: req.query.error || null
  });
});

module.exports = router;
