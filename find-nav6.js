const fs = require('fs');
const f = fs.readFileSync('public/index.html', 'utf8');

// "Book Exam" not found as text. It must be in JS template literals.
// Search for it with backtick context
const searches = ['Book Exam', 'book exam', 'BOOK EXAM', 'bookExam', 'book-exam', 'stickyBar', 'sticky-bar', 'sticky_bar'];
searches.forEach(s => {
  const idx = f.indexOf(s);
  if (idx >= 0) {
    const lineNum = f.slice(0, idx).split('\n').length;
    console.log(`"${s}" at char ${idx}, line ${lineNum}:`);
    console.log(f.slice(Math.max(0,idx-50), idx+200));
    console.log('---');
  } else {
    console.log(`NOT FOUND: "${s}"`);
  }
});
