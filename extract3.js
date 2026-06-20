const fs = require('fs');
const content = fs.readFileSync(
  'C:\\Users\\clare\\.claude\\projects\\C--Users-clare-Claude\\d8d38a4b-8271-4138-9884-b47eeecdc90b.jsonl',
  'utf8'
);

// Find where the full HTML was read - look for DOCTYPE in the JSONL
// It would appear as "1\t<!DOCTYPE html>" in a file read tool result
const searches = ['"1\\t<!DOCTYPE', '1\\\\t<!DOCTYPE', '\\\\n1\\\\t<!DOCTYPE'];
searches.forEach(s => {
  const idx = content.indexOf(s);
  console.log(`"${s}" at: ${idx}`);
});

// Also check for the start of index.html content via the \n1\t pattern
const docIdx = content.indexOf('1\\t<!DOCTYPE html>');
console.log('1\\t<!DOCTYPE at:', docIdx);
if (docIdx >= 0) {
  console.log('Sample:', content.slice(docIdx, docIdx+200));
}

// Look for where the big JS section is stored (allProducts in Read result)
const allProdIdx = content.indexOf('"allProducts"');
console.log('\nallProducts at:', allProdIdx);
if (allProdIdx >= 0) {
  // Search backwards to find the start of the JSON message
  const before = content.lastIndexOf('\n', allProdIdx);
  console.log('Line starts at:', before);
  console.log('Context:', content.slice(allProdIdx-50, allProdIdx+200));
}
