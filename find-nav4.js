const fs = require('fs');
const f = fs.readFileSync('public/index.html', 'utf8');

// The nav HTML is on a compressed single line. Find it by nav-specific class names
const searches = ['nav-hamburger', 'nav-links', 'nl-home', 'nl-shop', 'portal-btn'];
searches.forEach(s => {
  let idx = 0;
  while ((idx = f.indexOf(s, idx)) !== -1) {
    const lineNum = f.slice(0, idx).split('\n').length;
    const before10 = f.slice(idx-10, idx);
    const isHTML = !before10.includes('{') && !before10.includes(':');
    if (isHTML) {
      console.log(`HTML: "${s}" at char ${idx}, line ${lineNum}:`);
      console.log(f.slice(Math.max(0,idx-50), idx+150));
      console.log('---');
    }
    idx++;
  }
});
