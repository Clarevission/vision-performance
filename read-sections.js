const fs = require('fs');
const f = fs.readFileSync('public/index.html', 'utf8');
const lines = f.split('\n');

// Show nav logo area (lines 1027-1040)
console.log('=== NAV LOGO (lines 1027-1040) ===');
for (let i=1026; i<=1039 && i<lines.length; i++) {
  console.log(`${i+1}: ${lines[i].slice(0,120)}`);
}

// Show footer logo area (lines 1640-1660)
console.log('\n=== FOOTER LOGO (lines 1640-1660) ===');
for (let i=1639; i<=1659 && i<lines.length; i++) {
  console.log(`${i+1}: ${lines[i].slice(0,120)}`);
}

// Show fonts import
console.log('\n=== FONTS (lines 20-30) ===');
for (let i=19; i<=29 && i<lines.length; i++) {
  console.log(`${i+1}: ${lines[i].slice(0,150)}`);
}
