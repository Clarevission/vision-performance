const fs = require('fs');
const f = fs.readFileSync('public/index.html', 'utf8');
const idx = f.indexOf('id="stickyBar"');
const chunk = f.slice(idx, idx + 800);
// Collapse base64 for readability
const clean = chunk.replace(/base64,[A-Za-z0-9+/=]+"/g, 'base64,..."');
console.log(clean.substring(0, 600));
