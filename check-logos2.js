const fs = require('fs');
const f = fs.readFileSync('public/index.html', 'utf8');

// Check nav logo area
const navIdx = f.indexOf('nav-logo');
console.log('NAV LOGO area:');
console.log(f.slice(navIdx, navIdx + 300));

console.log('\n\nSTICKY BAR area:');
const barIdx = f.indexOf('stickyBar');
console.log(f.slice(barIdx, barIdx + 400));
