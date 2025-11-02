const inputPass = document.getElementById('password');
const seePass = document.getElementById('seePassButton');
const seePassIcon = document.getElementById('seePassIcon');

// Add smooth transition styles dynamically
if (seePassIcon) {
   seePassIcon.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
}

if (seePass) {
   seePass.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
}

if (inputPass) {
   inputPass.style.transition = 'all 0.3s ease-in-out';
}

seePass.onclick = () => {
   if(inputPass.getAttribute('type') === 'password') {
      // Add satisfying animations
      
      // Button press effect
      seePass.style.transform = 'scale(0.9)';
      setTimeout(() => {
         seePass.style.transform = 'scale(1)';
      }, 150);
      
      // Icon rotation and fade effect
      seePassIcon.style.opacity = '0';
      seePassIcon.style.transform = 'rotate(180deg) scale(0.8)';
      
      setTimeout(() => {
         inputPass.setAttribute('type', 'text');
         seePassIcon.classList.remove('fa-eye');
         seePassIcon.classList.add('fa-eye-slash');
         
         // Animate icon back
         seePassIcon.style.opacity = '1';
         seePassIcon.style.transform = 'rotate(360deg) scale(1)';
      }, 150);
      
      // Input field subtle highlight
      inputPass.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
      setTimeout(() => {
         inputPass.style.backgroundColor = '';
      }, 300);
      
   } else {
      // Button press effect
      seePass.style.transform = 'scale(0.9)';
      setTimeout(() => {
         seePass.style.transform = 'scale(1)';
      }, 150);
      
      // Icon rotation and fade effect
      seePassIcon.style.opacity = '0';
      seePassIcon.style.transform = 'rotate(-180deg) scale(0.8)';
      
      setTimeout(() => {
         inputPass.setAttribute('type', 'password');
         seePassIcon.classList.remove('fa-eye-slash');
         seePassIcon.classList.add('fa-eye');
         
         // Animate icon back
         seePassIcon.style.opacity = '1';
         seePassIcon.style.transform = 'rotate(0deg) scale(1)';
      }, 150);
      
      // Input field subtle highlight
      inputPass.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
      setTimeout(() => {
         inputPass.style.backgroundColor = '';
      }, 300);
   }
}

// Enhanced dismiss function with smooth slide animation
function dismiss() {
   var x = document.getElementById("alert-border-3");
   
   if (!x) return;
   
   // Add transition if not already set
   if (!x.style.transition) {
      x.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
   }
   
   if (x.classList.contains("hide")) {
      // Show with slide down and fade in
      x.style.opacity = '0';
      x.style.transform = 'translateY(-20px)';
      x.classList.remove("hide");
      
      // Force reflow
      x.offsetHeight;
      
      requestAnimationFrame(() => {
         x.style.opacity = '1';
         x.style.transform = 'translateY(0)';
      });
   } else {
      // Hide with slide up and fade out
      x.style.opacity = '0';
      x.style.transform = 'translateY(-20px)';
      
      setTimeout(() => {
         x.classList.add("hide");
         x.style.transform = 'translateY(0)';
      }, 400);
   }
}

// Optional: Add ripple effect on button click
seePass.addEventListener('mousedown', function(e) {
   const ripple = document.createElement('span');
   const rect = this.getBoundingClientRect();
   const size = Math.max(rect.width, rect.height);
   const x = e.clientX - rect.left - size / 2;
   const y = e.clientY - rect.top - size / 2;
   
   ripple.style.width = ripple.style.height = size + 'px';
   ripple.style.left = x + 'px';
   ripple.style.top = y + 'px';
   ripple.style.position = 'absolute';
   ripple.style.borderRadius = '50%';
   ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
   ripple.style.transform = 'scale(0)';
   ripple.style.animation = 'ripple 0.6s ease-out';
   ripple.style.pointerEvents = 'none';
   
   // Ensure button has position relative
   if (getComputedStyle(this).position === 'static') {
      this.style.position = 'relative';
   }
   this.style.overflow = 'hidden';
   
   this.appendChild(ripple);
   
   setTimeout(() => {
      ripple.remove();
   }, 600);
});

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
   @keyframes ripple {
      to {
         transform: scale(4);
         opacity: 0;
      }
   }
`;
document.head.appendChild(style);
