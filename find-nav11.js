const fs = require('fs');
const f = fs.readFileSync('public/index.html', 'utf8');
console.log('File length:', f.length, 'chars');

// Count all style/script tags
const styleTags = [...f.matchAll(/<\/?style/gi)].map(m => ({tag:m[0], pos:m.index, line:f.slice(0,m.index).split('\n').length}));
const scriptTags = [...f.matchAll(/<\/?script/gi)].map(m => ({tag:m[0], pos:m.index, line:f.slice(0,m.index).split('\n').length}));

console.log('\nStyle tags:');
styleTags.forEach(t => console.log(`  ${t.tag} at char ${t.pos}, line ${t.line}`));
console.log('\nScript tags:');
scriptTags.forEach(t => console.log(`  ${t.tag} at char ${t.pos}, line ${t.line}`));

// Show what's at line 1026 (body tag area)
const lines = f.split('\n');
console.log('\nLines 1024-1030:');
for (let i=1023; i<=1030 && i<lines.length; i++) {
  console.log(`${i+1}: ${lines[i].slice(0,120)}`);
}
