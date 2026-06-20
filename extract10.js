const fs = require('fs');
const raw = fs.readFileSync(
  'C:\\Users\\clare\\.claude\\projects\\C--Users-clare-Claude\\d8d38a4b-8271-4138-9884-b47eeecdc90b.jsonl',
  'utf8'
);

// allProducts found at char 186342 in d8d38a4b. Find the JSONL line.
const positions = [186342, 194108, 5231987];

positions.forEach(pos => {
  const lineStart = raw.lastIndexOf('\n', pos) + 1;
  const lineEnd = raw.indexOf('\n', pos);
  const lineLen = lineEnd - lineStart;
  console.log(`\nPosition ${pos}: line ${lineStart}-${lineEnd}, length: ${lineLen}`);

  if (lineLen > 100000) {
    try {
      const obj = JSON.parse(raw.slice(lineStart, lineEnd));
      function findLarge(o, minLen=50000) {
        if (typeof o === 'string' && o.length >= minLen) return o;
        if (typeof o === 'object' && o !== null) {
          for (const k of Object.keys(o)) {
            const r = findLarge(o[k], minLen);
            if (r) return r;
          }
        }
        return null;
      }
      const s = findLarge(obj);
      if (s) {
        console.log('Large string found, length:', s.length);
        fs.writeFileSync('public/index-recovered.html', s.replace(/^\d+\t/gm, ''));
        console.log('Saved!');
      }
    } catch(e) {
      console.log('Parse error:', e.message.slice(0,50));
    }
  } else {
    // Show the content to understand format
    console.log('Short line. Content sample:', raw.slice(lineStart, lineStart+300));
  }
});

// Also search for the 5231987 position which is the largest JSONL line
const p = 5231987;
const ls = raw.lastIndexOf('\n', p) + 1;
const le = raw.indexOf('\n', p);
console.log(`\nBig position ${p}: line length=${le-ls}`);
if (le - ls > 200000) {
  try {
    const obj = JSON.parse(raw.slice(ls, le));
    function findLarge2(o, minLen=100000) {
      if (typeof o === 'string' && o.length >= minLen) return o;
      if (typeof o === 'object' && o !== null) {
        const results = [];
        for (const k of Object.keys(o)) {
          const r = findLarge2(o[k], minLen);
          if (r) results.push(r);
        }
        if (results.length) return results.sort((a,b) => b.length-a.length)[0];
      }
      return null;
    }
    const s = findLarge2(obj);
    if (s) {
      console.log('Found string, length:', s.length, 'starts:', s.slice(0,100));
      const cleaned = s.replace(/^\d+\t/gm, '');
      fs.writeFileSync('public/index-recovered.html', cleaned);
      console.log('Saved recovered HTML, chars:', cleaned.length);
    } else {
      console.log('No large string found');
    }
  } catch(e) {
    console.log('Parse error at big line:', e.message.slice(0,80));
  }
}
