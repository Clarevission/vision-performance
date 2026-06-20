'use strict';
const fs = require('fs');
const file = 'C:/Users/clare/Claude/vision-performance/public/index.html';
let f = fs.readFileSync(file, 'utf8');

// ── 1. ADD CSS for the new text logo ─────────────────────────────────────────
const logoCSS = `
/* ── VP Text Logo ── */
.vp-logo-text{display:flex;flex-direction:column;gap:0;line-height:1;transition:opacity 0.2s}
.vp-logo-text:hover{opacity:0.85}
.vp-logo-vision{font-family:'Outfit',sans-serif;font-size:24px;font-weight:900;color:#FFFFFF;letter-spacing:0.06em;line-height:1;display:block}
.vp-logo-line-row{display:flex;align-items:center;gap:4px;margin:3px 0 2px}
.vp-logo-line{flex:1;height:1.5px;background:linear-gradient(to right,#2E6EA6,#5A9CC0)}
.vp-logo-inc{font-family:'Outfit',sans-serif;font-size:7.5px;font-weight:800;color:#F97316;letter-spacing:0.08em;line-height:1;white-space:nowrap}
.vp-logo-perf{font-family:'Outfit',sans-serif;font-size:13px;font-weight:700;color:#8BA8C4;letter-spacing:0.22em;line-height:1;display:block}
nav.scrolled .vp-logo-vision{font-size:20px}
nav.scrolled .vp-logo-perf{font-size:11px}
.sticky-bar .vp-logo-text{opacity:1}
.sticky-bar .vp-logo-vision{font-size:20px}
.sticky-bar .vp-logo-perf{font-size:11px}
`;

// Insert CSS before </style>
f = f.replace('</style>', logoCSS + '</style>');

// ── 2. HTML for the logo ──────────────────────────────────────────────────────
const logoHTML = `<div class="vp-logo-text"><span class="vp-logo-vision">VISION</span><div class="vp-logo-line-row"><div class="vp-logo-line"></div><span class="vp-logo-inc">INC.</span></div><span class="vp-logo-perf">PERFORMANCE</span></div>`;

// ── 3. REPLACE nav logo img with text logo ────────────────────────────────────
// The nav logo is: <a class="nav-logo" ...><img src="data:image/png;base64,..."></a>
f = f.replace(
  /<a([^>]*class="nav-logo"[^>]*)>\s*<img[^>]*src="data:image[^"]*"[^>]*>\s*<\/a>/,
  `<a$1>${logoHTML}</a>`
);

// ── 4. REPLACE sticky bar logo img with text logo ─────────────────────────────
// The sticky bar has: <img src="/images/logo-nav.png" ...>
f = f.replace(
  /<img[^>]*src="\/images\/logo-nav\.png"[^>]*>/,
  logoHTML
);

fs.writeFileSync(file, f, 'utf8');
console.log('Logo replaced with HTML/CSS text version');
console.log('File size:', (f.length/1024).toFixed(1), 'KB');

const checks = [
  ['nav logo img gone', !/<a[^>]*nav-logo[^>]*>\s*<img/.test(f)],
  ['sticky bar img gone', !f.includes('/images/logo-nav.png')],
  ['vp-logo-text exists in nav', f.includes('nav-logo')&&f.includes('vp-logo-text')],
  ['INC. on line-row', f.includes('vp-logo-line-row')],
];
checks.forEach(([l,v]) => console.log((v?'✓':'✗'), l));
