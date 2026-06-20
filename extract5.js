const fs = require('fs');
const content = fs.readFileSync(
  'C:\\Users\\clare\\.claude\\projects\\C--Users-clare-Claude\\d8d38a4b-8271-4138-9884-b47eeecdc90b.jsonl',
  'utf8'
);

// Parse the JSONL line that contains the HTML
const lineStart = content.lastIndexOf('\n', 5206663) + 1;
const lineEnd = content.indexOf('\n', 5206663);
const jsonLine = content.slice(lineStart, lineEnd > 0 ? lineEnd : lineStart + 5000000);
console.log('Line length:', jsonLine.length);
console.log('Line start sample:', jsonLine.slice(0, 200));

try {
  const obj = JSON.parse(jsonLine);
  console.log('Parsed! Keys:', Object.keys(obj));

  // Recursively find long strings
  function findHtml(o, path='') {
    if (typeof o === 'string' && o.includes('<!DOCTYPE html>')) {
      console.log(`Found HTML at path: ${path}, length: ${o.length}`);
      return o;
    }
    if (typeof o === 'object' && o !== null) {
      for (const k of Object.keys(o)) {
        const r = findHtml(o[k], path + '.' + k);
        if (r) return r;
      }
    }
    return null;
  }

  const html = findHtml(obj);
  if (html) {
    // Remove line number prefixes if present
    const cleaned = html.replace(/^\d+\t/gm, '');
    fs.writeFileSync('public/index-recovered.html', cleaned);
    console.log('Saved! Chars:', cleaned.length);
  }
} catch(e) {
  console.log('Parse error:', e.message.slice(0, 100));
  // Maybe it's a multiline JSON - check if the content is split
  // Get char 5206663 context with larger window
  console.log('\nContext around match:');
  console.log(content.slice(5206500, 5206700));
}
