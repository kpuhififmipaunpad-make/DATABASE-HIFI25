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
      dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>rt<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>B',
      buttons: [
        {
          extend: 'excel',
          text: '<i class="fas fa-file-excel"></i> Export Excel',
          className: 'btn-export',
          title: 'Data Warga HIFI',
          exportOptions: {
            columns: ':not(.no-export)'
          }
        },
        {
          extend: 'pdf',
          text: '<i class="fas fa-file-pdf"></i> Export PDF',
          className: 'btn-export',
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
          className: 'btn-export',
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
        // Add fade-in animation to table
        $('#usersTable').css('opacity', '0').animate({ opacity: 1 }, 600);
      }
    });
    
    // Search input enhancement
    $('.dataTables_filter input').attr('placeholder', 'Cari nama, NPM, email...');
    
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
    const target = parseInt(counter.textContent) || 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    
    updateCounter();
  });
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
    }, 600);
  }
}

// ============================================
// MOBILE MENU HANDLER
// ============================================
function handleMobileMenu() {
  const toggleBtn = document.querySelector('#sidebarToggle');
  const sidebar = document.querySelector('.sidebar-glass');
  
  if (window.innerWidth <= 1024) {
    toggleBtn?.addEventListener('click', () => {
      sidebar?.classList.toggle('active');
      
      // Close sidebar when clicking outside
      if (sidebar?.classList.contains('active')) {
        document.addEventListener('click', closeSidebarOnClickOutside);
      }
    });
  }
}

function closeSidebarOnClickOutside(e) {
  const sidebar = document.querySelector('.sidebar-glass');
  const toggleBtn = document.querySelector('#sidebarToggle');
  
  if (!sidebar?.contains(e.target) && !toggleBtn?.contains(e.target)) {
    sidebar?.classList.remove('active');
    document.removeEventListener('click', closeSidebarOnClickOutside);
  }
}

// ============================================
// SMOOTH SCROLL TO TOP
// ============================================
function initScrollToTop() {
  let scrollBtn = document.getElementById('scrollToTop');
  
  if (!scrollBtn) {
    scrollBtn = document.createElement('button');
    scrollBtn.id = 'scrollToTop';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'fab';
    scrollBtn.style.display = 'none';
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
}

// ============================================
// RESPONSIVE TABLE HANDLER
// ============================================
function handleResponsiveTable() {
  if (window.innerWidth < 768) {
    // Enable responsive mode
    $('#usersTable').addClass('nowrap');
  } else {
    $('#usersTable').removeClass('nowrap');
  }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initSidebarToggle();
  initDataTable();
  animateStatCards();
  animateCounters();
  handleMobileMenu();
  initScrollToTop();
  handleResponsiveTable();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    handleResponsiveTable();
  });
  
  // Add smooth transitions to all elements
  document.querySelectorAll('.glass-card, .stat-card, .btn-action').forEach(el => {
    el.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  });
});

// ============================================
// EXPORT FUNCTIONS
// ============================================
window.HIFIAdmin = {
  refreshData,
  animateCounters,
  handleMobileMenu
};
