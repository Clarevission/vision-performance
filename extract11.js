const fs = require('fs');

// Search a0165e17 for large content chunks with HTML
const raw = fs.readFileSync(
  'C:\\Users\\clare\\.claude\\projects\\C--Users-clare-Claude\\a0165e17-650c-4b97-a466-e1356b465722.jsonl',
  'utf8'
);

console.log('Total chars:', raw.length);

// Find ALL occurrences of data:image (base64 logo) - this is unique to the nav
const searches = ['data:image', 'nav-logo', 'sticky-bar-text', 'nav-book-btn', 'sticky-bar-sub', 'nav-hamburger'];
searches.forEach(s => {
  let idx = 0, count = 0;
  while ((idx = raw.indexOf(s, idx)) >= 0 && count < 5) {
    const lineStart = raw.lastIndexOf('\n', idx) + 1;
    const lineEnd = raw.indexOf('\n', idx);
    const lineLen = lineEnd - lineStart;
    console.log(`"${s}" at char ${idx}, line length: ${lineLen}`);
    if (lineLen > 200000) {
      console.log('  >> LARGE LINE FOUND!');
    }
    idx++;
    count++;
  }
  if (count === 0) console.log(`NOT FOUND: "${s}"`);
});
