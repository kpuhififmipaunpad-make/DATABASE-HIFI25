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
      mainContent?.classList.toggle('expanded');
      
      // Save state to localStorage
      localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    });
    
    // Restore state
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
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
        }
      },
      dom: '<"top-controls"lfB>rt<"bottom-controls"ip>',
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
          exportOptions: {
            columns: ':not(.no-export)'
          }
        },
        {
          extend: 'print',
          text: '<i class="fas fa-print"></i> Print',
          className: 'btn-export',
          title: 'Data Warga HIFI'
        }
      ],
      initComplete: function() {
        // Add custom styling after initialization
        $('.dataTables_wrapper').addClass('glass-card');
        $('.dataTables_filter input').addClass('form-control-glass');
        $('.dataTables_length select').addClass('form-control-glass');
      }
    });
    
    // Row click to expand details
    $('#usersTable tbody').on('click', 'tr', function() {
      const row = table.row(this);
      
      if (row.child.isShown()) {
        row.child.hide();
        $(this).removeClass('shown');
      } else {
        const data = row.data();
        row.child(formatUserDetails(data)).show();
        $(this).addClass('shown');
        
        // Animate child row
        $(row.child()).find('.detail-card').addClass('animate-fadeInUp');
      }
    });
  }
}


// ============================================
// CHART ANIMATIONS
// ============================================
function initCharts() {
  if (typeof Chart !== 'undefined') {
    const ctx = document.getElementById('userChart');
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
          datasets: [{
            label: 'Pendaftar Baru',
            data: [12, 19, 8, 15, 22, 18],
            borderColor: 'rgb(220, 20, 60)',
            backgroundColor: 'rgba(220, 20, 60, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          },
          animation: {
            duration: 2000,
            easing: 'easeInOutQuart'
          }
        }
      });
    }
  }
}

// ============================================
// SEARCH HIGHLIGHT
// ============================================
function initSearchHighlight() {
  const searchInput = document.querySelector('.dataTables_filter input');
  
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const rows = document.querySelectorAll('#usersTable tbody tr');
      
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
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
// REFRESH ANIMATION
// ============================================
function refreshData() {
  const refreshBtn = document.querySelector('#refreshBtn');
  if (refreshBtn) {
    refreshBtn.style.transform = 'rotate(360deg)';
    setTimeout(() => {
      refreshBtn.style.transform = 'rotate(0deg)';
    }, 600);
  }
  
  // Reload data with animation
  showToast('Data berhasil diperbarui!', 'success');
  setTimeout(() => location.reload(), 1000);
}

// ============================================
// USER ACTIONS
// ============================================
function editUser(id) {
  window.location.href = `/dashboard/edit/${id}`;
}

function deleteUser(id) {
  if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
    fetch(`/dashboard/delete/${id}`, {
      method: 'DELETE'
    })
    .then(() => {
      showToast('Data berhasil dihapus!', 'success');
      setTimeout(() => location.reload(), 1000);
    })
    .catch(err => {
      showToast('Gagal menghapus data!', 'error');
    });
  }
}

// ============================================
// NOTIFICATION DROPDOWN
// ============================================
function toggleNotifications() {
  const dropdown = document.querySelector('.notifications-dropdown');
  dropdown?.classList.toggle('show');
}

// ============================================
// PROFILE DROPDOWN
// ============================================
function toggleProfileDropdown() {
  const dropdown = document.querySelector('.profile-dropdown');
  dropdown?.classList.toggle('show');
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.notification-bell') && !e.target.closest('.notifications-dropdown')) {
    document.querySelector('.notifications-dropdown')?.classList.remove('show');
  }
  
  if (!e.target.closest('.profile-avatar') && !e.target.closest('.profile-dropdown')) {
    document.querySelector('.profile-dropdown')?.classList.remove('show');
  }
});

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initSidebarToggle();
  initDataTable();
  initSearchHighlight();
  initCharts();
  animateStatCards();
  
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
  editUser,
  deleteUser,
  toggleNotifications,
  toggleProfileDropdown
};
