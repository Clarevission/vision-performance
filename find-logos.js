const fs = require('fs');
const f = fs.readFileSync('public/index.html', 'utf8');

// Find all logo locations
const searches = [
  'nav-logo', 'footer-logo', 'data:image', 'sticky-bar-text',
  'logo-nav', 'Vision Performance Inc', 'vp-logo'
];

const bodyStart = f.indexOf('<body>');
const body = f.slice(bodyStart);

searches.forEach(s => {
  let idx = 0, count = 0;
  while ((idx = body.indexOf(s, idx)) >= 0 && count < 5) {
    const lineNum = f.slice(0, bodyStart + idx).split('\n').length;
    const ctx = body.slice(Math.max(0,idx-20), idx+150).replace(/\n/g,'↵');
    const isCSSorJS = ctx.includes('{') || ctx.includes('function') || ctx.includes('//');
    if (!isCSSorJS || s === 'data:image') {
      console.log(`"${s}" HTML at line ${lineNum}: ${ctx.slice(0,120)}`);
    }
    idx++;
    count++;
  }
});
