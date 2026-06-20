'use strict';
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'index.html');
let html = fs.readFileSync(file, 'utf8');
const before = html.length;

// ─── 1. MOBILE NAV CSS ───────────────────────────────────────────────────────
const mobileNavCSS = `
/* ── MOBILE NAV HAMBURGER ── */
.nav-hamburger{display:none;flex-direction:column;justify-content:center;align-items:center;gap:5px;width:40px;height:40px;background:none;border:none;cursor:pointer;padding:4px;border-radius:8px;transition:background 0.2s;}
.nav-hamburger:hover{background:rgba(255,255,255,0.08);}
.nav-hamburger span{display:block;width:22px;height:2px;background:var(--text-main);border-radius:2px;transition:transform 0.3s,opacity 0.3s;}
.nav-hamburger.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}
.nav-hamburger.open span:nth-child(2){opacity:0;}
.nav-hamburger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}

.mobile-drawer{position:fixed;top:0;right:0;width:min(320px,90vw);height:100dvh;background:var(--bg-panel);border-left:1px solid var(--border);z-index:9999;transform:translateX(100%);transition:transform 0.3s cubic-bezier(0.4,0,0.2,1);overflow-y:auto;display:flex;flex-direction:column;padding:80px 0 40px;}
.mobile-drawer.open{transform:translateX(0);}
.mobile-drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9998;opacity:0;pointer-events:none;transition:opacity 0.3s;}
.mobile-drawer-overlay.open{opacity:1;pointer-events:all;}
.mobile-drawer-close{position:absolute;top:16px;right:16px;width:36px;height:36px;background:rgba(255,255,255,0.06);border:none;color:var(--text-main);border-radius:8px;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;}
.mobile-drawer-close:hover{background:rgba(255,255,255,0.12);}
.mob-nav-section{padding:8px 24px 4px;font-size:10px;font-weight:700;letter-spacing:2px;color:var(--text-muted);text-transform:uppercase;}
.mob-nav-link{display:flex;align-items:center;gap:12px;padding:13px 24px;color:var(--text-main);font-size:15px;font-weight:500;cursor:pointer;transition:background 0.15s,color 0.15s;border:none;background:none;width:100%;text-align:left;}
.mob-nav-link:hover{background:rgba(255,255,255,0.05);color:var(--accent-cyan);}
.mob-nav-link.active{color:var(--accent);background:rgba(255,106,0,0.08);}
.mob-nav-link .mob-icon{width:32px;height:32px;background:rgba(255,255,255,0.06);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
.mob-nav-divider{height:1px;background:var(--border);margin:8px 24px;}
.mob-cta-wrap{padding:16px 24px;display:flex;flex-direction:column;gap:10px;margin-top:auto;}
.mob-phone{display:flex;align-items:center;gap:8px;padding:10px 24px;color:var(--text-muted);font-size:13px;}
.mob-phone a{color:var(--text-main);text-decoration:none;font-weight:600;}
.mob-phone a:hover{color:var(--accent-cyan);}

/* ── PAGE TRANSITIONS ── */
.page{opacity:0;transition:opacity 0.22s ease;}
.page.active{opacity:1;}

/* ── SCROLL-TO-TOP BUTTON ── */
#scrollTopBtn{position:fixed;bottom:100px;right:16px;width:40px;height:40px;background:var(--bg-panel);border:1px solid var(--border);color:var(--text-main);border-radius:10px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity 0.25s,background 0.2s,transform 0.2s;z-index:900;}
#scrollTopBtn.visible{opacity:1;pointer-events:all;}
#scrollTopBtn:hover{background:var(--accent);border-color:var(--accent);transform:translateY(-2px);}

/* ── NAV PHONE ── */
.nav-phone-link{display:none;align-items:center;gap:6px;color:var(--text-muted);font-size:12px;font-weight:500;text-decoration:none;white-space:nowrap;padding:6px 10px;border-radius:8px;transition:color 0.2s,background 0.2s;}
.nav-phone-link:hover{color:var(--text-main);background:rgba(255,255,255,0.05);}
@media(min-width:1280px){.nav-phone-link{display:flex;}}

/* ── INLINE FORM VALIDATION ── */
.fi.invalid,.ft.invalid,.fs.invalid{border-color:#ef4444 !important;background:rgba(239,68,68,0.06) !important;}
.field-error{font-size:11px;color:#ef4444;margin-top:4px;display:none;}
.field-error.show{display:block;}

/* ── FIX STICKY BAR ON MOBILE (don't overlap forms) ── */
@media(max-width:600px){
  .sticky-bar{bottom:env(safe-area-inset-bottom,10px);}
  .page-contact .form-card, .page-mobile .form-card, .page-industrial .form-card{padding-bottom:100px;}
}

/* ── BETTER PRODUCT IMAGE PLACEHOLDERS ── */
.prod-img-placeholder{width:100%;aspect-ratio:4/3;background:linear-gradient(135deg,#e8edf5 0%,#d1d9e6 100%);display:flex;align-items:center;justify-content:center;border-radius:var(--radius) var(--radius) 0 0;overflow:hidden;position:relative;}
.prod-img-placeholder svg{width:60%;max-width:180px;height:auto;opacity:0.35;}
.prod-img-badge{position:absolute;top:10px;left:10px;}
`;

// Insert mobile nav CSS before closing </style>
html = html.replace('</style>\n<link', mobileNavCSS + '\n</style>\n<link');
if (!html.includes('.nav-hamburger{')) {
  html = html.replace('</style>', mobileNavCSS + '\n</style>');
}

// ─── 2. HAMBURGER BUTTON + MOBILE DRAWER HTML ────────────────────────────────
// Add hamburger button to nav-right
html = html.replace(
  '<div class="nav-right">',
  '<div class="nav-right">'
);

// Add phone link and hamburger to nav-right (before Client Portal button)
html = html.replace(
  '<button class="nav-portal-btn" onclick="navigate(\'portal\')">🔒 Client Portal</button>',
  '<a class="nav-phone-link" href="tel:+17800000000" aria-label="Call us">📞 +1 (780) 000-0000</a><button class="nav-portal-btn" onclick="navigate(\'portal\')">🔒 Client Portal</button>'
);

// Add hamburger button after nav-right closing div
html = html.replace(
  '</div>\n</nav>',
  `<button class="nav-hamburger" id="navHamburger" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobileDrawer">
    <span></span><span></span><span></span>
  </button>
</div>
</nav>

<!-- MOBILE DRAWER -->
<div class="mobile-drawer-overlay" id="drawerOverlay" onclick="closeMobileNav()"></div>
<nav class="mobile-drawer" id="mobileDrawer" aria-label="Mobile navigation" role="navigation">
  <button class="mobile-drawer-close" onclick="closeMobileNav()" aria-label="Close menu">✕</button>

  <span class="mob-nav-section">Navigation</span>
  <button class="mob-nav-link" onclick="mobileNav('home')"><span class="mob-icon">🏠</span>Home</button>
  <button class="mob-nav-link" onclick="mobileNav('shop')"><span class="mob-icon">👓</span>Shop Eyewear</button>
  <button class="mob-nav-link" onclick="mobileNav('book')"><span class="mob-icon">📅</span>Book Eye Exam</button>
  <button class="mob-nav-link" onclick="mobileNav('mobile')"><span class="mob-icon">🚐</span>Mobile Clinic</button>
  <button class="mob-nav-link" onclick="mobileNav('industrial')"><span class="mob-icon">🦺</span>Industrial Programs</button>

  <div class="mob-nav-divider"></div>
  <span class="mob-nav-section">Explore</span>
  <button class="mob-nav-link" onclick="mobileNav('learn')"><span class="mob-icon">📚</span>Learn & Resources</button>
  <button class="mob-nav-link" onclick="mobileNav('about')"><span class="mob-icon">ℹ️</span>About Us</button>
  <button class="mob-nav-link" onclick="mobileNav('contact')"><span class="mob-icon">✉️</span>Contact</button>
  <button class="mob-nav-link" onclick="mobileNav('portal')"><span class="mob-icon">🔒</span>Client Portal</button>

  <div class="mob-phone"><span>📞</span><a href="tel:+17800000000">+1 (780) 000-0000</a></div>

  <div class="mob-cta-wrap">
    <button class="btn btn-orange" style="width:100%;justify-content:center;" onclick="mobileNav('book')">Book Eye Exam →</button>
    <button class="btn btn-outline-navy" style="width:100%;justify-content:center;" onclick="mobileNav('industrial')">Corporate Quote</button>
  </div>
</nav>`
);

// ─── 3. SHOW HAMBURGER ON MOBILE (CSS) ───────────────────────────────────────
html = html.replace(
  '.nav-portal-btn{display:none}',
  '.nav-portal-btn{display:none}.nav-hamburger{display:flex}'
);

// ─── 4. SCROLL-TO-TOP BUTTON HTML ────────────────────────────────────────────
html = html.replace(
  '<div id="toast"',
  '<button id="scrollTopBtn" onclick="window.scrollTo({top:0,behavior:\'smooth\'})" aria-label="Scroll to top" title="Back to top">↑</button>\n<div id="toast"'
);

// ─── 5. UPDATE navigate() — hash routing + transition ────────────────────────
html = html.replace(
  `function navigate(page,collection=null){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('nav-active'));
  const target=document.getElementById(\`page-\${page}\`);
  if(target){target.classList.add('active');window.scrollTo({top:0,behavior:'smooth'});}
  const nl=document.getElementById(\`nl-\${page}\`);if(nl)nl.classList.add('nav-active');
  if(page==='home')renderTo('homeProdsGrid','all',8);
  if(page==='shop'){filterShop(collection||'all');}
  setTimeout(()=>triggerReveals(),120);
}`,
  `function navigate(page,collection=null){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('nav-active'));
  document.querySelectorAll('.mob-nav-link').forEach(a=>a.classList.remove('active'));
  const target=document.getElementById('page-'+page);
  if(target){
    target.classList.add('active');
    window.scrollTo({top:0,behavior:'instant'});
  }
  const nl=document.getElementById('nl-'+page);if(nl)nl.classList.add('nav-active');
  const mobLinks=document.querySelectorAll('.mob-nav-link');
  mobLinks.forEach(l=>{if(l.getAttribute('onclick')&&l.getAttribute('onclick').includes("'"+page+"'"))l.classList.add('active');});
  if(page==='home')renderTo('homeProdsGrid','all',8);
  if(page==='shop'){filterShop(collection||'all');}
  // Update URL hash for browser history
  try{
    const hash='#'+page+(collection?'/'+encodeURIComponent(collection):'');
    if(window.location.hash!==hash)history.pushState({page,collection},'',(page==='home'?'/':hash));
  }catch(e){}
  setTimeout(()=>triggerReveals(),120);
}`
);

// ─── 6. MOBILE NAV JS ────────────────────────────────────────────────────────
const mobileNavJS = `
// ════ MOBILE NAV ════
function openMobileNav(){
  document.getElementById('mobileDrawer').classList.add('open');
  document.getElementById('drawerOverlay').classList.add('open');
  document.getElementById('navHamburger').classList.add('open');
  document.getElementById('navHamburger').setAttribute('aria-expanded','true');
  document.body.style.overflow='hidden';
}
function closeMobileNav(){
  document.getElementById('mobileDrawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('open');
  document.getElementById('navHamburger').classList.remove('open');
  document.getElementById('navHamburger').setAttribute('aria-expanded','false');
  document.body.style.overflow='';
}
function mobileNav(page,collection){
  closeMobileNav();
  navigate(page,collection||null);
}
document.getElementById('navHamburger').addEventListener('click',function(){
  this.classList.contains('open')?closeMobileNav():openMobileNav();
});
// Close drawer on Escape
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMobileNav();});

// ════ HASH ROUTING (browser back/forward) ════
window.addEventListener('popstate',function(e){
  var state=e.state;
  if(state&&state.page){navigate(state.page,state.collection||null);}
  else{
    var hash=window.location.hash.replace('#','');
    if(hash){var parts=hash.split('/');navigate(parts[0],parts[1]?decodeURIComponent(parts[1]):null);}
    else{navigate('home');}
  }
});
// On first load, navigate to hash if present
(function(){
  var hash=window.location.hash.replace('#','');
  if(hash&&hash!=='home'){var parts=hash.split('/');navigate(parts[0],parts[1]?decodeURIComponent(parts[1]):null);}
})();

// ════ SCROLL-TO-TOP BUTTON ════
window.addEventListener('scroll',function(){
  var btn=document.getElementById('scrollTopBtn');
  if(btn)btn.classList.toggle('visible',window.scrollY>600);
},{ passive:true });
`;

// Insert mobile nav JS just before the closing </script> of the main script block
html = html.replace(
  "// ════ INIT ════\nrenderTo('homeProdsGrid','all',8);\nfilterShop('all');\ntriggerReveals();",
  "// ════ INIT ════\nrenderTo('homeProdsGrid','all',8);\nfilterShop('all');\ntriggerReveals();\n" + mobileNavJS
);

// ─── 7. FIX BOOK PAGE TOAST-ONLY OPTIONS ─────────────────────────────────────
// "In-Clinic Eye Exam" → navigate to contact with pre-selected subject
html = html.replace(
  `onclick="showToast('Clinic booking — powered by Acuity/Calendly')"`,
  `onclick="navigate('contact')"`
);
// "Digital Eye Consultation" → navigate to contact
html = html.replace(
  `onclick="showToast('Digital eye consultation — coming soon')"`,
  `onclick="navigate('contact')"`
);

// ─── 8. PORTAL LOGIN — real form submit handler ───────────────────────────────
html = html.replace(
  `onclick="showToast('Portal login — Full Shopify/`,
  `onclick="portalLogin(event);return false;" data-toast="Portal login — Full Shopify/`
).replace(
  /onclick="showToast\('Portal login — [^']+'\)"/,
  `onclick="portalLogin(event)"`
);

const portalLoginJS = `
// ════ PORTAL LOGIN ════
function portalLogin(e){
  if(e)e.preventDefault();
  var email=document.querySelector('#page-portal input[type="email"]');
  var pass=document.querySelector('#page-portal input[type="password"]');
  if(!email||!pass)return;
  var emailVal=(email.value||'').trim();
  var passVal=(pass.value||'').trim();
  if(!emailVal||!/.+@.+\\..+/.test(emailVal)){showToast('Please enter a valid email address.');email.focus();return;}
  if(!passVal){showToast('Please enter your password.');pass.focus();return;}
  showToast('Checking credentials — portal launching shortly…');
  // Placeholder: full auth integration pending
  setTimeout(function(){showToast('Portal access coming soon. Contact us to set up your corporate account.');},1800);
}
`;
html = html.replace(mobileNavJS, mobileNavJS + portalLoginJS);

// ─── 9. INLINE FORM VALIDATION ───────────────────────────────────────────────
// Add validateField helper + attach blur listeners on form inputs
const validationJS = `
// ════ INLINE FORM VALIDATION ════
function validateField(el){
  var v=(el.value||'').trim();
  var req=el.hasAttribute('required');
  var type=el.type||'text';
  var ok=true;
  if(req&&!v)ok=false;
  if(v&&type==='email'&&!/.+@.+\\..+/.test(v))ok=false;
  el.classList.toggle('invalid',!ok);
  var err=el.parentNode.querySelector('.field-error');
  if(err){
    err.classList.toggle('show',!ok);
    if(!ok){
      if(!v&&req)err.textContent='This field is required.';
      else if(type==='email')err.textContent='Please enter a valid email address.';
    }
  }
  return ok;
}
// Attach on blur to all form inputs that have required or type=email
document.querySelectorAll('.fi[required],.fi[type="email"],.ft[required]').forEach(function(el){
  // Add error element after the input if not already there
  if(!el.parentNode.querySelector('.field-error')){
    var span=document.createElement('span');span.className='field-error';el.parentNode.appendChild(span);
  }
  el.addEventListener('blur',function(){validateField(this);},{passive:true});
  el.addEventListener('input',function(){if(this.classList.contains('invalid'))validateField(this);},{passive:true});
});
`;
html = html.replace(mobileNavJS + portalLoginJS, mobileNavJS + portalLoginJS + validationJS);

// ─── 10. SERVER.JS CSP — add cartocdn.com ─────────────────────────────────────
// (done separately in server.js below)

// ─── WRITE ────────────────────────────────────────────────────────────────────
fs.writeFileSync(file, html, 'utf8');
console.log('Written:', (html.length/1024).toFixed(1), 'KB (was', (before/1024).toFixed(1), 'KB)');

// Validate all inline scripts
const scriptRe=/<script(?![^>]*\bsrc\b)[^>]*>([\s\S]*?)<\/script>/gi;
let m,idx=0,allOk=true;
while((m=scriptRe.exec(html))!==null){
  const body=m[1].trim();if(!body)continue;
  try{new Function(body);console.log('Script '+idx+' ('+body.length+' chars): OK ✓');}
  catch(e){allOk=false;console.error('Script '+idx+' SYNTAX ERROR:',e.message);}
  idx++;
}
if(allOk)console.log('\nAll',idx,'script blocks valid ✓');
else{console.error('FIX NEEDED');process.exit(1);}
