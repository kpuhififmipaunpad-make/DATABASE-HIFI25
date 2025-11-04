/**
 * ═══════════════════════════════════════════════════════════════
 * HIFI DATABASE - ADMIN PANEL v3.0
 * ═══════════════════════════════════════════════════════════════
 * ✨ NEW: Fixed sidebar, enhanced pagination, satisfying animations
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
  
  // ✨ NEW: Enhanced detail template dengan animasi yang lebih satisfying
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
    
    // ✨ Icons dengan style yang lebih menarik
    const icons = {
      username: '<i class="fas fa-user-circle detail-icon"></i>',
      nama: '<i class="fas fa-user detail-icon"></i>',
      npm: '<i class="fas fa-id-card detail-icon"></i>',
      email: '<i class="fas fa-envelope detail-icon"></i>',
      phone: '<i class="fas fa-phone detail-icon"></i>',
      role: '<i class="fas fa-shield-alt detail-icon"></i>',
      clock: '<i class="fas fa-clock detail-icon"></i>'
    };
    
    return `
      <div class="dt-detail-wrapper">
        <div class="dt-detail-container">
          <div class="detail-grid" style="
            display: grid;
            grid-template-columns: ${isMobileView ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))'};
            gap: ${isMobileView ? '14px' : '18px'};
          ">
            <!-- Username -->
            <div class="detail-item-card" data-aos="fade-up" data-aos-delay="0">
              <div class="detail-item-header">
                ${icons.username}
                <span class="detail-label">Username</span>
              </div>
              <div class="detail-value">${esc(username)}</div>
            </div>
            
            <!-- Nama Lengkap -->
            <div class="detail-item-card" data-aos="fade-up" data-aos-delay="50">
              <div class="detail-item-header">
                ${icons.nama}
                <span class="detail-label">Nama Lengkap</span>
              </div>
              <div class="detail-value">${esc(nama)}</div>
            </div>
            
            <!-- NPM -->
            <div class="detail-item-card" data-aos="fade-up" data-aos-delay="100">
              <div class="detail-item-header">
                ${icons.npm}
                <span class="detail-label">NPM</span>
              </div>
              <div class="detail-value">${esc(npm)}</div>
            </div>
            
            <!-- Email -->
            <div class="detail-item-card" data-aos="fade-up" data-aos-delay="150">
              <div class="detail-item-header">
                ${icons.email}
                <span class="detail-label">Email</span>
              </div>
              <div class="detail-value">${esc(email)}</div>
            </div>
            
            <!-- No. HP -->
            <div class="detail-item-card" data-aos="fade-up" data-aos-delay="200">
              <div class="detail-item-header">
                ${icons.phone}
                <span class="detail-label">No. HP</span>
              </div>
              <div class="detail-value">${esc(no_hp)}</div>
            </div>
            
            <!-- Role -->
            <div class="detail-item-card" data-aos="fade-up" data-aos-delay="250">
              <div class="detail-item-header">
                ${icons.role}
                <span class="detail-label">Role</span>
              </div>
              <div class="detail-value">
                <span class="role-badge ${role === 'Administrator' ? 'role-admin' : 'role-user'}">
                  ${esc(role)}
                </span>
              </div>
            </div>
            
            <!-- Terakhir Update -->
            <div class="detail-item-card full-width" data-aos="fade-up" data-aos-delay="300">
              <div class="detail-item-header">
                ${icons.clock}
                <span class="detail-label">Terakhir Update</span>
              </div>
              <div class="detail-value">${esc(lastUpdate)}</div>
            </div>
          </div>
        </div>
      </div>
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
// 📱 SIDEBAR - FIXED (NO COLLAPSING TO SIDE)
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

  // ✨ NEW: Sidebar tetap terlihat, hanya hide di mobile
  const toggleSidebar = () => {
    if (HIFI.isMobile()) {
      // Mobile: slide dari kiri dengan overlay
      const isActive = sidebar.classList.contains('mobile-active');
      
      sidebar.classList.toggle('mobile-active');
      overlay.classList.toggle('active');
      document.body.style.overflow = isActive ? '' : 'hidden';
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    }
    // Desktop: sidebar selalu terlihat, tidak ada collapse
  };

  // Hamburger untuk mobile
  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSidebar();
    });
  }

  // Overlay click to close (mobile only)
  overlay.addEventListener('click', () => {
    if (HIFI.isMobile()) {
      sidebar.classList.remove('mobile-active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Close sidebar on outside click (mobile)
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

  // ✨ Handle resize - sidebar selalu visible di desktop
  const handleResize = HIFI.debounce(() => {
    if (!HIFI.isMobile()) {
      // Desktop: remove mobile classes
      sidebar.classList.remove('mobile-active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }, 250);

  window.addEventListener('resize', handleResize);
  
  console.log('✅ Sidebar initialized - Fixed layout (no collapse)');
}

// ═══════════════════════════════════════════════════════════════
// 📊 DATATABLE - ULTRA SATISFYING ANIMATIONS
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

  // Destroy existing instance
  if ($.fn.DataTable.isDataTable('#usersTable')) {
    $('#usersTable').DataTable().destroy();
  }

  const isMobile = HIFI.isMobile();
  const isTablet = HIFI.isTablet();
  
  // ✨ NEW: Dynamic page length dengan opsi lengkap
  let defaultPageLength = 25;
  if (isMobile) defaultPageLength = 10;
  else if (isTablet) defaultPageLength = 25;

  // ✨ Initialize dengan animasi ultra smooth
  const dt = $table.DataTable({
    responsive: false,
    autoWidth: false,
    searching: true,
    lengthChange: true,
    pagingType: 'full_numbers', // ✨ NEW: Full pagination controls
    pageLength: defaultPageLength,
    lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]], // ✨ NEW: Complete options
    dom: "Bfrtip",
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
        first: '<i class="fas fa-angle-double-left"></i><span class="page-text"> First</span>', 
        previous: '<i class="fas fa-angle-left"></i><span class="page-text"> Prev</span>', 
        next: '<span class="page-text">Next </span><i class="fas fa-angle-right"></i>', 
        last: '<span class="page-text">Last </span><i class="fas fa-angle-double-right"></i>' 
      },
      info: isMobile ? '_START_-_END_ / _TOTAL_' : 'Showing _START_ to _END_ of _TOTAL_ entries',
      infoEmpty: 'No entries available',
      infoFiltered: isMobile ? '' : '(filtered from _MAX_ total entries)',
      zeroRecords: `
        <div class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-search fa-3x"></i>
          </div>
          <p class="empty-title">No Data Found</p>
          <p class="empty-subtitle">Try adjusting your search or filter</p>
        </div>
      `,
      emptyTable: `
        <div class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-database fa-3x"></i>
          </div>
          <p class="empty-title">No Data Available</p>
          <p class="empty-subtitle">The table is currently empty</p>
        </div>
      `,
      lengthMenu: isMobile ? '_MENU_' : 'Show _MENU_ entries',
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
      // ✨ Smooth fade-in after initialization
      $table.addClass('table-initialized');
      
      // Animate table wrapper
      setTimeout(() => {
        $('.dataTables_wrapper').addClass('wrapper-loaded');
      }, 100);
    },
    drawCallback: function(settings) {
      if (HIFI.isTouch()) {
        $table.addClass('touch-enabled');
      }
      
      // ✨ ULTRA SATISFYING: Wave animation untuk rows
      const rows = $table.find('tbody tr');
      rows.each((i, row) => {
        const $row = $(row);
        
        // Reset animation
        $row.css({
          opacity: '0',
          transform: 'translateY(20px) scale(0.95)'
        });
        
        // ✨ Staggered wave animation
        setTimeout(() => {
          $row.css({
            transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 30}ms`,
            opacity: '1',
            transform: 'translateY(0) scale(1)'
          });
        }, 10);
      });
      
      // Update pagination info dengan animasi
      $('.dataTables_info').addClass('info-updated');
      setTimeout(() => {
        $('.dataTables_info').removeClass('info-updated');
      }, 300);
    }
  });

  enhanceDataTable(dt);
  
  console.log('✅ DataTable initialized with ULTRA SATISFYING animations');
}

// ═══════════════════════════════════════════════════════════════
// ✨ DATATABLE ENHANCEMENTS - SMART TOGGLE
// ═══════════════════════════════════════════════════════════════
function enhanceDataTable(dt) {
  if (!dt) return;

  // Style wrappers
  $('.dataTables_wrapper').addClass('glass-card');
  $('.dataTables_filter input').addClass('form-control-glass');
  $('.dataTables_length select').addClass('form-control-glass');

  // ✨ Enhanced search dengan icon
  const searchWrapper = $('.dataTables_filter');
  if (!searchWrapper.find('.search-icon').length) {
    searchWrapper.prepend('<i class="fas fa-search search-icon"></i>');
  }

  // ✨ Variable untuk tracking active row
  let activeRow = null;

  // ✨ NEW: Smart toggle - auto hide previous detail
  $('#usersTable tbody')
    .off('click.hifi touchend.hifi')
    .on('click.hifi touchend.hifi', 'tr', function (e) {
      // Prevent double-firing
      if (e.type === 'touchend') {
        e.preventDefault();
      }
      
      // Ignore interactive elements
      if ($(e.target).closest('.btn-action, button, a, form, input, select, .no-detail').length) {
        return;
      }

      const $tr = $(this);
      const row = dt.row($tr);
      
      // Skip jika bukan data row
      if (!row.data()) return;

      // ✨ SMART BEHAVIOR:
      // 1. Jika row yang sama diklik lagi -> toggle (show/hide)
      // 2. Jika row berbeda -> hide previous, show new
      
      if (activeRow && activeRow[0] !== $tr[0]) {
        // ✨ Hide previous row dengan smooth animation
        const prevRow = dt.row(activeRow);
        if (prevRow.child.isShown()) {
          activeRow.removeClass('row-expanded');
          
          // Smooth slide up
          const $prevDetail = activeRow.next('tr.child').find('.dt-detail-wrapper');
          $prevDetail.css({
            animation: 'slideOutUp 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards'
          });
          
          setTimeout(() => {
            prevRow.child.hide();
          }, 350);
        }
      }

      if (row.child.isShown() && activeRow && activeRow[0] === $tr[0]) {
        // ✨ Close current row (toggle behavior)
        $tr.removeClass('row-expanded');
        
        const $detail = $tr.next('tr.child').find('.dt-detail-wrapper');
        $detail.css({
          animation: 'slideOutUp 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards'
        });
        
        setTimeout(() => {
          row.child.hide();
        }, 350);
        
        activeRow = null;
        
      } else {
        // ✨ Open new row
        const rowData = row.data();
        row.child(HIFI.buildDetail(rowData)).show();
        
        // Animate row expansion
        $tr.addClass('row-expanding');
        setTimeout(() => {
          $tr.removeClass('row-expanding').addClass('row-expanded');
        }, 10);
        
        // ✨ Ultra smooth slide down with bounce
        const $detail = $tr.next('tr.child').find('.dt-detail-wrapper');
        $detail.css({
          display: 'block',
          animation: 'slideInDown 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
        });
        
        // Animate detail cards
        setTimeout(() => {
          $detail.find('.detail-item-card').each((i, card) => {
            $(card).css({
              animation: `fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${i * 50}ms both`
            });
          });
        }, 100);
        
        // Update active row
        activeRow = $tr;
        
        // Scroll into view on mobile
        if (HIFI.isMobile()) {
          setTimeout(() => {
            const childRow = row.child()[0];
            if (childRow) {
              childRow.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest',
                inline: 'nearest'
              });
            }
          }, 550);
        }

        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate([5, 30, 5]);
        }
      }
    });

  // ✨ Enhanced pagination dengan animasi
  $('.dataTables_paginate').on('click', 'a', function() {
    // Smooth scroll to top
    if (!HIFI.isMobile()) {
      $('html, body').animate({
        scrollTop: $table.offset().top - 100
      }, 400, 'swing');
    }
  });

  // ✨ Resize handler
  const handleResize = HIFI.debounce(() => {
    const isMobile = HIFI.isMobile();
    const isTablet = HIFI.isTablet();
    
    dt.columns.adjust().responsive.recalc();
  }, 300);

  $(window).on('resize.datatable', handleResize);
  
  console.log('✅ DataTable enhanced with smart toggle behavior');
}

// ═══════════════════════════════════════════════════════════════
// 📈 CHART - SMOOTH ANIMATIONS
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
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(220, 20, 60)',
        pointHoverBorderWidth: 2
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
            padding: 15,
            usePointStyle: true
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          padding: 12,
          borderColor: 'rgba(220, 20, 60, 0.5)',
          borderWidth: 1,
          displayColors: false,
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 },
          callbacks: {
            title: (context) => context[0].label,
            label: (context) => `Pendaftar: ${context.parsed.y} orang`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { 
            font: { size: isMobile ? 10 : 12 },
            padding: 8
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          }
        },
        x: {
          ticks: { 
            font: { size: isMobile ? 10 : 12 },
            padding: 8
          },
          grid: {
            display: false,
            drawBorder: false
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      }
    }
  });

  console.log('✅ Chart initialized');
}

// ═══════════════════════════════════════════════════════════════
// 💫 STAT CARDS - SATISFYING ANIMATIONS
// ═══════════════════════════════════════════════════════════════
function animateStatCards() {
  const cards = document.querySelectorAll('.stat-card');
  if (!cards.length) return;

  const isMobile = HIFI.isMobile();
  const delay = isMobile ? 100 : 150;
  const duration = isMobile ? 600 : 800;

  cards.forEach((card, i) => {
    // Initial state
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px) scale(0.9) rotateX(10deg)';
    
    setTimeout(() => {
      card.style.transition = `all ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
      card.style.opacity = '1';
      card.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
      
      // Add hover class after animation
      setTimeout(() => {
        card.classList.add('card-animated');
      }, duration);
    }, i * delay);
  });

  // Animate counters
  setTimeout(() => {
    cards.forEach(card => {
      const valueEl = card.querySelector('[data-counter]');
      if (valueEl) {
        const target = parseInt(valueEl.dataset.counter) || 0;
        animateCounter(valueEl, 0, target, 2000);
      }
    });
  }, 500);

  console.log('✅ Stat cards animated');
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

  console.log('✅ Touch enhancements activated');
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

  console.log('✅ Accessibility enhanced');
}

// ═══════════════════════════════════════════════════════════════
// 🚀 INIT ALL
// ═══════════════════════════════════════════════════════════════
function initAll() {
  console.log('═══════════════════════════════════════════');
  console.log('🚀 HIFI Admin Panel v3.0 - Initializing...');
  console.log('═══════════════════════════════════════════');
  
  const deviceType = HIFI.isMobile() ? 'Mobile 📱' : 
                     HIFI.isTablet() ? 'Tablet 💻' : 
                     'Desktop 🖥️';
  console.log(`📱 Device: ${deviceType}`);

  // Core
  initSidebarToggle();
  
  setTimeout(() => initDataTable(), 100);
  setTimeout(() => initCharts(), 300);
  setTimeout(() => animateStatCards(), 500);
  
  // Enhancements
  initTouchEnhancements();
  initAccessibility();

  // Device classes
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
  version: '3.0'
};

// ═══════════════════════════════════════════════════════════════
// 🎨 ULTRA SATISFYING STYLES
// ═══════════════════════════════════════════════════════════════
const ultraStyles = document.createElement('style');
ultraStyles.textContent = `
  /* ═══════════════════════════════════════════════════════════════
     🎬 ULTRA SATISFYING KEYFRAMES
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
      max-height: 0;
      transform: translateY(-30px) scaleY(0.8);
    }
    50% {
      opacity: 0.5;
      transform: translateY(5px) scaleY(1.05);
    }
    100% {
      opacity: 1;
      max-height: 2000px;
      transform: translateY(0) scaleY(1);
    }
  }

  @keyframes slideOutUp {
    0% {
      opacity: 1;
      max-height: 2000px;
      transform: translateY(0) scaleY(1);
    }
    50% {
      transform: translateY(-5px) scaleY(0.95);
    }
    100% {
      opacity: 0;
      max-height: 0;
      transform: translateY(-30px) scaleY(0.8);
    }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes glow {
    0%, 100% { box-shadow: 0 0 5px rgba(220, 20, 60, 0.5); }
    50% { box-shadow: 0 0 20px rgba(220, 20, 60, 0.8); }
  }

  /* ═══════════════════════════════════════════════════════════════
     📱 FIXED SIDEBAR (NO COLLAPSE TO SIDE)
     ═══════════════════════════════════════════════════════════════ */
  
  .sidebar-glass {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 260px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: auto;
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

  /* Mobile: Slide from left with overlay */
  @media (max-width: 768px) {
    .sidebar-glass {
      transform: translateX(-100%);
    }
    
    .sidebar-glass.mobile-active {
      transform: translateX(0);
      box-shadow: 4px 0 30px rgba(0, 0, 0, 0.3);
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
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
     📊 DATATABLE - ULTRA ENHANCED
     ═══════════════════════════════════════════════════════════════ */

  .dataTables_wrapper {
    transition: all 0.5s ease;
    opacity: 0;
  }

  .dataTables_wrapper.wrapper-loaded {
    opacity: 1;
  }

  #usersTable {
    opacity: 0;
    transition: opacity 0.6s ease;
  }

  #usersTable.table-initialized {
    opacity: 1;
  }

  #usersTable tbody tr {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    position: relative;
  }

  #usersTable tbody tr::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 0;
    background: linear-gradient(90deg, rgba(220, 20, 60, 0.1) 0%, transparent 100%);
    transition: width 0.3s ease;
  }

  #usersTable tbody tr:hover::before {
    width: 100%;
  }

  #usersTable tbody tr:hover {
    background-color: rgba(220, 20, 60, 0.03) !important;
    transform: translateX(6px);
    box-shadow: -5px 0 0 0 rgba(220, 20, 60, 0.6);
  }

  #usersTable tbody tr.row-expanding {
    background-color: rgba(220, 20, 60, 0.05) !important;
    transform: scale(1.01);
  }

  #usersTable tbody tr.row-expanded {
    background: linear-gradient(90deg, 
      rgba(220, 20, 60, 0.08) 0%, 
      rgba(220, 20, 60, 0.03) 50%, 
      transparent 100%) !important;
    box-shadow: inset 4px 0 0 0 rgba(220, 20, 60, 0.8);
  }

  /* ✨ Detail Container - Ultra Smooth */
  .dt-detail-wrapper {
    padding: 20px;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.95) 0%, 
      rgba(250, 250, 250, 0.95) 100%);
    border-radius: 12px;
    box-shadow: 
      0 10px 40px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    margin: 12px 8px;
    overflow: hidden;
  }

  .dt-detail-container {
    position: relative;
  }

  .detail-grid {
    display: grid;
    gap: 18px;
  }

  /* ✨ Detail Item Cards - Beautiful Design */
  .detail-item-card {
    background: white;
    padding: 16px 18px;
    border-radius: 10px;
    border: 1px solid rgba(220, 20, 60, 0.1);
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    overflow: hidden;
  }

  .detail-item-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 0;
    background: linear-gradient(180deg, #dc143c 0%, #ff6b6b 100%);
    transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .detail-item-card:hover::before {
    height: 100%;
  }

  .detail-item-card:hover {
    transform: translateY(-4px) translateX(4px);
    box-shadow: 
      -4px 8px 20px rgba(220, 20, 60, 0.15),
      0 0 0 1px rgba(220, 20, 60, 0.2);
    border-color: rgba(220, 20, 60, 0.3);
  }

  .detail-item-card.full-width {
    grid-column: 1 / -1;
  }

  .detail-item-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 2px solid rgba(220, 20, 60, 0.1);
  }

  .detail-icon {
    color: #dc143c;
    font-size: 18px;
    width: 24px;
    text-align: center;
    animation: glow 2s ease-in-out infinite;
  }

  .detail-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #666;
  }

  .detail-value {
    font-size: 15px;
    font-weight: 600;
    color: #222;
    word-break: break-word;
  }

  /* Role Badge - Enhanced */
  .role-badge {
    display: inline-block;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    transition: all 0.3s ease;
  }

  .role-admin {
    background: linear-gradient(135deg, #dc143c 0%, #ff6b6b 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(220, 20, 60, 0.4);
  }

  .role-admin:hover {
    box-shadow: 0 6px 20px rgba(220, 20, 60, 0.6);
    transform: scale(1.05);
  }

  .role-user {
    background: linear-gradient(135deg, #6c757d 0%, #95a5a6 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(108, 117, 125, 0.4);
  }

  .role-user:hover {
    box-shadow: 0 6px 20px rgba(108, 117, 125, 0.6);
    transform: scale(1.05);
  }

  /* ═══════════════════════════════════════════════════════════════
     🔍 SEARCH & PAGINATION - ENHANCED
     ═══════════════════════════════════════════════════════════════ */

  .dataTables_filter {
    position: relative;
  }

  .search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #dc143c;
    font-size: 16px;
    pointer-events: none;
    z-index: 1;
    transition: all 0.3s ease;
  }

  .dataTables_filter input:focus + .search-icon,
  .dataTables_filter:hover .search-icon {
    color: #ff6b6b;
    transform: translateY(-50%) scale(1.1);
  }

  .dataTables_filter input {
    padding-left: 45px !important;
    transition: all 0.3s ease;
    border: 2px solid rgba(220, 20, 60, 0.2);
  }

  .dataTables_filter input:focus {
    box-shadow: 0 0 0 4px rgba(220, 20, 60, 0.1);
    border-color: #dc143c;
  }

  /* Length Menu - Enhanced */
  .dataTables_length select {
    padding: 8px 35px 8px 12px !important;
    border: 2px solid rgba(220, 20, 60, 0.2);
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .dataTables_length select:hover {
    border-color: #dc143c;
    box-shadow: 0 2px 8px rgba(220, 20, 60, 0.15);
  }

  .dataTables_length select:focus {
    outline: none;
    border-color: #dc143c;
    box-shadow: 0 0 0 4px rgba(220, 20, 60, 0.1);
  }

  /* Pagination - Ultra Enhanced */
  .dataTables_paginate {
    margin-top: 20px;
  }

  .dataTables_paginate .paginate_button {
    padding: 10px 16px !important;
    margin: 0 4px !important;
    border-radius: 8px !important;
    border: 2px solid rgba(220, 20, 60, 0.2) !important;
    background: white !important;
    color: #dc143c !important;
    font-weight: 600 !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  .dataTables_paginate .paginate_button:hover {
    background: linear-gradient(135deg, #dc143c 0%, #ff6b6b 100%) !important;
    color: white !important;
    border-color: #dc143c !important;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(220, 20, 60, 0.3) !important;
  }

  .dataTables_paginate .paginate_button.current {
    background: linear-gradient(135deg, #dc143c 0%, #ff6b6b 100%) !important;
    color: white !important;
    border-color: #dc143c !important;
    box-shadow: 0 4px 12px rgba(220, 20, 60, 0.4) !important;
  }

  .dataTables_paginate .paginate_button.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .dataTables_paginate .paginate_button.disabled:hover {
    background: white !important;
    color: #dc143c !important;
    transform: none;
    box-shadow: none !important;
  }

  /* Info - Enhanced */
  .dataTables_info {
    font-weight: 600;
    color: #666;
    transition: all 0.3s ease;
  }

  .dataTables_info.info-updated {
    color: #dc143c;
    transform: scale(1.05);
  }

  /* ═══════════════════════════════════════════════════════════════
     🎯 BUTTONS - EXPORT
     ═══════════════════════════════════════════════════════════════ */

  .dt-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .dt-btn-export {
    padding: 10px 20px !important;
    border-radius: 8px !important;
    border: none !important;
    font-weight: 600 !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  }

  .dt-btn-export::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  .dt-btn-export:hover::before {
    width: 300px;
    height: 300px;
  }

  .dt-btn-export:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25) !important;
  }

  .dt-btn-excel {
    background: linear-gradient(135deg, #217346 0%, #2ea85b 100%) !important;
    color: white !important;
  }

  .dt-btn-pdf {
    background: linear-gradient(135deg, #dc143c 0%, #ff6b6b 100%) !important;
    color: white !important;
  }

  .dt-btn-print {
    background: linear-gradient(135deg, #495057 0%, #6c757d 100%) !important;
    color: white !important;
  }

  /* Hide text on mobile */
  @media (max-width: 768px) {
    .page-text,
    .btn-text {
      display: none;
    }
    
    .dt-btn-export {
      padding: 10px 14px !important;
      min-width: 44px;
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     🎴 STAT CARDS
     ═══════════════════════════════════════════════════════════════ */

  .stat-card {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    will-change: transform;
    perspective: 1000px;
  }

  .stat-card.card-animated {
    cursor: pointer;
  }

  .stat-card.card-animated:hover {
    transform: translateY(-10px) scale(1.03) rotateX(-5deg);
    box-shadow: 0 15px 35px rgba(220, 20, 60, 0.25);
  }

  .stat-card.card-animated:active {
    transform: translateY(-5px) scale(1);
  }

  /* ═══════════════════════════════════════════════════════════════
     👆 TOUCH STATES
     ═══════════════════════════════════════════════════════════════ */

  .is-touch button,
  .is-touch .btn-action {
    -webkit-tap-highlight-color: rgba(220, 20, 60, 0.2);
  }

  .touch-pressed {
    transition: transform 0.15s ease !important;
  }

  /* ═══════════════════════════════════════════════════════════════
     ♿ ACCESSIBILITY
     ═══════════════════════════════════════════════════════════════ */

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
    animation: pulse 2s ease-in-out infinite;
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
     📱 RESPONSIVE ADJUSTMENTS
     ═══════════════════════════════════════════════════════════════ */

  @media (max-width: 768px) {
    .dt-detail-wrapper {
      padding: 14px;
      margin: 10px 4px;
    }

    .detail-item-card {
      padding: 12px 14px;
    }

    .detail-label {
      font-size: 10px;
    }

    .detail-value {
      font-size: 13px;
    }

    .stat-card.card-animated:hover {
      transform: translateY(-6px) scale(1.02);
    }

    .dataTables_paginate .paginate_button {
      padding: 8px 12px !important;
      margin: 0 2px !important;
      font-size: 13px !important;
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     🎨 PAGE LOADED STATE
     ═══════════════════════════════════════════════════════════════ */

  body {
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  body.page-loaded {
    opacity: 1;
  }

  /* ═══════════════════════════════════════════════════════════════
     ⚡ PERFORMANCE OPTIMIZATIONS
     ═══════════════════════════════════════════════════════════════ */

  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .hardware-accelerated {
    transform: translateZ(0);
    will-change: transform;
  }
`;

document.head.appendChild(ultraStyles);

console.log('═══════════════════════════════════════════');
console.log('✨ HIFI Admin Panel v3.0 - ULTRA Enhanced');
console.log('═══════════════════════════════════════════');
