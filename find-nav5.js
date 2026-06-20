const fs = require('fs');
const f = fs.readFileSync('public/index.html', 'utf8');

// Look for the nav logo in different ways
const searches = ['nl-home', 'id="nl-', 'nav-book-btn', 'navigate.*home.*logo', 'Book Exam'];
searches.forEach(s => {
  const re = new RegExp(s, 'i');
  const idx = f.search(re);
  if (idx >= 0) {
    const lineNum = f.slice(0, idx).split('\n').length;
    console.log(`"${s}" at char ${idx}, line ${lineNum}:`);
    console.log(f.slice(Math.max(0,idx-20), idx+200));
    console.log('---');
  } else {
    console.log(`NOT FOUND: "${s}"`);
  }
});
