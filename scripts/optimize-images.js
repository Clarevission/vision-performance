'use strict';
// Regenerates web-sized image derivatives from the brand masters in public/images.
// Dev-only: requires the `sharp` devDependency. Run with `npm run images`.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const pub = p => path.join(__dirname, '..', 'public', p);
const brand = p => path.join(__dirname, '..', 'brand', p);
const WORDMARK = brand('logo-dark-alt.png');
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

  // Header/footer wordmark: transparent version of the master (the master has a solid navy
  // background), trimmed and sized for up to ~100px display height at 3x density.
  await transparentWordmark(WORDMARK, pub('assets/img/vpi-wordmark.png'), 300);
  // WebP versions for the page (header ~66px tall, footer 104px): 1x and 2x widths.
  for (const w of [180, 360]) {
    await sharp(pub('assets/img/vpi-wordmark.png')).resize({ width: w }).webp({ quality: 90, alphaQuality: 100 })
      .toFile(pub(`assets/img/vpi-wordmark-${w}.webp`));
  }

  // Favicons and app icons: the main VPI wordmark centred on brand navy. Small sizes use
  // less padding so the lettering stays as large as possible.
  const wordmarkMaster = await (async () => {
    const tmp = pub('assets/img/.wordmark-hires.png');
    await transparentWordmark(WORDMARK, tmp, 900);
    const buf = fs.readFileSync(tmp);
    fs.unlinkSync(tmp);
    return buf;
  })();
  for (const [size, file, fill] of [
    [32, 'vpi-favicon-32.png', 0.94],
    [192, 'vpi-icon-192.png', 0.82],
    [180, 'vpi-apple-touch-icon.png', 0.8],
    [512, 'vpi-icon-512.png', 0.8],
  ]) {
    const mark = await sharp(wordmarkMaster).resize({ width: Math.round(size * fill) }).png().toBuffer();
    const { width, height } = await sharp(mark).metadata();
    await sharp({ create: { width: size, height: size, channels: 4, background: INK } })
      .composite([{ input: mark, left: Math.round((size - width) / 2), top: Math.round((size - height) / 2) }])
      .png({ compressionLevel: 9 }).toFile(pub(`assets/img/${file}`));
  }

  // Default social-share image (1200×630): the main VPI wordmark centred on brand navy,
  // with the logo-rule colours along the bottom edge.
  const shareMark = await sharp(wordmarkMaster).resize({ height: 380 }).png().toBuffer();
  const sm = await sharp(shareMark).metadata();
  const rule = Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">' +
    '<rect x="0" y="606" width="840" height="8" fill="#22D3EE"/>' +
    '<rect x="840" y="606" width="360" height="8" fill="#F97316"/></svg>');
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: INK } })
    .composite([
      { input: shareMark, left: Math.round((1200 - sm.width) / 2), top: Math.round((606 - sm.height) / 2) },
      { input: rule, left: 0, top: 0 },
    ])
    .jpeg({ quality: 88, mozjpeg: true }).toFile(pub('assets/img/vpi-share.jpg'));

  // Concept van render: responsive widths.
  for (const w of [480, 960]) {
    await sharp(brand('van-concept-master.webp')).resize(w).webp({ quality: 78 }).toFile(pub(`assets/img/van-concept-${w}.webp`));
  }

  for (const f of ['assets/img/vpi-favicon-32.png', 'assets/img/vpi-icon-192.png', 'assets/img/vpi-apple-touch-icon.png', 'assets/img/vpi-icon-512.png',
    'assets/img/vpi-wordmark.png', 'assets/img/vpi-wordmark-180.webp', 'assets/img/vpi-wordmark-360.webp', 'assets/img/vpi-share.jpg',
    'assets/img/van-concept-480.webp', 'assets/img/van-concept-960.webp']) {
    console.log(f.padEnd(36), `${Math.round(fs.statSync(pub(f)).size / 1024)} KB`);
  }
})().catch(e => { console.error(e); process.exit(1); });
