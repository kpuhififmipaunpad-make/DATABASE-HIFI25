// controller.js — actionProfile (versi async/await, tanpa callback)
actionProfile: async (req, res) => {
  try {
    const payload = {
      username: req.body.username,
      password: req.body.password, // (nggak dipakai di update profil)
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
      time: require('moment')().utcOffset('+0700').format("YYYY-MM-Do, H:mm:ss"),
    };

    // Cek username sudah dipakai user lain?
    const exists = await User.findOne({ username: payload.username }).lean();
    if (exists && exists._id.toString() !== req.user.id.toString()) {
      req.flash('alertMessage', 'username sudah digunakan, coba username lain!');
      req.flash('alertStatus', 'red');
      return res.redirect('/profile');
    }

    // Ambil dokumen user saat ini
    const foundUser = await User.findById(req.user.id); // <- TANPA callback
    if (!foundUser) {
      req.flash('alertMessage', 'User tidak ditemukan!');
      req.flash('alertStatus', 'red');
      return res.redirect('/');
    }

    // Salin field yang diizinkan
    foundUser.username   = payload.username;
    foundUser.nama       = payload.nama;
    foundUser.npm        = payload.npm;
    foundUser.ttl        = payload.ttl;
    foundUser.tgl        = payload.tgl;
    foundUser.agama      = payload.agama;
    foundUser.goldar     = payload.goldar;
    foundUser.hp         = payload.hp;
    foundUser.email      = payload.email;
    foundUser.rumah      = payload.rumah;
    foundUser.kos        = payload.kos;
    foundUser.pendidikan = payload.pendidikan;
    foundUser.panitia    = payload.panitia;
    foundUser.organisasi = payload.organisasi;
    foundUser.pelatihan  = payload.pelatihan;
    foundUser.prestasi   = payload.prestasi;
    foundUser.time       = payload.time;

    await foundUser.save(); // <- TANPA callback

    req.flash('alertMessage', 'Data Berhasil Diperbarui!');
    req.flash('alertStatus', 'green');
    res.redirect('/');
  } catch (err) {
    req.flash('alertMessage', `${err.message}`);
    req.flash('alertStatus', 'red');
    res.redirect('/');
  }
},
