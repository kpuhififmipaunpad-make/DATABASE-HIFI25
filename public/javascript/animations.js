/**
 * HIFI Database - Morphing Animations
 * Satisfying animations dengan morphing effects
 */

// ============================================
// MORPHING BACKGROUND SHAPES
// ============================================
function initMorphingShapes() {
  const shapes = document.querySelectorAll('.bg-shape');
  
  shapes.forEach((shape, index) => {
    let rotation = 0;
    setInterval(() => {
      rotation += 0.5;
      shape.style.transform = `rotate(${rotation}deg) scale(${1 + Math.sin(rotation / 50) * 0.1})`;
    }, 50);
  });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar-glass');
  if (!navbar) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
}

// ============================================
// PARALLAX EFFECT
// ============================================
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(element => {
      const speed = element.dataset.parallax || 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  });
}

// ============================================
// INTERSECTION OBSERVER ANIMATIONS
// ============================================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fadeInUp');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('[data-animate]').forEach(element => {
    observer.observe(element);
  });
}

// ============================================
// PARTICLE BACKGROUND
// ============================================
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const particleCount = 50;
  
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
      this.color = Math.random() > 0.5 ? 'rgba(220, 20, 60, 0.5)' : 'rgba(30, 58, 138, 0.5)';
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
      if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }
    
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  function init() {
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    connectParticles();
    requestAnimationFrame(animate);
  }
  
  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  
  init();
  animate();
}

// ============================================
// RIPPLE EFFECT
// ============================================
function createRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  
  ripple.style.width = ripple.style.height = `${diameter}px`;
  ripple.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  ripple.style.top = `${event.clientY - button.offsetTop - radius}px`;
  ripple.classList.add('ripple');
  
  const rippleEffect = button.querySelector('.ripple');
  if (rippleEffect) {
    rippleEffect.remove();
  }
  
  button.appendChild(ripple);
}

// Add ripple styles
const style = document.createElement('style');
style.textContent = `
  .ripple-container {
    position: relative;
    overflow: hidden;
  }
  
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ============================================
// TYPING EFFECT
// ============================================
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// ============================================
// CARD TILT EFFECT
// ============================================
function initCardTilt() {
  const cards = document.querySelectorAll('[data-tilt]');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
}

// ============================================
// NUMBER COUNTER ANIMATION
// ============================================
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast-glass toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  const toastStyles = `
    .toast-glass {
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 12px;
      padding: 16px 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      z-index: 10001;
      animation: slideInRight 0.4s ease-out;
      border-left: 4px solid;
    }
    
    .toast-success { border-left-color: #10B981; }
    .toast-error { border-left-color: #EF4444; }
    .toast-info { border-left-color: #3B82F6; }
    
    .toast-content {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 500;
    }
    
    @keyframes slideInRight {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  
  if (!document.getElementById('toast-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'toast-styles';
    styleElement.textContent = toastStyles;
    document.head.appendChild(styleElement);
  }
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.4s ease-out reverse';
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// ============================================
// AUTO-DISMISS ALERTS
// ============================================
function initAutoDismissAlerts() {
  const alerts = document.querySelectorAll('.alert-glass');
  
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.opacity = '0';
      alert.style.transform = 'translateY(-20px)';
      setTimeout(() => alert.remove(), 300);
    }, 5000);
  });
}

// ============================================
// FORM VALIDATION VISUAL FEEDBACK
// ============================================
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        if (this.value.trim() !== '') {
          this.classList.add('valid');
          this.classList.remove('invalid');
        }
      });
      
      input.addEventListener('invalid', function() {
        this.classList.add('invalid');
        this.classList.remove('valid');
      });
    });
  });
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initMorphingShapes();
  initSmoothScroll();
  initNavbarScroll();
  initParallax();
  initScrollAnimations();
  initParticles();
  initCardTilt();
  initAutoDismissAlerts();
  initFormValidation();
  
  // Add ripple effect to buttons
  document.querySelectorAll('.btn-primary-gradient, .btn-glass').forEach(button => {
    button.classList.add('ripple-container');
    button.addEventListener('click', createRipple);
  });
  
  // Animate counters on page load
  document.querySelectorAll('[data-counter]').forEach(counter => {
    const target = parseInt(counter.dataset.counter);
    animateCounter(counter, target);
  });
});

// ============================================
// LOADING SCREEN
// ============================================
window.addEventListener('load', () => {
  const loader = document.querySelector('.page-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 300);
  }
});

// ============================================
// EXPORT FUNCTIONS
// ============================================
window.HIFIAnimations = {
  showToast,
  animateCounter,
  typeWriter,
  createRipple
};
