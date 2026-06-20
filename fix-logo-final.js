'use strict';
const fs = require('fs');
const file = 'C:/Users/clare/Claude/vision-performance/public/index.html';
let f = fs.readFileSync(file, 'utf8');

// ── 1. Add Barlow Condensed to Google Fonts import ────────────────────────────
f = f.replace(
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap',
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap'
);

// ── 2. Replace vp-logo CSS with exact-match version ───────────────────────────
const oldCSS = /\/\* ── VP Text Logo ── \*\/[\s\S]*?\.sticky-bar \.vp-logo-perf\{font-size:11px\}/;
const newCSS = `/* ── VP Text Logo ── */
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

f = f.replace(oldCSS, newCSS);

// ── 3. New logo HTML: PERFORMANCE + INC. superscript on same row ──────────────
const newLogoHTML = `<div class="vp-logo-text"><span class="vp-logo-vision">VISION</span><span class="vp-logo-line"></span><div class="vp-logo-perf-row"><span class="vp-logo-perf">PERFORMANCE</span><span class="vp-logo-inc">INC.</span></div></div>`;

// Replace ALL instances of the old logo HTML
const oldLogoHTML = /<div class="vp-logo-text">[\s\S]*?<\/div><\/div>/g;
let count = 0;
f = f.replace(oldLogoHTML, () => { count++; return newLogoHTML; });
console.log(`Replaced ${count} logo instances`);

fs.writeFileSync(file, f, 'utf8');
console.log('Done. File size:', (f.length/1024).toFixed(1), 'KB');

const checks = [
  ['Barlow Condensed loaded', f.includes('Barlow+Condensed')],
  ['PERFORMANCE row exists', f.includes('vp-logo-perf-row')],
  ['INC. as inline span', f.includes('vp-logo-inc">INC.')],
  ['Cyan line #00D8E8', f.includes('#00D8E8')],
];
checks.forEach(([l,v]) => console.log((v?'✓':'✗'), l));
