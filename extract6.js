const fs = require('fs');

// Search BOTH session JSONLs for the largest HTML content
const sessions = [
  'a0165e17-650c-4b97-a466-e1356b465722.jsonl',
  'd8d38a4b-8271-4138-9884-b47eeecdc90b.jsonl'
];

let bestHTML = '';

for (const session of sessions) {
  const path = `C:\\Users\\clare\\.claude\\projects\\C--Users-clare-Claude\\${session}`;
  if (!fs.existsSync(path)) continue;

  const rawContent = fs.readFileSync(path, 'utf8');
  const lines = rawContent.split('\n').filter(l => l.trim());
  console.log(`${session}: ${lines.length} lines`);

  lines.forEach((line, i) => {
    if (!line.includes('<!DOCTYPE html>') && !line.includes('allProducts') && !line.includes('stickyBar')) return;
    try {
      const obj = JSON.parse(line);
      function findLargeHTML(o) {
        if (typeof o === 'string' && o.length > 50000 && (o.includes('allProducts') || o.includes('stickyBar'))) {
          return o;
        }
        if (typeof o === 'object' && o !== null) {
          for (const k of Object.keys(o)) {
            const r = findLargeHTML(o[k]);
            if (r) return r;
          }
        }
        return null;
      }
      const html = findLargeHTML(obj);
      if (html && html.length > bestHTML.length) {
        bestHTML = html;
        console.log(`  Line ${i}: found HTML, length: ${html.length}`);
      }
    } catch(e) {}
  });
}

if (bestHTML.length > 0) {
  // Remove line number prefixes (format: "123\tcontent")
  const cleaned = bestHTML.replace(/^\d+\t/gm, '');
  fs.writeFileSync('public/index-recovered.html', cleaned);
  console.log('\nSaved index-recovered.html, chars:', cleaned.length);
} else {
  console.log('No large HTML found in any session');
}
