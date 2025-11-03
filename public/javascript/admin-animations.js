/**
 * HIFI Database - Admin Panel Animations (ENHANCED)
 * FULL RESPONSIVE - ALL DEVICES
 * NO CONFLICTS with DataTable
 */

'use strict';

// ============================================
// UTILITIES
// ============================================
const HIFI = (() => {
  const esc = (v) =>
    (v == null || String(v).trim() === "" ? "-" :
      String(v).replace(/[&<>"']/g, m => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
      }[m])));

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

  const isMobile = () => window.innerWidth <= 768;
  const isTablet = () => window.innerWidth > 768 && window.innerWidth <= 1024;
  const isTouch = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  return { esc, formatDate, isMobile, isTablet, isTouch };
})();

// ============================================
// RESPONSIVE SIDEBAR TOGGLE (ENHANCED)
// ============================================
function initSidebarToggle() {
  const sidebar = document.querySelector('.sidebar-glass, .main-sidebar');
  const toggleBtn = document.querySelector('#sidebarToggle, .nav-link[data-widget="pushmenu"]');
  const mainContent = document.querySelector('.main-content, .content-wrapper');
  
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
      backdrop-filter: blur(5px);
      z-index: 998;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(overlay);
  }

  // Toggle function
  const toggleSidebar = (force) => {
    const isCollapsed = force !== undefined ? !force : sidebar.classList.contains('active');
    
    if (HIFI.isMobile()) {
      // Mobile: slide from left
      sidebar.classList.toggle('active', !isCollapsed);
      overlay.style.display = isCollapsed ? 'none' : 'block';
      setTimeout(() => {
        overlay.style.opacity = isCollapsed ? '0' : '1';
      }, 10);
      document.body.style.overflow = isCollapsed ? '' : 'hidden';
    } else {
      // Desktop: collapse/expand
      sidebar.classList.toggle('collapsed', isCollapsed);
      if (mainContent) {
        mainContent.classList.toggle('sidebar-collapsed', isCollapsed);
      }
    }
    
    localStorage.setItem('sidebarCollapsed', isCollapsed);
  };

  // Event listeners
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSidebar();
    });
  }

  overlay.addEventListener('click', () => {
    if (HIFI.isMobile()) toggleSidebar(false);
  });

  document.addEventListener('click', (e) => {
    if (HIFI.isMobile() && 
        sidebar.classList.contains('active') &&
        !sidebar.contains(e.target) && 
        !e.target.closest('.nav-link[data-widget="pushmenu"]')) {
      toggleSidebar(false);
    }
  });

  // Restore state
  const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  if (!HIFI.isMobile() && isCollapsed) {
    sidebar.classList.add('collapsed');
    if (mainContent) mainContent.classList.add('sidebar-collapsed');
  }

  // Resize handler
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (HIFI.isMobile()) {
        sidebar.classList.remove('collapsed');
        if (mainContent) mainContent.classList.remove('sidebar-collapsed');
        if (!sidebar.classList.contains('active')) {
          overlay.style.display = 'none';
          overlay.style.opacity = '0';
          document.body.style.overflow = '';
        }
      } else {
        sidebar.classList.remove('active');
        overlay.style.display = 'none';
        overlay.style.opacity = '0';
        document.body.style.overflow = '';
        if (isCollapsed) {
          sidebar.classList.add('collapsed');
          if (mainContent) mainContent.classList.add('sidebar-collapsed');
        }
      }
    }, 250);
  });
}

// ============================================
// STAT CARDS ANIMATION (ENHANCED)
// ============================================
function animateStatCards() {
  const cards = document.querySelectorAll('.stat-card');
  if (!cards.length) return;

  const isMobile = HIFI.isMobile();
  const delay = isMobile ? 50 : 100;
  const duration = isMobile ? 400 : 600;

  cards.forEach((card, i) => {
    setTimeout(() => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px) scale(0.9)';
      
      setTimeout(() => {
        card.style.transition = `all ${duration}ms cubic-bezier(0.68,-0.55,0.265,1.55)`;
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
      }, 50);
    }, i * delay);
  });
}

// ============================================
// LOADING STATE (ENHANCED)
// ============================================
function showLoadingState(show = true) {
  let overlay = document.querySelector('.loading-overlay');
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.style.cssText = `
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      z-index: 99999;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    const spinnerSize = HIFI.isMobile() ? '40px' : '56px';
    overlay.innerHTML = `
      <div style="text-align: center; color: white;">
        <div style="width: ${spinnerSize}; height: ${spinnerSize}; border: 4px solid rgba(255, 255, 255, 0.2); border-top-color: #DC143C; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto;"></div>
        <p style="margin-top: 20px; font-size: 15px; font-weight: 600;">${HIFI.isMobile() ? 'Loading...' : 'Memuat data...'}</p>
      </div>
    `;
    document.body.appendChild(overlay);
    
    if (!document.getElementById('spinner-keyframes')) {
      const style = document.createElement('style');
      style.id = 'spinner-keyframes';
      style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
      document.head.appendChild(style);
    }
  }
  
  if (show) {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => overlay.style.opacity = '1', 10);
  } else {
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }
}

// ============================================
// TOUCH ENHANCEMENTS
// ============================================
function initTouchEnhancements() {
  if (!HIFI.isTouch()) return;

  // Touch feedback
  const touchElements = document.querySelectorAll('button, .btn, .btn-action, .btn-primary-gradient, a[role="button"]');
  touchElements.forEach(el => {
    el.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.95)';
      this.style.opacity = '0.8';
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

  // Add CSS for resize-animation-stopper
  if (!document.getElementById('resize-stopper-styles')) {
    const style = document.createElement('style');
    style.id = 'resize-stopper-styles';
    style.textContent = `
      .resize-animation-stopper * {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
      }
    `;
    document.head.appendChild(style);
  }
}

// ============================================
// SMOOTH SCROLL TO TOP
// ============================================
function initScrollToTop() {
  // Create button
  const btn = document.createElement('button');
  btn.className = 'scroll-to-top';
  btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  btn.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 24px;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #DC143C 0%, #1E3A8A 100%);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    box-shadow: 0 4px 15px rgba(220, 20, 60, 0.4);
    z-index: 996;
    transition: all 0.3s ease;
    opacity: 0;
  `;
  document.body.appendChild(btn);

  // Show/hide on scroll
  let scrollTimer;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    const shouldShow = window.pageYOffset > 300;
    
    if (shouldShow) {
      btn.style.display = 'flex';
      setTimeout(() => btn.style.opacity = '1', 10);
    } else {
      btn.style.opacity = '0';
      setTimeout(() => btn.style.display = 'none', 300);
    }
  }, { passive: true });

  // Scroll to top on click
  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Hover effect
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'scale(1.1) translateY(-5px)';
    btn.style.boxShadow = '0 6px 20px rgba(220, 20, 60, 0.5)';
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.boxShadow = '0 4px 15px rgba(220, 20, 60, 0.4)';
  });
}

// ============================================
// INIT ALL (NO DATATABLE CONFLICTS)
// ============================================
function initAll() {
  console.log('🚀 Initializing HIFI Admin Panel');
  console.log('📱 Device:', HIFI.isMobile() ? 'Mobile' : HIFI.isTablet() ? 'Tablet' : 'Desktop');

  // Core functionality
  initSidebarToggle();
  animateStatCards();

  // Enhancements
  initTouchEnhancements();
  optimizePerformance();
  initScrollToTop();

  // Add device class
  document.body.classList.add(
    HIFI.isMobile() ? 'is-mobile' : 
    HIFI.isTablet() ? 'is-tablet' : 
    'is-desktop'
  );
  
  if (HIFI.isTouch()) {
    document.body.classList.add('is-touch');
  }

  console.log('✅ Initialization complete');
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
  showLoadingState,
  isMobile: HIFI.isMobile,
  isTablet: HIFI.isTablet,
  isTouch: HIFI.isTouch
};

console.log('✅ HIFI Admin Panel - Enhanced Mode Loaded');
