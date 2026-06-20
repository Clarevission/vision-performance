const fs = require('fs');

// Search ALL JSONL files more aggressively
const dir = 'C:\\Users\\clare\\.claude\\projects\\C--Users-clare-Claude\\';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsonl'));
console.log('JSONL files:', files);

let bestContent = '';

for (const file of files) {
  const raw = fs.readFileSync(dir + file, 'utf8');
  console.log(`\n${file}: ${raw.length} chars`);

  // Search for allProducts or stickyBar in various forms
  const markers = ['allProducts', 'stickyBar', 'PRODUCT_IMAGES', 'Unsplash'];
  markers.forEach(m => {
    let idx = 0, count = 0;
    while ((idx = raw.indexOf(m, idx)) >= 0 && count < 3) {
      // Get the surrounding 200 chars
      const ctx = raw.slice(Math.max(0, idx-50), idx+100);
      console.log(`  "${m}" at ${idx}: ...${ctx.replace(/\n/g,'↵').slice(0,100)}...`);
      count++;
      idx++;
    }
  });
}
