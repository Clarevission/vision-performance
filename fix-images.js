const fs = require('fs');
let f = fs.readFileSync('public/index.html', 'utf8');

// Replace failed Unsplash photo IDs with working alternatives
const FIXES = {
  '1582208498-c4764cf0e38f': '1511499767150-a48a237f0083&crop=entropy',
  '1563991655280-1e6e8af5b6f5': '1508296695146-257a814070b4&crop=entropy',
  '1588258219524-bf25c0e5498d': '1541123437800-1bb1317badc2&crop=entropy',
  '1607462108855-c41d4a6c3ea0': '1504307651254-35680f356dfd&crop=entropy',
  '1596462502278-27bfdc956f32': '1527956041665-d7a1b380c460&crop=entropy',
  '1588543385566-b68c2e6d3af5': '1523275335684-37898b6baf30&crop=entropy',
  '1584308666744-76dd73e5c0c3': '1611532736597-de2d4265fba3&crop=entropy',
  '1585751119997-783abb82c6e2': '1593642632559-0c6d3fc62b89&crop=left',
  '1608501078713-8e445a709613': '1574258495973-f010dfbb5371&crop=entropy',
  '1544620347-cedd9638af9d': '1489824904134-2b8ec30f8b7f',
  '1559757148-28c2ba5f7d3b': '1551601651-2a5c3cfad8dc',
  '1582750765714-b5e4a4a677ab': '1530026405-5f8efb5e0c18',
};

let count = 0;
for (const [bad, good] of Object.entries(FIXES)) {
  const parts = f.split(bad);
  if (parts.length > 1) {
    console.log(`+ ${parts.length-1}x ${bad.slice(0,16)} → ${good.slice(0,16)}`);
    count += parts.length - 1;
    f = parts.join(good);
  }
}
console.log(`\nTotal: ${count} replacements`);
fs.writeFileSync('public/index.html', f);
console.log('Done!');
