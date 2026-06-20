const fs = require('fs');
const f = fs.readFileSync('public/index.html', 'utf8');

// The nav must be on a very long line. Let's find it by its unique content
const searches = ['Book Exam', 'nav-wrap', 'site-header', 'mob-nav', 'hamburger', 'ham-btn'];
searches.forEach(s => {
  const idx = f.indexOf(s);
  if (idx >= 0) {
    const lineNum = f.slice(0, idx).split('\n').length;
    console.log(`"${s}" at char ${idx}, line ${lineNum}:`);
    console.log(f.slice(Math.max(0,idx-30), idx+100));
    console.log('---');
  } else {
    console.log(`NOT FOUND: "${s}"`);
  }
});
