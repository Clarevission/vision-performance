'use strict';
const fs = require('fs');
const file = 'C:/Users/clare/Claude/vision-performance/public/index.html';
let f = fs.readFileSync(file, 'utf8');

const before = f.length;

// Replace the re-embedded base64 img in the sticky bar with a clean file reference.
// The base64 img is inside: <div class="sticky-bar-left"><div><img src="data:image/...">
// We replace just the sticky-bar-left > div > img

f = f.replace(
  /<div class="sticky-bar-left">\s*<div>\s*<img[^>]*src="data:image[^"]*"[^>]*>\s*<\/div>/,
  `<div class="sticky-bar-left">
    <div>
      <img src="/images/logo-nav.png" alt="Vision Performance Inc." loading="eager" style="height:38px;width:auto;display:block;border-radius:0 !important;object-fit:contain;filter:brightness(0) invert(1);">
    </div>`
);

const after = f.length;
console.log('Size before:', (before/1024).toFixed(1), 'KB');
console.log('Size after:', (after/1024).toFixed(1), 'KB');
console.log('Savings:', ((before-after)/1024).toFixed(1), 'KB');

fs.writeFileSync(file, f, 'utf8');

// Verify
const hasBase64InBar = /sticky-bar-left[\s\S]{0,50}data:image/.test(f);
const hasFileRef = f.includes('/images/logo-nav.png');
console.log('✓ Base64 removed from sticky bar:', !hasBase64InBar);
console.log('✓ File ref added:', hasFileRef);
