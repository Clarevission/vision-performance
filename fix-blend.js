'use strict';
const fs = require('fs');
const file = 'public/index.html';
let f = fs.readFileSync(file, 'utf8');

f = f.replace(
  'height:38px;width:auto;display:block;border-radius:0 !important;object-fit:contain;',
  'height:38px;width:auto;display:block;border-radius:0 !important;object-fit:contain;mix-blend-mode:screen;'
);

fs.writeFileSync(file, f, 'utf8');
console.log('mix-blend-mode:screen added to sticky bar logo');
