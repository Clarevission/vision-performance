const fs = require('fs');
const f = fs.readFileSync('public/index.html', 'utf8');

// Look for page class HTML elements
const bodyStart = f.indexOf('<body>');
const body = f.slice(bodyStart);

// Search for id="page-
const pageIds = [...body.matchAll(/id="page-[^"]+"/g)].map(m => ({
  match: m[0],
  pos: bodyStart + m.index,
  line: f.slice(0, bodyStart + m.index).split('\n').length
}));
console.log('Page IDs found:');
pageIds.forEach(p => console.log(`  ${p.match} at line ${p.line}, char ${p.pos}`));

// Search for mob-nav-link (mobile nav) in HTML
const mobIdx = body.indexOf('mob-nav-link');
console.log('\nmob-nav-link in body:', mobIdx >= 0 ? `char ${bodyStart+mobIdx}, line ${f.slice(0,bodyStart+mobIdx).split('\n').length}` : 'NOT FOUND');
if (mobIdx >= 0) console.log(body.slice(Math.max(0,mobIdx-20), mobIdx+200));

// Show what's at lines 1027-1080 (first 50 lines of body)
console.log('\nFirst lines of body after floating UI:');
const bodyLines = body.split('\n');
for (let i=0; i<50; i++) {
  if (bodyLines[i] && bodyLines[i].trim()) {
    console.log(`body+${i}: ${bodyLines[i].slice(0,100)}`);
  }
}
