const fs = require('fs');
const lines = fs.readFileSync(
  'C:\\Users\\clare\\.claude\\projects\\C--Users-clare-Claude\\79b53d09-5bdc-4013-8fca-f65986a9c53f.jsonl',
  'utf8'
).split('\n').filter(l => l.trim());

console.log('Total JSONL lines:', lines.length);

// Search all lines for the largest HTML content
let bestLine = -1, bestLen = 0;
lines.forEach((line, i) => {
  if ((line.includes('allProducts') || line.includes('stickyBar')) && line.length > bestLen) {
    bestLen = line.length;
    bestLine = i;
  }
});

console.log('Best line:', bestLine, 'length:', bestLen);

if (bestLine >= 0) {
  try {
    const obj = JSON.parse(lines[bestLine]);
    // Find HTML content in the object
    const str = JSON.stringify(obj);
    // Look for the html content
    const htmlIdx = str.indexOf('\\u003c!DOCTYPE');
    const bodyIdx = str.indexOf('\\u003cbody\\u003e') || str.indexOf('<body>');
    console.log('DOCTYPE found at:', htmlIdx);
    console.log('body found at:', bodyIdx);

    // Try to extract the full HTML
    // The content might be in tool_result or similar
    if (obj.content) {
      obj.content.forEach((c, ci) => {
        if (typeof c === 'object' && c.text && c.text.length > 1000) {
          console.log(`Content[${ci}] type:${c.type} length:${c.text.length}`);
          if (c.text.includes('allProducts')) {
            fs.writeFileSync('recovered-content.txt', c.text);
            console.log('Saved to recovered-content.txt');
          }
        }
      });
    }
  } catch(e) {
    console.log('Parse error:', e.message);
    // Try extracting raw HTML
    const start = lines[bestLine].indexOf('<!DOCTYPE');
    if (start >= 0) {
      // Find end
      const content = lines[bestLine].slice(start);
      console.log('Raw HTML starts at:', start, 'sample:', content.slice(0, 200));
    }
  }
}
