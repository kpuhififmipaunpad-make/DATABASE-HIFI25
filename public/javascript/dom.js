/**
 * HIFI Database - DOM Manipulations
 * Basic DOM interactions
 */

// ============================================
// PASSWORD VISIBILITY TOGGLE
// ============================================
function initPasswordToggle() {
  const inputPass = document.getElementById('password');
  const seePass = document.getElementById('seePassButton');
  const seePassIcon = document.getElementById('seePassIcon');
  
  if (!inputPass || !seePass || !seePassIcon) return;
  
  seePass.onclick = (e) => {
    e.preventDefault();
    
    if (inputPass.getAttribute('type') === 'password') {
      inputPass.setAttribute('type', 'text');
      seePassIcon.classList.remove('fa-eye');
      seePassIcon.classList.add('fa-eye-slash');
    } else {
      inputPass.setAttribute('type', 'password');
      seePassIcon.classList.remove('fa-eye-slash');
      seePassIcon.classList.add('fa-eye');
    }
  };
}

// ============================================
// ALERT DISMISS
// ============================================
function dismiss() {
  const alert = document.getElementById("alert-border-3");
  if (!alert) return;
  
  if (alert.classList.contains("hide")) {
    alert.classList.remove("hide");
  } else {
    alert.classList.add("hide");
  }
}

// ============================================
// INITIALIZE ON DOM LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggle();
  
  // Auto dismiss alerts after 5 seconds
  setTimeout(() => {
    const alerts = document.querySelectorAll('.alert-glass:not(.alert-permanent)');
    alerts.forEach(alert => {
      alert.classList.add('hide');
    });
  }, 5000);
});

// Export functions
window.dismissAlert = dismiss;
