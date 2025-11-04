/**
 * ═══════════════════════════════════════════════════════════════
 * HIFI DATABASE - ADMIN PANEL ANIMATIONS v2.0
 * ═══════════════════════════════════════════════════════════════
 * ✨ ENHANCED: Smooth animations, better UX, responsive design
 * 📱 FULL RESPONSIVE - Mobile, Tablet, Desktop optimized
 * 🎨 SATISFYING: Polished transitions & micro-interactions
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
  
  // Template detail row - ENHANCED RESPONSIVE
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
      <div class="dt-detail animate-slide-down">
        <div class="detail-card" style="
          display: grid;
          grid-template-columns: ${isMobileView ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))'};
          gap: ${isMobileView ? '12px' : '16px'};
        ">
          <div class="detail-item fade-in" style="animation-delay: 0.05s">
            <b><i class="fas fa-user-circle"></i> Username</b>
            <span>${esc(username)}</span>
          </div>
          <div class="detail-item fade-in" style="animation-delay: 0.1s">
            <b><i class="fas fa-user"></i> Nama Lengkap</b>
            <span>${esc(nama)}</span>
          </div>
          <div class="detail-item fade-in" style="animation-delay: 0.15s">
            <b><i class="fas fa-id-card"></i> NPM</b>
            <span>${esc(npm)}</span>
          </div>
          <div class="detail-item fade-in" style="animation-delay: 0.2s">
            <b><i class="fas fa-envelope"></i> Email</b>
            <span>${esc(email)}</span>
          </div>
          <div class="detail-item fade-in" style="animation-delay: 0.25s">
            <b><i class="fas fa-phone"></i> No. HP</b>
            <span>${esc(no_hp)}</span>
          </div>
          <div class="detail-item fade-in" style="animation-delay: 0.3s">
            <b><i class="fas fa-shield-alt"></i> Role</b>
            <span class="role-badge ${role === 'Administrator' ? 'role-admin' : 'role-user'}">${esc(role)}</span>
          </div>
          <div class="detail-item fade-in" style="grid-column:1/-1; animation-delay: 0.35s">
            <b><i class="fas fa-clock"></i> Terakhir Update</b>
            <span>${esc(lastUpdate)}</span>
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
// 📱 RESPONSIVE SIDEBAR - SMOOTH TRANSITIONS
// ═══════════════════════════════════════════════════════════════
function initSidebarToggle() {
  const sidebar = document.querySelector('.sidebar-glass');
  const toggleBtn = document.querySelector('#sidebarToggle');
  const mainContent = document.querySelector('.content-wrapper, .main-content');
  let overlay = document.querySelector('.sidebar-overlay');
  
  if (!sidebar) return;
  
  // Create overlay if not exists
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }

  // ✨ Enhanced toggle with smooth animation
  const toggleSidebar = (force) => {
    const isCollapsed = force !== undefined ? !force : sidebar.classList.contains('active');
    
    if (HIFI.isMobile()) {
      // Mobile: slide animation with backdrop
      sidebar.classList.toggle('active', !isCollapsed);
      overlay.classList.toggle('active', !isCollapsed);
      document.body.style.overflow = isCollapsed ? '' : 'hidden';
      
      // Haptic feedback on mobile (if supported)
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    } else {
      // Desktop: smooth collapse/expand
      sidebar.classList.toggle('collapsed', isCollapsed);
      mainContent?.classList.toggle('expanded', isCollapsed);
      mainContent?.classList.toggle('sidebar-collapsed', isCollapsed);
      
      // Smooth icon rotation
      if (toggleBtn) {
        const icon = toggleBtn.querySelector('i');
        if (icon) {
          icon.style.transform = isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      }
    }
    
    localStorage.setItem('sidebarCollapsed', isCollapsed);
    
    // Trigger DataTable column adjustment after animation
    setTimeout(() => {
      const dt = getDT();
      if (dt) {
        dt.columns.adjust().responsive.recalc();
      }
    }, 350);
  };

  // Toggle button handler
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSidebar();
    });
  }

  // Hamburger menu for mobile
  const hamburger = document.querySelector('.navbar-toggle, #navbarToggle');
  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSidebar();
    });
  }

  // Overlay click to close
  overlay.addEventListener('click', () => {
    if (HIFI.isMobile() && sidebar.classList.contains('active')) {
      toggleSidebar(false);
    }
  });

  // Close sidebar on outside click (mobile)
  document.addEventListener('click', (e) => {
    if (HIFI.isMobile() && 
        sidebar.classList.contains('active') &&
        !sidebar.contains(e.target) && 
        !e.target.closest('.navbar-toggle, #sidebarToggle, #navbarToggle')) {
      toggleSidebar(false);
    }
  });

  // Restore saved state
  const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  if (!HIFI.isMobile() && isCollapsed) {
    sidebar.classList.add('collapsed');
    mainContent?.classList.add('expanded', 'sidebar-collapsed');
    const icon = toggleBtn?.querySelector('i');
    if (icon) icon.style.transform = 'rotate(180deg)';
  }

  // ✨ Smooth resize handler
  const handleResize = HIFI.debounce(() => {
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

  window.addEventListener('resize', handleResize);
}

// ═══════════════════════════════════════════════════════════════
// 📊 DATATABLE - ENHANCED RESPONSIVE
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

  // Responsive configuration
  const isMobile = HIFI.isMobile();
  const isTablet = HIFI.isTablet();
  
  // Dynamic page length
  let defaultPageLength = 10;
  if (isMobile) defaultPageLength = 5;
  else if (isTablet) defaultPageLength = 8;

  // ✨ Initialize with smooth animations
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
        previous: isMobile ? '<i class="fas fa-angle-left"></i>' : '<i class="fas fa-angle-left"></i> Prev', 
        next: isMobile ? '<i class="fas fa-angle-right"></i>' : 'Next <i class="fas fa-angle-right"></i>', 
        last: '<i class="fas fa-angle-double-right"></i>' 
      },
      info: isMobile ? '_START_-_END_ / _TOTAL_' : 'Menampilkan _START_ - _END_ dari _TOTAL_ data',
      infoEmpty: 'Tidak ada data',
      infoFiltered: isMobile ? '' : '(disaring dari _MAX_ total data)',
      zeroRecords: '<div class="empty-state"><i class="fas fa-inbox fa-3x"></i><p>Data tidak ditemukan</p></div>',
      emptyTable: '<div class="empty-state"><i class="fas fa-database fa-3x"></i><p>Tidak ada data tersedia</p></div>',
      lengthMenu: isMobile ? '_MENU_' : 'Tampilkan _MENU_ data',
      search: '',
      searchPlaceholder: isMobile ? 'Cari...' : 'Ketik untuk mencari...'
    },
    buttons: [
      {
        extend: 'excel',
        text: isMobile ? '<i class="fas fa-file-excel"></i>' : '<i class="fas fa-file-excel"></i> Excel',
        className: 'dt-btn-green btn-smooth',
        title: 'Data Warga HIFI',
        exportOptions: { columns: ':not(.no-export)' }
      },
      {
        extend: 'pdf',
        text: isMobile ? '<i class="fas fa-file-pdf"></i>' : '<i class="fas fa-file-pdf"></i> PDF',
        className: 'dt-btn-green btn-smooth',
        title: 'Data Warga HIFI',
        orientation: 'landscape',
        exportOptions: { columns: ':not(.no-export)' }
      },
      {
        extend: 'print',
        text: isMobile ? '<i class="fas fa-print"></i>' : '<i class="fas fa-print"></i> Print',
        className: 'dt-btn-green btn-smooth',
        title: 'Data Warga HIFI',
        exportOptions: { columns: ':not(.no-export)' }
      }
    ],
    initComplete: function() {
      // ✨ Fade in table after load
      $table.addClass('table-loaded');
    },
    drawCallback: function() {
      if (HIFI.isTouch()) {
        $table.addClass('touch-enabled');
      }
      
      // ✨ Animate rows on draw
      $table.find('tbody tr').each((i, row) => {
        $(row).css({
          'animation': `fadeInUp 0.4s ease ${i * 0.03}s both`
        });
      });
    }
  });

  enhanceDataTable(dt);
  
  console.log('✅ DataTable initialized with enhanced animations');
}

// ═══════════════════════════════════════════════════════════════
// ✨ DATATABLE ENHANCEMENTS - SMOOTH INTERACTIONS
// ═══════════════════════════════════════════════════════════════
function enhanceDataTable(dt) {
  if (!dt) return;

  // Style wrappers dengan animasi
  $('.dataTables_wrapper').addClass('glass-card').css('opacity', '0');
  setTimeout(() => {
    $('.dataTables_wrapper').css({
      'transition': 'opacity 0.5s ease',
      'opacity': '1'
    });
  }, 100);

  $('.dataTables_filter input').addClass('form-control-glass');
  $('.dataTables_length select').addClass('form-control-glass');

  // ✨ Enhanced search input dengan icon
  const searchWrapper = $('.dataTables_filter');
  if (!searchWrapper.find('.search-icon').length) {
    searchWrapper.prepend('<i class="fas fa-search search-icon"></i>');
  }

  // ✨ Toggle child-row dengan smooth animation
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

      if (row.child.isShown()) {
        // ✨ Close with slide-up animation
        $tr.removeClass('shown');
        $tr.find('.dt-detail').slideUp(300, function() {
          row.child.hide();
        });
      } else {
        // Close other rows first
        dt.rows().every(function () {
          if (this.child && this.child.isShown()) {
            $(this.node()).removeClass('shown');
            $(this.node()).find('.dt-detail').slideUp(200, () => {
              this.child.hide();
            });
          }
        });
        
        // ✨ Open with slide-down animation
        const rowData = row.data();
        row.child(HIFI.buildDetail(rowData)).show();
        
        // Initial hide untuk animasi
        const $detail = $tr.next('tr.child').find('.dt-detail');
        $detail.hide().slideDown(350, 'swing');
        
        setTimeout(() => $tr.addClass('shown'), 50);
        
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
          }, 400);
        }

        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate(5);
        }
      }
    });

  // ✨ Smooth resize handler
  const handleResize = HIFI.debounce(() => {
    const isMobile = HIFI.isMobile();
    const isTablet = HIFI.isTablet();
    
    let newLength = 10;
    if (isMobile) newLength = 5;
    else if (isTablet) newLength = 8;
    
    if (dt.page.len() !== newLength) {
      dt.page.len(newLength).draw();
    }
    
    dt.columns.adjust().responsive.recalc();
  }, 300);

  $(window).on('resize.datatable', handleResize);
}

// ═══════════════════════════════════════════════════════════════
// 📈 CHART - SMOOTH ANIMATIONS
// ═══════════════════════════════════════════════════════════════
function initCharts() {
  if (typeof Chart === 'undefined') return;
  const ctx = document.getElementById('userChart');
  if (!ctx) return;

  const isMobile = HIFI.isMobile();
  
  // ✨ Enhanced chart with smooth animations
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
        duration: 1500,
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
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          borderColor: 'rgba(220, 20, 60, 0.5)',
          borderWidth: 1,
          displayColors: false,
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

  console.log('✅ Chart initialized with smooth animations');
}

// ═══════════════════════════════════════════════════════════════
// 💫 STAT CARDS - SATISFYING ANIMATIONS
// ═══════════════════════════════════════════════════════════════
function animateStatCards() {
  const cards = document.querySelectorAll('.stat-card');
  if (!cards.length) return;

  const isMobile = HIFI.isMobile();
  const delay = isMobile ? 80 : 120;
  const duration = isMobile ? 500 : 700;

  cards.forEach((card, i) => {
    // Initial state
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px) scale(0.9)';
    
    setTimeout(() => {
      card.style.transition = `all ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
      card.style.opacity = '1';
      card.style.transform = 'translateY(0) scale(1)';
      
      // ✨ Add hover effect after animation
      setTimeout(() => {
        card.classList.add('card-animated');
      }, duration);
    }, i * delay);
  });

  // ✨ Animate counter values with easing
  setTimeout(() => {
    cards.forEach(card => {
      const valueEl = card.querySelector('[data-counter]');
      if (valueEl) {
        const target = parseInt(valueEl.dataset.counter) || 0;
        animateCounter(valueEl, 0, target, 2000);
      }
    });
  }, 400);

  console.log('✅ Stat cards animated');
}

// ✨ Enhanced counter animation dengan easing
function animateCounter(element, start, end, duration) {
  const range = end - start;
  const startTime = performance.now();
  
  // Easing function (ease-out-cubic)
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
// ⏳ LOADING STATE - SMOOTH OVERLAY
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
// 🗑️ USER ACTIONS - ENHANCED CONFIRMATIONS
// ═══════════════════════════════════════════════════════════════
function confirmDelete(id) {
  const message = HIFI.isMobile() 
    ? 'Hapus data ini?' 
    : 'Apakah Anda yakin ingin menghapus data ini?\nTindakan ini tidak dapat dibatalkan.';
  
  if (confirm(message)) {
    showLoadingState(true);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([10, 50, 10]);
    }
    
    // Submit form
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `/dashboard/delete/${id}?_method=DELETE`;
    document.body.appendChild(form);
    form.submit();
  }
}

// ═══════════════════════════════════════════════════════════════
// 👆 TOUCH ENHANCEMENTS - BETTER MOBILE UX
// ═══════════════════════════════════════════════════════════════
function initTouchEnhancements() {
  if (!HIFI.isTouch()) return;

  const touchElements = document.querySelectorAll(
    'button, .btn-action, .btn-primary-gradient, a[role="button"], .stat-card'
  );

  touchElements.forEach(el => {
    // ✨ Press effect
    el.addEventListener('touchstart', function(e) {
      this.classList.add('touch-pressed');
      this.style.transform = 'scale(0.95)';
    }, { passive: true });
    
    // ✨ Release effect
    el.addEventListener('touchend', function() {
      this.classList.remove('touch-pressed');
      this.style.transform = '';
    }, { passive: true });

    // ✨ Cancel effect
    el.addEventListener('touchcancel', function() {
      this.classList.remove('touch-pressed');
      this.style.transform = '';
    }, { passive: true });
  });

  // ✨ Prevent 300ms delay on mobile
  document.addEventListener('touchstart', function() {}, { passive: true });

  console.log('✅ Touch enhancements activated');
}

// ═══════════════════════════════════════════════════════════════
// ♿ ACCESSIBILITY - BETTER A11Y
// ═══════════════════════════════════════════════════════════════
function initAccessibility() {
  // Add ARIA labels
  document.querySelectorAll('.btn-action').forEach(btn => {
    if (!btn.getAttribute('aria-label')) {
      const title = btn.getAttribute('title') || btn.textContent.trim();
      btn.setAttribute('aria-label', title);
    }
  });

  // Focus visible untuk keyboard navigation
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

  // Skip to content link
  if (!document.querySelector('.skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  console.log('✅ Accessibility enhancements applied');
}

// ═══════════════════════════════════════════════════════════════
// 🎯 SCROLL ANIMATIONS - REVEAL ON SCROLL
// ═══════════════════════════════════════════════════════════════
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements
  document.querySelectorAll('.glass-card, .stat-card').forEach(el => {
    el.classList.add('fade-on-scroll');
    observer.observe(el);
  });
}

// ═══════════════════════════════════════════════════════════════
// 🎨 THEME TOGGLE (Optional Enhancement)
// ═══════════════════════════════════════════════════════════════
function initThemeToggle() {
  const themeToggle = document.querySelector('#themeToggle');
  if (!themeToggle) return;

  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // ✨ Smooth transition
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  });
}

// ═══════════════════════════════════════════════════════════════
// 🚀 INIT ALL - ORCHESTRATE EVERYTHING
// ═══════════════════════════════════════════════════════════════
function initAll() {
  console.log('═══════════════════════════════════════════');
  console.log('🚀 HIFI Admin Panel v2.0 - Initializing...');
  console.log('═══════════════════════════════════════════');
  
  const deviceType = HIFI.isMobile() ? 'Mobile 📱' : 
                     HIFI.isTablet() ? 'Tablet 💻' : 
                     'Desktop 🖥️';
  console.log(`📱 Device: ${deviceType}`);
  console.log(`👆 Touch: ${HIFI.isTouch() ? 'Yes' : 'No'}`);

  // Core functionality
  initSidebarToggle();
  
  // Delay DataTable untuk smooth initial load
  setTimeout(() => {
    initDataTable();
  }, 100);
  
  // Delay charts untuk sequential animation
  setTimeout(() => {
    initCharts();
  }, 300);
  
  // Stat cards dengan delay
  setTimeout(() => {
    animateStatCards();
  }, 500);
  
  // Enhancements
  initTouchEnhancements();
  initAccessibility();
  initScrollAnimations();
  initThemeToggle();

  // Add device classes
  document.body.classList.add(
    HIFI.isMobile() ? 'is-mobile' : 
    HIFI.isTablet() ? 'is-tablet' : 
    'is-desktop'
  );
  
  if (HIFI.isTouch()) {
    document.body.classList.add('is-touch');
  }

  // ✨ Page loaded animation
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
  version: '2.0'
};

// ═══════════════════════════════════════════════════════════════
// 🎨 ENHANCED STYLES - BEAUTIFUL ANIMATIONS
// ═══════════════════════════════════════════════════════════════
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
  /* ═══════════════════════════════════════════════════════════════
     🎬 KEYFRAME ANIMATIONS
     ═══════════════════════════════════════════════════════════════ */
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      max-height: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      max-height: 500px;
      transform: translateY(0);
    }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }

  /* ═══════════════════════════════════════════════════════════════
     ⏳ LOADING OVERLAY
     ═══════════════════════════════════════════════════════════════ */
  
  .loading-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
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
    width: 60px;
    height: 60px;
    margin: -30px 0 0 -30px;
    border: 3px solid transparent;
    border-top-color: #dc143c;
    border-radius: 50%;
    animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }

  .spinner-ring-2 {
    width: 50px;
    height: 50px;
    margin: -25px 0 0 -25px;
    border-top-color: #ff6b6b;
    animation-delay: -0.4s;
  }

  .spinner-ring-3 {
    width: 40px;
    height: 40px;
    margin: -20px 0 0 -20px;
    border-top-color: #ffa07a;
    animation-delay: -0.8s;
  }

  .loading-text {
    margin-top: 80px;
    font-size: 14px;
    font-weight: 500;
    animation: pulse 1.5s ease-in-out infinite;
  }

  /* ═══════════════════════════════════════════════════════════════
     📊 DATATABLE ENHANCEMENTS
     ═══════════════════════════════════════════════════════════════ */

  .dataTables_wrapper {
    transition: all 0.3s ease;
  }

  .table-loaded {
    animation: fadeInUp 0.6s ease;
  }

  #usersTable tbody tr {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
  }

  #usersTable tbody tr:hover {
    background-color: rgba(220, 20, 60, 0.05) !important;
    transform: translateX(4px);
    box-shadow: -4px 0 0 0 rgba(220, 20, 60, 0.5);
  }

  #usersTable tbody tr.shown {
    background-color: rgba(220, 20, 60, 0.1) !important;
  }

  .dt-detail {
    animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 16px;
    background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
    border-radius: 8px;
    margin: 8px 0;
  }

  .detail-card {
    display: grid;
    gap: 16px;
  }

  .detail-item {
    opacity: 0;
    animation: fadeInUp 0.4s ease forwards;
    padding: 12px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 8px;
    border-left: 3px solid #dc143c;
    transition: all 0.3s ease;
  }

  .detail-item:hover {
    background: rgba(255, 255, 255, 0.8);
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .detail-item b {
    display: block;
    color: #dc143c;
    font-size: 12px;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .detail-item span {
    display: block;
    color: #333;
    font-size: 14px;
    font-weight: 500;
  }

  .role-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .role-admin {
    background: linear-gradient(135deg, #dc143c 0%, #ff6b6b 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(220, 20, 60, 0.3);
  }

  .role-user {
    background: linear-gradient(135deg, #6c757d 0%, #95a5a6 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
  }

  /* ═══════════════════════════════════════════════════════════════
     🔍 SEARCH ENHANCEMENT
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
    pointer-events: none;
    z-index: 1;
  }

  .dataTables_filter input {
    padding-left: 40px !important;
    transition: all 0.3s ease;
  }

  .dataTables_filter input:focus {
    box-shadow: 0 0 0 3px rgba(220, 20, 60, 0.1);
    border-color: #dc143c;
  }

  /* ═══════════════════════════════════════════════════════════════
     🎴 STAT CARDS
     ═══════════════════════════════════════════════════════════════ */

  .stat-card {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    will-change: transform;
  }

  .stat-card.card-animated {
    cursor: pointer;
  }

  .stat-card.card-animated:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 24px rgba(220, 20, 60, 0.2);
  }

  .stat-card.card-animated:active {
    transform: translateY(-4px) scale(1);
  }

  /* ═══════════════════════════════════════════════════════════════
     🎯 BUTTONS
     ═══════════════════════════════════════════════════════════════ */

  .btn-smooth,
  .dt-btn-green {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .btn-smooth::before,
  .dt-btn-green::before {
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

  .btn-smooth:hover::before,
  .dt-btn-green:hover::before {
    width: 300px;
    height: 300px;
  }

  .btn-smooth:hover,
  .dt-btn-green:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  .btn-smooth:active,
  .dt-btn-green:active {
    transform: translateY(0);
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
     📱 SIDEBAR OVERLAY
     ═══════════════════════════════════════════════════════════════ */

  .sidebar-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 998;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sidebar-overlay.active {
    opacity: 1;
    visibility: visible;
  }

  .sidebar-glass {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sidebar-glass.active {
    transform: translateX(0);
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
  }

  .skip-link:focus {
    top: 0;
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  .keyboard-focus {
    outline: 2px solid #dc143c !important;
    outline-offset: 2px !important;
  }

  /* ═══════════════════════════════════════════════════════════════
     📜 SCROLL ANIMATIONS
     ═══════════════════════════════════════════════════════════════ */

  .fade-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .fade-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
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
     📱 RESPONSIVE ADJUSTMENTS
     ═══════════════════════════════════════════════════════════════ */

  @media (max-width: 768px) {
    .dt-detail {
      padding: 12px;
    }

    .detail-item {
      padding: 10px;
    }

    .detail-item b {
      font-size: 11px;
    }

    .detail-item span {
      font-size: 13px;
    }

    .stat-card.card-animated:hover {
      transform: translateY(-4px) scale(1.01);
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     🌙 DARK MODE SUPPORT (Optional)
     ═══════════════════════════════════════════════════════════════ */

  [data-theme="dark"] .detail-item {
    background: rgba(0, 0, 0, 0.3);
  }

  [data-theme="dark"] .detail-item:hover {
    background: rgba(0, 0, 0, 0.5);
  }

  [data-theme="dark"] .detail-item span {
    color: #e0e0e0;
  }

  /* ═══════════════════════════════════════════════════════════════
     🎯 EMPTY STATE
     ═══════════════════════════════════════════════════════════════ */

  .empty-state {
    padding: 40px 20px;
    text-align: center;
    color: #999;
  }

  .empty-state i {
    margin-bottom: 16px;
    opacity: 0.3;
  }

  .empty-state p {
    font-size: 14px;
    margin: 0;
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

document.head.appendChild(enhancedStyles);

console.log('═══════════════════════════════════════════');
console.log('✨ HIFI Admin Panel v2.0 - Enhanced Loaded');
console.log('═══════════════════════════════════════════');
