/**
 * HIFI Database - Admin Panel Animations v2.0
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
  if (typeof $ === 'undefined' || !$.fn.DataTable) return;
  
  const tableElement = $('#usersTable');
  if (tableElement.length === 0) return;
  
  const table = tableElement.DataTable({
    responsive: true,
    pageLength: 10,
    language: {
      search: "Cari:",
      lengthMenu: "Tampilkan _MENU_ data",
      info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
      infoEmpty: "Tidak ada data",
      infoFiltered: "(difilter dari _MAX_ total data)",
      zeroRecords: "Data tidak ditemukan",
      emptyTable: "Tidak ada data yang tersedia",
      paginate: {
        first: "Pertama",
        last: "Terakhir",
        next: "Selanjutnya",
        previous: "Sebelumnya"
      }
    },
    dom: '<"top-controls d-flex justify-content-between align-items-center mb-3"lfB>rt<"bottom-controls d-flex justify-content-between align-items-center mt-3"ip>',
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
      
      // Add icons
      $('.dataTables_filter label').prepend('<i class="fas fa-search search-icon"></i>');
      $('.dataTables_filter').addClass('search-glass');
    }
  });
  
  // Row click to expand details (FIXED)
  $('#usersTable tbody').on('click', 'tr', function(e) {
    // Prevent expansion if clicking on action buttons
    if ($(e.target).closest('.btn-action').length > 0) {
      return;
    }
    
    const row = table.row(this);
    
    if (row.child.isShown()) {
      row.child.hide();
      $(this).removeClass('shown');
    } else {
      const data = row.data();
      if (data) {
        row.child(formatUserDetails(data)).show();
        $(this).addClass('shown');
        
        // Animate child row
        $(row.child()).find('.detail-card').addClass('animate-fadeInUp');
      }
    }
  });
}

// ============================================
// FORMAT USER DETAILS
// ============================================
function formatUserDetails(data) {
  return `
    <div class="detail-card glass-card p-4" style="margin: 10px 0;">
      <div class="row">
        <div class="col-md-6">
          <h6 class="text-gradient mb-3">
            <i class="fas fa-user-circle"></i> Informasi Personal
          </h6>
          <p><strong>NPM:</strong> ${data[2] || '-'}</p>
          <p><strong>TTL:</strong> ${data[3] || '-'}</p>
          <p><strong>Tanggal Lahir:</strong> ${data[4] || '-'}</p>
          <p><strong>Agama:</strong> ${data[5] || '-'}</p>
          <p><strong>Golongan Darah:</strong> ${data[6] || '-'}</p>
          <p><strong>No. HP:</strong> ${data[7] || '-'}</p>
        </div>
        <div class="col-md-6">
          <h6 class="text-gradient mb-3">
            <i class="fas fa-address-book"></i> Kontak & Alamat
          </h6>
          <p><strong>Email:</strong> ${data[8] || '-'}</p>
          <p><strong>Alamat Rumah:</strong> ${data[9] || '-'}</p>
          <p><strong>Alamat Kos:</strong> ${data[10] || '-'}</p>
          <h6 class="text-gradient mt-3 mb-2">
            <i class="fas fa-history"></i> Riwayat
          </h6>
          <p><strong>Pendidikan:</strong> ${data[11] || '-'}</p>
          <p><strong>Organisasi:</strong> ${data[12] || '-'}</p>
        </div>
      </div>
      <div class="mt-3 d-flex gap-2">
        <button class="btn-action btn-edit" onclick="editUser('${data[0]}')" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-action btn-delete" onclick="deleteUser('${data[0]}')" title="Hapus">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `;
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
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
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
    refreshBtn.style.transition = 'transform 0.6s ease';
    setTimeout(() => {
      refreshBtn.style.transform = 'rotate(0deg)';
    }, 600);
  }
  
  // Show loading toast
  showToast('Memperbarui data...', 'info', 1000);
  
  // Reload data with animation
  setTimeout(() => {
    showToast('Data berhasil diperbarui!', 'success');
    setTimeout(() => location.reload(), 1000);
  }, 1500);
}

// ============================================
// USER ACTIONS
// ============================================
function editUser(id) {
  if (!id) {
    showToast('ID pengguna tidak valid!', 'error');
    return;
  }
  window.location.href = `/dashboard/edit/${id}`;
}

function deleteUser(id) {
  if (!id) {
    showToast('ID pengguna tidak valid!', 'error');
    return;
  }
  
  if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
    // Show loading
    showToast('Menghapus data...', 'info', 1000);
    
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
      showToast('Data berhasil dihapus!', 'success');
      setTimeout(() => location.reload(), 1000);
    })
    .catch(err => {
      console.error(err);
      showToast('Gagal menghapus data!', 'error');
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
// MOBILE MENU TOGGLE
// ============================================
function toggleMobileMenu() {
  const sidebar = document.querySelector('.sidebar-glass');
  if (sidebar) {
    sidebar.classList.toggle('active');
  }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('HIFI Admin Animations v2.0 Initialized');
  
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
  toggleProfileDropdown,
  toggleMobileMenu
};
