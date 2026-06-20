const fs = require('fs');
let f = fs.readFileSync('public/index.html', 'utf8');

// 1. Update VP Logo CSS to match reference image (INC. at right end of the line)
const oldLogoCSS = `/* ── VP Text Logo ── */
.vp-logo-text{display:flex;flex-direction:column;gap:0;line-height:1;cursor:pointer;transition:opacity 0.2s}
.vp-logo-text:hover{opacity:0.85}
.vp-logo-vision{font-family:'Barlow Condensed','Montserrat',sans-serif;font-size:30px;font-weight:800;color:#FFFFFF;letter-spacing:0.01em;line-height:0.95;display:block;text-transform:uppercase}
.vp-logo-line{width:100%;height:2px;background:#00D8E8;margin:4px 0 3px;display:block}
.vp-logo-perf-row{display:flex;align-items:flex-start;gap:0;line-height:1}
.vp-logo-perf{font-family:'Barlow Condensed','Montserrat',sans-serif;font-size:16px;font-weight:600;color:#8A9EBA;letter-spacing:0.1em;line-height:1;text-transform:uppercase}
.vp-logo-inc{font-family:'Barlow Condensed','Outfit',sans-serif;font-size:8px;font-weight:700;color:#F97316;letter-spacing:0.06em;line-height:1;vertical-align:top;margin-top:0;margin-left:2px;display:inline-block;padding-top:0px}
nav.scrolled .vp-logo-vision{font-size:25px}
nav.scrolled .vp-logo-perf{font-size:13px}
nav.scrolled .vp-logo-inc{font-size:7px}
.sticky-bar .vp-logo-vision{font-size:22px}
.sticky-bar .vp-logo-line{height:1.5px;margin:3px 0 2px}
.sticky-bar .vp-logo-perf{font-size:12px}
.sticky-bar .vp-logo-inc{font-size:6px}`;

const newLogoCSS = `/* ── VP Text Logo ── */
.vp-logo-text{display:flex;flex-direction:column;gap:0;line-height:1;cursor:pointer;transition:opacity 0.2s;min-width:120px}
.vp-logo-text:hover{opacity:0.85}
.vp-logo-vision{font-family:'Barlow Condensed','Montserrat',sans-serif;font-size:30px;font-weight:800;color:#FFFFFF;letter-spacing:0.01em;line-height:0.95;display:block;text-transform:uppercase}
.vp-logo-line-row{display:flex;align-items:center;width:100%;margin:3px 0 2px}
.vp-logo-line{flex:1;height:2px;background:#00D8E8;display:block}
.vp-logo-inc{font-family:'Barlow Condensed','Outfit',sans-serif;font-size:8px;font-weight:700;color:#F97316;letter-spacing:0.05em;line-height:1;margin-left:2px;display:inline-block;transform:translateY(-3px)}
.vp-logo-perf{font-family:'Barlow Condensed','Montserrat',sans-serif;font-size:16px;font-weight:600;color:#8A9EBA;letter-spacing:0.1em;line-height:1;text-transform:uppercase;display:block}
nav.scrolled .vp-logo-vision{font-size:25px}
nav.scrolled .vp-logo-perf{font-size:13px}
nav.scrolled .vp-logo-inc{font-size:7px}
.sticky-bar .vp-logo-vision{font-size:22px}
.sticky-bar .vp-logo-line-row{margin:2px 0 1px}
.sticky-bar .vp-logo-perf{font-size:12px}
.sticky-bar .vp-logo-inc{font-size:6px}`;

if (f.includes(oldLogoCSS)) {
  f = f.replace(oldLogoCSS, newLogoCSS);
  console.log('✓ Logo CSS updated');
} else {
  console.log('✗ Logo CSS not found - trying partial match');
  // Try to find and replace just the key parts
  f = f.replace('.vp-logo-perf-row{display:flex;align-items:flex-start;gap:0;line-height:1}', '.vp-logo-line-row{display:flex;align-items:center;width:100%;margin:3px 0 2px}');
  f = f.replace('.vp-logo-perf{font-family:\'Barlow Condensed\',\'Montserrat\',sans-serif;font-size:16px;font-weight:600;color:#8A9EBA;letter-spacing:0.1em;line-height:1;text-transform:uppercase}', '.vp-logo-line{flex:1;height:2px;background:#00D8E8;display:block}\n.vp-logo-perf{font-family:\'Barlow Condensed\',\'Montserrat\',sans-serif;font-size:16px;font-weight:600;color:#8A9EBA;letter-spacing:0.1em;line-height:1;text-transform:uppercase;display:block}');
  console.log('Applied partial CSS changes');
}

// 2. The new logo HTML structure (INC. at end of line, PERFORMANCE below)
const newLogoHTML = `<div class="vp-logo-text"><span class="vp-logo-vision">VISION</span><div class="vp-logo-line-row"><span class="vp-logo-line"></span><span class="vp-logo-inc">INC.</span></div><span class="vp-logo-perf">PERFORMANCE</span></div>`;

// 3. Update sticky bar logo HTML (current structure has perf-row)
const oldStickyLogo = `<div class="vp-logo-text"><span class="vp-logo-vision">VISION</span><span class="vp-logo-line"></span><div class="vp-logo-perf-row"><span class="vp-logo-perf">PERFORMANCE</span><span class="vp-logo-inc">INC.</span></div></div>`;
if (f.includes(oldStickyLogo)) {
  f = f.replace(oldStickyLogo, newLogoHTML);
  console.log('✓ Sticky bar logo updated');
} else {
  console.log('✗ Sticky bar logo not found with expected pattern');
}

// 4. Insert nav HTML after the skip-link
const navHTML = `
<nav id="mainNav">
  <a class="nav-logo" onclick="navigate('home')">
    ${newLogoHTML}
  </a>
  <ul class="nav-links">
    <li><a onclick="navigate('home')" class="nav-active">Home</a></li>
    <li>
      <a onclick="navigate('shop')">Eyewear <span class="nav-chevron">▾</span></a>
      <div class="nav-dropdown">
        <a onclick="navigate('shop')"><div class="dd-icon">👓</div>All Eyewear</a>
        <a onclick="navigate('shop','Professional Performance')"><div class="dd-icon">💼</div>Professional</a>
        <a onclick="navigate('shop','Digital Eye Performance')"><div class="dd-icon">💻</div>Digital</a>
        <a onclick="navigate('shop','Industrial Prescription Safety')"><div class="dd-icon">🦺</div>Industrial</a>
        <a onclick="navigate('shop','Lunettes Signature')"><div class="dd-icon">✨</div>Lunettes</a>
      </div>
    </li>
    <li><a onclick="navigate('industrial')">Corporate</a></li>
    <li><a onclick="navigate('mobile')">Mobile Clinic</a></li>
    <li><a onclick="navigate('about')">About</a></li>
    <li><a onclick="navigate('contact')">Contact</a></li>
  </ul>
  <div class="nav-right">
    <a class="nav-phone-link" href="tel:+17804000000">📞 (780) 400-0000</a>
    <button class="nav-portal-btn" onclick="navigate('portal')">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6" cy="4.5" r="2"/><path d="M2 10c0-2.2 1.8-4 4-4s4 1.8 4 4"/></svg>
      Client Portal
    </button>
    <button class="nav-book-btn" onclick="navigate('book')">Book Exam</button>
    <button class="nav-cart-btn" onclick="toggleCart()" aria-label="Cart">🛒<span class="cart-badge" id="cartBadge">0</span></button>
    <button class="nav-hamburger" id="navHamburger" onclick="toggleMobileDrawer()" aria-label="Menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
<div class="mobile-drawer-overlay" id="mobileDrawerOverlay" onclick="closeMobileDrawer()"></div>
<div class="mobile-drawer" id="mobileDrawer" aria-hidden="true">
  <button class="mobile-drawer-close" onclick="closeMobileDrawer()">✕</button>
  <div class="mob-nav-section">Navigation</div>
  <button class="mob-nav-link active" onclick="navigate('home');closeMobileDrawer()"><div class="mob-icon">🏠</div>Home</button>
  <button class="mob-nav-link" onclick="navigate('shop');closeMobileDrawer()"><div class="mob-icon">👓</div>Shop Eyewear</button>
  <button class="mob-nav-link" onclick="navigate('industrial');closeMobileDrawer()"><div class="mob-icon">🦺</div>Corporate Vision</button>
  <button class="mob-nav-link" onclick="navigate('mobile');closeMobileDrawer()"><div class="mob-icon">🚐</div>Mobile Clinic</button>
  <button class="mob-nav-link" onclick="navigate('about');closeMobileDrawer()"><div class="mob-icon">🏢</div>About</button>
  <button class="mob-nav-link" onclick="navigate('contact');closeMobileDrawer()"><div class="mob-icon">📞</div>Contact</button>
  <div class="mob-nav-divider"></div>
  <div class="mob-cta-wrap">
    <button class="btn btn-orange btn-arrow" onclick="navigate('book');closeMobileDrawer()">Book Exam</button>
    <button class="btn btn-outline-white" onclick="navigate('portal');closeMobileDrawer()">Client Portal</button>
  </div>
</div>`;

const skipLink = `<a class="skip-link" href="#main">Skip to main content</a>`;
if (f.includes(skipLink)) {
  f = f.replace(skipLink, skipLink + '\n' + navHTML);
  console.log('✓ Nav HTML inserted');
} else {
  console.log('✗ Skip link not found');
}

// 5. Add mobile drawer JS functions near the end of the main script block
const mobileDrawerJS = `
function toggleMobileDrawer(){
  const d=document.getElementById('mobileDrawer');
  const o=document.getElementById('mobileDrawerOverlay');
  const h=document.getElementById('navHamburger');
  const isOpen=d.classList.contains('open');
  d.classList.toggle('open');o.classList.toggle('open');h.classList.toggle('open');
  h.setAttribute('aria-expanded',!isOpen);
  d.setAttribute('aria-hidden',isOpen);
}
function closeMobileDrawer(){
  document.getElementById('mobileDrawer').classList.remove('open');
  document.getElementById('mobileDrawerOverlay').classList.remove('open');
  const h=document.getElementById('navHamburger');
  if(h){h.classList.remove('open');h.setAttribute('aria-expanded','false');}
}`;

// Add before the closing of navigate function area - find a good insertion point
if (!f.includes('function toggleMobileDrawer')) {
  const navigateFn = 'function navigate(page,collection=null){';
  if (f.includes(navigateFn)) {
    f = f.replace(navigateFn, mobileDrawerJS + '\n' + navigateFn);
    console.log('✓ Mobile drawer JS added');
  }
}

// 6. Add nav scroll behavior - update the navigate() function to update nav-active
// Find navigate function and add nav highlighting after it sets active page
const navActiveUpdate = `
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('nav-active'));
  document.querySelectorAll('.mob-nav-link').forEach(a=>a.classList.remove('active'));`;

// This already exists in navigate(), no need to add

// 7. Add scroll behavior for nav (adds 'scrolled' class on scroll)
const scrollNavJS = `
window.addEventListener('scroll',()=>{
  const n=document.getElementById('mainNav');
  if(n)n.classList.toggle('scrolled',window.scrollY>50);
},{passive:true});`;

if (!f.includes('mainNav') || !f.includes("classList.toggle('scrolled'")) {
  const navigateFn = 'function navigate(page,collection=null){';
  if (f.includes(navigateFn)) {
    f = f.replace(navigateFn, scrollNavJS + '\n' + navigateFn);
    console.log('✓ Nav scroll behavior added');
  }
}

fs.writeFileSync('public/index.html', f);
console.log('\nDone! File saved.');
