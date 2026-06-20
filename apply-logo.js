const fs = require('fs');
let f = fs.readFileSync('public/index.html', 'utf8');

// ── THE LOGO HTML (exact match to reference image) ──────────────────────────
// Structure: VISION / [cyan line][INC. at right, above line] / PERFORMANCE
const LOGO_HTML = `<div class="vp-logo"><span class="vpl-v">VISION</span><div class="vpl-mid"><span class="vpl-line"></span><span class="vpl-inc">INC.</span></div><span class="vpl-p">PERFORMANCE</span></div>`;

// ── CSS to add (exact logo replication) ─────────────────────────────────────
const LOGO_CSS = `
/* ═══════════════════════════════════════
   VP BRAND LOGO — exact reference match
═══════════════════════════════════════ */
.vp-logo{display:inline-flex;flex-direction:column;gap:0;line-height:1;cursor:pointer;transition:opacity 0.2s;text-decoration:none}
.vp-logo:hover{opacity:0.85}
.vpl-v{font-family:'Barlow Condensed','Impact',sans-serif;font-size:30px;font-weight:800;color:#fff;letter-spacing:0.01em;line-height:0.92;text-transform:uppercase;display:block}
.vpl-mid{display:flex;align-items:flex-end;width:100%;margin:4px 0 2px;height:13px}
.vpl-line{flex:1;height:2px;background:#00D8E8;align-self:flex-end;display:block}
.vpl-inc{font-family:'Barlow Condensed','Arial Narrow',sans-serif;font-size:9px;font-weight:700;color:#F97316;letter-spacing:0.07em;line-height:1;margin-left:2px;display:block;align-self:flex-end;padding-bottom:2px}
.vpl-p{font-family:'Barlow Condensed','Impact',sans-serif;font-size:15px;font-weight:600;color:#8A9EBA;letter-spacing:0.12em;text-transform:uppercase;display:block}

/* Nav-size logo */
nav .vp-logo .vpl-v{font-size:30px}
nav .vp-logo .vpl-p{font-size:15px}
nav.scrolled .vp-logo .vpl-v{font-size:24px}
nav.scrolled .vp-logo .vpl-p{font-size:12px}

/* Sticky bar — slightly smaller */
.sticky-bar .vp-logo .vpl-v{font-size:22px}
.sticky-bar .vp-logo .vpl-mid{height:10px;margin:3px 0 2px}
.sticky-bar .vp-logo .vpl-line{height:1.5px}
.sticky-bar .vp-logo .vpl-inc{font-size:7px}
.sticky-bar .vp-logo .vpl-p{font-size:11px}

/* Footer logo */
.footer-logo-wrap .vp-logo .vpl-v{font-size:26px}
.footer-logo-wrap .vp-logo .vpl-p{font-size:13px}
`;

// ── 1. Add Barlow Condensed font if not present ──────────────────────────────
if (!f.includes('Barlow+Condensed')) {
  // Find existing Google Fonts link
  const gfIdx = f.indexOf('fonts.googleapis.com/css2');
  if (gfIdx >= 0) {
    const linkEnd = f.indexOf('>', gfIdx);
    const linkTag = f.slice(f.lastIndexOf('<link', gfIdx), linkEnd + 1);
    const newLink = linkTag.replace(
      'family=',
      'family=Barlow+Condensed:wght@600;700;800&family='
    );
    f = f.replace(linkTag, newLink);
    console.log('✓ Barlow Condensed added to fonts');
  } else {
    // Add a new link tag before </head>
    f = f.replace('</head>', '<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&display=swap" rel="stylesheet">\n</head>');
    console.log('✓ Barlow Condensed font link added');
  }
} else {
  console.log('✓ Barlow Condensed already present');
}

// ── 2. Inject logo CSS before </style> ──────────────────────────────────────
// Insert before the first </style> tag (main CSS block)
const firstStyleEnd = f.indexOf('</style>');
if (firstStyleEnd >= 0) {
  f = f.slice(0, firstStyleEnd) + LOGO_CSS + '\n' + f.slice(firstStyleEnd);
  console.log('✓ Logo CSS injected');
}

// ── 3. Replace nav logo img with VP logo HTML ────────────────────────────────
// The nav logo img is on line 1030 — a very long base64 line
// Pattern: <img src="data:image/png;base64,..."> inside <a class="nav-logo">
const navLogoRe = /(<a[^>]*class="nav-logo"[^>]*>\s*)<img[^>]*src="data:image\/png;base64,[^"]*"[^>]*>(\s*<\/a>)/;
if (navLogoRe.test(f)) {
  f = f.replace(navLogoRe, `$1${LOGO_HTML}$2`);
  console.log('✓ Nav logo replaced');
} else {
  console.log('✗ Nav logo img not found via regex');
}

// ── 4. Replace sticky bar text+sub with VP logo ──────────────────────────────
const stickyOld = `<div class="sticky-bar-text">🛡️ Vision Performance Inc.</div>
      <div class="sticky-bar-sub">CSA-certified · Vision-Care-Specified · Alberta-wide</div>`;
if (f.includes(stickyOld)) {
  f = f.replace(stickyOld, LOGO_HTML);
  console.log('✓ Sticky bar logo replaced');
} else {
  // Try without the sub line (if already removed)
  const stickyOld2 = '<div class="sticky-bar-text">🛡️ Vision Performance Inc.</div>';
  if (f.includes(stickyOld2)) {
    f = f.replace(stickyOld2, LOGO_HTML);
    console.log('✓ Sticky bar logo replaced (no sub line)');
  } else {
    console.log('✗ Sticky bar text not found');
  }
}

// ── 5. Replace footer logo img+sub with VP logo wrapped in footer-logo-wrap ──
// Footer has: <div><img src="data:image/png;base64,..."><div class="footer-logo-sub">...</div>...</div>
const footerLogoRe = /(<div[^>]*>)\s*<img[^>]*src="data:image\/png;base64,[^"]*"[^>]*>\s*<div class="footer-logo-sub">[^<]*<\/div>/;
if (footerLogoRe.test(f)) {
  f = f.replace(footerLogoRe, `$1<div class="footer-logo-wrap">${LOGO_HTML}</div>`);
  console.log('✓ Footer logo replaced');
} else {
  console.log('✗ Footer logo pattern not found, trying simpler...');
  // Try just replacing the img
  const footerImgRe = /(<div[^>]*>)\s*<img[^>]*src="data:image\/png;base64,[^"]*"[^>]*>/;
  if (footerImgRe.test(f)) {
    f = f.replace(footerImgRe, `$1<div class="footer-logo-wrap">${LOGO_HTML}</div>`);
    console.log('✓ Footer logo img replaced');
  } else {
    console.log('✗ Footer logo img also not found');
  }
}

// ── 6. Verify ────────────────────────────────────────────────────────────────
console.log('\nVerification:');
console.log('vp-logo in HTML:', (f.match(/class="vp-logo"/g)||[]).length, 'instances');
console.log('Barlow Condensed in CSS:', f.includes('Barlow Condensed'));
console.log('File size:', (f.length/1024).toFixed(1), 'KB');

fs.writeFileSync('public/index.html', f);
console.log('\nDone!');
