'use strict';

let staffUser  = null;
let cache      = {};   // { all: [], contact: [], mobile: [], corporate: [], appointment: [] }
let activeTab  = 'all';
let openEnquiry = null;
let submitting = false;

// ── INIT ──
(async () => {
  try {
    const r = await fetch('/api/staff/me', { credentials: 'same-origin' });
    if (r.ok) {
      const d = await r.json();
      staffUser = d.user;
      showDashboard();
      return;
    }
  } catch {}
  document.getElementById('loading-screen').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
})();

// ── LOGIN ──
async function doLogin(e) {
  e.preventDefault();
  if (submitting) return;
  submitting = true;
  const btn  = document.getElementById('login-btn');
  const err  = document.getElementById('login-err');
  const email = document.getElementById('s-email').value.trim();
  const pass  = document.getElementById('s-pass').value;
  btn.disabled = true;
  btn.textContent = 'Signing in…';
  err.style.display = 'none';
  try {
    const r = await fetch('/api/staff/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    });
    const d = await r.json();
    if (!r.ok) {
      err.textContent = d.error || 'Login failed.';
      err.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Sign In';
      submitting = false;
      return;
    }
    staffUser = d.user;
    submitting = false;
    showDashboard();
  } catch {
    err.textContent = 'Network error. Please try again.';
    err.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Sign In';
    submitting = false;
  }
}

// ── LOGOUT ──
async function doLogout() {
  try { await fetch('/api/staff/logout', { method: 'POST', credentials: 'same-origin' }); } catch {}
  window.location.reload();
}

// ── SHOW DASHBOARD ──
function showDashboard() {
  document.getElementById('loading-screen').style.display = 'none';
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('dashboard-screen').style.display = 'flex';
  document.getElementById('staff-name').textContent = staffUser.name || staffUser.email;
  const hash = window.location.hash.replace('#', '');
  const tabs = ['all','contact','appointment','mobile','corporate'];
  showTab(tabs.includes(hash) ? hash : 'all');
}

// ── TABS ──
function showTab(name) {
  activeTab = name;
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  const btn = document.querySelector(`.stab[data-tab="${name}"]`);
  if (btn) btn.classList.add('active');
  history.replaceState(null, '', '/staff#' + name);
  loadTab(name);
}

// ── DATA LOADING ──
async function loadTab(name) {
  if (name === 'all') {
    await Promise.all([loadStats(), loadEnquiries('all')]);
  } else {
    loadEnquiries(name);
  }
}

async function loadStats() {
  try {
    const d = await (await fetch('/api/staff/stats', { credentials: 'same-origin' })).json();
    document.getElementById('st-total').textContent  = d.total ?? '—';
    document.getElementById('st-24h').textContent    = d.last24h ?? '—';
    const newRow    = d.byStatus?.find(s => s.status === 'new');
    const inProgRow = d.byStatus?.find(s => s.status === 'in_progress');
    document.getElementById('st-new').textContent    = newRow    ? newRow.count    : '0';
    document.getElementById('st-inprog').textContent = inProgRow ? inProgRow.count : '0';

    // sidebar badges
    const typeMap = {};
    d.byType?.forEach(t => { typeMap[t.type] = parseInt(t.count, 10); });
    const total = Object.values(typeMap).reduce((a, b) => a + b, 0);
    setBadge('all', total);
    ['contact','appointment','mobile','corporate'].forEach(t => {
      const c = typeMap[t] || 0;
      const el = document.getElementById('badge-' + t);
      if (el) { el.textContent = c; el.style.display = c > 0 ? '' : 'none'; }
    });
  } catch (e) {
    console.error('Stats error:', e);
  }
}

function setBadge(id, count) {
  const el = document.getElementById('badge-' + id);
  if (el) { el.textContent = count; el.style.display = count > 0 ? '' : 'none'; }
}

async function loadEnquiries(type) {
  const bodyId = type + '-body';
  const tbody = document.getElementById(bodyId);
  if (!tbody) return;
  if (cache[type]) { renderTable(type, cache[type]); return; }
  tbody.innerHTML = `<tr><td colspan="8" class="state-msg">Loading…</td></tr>`;
  try {
    const url = type === 'all'
      ? '/api/staff/enquiries?limit=200'
      : `/api/staff/enquiries?type=${type}&limit=200`;
    const d = await (await fetch(url, { credentials: 'same-origin' })).json();
    cache[type] = d.enquiries || [];
    renderTable(type, cache[type]);
  } catch {
    tbody.innerHTML = `<tr><td colspan="8" class="state-msg">Error loading data. Please refresh.</td></tr>`;
  }
}

// ── RENDER ──
function renderTable(type, list) {
  const search  = (document.getElementById(type + '-search')  || {}).value?.toLowerCase() || '';
  const status  = (document.getElementById(type + '-status')  || {}).value || '';
  let filtered = list;
  if (search) filtered = filtered.filter(e =>
    [e.name, e.email, e.org, e.company, e.subject, e.exam_type].some(v => v?.toLowerCase().includes(search))
  );
  if (status) filtered = filtered.filter(e => e.status === status);

  const tbody = document.getElementById(type + '-body');
  if (!tbody) return;
  if (!filtered.length) {
    const cols = type === 'all' ? 6 : 6;
    tbody.innerHTML = `<tr><td colspan="${cols}" class="state-msg">No enquiries found.</td></tr>`;
    return;
  }

  if (type === 'all') {
    tbody.innerHTML = filtered.map(e => `<tr style="cursor:pointer" onclick="openDrawer(${e.id})">
      <td>${typeBadge(e.type)}</td>
      <td class="name">${esc(e.name || e.org || e.company || '—')}</td>
      <td class="mob-hide"><a href="mailto:${esc(e.email)}" onclick="event.stopPropagation()">${esc(e.email || '—')}</a></td>
      <td class="mob-hide" style="color:var(--muted2);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(detailSnippet(e))}</td>
      <td>${statusBadge(e.status)}</td>
      <td class="mob-hide" style="color:var(--muted2)">${fmtDate(e.created_at)}</td>
    </tr>`).join('');
  } else if (type === 'contact') {
    tbody.innerHTML = filtered.map(e => `<tr style="cursor:pointer" onclick="openDrawer(${e.id})">
      <td class="name">${esc(e.name || '—')}</td>
      <td class="mob-hide"><a href="mailto:${esc(e.email)}" onclick="event.stopPropagation()">${esc(e.email || '—')}</a></td>
      <td class="mob-hide" style="color:var(--muted2)">${esc(e.subject || '—')}</td>
      <td>${statusBadge(e.status)}</td>
      <td class="mob-hide" style="color:var(--muted2)">${fmtDate(e.created_at)}</td>
    </tr>`).join('');
  } else if (type === 'appointment') {
    tbody.innerHTML = filtered.map(e => `<tr style="cursor:pointer" onclick="openDrawer(${e.id})">
      <td class="name">${esc(e.name || '—')}</td>
      <td class="mob-hide"><a href="mailto:${esc(e.email)}" onclick="event.stopPropagation()">${esc(e.email || '—')}</a></td>
      <td class="mob-hide">${esc(e.exam_type || '—')}</td>
      <td class="mob-hide" style="color:var(--muted2)">${esc(e.preferred_date || '—')}</td>
      <td>${statusBadge(e.status)}</td>
      <td class="mob-hide" style="color:var(--muted2)">${fmtDate(e.created_at)}</td>
    </tr>`).join('');
  } else if (type === 'mobile') {
    tbody.innerHTML = filtered.map(e => `<tr style="cursor:pointer" onclick="openDrawer(${e.id})">
      <td class="name">${esc(e.org || '—')}</td>
      <td class="mob-hide">${esc(e.name || '—')}</td>
      <td class="mob-hide" style="color:var(--muted2)">${esc(e.employees || '—')}</td>
      <td class="mob-hide" style="color:var(--muted2)">${esc(e.preferred_date || '—')}</td>
      <td>${statusBadge(e.status)}</td>
      <td class="mob-hide" style="color:var(--muted2)">${fmtDate(e.created_at)}</td>
    </tr>`).join('');
  } else if (type === 'corporate') {
    tbody.innerHTML = filtered.map(e => `<tr style="cursor:pointer" onclick="openDrawer(${e.id})">
      <td class="name">${esc(e.company || '—')}</td>
      <td class="mob-hide">${esc(e.name || '—')}</td>
      <td class="mob-hide" style="color:var(--muted2)">${esc(e.employees || '—')}</td>
      <td class="mob-hide" style="color:var(--muted2)">${esc(e.location || '—')}</td>
      <td>${statusBadge(e.status)}</td>
      <td class="mob-hide" style="color:var(--muted2)">${fmtDate(e.created_at)}</td>
    </tr>`).join('');
  }
}

function filterTable(type) {
  if (cache[type]) renderTable(type, cache[type]);
}

// ── DETAIL DRAWER ──
function openDrawer(id) {
  const all = Object.values(cache).flat();
  const e = all.find(x => x.id === id);
  if (!e) return;
  openEnquiry = { ...e };

  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawer-overlay');
  document.getElementById('drawer-content').innerHTML = drawerHTML(e);
  drawer.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Restore active status button
  updateStatusButtons(e.status);
}

function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawer-overlay').classList.remove('open');
  document.body.style.overflow = '';
  openEnquiry = null;
}

function drawerHTML(e) {
  const rows = buildRows(e);
  return `
    <div class="drawer-title">${esc(e.name || e.org || e.company || 'Enquiry #' + e.id)}</div>
    <div class="drawer-meta">${typeBadge(e.type)} &nbsp;·&nbsp; Received ${fmtDateFull(e.created_at)}</div>

    <div class="d-section">
      <div class="d-label">Details</div>
      ${rows}
    </div>

    <hr class="d-divider">

    <div class="d-section">
      <div class="d-label">Status</div>
      <div class="d-status-row">
        <button class="d-status-btn" data-s="new"         onclick="selectStatus('new')">New</button>
        <button class="d-status-btn" data-s="in_progress" onclick="selectStatus('in_progress')">In Progress</button>
        <button class="d-status-btn" data-s="closed"      onclick="selectStatus('closed')">Closed</button>
      </div>
    </div>

    <div class="d-section">
      <div class="d-label">Staff Notes</div>
      <textarea class="d-textarea" id="staff-notes-input" placeholder="Internal notes (not visible to enquirer)…">${esc(e.staff_notes || '')}</textarea>
    </div>

    <button class="save-btn" onclick="saveDrawer()">Save Changes</button>
    <div class="save-msg" id="save-msg"></div>
  `;
}

function buildRows(e) {
  const rows = [];
  const add = (k, v) => { if (v) rows.push(`<div class="d-row"><div class="d-key">${k}</div><div class="d-val">${v}</div></div>`); };

  add('Email', e.email ? `<a href="mailto:${esc(e.email)}">${esc(e.email)}</a>` : null);
  add('Phone', e.phone ? `<a href="tel:${esc(e.phone)}">${esc(e.phone)}</a>` : null);
  if (e.type === 'contact') {
    add('Subject',  esc(e.subject));
    add('Company',  esc(e.company));
    add('Message',  `<span style="white-space:pre-wrap">${esc(e.message)}</span>`);
  } else if (e.type === 'appointment') {
    add('Exam Type',      esc(e.exam_type));
    add('Preferred Date', esc(e.preferred_date));
    add('Preferred Time', esc(e.preferred_time));
    add('Notes',          e.notes ? `<span style="white-space:pre-wrap">${esc(e.notes)}</span>` : null);
  } else if (e.type === 'mobile') {
    add('Organisation', esc(e.org));
    add('Employees',    esc(e.employees));
    add('Preferred Date', esc(e.preferred_date));
    add('Site Address', esc(e.address));
    add('Notes',        e.notes ? `<span style="white-space:pre-wrap">${esc(e.notes)}</span>` : null);
  } else if (e.type === 'corporate') {
    add('Company',      esc(e.company));
    add('Employees',    esc(e.employees));
    add('Preferred Start', esc(e.preferred_date));
    add('Location',     esc(e.location));
    add('Notes',        e.notes ? `<span style="white-space:pre-wrap">${esc(e.notes)}</span>` : null);
  }
  return rows.join('');
}

function selectStatus(s) {
  if (!openEnquiry) return;
  openEnquiry.status = s;
  updateStatusButtons(s);
}

function updateStatusButtons(s) {
  document.querySelectorAll('.d-status-btn').forEach(b => {
    b.className = 'd-status-btn';
    if (b.dataset.s === s) b.classList.add('active-' + s);
  });
}

async function saveDrawer() {
  if (!openEnquiry) return;
  const btn = document.querySelector('.save-btn');
  const msg = document.getElementById('save-msg');
  const notes = document.getElementById('staff-notes-input')?.value ?? openEnquiry.staff_notes ?? '';
  btn.disabled = true;
  btn.textContent = 'Saving…';
  msg.textContent = '';
  try {
    const r = await fetch(`/api/staff/enquiries/${openEnquiry.id}`, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: openEnquiry.status, staff_notes: notes }),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || 'Update failed');

    // Update local cache
    const updated = d.enquiry;
    ['all', updated.type].forEach(key => {
      if (cache[key]) {
        const idx = cache[key].findIndex(x => x.id === updated.id);
        if (idx !== -1) cache[key][idx] = updated;
      }
    });
    // Re-render active table
    if (cache[activeTab]) renderTable(activeTab, cache[activeTab]);
    msg.textContent = 'Saved ✓';
    msg.style.color = 'var(--success)';
    openEnquiry = { ...updated };
  } catch (err) {
    msg.textContent = err.message || 'Save failed.';
    msg.style.color = 'var(--danger)';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Save Changes';
  }
}

// ── HELPERS ──
function detailSnippet(e) {
  if (e.type === 'contact')     return e.subject || e.message || '';
  if (e.type === 'appointment') return e.exam_type || '';
  if (e.type === 'mobile')      return e.org || '';
  if (e.type === 'corporate')   return e.company || '';
  return '';
}

function statusBadge(s) {
  const label = s === 'in_progress' ? 'In Progress' : (s || 'new');
  return `<span class="badge badge-${s || 'new'}">${esc(label)}</span>`;
}

function typeBadge(t) {
  const labels = { contact:'Contact', mobile:'Mobile Clinic', corporate:'Corporate', appointment:'Appointment' };
  return `<span class="badge badge-${t}">${labels[t] || esc(t)}</span>`;
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-CA', { month:'short', day:'numeric', year:'numeric' });
}

function fmtDateFull(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-CA', { month:'short', day:'numeric', year:'numeric', hour:'numeric', minute:'2-digit' });
}

function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}
