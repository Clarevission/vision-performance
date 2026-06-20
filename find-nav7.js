const fs = require('fs');
const f = fs.readFileSync('public/index.html', 'utf8');

// Find <nav tag in the HTML
let idx = 0;
while ((idx = f.indexOf('<nav', idx)) !== -1) {
  const lineNum = f.slice(0, idx).split('\n').length;
  console.log(`<nav at char ${idx}, line ${lineNum}:`);
  console.log(f.slice(idx, idx+300));
  console.log('---');
  idx++;
}

// Also look for the logo-nav.png reference
const pngIdx = f.indexOf('logo-nav');
console.log('\nlogo-nav reference:', pngIdx >= 0 ? `char ${pngIdx}, line ${f.slice(0,pngIdx).split('\n').length}` : 'NOT FOUND');
if (pngIdx >= 0) console.log(f.slice(pngIdx-50, pngIdx+100));
