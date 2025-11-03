/**
 * HIFI Database - Admin Panel (Fixed, adaptive DataTables)
 * - No duplicate blocks
 * - Built-in controls appear when custom controls are absent
 * - Safe with/without Buttons extension
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

  // Template child row — RESPONSIVE
  const buildDetail = (ds) => {
    const isMobileView = isMobile();
    return `
      <div class="dt-detail">
        <div class="detail-card" style="grid-template-columns:${isMobileView ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))'};">
          <div class="detail-item"><b><i class="fas fa-user"></i> Nama Lengkap</b><span>${esc(ds.nama)}</span></div>
          <div class="detail-item"><b><i class="fas fa-id-card"></i> NPM</b><span>${esc(ds.npm)}</span></div>
          <div class="detail-item"><b><i class="fas fa-envelope"></i> Email</b><span>${esc(ds.email)}</span></div>
          <div class="detail-item"><b><i class="fas fa-phone"></i> No. HP</b><span>${esc(ds.hp)}</span></div>

          <div class="detail-item"><b><i class="fas fa-map-marker-alt"></i> Tempat Lahir</b><span>${esc(ds.ttl)}</span></div>
          <div class="detail-item"><b><i class="fas fa-calendar"></i> Tanggal Lahir</b><span>${formatDate(ds.tgl)}</span></div>
          <div class="detail-item"><b><i class="fas fa-pray"></i> Agama</b><span>${esc(ds.agama)}</span></div>
          <div class="detail-item"><b><i class="fas fa-tint"></i> Golongan Darah</b><span>${esc(ds.goldar)}</span></div>

          <div class="detail-item" style="grid-column:1/-1"><b><i class="fas fa-home"></i> Alamat Rumah</b><span>${esc(ds.rumah)}</span></div>
          <div class="detail-item" style="grid-column:1/-1"><b><i class="fas fa-building"></i> Alamat Kos</b><span>${esc(ds.kos)}</span></div>

          <div class="detail-item" style="grid-column:1/-1"><b><i class="fas fa-graduation-cap"></i> Pendidikan</b><span>${esc(ds.pendidikan)}</span></div>
          <div class="detail-item" style="grid-column:1/-1"><b><i class="fas fa-users"></i> Kepanitiaan</b><span>${esc(ds.panitia)}</span></div>
          <div class="detail-item" style="grid-column:1/-1"><b><i class="fas fa-sitemap"></i> Organisasi</b><span>${esc(ds.organisasi)}</span></div>
          <div class="detail-item" style="grid-column:1/-1"><b><i class="fas fa-certificate"></i> Pelatihan</b><span>${esc(ds.pelatihan)}</span></div>
          <div class="detail-item" style="grid-column:1/-1"><b><i class="fas fa-trophy"></i> Prestasi</b><span>${esc(ds.prestasi)}</span></div>

          <div class="detail-actions" style="grid-column:1/-1">
            <a class="btn-primary-gradient" href="/dashboard/edit/${esc(ds.id)}">
              <i class="fas fa-pen"></i> ${isMobileView ? 'Edit' : 'Edit Data Lengkap'}
            </a>
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
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';

  if (!sidebar) return;
  if (!document.querySelector('.sidebar-overlay')) document.body.appendChild(overlay);

  const toggleSidebar = (force) => {
    const isCollapsed = force !== undefined ? !force : sidebar.classList.contains('active');

    if (HIFI.isMobile()) {
      sidebar.classList.toggle('active', !isCollapsed);
      overlay.classList.toggle('active', !isCollapsed);
      document.body.style.overflow = isCollapsed ? '' : 'hidden';
    } else {
      sidebar.classList.toggle('collapsed', isCollapsed);
      mainContent?.classList.toggle('expanded', isCollapsed);
      mainContent?.classList.toggle('sidebar-collapsed', isCollapsed);
    }

    localStorage.setItem('sidebarCollapsed', isCollapsed);
  };

  toggleBtn?.addEventListener('click', () => toggleSidebar());
  const hamburger = document.querySelector('.navbar-toggle, #navbarToggle');
  hamburger?.addEventListener('click', (e) => { e.stopPropagation(); toggleSidebar(); });

  overlay.addEventListener('click', () => { if (HIFI.isMobile()) toggleSidebar(false); });

  document.addEventListener('click', (e) => {
    if (HIFI.isMobile() &&
        sidebar.classList.contains('active') &&
        !sidebar.contains(e.target) &&
        !e.target.closest('.navbar-toggle, #sidebarToggle, #navbarToggle')) {
      toggleSidebar(false);
    }
  });

  const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  if (!HIFI.isMobile() && isCollapsed) {
    sidebar.classList.add('collapsed');
    mainContent?.classList.add('expanded', 'sidebar-collapsed');
  }

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
// RESPONSIVE DATATABLE INIT (FIXED)
// ============================================
function initDataTable() {
  if (!window.jQuery || !$.fn.DataTable) return;

  const $table = $('#usersTable');
  if (!$table.length) return;

  const existing = getDT();
  if (existing) { enhanceDataTable(existing, { hasButtonsPlugin: !!($.fn.dataTable && $.fn.dataTable.Buttons) }); return; }

  const isMobile = HIFI.isMobile();
  const isTablet = HIFI.isTablet();
  let defaultPageLength = isMobile ? 5 : (isTablet ? 8 : 10);

  // Cek apakah plugin Buttons tersedia
  const hasButtons = !!($.fn.dataTable && $.fn.dataTable.Buttons);

  // Bangun DOM: tampilkan Buttons (jika ada), search (f), table (t), lalu bottom (l i p)
  const dom = (hasButtons ? 'B' : '') + "f t<'dt-bottom'lip>";

  const dt = $table.DataTable({
    // Aktifkan kontrol bawaan supaya search & items/page muncul
    searching: true,
    lengthChange: true,

    responsive: false,
    pagingType: isMobile ? 'simple' : 'simple_numbers',
    pageLength: defaultPageLength,
    dom,
    order: [[2, 'asc']],
    columnDefs: [
      { targets: [0], width: isMobile ? '40px' : '48px' },
      { targets: [8], orderable: false, className: 'no-detail' }
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
      emptyTable: 'Tidak ada data tersedia'
    },
    ...(hasButtons ? {
      buttons: [
        {
          extend: 'excel',
          text: isMobile ? '<i class="fas fa-file-excel"></i>' : '<i class="fas fa-file-excel"></i> Excel',
          className: 'dt-btn-green',
          title: 'Data Warga HIFI',
          exportOptions: { columns: [0,1,2,3,4,5,6,7] }
        },
        {
          extend: 'pdf',
          text: isMobile ? '<i class="fas fa-file-pdf"></i>' : '<i class="fas fa-file-pdf"></i> PDF',
          className: 'dt-btn-green',
          title: 'Data Warga HIFI',
          orientation: 'landscape',
          exportOptions: { columns: [0,1,2,3,4,5,6,7] }
        },
        {
          extend: 'print',
          text: isMobile ? '<i class="fas fa-print"></i>' : '<i class="fas fa-print"></i> Print',
          className: 'dt-btn-green',
          title: 'Data Warga HIFI',
          exportOptions: { columns: [0,1,2,3,4,5,6,7] }
        }
      ]
    } : {}),
    drawCallback: function() {
      if (HIFI.isTouch()) $table.addClass('touch-enabled');
    }
  });

  dt.columns.adjust();
  enhanceDataTable(dt, { hasButtonsPlugin: hasButtons });
}

// ============================================
// ENHANCE DATATABLE - RESPONSIVE CONTROLS
// ============================================
function enhanceDataTable(dt, ctx = {}) {
  const { hasButtonsPlugin } = ctx;

  // Pasang tombol export ke holder custom (jika ada dan Buttons tersedia)
  if (hasButtonsPlugin && typeof dt.buttons === 'function') {
    const $exportHolder = $('#exportButtons');
    if ($exportHolder.length) {
      $exportHolder.empty();
      dt.buttons().container().appendTo('#exportButtons');
    }
  }

  // Custom SEARCH (kolom Nama / index 2) - DEBOUNCED; hanya jika #searchNama ada
  if (document.getElementById('searchNama')) {
    let searchTimer;
    $('#searchNama').off('input.hifi').on('input.hifi', function () {
      clearTimeout(searchTimer);
      const value = this.value;
      searchTimer = setTimeout(() => {
        dt.column(2).search(value).draw();
      }, HIFI.isMobile() ? 500 : 300);
    });
  }

  // Custom ITEMS PER PAGE; hanya jika #itemsPerPage ada
  if (document.getElementById('itemsPerPage')) {
    $('#itemsPerPage').off('change.hifi').on('change.hifi', function () {
      const val = parseInt(this.value, 10);
      dt.page.len(val === -1 ? -1 : val).draw();
    });
  }

  // Refresh button
  $('#btnRefresh').off('click.hifi').on('click.hifi', function(){
    $(this).find('i').addClass('fa-spin');
    showLoadingState(true);
    setTimeout(() => location.reload(), 300);
  });

  // Toggle child-row - gunakan baris yang diberi class .clickable-row
  $('#usersTable tbody')
    .off('click.hifi touchend.hifi', 'tr.clickable-row td:not(.no-detail)')
    .on('click.hifi touchend.hifi', 'tr.clickable-row td:not(.no-detail)', function (e) {
      if ($(e.target).closest('.btn-action, button, a, form, input, select, label').length) return;
      if (e.type === 'touchend') e.preventDefault();

      const $tr = $(this).closest('tr.clickable-row');
      const row = dt.row($tr);
      const ds = $tr.get(0).dataset || {};
      if (!row || !row.length) return;

      if (row.child.isShown()) {
        $tr.removeClass('shown');
        setTimeout(() => row.child.hide(), 200);
      } else {
        dt.rows().every(function () {
          if (this.child && this.child.isShown()) {
            $(this.node()).removeClass('shown');
            setTimeout(() => this.child.hide(), 200);
          }
        });

        row.child(HIFI.buildDetail(ds)).show();
        setTimeout(() => $tr.addClass('shown'), 50);

        if (HIFI.isMobile()) {
          setTimeout(() => {
            const childRow = row.child()[0];
            childRow?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 300);
        }
      }
    });

  // Add styling
  $('.dataTables_wrapper').addClass('glass-card');

  // Handle window resize - adjust page length & paging type
  let resizeTimer;
  $(window).off('resize.datatable').on('resize.datatable', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const isMobile = HIFI.isMobile();
      const isTablet = HIFI.isTablet();

      let newLength = isMobile ? 5 : (isTablet ? 8 : 10);
      if (dt.page.len() !== newLength) dt.page.len(newLength).draw();

      const newPagingType = isMobile ? 'simple' : 'simple_numbers';
      if (dt.settings()[0].oInit.pagingType !== newPagingType) {
        dt.destroy();
        initDataTable();
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
          labels: { font: { size: isMobile ? 10 : 12 } }
        },
        tooltip: { enabled: true, mode: 'index', intersect: false, bodyFont: { size: isMobile ? 11 : 13 } }
      },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: isMobile ? 10 : 12 } } },
        x: { grid: { display: false }, ticks: { font: { size: isMobile ? 10 : 12 } } }
      },
      animation: { duration: isMobile ? 1000 : 2000, easing: 'easeInOutQuart' },
      interaction: { mode: 'nearest', axis: 'x', intersect: false }
    }
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { chartInstance.destroy(); initCharts(); }, 500);
  });
}

// ============================================
// RESPONSIVE SEARCH HIGHLIGHT
// ============================================
function initSearchHighlight() {
  const searchInput = document.querySelector('#searchNama');
  if (!searchInput) return;

  let searchTimer;
  searchInput.addEventListener('input', function () {
    clearTimeout(searchTimer);
    const term = this.value.toLowerCase();

    const delay = HIFI.isMobile() ? 400 : 200;
    searchTimer = setTimeout(() => {
      document.querySelectorAll('#usersTable tbody tr').forEach(tr => {
        const hit = tr.textContent.toLowerCase().includes(term);
        tr.style.backgroundColor = (hit && term) ? 'rgba(220,20,60,0.05)' : '';
        tr.style.transition = 'background-color 0.3s ease';
      });
    }, delay);
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
  const overlay = document.querySelector('.loading-overlay') || createLoadingOverlay();

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

function createLoadingOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.innerHTML = `
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p>${HIFI.isMobile() ? 'Loading...' : 'Memuat data...'}</p>
    </div>
  `;
  document.body.appendChild(overlay);
  return overlay;
}

// ============================================
// REFRESH DATA (WITH LOADING STATE)
// ============================================
function refreshData() {
  const btn = document.querySelector('#btnRefresh');
  btn?.querySelector('i')?.classList.add('fa-spin');
  showLoadingState(true);
  setTimeout(() => location.reload(), 300);
}

// ============================================
// USER ACTIONS (RESPONSIVE CONFIRMATIONS)
// ============================================
function editUser(id) {
  showLoadingState(true);
  window.location.href = `/dashboard/edit/${id}`;
}

function deleteUser(id) {
  const message = HIFI.isMobile() ? 'Hapus data ini?' : 'Apakah Anda yakin ingin menghapus data ini?';
  if (confirm(message)) {
    showLoadingState(true);
    fetch(`/dashboard/delete/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } })
      .then(r => { if (!r.ok) throw new Error('Delete failed'); return r.json(); })
      .then(() => setTimeout(() => location.reload(), 600))
      .catch(err => { console.error('Delete error:', err); showLoadingState(false); alert('Gagal menghapus data!'); });
  }
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
    if (HIFI.isMobile()) positionMobileDropdown(dropdown);
  }
}

function toggleProfileDropdown() {
  const dropdown = document.querySelector('.profile-dropdown');
  if (!dropdown) return;
  const isOpen = dropdown.classList.contains('show');
  closeAllDropdowns();
  if (!isOpen) {
    dropdown.classList.add('show');
    if (HIFI.isMobile()) positionMobileDropdown(dropdown);
  }
}

function closeAllDropdowns() {
  document.querySelectorAll('.notifications-dropdown, .profile-dropdown').forEach(d => d.classList.remove('show'));
}

function positionMobileDropdown(dropdown) {
  const rect = dropdown.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  if (rect.bottom > viewportHeight) {
    dropdown.style.top = 'auto';
    dropdown.style.bottom = '100%';
    dropdown.style.marginBottom = '8px';
  }
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.notification-bell') && !e.target.closest('.notifications-dropdown')) {
    document.querySelector('.notifications-dropdown')?.classList.remove('show');
  }
  if (!e.target.closest('.profile-avatar') && !e.target.closest('.profile-dropdown')) {
    document.querySelector('.profile-dropdown')?.classList.remove('show');
  }
});

// ============================================
// TOUCH ENHANCEMENTS
// ============================================
function initTouchEnhancements() {
  if (!HIFI.isTouch()) return;

  document.querySelectorAll('button, .btn-action, .btn-primary-gradient, a[role="button"]').forEach(el => {
    el.addEventListener('touchstart', function() { this.style.opacity = '0.7'; }, { passive: true });
    el.addEventListener('touchend', function() { setTimeout(() => { this.style.opacity = ''; }, 150); }, { passive: true });
  });

  // Prevent zoom on double-tap
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function(e) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = now;
  }, { passive: false });

  initSwipeToRefresh();
}

// ============================================
// SWIPE TO REFRESH (MOBILE)
// ============================================
function initSwipeToRefresh() {
  if (!HIFI.isMobile()) return;

  let startY = 0, currentY = 0, pulling = false;
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
      setTimeout(() => location.reload(), 500);
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
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      document.querySelector('#searchNama')?.focus();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      if (!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        refreshData();
      }
    }
    if (e.key === 'Escape') {
      closeAllDropdowns();
      const dt = getDT();
      if (dt) {
        dt.rows().every(function(){
          if (this.child && this.child.isShown()) {
            this.child.hide();
            $(this.node()).removeClass('shown');
          }
        });
      }
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
      if (dt) dt.columns.adjust().draw();
      showLoadingState(false);
    }, 300);
  });
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
function optimizePerformance() {
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
    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    document.body.classList.add('resize-animation-stopper');
    resizeTimer = setTimeout(() => document.body.classList.remove('resize-animation-stopper'), 400);
  }, { passive: true });
}

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================
function initAccessibility() {
  document.querySelectorAll('.btn-action').forEach(btn => {
    if (!btn.getAttribute('aria-label')) {
      const title = btn.getAttribute('title') || btn.textContent.trim();
      btn.setAttribute('aria-label', title);
    }
  });

  const announcer = document.createElement('div');
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  document.body.appendChild(announcer);

  document.querySelectorAll('.modal-glass').forEach(modal => {
    const focusable = modal.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  });
}

// ============================================
// ERROR HANDLING
// ============================================
function initErrorHandling() {
  window.addEventListener('error', (e) => {
    console.error('Runtime error:', e.error);
    if (HIFI.isMobile()) alert('Terjadi kesalahan. Silakan refresh halaman.');
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
    offlineToast?.remove();
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
// INIT ALL - RESPONSIVE
// ============================================
function initAll() {
  console.log('🚀 HIFI Admin (Fixed)');
  console.log('📱 Device:', HIFI.isMobile() ? 'Mobile' : HIFI.isTablet() ? 'Tablet' : 'Desktop');
  console.log('👆 Touch:', HIFI.isTouch() ? 'Enabled' : 'Disabled');

  // Core functionality
  initSidebarToggle();
  initDataTable();
  initSearchHighlight();
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
  if (HIFI.isTouch()) document.body.classList.add('is-touch');

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
  refreshData,
  editUser,
  deleteUser,
  toggleNotifications,
  toggleProfileDropdown,
  closeAllDropdowns,
  showLoadingState,
  showToast,
  isMobile: HIFI.isMobile,
  isTablet: HIFI.isTablet,
  isTouch: HIFI.isTouch,
  getDataTable: getDT
};

// ============================================
// ADDITIONAL CSS FOR RESPONSIVE FEATURES
// ============================================
const responsiveStyles = document.createElement('style');
responsiveStyles.textContent = `
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
  .loading-overlay.active { opacity: 1; }
  .loading-spinner { text-align: center; color: white; }
  .loading-spinner p { margin-top: 16px; font-size: 14px; }

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
  .swipe-refresh-indicator i { color: var(--primary-blue); }

  /* Toast Animation */
  @keyframes slideUp {
    from { transform: translateX(-50%) translateY(100px); opacity: 0; }
    to { transform: translateX(-50%) translateY(0); opacity: 1; }
  }
  @keyframes slideDown {
    from { transform: translateX(-50%) translateY(0); opacity: 1; }
    to { transform: translateX(-50%) translateY(100px); opacity: 0; }
  }

  /* Disable animations during resize */
  .resize-animation-stopper * { animation: none !important; transition: none !important; }

  /* Touch feedback */
  .is-touch button:active,
  .is-touch .btn-action:active,
  .is-touch .btn-primary-gradient:active { transform: scale(0.95); }

  /* Mobile optimizations */
  @media screen and (max-width: 768px) {
    .glass-card, .stat-card { transform-origin: center; }
    * { -webkit-overflow-scrolling: touch; }
    button, a, .btn-action { -webkit-tap-highlight-color: rgba(30, 58, 138, 0.1); }
  }

  /* Landscape mobile adjustments */
  @media screen and (max-height: 500px) and (orientation: landscape) {
    .loading-spinner p { display: none; }
    .swipe-refresh-indicator { width: 32px; height: 32px; }
  }
`;
document.head.appendChild(responsiveStyles);

console.log('📱 HIFI Admin Panel - Fixed & Responsive Mode Loaded');
