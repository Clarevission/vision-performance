const fs = require('fs');
const f = fs.readFileSync('public/index.html', 'utf8');

// Nav must be rendered by JS. Search for nav-related JS
const searches = [
  'renderNav', 'buildNav', 'initNav', 'createNav',
  'nav-logo', 'nav-brand', 'CLIENT PORTAL', 'client-portal',
  'VISION PERFORMANCE', 'vp-logo',
  'innerHTML.*nav', 'nav.*innerHTML'
];

searches.forEach(s => {
  const re = new RegExp(s, 'i');
  const idx = f.search(re);
  if (idx >= 0) {
    const lineNum = f.slice(0, idx).split('\n').length;
    console.log(`"${s}" at char ${idx}, line ${lineNum}:`);
    console.log(f.slice(Math.max(0,idx-30), idx+200));
    console.log('---');
  } else {
    console.log(`NOT FOUND: "${s}"`);
  }
});
