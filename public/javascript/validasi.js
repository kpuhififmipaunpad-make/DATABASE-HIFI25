/**
 * HIFI Database - Form Validation
 * Client-side form validation with visual feedback
 */

// ============================================
// VALIDASI INPUT FORM
// ============================================
function validasi_input(form) {
  const minchar = 8; // minimal char dari inputan username
  const pola_email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  
  // Reset all validation states
  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    input.classList.remove('invalid');
  });
  
  // Validasi Username
  if (form.username && form.username.value === "") {
    showValidationError(form.username, "Username Harus Diisi!");
    return false;
  } else if (form.username && form.username.value.length <= minchar) {
    showValidationError(form.username, "Username Harus Lebih dari 8 Karakter!");
    return false;
  }
  
  // Validasi Email
  if (form.email && form.email.value === "") {
    showValidationError(form.email, "Email Harus Diisi!");
    return false;
  } else if (form.email && !pola_email.test(form.email.value)) {
    showValidationError(form.email, "Penulisan Email tidak benar");
    return false;
  }
  
  // Validasi Password
  if (form.password_1 && form.password_1.value === "") {
    showValidationError(form.password_1, "Password Tidak Boleh kosong!");
    return false;
  }
  
  if (form.password_2 && form.password_2.value === "") {
    showValidationError(form.password_2, "Password Tidak Boleh kosong!");
    return false;
  }
  
  // Validasi Password Match
  if (form.password_1 && form.password_2 && 
      form.password_1.value !== form.password_2.value) {
    showValidationError(form.password_2, "Password tidak cocok!");
    return false;
  }
  
  return true;
}

// ============================================
// SHOW VALIDATION ERROR
// ============================================
function showValidationError(inputElement, message) {
  inputElement.classList.add('invalid');
  inputElement.focus();
  
  // Show toast notification
  if (typeof showToast !== 'undefined') {
    showToast(message, 'error');
  } else {
    alert(message);
  }
  
  // Remove error state after 3 seconds
  setTimeout(() => {
    inputElement.classList.remove('invalid');
  }, 3000);
}

// ============================================
// CHECK PASSWORD MATCH
// ============================================
function checkPass() {
  const pass_1 = document.getElementById("password_1");
  const pass_2 = document.getElementById("password_2");
  const message = document.getElementById("pesan");
  const submitBtn = document.querySelector('button[name="daftar_process"]');
  
  if (!pass_1 || !pass_2) return;
  
  const warnabenar = "#66cc66";
  const warnasalah = "#ff6666";
  
  if (pass_1.value === pass_2.value && pass_1.value !== "") {
    // Password cocok
    if (submitBtn) submitBtn.disabled = false;
    pass_2.style.backgroundColor = warnabenar;
    pass_2.classList.remove('invalid');
    pass_2.classList.add('valid');
    
    if (message) {
      message.style.color = warnabenar;
      message.innerHTML = '<i class="fas fa-check-circle"></i> Password cocok';
    }
  } else {
    // Password tidak cocok
    if (submitBtn) submitBtn.disabled = true;
    pass_2.style.backgroundColor = warnasalah;
    pass_2.classList.add('invalid');
    pass_2.classList.remove('valid');
    
    if (message) {
      message.style.color = warnasalah;
      message.innerHTML = '<i class="fas fa-exclamation-circle"></i> Password tidak cocok';
    }
  }
}

// ============================================
// REAL-TIME VALIDATION
// ============================================
function initRealtimeValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    
    inputs.forEach(input => {
      // Validate on blur
      input.addEventListener('blur', function() {
        if (this.value.trim() !== '') {
          this.classList.add('valid');
          this.classList.remove('invalid');
        } else if (this.required) {
          this.classList.add('invalid');
          this.classList.remove('valid');
        }
      });
      
      // Clear validation on focus
      input.addEventListener('focus', function() {
        this.classList.remove('invalid');
      });
    });
    
    // Password confirmation check
    const pass1 = form.querySelector('#password_1');
    const pass2 = form.querySelector('#password_2');
    
    if (pass1 && pass2) {
      pass2.addEventListener('input', checkPass);
      pass2.addEventListener('blur', checkPass);
    }
  });
}

// ============================================
// INITIALIZE ON DOM LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initRealtimeValidation();
  
  // Initialize password check if elements exist
  const pass2 = document.getElementById("password_2");
  if (pass2) {
    pass2.addEventListener('input', checkPass);
    pass2.addEventListener('blur', checkPass);
  }
});

// Export functions for global use
window.validasi_input = validasi_input;
window.checkPass = checkPass;
