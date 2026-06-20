const fs = require('fs');
const f = fs.readFileSync('public/index.html', 'utf8');

// Body content starts at line 1026 = after char 82721 (end of head)
// Search for nav HTML only in body content (after char 82721)
const bodyStart = f.indexOf('<body>');
console.log('Body starts at char:', bodyStart, 'line:', f.slice(0,bodyStart).split('\n').length);

// Look for nav-related HTML in body
const body = f.slice(bodyStart);
const navSearches = ['nav-hamburger', 'nav-links', 'portal-btn', 'nav-logo', '<nav', 'id="mainNav"', 'id="header"'];
navSearches.forEach(s => {
  const idx = body.indexOf(s);
  if (idx >= 0) {
    const absChar = bodyStart + idx;
    const lineNum = f.slice(0, absChar).split('\n').length;
    console.log(`"${s}" in body at char ${absChar}, line ${lineNum}:`);
    console.log(body.slice(Math.max(0,idx-20), idx+200));
    console.log('---');
  } else {
    console.log(`NOT IN BODY: "${s}"`);
  }
});
