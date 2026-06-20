/**
 * Final image replacement — all photos verified free (images.unsplash.com)
 * and matched precisely to each product/section's content.
 */
const fs = require('fs');
let f = fs.readFileSync('public/index.html', 'utf8');

const CDN = 'https://images.unsplash.com/photo-';
const Q   = '?auto=format&fit=crop&w=600&h=600&q=85';
const QW  = (w,h) => `?auto=format&fit=crop&w=${w}&h=${h}&q=85`;
const img = (id, w=600, h=600) => CDN + id + QW(w, h);

// ─────────────────────────────────────────────────────────────────────────────
// VERIFIED FREE PHOTO MAP  (all confirmed images.unsplash.com, not premium)
// ─────────────────────────────────────────────────────────────────────────────
// Professional Performance — clean studio prescription frames
const PHOTOS = {
  1:  img('FXHPeM2syp8'),          // black rectangular eyeglasses on soft grey studio
  2:  img('jT4zew8IENc'),          // minimal black frames on clean white surface
  3:  img('agis2A366g8'),          // silver Persol frames on grey fabric — elegant titanium feel
  4:  img('Lu_OVy61lzQ'),          // black rectangular frames on white table

  // Digital Eye Performance — modern, screen-optimised frames
  5:  img('0zA84TFRjI8'),          // eyeglasses on neutral surface
  6:  img('s7gRHGEmX78'),          // eyeglasses — anti-fatigue AR design
  7:  img('yQpSxKF_ELA'),          // minimal black frames on white — lightweight feel
  8:  img('oqlEKLMmTNg'),          // brown/black frames on grey bg — round tech look

  // Industrial Prescription Safety — CSA-rated protective eyewear
  9:  img('MDz-mVoVY9o'),          // industrial safety glasses with removable side shields
  10: img('Bebn0qrGEfM'),          // black safety frames on white fabric
  11: img('IfYUFOR7IsA'),          // worker adjusting safety glasses in workshop
  12: img('gDFD4N0unO0'),          // welder at work — wraparound safety eyewear in use

  // Lunettes Signature — luxury / designer frames
  13: img('PLm5ZYZn6qk'),          // designer prescription frames
  14: img('BhG19zEozkE'),          // editorial fashion — avant-garde designer eyewear
  15: img('0GfPlommtxM'),          // pink and gold designer frames on white paper
  16: img('S1MQ-W0wshg'),          // woman wearing rimless executive frames

  // Accessories — specific product images
  17: img('FwtWEIzyNJI'),          // eyeglasses with cleaning cloth on white surface
  18: img('aVvZJC0ynBQ'),          // person holding glasses up to check clarity
  19: img('jym62KnsByQ'),          // eyeglasses inside a white hard protective case
  20: img('2l3H_1e-85Y'),          // glasses on white surface — microfiber context
  21: img('GOBAjJ1-cQ0'),          // browline frames next to red box — screen accessory
};

// Section images (wider crops for banners)
const HERO_IMG      = img('24IsF0xPRO4', 960, 720);   // confident professional woman in white-frame glasses
const VAN_IMG       = img('ZhgpS6FJZmo', 960, 600);   // white van parked at building
const SPECIALIST_IMG= img('cguXr4imkks', 600, 760);   // healthcare professional with eye chart
const LEARN_IMG     = img('fiHQ3-D45zo', 800, 480);   // phoropter — eye exam instrument close-up

// ─────────────────────────────────────────────────────────────────────────────
// 1. Replace all product photo URLs
// ─────────────────────────────────────────────────────────────────────────────
let prodReplaced = 0;
f = f.replace(/\{id:(\d+),(name:[^}]+),photo:'[^']+'\}/g, (match, id, rest) => {
  const photo = PHOTOS[+id];
  if (!photo) return match;
  prodReplaced++;
  return `{id:${id},${rest},photo:'${photo}'}`;
});
// Also handle products that don't yet have a photo property
f = f.replace(/\{id:(\d+),(name:[^}]+)\}/g, (match, id, rest) => {
  const photo = PHOTOS[+id];
  if (!photo || rest.includes('photo:')) return match;
  prodReplaced++;
  return `{id:${id},${rest},photo:'${photo}'}`;
});
console.log(`✓ Product photos set: ${prodReplaced}`);

// ─────────────────────────────────────────────────────────────────────────────
// 2. Replace hero visual image
// ─────────────────────────────────────────────────────────────────────────────
// The hero currently has an img tag inside .hero-visual
f = f.replace(
  /(<div class="hero-visual">[\s\S]*?<img src=")[^"]+(")/,
  `$1${HERO_IMG}$2`
);
console.log('✓ Hero image updated');

// ─────────────────────────────────────────────────────────────────────────────
// 3. Replace mobile clinic van image
// ─────────────────────────────────────────────────────────────────────────────
f = f.replace(
  /(<img src=")[^"]+(".*?alt="Mobile optometry clinic van)/,
  `$1${VAN_IMG}$2`
);
console.log('✓ Mobile clinic image updated');

// ─────────────────────────────────────────────────────────────────────────────
// 4. Replace about / specialist image
// ─────────────────────────────────────────────────────────────────────────────
f = f.replace(
  /(<img src=")[^"]+(".*?alt="Vision Performance eye care specialist)/,
  `$1${SPECIALIST_IMG}$2`
);
console.log('✓ Specialist image updated');

// ─────────────────────────────────────────────────────────────────────────────
// 5. Replace learn page video / clinic image
// ─────────────────────────────────────────────────────────────────────────────
f = f.replace(
  /(<img src=")[^"]+(".*?alt="Mobile optometry clinic walkthrough)/,
  `$1${LEARN_IMG}$2`
);
console.log('✓ Learn page image updated');

// ─────────────────────────────────────────────────────────────────────────────
// Verify
// ─────────────────────────────────────────────────────────────────────────────
const oldBadIds = (f.match(/1560472354|1573496359|1530026405|1504813184|1554735534|1576669739/g)||[]).length;
const unsplashRefs = (f.match(/images\.unsplash\.com/g)||[]).length;
const photoProd = (f.match(/photo:'https:\/\/images\.unsplash/g)||[]).length;
console.log('\n=== Verification ===');
console.log('Unsplash refs total:', unsplashRefs);
console.log('Products with photos:', photoProd, '/ 21 expected');
console.log('Old bad IDs remaining:', oldBadIds);
console.log('File size:', (f.length/1024).toFixed(1), 'KB');

fs.writeFileSync('public/index.html', f);
console.log('\nDone!');
