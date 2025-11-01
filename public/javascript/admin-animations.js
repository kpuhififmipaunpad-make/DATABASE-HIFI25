/**
 * HIFI Database - Admin Panel Animations v2.1
 * Dashboard-specific animations & interactions (FIXED)
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
// DATATABLE ENHANCEMENT (FIXED)
// ============================================
function initDataTable() {
  if (typeof $ === 'undefined' || !$.fn.DataTable) {
    console.warn('DataTables not loaded');
    return;
  }
  
  const tableElement = $('#usersTable');
  if (tableElement.length === 0) return;
  
  // Check if already initialized
  if ($.fn.DataTable.isDataTable('#usersTable')) {
    tableElement.DataTable().destroy();
  }
  
  const table = tableElement.DataTable({
    responsive: {
      details: {
        type: 'column',
        target: 'tr'
      }
    },
    pageLength: 10,
    order: [[1, 'asc']], // Sort by name
    language: {
      search: "Cari:",
      lengthMenu: "Tampilkan _MENU_ data per halaman",
      info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
      infoEmpty: "Tidak ada data",
      infoFiltered: "(difilter dari _MAX_ total data)",
      zeroRecords: "Data tidak ditemukan",
      emptyTable: "Tidak ada data yang tersedia",
      paginate: {
        first: "Pertama",
        last: "Terakhir",
        next: '<i class="fas fa-chevron-right"></i>',
        previous: '<i class="fas fa-chevron-left"></i>'
      }
    },
    dom: '<"top-controls d-flex justify-content-between align-items-center flex-wrap mb-3"<"d-flex align-items-center gap-2"lf>B>rt<"bottom-controls d-flex justify-content-between align-items-center flex-wrap mt-3"ip>',
    buttons: [
      {
        extend: 'excel',
        text: '<i class="fas fa-file-excel"></i> Excel',
        className: 'btn-export',
        title: 'Data Warga HIFI',
        exportOptions: {
          columns: ':not(.no-export)'
        }
      },
      {
        extend: 'pdf',
        text: '<i class="fas fa-file-pdf"></i> PDF',
        className: 'btn-export',
        title: 'Data Warga HIFI',
        exportOptions: {
          columns: ':not(.no-export)'
        },
        customize: function(doc) {
          doc.styles.tableHeader = {
            fillColor: [220, 20, 60],
            color: [255, 255, 255],
            bold: true
          };
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
    columnDefs: [
      { 
        targets: 0, 
        className: 'text-center',
        width: '5%'
      },
      { 
        targets: -1, 
        orderable: false,
        className: 'text-center no-export',
        width: '10%'
      }
    ],
    drawCallback: function() {
      // Re-apply animations after redraw
      $('.stat-card').each(function(index) {
        $(this).css('animation-delay', (index * 0.1) + 's');
      });
    },
    initComplete: function() {
      console.log('DataTable initialized successfully');
      
      // Add custom styling
      $('.dataTables_wrapper').addClass('glass-card');
      $('.dataTables_filter input').addClass('form-control-glass').attr('placeholder', 'Cari warga...');
      $('.dataTables_length select').addClass('form-control-glass');
      
      // Wrap search with icon
      const filterLabel = $('.dataTables_filter label');
      if (filterLabel.find('.search-icon').length === 0) {
        filterLabel.prepend('<i class="fas fa-search search-icon"></i>');
        filterLabel.addClass('search-glass');
      }
      
      // Style buttons container
      $('.dt-buttons').css({
        'display': 'flex',
        'gap': '8px',
        'flex-wrap': 'wrap'
      });
      
      // Update total count
      const info = table.page.info();
      $('#totalUsers').text(info.recordsTotal);
    }
  });
  
  return table;
}

// ============================================
// CHART ANIMATIONS
// ============================================
function initCharts() {
  if (typeof Chart === 'undefined') return;
  
  const ctx = document.getElementById('userChart');
  if (!ctx) return;
  
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
        fill: true,
        pointBackgroundColor: 'rgb(220, 20, 60)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          cornerRadius: 8,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: '#6B7280',
            font: {
              size: 12
            }
          }
        },
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            color: '#6B7280',
            font: {
              size: 12
            }
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

// ============================================
// SEARCH HIGHLIGHT
// ============================================
function initSearchHighlight() {
  const searchInput = document.querySelector('.dataTables_filter input');
  
  if (!searchInput) return;
  
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('#usersTable tbody tr');
    
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      if (text.includes(searchTerm) && searchTerm !== '') {
        row.style.backgroundColor = 'rgba(220, 20, 60, 0.05)';
        setTimeout(() => {
          row.style.backgroundColor = '';
        }, 300);
      }
    });
  });
}

// ============================================
// STAT CARD ANIMATIONS
// ============================================
function animateStatCards() {
  const statCards = document.querySelectorAll('.stat-card');
  
  statCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      card.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 + (index * 100));
  });
}

// ============================================
// REFRESH ANIMATION
// ============================================
function refreshData() {
  const refreshBtn = document.querySelector('#refreshBtn');
  if (refreshBtn) {
    refreshBtn.style.transform = 'rotate(360deg)';
    refreshBtn.style.transition = 'transform 0.6s ease';
    setTimeout(() => {
      refreshBtn.style.transform = 'rotate(0deg)';
    }, 600);
  }
  
  // Show loading toast
  if (typeof showToast !== 'undefined') {
    showToast('Memperbarui data...', 'info', 1000);
    setTimeout(() => {
      showToast('Data berhasil diperbarui!', 'success');
      setTimeout(() => location.reload(), 1000);
    }, 1500);
  } else {
    setTimeout(() => location.reload(), 1000);
  }
}

// ============================================
// USER ACTIONS
// ============================================
function editUser(id) {
  if (!id) {
    if (typeof showToast !== 'undefined') {
      showToast('ID pengguna tidak valid!', 'error');
    }
    return;
  }
  window.location.href = `/dashboard/edit/${id}`;
}

function deleteUser(id) {
  if (!id) {
    if (typeof showToast !== 'undefined') {
      showToast('ID pengguna tidak valid!', 'error');
    }
    return;
  }
  
  // Custom confirmation modal
  const confirmDelete = confirm('⚠️ PERINGATAN!\n\nApakah Anda yakin ingin menghapus data ini?\nData yang dihapus tidak dapat dikembalikan.');
  
  if (confirmDelete) {
    // Show loading
    if (typeof showToast !== 'undefined') {
      showToast('Menghapus data...', 'info', 1000);
    }
    
    fetch(`/dashboard/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) throw new Error('Gagal menghapus data');
      return response.json();
    })
    .then(() => {
      if (typeof showToast !== 'undefined') {
        showToast('Data berhasil dihapus!', 'success');
      }
      setTimeout(() => location.reload(), 1000);
    })
    .catch(err => {
      console.error(err);
      if (typeof showToast !== 'undefined') {
        showToast('Gagal menghapus data! ' + err.message, 'error');
      } else {
        alert('Gagal menghapus data!');
      }
    });
  }
}

// ============================================
// NOTIFICATION DROPDOWN
// ============================================
function toggleNotifications() {
  const dropdown = document.querySelector('.notifications-dropdown');
  if (dropdown) {
    dropdown.classList.toggle('show');
  }
}

// ============================================
// PROFILE DROPDOWN
// ============================================
function toggleProfileDropdown() {
  const dropdown = document.querySelector('.profile-dropdown');
  if (dropdown) {
    dropdown.classList.toggle('show');
  }
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================
function toggleMobileMenu() {
  const sidebar = document.querySelector('.sidebar-glass');
  if (sidebar) {
    sidebar.classList.toggle('active');
  }
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.notification-bell') && !e.target.closest('.notifications-dropdown')) {
    const notifDropdown = document.querySelector('.notifications-dropdown');
    if (notifDropdown) {
      notifDropdown.classList.remove('show');
    }
  }
  
  if (!e.target.closest('.profile-avatar') && !e.target.closest('.profile-dropdown')) {
    const profileDropdown = document.querySelector('.profile-dropdown');
    if (profileDropdown) {
      profileDropdown.classList.remove('show');
    }
  }
});

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('HIFI Admin v2.1 Initialized');
  
  initSidebarToggle();
  initDataTable();
  initSearchHighlight();
  initCharts();
  animateStatCards();
  
  // Add smooth transitions
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
  toggleProfileDropdown,
  toggleMobileMenu
};
