const fs = require('fs');
const f = fs.readFileSync('public/index.html', 'utf8');

// Find the HTML nav-logo anchor tag (not CSS)
const htmlIdx = f.indexOf('<a ') + f.indexOf('<a\n');
// search for class="nav-logo" in HTML context
let idx = 0;
while ((idx = f.indexOf('class="nav-logo"', idx)) !== -1) {
  const before = f.slice(idx - 5, idx);
  console.log('Found at', idx, '| before:', JSON.stringify(before));
  console.log(f.slice(idx - 3, idx + 300));
  console.log('---');
  idx++;
}
