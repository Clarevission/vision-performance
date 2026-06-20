const fs = require('fs');

// Search for Write tool calls that wrote to index.html in the session JSONLs
const sessions = [
  '79b53d09-5bdc-4013-8fca-f65986a9c53f.jsonl',
  'a0165e17-650c-4b97-a466-e1356b465722.jsonl',
];

for (const session of sessions) {
  const path = `C:\\Users\\clare\\.claude\\projects\\C--Users-clare-Claude\\${session}`;
  const raw = fs.readFileSync(path, 'utf8');
  const lines = raw.split('\n').filter(l => l.trim());
  console.log(`\n${session}: ${lines.length} lines`);

  lines.forEach((line, i) => {
    if (!line.includes('index.html') || line.length < 100000) return;
    try {
      const obj = JSON.parse(line);
      // Look for Write tool calls or large content
      const str = JSON.stringify(obj);
      if (str.includes('index.html') && str.length > 200000) {
        console.log(`  Line ${i}: length ${line.length}`);
        // Try to find HTML content
        function findHtml(o, path='') {
          if (typeof o === 'string' && o.length > 100000 && o.includes('allProducts')) {
            console.log(`  Found at ${path}: ${o.length} chars`);
            fs.writeFileSync('public/index-recovered.html', o.replace(/^\d+\t/gm,''));
            return true;
          }
          if (typeof o === 'object' && o !== null) {
            for (const k of Object.keys(o)) {
              if (findHtml(o[k], path+'.'+k)) return true;
            }
          }
          return false;
        }
        findHtml(obj);
      }
    } catch(e) {}
  });
}
