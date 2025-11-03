const express = require('express');
const { hasLogin } = require('../middleware/auth');
const router = express.Router();
const { 
  viewLogIn, 
  viewSignUp, 
  actionSignUp, 
  actionLogIn, 
  actionLogOut 
} = require('./controller');

// Guard lokal untuk proteksi logout (minimal change, gak ganggu struktur asli)
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  if (req.session) req.session.returnTo = req.originalUrl || '/';
  req.flash('alertMessage', 'Silakan login terlebih dahulu.');
  req.flash('alertStatus', 'red');
  return res.redirect('/auth/login');
};

/* GET/POST auth routes — tetap sesuai program aslinya */
router.get('/login', hasLogin, viewLogIn);
router.post('/login', actionLogIn);

router.get('/signup', hasLogin, viewSignUp);
router.post('/signup', actionSignUp);

// Logout: Passport 0.6+ butuh callback (ditangani di controller), cukup proteksi di sini
router.get('/logout', requireAuth, actionLogOut);

module.exports = router;
