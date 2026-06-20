const fs = require('fs');
let f = fs.readFileSync('public/index.html', 'utf8');

// Fix 1: malformed URLs where &crop=entropy ended up in the path before ?
// Pattern: photo-{id}&crop=entropy?auto=format... → photo-{id}?auto=format...&crop=entropy
f = f.replace(
  /photo-([\w-]+)&crop=entropy(\?auto=format&fit=crop&w=\d+&h=\d+&q=\d+)/g,
  'photo-$1$2&crop=entropy'
);
console.log('+ Fixed malformed &crop=entropy URLs');

// Fix 2: van image — replace the failed ID with a known van/truck photo
f = f.replace(/1489824904134-2b8ec30f8b7f/g, '1554735534-b5dba17d3d34');
console.log('+ Replaced van photo ID');

// Fix 3: specialist photo — try an optometrist / eye care professional
f = f.replace(/1551601651-2a5c3cfad8dc/g, '1576669739098-8d5a4e8a0965');
console.log('+ Replaced specialist photo ID');

// Fix 4: learn video — mobile health / clinic professional
f = f.replace(/1530026405-5f8efb5e0c18/g, '1576669739098-8d5a4e8a0965');
console.log('+ Replaced learn video photo ID');

// Verify no malformed URLs remain
const malformed = (f.match(/photo-[^?]+&crop/g)||[]).length;
console.log('Malformed URLs remaining:', malformed);
console.log('Total Unsplash refs:', (f.match(/unsplash\.com/g)||[]).length);

fs.writeFileSync('public/index.html', f);
console.log('Done!');
