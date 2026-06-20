const fs = require('fs');
const content = fs.readFileSync(
  'C:\\Users\\clare\\.claude\\projects\\C--Users-clare-Claude\\d8d38a4b-8271-4138-9884-b47eeecdc90b.jsonl',
  'utf8'
);

// Find the start of the HTML read result
const startIdx = content.indexOf('"1\\t<!DOCTYPE html>');
console.log('Start at:', startIdx);

// Find the surrounding JSON context - go back to find the JSON object start
// The content is inside a JSON string, so we need to find the enclosing " and unescape
// Go back to find the opening " of this string value
let jsonStrStart = startIdx - 1;
// Find the JSONL line that contains this
const lineStart = content.lastIndexOf('\n', startIdx) + 1;
console.log('JSONL line starts at:', lineStart);

// Parse just enough to get the content
// The text would be: "...1\t<!DOCTYPE html>\n2\t<html...2030\t</html>\n..."
// Find where it ends - look for the end of the HTML (</html>)
const htmlEndPattern = '\\n</html>\\n"'; // escaped in JSON string
const htmlEnd1 = content.indexOf('</html>\\n"', startIdx);
const htmlEnd2 = content.indexOf('\\u003c/html\\u003e', startIdx);
console.log('htmlEnd1 at:', htmlEnd1);
console.log('htmlEnd2 at:', htmlEnd2);

// Extract the chunk
if (htmlEnd1 >= 0) {
  const chunk = content.slice(startIdx - 1, htmlEnd1 + 10);
  console.log('Chunk length:', chunk.length);
  console.log('Chunk end:', chunk.slice(-100));

  // Now unescape the JSON string content
  // The chunk starts with " and the content has \n for newlines, \" for quotes, etc.
  try {
    // Wrap in brackets to make valid JSON and parse
    const jsonStr = '"' + chunk.slice(1); // ensure starts with "
    // Find where the string ends
    const endQuote = findStringEnd(content, startIdx - 1);
    if (endQuote >= 0) {
      const rawStr = content.slice(startIdx - 1, endQuote + 1);
      const parsed = JSON.parse(rawStr);
      // parsed is now the unescaped string with "1\t<!DOCTYPE html>\n2\t..."
      // Remove line numbers
      const html = parsed.split('\n').map(line => {
        return line.replace(/^\d+\t/, '');
      }).join('\n');
      fs.writeFileSync('public/index-recovered.html', html);
      console.log('\nRecovered HTML saved! Lines:', html.split('\n').length, 'Chars:', html.length);
    }
  } catch(e) {
    console.log('Parse error:', e.message);
  }
}

function findStringEnd(str, startPos) {
  // startPos is the opening " of a JSON string
  let i = startPos + 1;
  while (i < str.length) {
    if (str[i] === '\\') { i += 2; continue; }
    if (str[i] === '"') return i;
    i++;
  }
  return -1;
}
