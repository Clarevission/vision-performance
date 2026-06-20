const fs = require('fs');
let f = fs.readFileSync('public/index.html', 'utf8');

// Remove orphaned mobile drawer interior (lines 1014-1025)
const orphanStart = '\n  <button class="mob-nav-link active" onclick="navigate(\'home\');closeMobileDrawer()"><div class="mob-icon">🏠</div>Home</button>';
const orphanEnd = '</div>\n\n<!-- ════════════════════════════';
const si = f.indexOf(orphanStart);
const ei = f.indexOf(orphanEnd);
if (si >= 0 && ei >= 0) {
  f = f.slice(0, si) + '\n\n<!-- ════════════════════════════';
  console.log('✓ Orphaned mobile drawer content removed');
} else {
  console.log('✗ Could not find orphaned content. si:', si, 'ei:', ei);
}

// Fix sticky bar: remove the empty wrapper div that held the logo
// Before: <div>\n      \n              <div class="audience-arrow"...>→</div>\n            </div>
// After: (nothing - just start directly with the audience card)
const emptyDiv = `<div class="sticky-bar-left">
    <div>

              <div class="audience-arrow" aria-hidden="true">→</div>
            </div>
            <div class="audience-card"`;
const fixedDiv = `<div class="sticky-bar-left">
            <div class="audience-card"`;
if (f.includes(emptyDiv)) {
  f = f.replace(emptyDiv, fixedDiv);
  console.log('✓ Sticky bar empty div removed');
} else {
  // Try simpler approach - find and remove the empty wrapper div
  const sbLeft = f.indexOf('<div class="sticky-bar-left">');
  if (sbLeft >= 0) {
    const chunk = f.slice(sbLeft, sbLeft + 300);
    console.log('Sticky bar left current content:', JSON.stringify(chunk));
  }
}

// Verify
const bodyStart = f.indexOf('<body>');
const body = f.slice(bodyStart);
console.log('\nmob-nav-link in body:', body.includes('mob-nav-link') ? 'STILL PRESENT' : 'removed ✓');
console.log('Skip link line:', body.slice(0, 200));

fs.writeFileSync('public/index.html', f);
console.log('\nDone.');
