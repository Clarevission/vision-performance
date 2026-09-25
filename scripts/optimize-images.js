'use strict';
// Regenerates web-sized image derivatives from the brand masters in public/images.
// Dev-only: requires the `sharp` devDependency. Run with `npm run images`.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const pub = p => path.join(__dirname, '..', 'public', p);
const BADGE = pub('images/logo-badge.png');
const WORDMARK = pub('images/logo-dark-alt.png');
const INK = '#00071A';

// Removes a solid dark background by "un-blending" each pixel against it:
// pixel = a·foreground + (1−a)·background, solved for the smallest alpha that fits.
async function transparentWordmark(src, out, height) {
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const bg = [data[0], data[1], data[2]];
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, o = 0; i < data.length; i += 3, o += 4) {
    let a = 0;
    for (let c = 0; c < 3; c++) {
      const d = data[i + c] - bg[c];
      // Every logo colour is lighter than the background; darker pixels are grain.
      if (d > 0) a = Math.max(a, d / (255 - bg[c]));
    }
    // The master has film grain; drop faint noise and re-stretch the remaining range.
    a = Math.max(0, Math.min(1, (a - 0.08) / 0.85));
    for (let c = 0; c < 3; c++) {
      rgba[o + c] = a ? Math.max(0, Math.min(255, Math.round(bg[c] + Math.max(0, data[i + c] - bg[c]) / a))) : 0;
    }
    rgba[o + 3] = Math.round(a * 255);
  }
  const trimmed = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 1 }).png().toBuffer();
  await sharp(trimmed).resize({ height }).png({ compressionLevel: 9, palette: true, quality: 100, dither: 0 }).toFile(out);
}

(async () => {
  fs.mkdirSync(pub('assets/img'), { recursive: true });
  const png = { compressionLevel: 9, palette: true };

  await sharp(BADGE).resize(32, 32).png(png).toFile(pub('assets/img/favicon-32.png'));
  await sharp(BADGE).resize(180, 180).flatten({ background: INK }).png(png).toFile(pub('assets/img/apple-touch-icon.png'));
  await sharp(BADGE).resize(512, 512).png(png).toFile(pub('assets/img/icon-512.png'));
  // Header/footer wordmark: transparent version of the master (the master has a solid navy
  // background), trimmed and sized for up to ~100px display height at 3x density.
  await transparentWordmark(WORDMARK, pub('assets/img/vpi-wordmark.png'), 300);

  // Default social-share image: wordmark + badge on brand navy, logo-rule colours along the bottom.
  const wordmark = await sharp(WORDMARK).resize(560).png().toBuffer();
  const badge = await sharp(BADGE).resize(300, 300).png().toBuffer();
  const rule = Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">' +
    '<rect x="0" y="606" width="840" height="8" fill="#22D3EE"/>' +
    '<rect x="840" y="606" width="360" height="8" fill="#F97316"/></svg>');
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#02091B' } })
    .composite([{ input: wordmark, left: 90, top: 128 }, { input: badge, left: 810, top: 165 }, { input: rule, left: 0, top: 0 }])
    .jpeg({ quality: 86, mozjpeg: true }).toFile(pub('assets/img/og-default.jpg'));

  // Concept van render: responsive widths.
  for (const w of [480, 960]) {
    await sharp(pub('van.webp')).resize(w).webp({ quality: 78 }).toFile(pub(`assets/img/van-concept-${w}.webp`));
  }

  for (const f of ['assets/img/favicon-32.png', 'assets/img/apple-touch-icon.png', 'assets/img/icon-512.png',
    'assets/img/vpi-wordmark.png', 'assets/img/og-default.jpg',
    'assets/img/van-concept-480.webp', 'assets/img/van-concept-960.webp']) {
    console.log(f.padEnd(36), `${Math.round(fs.statSync(pub(f)).size / 1024)} KB`);
  }
})().catch(e => { console.error(e); process.exit(1); });
