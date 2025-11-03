const User = require("./model");
const bcrypt = require("bcryptjs");
const moment = require('moment');

module.exports = {
  index: async (req, res) => {
    try {
      let role, nama
      if (req.isAuthenticated()) {
        role = req.user.role;
        nama = req.user.nama;
      }
      res.render('home', {
        loggedIn: req.isAuthenticated(),
        user: role,
        nama: nama,
        message: req.flash('alertMessage'),
        status: req.flash('alertStatus')
      });
    } catch (err) {
      console.log(err);
    }
  },

  viewProfile: async (req, res) => {
    try {
      const user = req.user
      if (req.user.nama !== null) {
        res.render('profile', {
          user,
          message: req.flash('alertMessage'),
          status: req.flash('alertStatus'),
        });
      }
      else {
        res.redirect('/');
      }
    } catch (err) {
      console.log(err);
    }
  },

  // ==== FIX: hapus semua callback Mongoose → pakai async/await ====
  actionProfile: async (req, res) => {
    try {
      const payload = {
        username: req.body.username,
        password: req.body.password,
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
        time: moment(Date()).utcOffset('+0700').format("YYYY-MM-Do, H:mm:ss"),
      };

      // Cek apakah username dipakai orang lain (kecuali dirinya sendiri)
      const existing = await User.findOne({ username: payload.username }).lean();
      if (existing && String(existing._id) !== String(req.user.id)) {
        req.flash('alertMessage', 'username sudah digunakan, coba username lain!');
        req.flash('alertStatus', 'red');
        return res.redirect('/profile');
      }

      // Ambil dokumen user sendiri lalu update field-fieldnya
      const foundUser = await User.findById(req.user.id);
      if (!foundUser) {
        req.flash('alertMessage', 'User tidak ditemukan.');
        req.flash('alertStatus', 'red');
        return res.redirect('/');
      }

      foundUser.username = payload.username;
      foundUser.nama = payload.nama;
      foundUser.npm = payload.npm;
      foundUser.ttl = payload.ttl;
      foundUser.tgl = payload.tgl;
      foundUser.agama = payload.agama;
      foundUser.goldar = payload.goldar;
      foundUser.hp = payload.hp;
      foundUser.email = payload.email;
      foundUser.rumah = payload.rumah;
      foundUser.kos = payload.kos;
      foundUser.pendidikan = payload.pendidikan;
      foundUser.panitia = payload.panitia;
      foundUser.organisasi = payload.organisasi;
      foundUser.pelatihan = payload.pelatihan;
      foundUser.prestasi = payload.prestasi;
      foundUser.time = moment(Date()).utcOffset('+0700').format("YYYY-MM-Do, H:mm:ss");

      await foundUser.save();

      req.flash('alertMessage', 'Data Berhasil Diperbarui!');
      req.flash('alertStatus', 'green');
      return res.redirect("/");

    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'red');
      return res.redirect('/');
    }
  },

  viewForgot: async (req, res) => {
    try {
      res.render("forgot", {
        title: 'Ubah Password | Database HIFI',
        message: req.flash('alertMessage'),
        status: req.flash('alertStatus')
      });
    } catch (err) {
      console.log(err);
    }
  },

  // ==== (dirapikan) tanpa callback bertingkat, tetap sama perilakunya ====
  actionForgot: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      const user = await User.findOne({ username: username });
      if (!user) {
        req.flash('alertMessage', 'Username tidak ditemukan!');
        req.flash('alertStatus', 'red');
        return res.redirect('/forgot');
      }

      if (user.email != email) {
        req.flash('alertMessage', 'Email yang dimasukkan salah!');
        req.flash('alertStatus', 'red');
        return res.redirect('/forgot');
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      await User.findOneAndUpdate(
        { username: username },
        { password: hash }
      );

      console.log(user);
      req.flash('alertMessage', 'Berhasil merubah password! Silahkan login kembali.');
      req.flash('alertStatus', 'green');
      return res.redirect('/auth/login');

    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'red');
      return res.redirect('/auth/login');
    }
  },
}
