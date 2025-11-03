const User = require("../users/model");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const moment = require("moment");
const { promisify } = require("util");

const genSaltAsync = promisify(bcrypt.genSalt);
const hashAsync = promisify(bcrypt.hash);

module.exports = {
  // ========== VIEW ==========
  viewLogIn: async (req, res) => {
    try {
      if (req.isAuthenticated && req.isAuthenticated()) {
        return res.redirect("/");
      }
      res.render("login", {
        message: req.flash("alertMessage"),
        status: req.flash("alertStatus"),
      });
    } catch (err) {
      console.log(err);
      res.redirect("/");
    }
  },

  viewSignUp: async (req, res) => {
    try {
      if (req.isAuthenticated && req.isAuthenticated()) {
        return res.redirect("/");
      }
      res.render("signup", {
        message: req.flash("alertMessage"),
        unameBlank: req.flash("unameMessage"),
        emailBlank: req.flash("emailMessage"),
        passBlank: req.flash("passMessage"),
        status: req.flash("alertStatus"),
        password2: req.flash("password2"),
      });
    } catch (err) {
      console.log(err);
      res.redirect("/");
    }
  },

  // ========== AUTH ==========
  // Login (custom callback biar bisa set flash & redirect sendiri; aman di Passport 0.6+)
  actionLogIn: async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        req.flash("alertMessage", (info && info.message) || "Login gagal");
        req.flash("alertStatus", "red");
        return res.redirect("/auth/login");
      }
      // Passport 0.6+: req.logIn wajib pakai callback
      req.logIn(user, (err2) => {
        if (err2) return next(err2);
        const fallback = user.role === "admin" ? "/dashboard" : "/";
        const redirectTo = (req.session && req.session.returnTo) || fallback;
        if (req.session) delete req.session.returnTo;
        req.flash("alertMessage", "Berhasil masuk.");
        req.flash("alertStatus", "green");
        return res.redirect(redirectTo);
      });
    })(req, res, next);
  },

  // Logout (Passport 0.6+ butuh callback) + bersihkan sesi/cookie
  actionLogOut: async (req, res, next) => {
    req.logout(function (err) {
      if (err) return next(err);
      if (req.session) {
        req.session.destroy(() => {
          res.clearCookie("connect.sid"); // ganti jika nama cookie sesi berbeda
          req.flash("alertMessage", "Logout berhasil!");
          req.flash("alertStatus", "green");
          return res.redirect("/auth/login");
        });
      } else {
        res.clearCookie("connect.sid");
        req.flash("alertMessage", "Logout berhasil!");
        req.flash("alertStatus", "green");
        return res.redirect("/auth/login");
      }
    });
  },

  // Sign Up (tanpa callback bertingkat; aman di Mongoose v7)
  actionSignUp: async (req, res) => {
    try {
      const { username, email, password, password2 } = req.body;

      // Validasi dasar
      if (!username) {
        req.flash("unameMessage", "Username Harus Diisi!");
        req.flash("alertStatus", "red");
        return res.redirect("/auth/signup");
      }
      if (!email) {
        req.flash("emailMessage", "Email Harus Diisi!");
        req.flash("alertStatus", "red");
        return res.redirect("/auth/signup");
      }
      if (!password) {
        req.flash("passMessage", "Password Harus Diisi!");
        req.flash("alertStatus", "red");
        return res.redirect("/auth/signup");
      }
      if (password !== password2) {
        req.flash("password2", "Passwords doesn't match");
        req.flash("alertStatus", "red");
        return res.redirect("/auth/signup");
      }

      // Cek duplikasi username
      const existing = await User.findOne({ username }).lean();
      if (existing) {
        req.flash("alertMessage", "Username sudah digunakan!");
        req.flash("alertStatus", "red");
        return res.redirect("/auth/signup");
      }

      // Hash password
      const salt = await genSaltAsync(10);
      const hashed = await hashAsync(password, salt);

      // Simpan user baru
      const newUser = await User.create({
        username,
        email,
        password: hashed,
        time: moment().utcOffset("+0700").format("YYYY-MM-Do, H:mm:ss"),
      });

      // (Opsional) console.log(newUser);
      req.flash(
        "alertMessage",
        "Berhasil membuat akun! Silahkan login kembali"
      );
      req.flash("alertStatus", "green");
      return res.redirect("/auth/login");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "red");
      return res.redirect("/auth/signup");
    }
  },
};
