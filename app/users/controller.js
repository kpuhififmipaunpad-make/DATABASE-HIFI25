const User = require("./model");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const { promisify } = require("util");

const genSaltAsync = promisify(bcrypt.genSalt);
const hashAsync = promisify(bcrypt.hash);

module.exports = {
  index: async (req, res) => {
    try {
      let role, nama;
      if (req.isAuthenticated && req.isAuthenticated()) {
        role = req.user.role;
        nama = req.user.nama;
      }
      res.render("home", {
        loggedIn: req.isAuthenticated && req.isAuthenticated(),
        user: role,
        nama: nama,
        message: req.flash("alertMessage"),
        status: req.flash("alertStatus"),
      });
    } catch (err) {
      console.log(err);
    }
  },

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
    }
  },

  // === FIX utama: hapus semua callback Mongoose, pakai async/await ===
  actionProfile: async (req, res) => {
    try {
      const payload = {
        username: req.body.username,
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

      if (!req.user || !req.user.id) {
        req.flash("alertMessage", "Sesi tidak valid. Silakan login ulang.");
        req.flash("alertStatus", "red");
        return res.redirect("/auth/login");
      }

      // Cek username unik (kecuali milik dirinya)
      const conflict = await User.findOne({
        username: payload.username,
        _id: { $ne: req.user.id },
      }).lean();

      if (conflict) {
        req.flash("alertMessage", "username sudah digunakan, coba username lain!");
        req.flash("alertStatus", "red");
        return res.redirect("/profile");
      }

      // Update profil user sendiri
      const updateDoc = {
        username: payload.username,
        nama: payload.nama,
        npm: payload.npm,
        ttl: payload.ttl,
        tgl: payload.tgl,
        agama: payload.agama,
        goldar: payload.goldar,
        hp: payload.hp,
        email: payload.email,
        rumah: payload.rumah,
        kos: payload.kos,
        pendidikan: payload.pendidikan,
        panitia: payload.panitia,
        organisasi: payload.organisasi,
        pelatihan: payload.pelatihan,
        prestasi: payload.prestasi,
        time: payload.time,
      };

      const updated = await User.findByIdAndUpdate(req.user.id, updateDoc, {
        new: true,
      });

      if (!updated) {
        req.flash("alertMessage", "User tidak ditemukan.");
        req.flash("alertStatus", "red");
        return res.redirect("/");
      }

      req.flash("alertMessage", "Data Berhasil Diperbarui!");
      req.flash("alertStatus", "green");
      return res.redirect("/");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "red");
      return res.redirect("/");
    }
  },

  viewForgot: async (req, res) => {
    try {
      res.render("forgot", {
        title: "Ubah Password | Database HIFI",
        message: req.flash("alertMessage"),
        status: req.flash("alertStatus"),
      });
    } catch (err) {
      console.log(err);
    }
  },

  // === FIX: bcrypt & Mongoose pakai Promise/await (tanpa callback) ===
  actionForgot: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      const user = await User.findOne({ username: username }).lean();
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

      const salt = await genSaltAsync(10);
      const hashed = await hashAsync(password, salt);

      await User.findOneAndUpdate({ username: username }, { password: hashed });

      req.flash(
        "alertMessage",
        "Berhasil merubah password! Silahkan login kembali."
      );
      req.flash("alertStatus", "green");
      return res.redirect("/auth/login");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "red");
      return res.redirect("/auth/login");
    }
  },
};
