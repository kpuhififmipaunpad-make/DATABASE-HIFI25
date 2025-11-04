/**
 * HIFI Database - Admin Panel Animations
 * FULL RESPONSIVE - ALL DEVICES
 * Dashboard-specific animations & interactions
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
      return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch { return dateStr; }
  };

  // Deteksi device type
  const isMobile = () => window.innerWidth <= 768;
  const isTablet = () => window.innerWidth > 768 && window.innerWidth <= 1024;
  const isTouch = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Template child row – RESPONSIVE
  const buildDetail = (data) => {
    const isMobileView = isMobile();
    
    // Extract data dari array DataTables
    const username = data[1].replace(/<[^>]*>/g, '').trim();
    const nama = data[2];
    const npm = data[3];
    const email = data[4];
    const no_hp = data[5];
    const role = data[6].includes('Admin') ? 'Administrator' : 'User';
    const lastUpdate = data[7];
    
    return `
      <div class="dt-detail">
        <div class="detail-card" style="grid-template-columns: ${isMobileView ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))'};">
          <div class="detail-item">
            <b><i class="fas fa-user-circle"></i> Username</b>
            <span>${esc(username)}</span>
          </div>
          <div class="detail-item">
            <b><i class="fas fa-user"></i> Nama Lengkap</b>
            <span>${esc(nama)}</span>
          </div>
          <div class="detail-item">
            <b><i class="fas fa-id-card"></i> NPM</b>
            <span>${esc(npm)}</span>
          </div>
          <div class="detail-item">
            <b><i class="fas fa-envelope"></i> Email</b>
            <span>${esc(email)}</span>
          </div>
          <div class="detail-item">
            <b><i class="fas fa-phone"></i> No. HP</b>
            <span>${esc(no_hp)}</span>
          </div>
          <div class="detail-item">
            <b><i class="fas fa-shield-alt"></i> Role</b>
            <span>${esc(role)}</span>
          </div>
          <div class="detail-item" style="grid-column:1/-1">
            <b><i class="fas fa-clock"></i> Terakhir Update</b>
            <span>${esc(lastUpdate)}</span>
          </div>
        </div>
      </div>
    `;
  };

  return { esc, formatDate, buildDetail, isMobile, isTablet, isTouch };
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
  let overlay = document.querySelector('.sidebar-overlay');
  
  if (!sidebar) return;
  
  // Add overlay to body if not exists
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
// RESPONSIVE DATATABLE INIT
// ============================================
function initDataTable() {
  if (!window.jQuery || !$.fn.DataTable) {
    console.warn('DataTables not loaded');
    return;
  }

  const $table = $('#usersTable');
  if (!$table.length) {
    console.warn('Table #usersTable not found');
    return;
  }

  // Destroy existing instance
  if ($.fn.DataTable.isDataTable('#usersTable')) {
    $('#usersTable').DataTable().destroy();
  }

  // Responsive configuration based on screen size
  const isMobile = HIFI.isMobile();
  const isTablet = HIFI.isTablet();
  
  // Dynamic page length based on device
  let defaultPageLength = 10;
  if (isMobile) defaultPageLength = 5;
  else if (isTablet) defaultPageLength = 8;

  // Initialize DataTable
  const dt = $table.DataTable({
    responsive: false,
    autoWidth: false,
    searching: true,
    lengthChange: true,
    pagingType: 'simple_numbers',
    pageLength: defaultPageLength,
    lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Semua"]],
    dom: "Bfrtip",
    order: [[2, 'asc']],
    columnDefs: [
      { targets: [0], width: isMobile ? '40px' : '48px' },
      { targets: [8], orderable: false, className: 'no-detail no-export' }
    ],
    language: {
      paginate: { 
        first: '«', 
        previous: isMobile ? '‹' : 'Prev', 
        next: isMobile ? '›' : 'Next', 
        last: '»' 
      },
      info: isMobile ? '_START_-_END_ / _TOTAL_' : 'Menampilkan _START_ - _END_ dari _TOTAL_ data',
      infoEmpty: 'Tidak ada data',
      infoFiltered: isMobile ? '' : '(disaring dari _MAX_ total data)',
      zeroRecords: 'Data tidak ditemukan',
      emptyTable: 'Tidak ada data tersedia',
      lengthMenu: isMobile ? '_MENU_' : 'Tampilkan _MENU_ data',
      search: 'Cari:',
      searchPlaceholder: 'Ketik untuk mencari...'
    },
    buttons: [
      {
        extend: 'excel',
        text: isMobile ? '<i class="fas fa-file-excel"></i>' : '<i class="fas fa-file-excel"></i> Excel',
        className: 'dt-btn-green',
        title: 'Data Warga HIFI',
        exportOptions: { columns: ':not(.no-export)' }
      },
      {
        extend: 'pdf',
        text: isMobile ? '<i class="fas fa-file-pdf"></i>' : '<i class="fas fa-file-pdf"></i> PDF',
        className: 'dt-btn-green',
        title: 'Data Warga HIFI',
        orientation: 'landscape',
        exportOptions: { columns: ':not(.no-export)' }
      },
      {
        extend: 'print',
        text: isMobile ? '<i class="fas fa-print"></i>' : '<i class="fas fa-print"></i> Print',
        className: 'dt-btn-green',
        title: 'Data Warga HIFI',
        exportOptions: { columns: ':not(.no-export)' }
      }
    ],
    drawCallback: function() {
      if (HIFI.isTouch()) {
        $table.addClass('touch-enabled');
      }
    }
  });

  enhanceDataTable(dt);
  
  console.log('✅ DataTable initialized successfully');
}

// ============================================
// ENHANCE DATATABLE - RESPONSIVE CONTROLS
// ============================================
function enhanceDataTable(dt) {
  if (!dt) return;

  // Style DataTables wrapper
  $('.dataTables_wrapper').addClass('glass-card');
  $('.dataTables_filter input').addClass('form-control-glass');
  $('.dataTables_length select').addClass('form-control-glass');

  // Toggle child-row - RESPONSIVE TOUCH HANDLING
  $('#usersTable tbody')
    .off('click.hifi touchend.hifi')
    .on('click.hifi touchend.hifi', 'tr', function (e) {
      // Prevent double-firing on touch devices
      if (e.type === 'touchend') {
        e.preventDefault();
      }
      
      // Ignore clicks on interactive elements
      if ($(e.target).closest('.btn-action, button, a, form, input, select, .no-detail').length) {
        return;
      }

      const $tr = $(this);
      const row = dt.row($tr);

      if (row.child.isShown()) {
        // Close with animation
        $tr.removeClass('shown');
        setTimeout(() => row.child.hide(), 200);
      } else {
        // Close other rows first
        dt.rows().every(function () {
          if (this.child && this.child.isShown()) {
            $(this.node()).removeClass('shown');
            setTimeout(() => this.child.hide(), 200);
          }
        });
        
        // Open new row
        const rowData = row.data();
        row.child(HIFI.buildDetail(rowData)).show();
        setTimeout(() => $tr.addClass('shown'), 50);
        
        // Scroll into view on mobile
        if (HIFI.isMobile()) {
          setTimeout(() => {
            const childRow = row.child()[0];
            if (childRow) {
              childRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }, 300);
        }
      }
    });

  // Handle window resize
  let resizeTimer;
  $(window).on('resize.datatable', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const isMobile = HIFI.isMobile();
      const isTablet = HIFI.isTablet();
      
      let newLength = 10;
      if (isMobile) newLength = 5;
      else if (isTablet) newLength = 8;
      
      if (dt.page.len() !== newLength) {
        dt.page.len(newLength).draw();
      }
    }, 250);
  });
}

// ============================================
// RESPONSIVE CHART
// ============================================
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
          labels: { font: { size: isMobile ? 10 : 12 } }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { font: { size: isMobile ? 10 : 12 } }
        },
        x: {
          ticks: { font: { size: isMobile ? 10 : 12 } }
        }
      }
    }
  });
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

  // Animate counter values
  cards.forEach(card => {
    const valueEl = card.querySelector('[data-counter]');
    if (valueEl) {
      const target = parseInt(valueEl.dataset.counter) || 0;
      animateCounter(valueEl, 0, target, 1000);
    }
  });
}

function animateCounter(element, start, end, duration) {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 16);
}

// ============================================
// LOADING STATE
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
// USER ACTIONS
// ============================================
function confirmDelete(id) {
  const message = HIFI.isMobile() 
    ? 'Hapus data ini?' 
    : 'Apakah Anda yakin ingin menghapus data ini?';
  
  if (confirm(message)) {
    showLoadingState(true);
    
    // Submit form untuk delete
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `/dashboard/delete/${id}?_method=DELETE`;
    document.body.appendChild(form);
    form.submit();
  }
}

// ============================================
// TOUCH ENHANCEMENTS
// ============================================
function initTouchEnhancements() {
  if (!HIFI.isTouch()) return;

  // Add touch feedback
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
}

// ============================================
// ACCESSIBILITY
// ============================================
function initAccessibility() {
  document.querySelectorAll('.btn-action').forEach(btn => {
    if (!btn.getAttribute('aria-label')) {
      const title = btn.getAttribute('title') || btn.textContent.trim();
      btn.setAttribute('aria-label', title);
    }
  });
}

// ============================================
// INIT ALL
// ============================================
function initAll() {
  console.log('🚀 Initializing HIFI Admin Panel');
  console.log('📱 Device:', HIFI.isMobile() ? 'Mobile' : HIFI.isTablet() ? 'Tablet' : 'Desktop');

  // Core functionality
  initSidebarToggle();
  initDataTable();
  initCharts();
  animateStatCards();
  
  // Enhancements
  initTouchEnhancements();
  initAccessibility();

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
  showLoadingState,
  confirmDelete,
  isMobile: HIFI.isMobile,
  isTablet: HIFI.isTablet,
  isTouch: HIFI.isTouch,
  getDataTable: getDT
};

// ============================================
// ADDITIONAL STYLES
// ============================================
const responsiveStyles = document.createElement('style');
responsiveStyles.textContent = `
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
  
  .loading-spinner p {
    margin-top: 16px;
    font-size: 14px;
  }

  .is-touch button:active,
  .is-touch .btn-action:active {
    transform: scale(0.95);
  }
`;

document.head.appendChild(responsiveStyles);

console.log('📱 HIFI Admin Panel - Responsive Mode Loaded');
