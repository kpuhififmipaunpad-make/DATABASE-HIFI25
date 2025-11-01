/**
 * HIFI Database - Admin Panel Animations
 * Dashboard-specific animations & interactions
 */

// ============================================
// SIDEBAR TOGGLE
// ============================================
function initSidebarToggle() {
  const sidebar = document.querySelector('.sidebar-glass');
  const toggleBtn = document.querySelector('#sidebarToggle');
  const mainContent = document.querySelector('.content-wrapper');
  
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      sidebar.classList.toggle('active');
      mainContent?.classList.toggle('expanded');
      
      // Save state to localStorage
      localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    });
    
    // Restore state
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed && window.innerWidth > 1024) {
      sidebar.classList.add('collapsed');
      mainContent?.classList.add('expanded');
    }
  }
  
  // Close sidebar on mobile when clicking outside
  if (window.innerWidth <= 1024) {
    document.addEventListener('click', function(e) {
      if (!sidebar?.contains(e.target) && !toggleBtn?.contains(e.target)) {
        sidebar?.classList.remove('active');
      }
    });
  }
}

// ============================================
// DATATABLE ENHANCEMENT
// ============================================
function initDataTable() {
  if (typeof $ !== 'undefined' && $.fn.DataTable) {
    const table = $('#usersTable').DataTable({
      responsive: true,
      pageLength: 10,
      language: {
        search: "Cari:",
        lengthMenu: "Tampilkan _MENU_ data",
        info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
        infoEmpty: "Tidak ada data",
        infoFiltered: "(difilter dari _MAX_ total data)",
        paginate: {
          first: "Pertama",
          last: "Terakhir",
          next: "Selanjutnya",
          previous: "Sebelumnya"
        },
        emptyTable: "Tidak ada data yang tersedia",
        zeroRecords: "Tidak ditemukan data yang sesuai"
      },
      dom: '<"row mb-3"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>B<"row"<"col-sm-12"rt>><"row mt-3"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
      buttons: [
        {
          extend: 'excel',
          text: '<i class="fas fa-file-excel"></i> Export Excel',
          className: 'dt-button',
          title: 'Data Warga HIFI',
          exportOptions: {
            columns: ':not(.no-export)'
          }
        },
        {
          extend: 'pdf',
          text: '<i class="fas fa-file-pdf"></i> Export PDF',
          className: 'dt-button',
          title: 'Data Warga HIFI',
          orientation: 'landscape',
          pageSize: 'A4',
          exportOptions: {
            columns: ':not(.no-export)'
          }
        },
        {
          extend: 'print',
          text: '<i class="fas fa-print"></i> Print',
          className: 'dt-button',
          title: 'Data Warga HIFI',
          exportOptions: {
            columns: ':not(.no-export)'
          }
        }
      ],
      order: [[0, 'asc']],
      columnDefs: [
        { orderable: false, targets: -1 }
      ],
      initComplete: function() {
        // Add placeholder to search input
        $('.dataTables_filter input')
          .attr('placeholder', 'Cari nama, NPM, email...')
          .addClass('form-control-glass');
        
        $('.dataTables_length select')
          .addClass('form-control-glass');
        
        // Smooth fade-in animation
        $('#usersTable').css('opacity', '0').animate({ opacity: 1 }, 600);
      }
    });
    
    return table;
  }
}

// ============================================
// STAT CARD ANIMATIONS
// ============================================
function animateStatCards() {
  const statCards = document.querySelectorAll('.stat-card');
  
  statCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        card.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 50);
    }, index * 100);
  });
}

// ============================================
// NUMBER COUNTER ANIMATION
// ============================================
function animateCounters() {
  const counters = document.querySelectorAll('.stat-card-body h3');
  
  counters.forEach(counter => {
    const text = counter.textContent;
    const target = parseInt(text.replace(/\D/g, '')) || 0;
    
    if (target > 0) {
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;
      
      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = text; // Restore original text (with %)
        }
      };
      
      updateCounter();
    }
  });
}

// ============================================
// SEARCH HIGHLIGHT
// ============================================
function initSearchHighlight() {
  const searchInput = document.querySelector('.dataTables_filter input');
  
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const rows = document.querySelectorAll('#usersTable tbody tr:not(.child)');
      
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (searchTerm && text.includes(searchTerm)) {
          row.style.backgroundColor = 'rgba(220, 20, 60, 0.05)';
          setTimeout(() => {
            row.style.backgroundColor = '';
          }, 300);
        }
      });
    });
  }
}

// ============================================
// REFRESH ANIMATION
// ============================================
function refreshData() {
  const refreshBtn = document.querySelector('.btn-refresh');
  if (refreshBtn) {
    const icon = refreshBtn.querySelector('i');
    icon.style.transition = 'transform 0.6s ease';
    icon.style.transform = 'rotate(360deg)';
    
    setTimeout(() => {
      icon.style.transform = 'rotate(0deg)';
      location.reload();
    }, 600);
  }
}

// ============================================
// MOBILE MENU HANDLER
// ============================================
function handleMobileMenu() {
  const toggleBtn = document.querySelector('#sidebarToggle');
  const sidebar = document.querySelector('.sidebar-glass');
  
  if (window.innerWidth <= 1024 && toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }
}

// ============================================
// SMOOTH SCROLL TO TOP
// ============================================
function initScrollToTop() {
  // Check if button already exists
  let scrollBtn = document.getElementById('scrollToTop');
  
  if (!scrollBtn) {
    scrollBtn = document.createElement('button');
    scrollBtn.id = 'scrollToTop';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #DC143C 0%, #1E3A8A 100%);
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(220, 20, 60, 0.4);
      z-index: 998;
      display: none;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      transition: all 0.3s ease;
    `;
    document.body.appendChild(scrollBtn);
  }
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollBtn.style.display = 'flex';
    } else {
      scrollBtn.style.display = 'none';
    }
  });
  
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  scrollBtn.addEventListener('mouseenter', () => {
    scrollBtn.style.transform = 'scale(1.1) rotate(360deg)';
  });
  
  scrollBtn.addEventListener('mouseleave', () => {
    scrollBtn.style.transform = 'scale(1) rotate(0deg)';
  });
}

// ============================================
// AUTO DISMISS ALERTS
// ============================================
function initAutoDismissAlerts() {
  const alerts = document.querySelectorAll('.alert-glass');
  
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.transition = 'all 0.5s ease';
      alert.style.opacity = '0';
      alert.style.transform = 'translateY(-20px)';
      setTimeout(() => alert.remove(), 500);
    }, 5000);
  });
}

// ============================================
// RESPONSIVE TABLE HANDLER
// ============================================
function handleResponsiveTable() {
  if (window.innerWidth < 768) {
    $('#usersTable').addClass('nowrap');
  } else {
    $('#usersTable').removeClass('nowrap');
  }
}

// ============================================
// NOTIFICATION BELL ANIMATION
// ============================================
function initNotificationBell() {
  const bell = document.querySelector('.notification-bell');
  
  if (bell) {
    bell.addEventListener('mouseenter', function() {
      const icon = this.querySelector('i');
      icon.style.animation = 'swing 0.5s ease';
    });
    
    bell.addEventListener('animationend', function() {
      const icon = this.querySelector('i');
      icon.style.animation = '';
    });
  }
}

// Add keyframes for bell animation
const style = document.createElement('style');
style.textContent = `
  @keyframes swing {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(15deg); }
    75% { transform: rotate(-15deg); }
  }
`;
document.head.appendChild(style);

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all functions
  initSidebarToggle();
  initDataTable();
  animateStatCards();
  animateCounters();
  initSearchHighlight();
  handleMobileMenu();
  initScrollToTop();
  initAutoDismissAlerts();
  initNotificationBell();
  handleResponsiveTable();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    handleResponsiveTable();
  });
  
  // Add smooth transitions to all interactive elements
  document.querySelectorAll('.glass-card, .stat-card, .btn-action, .sidebar-menu-item').forEach(el => {
    el.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  });
});

// ============================================
// EXPORT FUNCTIONS
// ============================================
window.HIFIAdmin = {
  refreshData,
  animateCounters,
  handleMobileMenu,
  initSearchHighlight
};
