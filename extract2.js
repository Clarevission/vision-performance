const fs = require('fs');

// Check the previous sessions for large HTML content
const sessions = [
  'a0165e17-650c-4b97-a466-e1356b465722.jsonl',
  'd8d38a4b-8271-4138-9884-b47eeecdc90b.jsonl'
];

for (const session of sessions) {
  const path = `C:\\Users\\clare\\.claude\\projects\\C--Users-clare-Claude\\${session}`;
  if (!fs.existsSync(path)) { console.log('Not found:', session); continue; }

  const content = fs.readFileSync(path, 'utf8');
  console.log(`\n${session}: ${content.length} chars`);

  // Look for where index.html content appears
  // The file content would be in tool_result messages
  const searchTerms = ['"allProducts"', 'PRODUCT_IMAGES', 'stickyBar', 'sticky-bar'];
  searchTerms.forEach(term => {
    const idx = content.indexOf(term);
    if (idx >= 0) {
      console.log(`  "${term}" found at char ${idx}`);
      // Show context - look backwards for start of this HTML chunk
      const chunk = content.slice(Math.max(0, idx-100), idx+200);
      console.log('  Context:', chunk.slice(0,150).replace(/\n/g,'↵'));
    }
  });
}
