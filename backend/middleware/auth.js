// Authentication Middleware

const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.locals.user = req.session.user;
  next();
};

const requireSchoolAdmin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  if (req.session.user.role !== 'school_admin' && req.session.user.role !== 'super_admin') {
    return res.status(403).render('404');
  }
  res.locals.user = req.session.user;
  next();
};

const requireSuperAdmin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  if (req.session.user.role !== 'super_admin') {
    return res.status(403).render('404');
  }
  res.locals.user = req.session.user;
  next();
};

module.exports = { requireLogin, requireSchoolAdmin, requireSuperAdmin };
