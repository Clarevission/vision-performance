/**
 * DEFINITIVE image replacement — every ID verified from actual Unsplash photo
 * pages, all confirmed images.unsplash.com (free, not premium).
 */
const fs = require('fs');
let f = fs.readFileSync('public/index.html', 'utf8');

const CDN = 'https://images.unsplash.com/photo-';
const q = (w, h, extra='') =>
  `?auto=format&fit=crop&w=${w}&h=${h}&q=85${extra}`;

const img = (id, w=600, h=600, extra='') => CDN + id + q(w, h, extra);

// ─── VERIFIED LONG-FORM CDN IDs (all from images.unsplash.com, free) ─────────
// Professional Performance — clean studio prescription frames
const PHOTOS = {
  1:  img('1766998224439-9f048ed4d687'),  // black rectangular eyeglasses, gray studio
  2:  img('1617791932882-a70117e3564d'),  // minimal black frames on clean white surface
  3:  img('1588937094793-5aee482cd9a0'),  // silver Persol frames on gray fabric — titanium
  4:  img('1589176449149-71f7ea77ec25'),  // black rectangular frames on white table

  // Digital Eye Performance — modern screen-optimised eyewear
  5:  img('1646084081219-1090f72a531c'),  // eyeglasses — digital focus style
  6:  img('1603578119639-798b8413d8d7'),  // eyeglasses — AR anti-fatigue coated
  7:  img('1608906709312-fe17f7c1a5a6'),  // minimalist black frames on white — lightweight
  8:  img('1608539733377-5557e02926b5'),  // brown/black frames on grey — round tech

  // Industrial Prescription Safety — CSA-rated protective eyewear
  9:  img('1702625835613-ad7fa6bb5194'),  // industrial safety glasses with side shields
  10: img('1593854519602-687eae339d57'),  // black safety frames on white textile
  11: img('1754747197440-0bbf8a0ac1a9'),  // worker adjusting safety glasses in workshop
  12: img('1759757548364-0edce6779baa'),  // welder at work — industrial safety eyewear

  // Lunettes Signature — luxury / designer frames
  13: img('1769414123505-d53607809609'),  // premium designer prescription frames
  14: img('1769414608525-64438594c59c'),  // avant-garde designer sunglasses — fashion editorial
  15: img('1582142407894-ec85a1260a46'),  // pink & gold designer frames on white
  16: img('1769414761120-a186e3bad614'),  // woman in rimless executive frames

  // Accessories — specific product shots
  17: img('1599243439680-1af420953c23'),  // eyeglasses on white surface — cleaning kit feel
  18: img('1517948430535-1e2469d314fe'),  // person holding glasses up — checking clarity
  19: img('1632986636900-a57d247122a2'),  // glasses inside white hard protective case
  20: img('1576420782660-c3be90691e29'),  // eyeglasses on clean white — microfiber context
  21: img('1726626258806-09db08d3b5c1'),  // glasses next to box — screen accessory
};

// Section images (different aspect ratios)
const HERO_IMG       = img('1581915649317-41fc6eb9597d', 960, 720);  // professional woman, white-frame glasses
const VAN_IMG        = img('1728039190626-ceea378d0419', 960, 600);  // white van at building — mobile clinic
const SPECIALIST_IMG = img('1632054225741-e071804dfc58', 600, 760);  // clinician with Snellen chart
const LEARN_IMG      = img('1632054227742-67e0e23595b0', 800, 480);  // phoropter — eye exam instrument

// ─── 1. Replace ALL product photo URLs ───────────────────────────────────────
let prodReplaced = 0;
// Replace existing photo properties
f = f.replace(/,photo:'https:\/\/images\.unsplash[^']+'/g, '');
// Now re-add correct photos to each product
f = f.replace(/\{id:(\d+),(name:[^}]+)\}/g, (match, id, rest) => {
  const photo = PHOTOS[+id];
  if (!photo) return match;
  prodReplaced++;
  return `{id:${id},${rest},photo:'${photo}'}`;
});
console.log(`✓ Product photos replaced: ${prodReplaced}/21`);

// ─── 2. Hero visual image ─────────────────────────────────────────────────────
const heroRe = /(<div class="hero-visual">[\s\S]{0,50}<img src=")[^"]+(")/;
if (heroRe.test(f)) {
  f = f.replace(heroRe, `$1${HERO_IMG}$2`);
  console.log('✓ Hero image updated');
} else {
  console.log('✗ Hero pattern not found');
}

// ─── 3. Mobile clinic van ─────────────────────────────────────────────────────
const vanRe = /(<img src=")[^"]+(" alt="Mobile optometry clinic van)/;
if (vanRe.test(f)) {
  f = f.replace(vanRe, `$1${VAN_IMG}$2`);
  console.log('✓ Van image updated');
} else {
  console.log('✗ Van pattern not found');
}

// ─── 4. About / specialist ────────────────────────────────────────────────────
const specRe = /(<img src=")[^"]+(" alt="Vision Performance eye care specialist)/;
if (specRe.test(f)) {
  f = f.replace(specRe, `$1${SPECIALIST_IMG}$2`);
  console.log('✓ Specialist image updated');
} else {
  console.log('✗ Specialist pattern not found');
}

// ─── 5. Learn page video ──────────────────────────────────────────────────────
const learnRe = /(<img src=")[^"]+(" alt="Mobile optometry clinic walkthrough)/;
if (learnRe.test(f)) {
  f = f.replace(learnRe, `$1${LEARN_IMG}$2`);
  console.log('✓ Learn image updated');
} else {
  console.log('✗ Learn pattern not found');
}

// ─── Verify ───────────────────────────────────────────────────────────────────
const unsplashRefs = (f.match(/images\.unsplash\.com/g)||[]).length;
const prodPhotos   = (f.match(/photo:'https:\/\/images\.unsplash/g)||[]).length;
const shortIds     = (f.match(/photo-[A-Za-z][A-Za-z0-9_-]{6,12}\?/g)||[]).length;
console.log('\n=== Verification ===');
console.log('Unsplash refs:', unsplashRefs);
console.log('Products with photo:', prodPhotos, '/ 21');
console.log('Short (non-timestamp) IDs remaining:', shortIds);
console.log('File size:', (f.length/1024).toFixed(1), 'KB');

fs.writeFileSync('public/index.html', f);
console.log('\nDone!');
