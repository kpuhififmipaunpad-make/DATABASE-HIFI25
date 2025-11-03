/**
 * HIFI Database - Admin Panel Animations (COMPLETE & ENHANCED)
 * FULL RESPONSIVE - ALL DEVICES
 * Production-ready animations with performance optimization
 * Compatible dengan DataTable initialization
 */

'use strict';

// ============================================
// GLOBAL UTILITIES & HELPERS
// ============================================
const HIFI = (() => {
  // HTML escape for security
  const esc = (v) =>
    (v == null || String(v).trim() === "" ? "-" :
      String(v).replace(/[&<>"']/g, m => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
      }[m])));

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === '-') return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      });
    } catch { 
      return dateStr; 
    }
  };

  // Device detection
  const isMobile = () => window.innerWidth <= 768;
  const isTablet = () => window.innerWidth > 768 && window.innerWidth <= 1024;
  const isTouch = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Throttle function
  const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  return { esc, formatDate, isMobile, isTablet, isTouch, debounce, throttle };
})();

// Helper: get DataTable instance
function getDT() {
  try {
    if (window.jQuery && $.fn && $.fn.DataTable && $.fn.DataTable.isDataTable('#usersTable')) {
      return $('#usersTable').DataTable();
    }
  } catch (_) {}
  return null;
}

// ============================================
// RESPONSIVE SIDEBAR TOGGLE (ENHANCED)
// ============================================
function initSidebarToggle() {
  const sidebar = document.querySelector('.sidebar-glass, .main-sidebar');
  const toggleBtn = document.querySelector('#sidebarToggle, .nav-link[data-widget="pushmenu"]');
  const mainContent = document.querySelector('.content-wrapper, .main-content');
  
  if (!sidebar) return;
  
  // Create overlay
  let overlay = document.querySelector('.sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.style.cssText = `
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      z-index: 999;
      opacity: 0;
      transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    document.body.appendChild(overlay);
  }

  // Toggle function with animation
  const toggleSidebar = (force) => {
    const isCollapsed = force !== undefined ? !force : sidebar.classList.contains('active');
    
    if (HIFI.isMobile()) {
      // Mobile: slide animation
      sidebar.classList.toggle('active', !isCollapsed);
      overlay.style.display = isCollapsed ? 'none' : 'block';
      
      requestAnimationFrame(() => {
        overlay.style.opacity = isCollapsed ? '0' : '1';
      });
      
      document.body.style.overflow = isCollapsed ? '' : 'hidden';
      
      // Animate sidebar
      if (!isCollapsed) {
        sidebar.style.transform = 'translateX(0)';
      } else {
        sidebar.style.transform = 'translateX(-100%)';
      }
    } else {
      // Desktop: collapse/expand
      sidebar.classList.toggle('collapsed', isCollapsed);
      mainContent?.classList.toggle('expanded', isCollapsed);
      
      // Smooth width transition
      if (isCollapsed) {
        sidebar.style.width = '80px';
      } else {
        sidebar.style.width = '260px';
      }
    }
    
    localStorage.setItem('sidebarCollapsed', isCollapsed);
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('sidebarToggle', { 
      detail: { collapsed: isCollapsed } 
    }));
  };

  // Toggle button click
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSidebar();
    });
  }

  // Overlay click to close
  overlay.addEventListener('click', () => {
    if (HIFI.isMobile()) {
      toggleSidebar(false);
    }
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && HIFI.isMobile() && sidebar.classList.contains('active')) {
      toggleSidebar(false);
    }
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (HIFI.isMobile() && 
        sidebar.classList.contains('active') &&
        !sidebar.contains(e.target) && 
        !e.target.closest('.nav-link[data-widget="pushmenu"]') &&
        !e.target.closest('#sidebarToggle')) {
      toggleSidebar(false);
    }
  });

  // Restore state on load
  const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  if (!HIFI.isMobile() && isCollapsed) {
    sidebar.classList.add('collapsed');
    mainContent?.classList.add('expanded');
    sidebar.style.width = '80px';
  }

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', HIFI.debounce(() => {
    if (HIFI.isMobile()) {
      sidebar.classList.remove('collapsed');
      mainContent?.classList.remove('expanded');
      sidebar.style.width = '';
      if (!sidebar.classList.contains('active')) {
        overlay.style.display = 'none';
        overlay.style.opacity = '0';
        document.body.style.overflow = '';
        sidebar.style.transform = '';
      }
    } else {
      sidebar.classList.remove('active');
      overlay.style.display = 'none';
      overlay.style.opacity = '0';
      document.body.style.overflow = '';
      sidebar.style.transform = '';
      if (isCollapsed) {
        sidebar.classList.add('collapsed');
        mainContent?.classList.add('expanded');
        sidebar.style.width = '80px';
      } else {
        sidebar.style.width = '260px';
      }
    }
  }, 250));
}

// ============================================
// ENHANCE EXISTING DATATABLE (NO RE-INIT)
// ============================================
function enhanceExistingDataTable() {
  const checkDataTable = setInterval(() => {
    const dt = getDT();
    if (dt) {
      clearInterval(checkDataTable);
      console.log('✅ DataTable found, applying enhancements...');
      
      const $table = $('#usersTable');
      
      // Add responsive classes
      if (HIFI.isTouch()) {
        $table.addClass('touch-enabled');
      }
      
      // Animate rows on draw
      dt.on('draw.dt', function() {
        const rows = $table.find('tbody tr');
        rows.each(function(index) {
          $(this).css({
            opacity: 0,
            transform: 'translateY(20px)'
          }).delay(index * 30).animate({
            opacity: 1
          }, 300, function() {
            $(this).css('transform', 'translateY(0)');
          });
        });
      });
      
      // Add row click animation
      $table.on('click', 'tbody tr', function(e) {
        if (!$(e.target).closest('.btn-action, form').length) {
          $(this).addClass('row-clicked');
          setTimeout(() => {
            $(this).removeClass('row-clicked');
          }, 300);
        }
      });
      
      console.log('✅ DataTable enhancements applied');
    }
  }, 100);
  
  setTimeout(() => clearInterval(checkDataTable), 5000);
}

// ============================================
// STAT CARD ANIMATIONS
// ============================================
function animateStatCards() {
  const cards = document.querySelectorAll('.stat-card');
  if (!cards.length) return;

  const isMobile = HIFI.isMobile();
  const delay = isMobile ? 50 : 100;
  const duration = isMobile ? 400 : 600;

  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px) scale(0.95)';
    
    setTimeout(() => {
      card.style.transition = `all ${duration}ms cubic-bezier(0.68,-0.55,0.265,1.55)`;
      card.style.opacity = '1';
      card.style.transform = 'translateY(0) scale(1)';
      
      // Animate icon
      const icon = card.querySelector('.stat-card-icon');
      if (icon) {
        setTimeout(() => {
          icon.style.animation = 'pulse 2s ease-in-out infinite';
        }, duration);
      }
    }, i * delay);
  });
}

// ============================================
// COUNTER ANIMATION
// ============================================
function animateCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-counter'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current >= target) {
        counter.textContent = target.toLocaleString('id-ID');
      } else {
        counter.textContent = Math.floor(current).toLocaleString('id-ID');
        requestAnimationFrame(updateCounter);
      }
    };
    
    // Start animation when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateCounter();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(counter);
  });
}

// ============================================
// LOADING STATE (RESPONSIVE)
// ============================================
function showLoadingState(show = true, message = 'Memuat data...') {
  let overlay = document.querySelector('.loading-overlay');
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.style.cssText = `
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);
      z-index: 99999;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    overlay.innerHTML = `
      <div style="text-align: center; color: white; background: rgba(255, 255, 255, 0.1); padding: 32px 48px; border-radius: 20px; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2);">
        <div class="spinner" style="width: 48px; height: 48px; border: 4px solid rgba(255, 255, 255, 0.3); border-top-color: white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        <p class="loading-message" style="margin-top: 16px; font-size: 14px; font-weight: 600;">${HIFI.isMobile() ? 'Loading...' : message}</p>
      </div>
    `;
    document.body.appendChild(overlay);
    
    // Add spin animation if not exists
    if (!document.getElementById('loading-styles')) {
      const style = document.createElement('style');
      style.id = 'loading-styles';
      style.textContent = `
        @keyframes spin { 
          to { transform: rotate(360deg); } 
        }
        .loading-overlay {
          font-family: 'Inter', sans-serif;
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  const loadingMessage = overlay.querySelector('.loading-message');
  if (loadingMessage && message) {
    loadingMessage.textContent = HIFI.isMobile() ? 'Loading...' : message;
  }
  
  if (show) {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });
  } else {
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast-glass toast-${type}`;
  
  const icons = {
    success: 'check-circle',
    error: 'exclamation-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle'
  };
  
  const colors = {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6'
  };
  
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 12px;
    padding: 16px 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    z-index: 10001;
    animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-left: 4px solid ${colors[type]};
    max-width: 420px;
    min-width: 300px;
  `;
  
  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <i class="fas fa-${icons[type]}" style="color: ${colors[type]}; font-size: 20px;"></i>
      <span style="flex: 1; font-weight: 500; color: #1F2937;">${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #6B7280; cursor: pointer; padding: 4px; transition: color 0.2s;">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) reverse';
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// ============================================
// TOUCH ENHANCEMENTS
// ============================================
function initTouchEnhancements() {
  if (!HIFI.isTouch()) return;

  // Add touch feedback to buttons
  document.querySelectorAll('button, .btn, .btn-action, a[role="button"]').forEach(el => {
    el.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.95)';
      this.style.opacity = '0.7';
    }, { passive: true });
    
    el.addEventListener('touchend', function() {
      setTimeout(() => {
        this.style.transform = '';
        this.style.opacity = '';
      }, 150);
    }, { passive: true });
  });

  // Prevent zoom on double-tap
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function(e) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });

  // Add pull-to-refresh indicator (visual only)
  let startY = 0;
  let isPulling = false;
  
  document.addEventListener('touchstart', (e) => {
    if (window.scrollY === 0) {
      startY = e.touches[0].pageY;
      isPulling = true;
    }
  }, { passive: true });
  
  document.addEventListener('touchmove', (e) => {
    if (!isPulling) return;
    
    const currentY = e.touches[0].pageY;
    const diff = currentY - startY;
    
    if (diff > 100) {
      // Show refresh indicator
      document.body.style.paddingTop = `${Math.min(diff / 2, 50)}px`;
    }
  }, { passive: true });
  
  document.addEventListener('touchend', () => {
    document.body.style.paddingTop = '';
    isPulling = false;
  }, { passive: true });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const offset = 80; // Navbar height
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ============================================
// TABLE ENHANCEMENTS
// ============================================
function enhanceTableInteractions() {
  const table = document.getElementById('usersTable');
  if (!table) return;

  // Row hover effects
  const rows = table.querySelectorAll('tbody tr');
  rows.forEach(row => {
    row.addEventListener('mouseenter', function() {
      if (!HIFI.isTouch()) {
        this.style.transform = 'scale(1.01)';
        this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
      }
    });

    row.addEventListener('mouseleave', function() {
      if (!HIFI.isTouch()) {
        this.style.transform = '';
        this.style.boxShadow = '';
      }
    });
  });

  // Button interactions
  const actionButtons = document.querySelectorAll('.btn-action');
  actionButtons.forEach(btn => {
    // Click animation
    btn.addEventListener('click', function(e) {
      this.style.transform = 'scale(0.9)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
    
    // Ripple effect
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        left: ${x}px;
        top: ${y}px;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
  
  // Add ripple animation CSS
  if (!document.getElementById('ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      .row-clicked {
        background: rgba(30, 58, 138, 0.08) !important;
      }
    `;
    document.head.appendChild(style);
  }
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
function optimizePerformance() {
  // Debounce resize events
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    document.body.classList.add('resize-animation-stopper');
    
    resizeTimer = setTimeout(() => {
      document.body.classList.remove('resize-animation-stopper');
    }, 400);
  }, { passive: true });
  
  // Add resize stopper CSS
  if (!document.getElementById('resize-stopper-styles')) {
    const style = document.createElement('style');
    style.id = 'resize-stopper-styles';
    style.textContent = `
      .resize-animation-stopper * {
        animation: none !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Lazy load images
  if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
}

// ============================================
// FORM ENHANCEMENTS
// ============================================
function enhanceFormInputs() {
  const inputs = document.querySelectorAll('.form-control-glass, .glass-input');
  
  inputs.forEach(input => {
    // Add floating label effect
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('input-focused');
    });
    
    input.addEventListener('blur', function() {
      if (!this.value) {
        this.parentElement.classList.remove('input-focused');
      }
    });
    
    // Auto-grow for textareas
    if (input.tagName === 'TEXTAREA') {
      input.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
      });
    }
  });
}

// ============================================
// ALERT AUTO-DISMISS
// ============================================
function initAlertAutoDismiss() {
  const alerts = document.querySelectorAll('.alert-glass');
  
  alerts.forEach(alert => {
    // Add close button if not exists
    if (!alert.querySelector('button')) {
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '<i class="fas fa-times"></i>';
      closeBtn.style.cssText = `
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 8px;
        margin-left: auto;
        border-radius: 8px;
        transition: all 0.3s ease;
        opacity: 0.8;
      `;
      closeBtn.addEventListener('click', () => {
        dismissAlert(alert);
      });
      alert.appendChild(closeBtn);
    }
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismissAlert(alert);
    }, 5000);
  });
}

function dismissAlert(alert) {
  alert.style.opacity = '0';
  alert.style.transform = 'translateX(100px)';
  setTimeout(() => alert.remove(), 400);
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar-glass');
  if (!navbar) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', HIFI.throttle(() => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Hide on scroll down, show on scroll up
    if (currentScroll > lastScroll && currentScroll > 100) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
  }, 100));
}

// ============================================
// PAGE VISIBILITY API
// ============================================
function initPageVisibility() {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      console.log('🔒 Page hidden - pausing animations');
      document.body.classList.add('page-hidden');
    } else {
      console.log('👁️ Page visible - resuming animations');
      document.body.classList.remove('page-hidden');
    }
  });
  
  // Add CSS for paused state
  if (!document.getElementById('visibility-styles')) {
    const style = document.createElement('style');
    style.id = 'visibility-styles';
    style.textContent = `
      .page-hidden * {
        animation-play-state: paused !important;
      }
    `;
    document.head.appendChild(style);
  }
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K: Focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('searchNama');
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }
    
    // Ctrl/Cmd + R: Refresh (prevent default and use custom)
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      e.preventDefault();
      showLoadingState(true, 'Memuat ulang...');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  });
}

// ============================================
// INIT ALL - MASTER FUNCTION
// ============================================
function initAll() {
  console.log('🚀 Initializing HIFI Admin Panel (Enhanced Mode)');
  console.log('📱 Device:', HIFI.isMobile() ? 'Mobile' : HIFI.isTablet() ? 'Tablet' : 'Desktop');
  console.log('👆 Touch:', HIFI.isTouch() ? 'Enabled' : 'Disabled');

  // Core functionality
  initSidebarToggle();
  enhanceExistingDataTable();
  animateStatCards();
  animateCounters();

  // Enhancements
  initTouchEnhancements();
  initSmoothScroll();
  enhanceTableInteractions();
  enhanceFormInputs();
  initAlertAutoDismiss();
  initNavbarScroll();
  initPageVisibility();
  initKeyboardShortcuts();
  optimizePerformance();

  // Smooth transitions for all interactive elements
  document.querySelectorAll('.stat-card, .btn, .glass-card').forEach(el => {
    el.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)';
  });

  // Add device class to body
  document.body.classList.add(
    HIFI.isMobile() ? 'is-mobile' : 
    HIFI.isTablet() ? 'is-tablet' : 
    'is-desktop'
  );
  
  if (HIFI.isTouch()) {
    document.body.classList.add('is-touch');
  }

  console.log('✅ Initialization complete');
  
  // Show success toast
  setTimeout(() => {
    showToast('Dashboard siap digunakan!', 'success', 2000);
  }, 500);
}

// ============================================
// DOM READY
// ============================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

// ============================================
// EXPORT GLOBAL API
// ============================================
window.HIFIAdmin = {
  // Core functions
  showLoadingState,
  showToast,
  
  // Device detection
  isMobile: HIFI.isMobile,
  isTablet: HIFI.isTablet,
  isTouch: HIFI.isTouch,
  
  // Utilities
  formatDate: HIFI.formatDate,
  esc: HIFI.esc,
  debounce: HIFI.debounce,
  throttle: HIFI.throttle,
  
  // DataTable access
  getDataTable: getDT,
  
  // Animation control
  refreshData: () => {
    showLoadingState(true, 'Memuat ulang data...');
    setTimeout(() => window.location.reload(), 500);
  }
};

console.log('📱 HIFI Admin Panel - Enhanced Mode Loaded');
console.log('🎨 All animations and interactions ready');
console.log('⌨️ Keyboard shortcuts: Ctrl+K (search), Ctrl+R (refresh)');
