const fs = require('fs');
const f = fs.readFileSync('public/index.html', 'utf8');

// Find the navigate() function definition
const navFnIdx = f.indexOf('function navigate(');
console.log('navigate() at char:', navFnIdx, 'line:', f.slice(0,navFnIdx).split('\n').length);
console.log(f.slice(navFnIdx, navFnIdx+300));

// Also look for where the nav HTML element might be inserted dynamically
const insertSearches = ['insertAdjacentHTML', 'document.body.innerHTML', 'innerHTML=`', "innerHTML='<", 'createElement.*nav', 'nav.*createElement'];
insertSearches.forEach(s => {
  const re = new RegExp(s, 'i');
  const idx = f.search(re);
  if (idx >= 0) {
    console.log(`\n"${s}" at char ${idx}, line ${f.slice(0,idx).split('\n').length}:`);
    console.log(f.slice(idx, idx+200));
  }
});
