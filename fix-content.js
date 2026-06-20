'use strict';
const fs = require('fs');
const file = 'C:/Users/clare/Claude/vision-performance/public/index.html';
let f = fs.readFileSync(file, 'utf8');
const before = f.length;

// ── 1. HERO STATS — replace all 4 inaccurate stats ───────────────────────────
f = f.replace(
  /<div class="hero-stat" data-placeholder="client-count"><div class="hero-stat-num">Dual<\/div>[\s\S]*?<div class="hero-stat-label">Discipline Specified<\/div>\s*<\/div>/,
  '<div class="hero-stat"><div class="hero-stat-num">Licensed</div><div class="hero-stat-label">Optometrists</div></div>'
);
f = f.replace(
  /<div class="hero-stat" data-placeholder="years"><div class="hero-stat-num">1&nbsp;Day<\/div>[\s\S]*?<div class="hero-stat-label">Response Time<\/div>\s*<\/div>/,
  '<div class="hero-stat"><div class="hero-stat-num">Alberta</div><div class="hero-stat-label">Province-Wide</div></div>'
);
f = f.replace(
  /<div class="hero-stat"><div class="hero-stat-num">CSA<\/div>[\s\S]*?<div class="hero-stat-label">Z94.3 Certified<\/div>\s*<\/div>/,
  '<div class="hero-stat"><div class="hero-stat-num">6</div><div class="hero-stat-label">Industries Served</div></div>'
);
f = f.replace(
  /<div class="hero-stat" data-placeholder="satisfaction"><div class="hero-stat-num">WCB<\/div>[\s\S]*?<div class="hero-stat-label">Alberta Partner<\/div>\s*<\/div>/,
  '<div class="hero-stat"><div class="hero-stat-num">On-Site</div><div class="hero-stat-label">Delivery</div></div>'
);

// ── 2. HERO TRUST CHIPS ───────────────────────────────────────────────────────
f = f.replace('<div class="sp-chip"><div class="sp-chip-dot"></div>CSA Z94.3 Certified</div>', '');
f = f.replace('<div class="sp-chip"><div class="sp-chip-dot"></div>WCB Alberta Partner</div>', '');
f = f.replace('<div class="sp-chip"><div class="sp-chip-dot"></div>Dual-Discipline Specified</div>', '');

// ── 3. METRICS BAND ───────────────────────────────────────────────────────────
f = f.replace(
  '<div class="metric-item reveal"><div class="metric-ico" aria-hidden="true">🏥</div><div><div class="metric-num">Dual-Discipline</div><div class="metric-lbl">Vision Care + OH&amp;S</div></div></div>',
  '<div class="metric-item reveal"><div class="metric-ico" aria-hidden="true">👁️</div><div><div class="metric-num">Licensed</div><div class="metric-lbl">Optometrists</div></div></div>'
);
f = f.replace(
  'metric-lbl">Safety Compliant</div>',
  'metric-lbl">Compliant Eyewear</div>'
);

// ── 4. FOOTER CERTS ───────────────────────────────────────────────────────────
f = f.replace('<span class="footer-cert">WCB Partner</span>', '');
f = f.replace('<span class="footer-cert">Dual-Discipline</span>', '');

// ── 5. COMPLIANCE DOCUMENTATION → PROGRAM RECORDS ────────────────────────────
f = f.replace(/compliance documentation/g, 'program records');
f = f.replace(/Compliance Documentation/g, 'Program Records');
f = f.replace(/compliance reporting/g, 'program reporting');
f = f.replace(/Full regulatory reporting/g, 'Complete eyewear records');
f = f.replace(/full regulatory reporting/g, 'complete eyewear records');

// ── 6. CSA CERTIFICATES + WCB REPORTS (portal) ───────────────────────────────
f = f.replace(
  'Download CSA compliance certificates, WCB reports, and safety documentation for any employee or date range.',
  'Download eyewear records, prescription summaries, and service documentation for any employee or date range.'
);

// ── 7. WCB PARTNERSHIP CLAIMS ─────────────────────────────────────────────────
f = f.replace(/WCB Alberta service provider/g, 'Alberta workplace vision specialist');
f = f.replace('Meet WCB and OH&S requirements on-site.', 'Supports your WCB and OH&S eyewear requirements on-site.');
f = f.replace('Meet WCB and OH&S on-site.', 'Supports WCB and OH&S eyewear requirements.');
f = f.replace('maintaining WCB Alberta compliance', 'supporting your Alberta workplace requirements');

// ── 8. B2B HERO REWORD ────────────────────────────────────────────────────────
f = f.replace('<span class="thin">Compliance. Performance.</span>', '<span class="thin">Protection. Performance.</span>');

// ── 9. PRODUCT BADGE ─────────────────────────────────────────────────────────
f = f.replace(/'CSA Certified'/g, "'CSA Z94.3'");

// ── 10. META DESCRIPTION ─────────────────────────────────────────────────────
f = f.replace(' CSA Z94.3 certified.', '');

// ── 11. DUAL DISCIPLINE MENTIONS ─────────────────────────────────────────────
f = f.replace(/Dual-Discipline Specification/g, 'Vision Performance Program');
f = f.replace(/dual-discipline vision performance company/g, 'vision-care company');
f = f.replace(/a dual-discipline/g, 'a specialized vision-care');
f = f.replace(/Dual-Discipline/g, 'Vision Care');

// ── WRITE ─────────────────────────────────────────────────────────────────────
fs.writeFileSync(file, f, 'utf8');
console.log('Written: ' + (f.length/1024).toFixed(1) + ' KB (was ' + (before/1024).toFixed(1) + ' KB)');

var checks = [
  ['CSA Z94.3 Certified chip GONE', !f.includes('sp-chip-dot"></div>CSA Z94.3 Certified')],
  ['WCB Alberta Partner chip GONE', !f.includes('sp-chip-dot"></div>WCB Alberta Partner')],
  ['Dual-Discipline chip GONE', !f.includes('sp-chip-dot"></div>Dual-Discipline Specified')],
  ['Hero stat Dual GONE', !f.includes('hero-stat-num">Dual<')],
  ['Hero stat 1 Day GONE', !f.includes('1 Day')],
  ['Hero stat WCB GONE', !f.includes('hero-stat-num">WCB<')],
  ['Footer WCB Partner GONE', !f.includes('footer-cert">WCB Partner')],
  ['Footer Dual-Discipline GONE', !f.includes('footer-cert">Dual-Discipline')],
  ['compliance documentation GONE', !f.includes('compliance documentation')],
  ['Licensed Optometrists in stats', f.includes('Optometrists</div></div>')],
  ['Province-Wide in stats', f.includes('Province-Wide</div></div>')],
  ['Compliant Eyewear (not Certified)', f.includes('Compliant Eyewear')],
];
checks.forEach(function(c){ console.log((c[1]?'✓':'✗') + ' ' + c[0]); });
