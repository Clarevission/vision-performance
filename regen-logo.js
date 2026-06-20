'use strict';
const fs   = require('fs');
const path = require('path');
const sharp = require('sharp');

// ── SVG logo: PERFORMANCE same width as VISION, INC. more prominent ──────────
// Canvas: 320×200. Using a condensed-style font stack.
// We define VISION at a fixed x/width, then set PERFORMANCE textLength to match.

const LOGO_W = 340;
const LOGO_H = 210;
const LEFT   = 16;
const TEXT_W = 308;   // both VISION and PERFORMANCE fill this exact span

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${LOGO_W}" height="${LOGO_H}" viewBox="0 0 ${LOGO_W} ${LOGO_H}">
  <!-- Background -->
  <rect width="${LOGO_W}" height="${LOGO_H}" fill="#07111E"/>

  <!-- VISION — large, fills TEXT_W via textLength -->
  <text
    x="${LEFT}" y="100"
    font-family="Arial Narrow, Arial, Helvetica Neue, sans-serif"
    font-size="96" font-weight="900" fill="#FFFFFF"
    textLength="${TEXT_W}" lengthAdjust="spacingAndGlyphs">VISION</text>

  <!-- Separator line (teal) -->
  <rect x="${LEFT}" y="110" width="${TEXT_W}" height="3.5" fill="#0ABFDE" rx="1.5"/>

  <!-- INC. — sits between separator and PERFORMANCE, right-aligned, teal, prominent -->
  <text
    x="${LEFT + TEXT_W - 2}" y="148"
    text-anchor="end"
    font-family="Arial Narrow, Arial, Helvetica Neue, sans-serif"
    font-size="28" font-weight="800" fill="#0ABFDE"
    letter-spacing="2">INC.</text>

  <!-- PERFORMANCE — spans full TEXT_W to match VISION, sits at bottom -->
  <text
    x="${LEFT}" y="185"
    font-family="Arial Narrow, Arial, Helvetica Neue, sans-serif"
    font-size="52" font-weight="700" fill="#FFFFFF"
    textLength="${TEXT_W}" lengthAdjust="spacingAndGlyphs">PERFORMANCE</text>
</svg>`;

const svgBuf = Buffer.from(svg);

const outPng  = path.join(__dirname, 'public/images/logo-nav.png');

sharp(svgBuf)
  .resize(320, 200)
  .png({ compressionLevel: 9 })
  .toFile(outPng)
  .then(info => {
    console.log('PNG written:', outPng, info);
    // Now re-encode as base64 and patch into index.html
    const pngBuf = fs.readFileSync(outPng);
    const b64 = 'data:image/png;base64,' + pngBuf.toString('base64');

    const htmlFile = path.join(__dirname, 'public/index.html');
    let html = fs.readFileSync(htmlFile, 'utf8');

    // Replace every data:image/png;base64,... occurrence (logo embeds)
    const replaced = html.replace(/data:image\/png;base64,[A-Za-z0-9+/=]+/g, b64);
    const count = (html.match(/data:image\/png;base64,/g) || []).length;
    fs.writeFileSync(htmlFile, replaced, 'utf8');
    console.log(`Replaced ${count} base64 logo embed(s) in index.html`);
  })
  .catch(err => console.error('Error:', err));
