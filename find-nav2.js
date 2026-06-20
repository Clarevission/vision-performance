const fs = require('fs');
const f = fs.readFileSync('public/index.html', 'utf8');
// Search for nav by looking for the nav element tag
const idx = f.search(/<nav[\s>]/i);
console.log('nav tag at position:', idx, 'line:', f.slice(0,idx).split('\n').length);
if (idx >= 0) console.log(f.slice(idx, idx+500));

// Also check what's on lines 1100-1110 (the area from line 1092 block)
// Let me find the nav in a different way - look for "navigate('home')" button in the nav
const btns = [];
let pos = 0;
while ((pos = f.indexOf("navigate('book')", pos)) !== -1) {
  const line = f.slice(0, pos).split('\n').length;
  btns.push({pos, line, snippet: f.slice(pos-50, pos+80)});
  pos++;
}
console.log('\nAll navigate(book) occurrences:');
btns.forEach(b => console.log(`Line ${b.line}: ...${b.snippet.slice(40)}...`));
