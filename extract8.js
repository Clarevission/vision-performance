const fs = require('fs');
const raw = fs.readFileSync(
  'C:\\Users\\clare\\.claude\\projects\\C--Users-clare-Claude\\79b53d09-5bdc-4013-8fca-f65986a9c53f.jsonl',
  'utf8'
);

// Found stickyBar at 2438062. Find the JSONL line containing it.
const lineStart = raw.lastIndexOf('\n', 2438062) + 1;
const lineEnd = raw.indexOf('\n', 2438062);
console.log('JSONL line:', lineStart, '-', lineEnd, 'length:', lineEnd - lineStart);

try {
  const obj = JSON.parse(raw.slice(lineStart, lineEnd));

  function findLargeString(o, minLen=10000) {
    if (typeof o === 'string' && o.length >= minLen) return [{len: o.length, val: o}];
    if (typeof o === 'object' && o !== null) {
      const results = [];
      for (const k of Object.keys(o)) {
        results.push(...findLargeString(o[k], minLen));
      }
      return results;
    }
    return [];
  }

  const strs = findLargeString(obj, 50000).sort((a,b) => b.len - a.len);
  console.log('Large strings found:', strs.length);
  strs.forEach((s,i) => console.log(`  [${i}] length: ${s.len}, starts with: ${s.val.slice(0,80).replace(/\n/g,'↵')}`));

  if (strs.length > 0) {
    const html = strs[0].val;
    // Remove line number prefix: "1234\t" or "1234:" style
    const cleaned = html.replace(/^\d+[\t:][^\t]/gm, (m) => m.slice(m.indexOf(m.match(/[\t:]/)[0]) + 1));
    fs.writeFileSync('public/index-recovered.html', cleaned);
    console.log('\nSaved! Chars:', cleaned.length);
    console.log('First 200 chars:', cleaned.slice(0, 200));
  }
} catch(e) {
  console.log('Parse error:', e.message.slice(0,100));
}
