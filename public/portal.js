'use strict';

let user      = null;
let empCache  = null;
let ordCache  = null;
let compCache = null;
let dashLoaded = false;
let submitting = false;

// ── SCREEN SWITCHER ──
function showScreen(name) {
  document.getElementById('loading-screen').style.display = 'none';
  ['login-screen','forgot-screen','reset-screen'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
  const target = document.getElementById(name + '-screen');
  if (target) target.style.display = 'flex';
}

// ── SESSION RESTORE + TOKEN CHECK ──
(async () => {
  const params = new URLSearchParams(window.location.search);
  const token  = params.get('token');
  if (token) {
    window.history.replaceState({}, '', '/portal');
    document.getElementById('reset-screen').dataset.token = token;
    showScreen('reset');
    return;
  }
  try {
    const r = await fetch('/api/portal/me', { credentials: 'same-origin' });
    if (r.ok) { const d = await r.json(); user = d.user; showDashboard(); return; }
  } catch {}
  document.getElementById('loading-screen').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
})();

// ── PASSWORD TOGGLE ──
function togglePassword() {
  const input = document.getElementById('f-pass');
  const btn   = document.getElementById('pw-toggle');
  const show  = input.type === 'password';
  input.type  = show ? 'text' : 'password';
  btn.textContent = show ? '🙈' : '👁';
  btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
}

// ── LOGIN ──
async function doLogin(e) {
  e.preventDefault();
  if (submitting) return;
  submitting = true;
  const btn   = document.getElementById('signin-btn');
  const err   = document.getElementById('login-error');
  const email = document.getElementById('f-email').value.trim();
  const pass  = document.getElementById('f-pass').value;
  btn.disabled = true;
  btn.textContent = 'Signing in…';
  err.style.display = 'none';
  try {
    const r = await fetch('/api/portal/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    });
    const d = await r.json();
    if (!r.ok) {
      err.textContent = d.error || 'Login failed. Please try again.';
      err.style.display = '';
      btn.disabled = false;
      btn.textContent = 'Sign In';
      submitting = false;
      return;
    }
    submitting = false;
    user = d.user;
    showDashboard();
  } catch {
    err.textContent = 'Network error. Please check your connection and try again.';
    err.style.display = '';
    btn.disabled = false;
    btn.textContent = 'Sign In';
    submitting = false;
  }
}

// ── FORGOT PASSWORD ──
async function doForgot(e) {
  e.preventDefault();
  if (submitting) return;
  const email  = document.getElementById('forgot-email').value.trim();
  const errEl  = document.getElementById('forgot-error');
  const succEl = document.getElementById('forgot-success');
  const btn    = e.target.querySelector('button[type=submit]');
  errEl.textContent = '';
  errEl.style.display = 'none';
  succEl.style.display = 'none';
  if (!email) {
    errEl.textContent = 'Please enter your email address.';
    errEl.style.display = '';
    return;
  }
  submitting = true;
  btn.disabled = true;
  btn.textContent = 'Sending…';
  try {
    const r = await fetch('/api/portal/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!r.ok) {
      errEl.textContent = 'Something went wrong. Please try again.';
      errEl.style.display = '';
      btn.disabled = false;
      btn.textContent = 'Send Reset Link';
      return;
    }
    succEl.textContent = "If that email is registered, you'll receive a reset link shortly.";
    succEl.style.display = 'block';
    btn.textContent = 'Sent';
  } catch {
    errEl.textContent = 'Network error. Please try again.';
    errEl.style.display = '';
    btn.disabled = false;
    btn.textContent = 'Send Reset Link';
  } finally {
    submitting = false;
  }
}

// ── RESET PASSWORD ──
async function doReset(e) {
  e.preventDefault();
  if (submitting) return;
  const token   = document.getElementById('reset-screen').dataset.token;
  const pass    = document.getElementById('reset-pass').value;
  const confirm = document.getElementById('reset-confirm').value;
  const errEl   = document.getElementById('reset-error');
  const succEl  = document.getElementById('reset-success');
  const btn     = e.target.querySelector('button[type=submit]');
  errEl.textContent = '';
  errEl.style.display = 'none';
  succEl.style.display = 'none';
  if (!pass || pass.length < 8) {
    errEl.textContent = 'Password must be at least 8 characters.';
    errEl.style.display = '';
    return;
  }
  if (pass !== confirm) {
    errEl.textContent = 'Passwords do not match.';
    errEl.style.display = '';
    return;
  }
  if (!token) {
    errEl.textContent = 'Invalid reset link. Please request a new one.';
    errEl.style.display = '';
    return;
  }
  submitting = true;
  btn.disabled = true;
  btn.textContent = 'Saving…';
  try {
    const r = await fetch('/api/portal/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password: pass }),
    });
    const d = await r.json();
    if (!r.ok) {
      errEl.textContent = d.error || 'Reset failed.';
      errEl.style.display = '';
      btn.disabled = false;
      btn.textContent = 'Set New Password';
      return;
    }
    succEl.textContent = 'Password updated! Redirecting to sign in…';
    succEl.style.display = 'block';
    btn.textContent = 'Done';
    setTimeout(() => showScreen('login'), 2000);
  } catch {
    errEl.textContent = 'Network error. Please try again.';
    errEl.style.display = '';
    btn.disabled = false;
    btn.textContent = 'Set New Password';
  } finally {
    submitting = false;
  }
}

// ── LOGOUT ──
async function doLogout() {
  try {
    await fetch('/api/portal/logout', { method: 'POST', credentials: 'same-origin' });
  } catch {}
  window.location.href = '/';
}

// ── SHOW DASHBOARD ──
function showDashboard() {
  document.getElementById('loading-screen').style.display = 'none';
  ['login-screen','forgot-screen','reset-screen'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
  document.getElementById('dashboard-screen').style.display = 'flex';
  document.getElementById('user-name').textContent    = user.name  || user.email;
  document.getElementById('user-company').textContent = user.company;
  document.getElementById('st-year').textContent = new Date().getFullYear();
  const validTabs = ['dashboard','employees','orders','compliance'];
  const hash = window.location.hash.replace('#','');
  showTab(validTabs.includes(hash) ? hash : 'dashboard');
}

// ── TABS ──
function showTab(name) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.dtab').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected','false');
  });
  document.getElementById('tab-' + name).classList.add('active');
  const btn = document.querySelector('.dtab[data-tab="' + name + '"]');
  if (btn) { btn.classList.add('active'); btn.setAttribute('aria-selected','true'); }
  document.title = name.charAt(0).toUpperCase() + name.slice(1) + ' — VPI Client Portal';
  history.replaceState(null, '', '/portal#' + name);
  if (name === 'dashboard' && !dashLoaded) loadDashboard();
  if (name === 'employees' && !empCache)   loadEmployees();
  if (name === 'orders'    && !ordCache)   loadOrders();
  if (name === 'compliance'&& !compCache)  loadCompliance();
}

// ── DATA LOADERS ──
async function loadDashboard() {
  dashLoaded = true;
  try {
    const d = await (await fetch('/api/portal/dashboard', { credentials: 'same-origin' })).json();
    document.getElementById('st-employees').textContent  = d.totalEmployees  ?? '—';
    document.getElementById('st-compliance').textContent = d.complianceRate  != null ? d.complianceRate + '%' : '—';
    document.getElementById('st-pending').textContent    = d.pendingOrders   ?? '—';
    const tbody = document.getElementById('recent-orders-body');
    if (!d.recentOrders?.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="state-msg">No orders yet.</td></tr>';
      return;
    }
    tbody.innerHTML = d.recentOrders.map(o => `<tr>
      <td style="font-weight:700">${esc(o.employee_name||'—')}</td>
      <td class="mob-hide">${esc(o.frame_name||'—')}</td>
      <td class="mob-hide">${fmtDate(o.order_date)}</td>
      <td>${statusBadge(o.status)}</td>
    </tr>`).join('');
  } catch {
    document.getElementById('recent-orders-body').innerHTML =
      '<tr><td colspan="4" class="state-msg">Error loading data. Please refresh.</td></tr>';
    dashLoaded = false;
  }
}

async function loadEmployees() {
  document.getElementById('employees-body').innerHTML =
    '<tr><td colspan="5" class="state-msg">Loading…</td></tr>';
  try {
    const d = await (await fetch('/api/portal/employees', { credentials: 'same-origin' })).json();
    empCache = d.employees;
    renderEmployees(empCache);
  } catch {
    document.getElementById('employees-body').innerHTML =
      '<tr><td colspan="5" class="state-msg">Error loading employees. Please refresh.</td></tr>';
  }
}

function renderEmployees(list) {
  const tbody = document.getElementById('employees-body');
  if (!list?.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="state-msg">No employees found.</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(e => `<tr>
    <td style="font-weight:700">${esc(e.name)}</td>
    <td class="mob-hide">${esc(e.department||'—')}</td>
    <td class="mob-hide">${esc(e.job_title||'—')}</td>
    <td class="mob-hide">${e.enrolled_at ? fmtDate(e.enrolled_at) : '—'}</td>
    <td>${e.eligible
      ? '<span class="badge badge-eligible">Eligible</span>'
      : '<span class="badge badge-ineligible">Ineligible</span>'}</td>
  </tr>`).join('');
}

function filterEmployees() {
  const q = document.getElementById('emp-search').value.toLowerCase();
  if (!empCache) return;
  renderEmployees(q
    ? empCache.filter(e =>
        (e.name+' '+(e.department||'')+' '+(e.job_title||'')).toLowerCase().includes(q))
    : empCache);
}

async function loadOrders() {
  document.getElementById('orders-body').innerHTML =
    '<tr><td colspan="5" class="state-msg">Loading…</td></tr>';
  try {
    const d = await (await fetch('/api/portal/orders', { credentials: 'same-origin' })).json();
    ordCache = d.orders;
    renderOrders(ordCache);
  } catch {
    document.getElementById('orders-body').innerHTML =
      '<tr><td colspan="5" class="state-msg">Error loading orders. Please refresh.</td></tr>';
  }
}

function renderOrders(list) {
  const tbody = document.getElementById('orders-body');
  if (!list?.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="state-msg">No orders found.</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(o => `<tr>
    <td style="font-weight:700">${esc(o.employee_name||'—')}</td>
    <td class="mob-hide">${esc(o.frame_name||'—')}</td>
    <td class="mob-hide">${esc(o.compliance_type||'—')}</td>
    <td class="mob-hide">${fmtDate(o.order_date)}</td>
    <td>${statusBadge(o.status)}</td>
  </tr>`).join('');
}

function filterOrders() {
  const v = document.getElementById('order-filter').value;
  if (!ordCache) return;
  renderOrders(v ? ordCache.filter(o => o.status === v) : ordCache);
}

async function loadCompliance() {
  document.getElementById('comp-docs-body').innerHTML = '<div class="state-msg">Loading…</div>';
  try {
    const d = await (await fetch('/api/portal/compliance', { credentials: 'same-origin' })).json();
    compCache = d;
    const grid = document.getElementById('comp-grid');
    if (d.stats?.length) {
      grid.style.display = '';
      grid.innerHTML = d.stats.map(s => `
        <div class="comp-item">
          <div class="comp-type">${esc(s.compliance_type||'General')}</div>
          <div class="comp-count">${s.count}</div>
          <div style="font-size:12px;color:var(--muted);margin-top:4px;">Completed</div>
        </div>`).join('');
    } else {
      grid.style.display = 'none';
    }
    const body = document.getElementById('comp-docs-body');
    if (!d.docs?.length) {
      body.innerHTML = '<div class="state-msg">No compliance documents on file.</div>';
      return;
    }
    body.innerHTML = d.docs.map(doc => `
      <div class="doc-row">
        <div class="doc-info">
          <div class="doc-icon">📄</div>
          <div>
            <div class="doc-name">${esc(doc.title)}</div>
            <div class="doc-meta">${esc(doc.doc_type||'Document')} · ${doc.issue_date ? fmtDate(doc.issue_date) : '—'}</div>
          </div>
        </div>
        ${doc.file_url
          ? `<a class="doc-dl" href="${esc(doc.file_url)}" target="_blank" rel="noopener noreferrer">Download ↗</a>`
          : '<span style="font-size:12px;color:var(--muted)">On file</span>'}
      </div>`).join('');
  } catch {
    document.getElementById('comp-docs-body').innerHTML =
      '<div class="state-msg">Error loading documents. Please refresh.</div>';
  }
}

// ── HELPERS ──
function statusBadge(s) {
  const map = {
    complete:   'badge-complete',
    pending:    'badge-pending',
    processing: 'badge-processing',
    in_review:  'badge-in_review',
  };
  return `<span class="badge ${map[s]||''}">${esc((s||'').replace('_',' '))}</span>`;
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-CA', { year:'numeric', month:'short', day:'numeric' });
}

function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}
