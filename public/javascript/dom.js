// dom.js — versi tanpa animasi

(() => {
  // Support login (id="password") dan, kalau perlu, signup (id="password_1")
  const inputPass =
    document.getElementById('password') ||
    document.getElementById('password_1');

  // Tombol bisa #seePassButton (login) atau .password-toggle (fallback)
  const seePass =
    document.getElementById('seePassButton') ||
    document.querySelector('.password-toggle');

  const seePassIcon =
    document.getElementById('seePassIcon') ||
    (seePass ? seePass.querySelector('i') : null);

  if (!inputPass || !seePass || !seePassIcon) return;

  // Cegah double-bind jika file ter-load dua kali
  if (seePass.dataset.bound === '1') return;
  seePass.dataset.bound = '1';

  seePass.addEventListener('click', () => {
    const show = inputPass.type === 'password';
    inputPass.type = show ? 'text' : 'password';

    // Ganti ikon tanpa animasi
    seePassIcon.classList.toggle('fa-eye', !show);
    seePassIcon.classList.toggle('fa-eye-slash', show);

    // Aksesibilitas
    seePass.setAttribute('aria-pressed', String(show));
  });
})();

// Dismiss alert tanpa animasi
function dismiss() {
  const x = document.getElementById('alert-border-3');
  if (!x) return;
  x.classList.add('hide'); // pastikan .hide di CSS menyembunyikan elemen
}
