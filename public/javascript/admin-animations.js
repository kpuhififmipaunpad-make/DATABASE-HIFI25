/**
 * HIFI Database - Admin Panel Animations
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

  // Template child row — disamakan dengan edit.ejs / table.ejs
  const buildDetail = (ds) => `
    <div class="dt-detail">
      <div class="detail-card">
        <div class="detail-item">
          <b><i class="fas fa-user"></i> Nama Lengkap</b>
          <span>${esc(ds.nama)}</span>
        </div>
        <div class="detail-item">
          <b><i class="fas fa-id-card"></i> NPM</b>
          <span>${esc(ds.npm)}</span>
        </div>
        <div class="detail-item">
          <b><i class="fas fa-envelope"></i> Email</b>
          <span>${esc(ds.email)}</span>
        </div>
        <div class="detail-item">
          <b><i class="fas fa-phone"></i> No. HP</b>
          <span>${esc(ds.hp)}</span>
        </div>

        <div class="detail-item">
          <b><i class="fas fa-map-marker-alt"></i> Tempat Lahir</b>
          <span>${esc(ds.ttl)}</span>
        </div>
        <div class="detail-item">
          <b><i class="fas fa-calendar"></i> Tanggal Lahir</b>
          <span>${formatDate(ds.tgl)}</span>
        </div>
        <div class="detail-item">
          <b><i class="fas fa-pray"></i> Agama</b>
          <span>${esc(ds.agama)}</span>
        </div>
        <div class="detail-item">
          <b><i class="fas fa-tint"></i> Golongan Darah</b>
          <span>${esc(ds.goldar)}</span>
        </div>

        <div class="detail-item" style="grid-column:1/-1">
          <b><i class="fas fa-home"></i> Alamat Rumah</b>
          <span>${esc(ds.rumah)}</span>
        </div>
        <div class="detail-item" style="grid-column:1/-1">
          <b><i class="fas fa-building"></i> Alamat Kos</b>
          <span>${esc(ds.kos)}</span>
        </div>

        <div class="detail-item" style="grid-column:1/-1">
          <b><i class="fas fa-graduation-cap"></i> Pendidikan</b>
          <span>${esc(ds.pendidikan)}</span>
        </div>
        <div class="detail-item" style="grid-column:1/-1">
          <b><i class="fas fa-users"></i> Kepanitiaan</b>
          <span>${esc(ds.panitia)}</span>
        </div>
        <div class="detail-item" style="grid-column:1/-1">
          <b><i class="fas fa-sitemap"></i> Organisasi</b>
          <span>${esc(ds.organisasi)}</span>
        </div>
        <div class="detail-item" style="grid-column:1/-1">
          <b><i class="fas fa-certificate"></i> Pelatihan</b>
          <span>${esc(ds.pelatihan)}</span>
        </div>
        <div class="detail-item" style="grid-column:1/-1">
          <b><i class="fas fa-trophy"></i> Prestasi</b>
          <span>${esc(ds.prestasi)}</span>
        </div>

        <div class="detail-actions">
          <a class="btn-primary-gradient" href="/dashboard/edit/${esc(ds.id)}">
            <i class="fas fa-pen"></i> Edit Data Lengkap
          </a>
        </div>
      </div>
    </div>
  `;

  return { esc, formatDate, buildDetail };
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
      localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    });

    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
      sidebar.classList.add('collapsed');
      mainContent?.classList.add('expanded');
    }
  }
}

// ============================================
// DATATABLE INIT — aman dari konflik
// - Jika DT SUDAH ada (diinisialisasi script.ejs), JANGAN re-init
// - Jika DT BELUM ada, init di sini pakai konfigurasi dashboard
// ============================================
function initDataTable() {
  if (!window.jQuery || !$.fn.DataTable) return;

  const $table = $('#usersTable');
  if (!$table.length) return;

  // Jika sudah ada instance (mis. dari partials/script.ejs) -> hanya enhance & keluar
  const existing = getDT();
  if (existing) {
    $('.dataTables_wrapper').addClass('glass-card'); // kosmetik
    return;
  }

  // ---- Belum ada instance -> inisialisasi di sini (mirror script.ejs) ----
  const dt = $table.DataTable({
    responsive: false,
    lengthChange: false,
    searching: false,
    pagingType: 'simple_numbers',
    pageLength: 10,
    dom: "Bt<'dt-bottom'ip>",
    order: [[2, 'asc']],
    columnDefs: [
      { targets: [0], width: '48px' },
      { targets: [8], orderable: false, className: 'no-detail' }
    ],
    language: {
      paginate: { first: '«', previous: '‹', next: '›', last: '»' },
      info: 'Menampilkan _START_ - _END_ dari _TOTAL_ data',
      infoEmpty: 'Tidak ada data',
      infoFiltered: '(disaring dari _MAX_ total data)',
      zeroRecords: 'Data tidak ditemukan',
      emptyTable: 'Tidak ada data tersedia'
    },
    buttons: [
      {
        extend: 'excel',
        text: '<i class="fas fa-file-excel"></i> Excel',
        className: 'dt-btn-green',
        title: 'Data Warga HIFI',
        exportOptions: { columns: [0,1,2,3,4,5,6,7] }
      },
      {
        extend: 'pdf',
        text: '<i class="fas fa-file-pdf"></i> PDF',
        className: 'dt-btn-green',
        title: 'Data Warga HIFI',
        orientation: 'landscape',
        exportOptions: { columns: [0,1,2,3,4,5,6,7] }
      },
      {
        extend: 'print',
        text: '<i class="fas fa-print"></i> Print',
        className: 'dt-btn-green',
        title: 'Data Warga HIFI',
        exportOptions: { columns: [0,1,2,3,4,5,6,7] }
      }
    ]
  });

  // Pasang tombol export ke holder custom
  $('#exportButtons').empty();
  dt.buttons().container().appendTo('#exportButtons');

  // Custom SEARCH (kolom Nama / index 2)
  $('#searchNama').off('input.hifi').on('input.hifi', function () {
    dt.column(2).search(this.value).draw();
  });

  // Custom ITEMS PER PAGE
  $('#itemsPerPage').off('change.hifi').on('change.hifi', function () {
    const val = parseInt(this.value, 10);
    dt.page.len(val === -1 ? -1 : val).draw();
  });

  // Refresh
  $('#btnRefresh').off('click.hifi').on('click.hifi', function(){
    const $i = $(this).find('i');
    $i.addClass('fa-spin');
    setTimeout(() => location.reload(), 300);
  });

  // Toggle child-row via klik baris kecuali kolom aksi
  $('#usersTable tbody')
    .off('click.hifi', 'tr.clickable-row td:not(.no-detail)')
    .on('click.hifi', 'tr.clickable-row td:not(.no-detail)', function (e) {
      if ($(e.target).closest('.btn-action, button, a, form').length) return;
      const $tr = $(this).closest('tr.clickable-row');
      const row = dt.row($tr);
      const ds = $tr.get(0).dataset; // ambil data-* dari <tr>

      if (row.child.isShown()) {
        row.child.hide();
        $tr.removeClass('shown');
      } else {
        // Tutup child lain
        dt.rows().every(function () {
          if (this.child && this.child.isShown()) {
            this.child.hide();
            $(this.node()).removeClass('shown');
          }
        });
        row.child(HIFI.buildDetail(ds)).show();
        $tr.addClass('shown');
      }
    });

  $('.dataTables_wrapper').addClass('glass-card');
}

// ============================================
// CHART (opsional jika ada #userChart di halaman)
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
        borderWidth: 3, tension: 0.4, fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { grid: { display: false } }
      },
      animation: { duration: 2000, easing: 'easeInOutQuart' }
    }
  });
}

// ============================================
// SEARCH HIGHLIGHT (mengikuti #searchNama)
// ============================================
function initSearchHighlight() {
  const searchInput = document.querySelector('#searchNama');
  if (!searchInput) return;

  searchInput.addEventListener('input', function () {
    const term = this.value.toLowerCase();
    document.querySelectorAll('#usersTable tbody tr').forEach(tr => {
      const hit = tr.textContent.toLowerCase().includes(term);
      tr.style.backgroundColor = (hit && term) ? 'rgba(220,20,60,0.05)' : '';
    });
  });
}

// ============================================
// STAT CARD ANIMATIONS
// ============================================
function animateStatCards() {
  document.querySelectorAll('.stat-card').forEach((card, i) => {
    setTimeout(() => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      setTimeout(() => {
        card.style.transition = 'all 0.6s cubic-bezier(0.68,-0.55,0.265,1.55)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 50);
    }, i * 100);
  });
}

// ============================================
// REFRESH / USER ACTIONS
// ============================================
function refreshData() {
  const btn = document.querySelector('#btnRefresh');
  if (btn) btn.querySelector('i')?.classList.add('fa-spin');
  setTimeout(() => location.reload(), 300);
}

function editUser(id) {
  window.location.href = `/dashboard/edit/${id}`;
}

function deleteUser(id) {
  if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
    fetch(`/dashboard/delete/${id}`, { method: 'DELETE' })
      .then(() => setTimeout(() => location.reload(), 600))
      .catch(() => alert('Gagal menghapus data!'));
  }
}

// ============================================
// DROPDOWNS
// ============================================
function toggleNotifications() {
  document.querySelector('.notifications-dropdown')?.classList.toggle('show');
}
function toggleProfileDropdown() {
  document.querySelector('.profile-dropdown')?.classList.toggle('show');
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
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initSidebarToggle();
  initDataTable();       // aman: adopt existing or init once
  initSearchHighlight(); // hanya highlight ringan (tidak ganggu filter DT)
  initCharts();
  animateStatCards();

  // smooth transitions
  document.querySelectorAll('.glass-card, .stat-card, .btn-action').forEach(el => {
    el.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)';
  });
});

// ============================================
// EXPORT
// ============================================
window.HIFIAdmin = {
  refreshData,
  editUser,
  deleteUser,
  toggleNotifications,
  toggleProfileDropdown
};
