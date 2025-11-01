/* ============================================
   Validasi Form Daftar (tanpa alert pop-up)
   - Tampilkan pesan inline, bukan alert()
   - Tombol submit auto enable/disable
   - Kompatibel dengan:
       name="validasi_form"
       input#password_1  (name="password")
       input#password_2  (name="password2")
       <small id="pesan"> untuk pesan konfirmasi password
   ============================================ */

// ===== Helpers =====
function getSubmitButton(form) {
  // cari tombol submit bernama daftar_process, kalau tidak ada ambil submit pertama
  return form.querySelector('button[name="daftar_process"]')
      || form.querySelector('button[type="submit"]')
      || null;
}

function ensureInlineErrorEl(input, idSuffix) {
  // buat elemen <small> untuk pesan error di bawah input jika belum ada
  const holder = input.closest('.form-group') || input.parentElement || input;
  const id = `${input.name || input.id || idSuffix}-error`;
  let el = holder.querySelector(`small#${id}`);
  if (!el) {
    el = document.createElement('small');
    el.id = id;
    el.style.display = 'block';
    el.style.marginTop = '4px';
    el.style.fontSize = '12px';
    holder.appendChild(el);
  }
  return el;
}

function showInlineError(input, message) {
  const el = ensureInlineErrorEl(input);
  el.textContent = message || '';
  el.style.color = message ? '#EF4444' : '#6B7280';
  // highlight ringan di input
  input.style.outline = message ? '2px solid rgba(239,68,68,.5)' : '';
}

function clearInlineErrors(form) {
  form.querySelectorAll('small[id$="-error"]').forEach(el => {
    el.textContent = '';
    el.style.color = '#6B7280';
  });
  form.querySelectorAll('input').forEach(inp => {
    inp.style.outline = '';
  });
}

function setSubmitEnabled(form, on) {
  const btn = getSubmitButton(form);
  if (btn) btn.disabled = !on;
}

// ====== VALIDASI SAAT SUBMIT ======
function validasi_input(form) {
  clearInlineErrors(form);

  const minchar = 8;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const username = form.username;
  const email    = form.email;

  // id utk password ada di markup: password_1 / password_2
  // tetapi name-nya adalah password / password2 — kita ambil keduanya aman
  const pass1 = document.getElementById('password_1') || form.password || form['password_1'];
  const pass2 = document.getElementById('password_2') || form.password2 || form['password_2'];

  let ok = true;

  // Username
  if (!username || username.value.trim() === '') {
    showInlineError(username, 'Username harus diisi.');
    ok = false;
  } else if (username.value.trim().length < minchar) {
    showInlineError(username, 'Username harus minimal 8 karakter.');
    ok = false;
  } else {
    showInlineError(username, '');
  }

  // Email
  if (!email || email.value.trim() === '') {
    showInlineError(email, 'Email harus diisi.');
    ok = false;
  } else if (!emailPattern.test(email.value.trim())) {
    showInlineError(email, 'Format email belum benar.');
    ok = false;
  } else {
    showInlineError(email, '');
  }

  // Password 1
  if (!pass1 || pass1.value === '') {
    showInlineError(pass1, 'Password tidak boleh kosong.');
    ok = false;
  } else if (pass1.value.length < 8) {
    showInlineError(pass1, 'Password minimal 8 karakter.');
    ok = false;
  } else {
    showInlineError(pass1, '');
  }

  // Password 2 (konfirmasi)
  if (!pass2 || pass2.value === '') {
    showInlineError(pass2, 'Konfirmasi password tidak boleh kosong.');
    ok = false;
  } else if (pass1 && pass1.value !== pass2.value) {
    showInlineError(pass2, 'Konfirmasi password belum sama.');
    ok = false;
  } else {
    showInlineError(pass2, '');
  }

  setSubmitEnabled(form, ok);
  return ok; // blok submit jika false
}

// ====== VALIDASI SAAT KETIK (PASSWORD MATCH) ======
function checkPass() {
  // Ambil elemen sesuai markup kamu
  const form  = document.forms['validasi_form'] || document.querySelector('form');
  if (!form) return true;

  const pass_1 = document.getElementById('password_1') || form.password || form['password_1'];
  const pass_2 = document.getElementById('password_2') || form.password2 || form['password_2'];
  const message = document.getElementById('pesan'); // ada di HTML kamu

  // Warna status seperti versi lama (tanpa alert)
  const warnabenar = '#66cc66';
  const warnasalah = '#ff6666';

  if (!pass_1 || !pass_2) return true;

  // Jika kosong, jangan ganggu user (hapus pesan & nonaktifkan submit dulu)
  if (pass_2.value.length === 0) {
    if (message) { message.textContent = ''; message.style.color = '#6B7280'; }
    pass_2.style.backgroundColor = '';
    setSubmitEnabled(form, false);
    return false;
  }

  // Minimal panjang
  if (pass_1.value.length < 8) {
    if (message) { message.textContent = 'Password minimal 8 karakter.'; message.style.color = warnasalah; }
    pass_2.style.backgroundColor = warnasalah;
    setSubmitEnabled(form, false);
    return false;
  }

  // Cek kecocokan
  if (pass_1.value === pass_2.value) {
    if (message) { message.textContent = 'Password cocok.'; message.style.color = warnabenar; }
    pass_2.style.backgroundColor = warnabenar;
    setSubmitEnabled(form, true);
    return true;
  } else {
    if (message) { message.textContent = 'Konfirmasi password belum sama.'; message.style.color = warnasalah; }
    pass_2.style.backgroundColor = warnasalah;
    setSubmitEnabled(form, false);
    return false;
  }
}

/* Opsional: pasang listener agar UX halus tanpa alert */
(function attachLiveValidation(){
  const form = document.forms['validasi_form'] || document.querySelector('form');
  if (!form) return;

  const pass_1 = document.getElementById('password_1') || form.password || form['password_1'];
  const pass_2 = document.getElementById('password_2') || form.password2 || form['password_2'];

  // aktifkan/cek awal state tombol
  setSubmitEnabled(form, false);

  // re-check on typing
  if (pass_1) pass_1.addEventListener('input', checkPass);
  if (pass_2) pass_2.addEventListener('input', checkPass);

  // cegah submit jika tidak lolos validasi_input
  form.addEventListener('submit', function(e){
    if (!validasi_input(form)) e.preventDefault();
  });
})();
