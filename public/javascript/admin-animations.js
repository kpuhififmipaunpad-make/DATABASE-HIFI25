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
  const sidebar = document.querySelector('.sidebar-glass');
  const toggleBtn = document.querySelector('#sidebarToggle');
  const mainContent = document.querySelector('.content-wrapper, .main-content');
  
  if (!sidebar) return;
  
  // Create overlay only if it doesn't exist
  let overlay = document.querySelector('.sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }

  // Toggle function
  const toggleSidebar = (force) => {
    const isCollapsed = force !== undefined ? !force : sidebar.classList.contains('active');
    
    if (HIFI.isMobile()) {
      // Mobile: slide from left with overlay
      sidebar.classList.toggle('active', !isCollapsed);
      overlay.classList.toggle('active', !isCollapsed);
      document.body.style.overflow = isCollapsed ? '' : 'hidden';
    } else {
      // Desktop: collapse/expand
      sidebar.classList.toggle('collapsed', isCollapsed);
      mainContent?.classList.toggle('expanded', isCollapsed);
      mainContent?.classList.toggle('sidebar-collapsed', isCollapsed);
    }
    
    localStorage.setItem('sidebarCollapsed', isCollapsed);
  };

  // Toggle button click
  if (toggleBtn) {
    toggleBtn.removeEventListener('click', toggleSidebar); // Remove old listeners
    toggleBtn.addEventListener('click', () => toggleSidebar());
  }

  // Hamburger menu for mobile
  const hamburger = document.querySelector('.navbar-toggle, #navbarToggle');
  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
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
        !e.target.closest('.navbar-toggle, #sidebarToggle, #navbarToggle')) {
      toggleSidebar(false);
    }
  });

  // Restore state on load
  const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  if (!HIFI.isMobile() && isCollapsed) {
    sidebar.classList.add('collapsed');
    mainContent?.classList.add('expanded', 'sidebar-collapsed');
  }

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (HIFI.isMobile()) {
        sidebar.classList.remove('collapsed');
        mainContent?.classList.remove('expanded', 'sidebar-collapsed');
        if (!sidebar.classList.contains('active')) {
          overlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      } else {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        if (isCollapsed) {
          sidebar.classList.add('collapsed');
          mainContent?.classList.add('expanded', 'sidebar-collapsed');
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
      
      // Add device-specific styling
      $('.dataTables_wrapper').addClass('glass-card');
      
      // Enhance pagination for mobile
      if (HIFI.isMobile()) {
        $('.dataTables_paginate .paginate_button').each(function() {
          const text = $(this).text();
          if (text === 'Previous') $(this).html('‹');
          if (text === 'Next') $(this).html('›');
        });
      }
      
      // Add scroll behavior on mobile
      if (HIFI.isMobile()) {
        $('.table-responsive').css({
          'overflow-x': 'auto',
          '-webkit-overflow-scrolling': 'touch'
        });
      }
      
      console.log('✅ DataTable enhancements applied');
    }
  }, 100);
  
  // Timeout after 5 seconds
  setTimeout(() => clearInterval(checkDataTable), 5000);
}

// ============================================
// RESPONSIVE CHART
// ============================================
function initCharts() {
  if (typeof Chart === 'undefined') return;
  const ctx = document.getElementById('userChart');
  if (!ctx) return;

  const isMobile = HIFI.isMobile();
  
  const chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: isMobile ? ['J', 'F', 'M', 'A', 'M', 'J'] : ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
      datasets: [{
        label: 'Pendaftar Baru',
        data: [12, 19, 8, 15, 22, 18],
        borderColor: 'rgb(220, 20, 60)',
        backgroundColor: 'rgba(220, 20, 60, 0.1)',
        borderWidth: isMobile ? 2 : 3,
        tension: 0.4,
        fill: true,
        pointRadius: isMobile ? 3 : 4,
        pointHoverRadius: isMobile ? 5 : 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: isMobile ? 1.5 : 2,
      plugins: {
        legend: {
          display: !isMobile,
          labels: {
            font: { size: isMobile ? 10 : 12 }
          }
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          bodyFont: { size: isMobile ? 11 : 13 }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: {
            font: { size: isMobile ? 10 : 12 }
          }
        },
        x: {
          grid: { display: false },
          ticks: {
            font: { size: isMobile ? 10 : 12 }
          }
        }
      },
      animation: {
        duration: isMobile ? 1000 : 2000,
        easing: 'easeInOutQuart'
      }
    }
  });

  // Handle resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (chartInstance) {
        chartInstance.destroy();
        initCharts();
      }
    }, 500);
  });
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
    overlay.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>${HIFI.isMobile() ? 'Loading...' : 'Memuat data...'}</p>
      </div>
    `;
    document.body.appendChild(overlay);
  }
  
  if (show) {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => overlay.classList.add('active'), 10);
  } else {
    overlay.classList.remove('active');
    setTimeout(() => {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }
}

// ============================================
// USER ACTIONS (RESPONSIVE CONFIRMATIONS)
// ============================================
function editUser(id) {
  showLoadingState(true);
  window.location.href = `/dashboard/edit/${id}`;
}

function deleteUser(id) {
  const isMobile = HIFI.isMobile();
  const message = isMobile 
    ? 'Hapus data ini?' 
    : 'Apakah Anda yakin ingin menghapus data ini?';
  
  if (confirm(message)) {
    showLoadingState(true);
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `/dashboard/delete/${id}?_method=DELETE`;
    document.body.appendChild(form);
    form.submit();
  }
}

function confirmDelete(id) {
  deleteUser(id);
}

// ============================================
// RESPONSIVE DROPDOWNS
// ============================================
function toggleNotifications() {
  const dropdown = document.querySelector('.notifications-dropdown');
  if (!dropdown) return;

  const isOpen = dropdown.classList.contains('show');
  closeAllDropdowns();
  
  if (!isOpen) {
    dropdown.classList.add('show');
    if (HIFI.isMobile()) {
      positionMobileDropdown(dropdown);
    }
  }
}

function toggleProfileDropdown() {
  const dropdown = document.querySelector('.profile-dropdown');
  if (!dropdown) return;

  const isOpen = dropdown.classList.contains('show');
  closeAllDropdowns();
  
  if (!isOpen) {
    dropdown.classList.add('show');
    if (HIFI.isMobile()) {
      positionMobileDropdown(dropdown);
    }
  }
}

function closeAllDropdowns() {
  document.querySelectorAll('.notifications-dropdown, .profile-dropdown').forEach(dropdown => {
    dropdown.classList.remove('show');
  });
}

function positionMobileDropdown(dropdown) {
  if (!dropdown) return;
  
  const rect = dropdown.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  
  if (rect.bottom > viewportHeight) {
    dropdown.style.top = 'auto';
    dropdown.style.bottom = '100%';
    dropdown.style.marginBottom = '8px';
  }
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.notification-bell') && 
      !e.target.closest('.notifications-dropdown')) {
    document.querySelector('.notifications-dropdown')?.classList.remove('show');
  }
  
  if (!e.target.closest('.profile-avatar') && 
      !e.target.closest('.profile-dropdown')) {
    document.querySelector('.profile-dropdown')?.classList.remove('show');
  }
});

// ============================================
// TOUCH ENHANCEMENTS
// ============================================
function initTouchEnhancements() {
  if (!HIFI.isTouch()) return;

  // Add touch feedback to buttons
  document.querySelectorAll('button, .btn-action, .btn-primary-gradient, a[role="button"]').forEach(el => {
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
// SWIPE TO REFRESH (MOBILE)
// ============================================
function initSwipeToRefresh() {
  if (!HIFI.isMobile()) return;

  let startY = 0;
  let currentY = 0;
  let pulling = false;
  const threshold = 80;
  
  const refreshIndicator = document.createElement('div');
  refreshIndicator.className = 'swipe-refresh-indicator';
  refreshIndicator.innerHTML = '<i class="fas fa-arrow-down"></i>';
  document.body.insertBefore(refreshIndicator, document.body.firstChild);

  document.addEventListener('touchstart', (e) => {
    if (window.scrollY === 0) {
      startY = e.touches[0].pageY;
      pulling = true;
    }
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!pulling) return;
    
    currentY = e.touches[0].pageY;
    const pullDistance = currentY - startY;
    
    if (pullDistance > 0 && pullDistance < threshold * 1.5) {
      refreshIndicator.style.transform = `translateY(${pullDistance}px)`;
      refreshIndicator.style.opacity = pullDistance / threshold;
    }
  }, { passive: true });

  document.addEventListener('touchend', () => {
    if (!pulling) return;
    
    const pullDistance = currentY - startY;
    
    if (pullDistance > threshold) {
      refreshIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      setTimeout(() => {
        location.reload();
      }, 500);
    } else {
      refreshIndicator.style.transform = '';
      refreshIndicator.style.opacity = '';
    }
    
    pulling = false;
  }, { passive: true });
}

// ============================================
// KEYBOARD SHORTCUTS (DESKTOP)
// ============================================
function initKeyboardShortcuts() {
  if (HIFI.isMobile()) return;

  document.addEventListener('keydown', (e) => {
    // Escape: Close modals/dropdowns
    if (e.key === 'Escape') {
      closeAllDropdowns();
    }
  });
}

// ============================================
// VIEWPORT ORIENTATION CHANGE
// ============================================
function handleOrientationChange() {
  let orientationTimer;
  
  window.addEventListener('orientationchange', () => {
    showLoadingState(true);
    
    clearTimeout(orientationTimer);
    orientationTimer = setTimeout(() => {
      const dt = getDT();
      if (dt) {
        dt.columns.adjust().draw();
      }
      
      showLoadingState(false);
    }, 300);
  });
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
function optimizePerformance() {
  // Lazy load images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

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
// ACCESSIBILITY ENHANCEMENTS
// ============================================
function initAccessibility() {
  // Add ARIA labels
  document.querySelectorAll('.btn-action').forEach(btn => {
    if (!btn.getAttribute('aria-label')) {
      const title = btn.getAttribute('title') || btn.textContent.trim();
      btn.setAttribute('aria-label', title);
    }
  });

  // Screen reader announcements
  const announcer = document.createElement('div');
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;';
  document.body.appendChild(announcer);
}

// ============================================
// ERROR HANDLING
// ============================================
function initErrorHandling() {
  window.addEventListener('error', (e) => {
    console.error('Runtime error:', e.error);
  });

  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
  });
}

// ============================================
// NETWORK STATUS INDICATOR
// ============================================
function initNetworkStatus() {
  if (!HIFI.isMobile()) return;

  let offlineToast;

  window.addEventListener('offline', () => {
    offlineToast = showToast('Tidak ada koneksi internet', 'error', 0);
  });

  window.addEventListener('online', () => {
    if (offlineToast) {
      offlineToast.remove();
    }
    showToast('Koneksi tersambung kembali', 'success', 3000);
  });
}

function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'error' ? '#DC143C' : '#10B981'};
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    z-index: 10000;
    animation: slideUp 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    font-size: 14px;
  `;
  
  document.body.appendChild(toast);
  
  if (duration > 0) {
    setTimeout(() => {
      toast.style.animation = 'slideDown 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
  
  return toast;
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
  initCharts();
  animateStatCards();

  // Enhancements
  initTouchEnhancements();
  initKeyboardShortcuts();
  handleOrientationChange();
  optimizePerformance();
  initAccessibility();
  initErrorHandling();
  initNetworkStatus();

  // Smooth transitions
  document.querySelectorAll('.glass-card, .stat-card, .btn-action').forEach(el => {
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
  // Core functions
  editUser,
  deleteUser,
  confirmDelete,
  
  // Dropdown functions
  toggleNotifications,
  toggleProfileDropdown,
  closeAllDropdowns,
  
  // Utility functions
  showLoadingState,
  showToast,
  
  // Device detection
  isMobile: HIFI.isMobile,
  isTablet: HIFI.isTablet,
  isTouch: HIFI.isTouch,
  
  // DataTable access
  getDataTable: getDT
};

// ============================================
// ADDITIONAL CSS FOR RESPONSIVE FEATURES
// ============================================
const responsiveStyles = document.createElement('style');
responsiveStyles.textContent = `
  /* Sidebar Overlay */
  .sidebar-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .sidebar-overlay.active {
    display: block;
    opacity: 1;
  }

  /* Loading Overlay */
  .loading-overlay {
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
  }
  
  .loading-overlay.active {
    opacity: 1;
  }
  
  .loading-spinner {
    text-align: center;
    color: white;
  }
  
  .loading-spinner .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }
  
  .loading-spinner p {
    margin-top: 16px;
    font-size: 14px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Swipe to Refresh */
  .swipe-refresh-indicator {
    position: fixed;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    opacity: 0;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .swipe-refresh-indicator i {
    color: #1E3A8A;
  }

  /* Toast Animation */
  @keyframes slideUp {
    from {
      transform: translateX(-50%) translateY(100px);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideDown {
    from {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
    to {
      transform: translateX(-50%) translateY(100px);
      opacity: 0;
    }
  }

  /* Disable animations during resize */
  .resize-animation-stopper * {
    animation: none !important;
    transition: none !important;
  }

  /* Touch feedback */
  .is-touch button:active,
  .is-touch .btn-action:active,
  .is-touch .btn-primary-gradient:active {
    transform: scale(0.95);
  }

  /* Screen reader only */
  .sr-only {
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }

  /* Mobile optimizations */
  @media screen and (max-width: 768px) {
    .glass-card,
    .stat-card {
      transform-origin: center;
    }
    
    /* Smoother scrolling */
    * {
      -webkit-overflow-scrolling: touch;
    }
    
    /* Better tap targets */
    button, a, .btn-action {
      -webkit-tap-highlight-color: rgba(30, 58, 138, 0.1);
      min-height: 44px;
      min-width: 44px;
    }
    
    /* Mobile sidebar */
    .sidebar-glass.active {
      transform: translateX(0) !important;
    }
  }

  /* Landscape mobile adjustments */
  @media screen and (max-height: 500px) and (orientation: landscape) {
    .loading-spinner p {
      display: none;
    }
    
    .swipe-refresh-indicator {
      width: 32px;
      height: 32px;
    }
  }
`;

document.head.appendChild(responsiveStyles);

console.log('📱 HIFI Admin Panel - Enhanced Mode Loaded');
