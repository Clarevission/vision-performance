const fs = require('fs');
let f = fs.readFileSync('public/index.html', 'utf8');

// ── PHOTO MAP ────────────────────────────────────────────────────────────────
const U = (id, w, h) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=85`;

// Per-product photo map — each chosen for the exact frame style/category
const PRODUCT_PHOTOS = {
  // Professional Performance (business prescription frames)
  1: U('1511499767150-a48a237f0083', 600, 600),  // slim rectangular black frames on white
  2: U('1574258495973-f010dfbb5371', 600, 600),  // metal rectangular frames neutral bg
  3: U('1508296695146-257a814070b4', 600, 600),  // round tortoiseshell prescription
  4: U('1582208498-c4764cf0e38f',    600, 600),  // minimal titanium rectangular frames
  // Digital Eye Performance (blue light / computer glasses)
  5: U('1592503254549-d83d24a4dfab', 600, 600),  // blue-light blocking rectangular
  6: U('1591378603223-e15b45a81640', 600, 600),  // screen-work computer glasses
  7: U('1563991655280-1e6e8af5b6f5', 600, 600),  // lightweight oval home-office frames
  8: U('1577803645773-f96470509666', 600, 600),  // anti-fatigue slim frames
  // Industrial Prescription Safety (CSA-rated safety eyewear)
  9:  U('1588258219524-bf25c0e5498d', 600, 600), // clear-lens safety goggles CSA style
  10: U('1504307651254-35680f356dfd', 600, 600), // orange-tint impact safety glasses
  11: U('1607462108855-c41d4a6c3ea0', 600, 600), // wraparound anti-fog protective
  12: U('1541123437800-1bb1317badc2', 600, 600), // yellow-lens sport-wrap safety eyewear
  // Lunettes Signature (luxury / designer frames)
  13: U('1596462502278-27bfdc956f32', 600, 600), // designer oval acetate frames
  14: U('1527956041665-d7a1b380c460', 600, 600), // classic round heritage frames
  15: U('1588543385566-b68c2e6d3af5', 600, 600), // contemporary handcrafted acetate
  16: U('1523275335684-37898b6baf30', 600, 600), // executive luxury rectangular
  // Accessories
  17: U('1584308666744-76dd73e5c0c3', 600, 600), // lens cleaning kit with cloth & solution
  18: U('1585751119997-783abb82c6e2', 600, 600), // anti-fog spray pump bottle
  19: U('1608501078713-8e445a709613', 600, 600), // hard-shell protective glasses case
  20: U('1611532736597-de2d4265fba3', 600, 600), // premium microfiber cloths
  21: U('1593642632559-0c6d3fc62b89', 600, 600), // laptop screen / screen protector
};

// ── 1. Add photo property to each product object ─────────────────────────────
let changed = 0;
f = f.replace(/\{id:(\d+),(name:[^}]+)\}/g, (match, id, rest) => {
  const photo = PRODUCT_PHOTOS[+id];
  if (!photo || rest.includes('photo:')) return match;
  changed++;
  return `{id:${id},${rest},photo:'${photo}'}`;
});
console.log(`+ Added photo to ${changed} products`);

// ── 2. Upgrade productCardHTML to use <img> when photo is present ─────────────
// Find the function and replace the canvas with conditional img/canvas
f = f.replace(
  /function productCardHTML\(p,prefix='c'\)\{[\s\S]*?^\}/m,
  `function productCardHTML(p,prefix='c'){
  const bm={new:'badge-new',csa:'badge-csa',pro:'badge-pro'};
  const imgEl=p.photo
    ?'<img src="'+p.photo+'" alt="'+p.name+'" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;">'
    :'<canvas id="'+prefix+p.id+'" width="320" height="320" aria-hidden="true"></canvas>';
  return\`<div class="product-card" role="listitem"><div class="product-img">\${imgEl}\${p.badge?\`<div class="product-badge \${bm[p.badge]||''}">\${p.badge==='csa'?'CSA Compliant':p.badge==='new'?'New':'Pro'}</div>\`:''}<button class="product-wishlist" onclick="showToast('Saved to wishlist')" aria-label="Add to wishlist">♡</button></div><div class="product-info"><div class="product-collection">\${p.col}</div><div class="product-name">\${p.name}</div><div class="product-desc">\${p.desc}</div><div class="product-footer"><div class="product-price">$\${p.price}</div><button class="add-to-cart-btn" onclick="addToCart(\${p.id})">Add to Cart</button></div></div></div>\`;
}`
);
console.log('+ productCardHTML uses real images');

// ── 3. Cart: use product photo when available ─────────────────────────────────
// The cart renders via template literal inside updateCart; patch the canvas part
f = f.replace(
  `<canvas id="cc\${item.id}" width="160" height="120" aria-hidden="true" style="border-radius:12px;"></canvas>`,
  `\${item.photo?'<img src="'+item.photo+'" alt="'+item.name+'" style="width:100%;height:100%;object-fit:cover;border-radius:12px;display:block;">':'<canvas id="cc'+item.id+'" width="160" height="120" aria-hidden="true" style="border-radius:12px;"></canvas>'}`
);
console.log('+ Cart line upgraded');

// ── 4. Hero visual: SVG eyewear wireframe → real eyewear photo ───────────────
const HERO_OPEN  = '<div class="hero-visual" aria-hidden="true">';
const HERO_CLOSE = '</svg>\n</div>\n    </div>\n  </section>';
const hi = f.indexOf(HERO_OPEN);
const hj = f.indexOf(HERO_CLOSE, hi);
if (hi >= 0 && hj >= 0) {
  f = f.slice(0, hi)
    + `<div class="hero-visual">\n<img src="${U('1560472354-b33ff0c44a43', 960, 720)}" alt="Professional wearing precision prescription eyewear" loading="eager" style="width:100%;max-width:480px;height:auto;border-radius:var(--radius-lg);box-shadow:0 24px 56px rgba(0,0,0,0.5);display:block;object-fit:cover;">\n</div>\n    </div>\n  </section>`
    + f.slice(hj + HERO_CLOSE.length);
  console.log('+ Hero SVG → real photo');
} else { console.log('! Hero SVG not found, hi='+hi+' hj='+hj); }

// ── 5. Mobile clinic SVG → real mobile clinic / medical van photo ─────────────
const VAN_OPEN  = '<svg viewBox="0 0 520 320" role="img" aria-label="Mobile optometry clinic van"';
const VAN_CLOSE = '</svg>\n      </div>\n    </div>';
const vi = f.indexOf(VAN_OPEN);
const vj = f.indexOf(VAN_CLOSE, vi);
if (vi >= 0 && vj >= 0) {
  f = f.slice(0, vi)
    + `<img src="${U('1544620347-cedd9638af9d', 960, 600)}" alt="Mobile optometry clinic van delivering on-site eye exams" loading="lazy" style="width:100%;border-radius:var(--radius-lg);box-shadow:0 20px 50px rgba(0,0,0,0.45);display:block;object-fit:cover;">`
    + f.slice(vj + VAN_CLOSE.length - 31)  // keep closing divs
    ;
  // safer replace: just swap the svg tag block
  console.log('+ Mobile clinic SVG → real photo (attempt)');
} else { console.log('! Mobile clinic SVG not found'); }

// ── 6. About specialist SVG → real optometrist / eye care professional ────────
const SPEC_OPEN  = '<svg viewBox="0 0 600 760" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Vision Performance specialist"';
const SPEC_CLOSE = '</svg>\n        <div class="founder-quote">';
const si = f.indexOf(SPEC_OPEN);
const sj = f.indexOf(SPEC_CLOSE, si);
if (si >= 0 && sj >= 0) {
  f = f.slice(0, si)
    + `<img src="${U('1559757148-28c2ba5f7d3b', 600, 760)}" alt="Vision Performance eye care specialist" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:var(--radius-lg);">`
    + '\n        <div class="founder-quote">'
    + f.slice(sj + SPEC_CLOSE.length);
  console.log('+ Specialist SVG → real photo');
} else { console.log('! Specialist SVG not found'); }

// ── 7. Resource cards: SVG placeholders → real editorial photos ───────────────
// CSA guide → industrial safety worker
f = f.replace(
  /<svg viewBox="0 0 200 120" width="200"><rect[^/]+\/><text[^/]+CSA<\/text><text[^/]+Z94\.3<\/text><\/svg>/,
  `<img src="${U('1504307651254-35680f356dfd', 400, 240)}" alt="Industrial safety compliance" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;">`
);
// WCB article → professionals in safety gear
f = f.replace(
  /<svg viewBox="0 0 200 120" width="200"><rect[^/]+\/><text[^/]+WCB<\/text><\/svg>/,
  `<img src="${U('1573496359142-b8d87734a5a2', 400, 240)}" alt="WCB Alberta eye safety in the workplace" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;">`
);
// Digital eye strain → person at computer screen
f = f.replace(
  /<svg viewBox="0 0 200 120" width="200"><rect[^/]+\/><text[^/]+DIGITAL<\/text><text[^/]+EYE STRAIN<\/text><\/svg>/,
  `<img src="${U('1484417894907-623942c8ee29', 400, 240)}" alt="Digital eye strain at screen" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;">`
);
console.log('+ Resource card SVGs → real photos');

// ── 8. Learn page video card SVG → real mobile clinic photo ──────────────────
const LV_OPEN  = '<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Mobile clinic walkthrough video"';
const LV_CLOSE = '</svg>';
const li = f.indexOf(LV_OPEN);
const lj = f.indexOf(LV_CLOSE, li);
if (li >= 0 && lj >= 0) {
  f = f.slice(0, li)
    + `<img src="${U('1582750765714-b5e4a4a677ab', 800, 480)}" alt="Mobile optometry clinic walkthrough" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;">`
    + f.slice(lj + LV_CLOSE.length);
  console.log('+ Learn page video SVG → real photo');
} else { console.log('! Learn page SVG not found'); }

// ── 9. Verify ─────────────────────────────────────────────────────────────────
const svgCount = (f.match(/<svg /g)||[]).length;
const imgCount = (f.match(/unsplash\.com/g)||[]).length;
const photoProds = (f.match(/photo:'https/g)||[]).length;
console.log('\n=== Verification ===');
console.log('SVG elements remaining:', svgCount, '(icons/decorative expected)');
console.log('Unsplash photo refs:', imgCount);
console.log('Products with photos:', photoProds, '/ 21');
console.log('File size:', (f.length/1024).toFixed(1), 'KB');

fs.writeFileSync('public/index.html', f);
console.log('Done!');
