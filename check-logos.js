const fs = require('fs');
const f = fs.readFileSync('public/index.html', 'utf8');
let idx = 0, positions = [];
while ((idx = f.indexOf('vp-logo-text', idx)) !== -1) { positions.push(idx); idx++; }
console.log('vp-logo-text found:', positions.length, 'times');
positions.forEach(p => {
  const chunk = f.slice(p, p + 200);
  console.log('---');
  console.log(chunk);
});
