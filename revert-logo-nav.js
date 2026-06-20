const fs = require('fs');
let f = fs.readFileSync('public/index.html', 'utf8');
const original = f;

// ── 1. Remove the entire <nav> block I added (from <nav id="mainNav"> to </nav>)
f = f.replace(/\n<nav id="mainNav">[\s\S]*?<\/nav>\n/g, '\n');
console.log('Nav removed:', !f.includes('<nav id="mainNav">'));

// ── 2. Remove the mobile drawer overlay + drawer I added
f = f.replace(/\n<div class="mobile-drawer-overlay"[\s\S]*?<\/div>\n<div class="mobile-drawer"[\s\S]*?<\/div>\n/g, '\n');
console.log('Mobile drawer removed:', !f.includes('mobile-drawer-overlay'));

// ── 3. Remove the logo div from the sticky bar (restore to no-logo state)
// The logo was inserted inside sticky-bar-left -> first <div>
f = f.replace(/<div class="vp-logo-text"><span class="vp-logo-vision">VISION<\/span><div class="vp-logo-line-row"><span class="vp-logo-line"><\/span><span class="vp-logo-inc">INC\.<\/span><\/div><span class="vp-logo-perf">PERFORMANCE<\/span><\/div>/g, '');
console.log('Sticky bar logo removed:', !f.includes('vp-logo-vision'));

// ── 4. Remove the VP logo CSS block entirely
const vpLogoCSS1 = /\/\* ── VP Text Logo ── \*\/\n[\s\S]*?\.sticky-bar \.vp-logo-inc\{[^\n]*\}\n/;
if (vpLogoCSS1.test(f)) {
  f = f.replace(vpLogoCSS1, '');
  console.log('VP logo CSS removed');
} else {
  // Try broader match
  const vpStart = f.indexOf('/* ── VP Text Logo ── */');
  if (vpStart >= 0) {
    // Find where it ends (next CSS comment or </style>)
    const afterVP = f.slice(vpStart);
    const nextSection = afterVP.search(/\n\/\*|<\/style>/);
    if (nextSection >= 0) {
      f = f.slice(0, vpStart) + f.slice(vpStart + nextSection);
      console.log('VP logo CSS removed (broad match)');
    }
  } else {
    console.log('VP logo CSS not found');
  }
}

// ── 5. Remove added JS functions (toggleMobileDrawer, closeMobileDrawer, scroll nav)
f = f.replace(/\nfunction toggleMobileDrawer\(\)\{[\s\S]*?\}\nfunction closeMobileDrawer\(\)\{[\s\S]*?\}\n/g, '\n');
f = f.replace(/\nwindow\.addEventListener\('scroll',\(\)=>\{[\s\S]*?\},\{passive:true\}\);\n/g, '\n');
console.log('Mobile drawer JS removed:', !f.includes('toggleMobileDrawer'));

// ── 6. Verify the file still has the Unsplash images and main content
console.log('\nUnsplash images present:', f.includes('images.unsplash.com'));
console.log('Sticky bar still present:', f.includes('id="stickyBar"'));
console.log('Products JS present:', f.includes('allProducts'));
console.log('File length:', f.length, 'chars (was', original.length, ')');

fs.writeFileSync('public/index.html', f);
console.log('\nRevert complete.');
