'use strict';
const fs = require('fs');
const file = 'C:/Users/clare/Claude/vision-performance/public/index.html';
let f = fs.readFileSync(file, 'utf8');

// ── 1. EXTRACT logo <img> src from the nav-logo div ──────────────────────────
const logoMatch = f.match(/<a[^>]*class="nav-logo"[^>]*>[\s\S]*?(<img[^>]*src="data:[^"]*"[^>]*>)/);
if (!logoMatch) { console.error('Logo img not found!'); process.exit(1); }
// Build a small version for the sticky bar (height 36px, no hover effects)
const logoImgTag = logoMatch[1]
  .replace(/style="[^"]*"/, '')
  .replace(/height="[^"]*"/, '')
  .replace(/>$/, ' style="height:36px;width:auto;display:block;border-radius:0 !important;object-fit:contain;">');

console.log('Logo img extracted, length:', logoImgTag.length);

// ── 2. REPLACE sticky bar text+sub with logo img ──────────────────────────────
f = f.replace(
  `<div class="sticky-bar-left">
    <div>
      <div class="sticky-bar-text">🛡️ Vision Performance Inc.</div>
      <div class="sticky-bar-sub">CSA-certified · Vision-Care-Specified · Alberta-wide</div>
    </div>`,
  `<div class="sticky-bar-left">
    <div>
      ${logoImgTag}
    </div>`
);

// Verify it changed
if (!f.includes('sticky-bar-sub')) {
  console.log('✓ Sticky bar: logo inserted, sub-line removed');
} else {
  console.log('✗ Sticky bar replacement may have failed');
}

// ── 3. REMOVE all "CSA-certified", "Vision-Care-Specified", "Alberta-wide" ───

// Hero tag line: "Vision-Care-Specified Eyewear · Alberta"
f = f.replace(
  '<div class="hero-tag"><span class="hero-dot" aria-hidden="true"></span>Vision-Care-Specified Eyewear · Alberta</div>',
  ''
);

// SVG text in hero graphic
f = f.replace(
  '<text x="240" y="300" text-anchor="middle" font-family="Outfit,sans-serif" font-size="14" font-weight="700" letter-spacing="2.5" fill="#94A3B8">CSA Z94.3 · VISION-CARE-SPECIFIED</text>',
  ''
);

// Hero stat: Alberta Province-Wide → replace with something meaningful
f = f.replace(
  '<div class="hero-stat"><div class="hero-stat-num">Alberta</div><div class="hero-stat-label">Province-Wide</div></div>',
  '<div class="hero-stat"><div class="hero-stat-num">Alberta</div><div class="hero-stat-label">Serving</div></div>'
);

// Path card descriptions using "vision-care-specified"
f = f.replace(/[Vv]ision-care-specified/g, 'professional');
f = f.replace(/[Vv]ision-Care-Specified/g, 'Professional');
f = f.replace(/[Cc]SA-certified/g, 'safety-certified');

// Meta description cleanup
f = f.replace('Vision-care-specified prescription safety eyewear, mobile optometry clinics &amp; corporate vision programs serving industrial professionals across Alberta, Canada.', 'Premium prescription safety eyewear, mobile optometry clinics &amp; corporate vision programs for industrial professionals across Alberta, Canada.');
f = f.replace('Vision-care-specified prescription safety eyewear, mobile optometry clinics & corporate vision programs serving industrial professionals across Alberta, Canada.', 'Premium prescription safety eyewear, mobile optometry clinics & corporate vision programs for industrial professionals across Alberta, Canada.');

// Alberta-wide occurrences
f = f.replace(/Alberta-wide/gi, 'across Alberta');

fs.writeFileSync(file, f, 'utf8');
console.log('Written. File size:', (f.length/1024).toFixed(1), 'KB');

// Verify
const checks = [
  ['sticky-bar-sub gone', !f.includes('sticky-bar-sub')],
  ['CSA-certified gone (bar)', !f.includes('CSA-certified · Vision')],
  ['vision-care-specified gone', !f.includes('vision-care-specified')],
  ['Vision-Care-Specified gone', !f.includes('Vision-Care-Specified')],
  ['Alberta-wide gone', !f.includes('Alberta-wide')],
];
checks.forEach(([l,v]) => console.log((v?'✓':'✗'), l));
