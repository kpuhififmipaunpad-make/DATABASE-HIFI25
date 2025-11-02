// /javascript/dom.js (revisi aman lintas halaman)
(() => {
  // Cari elemen secara defensif
  const pwd = document.getElementById('password') || document.getElementById('password_1');
  const btn = document.getElementById('seePassButton');
  const icon = document.getElementById('seePassIcon');

  // Pasang toggle hanya bila semua elemen ada
  if (pwd && btn && icon) {
    // Hindari double-bind: hapus listener lama bila ada
    btn.onclick = null;

    btn.addEventListener('click', () => {
      const toText = pwd.type === 'password';
      pwd.type = toText ? 'text' : 'password';
      icon.classList.toggle('fa-eye', !toText);
      icon.classList.toggle('fa-eye-slash', toText);
      btn.setAttribute('aria-pressed', String(toText));
    }, { passive: true });
  }

  // Pastikan form login “ramah” autofill & save password
  const form = document.forms['login'] || document.querySelector('form[action="/auth/login"]');
  if (form) {
    form.setAttribute('autocomplete', 'on');
    const u = form.querySelector('[name="username"]');
    const p = form.querySelector('[name="password"]');
    if (u) {
      u.setAttribute('autocomplete', 'username');
      u.setAttribute('autocapitalize', 'none');
      u.setAttribute('spellcheck', 'false');
      // Penting: jangan pakai inputmode numerik agar keyboard HP tidak terpaksa angka
      u.removeAttribute('inputmode');
      u.removeAttribute('pattern');
      u.type = 'text';
    }
    if (p) p.setAttribute('autocomplete', 'current-password');
  }

  // Dismiss alert: tutup tegas (bukan toggle)
  window.dismiss = function () {
    const x = document.getElementById('alert-border-3');
    if (!x) return;
    x.classList.add('hide');
  };
})();
