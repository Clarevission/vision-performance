const fs = require('fs');
let f = fs.readFileSync('public/index.html', 'utf8');

// ── Remove the VP CSS logo block I added ────────────────────────────────────
const cssMark = '\n/* ═══════════════════════════════════════\n   VP BRAND LOGO — exact reference match\n═══════════════════════════════════════ */';
const cssEnd = '.footer-logo-wrap .vp-logo .vpl-p{font-size:13px}\n';
const cssStart = f.indexOf(cssMark);
const cssFinish = f.indexOf(cssEnd);
if (cssStart >= 0 && cssFinish >= 0) {
  f = f.slice(0, cssStart) + f.slice(cssFinish + cssEnd.length);
  console.log('✓ VP CSS logo block removed');
} else {
  console.log('CSS block bounds:', cssStart, cssFinish);
}

// ── Replace all vp-logo HTML with the PNG img ───────────────────────────────
// Nav logo — the PNG at nav size
const NAV_IMG = `<img src="/images/logo-nav.png" alt="Vision Performance Inc." style="height:52px;width:auto;display:block;object-fit:contain;">`;

// Sticky bar — smaller
const STICKY_IMG = `<img src="/images/logo-nav.png" alt="Vision Performance Inc." style="height:38px;width:auto;display:block;object-fit:contain;">`;

// Footer — medium
const FOOTER_IMG = `<img src="/images/logo-nav.png" alt="Vision Performance Inc." style="height:44px;width:auto;display:block;object-fit:contain;">`;

// Count and replace all vp-logo instances
// Index 0 (sticky bar — parent is sticky-bar-left)
// Index 1 (nav — parent is nav-logo a tag)
// Index 2+ (footer)

// Replace nav logo (inside <a class="nav-logo">)
const navRe = /(<a[^>]*class="nav-logo"[^>]*>)\s*<div class="vp-logo">[\s\S]*?<\/div>\s*(<\/a>)/;
if (navRe.test(f)) {
  f = f.replace(navRe, `$1\n    ${NAV_IMG}\n  $2`);
  console.log('✓ Nav logo → PNG');
} else {
  console.log('✗ Nav logo vp-logo not found');
}

// Replace sticky bar logo (vp-logo that's NOT inside nav-logo or footer-logo-wrap)
// It's inside sticky-bar-left > div
const stickyRe = /(<div class="sticky-bar-left">[\s\S]*?<div>\s*)<div class="vp-logo">[\s\S]*?<\/div>(\s*<\/div>)/;
if (stickyRe.test(f)) {
  f = f.replace(stickyRe, `$1${STICKY_IMG}$2`);
  console.log('✓ Sticky bar logo → PNG');
} else {
  console.log('✗ Sticky bar vp-logo not found');
}

// Replace footer logo (inside footer-logo-wrap)
const footerRe = /(<div class="footer-logo-wrap">)\s*<div class="vp-logo">[\s\S]*?<\/div>\s*(<\/div>)/;
if (footerRe.test(f)) {
  f = f.replace(footerRe, `$1${FOOTER_IMG}$2`);
  console.log('✓ Footer logo → PNG');
} else {
  console.log('✗ Footer vp-logo not found');
}

// ── Also remove Barlow Condensed from fonts if it was added ─────────────────
f = f.replace('Barlow+Condensed:wght@600;700;800&family=', '');
f = f.replace(/family=Barlow\+Condensed:[^&"]*[&"]/g, '"');

// ── Verify ──────────────────────────────────────────────────────────────────
console.log('\nVerification:');
console.log('vp-logo remaining:', (f.match(/class="vp-logo"/g)||[]).length);
console.log('logo-nav.png references:', (f.match(/logo-nav\.png/g)||[]).length);
console.log('File size:', (f.length/1024).toFixed(1), 'KB');

fs.writeFileSync('public/index.html', f);
console.log('\nDone!');
