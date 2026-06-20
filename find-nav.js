const fs = require('fs');
const f = fs.readFileSync('public/index.html', 'utf8');
// Search for the nav HTML - look for the navigation bar container
const patterns = ['<header', 'id="nav"', 'class="nav"', 'Book Exam', 'BOOK EXAM', 'btn-orange.*navigate'];
patterns.forEach(p => {
  const re = new RegExp(p, 'i');
  const m = f.match(re);
  if (m) {
    const idx = f.indexOf(m[0]);
    console.log(`Found "${p}" at position ${idx} (line ~${f.slice(0,idx).split('\n').length})`);
    console.log(f.slice(idx, idx+100));
    console.log('---');
  } else {
    console.log(`NOT FOUND: "${p}"`);
  }
});
