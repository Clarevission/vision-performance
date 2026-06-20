const fs = require('fs');
const f = fs.readFileSync('public/index.html', 'utf8');

// Look for nav being injected via JS - search for nav HTML template in JS
const searches = [
  'nav-wrap', 'class="nav"', 'id="nav"', 'header', '<header',
  'portal-btn', 'nav-links', 'nav-hamburger'
];

searches.forEach(s => {
  let idx = 0, count = 0;
  while ((idx = f.indexOf(s, idx)) !== -1 && count < 5) {
    const lineNum = f.slice(0, idx).split('\n').length;
    const context = f.slice(Math.max(0,idx-20), idx+80);
    const isInStyle = context.includes('{') || context.includes('}');
    console.log(`"${s}" at char ${idx}, line ${lineNum} [${isInStyle?'CSS/JS':'HTML?'}]: ${f.slice(Math.max(0,idx-10),idx+60).replace(/\n/g,'↵')}`);
    idx++;
    count++;
  }
  if (count === 0) console.log(`NOT FOUND: "${s}"`);
});
