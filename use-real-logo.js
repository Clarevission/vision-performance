'use strict';
const fs   = require('fs');
const path = require('path');
const sharp = require('sharp');

const src  = path.join(__dirname, 'public/images/logo-dark-alt.png');
const out  = path.join(__dirname, 'public/images/logo-nav.png');
const html = path.join(__dirname, 'public/index.html');

// Resize to nav-friendly size (tall enough to look sharp at 44px display height)
sharp(src)
  .resize(320, null, { fit: 'inside', withoutEnlargement: false })
  .png({ compressionLevel: 9 })
  .toFile(out)
  .then(info => {
    console.log('Resized logo-nav.png:', info);

    const pngBuf = fs.readFileSync(out);
    const b64 = 'data:image/png;base64,' + pngBuf.toString('base64');

    let f = fs.readFileSync(html, 'utf8');
    const count = (f.match(/data:image\/png;base64,/g) || []).length;
    f = f.replace(/data:image\/png;base64,[A-Za-z0-9+/=]+/g, b64);
    fs.writeFileSync(html, f, 'utf8');
    console.log('Replaced', count, 'base64 logo embed(s). File:', (f.length/1024).toFixed(1), 'KB');
  })
  .catch(err => console.error(err));
