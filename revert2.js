const fs = require('fs');
let f = fs.readFileSync('public/index.html', 'utf8');

// Check what's left
const bodyStart = f.indexOf('<body>');
const body = f.slice(bodyStart);

// Find mobile drawer overlay
const mdoIdx = body.indexOf('mobile-drawer-overlay');
console.log('mobile-drawer-overlay at body char:', mdoIdx);
if (mdoIdx >= 0) console.log(body.slice(Math.max(0,mdoIdx-5), mdoIdx+200));

// Find vp-logo in body
const vpIdx = body.indexOf('vp-logo');
console.log('\nvp-logo in body at char:', vpIdx);
if (vpIdx >= 0) console.log(body.slice(Math.max(0,vpIdx-20), vpIdx+200));

// Check nav
console.log('\nNav in body:', body.indexOf('<nav') >= 0 ? 'yes' : 'no');
