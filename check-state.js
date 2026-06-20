const fs = require('fs');
const f = fs.readFileSync('public/index.html', 'utf8');

// Count navs
const navCount = (f.match(/<nav[\s>]/g)||[]).length;
console.log('Nav elements:', navCount);

// Count vp-logo-text instances in HTML (not CSS)
const bodyStart = f.indexOf('<body>');
const body = f.slice(bodyStart);
const logoInstances = (body.match(/vp-logo-text/g)||[]).length;
console.log('vp-logo-text in body:', logoInstances);

// Show sticky bar content
const sbIdx = body.indexOf('id="stickyBar"');
console.log('\nSticky bar at body char:', sbIdx);
if (sbIdx >= 0) console.log(body.slice(sbIdx, sbIdx+400));

// Check for duplicate nav-logo
const navLogoCount = (body.match(/class="nav-logo"/g)||[]).length;
console.log('\nnav-logo instances in body:', navLogoCount);
