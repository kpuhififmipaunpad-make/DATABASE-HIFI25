const User = require("./model");
const bcrypt = require("bcryptjs");
const moment = require("moment");

/**
 * Controller untuk route user (home, profile, forgot password).
 * Seluruh query Mongoose sudah pakai async/await (tanpa callback) agar kompatibel dengan Mongoose v7+.
 */
module.exports = {
  // GET /
  index: async (req, res) => {
    try {
      let role, nama;
      if (req.isAuthenticated && req.isAuthenticated()) {
        role = req.user.role;
        nama = req.user.nama;
      }
      res.render("home", {
        loggedIn: req.isAuthenticated ? req.isAuthenticated() : false,
        user: role,
        nama: nama,
        message: req.flash("alertMessage"),
        status: req.flash("alertStatus"),
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/");
    }
  },

  // GET /profile
  viewProfile: async (req, res) => {
    try {
      const user = req.user;
      if (user && user.nama !== null) {
        res.render("profile", {
          user,
          message: req.flash("alertMessage"),
          status: req.flash("alertStatus"),
        });
      } else {
        res.redirect("/");
      }
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/");
    }
  },

  // POST /profile
  actionProfile: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        req.flash("alertMessage", "Silakan login terlebih dahulu.");
        req.flash("alertStatus", "red");
        return res.redirect("/auth/login");
      }

      // Ambil payload
      const payload = {
        username: req.body.username,
        // password: req.body.password, // tidak diubah di sini
        nama: req.body.nama,
        npm: req.body.npm,
        ttl: req.body.ttl,
        tgl: req.body.tgl,
        agama: req.body.agama,
        hp: req.body.hp,
        goldar: req.body.goldar,
        email: req.body.email,
        rumah: req.body.rumah,
        kos: req.body.kos,
        pendidikan: req.body.pendidikan,
        panitia: req.body.panitia,
        organisasi: req.body.organisasi,
        pelatihan: req.body.pelatihan,
        prestasi: req.body.prestasi,
        time: moment().utcOffset("+0700").format("YYYY-MM-Do, H:mm:ss"),
      };

      // Cek bentrok username dengan user lain
      if (payload.username) {
        const exists = await User.findOne({ username: payload.username }).lean();
        if (exists && exists._id.toString() !== req.user.id.toString()) {
          req.flash("alertMessage", "username sudah digunakan, coba username lain!");
          req.flash("alertStatus", "red");
          return res.redirect("/profile");
        }
      }

      // Ambil dokumen user saat ini
      const foundUser = await User.findById(req.user.id);
      if (!foundUser) {
        req.flash("alertMessage", "User tidak ditemukan!");
        req.flash("alertStatus", "red");
        return res.redirect("/");
      }

      // Update field yang diizinkan
      foundUser.username = payload.username ?? foundUser.username;
      foundUser.nama = payload.nama ?? foundUser.nama;
      foundUser.npm = payload.npm ?? foundUser.npm;
      foundUser.ttl = payload.ttl ?? foundUser.ttl;
      foundUser.tgl = payload.tgl ?? foundUser.tgl;
      foundUser.agama = payload.agama ?? foundUser.agama;
      foundUser.hp = payload.hp ?? foundUser.hp;
      foundUser.goldar = payload.goldar ?? foundUser.goldar;
      foundUser.email = payload.email ?? foundUser.email;
      foundUser.rumah = payload.rumah ?? foundUser.rumah;
      foundUser.kos = payload.kos ?? foundUser.kos;
      foundUser.pendidikan = payload.pendidikan ?? foundUser.pendidikan;
      foundUser.panitia = payload.panitia ?? foundUser.panitia;
      foundUser.organisasi = payload.organisasi ?? foundUser.organisasi;
      foundUser.pelatihan = payload.pelatihan ?? foundUser.pelatihan;
      foundUser.prestasi = payload.prestasi ?? foundUser.prestasi;
      foundUser.time = payload.time;

      await foundUser.save();

      req.flash("alertMessage", "Data Berhasil Diperbarui!");
      req.flash("alertStatus", "green");
      res.redirect("/");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/");
    }
  },

  // GET /forgot
  viewForgot: async (req, res) => {
    try {
      res.render("forgot", {
        title: "Ubah Password | Database HIFI",
        message: req.flash("alertMessage"),
        status: req.flash("alertStatus"),
      });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/auth/login");
    }
  },

  // POST /forgot
  actionForgot: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      const user = await User.findOne({ username });
      if (!user) {
        req.flash("alertMessage", "Username tidak ditemukan!");
        req.flash("alertStatus", "red");
        return res.redirect("/forgot");
      }

      if (user.email !== email) {
        req.flash("alertMessage", "Email yang dimasukkan salah!");
        req.flash("alertStatus", "red");
        return res.redirect("/forgot");
      }

      // Hash password baru (async/await, tanpa callback)
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      await User.updateOne({ _id: user._id }, { $set: { password: hash } });

      req.flash("alertMessage", "Berhasil merubah password! Silahkan login kembali.");
      req.flash("alertStatus", "green");
      res.redirect("/auth/login");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/auth/login");
    }
  },
};
