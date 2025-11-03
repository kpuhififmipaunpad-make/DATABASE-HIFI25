/**
 * HIFI Database - Admin Panel Animations (FIXED)
 * FULL RESPONSIVE - ALL DEVICES
 * Compatible dengan DataTable initialization di script.txt
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

  // Deteksi device type
  const isMobile = () => window.innerWidth <= 768;
  const isTablet = () => window.innerWidth > 768 && window.innerWidth <= 1024;
  const isTouch = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  return { esc, formatDate, isMobile, isTablet, isTouch };
})();

// Helper: ambil instance DT kalau sudah ada
function getDT() {
  try {
    if (window.jQuery && $.fn && $.fn.DataTable && $.fn.DataTable.isDataTable('#usersTable')) {
      return $('#usersTable').DataTable();
    }
  } catch (_) {}
  return null;
}

// ============================================
// RESPONSIVE SIDEBAR TOGGLE
// ============================================
function initSidebarToggle() {
  const sidebar = document.querySelector('.sidebar-glass, .main-sidebar');
  const toggleBtn = document.querySelector('#sidebarToggle, .nav-link[data-widget="pushmenu"]');
  const mainContent = document.querySelector('.content-wrapper');
  
  if (!sidebar) return;
  
  // Create overlay only if it doesn't exist
  let overlay = document.querySelector('.sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.style.cssText = `
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(overlay);
  }

  // Toggle function
  const toggleSidebar = (force) => {
    const isCollapsed = force !== undefined ? !force : sidebar.classList.contains('active');
    
    if (HIFI.isMobile()) {
      // Mobile: slide from left with overlay
      sidebar.classList.toggle('active', !isCollapsed);
      overlay.style.display = isCollapsed ? 'none' : 'block';
      setTimeout(() => {
        overlay.style.opacity = isCollapsed ? '0' : '1';
      }, 10);
      document.body.style.overflow = isCollapsed ? '' : 'hidden';
    } else {
      // Desktop: collapse/expand
      sidebar.classList.toggle('collapsed', isCollapsed);
      mainContent?.classList.toggle('expanded', isCollapsed);
    }
    
    localStorage.setItem('sidebarCollapsed', isCollapsed);
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

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (HIFI.isMobile() && 
        sidebar.classList.contains('active') &&
        !sidebar.contains(e.target) && 
        !e.target.closest('.nav-link[data-widget="pushmenu"]')) {
      toggleSidebar(false);
    }
  });

  // Restore state on load
  const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  if (!HIFI.isMobile() && isCollapsed) {
    sidebar.classList.add('collapsed');
    mainContent?.classList.add('expanded');
  }

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (HIFI.isMobile()) {
        sidebar.classList.remove('collapsed');
        mainContent?.classList.remove('expanded');
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
          mainContent?.classList.add('expanded');
        }
      }
    }, 250);
  });
}

// ============================================
// ENHANCE EXISTING DATATABLE (NO RE-INIT)
// ============================================
function enhanceExistingDataTable() {
  // Wait for DataTable to be initialized by script.txt
  const checkDataTable = setInterval(() => {
    const dt = getDT();
    if (dt) {
      clearInterval(checkDataTable);
      console.log('✅ DataTable found, applying enhancements...');
      
      // Add responsive classes
      const $table = $('#usersTable');
      if (HIFI.isTouch()) {
        $table.addClass('touch-enabled');
      }
      
      console.log('✅ DataTable enhancements applied');
    }
  }, 100);
  
  // Timeout after 5 seconds
  setTimeout(() => clearInterval(checkDataTable), 5000);
}

// ============================================
// RESPONSIVE STAT CARD ANIMATIONS
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
      card.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        card.style.transition = `all ${duration}ms cubic-bezier(0.68,-0.55,0.265,1.55)`;
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 50);
    }, i * delay);
  });
}

// ============================================
// LOADING STATE (RESPONSIVE)
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
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);
      z-index: 99999;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    overlay.innerHTML = `
      <div style="text-align: center; color: white;">
        <div style="width: 48px; height: 48px; border: 4px solid rgba(255, 255, 255, 0.3); border-top-color: white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        <p style="margin-top: 16px; font-size: 14px;">${HIFI.isMobile() ? 'Loading...' : 'Memuat data...'}</p>
      </div>
    `;
    document.body.appendChild(overlay);
    
    // Add spin animation
    const style = document.createElement('style');
    style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
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

  // Add touch feedback to buttons
  document.querySelectorAll('button, .btn, .btn-action, a[role="button"]').forEach(el => {
    el.addEventListener('touchstart', function() {
      this.style.opacity = '0.7';
    }, { passive: true });
    
    el.addEventListener('touchend', function() {
      setTimeout(() => {
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
}

// ============================================
// INIT ALL - RESPONSIVE (NO DATATABLE CONFLICTS)
// ============================================
function initAll() {
  console.log('🚀 Initializing HIFI Admin Panel (Enhanced Mode)');
  console.log('📱 Device:', HIFI.isMobile() ? 'Mobile' : HIFI.isTablet() ? 'Tablet' : 'Desktop');
  console.log('👆 Touch:', HIFI.isTouch() ? 'Enabled' : 'Disabled');

  // Core functionality (NO DataTable initialization - handled by script.txt)
  initSidebarToggle();
  enhanceExistingDataTable(); // Only enhance, don't initialize
  animateStatCards();

  // Enhancements
  initTouchEnhancements();
  optimizePerformance();

  // Smooth transitions
  document.querySelectorAll('.stat-card, .btn').forEach(el => {
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
  // Utility functions
  showLoadingState,
  
  // Device detection
  isMobile: HIFI.isMobile,
  isTablet: HIFI.isTablet,
  isTouch: HIFI.isTouch,
  
  // DataTable access
  getDataTable: getDT
};

console.log('📱 HIFI Admin Panel - Enhanced Mode Loaded');
