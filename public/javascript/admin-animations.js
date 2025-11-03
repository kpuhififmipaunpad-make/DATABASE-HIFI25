<script>
/**
 * HIFI Database - Admin Panel (Fixed, adaptive DataTables)
 * - No duplicate blocks
 * - Built-in controls appear when custom controls are absent
 * - Safe with/without Buttons extension
 */
'use strict';

// ====================== UTILITIES ======================
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

  const isMobile = () => window.innerWidth <= 768;
  const isTablet = () => window.innerWidth > 768 && window.innerWidth <= 1024;
  const isTouch = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

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

// DataTable instance getter
function getDT() {
  try {
    if (window.jQuery && $.fn && $.fn.DataTable && $.fn.DataTable.isDataTable('#usersTable')) {
      return $('#usersTable').DataTable();
    }
  } catch (_) {}
  return null;
}

// ====================== SIDEBAR ======================
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
    if (HIFI.isMobile() && sidebar.classList.contains('active') &&
        !sidebar.contains(e.target) && !e.target.closest('.navbar-toggle, #sidebarToggle, #navbarToggle')) {
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
          overlay.classList.remove('active'); document.body.style.overflow = '';
        }
      } else {
        sidebar.classList.remove('active'); overlay.classList.remove('active'); document.body.style.overflow = '';
        if (isCollapsed) {
          sidebar.classList.add('collapsed'); mainContent?.classList.add('expanded', 'sidebar-collapsed');
        }
      }
    }, 250);
  });
}

// ====================== DATATABLE ======================
function initDataTable() {
  if (!window.jQuery || !$.fn.DataTable) return;
  const $table = $('#usersTable');
  if (!$table.length) return;

  // kalau sudah ada, cukup enhance
  const existing = getDT();
  if (existing) { enhanceDataTable(existing); return; }

  const isMobile = HIFI.isMobile();
  const isTablet = HIFI.isTablet();
  let defaultPageLength = isMobile ? 5 : (isTablet ? 8 : 10);

  // DETEKSI kontrol kustom & Buttons
  const hasCustomSearch   = !!document.getElementById('searchNama');
  const hasCustomLength   = !!document.getElementById('itemsPerPage');
  const hasButtonsPlugin  = !!($.fn.dataTable && $.fn.dataTable.Buttons);

  // Jika kontrol kustom TIDAK ada → aktifkan built-in
  const useBuiltInSearch  = !hasCustomSearch;
  const useBuiltInLength  = !hasCustomLength;

  // Bangun DOM string adaptif
  const top = `${hasButtonsPlugin ? 'B' : ''}${useBuiltInSearch ? 'f' : ''}`;
  const bottom = `<\'dt-bottom\'${useBuiltInLength ? 'l' : ''}ip>`;
  const dom = `${top}t${bottom}`.replace(/\s+/g, '');

  const options = {
    responsive: false,
    lengthChange: useBuiltInLength,     // tampilkan "items/page" bila tidak ada dropdown kustom
    searching: useBuiltInSearch,        // tampilkan kotak search bawaan bila tidak ada input kustom
    pagingType: isMobile ? 'simple' : 'simple_numbers',
    pageLength: defaultPageLength,
    dom,
    order: [[2, 'asc']],
    columnDefs: [
      { targets: [0], width: isMobile ? '40px' : '48px' },
      { targets: [8], orderable: false, className: 'no-detail' }
    ],
    language: {
      paginate: { first:'«', previous: isMobile ? '‹' : 'Prev', next: isMobile ? '›' : 'Next', last:'»' },
      info: isMobile ? '_START_-_END_ / _TOTAL_' : 'Menampilkan _START_ - _END_ dari _TOTAL_ data',
      infoEmpty: 'Tidak ada data',
      infoFiltered: isMobile ? '' : '(disaring dari _MAX_ total data)',
      zeroRecords: 'Data tidak ditemukan',
      emptyTable: 'Tidak ada data tersedia'
    },
    drawCallback: function() {
      if (HIFI.isTouch()) $table.addClass('touch-enabled');
    }
  };

  // Tambah tombol export hanya bila Buttons ada
  if (hasButtonsPlugin) {
    options.buttons = [
      { extend:'excel', text: isMobile ? '<i class="fas fa-file-excel"></i>' : '<i class="fas fa-file-excel"></i> Excel',
        className:'dt-btn-green', title:'Data Warga HIFI', exportOptions:{ columns:[0,1,2,3,4,5,6,7] } },
      { extend:'pdf', text: isMobile ? '<i class="fas fa-file-pdf"></i>' : '<i class="fas fa-file-pdf"></i> PDF',
        className:'dt-btn-green', title:'Data Warga HIFI', orientation:'landscape', exportOptions:{ columns:[0,1,2,3,4,5,6,7] } },
      { extend:'print', text: isMobile ? '<i class="fas fa-print"></i>' : '<i class="fas fa-print"></i> Print',
        className:'dt-btn-green', title:'Data Warga HIFI', exportOptions:{ columns:[0,1,2,3,4,5,6,7] } }
    ];
  }

  const dt = $table.DataTable(options);
  dt.columns.adjust(); // pastikan lebar kolom beres
  enhanceDataTable(dt, { hasButtonsPlugin, hasCustomSearch, hasCustomLength });
}

function enhanceDataTable(dt, ctx = {}) {
  const { hasButtonsPlugin, hasCustomSearch, hasCustomLength } = ctx;

  // Pasang tombol export ke holder custom jika ada & Buttons tersedia
  if (hasButtonsPlugin) {
    const $exportHolder = $('#exportButtons');
    if ($exportHolder.length) {
      $exportHolder.empty();
      dt.buttons().container().appendTo('#exportButtons');
    }
  }

  // SEARCH kustom (kolom Nama/index 2) bila input tersedia
  if (hasCustomSearch) {
    let searchTimer;
    $('#searchNama').off('input.hifi').on('input.hifi', function () {
      clearTimeout(searchTimer);
      const value = this.value;
      searchTimer = setTimeout(() => dt.column(2).search(value).draw(), HIFI.isMobile() ? 500 : 300);
    });
  }

  // ITEMS PER PAGE kustom bila dropdown tersedia
  if (hasCustomLength) {
    $('#itemsPerPage').off('change.hifi').on('change.hifi', function () {
      const val = parseInt(this.value, 10);
      dt.page.len(val === -1 ? -1 : val).draw();
    });
  }

  // Refresh
  $('#btnRefresh').off('click.hifi').on('click.hifi', function(){
    $(this).find('i').addClass('fa-spin');
    showLoadingState(true);
    setTimeout(() => location.reload(), 300);
  });

  // Toggle child-row — izinkan semua baris tbody (kecuali elemen interaktif)
  $('#usersTable tbody')
    .off('click.hifi touchend.hifi', 'tr td:not(.no-detail)')
    .on('click.hifi touchend.hifi', 'tr td:not(.no-detail)', function (e) {
      if ($(e.target).closest('.btn-action, button, a, form, input, select, label').length) return;
      if (e.type === 'touchend') e.preventDefault();

      const $tr = $(this).closest('tr');
      const row = dt.row($tr);
      const ds = $tr.get(0).dataset || {};
      if (!row.length) return;

      if (row.child.isShown()) {
        $tr.removeClass('shown'); setTimeout(() => row.child.hide(), 200);
      } else {
        dt.rows().every(function () {
          if (this.child && this.child.isShown()) {
            $(this.node()).removeClass('shown'); setTimeout(() => this.child.hide(), 200);
          }
        });
        row.child(HIFI.buildDetail(ds)).show();
        setTimeout(() => $tr.addClass('shown'), 50);
        if (HIFI.isMobile()) {
          setTimeout(() => { const child = row.child()[0]; child?.scrollIntoView({ behavior:'smooth', block:'nearest' }); }, 300);
        }
      }
    });

  $('.dataTables_wrapper').addClass('glass-card');

  // Responsif: ubah page length & paging type saat resize
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
        dt.destroy(); initDataTable();
      }
    }, 250);
  });
}

// ====================== CHART (unchanged) ======================
function initCharts() {
  if (typeof Chart === 'undefined') return;
  const ctx = document.getElementById('userChart'); if (!ctx) return;

  const isMobile = HIFI.isMobile();
  const chartInstance = new Chart(ctx, {
    type: 'line',
    data: { labels: isMobile ? ['J','F','M','A','M','J'] : ['Jan','Feb','Mar','Apr','Mei','Jun'],
      datasets: [{ label:'Pendaftar Baru', data:[12,19,8,15,22,18],
        borderColor:'rgb(220, 20, 60)', backgroundColor:'rgba(220, 20, 60, 0.1)', borderWidth:isMobile?2:3, tension:0.4, fill:true, pointRadius:isMobile?3:4, pointHoverRadius:isMobile?5:6 }]}
    ,options:{ responsive:true, maintainAspectRatio:true, aspectRatio:isMobile?1.5:2,
      plugins:{ legend:{ display:!isMobile, labels:{ font:{ size:isMobile?10:12 } } },
        tooltip:{ enabled:true, mode:'index', intersect:false, bodyFont:{ size:isMobile?11:13 } } },
      scales:{ y:{ beginAtZero:true, grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ font:{ size:isMobile?10:12 } } },
               x:{ grid:{ display:false }, ticks:{ font:{ size:isMobile?10:12 } } } },
      animation:{ duration:isMobile?1000:2000, easing:'easeInOutQuart' },
      interaction:{ mode:'nearest', axis:'x', intersect:false } }
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { chartInstance.destroy(); initCharts(); }, 500);
  });
}

// ====================== SEARCH HIGHLIGHT ======================
function initSearchHighlight() {
  const input = document.querySelector('#searchNama'); if (!input) return;
  let t; input.addEventListener('input', function() {
    clearTimeout(t); const term = this.value.toLowerCase(); const delay = HIFI.isMobile()?400:200;
    t = setTimeout(() => {
      document.querySelectorAll('#usersTable tbody tr').forEach(tr => {
        const hit = tr.textContent.toLowerCase().includes(term);
        tr.style.backgroundColor = (hit && term) ? 'rgba(220,20,60,0.05)' : '';
        tr.style.transition = 'background-color 0.3s ease';
      });
    }, delay);
  });
}

// ====================== MISC (unchanged behavior) ======================
function animateStatCards(){const cards=document.querySelectorAll('.stat-card');if(!cards.length)return;const m=HIFI.isMobile();const d=m?50:100;const dur=m?400:600;cards.forEach((c,i)=>{setTimeout(()=>{c.style.opacity='0';c.style.transform='translateY(30px)';setTimeout(()=>{c.style.transition=`all ${dur}ms cubic-bezier(0.68,-0.55,0.265,1.55)`;c.style.opacity='1';c.style.transform='translateY(0)';},50);},i*d);});}
function showLoadingState(show=true){const overlay=document.querySelector('.loading-overlay')||createLoadingOverlay();if(show){overlay.style.display='flex';document.body.style.overflow='hidden';setTimeout(()=>overlay.classList.add('active'),10);}else{overlay.classList.remove('active');setTimeout(()=>{overlay.style.display='none';document.body.style.overflow='';},300);}}
function createLoadingOverlay(){const overlay=document.createElement('div');overlay.className='loading-overlay';overlay.innerHTML=`<div class="loading-spinner"><div class="spinner"></div><p>${HIFI.isMobile()?'Loading...':'Memuat data...'}</p></div>`;document.body.appendChild(overlay);return overlay;}
function refreshData(){const btn=document.querySelector('#btnRefresh');btn?.querySelector('i')?.classList.add('fa-spin');showLoadingState(true);setTimeout(()=>location.reload(),300);}
function editUser(id){showLoadingState(true);window.location.href=`/dashboard/edit/${id}`;}
function deleteUser(id){const msg=HIFI.isMobile()?'Hapus data ini?':'Apakah Anda yakin ingin menghapus data ini?';if(confirm(msg)){showLoadingState(true);fetch(`/dashboard/delete/${id}`,{method:'DELETE',headers:{'Content-Type':'application/json'}}).then(r=>{if(!r.ok)throw new Error('Delete failed');return r.json();}).then(()=>{setTimeout(()=>location.reload(),600);}).catch(e=>{console.error('Delete error:',e);showLoadingState(false);alert('Gagal menghapus data!');});}}
function toggleNotifications(){const d=document.querySelector('.notifications-dropdown');if(!d)return;const open=d.classList.contains('show');closeAllDropdowns();if(!open){d.classList.add('show');if(HIFI.isMobile())positionMobileDropdown(d);}}
function toggleProfileDropdown(){const d=document.querySelector('.profile-dropdown');if(!d)return;const open=d.classList.contains('show');closeAllDropdowns();if(!open){d.classList.add('show');if(HIFI.isMobile())positionMobileDropdown(d);}}
function closeAllDropdowns(){document.querySelectorAll('.notifications-dropdown, .profile-dropdown').forEach(d=>d.classList.remove('show'));}
function positionMobileDropdown(d){const rect=d.getBoundingClientRect();const vh=window.innerHeight;if(rect.bottom>vh){d.style.top='auto';d.style.bottom='100%';d.style.marginBottom='8px';}}
document.addEventListener('click',(e)=>{if(!e.target.closest('.notification-bell')&&!e.target.closest('.notifications-dropdown')){document.querySelector('.notifications-dropdown')?.classList.remove('show');}if(!e.target.closest('.profile-avatar')&&!e.target.closest('.profile-dropdown')){document.querySelector('.profile-dropdown')?.classList.remove('show');}});
function initTouchEnhancements(){if(!HIFI.isTouch())return;document.querySelectorAll('button, .btn-action, .btn-primary-gradient, a[role="button"]').forEach(el=>{el.addEventListener('touchstart',function(){this.style.opacity='0.7';},{passive:true});el.addEventListener('touchend',function(){setTimeout(()=>{this.style.opacity='';},150);},{passive:true});});let last=0;document.addEventListener('touchend',function(e){const now=Date.now();if(now-last<=300){e.preventDefault();}last=now;},{passive:false});initSwipeToRefresh();}
function initSwipeToRefresh(){if(!HIFI.isMobile())return;let startY=0,currentY=0,pulling=false;const threshold=80;const ind=document.createElement('div');ind.className='swipe-refresh-indicator';ind.innerHTML='<i class="fas fa-arrow-down"></i>';document.body.insertBefore(ind,document.body.firstChild);document.addEventListener('touchstart',(e)=>{if(window.scrollY===0){startY=e.touches[0].pageY;pulling=true;}},{passive:true});document.addEventListener('touchmove',(e)=>{if(!pulling)return;currentY=e.touches[0].pageY;const dist=currentY-startY;if(dist>0&&dist<threshold*1.5){ind.style.transform=`translateY(${dist}px)`;ind.style.opacity=dist/threshold;}},{passive:true});document.addEventListener('touchend',()=>{if(!pulling)return;const dist=currentY-startY;if(dist>threshold){ind.innerHTML='<i class="fas fa-spinner fa-spin"></i>';setTimeout(()=>location.reload(),500);}else{ind.style.transform='';ind.style.opacity='';}pulling=false;},{passive:true});}
function initKeyboardShortcuts(){if(HIFI.isMobile())return;document.addEventListener('keydown',(e)=>{if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();document.querySelector('#searchNama')?.focus();}if((e.ctrlKey||e.metaKey)&&e.key==='r'){if(!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();refreshData();}}if(e.key==='Escape'){closeAllDropdowns();const dt=getDT();if(dt){dt.rows().every(function(){if(this.child&&this.child.isShown()){this.child.hide();$(this.node()).removeClass('shown');}});}}});}
function handleOrientationChange(){let t;window.addEventListener('orientationchange',()=>{showLoadingState(true);clearTimeout(t);t=setTimeout(()=>{const dt=getDT();dt?.columns.adjust().draw();showLoadingState(false);},300);});}
function optimizePerformance(){if('IntersectionObserver'in window){const obs=new IntersectionObserver((es)=>{es.forEach(en=>{if(en.isIntersecting){const img=en.target;if(img.dataset.src){img.src=img.dataset.src;img.removeAttribute('data-src');obs.unobserve(img);}}});});document.querySelectorAll('img[data-src]').forEach(img=>obs.observe(img));}let r;window.addEventListener('resize',()=>{clearTimeout(r);document.body.classList.add('resize-animation-stopper');r=setTimeout(()=>document.body.classList.remove('resize-animation-stopper'),400);},{passive:true});}
function initAccessibility(){document.querySelectorAll('.btn-action').forEach(btn=>{if(!btn.getAttribute('aria-label')){const title=btn.getAttribute('title')||btn.textContent.trim();btn.setAttribute('aria-label',title);}});const ann=document.createElement('div');ann.setAttribute('role','status');ann.setAttribute('aria-live','polite');ann.setAttribute('aria-atomic','true');ann.className='sr-only';document.body.appendChild(ann);document.querySelectorAll('.modal-glass').forEach(modal=>{const f=modal.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');const first=f[0],last=f[f.length-1];modal.addEventListener('keydown',(e)=>{if(e.key==='Tab'){if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});});}
function initErrorHandling(){window.addEventListener('error',(e)=>{console.error('Runtime error:',e.error);if(HIFI.isMobile())alert('Terjadi kesalahan. Silakan refresh halaman.');});window.addEventListener('unhandledrejection',(e)=>{console.error('Unhandled promise rejection:',e.reason);});}
function initNetworkStatus(){if(!HIFI.isMobile())return;let offlineToast;window.addEventListener('offline',()=>{offlineToast=showToast('Tidak ada koneksi internet','error',0);});window.addEventListener('online',()=>{offlineToast?.remove();showToast('Koneksi tersambung kembali','success',3000);});}
function showToast(message,type='info',duration=3000){const toast=document.createElement('div');toast.className=`toast toast-${type}`;toast.textContent=message;toast.style.cssText=`position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:${type==='error'?'#DC143C':'#10B981'};color:#fff;padding:12px 24px;border-radius:8px;z-index:10000;animation:slideUp .3s ease-out;box-shadow:0 4px 12px rgba(0,0,0,.2);`;document.body.appendChild(toast);if(duration>0){setTimeout(()=>{toast.style.animation='slideDown .3s ease-out';setTimeout(()=>toast.remove(),300);},duration);}return toast;}

// ====================== INIT ======================
function initAll() {
  console.log('🚀 HIFI Admin (Fixed)');
  initSidebarToggle();
  initDataTable();
  initSearchHighlight();
  initCharts();
  animateStatCards();

  initTouchEnhancements();
  initKeyboardShortcuts();
  handleOrientationChange();
  optimizePerformance();
  initAccessibility();
  initErrorHandling();
  initNetworkStatus();

  document.querySelectorAll('.glass-card, .stat-card, .btn-action').forEach(el => {
    el.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)';
  });

  document.body.classList.add(HIFI.isMobile() ? 'is-mobile' : HIFI.isTablet() ? 'is-tablet' : 'is-desktop');
  if (HIFI.isTouch()) document.body.classList.add('is-touch');
  console.log('✅ Initialization complete');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

// ====================== INLINE CSS (overlay & helpers) ======================
const responsiveStyles=document.createElement('style');
responsiveStyles.textContent=`
  .loading-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(5px);z-index:99999;align-items:center;justify-content:center;opacity:0;transition:opacity .3s ease}
  .loading-overlay.active{opacity:1}
  .loading-spinner{text-align:center;color:#fff}
  .loading-spinner p{margin-top:16px;font-size:14px}
  .swipe-refresh-indicator{position:fixed;top:-60px;left:50%;transform:translateX(-50%);width:40px;height:40px;background:rgba(255,255,255,.9);border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:all .3s ease;box-shadow:0 4px 12px rgba(0,0,0,.1)}
  .swipe-refresh-indicator i{color:var(--primary-blue)}
  @keyframes slideUp{from{transform:translateX(-50%) translateY(100px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}
  @keyframes slideDown{from{transform:translateX(-50%) translateY(0);opacity:1}to{transform:translateX(-50%) translateY(100px);opacity:0}}
  .resize-animation-stopper *{animation:none!important;transition:none!important}
  .is-touch button:active,.is-touch .btn-action:active,.is-touch .btn-primary-gradient:active{transform:scale(.95)}
  @media(max-width:768px){.glass-card,.stat-card{transform-origin:center}*{-webkit-overflow-scrolling:touch}button,a,.btn-action{-webkit-tap-highlight-color:rgba(30,58,138,.1)}}
  @media(max-height:500px) and (orientation:landscape){.loading-spinner p{display:none}.swipe-refresh-indicator{width:32px;height:32px}}
`;
document.head.appendChild(responsiveStyles);
</script>
