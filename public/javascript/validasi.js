/* ============================================
   Validasi Form (Signup) — gabungan lama + baru
   - Tanpa alert pop-up (pakai pesan inline)
   - Tombol submit auto enable/disable
   - Tidak menghalangi submit saat valid (biar Save Password/Autofill jalan)
   - Kompatibel dengan:
       name="validasi_form"
       input#password_1 (atau name="password"/"password_1")
       input#password_2 (atau name="password2"/"password_2")
       <small id="pesan"> untuk status konfirmasi
   ============================================ */

(function () {
  'use strict';

  // ===== Helpers dasar =====
  function getSubmitButton(form) {
    return (
      form.querySelector('button[name="daftar_process"]') ||
      form.querySelector('button[type="submit"]') ||
      null
    );
  }

  function ensureInlineErrorEl(input, idSuffix) {
    const holder = input.closest('.form-group') || input.parentElement || input;
    const id = `${input.name || input.id || idSuffix}-error`;
    let el = holder.querySelector(`small#${id}`);
    if (!el) {
      el = document.createElement('small');
      el.id = id;
      el.style.display = 'block';
      el.style.marginTop = '4px';
      el.style.fontSize = '12px';
      el.style.color = '#6B7280';
      holder.appendChild(el);
    }
    return el;
  }

  function showInlineError(input, message) {
    if (!input) return;
    const el = ensureInlineErrorEl(input);
    el.textContent = message || '';
    el.style.color = message ? '#EF4444' : '#6B7280';
    input.style.outline = message ? '2px solid rgba(239,68,68,.5)' : '';
  }

  function clearInlineErrors(form) {
    form.querySelectorAll('small[id$="-error"]').forEach((el) => {
      el.textContent = '';
      el.style.color = '#6B7280';
    });
    form.querySelectorAll('input').forEach((inp) => {
      inp.style.outline = '';
    });
  }

  function setSubmitEnabled(form, on) {
    const btn = getSubmitButton(form);
    if (btn) btn.disabled = !on;
  }

  // ===== Ambil elemen dengan toleransi nama/id berbeda =====
  function pickField(form, sel) {
    // sel contoh: '#password_1, [name="password"], [name="password_1"]'
    return form.querySelector(sel);
  }

  // ===== VALIDASI FULL PADA SUBMIT =====
  function validasi_input(form) {
    clearInlineErrors(form);

    const minchar = 8;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const username =
      form.elements['username'] || pickField(form, '[name="username"]');
    const email =
      form.elements['email'] || pickField(form, '[name="email"]');

    const pass1 =
      document.getElementById('password_1') ||
      pickField(form, '#password_1, [name="password"], [name="password_1"]');

    const pass2 =
      document.getElementById('password_2') ||
      pickField(form, '#password_2, [name="password2"], [name="password_2"]');

    let ok = true;

    // Username
    if (!username || username.value.trim() === '') {
      showInlineError(username || form, 'Username harus diisi.');
      ok = false;
    } else if (username.value.trim().length < minchar) {
      showInlineError(username, 'Username harus minimal 8 karakter.');
      ok = false;
    } else {
      showInlineError(username, '');
    }

    // Email (kalau ada di form)
    if (email) {
      if (email.value.trim() === '') {
        showInlineError(email, 'Email harus diisi.');
        ok = false;
      } else if (!emailPattern.test(email.value.trim())) {
        showInlineError(email, 'Format email belum benar.');
        ok = false;
      } else {
        showInlineError(email, '');
      }
    }

    // Password 1
    if (!pass1 || pass1.value === '') {
      showInlineError(pass1 || form, 'Password tidak boleh kosong.');
      ok = false;
    } else if (pass1.value.length < 8) {
      showInlineError(pass1, 'Password minimal 8 karakter.');
      ok = false;
    } else {
      showInlineError(pass1, '');
    }

    // Password 2 (konfirmasi) jika ada
    if (pass2) {
      if (pass2.value === '') {
        showInlineError(pass2, 'Konfirmasi password tidak boleh kosong.');
        ok = false;
      } else if (pass1 && pass1.value !== pass2.value) {
        showInlineError(pass2, 'Konfirmasi password belum sama.');
        ok = false;
      } else {
        showInlineError(pass2, '');
      }
    }

    setSubmitEnabled(form, ok);
    // Penting: kembalikan boolean saja. Jangan pakai alert/redirect manual.
    // Kalau true → biarkan browser submit normal (agar Save Password/Autofill muncul).
    return ok;
  }

  // ===== VALIDASI LIVE (saat mengetik) khusus password match =====
  function checkPass() {
    const form =
      document.forms['validasi_form'] || document.querySelector('form');
    if (!form) return true;

    const pass_1 =
      document.getElementById('password_1') ||
      pickField(form, '#password_1, [name="password"], [name="password_1"]');

    const pass_2 =
      document.getElementById('password_2') ||
      pickField(form, '#password_2, [name="password2"], [name="password_2"]');

    const message = document.getElementById('pesan');

    const warnabenar = '#66cc66';
    const warnasalah = '#ff6666';

    if (!pass_1 || !pass_2) return true;

    // Kosong → jangan ganggu user
    if (pass_2.value.length === 0) {
      if (message) {
        message.textContent = '';
        message.style.color = '#6B7280';
      }
      pass_2.style.backgroundColor = '';
      setSubmitEnabled(form, false);
      return false;
    }

    // Minimal panjang
    if (pass_1.value.length < 8) {
      if (message) {
        message.textContent = 'Password minimal 8 karakter.';
        message.style.color = warnasalah;
      }
      pass_2.style.backgroundColor = warnasalah;
      setSubmitEnabled(form, false);
      return false;
    }

    // Kecocokan
    if (pass_1.value === pass_2.value) {
      if (message) {
        message.textContent = 'Password cocok.';
        message.style.color = warnabenar;
      }
      pass_2.style.backgroundColor = warnabenar;
      setSubmitEnabled(form, true);
      return true;
    } else {
      if (message) {
        message.textContent = 'Konfirmasi password belum sama.';
        message.style.color = warnasalah;
      }
      pass_2.style.backgroundColor = warnasalah;
      setSubmitEnabled(form, false);
      return false;
    }
  }

  // ===== Pasang listener otomatis (progressive enhancement) =====
  (function attachLiveValidation() {
    // Cari form validasi (khusus signup). Untuk login, file ini bisa di-load tapi akan "no-op".
    const form =
      document.forms['validasi_form'] || document.querySelector('form[name="validasi_form"]');
    if (!form) return;

    // Status awal tombol submit (disabled sampai password match)
    setSubmitEnabled(form, false);

    // Re-check saat ketik password
    const pass_1 =
      document.getElementById('password_1') ||
      pickField(form, '#password_1, [name="password"], [name="password_1"]');
    const pass_2 =
      document.getElementById('password_2') ||
      pickField(form, '#password_2, [name="password2"], [name="password_2"]');

    if (pass_1) pass_1.addEventListener('input', checkPass);
    if (pass_2) pass_2.addEventListener('input', checkPass);

    // Validasi akhir saat submit
    form.addEventListener('submit', function (e) {
      // Jika tidak lolos → cegah submit
      if (!validasi_input(form)) {
        e.preventDefault();
      }
      // Jika lolos → JANGAN di preventDefault. Biarkan submit normal
      // agar browser bisa menawarkan Save Password/Autofill.
    });
  })();

  // Ekspor ke global jika dipanggil inline di HTML
  window.validasi_input = validasi_input;
  window.checkPass = checkPass;
})();
