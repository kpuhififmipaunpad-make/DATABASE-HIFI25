/**
 * ═══════════════════════════════════════════════════════════════
 * HIFI DATABASE - ADMIN PANEL v3.1 FINAL
 * ═══════════════════════════════════════════════════════════════
 * ✨ FIXED: Glassmorphism sidebar, clean table, perfect layout
 * 📱 FULL RESPONSIVE - Mobile, Tablet, Desktop optimized
 * 🎨 ULTRA SATISFYING: Smooth transitions & micro-interactions
 * ═══════════════════════════════════════════════════════════════
 */

'use strict';

// ═══════════════════════════════════════════════════════════════
// 🛠️ CORE UTILITIES
// ═══════════════════════════════════════════════════════════════
const HIFI = (() => {
  // Escape HTML untuk security
  const esc = (v) =>
    (v == null || String(v).trim() === "" ? "-" :
      String(v).replace(/[&<>"']/g, m => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
      }[m])));

  // Format tanggal Indonesia
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

  // Device detection - optimized
  const isMobile = () => window.innerWidth <= 768;
  const isTablet = () => window.innerWidth > 768 && window.innerWidth <= 1024;
  const isDesktop = () => window.innerWidth > 1024;
  const isTouch = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Debounce helper untuk performance
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

  // Throttle helper untuk scroll/resize
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
  
  // ✨ Enhanced detail template
  const buildDetail = (data) => {
    const isMobileView = isMobile();
    
    // Extract data dari array DataTables
    const username = data[1]?.replace(/<[^>]*>/g, '').trim() || '-';
    const nama = data[2] || '-';
    const npm = data[3] || '-';
    const email = data[4] || '-';
    const no_hp = data[5] || '-';
    const role = data[6]?.includes('Admin') ? 'Administrator' : 'User';
    const lastUpdate = data[7] || '-';
    
    return `
      <tr class="detail-row">
        <td colspan="9" class="detail-cell">
          <div class="dt-detail-wrapper">
            <div class="detail-grid" style="
              display: grid;
              grid-template-columns: ${isMobileView ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))'};
              gap: ${isMobileView ? '12px' : '16px'};
            ">
              <div class="detail-card">
                <div class="detail-header">
                  <i class="fas fa-user-circle"></i>
                  <span>Username</span>
                </div>
                <div class="detail-value">${esc(username)}</div>
              </div>
              
              <div class="detail-card">
                <div class="detail-header">
                  <i class="fas fa-user"></i>
                  <span>Nama Lengkap</span>
                </div>
                <div class="detail-value">${esc(nama)}</div>
              </div>
              
              <div class="detail-card">
                <div class="detail-header">
                  <i class="fas fa-id-card"></i>
                  <span>NPM</span>
                </div>
                <div class="detail-value">${esc(npm)}</div>
              </div>
              
              <div class="detail-card">
                <div class="detail-header">
                  <i class="fas fa-envelope"></i>
                  <span>Email</span>
                </div>
                <div class="detail-value">${esc(email)}</div>
              </div>
              
              <div class="detail-card">
                <div class="detail-header">
                  <i class="fas fa-phone"></i>
                  <span>No. HP</span>
                </div>
                <div class="detail-value">${esc(no_hp)}</div>
              </div>
              
              <div class="detail-card">
                <div class="detail-header">
                  <i class="fas fa-shield-alt"></i>
                  <span>Role</span>
                </div>
                <div class="detail-value">
                  <span class="role-badge ${role === 'Administrator' ? 'role-admin' : 'role-user'}">
                    ${esc(role)}
                  </span>
                </div>
              </div>
              
              <div class="detail-card full-width">
                <div class="detail-header">
                  <i class="fas fa-clock"></i>
                  <span>Terakhir Update</span>
                </div>
                <div class="detail-value">${esc(lastUpdate)}</div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    `;
  };

  return { 
    esc, 
    formatDate, 
    buildDetail, 
    isMobile, 
    isTablet, 
    isDesktop,
    isTouch,
    debounce,
    throttle
  };
})();

// Helper: Get DataTable instance
function getDT() {
  try {
    if (window.jQuery && $.fn?.DataTable && $.fn.DataTable.isDataTable('#usersTable')) {
      return $('#usersTable').DataTable();
    }
  } catch (_) {}
  return null;
}

// ═══════════════════════════════════════════════════════════════
// 📱 SIDEBAR - GLASSMORPHISM FIXED
// ═══════════════════════════════════════════════════════════════
function initSidebarToggle() {
  const sidebar = document.querySelector('.sidebar-glass');
  const hamburger = document.querySelector('.navbar-toggle, #navbarToggle, #sidebarToggle');
  const mainContent = document.querySelector('.content-wrapper, .main-content');
  let overlay = document.querySelector('.sidebar-overlay');
  
  if (!sidebar) return;
  
  // Create overlay for mobile only
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }

  const toggleSidebar = () => {
    if (HIFI.isMobile()) {
      const isActive = sidebar.classList.contains('mobile-active');
      
      sidebar.classList.toggle('mobile-active');
      overlay.classList.toggle('active');
      document.body.style.overflow = isActive ? '' : 'hidden';
      
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    }
  };

  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSidebar();
    });
  }

  overlay.addEventListener('click', () => {
    if (HIFI.isMobile()) {
      sidebar.classList.remove('mobile-active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('click', (e) => {
    if (HIFI.isMobile() && 
        sidebar.classList.contains('mobile-active') &&
        !sidebar.contains(e.target) && 
        !e.target.closest('.navbar-toggle, #sidebarToggle, #navbarToggle')) {
      sidebar.classList.remove('mobile-active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  const handleResize = HIFI.debounce(() => {
    if (!HIFI.isMobile()) {
      sidebar.classList.remove('mobile-active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }, 250);

  window.addEventListener('resize', handleResize);
  
  console.log('✅ Sidebar initialized - Glassmorphism fixed layout');
}

// ═══════════════════════════════════════════════════════════════
// 📊 DATATABLE - CLEAN & SMOOTH
// ═══════════════════════════════════════════════════════════════
function initDataTable() {
  if (!window.jQuery || !$.fn.DataTable) {
    console.warn('⚠️ DataTables not loaded');
    return;
  }

  const $table = $('#usersTable');
  if (!$table.length) {
    console.warn('⚠️ Table #usersTable not found');
    return;
  }

  if ($.fn.DataTable.isDataTable('#usersTable')) {
    $('#usersTable').DataTable().destroy();
  }

  const isMobile = HIFI.isMobile();
  const isTablet = HIFI.isTablet();
  
  let defaultPageLength = 25;
  if (isMobile) defaultPageLength = 10;
  else if (isTablet) defaultPageLength = 25;

  // ✨ Initialize dengan layout custom
  const dt = $table.DataTable({
    responsive: false,
    autoWidth: false,
    searching: true,
    lengthChange: true,
    pagingType: 'full_numbers',
    pageLength: defaultPageLength,
    lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
    dom: "<'datatable-header'<'header-left'B><'header-right'lf>>" +
         "<'datatable-body't>" +
         "<'datatable-footer'<'footer-left'i><'footer-right'p>>",
    order: [[2, 'asc']],
    columnDefs: [
      { 
        targets: [0], 
        width: isMobile ? '40px' : '48px',
        className: 'dt-center'
      },
      { 
        targets: [8], 
        orderable: false, 
        className: 'no-detail no-export dt-center'
      }
    ],
    language: {
      paginate: { 
        first: '<i class="fas fa-angle-double-left"></i>', 
        previous: '<i class="fas fa-angle-left"></i>', 
        next: '<i class="fas fa-angle-right"></i>', 
        last: '<i class="fas fa-angle-double-right"></i>' 
      },
      info: isMobile ? '_START_-_END_ / _TOTAL_' : 'Showing _START_ to _END_ of _TOTAL_ entries',
      infoEmpty: 'No entries',
      infoFiltered: isMobile ? '' : '(filtered from _MAX_)',
      zeroRecords: `
        <div class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-search fa-3x"></i>
          </div>
          <p class="empty-title">No Data Found</p>
          <p class="empty-subtitle">Try adjusting your search</p>
        </div>
      `,
      emptyTable: `
        <div class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-database fa-3x"></i>
          </div>
          <p class="empty-title">No Data Available</p>
          <p class="empty-subtitle">The table is empty</p>
        </div>
      `,
      lengthMenu: '_MENU_',
      search: '',
      searchPlaceholder: isMobile ? 'Search...' : 'Type to search...'
    },
    buttons: [
      {
        extend: 'excel',
        text: '<i class="fas fa-file-excel"></i><span class="btn-text"> Excel</span>',
        className: 'dt-btn-export dt-btn-excel',
        title: 'Data Warga HIFI',
        exportOptions: { columns: ':not(.no-export)' }
      },
      {
        extend: 'pdf',
        text: '<i class="fas fa-file-pdf"></i><span class="btn-text"> PDF</span>',
        className: 'dt-btn-export dt-btn-pdf',
        title: 'Data Warga HIFI',
        orientation: 'landscape',
        exportOptions: { columns: ':not(.no-export)' }
      },
      {
        extend: 'print',
        text: '<i class="fas fa-print"></i><span class="btn-text"> Print</span>',
        className: 'dt-btn-export dt-btn-print',
        title: 'Data Warga HIFI',
        exportOptions: { columns: ':not(.no-export)' }
      }
    ],
    initComplete: function() {
      $table.addClass('table-initialized');
      $('.dataTables_wrapper').addClass('wrapper-loaded');
      
      // Add search icon
      const searchWrapper = $('.dataTables_filter');
      if (!searchWrapper.find('.search-icon').length) {
        searchWrapper.prepend('<i class="fas fa-search search-icon"></i>');
      }
    },
    drawCallback: function(settings) {
      if (HIFI.isTouch()) {
        $table.addClass('touch-enabled');
      }
      
      // ✨ Wave animation
      const rows = $table.find('tbody tr');
      rows.each((i, row) => {
        const $row = $(row);
        $row.css({
          opacity: '0',
          transform: 'translateY(20px)'
        });
        
        setTimeout(() => {
          $row.css({
            transition: `all 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${i * 25}ms`,
            opacity: '1',
            transform: 'translateY(0)'
          });
        }, 10);
      });
    }
  });

  enhanceDataTable(dt);
  
  console.log('✅ DataTable initialized - Clean layout');
}

// ═══════════════════════════════════════════════════════════════
// ✨ DATATABLE ENHANCEMENTS - FIXED DETAIL
// ═══════════════════════════════════════════════════════════════
function enhanceDataTable(dt) {
  if (!dt) return;

  let activeRow = null;

  // ✨ FIXED: Proper detail row handling
  $('#usersTable tbody')
    .off('click.hifi')
    .on('click.hifi', 'tr:not(.detail-row)', function (e) {
      // Ignore interactive elements
      if ($(e.target).closest('.btn-action, button, a, form, input, select, .no-detail').length) {
        return;
      }

      const $clickedRow = $(this);
      const rowData = dt.row($clickedRow).data();
      
      // Skip if not a data row
      if (!rowData) return;

      // Check if this row already has detail
      const $existingDetail = $clickedRow.next('tr.detail-row');
      const isCurrentlyExpanded = $existingDetail.length > 0;

      // ✨ Close previous detail if different row
      if (activeRow && activeRow[0] !== $clickedRow[0]) {
        const $prevDetail = activeRow.next('tr.detail-row');
        if ($prevDetail.length) {
          activeRow.removeClass('row-expanded');
          $prevDetail.find('.dt-detail-wrapper').css({
            animation: 'slideOutUp 0.3s ease forwards'
          });
          setTimeout(() => {
            $prevDetail.remove();
          }, 300);
        }
      }

      if (isCurrentlyExpanded) {
        // ✨ Close current detail
        $clickedRow.removeClass('row-expanded');
        $existingDetail.find('.dt-detail-wrapper').css({
          animation: 'slideOutUp 0.3s ease forwards'
        });
        setTimeout(() => {
          $existingDetail.remove();
        }, 300);
        activeRow = null;
      } else {
        // ✨ Open new detail
        const detailHtml = HIFI.buildDetail(rowData);
        $clickedRow.after(detailHtml);
        
        $clickedRow.addClass('row-expanded');
        
        const $newDetail = $clickedRow.next('tr.detail-row');
        const $wrapper = $newDetail.find('.dt-detail-wrapper');
        
        $wrapper.css({
          display: 'block',
          animation: 'slideInDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
        });
        
        // Animate cards
        setTimeout(() => {
          $wrapper.find('.detail-card').each((i, card) => {
            $(card).css({
              animation: `fadeInUp 0.3s ease ${i * 40}ms both`
            });
          });
        }, 100);
        
        activeRow = $clickedRow;
        
        // Scroll into view on mobile
        if (HIFI.isMobile()) {
          setTimeout(() => {
            $newDetail[0].scrollIntoView({ 
              behavior: 'smooth', 
              block: 'nearest'
            });
          }, 450);
        }

        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate([5, 30, 5]);
        }
      }
    });

  // Pagination smooth scroll
  $('.dataTables_paginate').on('click', 'a.paginate_button:not(.disabled)', function() {
    if (!HIFI.isMobile()) {
      $('html, body').animate({
        scrollTop: $table.offset().top - 100
      }, 400);
    }
  });

  const handleResize = HIFI.debounce(() => {
    dt.columns.adjust();
  }, 300);

  $(window).on('resize.datatable', handleResize);
  
  console.log('✅ DataTable enhanced - Fixed detail behavior');
}

// ═══════════════════════════════════════════════════════════════
// 📈 CHART
// ═══════════════════════════════════════════════════════════════
function initCharts() {
  if (typeof Chart === 'undefined') return;
  const ctx = document.getElementById('userChart');
  if (!ctx) return;

  const isMobile = HIFI.isMobile();
  
  new Chart(ctx, {
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
        pointHoverRadius: isMobile ? 5 : 6,
        pointBackgroundColor: 'rgb(220, 20, 60)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: isMobile ? 1.5 : 2,
      animation: {
        duration: 1800,
        easing: 'easeInOutQuart'
      },
      plugins: {
        legend: {
          display: !isMobile,
          labels: { 
            font: { size: isMobile ? 10 : 12 },
            padding: 15
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          padding: 12,
          borderColor: 'rgba(220, 20, 60, 0.5)',
          borderWidth: 1
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { 
            font: { size: isMobile ? 10 : 12 }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          ticks: { 
            font: { size: isMobile ? 10 : 12 }
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// 💫 STAT CARDS
// ═══════════════════════════════════════════════════════════════
function animateStatCards() {
  const cards = document.querySelectorAll('.stat-card');
  if (!cards.length) return;

  const isMobile = HIFI.isMobile();
  const delay = isMobile ? 100 : 150;
  const duration = isMobile ? 600 : 800;

  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px) scale(0.9)';
    
    setTimeout(() => {
      card.style.transition = `all ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
      card.style.opacity = '1';
      card.style.transform = 'translateY(0) scale(1)';
      
      setTimeout(() => {
        card.classList.add('card-animated');
      }, duration);
    }, i * delay);
  });

  setTimeout(() => {
    cards.forEach(card => {
      const valueEl = card.querySelector('[data-counter]');
      if (valueEl) {
        const target = parseInt(valueEl.dataset.counter) || 0;
        animateCounter(valueEl, 0, target, 2000);
      }
    });
  }, 500);
}

function animateCounter(element, start, end, duration) {
  const range = end - start;
  const startTime = performance.now();
  
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);
    
    const current = Math.floor(start + (range * easedProgress));
    element.textContent = current.toLocaleString('id-ID');
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = end.toLocaleString('id-ID');
    }
  }
  
  requestAnimationFrame(updateCounter);
}

// ═══════════════════════════════════════════════════════════════
// ⏳ LOADING STATE
// ═══════════════════════════════════════════════════════════════
function showLoadingState(show = true) {
  let overlay = document.querySelector('.loading-overlay');
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring spinner-ring-2"></div>
        <div class="spinner-ring spinner-ring-3"></div>
        <p class="loading-text">${HIFI.isMobile() ? 'Loading...' : 'Memuat data...'}</p>
      </div>
    `;
    document.body.appendChild(overlay);
  }
  
  if (show) {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      overlay.classList.add('active');
    });
  } else {
    overlay.classList.remove('active');
    setTimeout(() => {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }, 400);
  }
}

// ═══════════════════════════════════════════════════════════════
// 🗑️ USER ACTIONS
// ═══════════════════════════════════════════════════════════════
function confirmDelete(id) {
  const message = HIFI.isMobile() 
    ? 'Hapus data ini?' 
    : 'Apakah Anda yakin ingin menghapus data ini?\nTindakan ini tidak dapat dibatalkan.';
  
  if (confirm(message)) {
    showLoadingState(true);
    
    if (navigator.vibrate) {
      navigator.vibrate([10, 50, 10]);
    }
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `/dashboard/delete/${id}?_method=DELETE`;
    document.body.appendChild(form);
    form.submit();
  }
}

// ═══════════════════════════════════════════════════════════════
// 👆 TOUCH ENHANCEMENTS
// ═══════════════════════════════════════════════════════════════
function initTouchEnhancements() {
  if (!HIFI.isTouch()) return;

  const touchElements = document.querySelectorAll(
    'button, .btn-action, .btn-primary-gradient, a[role="button"], .stat-card'
  );

  touchElements.forEach(el => {
    el.addEventListener('touchstart', function() {
      this.classList.add('touch-pressed');
      this.style.transform = 'scale(0.95)';
    }, { passive: true });
    
    el.addEventListener('touchend', function() {
      this.classList.remove('touch-pressed');
      this.style.transform = '';
    }, { passive: true });

    el.addEventListener('touchcancel', function() {
      this.classList.remove('touch-pressed');
      this.style.transform = '';
    }, { passive: true });
  });

  document.addEventListener('touchstart', function() {}, { passive: true });
}

// ═══════════════════════════════════════════════════════════════
// ♿ ACCESSIBILITY
// ═══════════════════════════════════════════════════════════════
function initAccessibility() {
  document.querySelectorAll('.btn-action').forEach(btn => {
    if (!btn.getAttribute('aria-label')) {
      const title = btn.getAttribute('title') || btn.textContent.trim();
      btn.setAttribute('aria-label', title);
    }
  });

  document.querySelectorAll('button, a, input, select, textarea').forEach(el => {
    el.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        this.classList.add('keyboard-focus');
      }
    });
    
    el.addEventListener('blur', function() {
      this.classList.remove('keyboard-focus');
    });
  });

  if (!document.querySelector('.skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
}

// ═══════════════════════════════════════════════════════════════
// 🚀 INIT ALL
// ═══════════════════════════════════════════════════════════════
function initAll() {
  console.log('═══════════════════════════════════════════');
  console.log('🚀 HIFI Admin Panel v3.1 FINAL');
  console.log('═══════════════════════════════════════════');
  
  const deviceType = HIFI.isMobile() ? 'Mobile 📱' : 
                     HIFI.isTablet() ? 'Tablet 💻' : 
                     'Desktop 🖥️';
  console.log(`📱 Device: ${deviceType}`);

  initSidebarToggle();
  
  setTimeout(() => initDataTable(), 100);
  setTimeout(() => initCharts(), 300);
  setTimeout(() => animateStatCards(), 500);
  
  initTouchEnhancements();
  initAccessibility();

  document.body.classList.add(
    HIFI.isMobile() ? 'is-mobile' : 
    HIFI.isTablet() ? 'is-tablet' : 
    'is-desktop'
  );
  
  if (HIFI.isTouch()) {
    document.body.classList.add('is-touch');
  }

  document.body.classList.add('page-loaded');

  console.log('═══════════════════════════════════════════');
  console.log('✅ Initialization complete!');
  console.log('═══════════════════════════════════════════');
}

// ═══════════════════════════════════════════════════════════════
// 📍 DOM READY
// ═══════════════════════════════════════════════════════════════
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

// ═══════════════════════════════════════════════════════════════
// 🌐 GLOBAL API
// ═══════════════════════════════════════════════════════════════
window.HIFIAdmin = {
  showLoadingState,
  confirmDelete,
  isMobile: HIFI.isMobile,
  isTablet: HIFI.isTablet,
  isDesktop: HIFI.isDesktop,
  isTouch: HIFI.isTouch,
  getDataTable: getDT,
  version: '3.1'
};

// ═══════════════════════════════════════════════════════════════
// 🎨 PERFECT STYLES - GLASSMORPHISM + CLEAN LAYOUT
// ═══════════════════════════════════════════════════════════════
const finalStyles = document.createElement('style');
finalStyles.textContent = `
  /* ═══════════════════════════════════════════════════════════════
     🎬 KEYFRAMES
     ═══════════════════════════════════════════════════════════════ */
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInDown {
    0% {
      opacity: 0;
      transform: translateY(-20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideOutUp {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-20px);
    }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  /* ═══════════════════════════════════════════════════════════════
     📱 GLASSMORPHISM SIDEBAR - FIXED
     ═══════════════════════════════════════════════════════════════ */
  
  .sidebar-glass {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 260px;
    background: rgba(255, 255, 255, 0.75) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border-right: 1px solid rgba(255, 255, 255, 0.3) !important;
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.5) !important;
    z-index: 1000;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: auto;
    overflow-x: hidden;
  }

  /* Glassmorphism scrollbar */
  .sidebar-glass::-webkit-scrollbar {
    width: 6px;
  }

  .sidebar-glass::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  .sidebar-glass::-webkit-scrollbar-thumb {
    background: rgba(220, 20, 60, 0.3);
    border-radius: 3px;
  }

  .sidebar-glass::-webkit-scrollbar-thumb:hover {
    background: rgba(220, 20, 60, 0.5);
  }

  /* Desktop: Always visible */
  @media (min-width: 769px) {
    .sidebar-glass {
      transform: translateX(0) !important;
    }
    
    .main-content,
    .content-wrapper {
      margin-left: 260px;
      transition: margin-left 0.4s ease;
    }
  }

  /* Mobile: Slide from left */
  @media (max-width: 768px) {
    .sidebar-glass {
      transform: translateX(-100%);
      background: rgba(255, 255, 255, 0.95) !important;
    }
    
    .sidebar-glass.mobile-active {
      transform: translateX(0);
      box-shadow: 4px 0 40px rgba(0, 0, 0, 0.2);
    }
    
    .main-content,
    .content-wrapper {
      margin-left: 0;
      width: 100%;
    }
  }

  .sidebar-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 999;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .sidebar-overlay.active {
    opacity: 1;
    visibility: visible;
  }

  /* ═══════════════════════════════════════════════════════════════
     ⏳ LOADING OVERLAY
     ═══════════════════════════════════════════════════════════════ */
  
  .loading-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    z-index: 99999;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  .loading-overlay.active {
    opacity: 1;
  }
  
  .loading-spinner {
    text-align: center;
    color: white;
    position: relative;
  }

  .spinner-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 70px;
    height: 70px;
    margin: -35px 0 0 -35px;
    border: 4px solid transparent;
    border-top-color: #dc143c;
    border-radius: 50%;
    animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }

  .spinner-ring-2 {
    width: 56px;
    height: 56px;
    margin: -28px 0 0 -28px;
    border-width: 3px;
    border-top-color: #ff6b6b;
    animation-delay: -0.5s;
  }

  .spinner-ring-3 {
    width: 42px;
    height: 42px;
    margin: -21px 0 0 -21px;
    border-width: 2px;
    border-top-color: #ffa07a;
    animation-delay: -1s;
  }

  .loading-text {
    margin-top: 90px;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 1px;
    animation: pulse 1.5s ease-in-out infinite;
  }

  /* ═══════════════════════════════════════════════════════════════
     📊 DATATABLE - CLEAN LAYOUT
     ═══════════════════════════════════════════════════════════════ */

  .dataTables_wrapper {
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  .dataTables_wrapper.wrapper-loaded {
    opacity: 1;
  }

  /* Header Layout: Buttons left, Length + Search right */
  .datatable-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    gap: 20px;
    flex-wrap: wrap;
  }

  .header-left {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .header-right {
    display: flex;
    gap: 15px;
    align-items: center;
    margin-left: auto;
  }

  /* Footer Layout: Info left, Pagination right */
  .datatable-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    gap: 20px;
    flex-wrap: wrap;
  }

  .footer-left {
    flex: 0 0 auto;
  }

  .footer-right {
    flex: 0 0 auto;
    margin-left: auto;
  }

  /* Table Body */
  .datatable-body {
    overflow-x: auto;
  }

  #usersTable {
    opacity: 0;
    transition: opacity 0.6s ease;
    width: 100% !important;
  }

  #usersTable.table-initialized {
    opacity: 1;
  }

  #usersTable tbody tr:not(.detail-row) {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
  }

  #usersTable tbody tr:not(.detail-row):hover {
    background-color: rgba(220, 20, 60, 0.05) !important;
    transform: translateX(4px);
    box-shadow: -4px 0 0 0 rgba(220, 20, 60, 0.5);
  }

  #usersTable tbody tr.row-expanded {
    background: rgba(220, 20, 60, 0.08) !important;
    box-shadow: inset 4px 0 0 0 rgba(220, 20, 60, 0.8);
  }

  /* Detail Row */
  tr.detail-row {
    background: transparent !important;
  }

  tr.detail-row:hover {
    background: transparent !important;
  }

  .detail-cell {
    padding: 0 !important;
    border: none !important;
  }

  .dt-detail-wrapper {
    padding: 20px;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.95) 0%, 
      rgba(250, 250, 250, 0.95) 100%);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 12px;
    box-shadow: 
      0 10px 40px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    margin: 8px;
  }

  .detail-grid {
    display: grid;
    gap: 16px;
  }

  .detail-card {
    background: white;
    padding: 16px;
    border-radius: 10px;
    border: 1px solid rgba(220, 20, 60, 0.1);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .detail-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 0;
    background: linear-gradient(180deg, #dc143c, #ff6b6b);
    transition: height 0.3s ease;
  }

  .detail-card:hover::before {
    height: 100%;
  }

  .detail-card:hover {
    transform: translateY(-3px) translateX(3px);
    box-shadow: -3px 6px 15px rgba(220, 20, 60, 0.15);
    border-color: rgba(220, 20, 60, 0.3);
  }

  .detail-card.full-width {
    grid-column: 1 / -1;
  }

  .detail-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    padding-bottom: 6px;
    border-bottom: 2px solid rgba(220, 20, 60, 0.1);
  }

  .detail-header i {
    color: #dc143c;
    font-size: 16px;
  }

  .detail-header span {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #666;
  }

  .detail-value {
    font-size: 14px;
    font-weight: 600;
    color: #222;
    word-break: break-word;
  }

  .role-badge {
    display: inline-block;
    padding: 5px 14px;
    border-radius: 16px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
  }

  .role-admin {
    background: linear-gradient(135deg, #dc143c, #ff6b6b);
    color: white;
    box-shadow: 0 3px 10px rgba(220, 20, 60, 0.3);
  }

  .role-user {
    background: linear-gradient(135deg, #6c757d, #95a5a6);
    color: white;
    box-shadow: 0 3px 10px rgba(108, 117, 125, 0.3);
  }

  /* ═══════════════════════════════════════════════════════════════
     🔍 SEARCH & LENGTH
     ═══════════════════════════════════════════════════════════════ */

  .dataTables_filter {
    position: relative;
  }

  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #dc143c;
    font-size: 14px;
    pointer-events: none;
    z-index: 1;
  }

  .dataTables_filter input {
    padding: 10px 15px 10px 38px !important;
    border: 2px solid rgba(220, 20, 60, 0.2) !important;
    border-radius: 8px !important;
    transition: all 0.3s ease !important;
    min-width: 200px;
  }

  .dataTables_filter input:focus {
    box-shadow: 0 0 0 4px rgba(220, 20, 60, 0.1) !important;
    border-color: #dc143c !important;
    outline: none !important;
  }

  .dataTables_length {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .dataTables_length label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-weight: 600;
    color: #666;
  }

  .dataTables_length select {
    padding: 8px 32px 8px 12px !important;
    border: 2px solid rgba(220, 20, 60, 0.2) !important;
    border-radius: 8px !important;
    font-weight: 600 !important;
    transition: all 0.3s ease !important;
    cursor: pointer !important;
    appearance: none;
    background: white url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="%23dc143c" d="M6 9L1 4h10z"/></svg>') no-repeat right 10px center;
  }

  .dataTables_length select:hover {
    border-color: #dc143c !important;
    box-shadow: 0 2px 8px rgba(220, 20, 60, 0.15) !important;
  }

  .dataTables_length select:focus {
    outline: none !important;
    border-color: #dc143c !important;
    box-shadow: 0 0 0 4px rgba(220, 20, 60, 0.1) !important;
  }

  /* ═══════════════════════════════════════════════════════════════
     🎯 EXPORT BUTTONS
     ═══════════════════════════════════════════════════════════════ */

  .dt-buttons {
    display: flex;
    gap: 10px;
  }

  .dt-btn-export {
    padding: 10px 18px !important;
    border-radius: 8px !important;
    border: none !important;
    font-weight: 600 !important;
    font-size: 14px !important;
    transition: all 0.3s ease !important;
    cursor: pointer !important;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15) !important;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .dt-btn-export:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25) !important;
  }

  .dt-btn-excel {
    background: linear-gradient(135deg, #217346, #2ea85b) !important;
    color: white !important;
  }

  .dt-btn-pdf {
    background: linear-gradient(135deg, #dc143c, #ff6b6b) !important;
    color: white !important;
  }

  .dt-btn-print {
    background: linear-gradient(135deg, #495057, #6c757d) !important;
    color: white !important;
  }

  /* ═══════════════════════════════════════════════════════════════
     📄 PAGINATION
     ═══════════════════════════════════════════════════════════════ */

  .dataTables_paginate {
    display: flex;
    gap: 5px;
  }

  .dataTables_paginate .paginate_button {
    padding: 8px 14px !important;
    margin: 0 !important;
    border-radius: 6px !important;
    border: 2px solid rgba(220, 20, 60, 0.2) !important;
    background: white !important;
    color: #dc143c !important;
    font-weight: 600 !important;
    transition: all 0.3s ease !important;
    cursor: pointer !important;
  }

  .dataTables_paginate .paginate_button:hover:not(.disabled) {
    background: linear-gradient(135deg, #dc143c, #ff6b6b) !important;
    color: white !important;
    border-color: #dc143c !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 20, 60, 0.3) !important;
  }

  .dataTables_paginate .paginate_button.current {
    background: linear-gradient(135deg, #dc143c, #ff6b6b) !important;
    color: white !important;
    border-color: #dc143c !important;
    box-shadow: 0 3px 10px rgba(220, 20, 60, 0.4) !important;
  }

  .dataTables_paginate .paginate_button.disabled {
    opacity: 0.4;
    cursor: not-allowed !important;
  }

  .dataTables_info {
    font-weight: 600;
    color: #666;
  }

  /* ═══════════════════════════════════════════════════════════════
     🎴 STAT CARDS
     ═══════════════════════════════════════════════════════════════ */

  .stat-card {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .stat-card.card-animated:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 30px rgba(220, 20, 60, 0.2);
  }

  /* ═══════════════════════════════════════════════════════════════
     👆 TOUCH & ACCESSIBILITY
     ═══════════════════════════════════════════════════════════════ */

  .touch-pressed {
    transition: transform 0.15s ease !important;
  }

  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: #dc143c;
    color: white;
    padding: 8px 16px;
    text-decoration: none;
    border-radius: 0 0 4px 0;
    z-index: 100000;
    transition: top 0.3s ease;
    font-weight: 600;
  }

  .skip-link:focus {
    top: 0;
    outline: 3px solid #fff;
    outline-offset: 2px;
  }

  .keyboard-focus {
    outline: 3px solid #dc143c !important;
    outline-offset: 3px !important;
  }

  /* ═══════════════════════════════════════════════════════════════
     🎨 EMPTY STATE
     ═══════════════════════════════════════════════════════════════ */

  .empty-state {
    padding: 60px 20px;
    text-align: center;
  }

  .empty-icon {
    margin-bottom: 20px;
    color: rgba(220, 20, 60, 0.2);
  }

  .empty-title {
    font-size: 18px;
    font-weight: 700;
    color: #666;
    margin: 0 0 8px 0;
  }

  .empty-subtitle {
    font-size: 14px;
    color: #999;
    margin: 0;
  }

  /* ═══════════════════════════════════════════════════════════════
     📱 RESPONSIVE
     ═══════════════════════════════════════════════════════════════ */

  @media (max-width: 768px) {
    .datatable-header,
    .datatable-footer {
      flex-direction: column;
      align-items: stretch;
    }

    .header-left,
    .header-right {
      width: 100%;
      justify-content: center;
    }

    .footer-left,
    .footer-right {
      width: 100%;
      justify-content: center;
    }

    .dataTables_filter input {
      min-width: 100%;
    }

    .btn-text {
      display: none;
    }

    .dt-btn-export {
      padding: 10px 14px !important;
    }

    .dataTables_paginate .paginate_button {
      padding: 6px 10px !important;
      font-size: 13px !important;
    }

    .dt-detail-wrapper {
      padding: 14px;
      margin: 6px;
    }

    .detail-card {
      padding: 12px;
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     🎨 PAGE LOADED
     ═══════════════════════════════════════════════════════════════ */

  body {
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  body.page-loaded {
    opacity: 1;
  }

  /* Performance */
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

document.head.appendChild(finalStyles);

console.log('═══════════════════════════════════════════');
console.log('✨ HIFI Admin v3.1 FINAL - Perfect Layout');
console.log('═══════════════════════════════════════════');
