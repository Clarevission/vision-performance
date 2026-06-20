const fs = require('fs');
const f = fs.readFileSync('public/index.html', 'utf8');

// The nav might be in a JS template. Look for it in the JS section (lines 1628-1973)
// Find where JS block starts and ends
const js1Start = 247035; // char from earlier
const js1End = 271235;
const jsBlock = f.slice(js1Start, js1End);

// Search for nav HTML in JS
const navPatterns = ['nav-logo', 'nav-links', 'mob-nav', 'nav-book', 'portal-btn',
                     'VISION', 'vp-logo', 'nav-hamburger', 'class="nav"',
                     'nav-inner', 'nav-wrap', 'buildNav', 'renderNav',
                     'document.body.insertAdjacentHTML'];
navPatterns.forEach(s => {
  const idx = jsBlock.indexOf(s);
  if (idx >= 0) {
    const absLine = f.slice(0, js1Start+idx).split('\n').length;
    console.log(`"${s}" in JS at line ${absLine}:`);
    console.log(jsBlock.slice(Math.max(0,idx-30), idx+200));
    console.log('---');
  }
});

// Also check what the first 500 chars of the JS block look like
console.log('\nFirst 500 chars of JS block:');
console.log(jsBlock.slice(0, 500));
