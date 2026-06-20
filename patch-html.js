/**
 * patch-html.js
 * Reads the pristine source HTML, applies all patches, writes a clean UTF-8
 * file with NO BOM. Run once: node patch-html.js
 */
'use strict';
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'source-original.htm');

const DST = path.join(__dirname, 'public', 'index.html');

// Read source — Node reads as UTF-8 by default, strips BOM automatically
let html = fs.readFileSync(SRC, 'utf8');
// Strip BOM just in case
html = html.replace(/^﻿/, '');

console.log(`Source read: ${(html.length / 1024).toFixed(1)} KB`);

// ── 1. FAVICON ───────────────────────────────────────────────────────────────
html = html.replace(
  /<link rel="icon" type="image\/png" href="data:image\/png;base64,[^"]*">/,
  '<link rel="icon" type="image/png" href="/favicon.png"><link rel="apple-touch-icon" href="/favicon.png">'
);

// ── 2. OPEN GRAPH & META TAGS ─────────────────────────────────────────────
const OG = `
<meta property="og:type" content="website">
<meta property="og:url" content="https://www.visionperformance.ca/">
<meta property="og:title" content="Vision Performance Inc. — Precision Vision for Professionals | Alberta">
<meta property="og:description" content="Vision-care-specified prescription safety eyewear, mobile optometry clinics &amp; corporate vision programs serving industrial professionals across Alberta, Canada.">
<meta property="og:image" content="https://www.visionperformance.ca/images/logo-full.png">
<meta property="og:locale" content="en_CA">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Vision Performance Inc.">
<meta name="twitter:description" content="Prescription safety eyewear &amp; mobile optometry clinics for Alberta's industrial professionals.">
<meta name="twitter:image" content="https://www.visionperformance.ca/images/logo-full.png">
<meta name="theme-color" content="#FF6A00">
<link rel="canonical" href="https://www.visionperformance.ca/">`;

html = html.replace(
  /(<meta name="keywords"[^>]+>)/,
  `$1${OG}`
);

// ── 3. NAV LOGO CSS — strip the shield + text-wrap rules ─────────────────
html = html.replace(
  /\.nav-logo\{display:flex;align-items:center;gap:16px;text-decoration:none;cursor:pointer\}\s*\.logo-shield\{[\s\S]*?\}\s*\.logo-text-wrap \.logo-main\{[^}]+\}\s*\.logo-text-wrap \.logo-sub\{[^}]+\}/,
  `.nav-logo{display:flex;align-items:center;text-decoration:none;cursor:pointer}
.nav-logo img{height:44px;width:auto;display:block;transition:opacity 0.2s}
.nav-logo img:hover{opacity:0.85}
nav.scrolled .nav-logo img{height:38px}`
);

// ── 4. NAV LOGO HTML — replace base64 img with real file ─────────────────
html = html.replace(
  /(<a class="nav-logo"[^>]*>)\s*<img[^>]*>\s*(<\/a>)/s,
  '$1<img src="/images/logo-dark.png" alt="Vision Performance Inc." style="height:44px;width:auto;display:block;" loading="eager">$2'
);

// ── 5. FOOTER LOGO — replace base64 src with real file ───────────────────
html = html.replace(
  /src="data:image\/png;base64,[A-Za-z0-9+/=]+" alt="Vision Performance Inc\." style="height:50px/,
  'src="/images/logo-dark.png" alt="Vision Performance Inc." style="height:56px'
);

// Remove the now-redundant footer-logo-sub text div
html = html.replace(/<div class="footer-logo-sub">Inc\.[^<]*<\/div>/, '');

// ── 6. MOBILE CLINIC FORM — add IDs ──────────────────────────────────────
html = html.replace(
  `<div class="form-grid"><div class="fg"><label class="fl">Organization *</label><input class="fi" placeholder="Company / Organization Name"></div><div class="fg"><label class="fl">Contact Person *</label><input class="fi" placeholder="Full Name"></div><div class="fg"><label class="fl">Email Address *</label><input class="fi" type="email" placeholder="contact@company.com"></div><div class="fg"><label class="fl">Phone</label><input class="fi" type="tel" placeholder="+1 (780) 000-0000"></div><div class="fg"><label class="fl">Number of Employees</label><select class="fs"><option>Select range...</option><option>1–25</option><option>25–100</option><option>100–500</option><option>500+</option></select></div><div class="fg"><label class="fl">Preferred Date</label><input class="fi" type="date"></div><div class="fg full"><label class="fl">Site Address *</label><input class="fi" placeholder="Full worksite address including city and postal code"></div><div class="fg full"><label class="fl">Additional Notes</label><textarea class="ft" placeholder="Specific requirements, hazards, or site details..."></textarea></div></div>`,
  `<div class="form-grid"><div class="fg"><label class="fl" for="mc-org">Organization *</label><input id="mc-org" class="fi" placeholder="Company / Organization Name" required></div><div class="fg"><label class="fl" for="mc-contact">Contact Person *</label><input id="mc-contact" class="fi" placeholder="Full Name" required></div><div class="fg"><label class="fl" for="mc-email">Email Address *</label><input id="mc-email" class="fi" type="email" placeholder="contact@company.com" required></div><div class="fg"><label class="fl" for="mc-phone">Phone</label><input id="mc-phone" class="fi" type="tel" placeholder="+1 (780) 000-0000"></div><div class="fg"><label class="fl" for="mc-employees">Number of Employees</label><select id="mc-employees" class="fs"><option>Select range...</option><option>1–25</option><option>25–100</option><option>100–500</option><option>500+</option></select></div><div class="fg"><label class="fl" for="mc-date">Preferred Date</label><input id="mc-date" class="fi" type="date"></div><div class="fg full"><label class="fl" for="mc-address">Site Address *</label><input id="mc-address" class="fi" placeholder="Full worksite address including city and postal code" required></div><div class="fg full"><label class="fl" for="mc-notes">Additional Notes</label><textarea id="mc-notes" class="ft" placeholder="Specific requirements, hazards, or site details..."></textarea></div></div>`
);

// ── 7. CORPORATE FORM — add IDs ───────────────────────────────────────────
html = html.replace(
  `<div class="form-grid"><div class="fg"><label class="fl">Company Name *</label><input class="fi" placeholder="Your company name"></div><div class="fg"><label class="fl">Contact Person *</label><input class="fi" placeholder="Full Name &amp; Title"></div><div class="fg"><label class="fl">Email Address *</label><input class="fi" type="email" placeholder="contact@company.com"></div><div class="fg"><label class="fl">Phone Number *</label><input class="fi" type="tel" placeholder="+1 (780) 000-0000"></div><div class="fg"><label class="fl">Number of Employees</label><select class="fs"><option>Select range...</option><option>10–50</option><option>50–150</option><option>150–500</option><option>500+</option></select></div><div class="fg"><label class="fl">Preferred Start Date</label><input class="fi" type="date"></div><div class="fg full"><label class="fl">Worksite Location(s)</label><input class="fi" placeholder="Primary worksite address and any additional locations"></div><div class="fg full"><label class="fl">Additional Notes</label><textarea class="ft" placeholder="Industry, specific hazards, existing safety programs..."></textarea></div></div>`,
  `<div class="form-grid"><div class="fg"><label class="fl" for="corp-company">Company Name *</label><input id="corp-company" class="fi" placeholder="Your company name" required></div><div class="fg"><label class="fl" for="corp-contact">Contact Person *</label><input id="corp-contact" class="fi" placeholder="Full Name &amp; Title" required></div><div class="fg"><label class="fl" for="corp-email">Email Address *</label><input id="corp-email" class="fi" type="email" placeholder="contact@company.com" required></div><div class="fg"><label class="fl" for="corp-phone">Phone Number *</label><input id="corp-phone" class="fi" type="tel" placeholder="+1 (780) 000-0000" required></div><div class="fg"><label class="fl" for="corp-employees">Number of Employees</label><select id="corp-employees" class="fs"><option>Select range...</option><option>10–50</option><option>50–150</option><option>150–500</option><option>500+</option></select></div><div class="fg"><label class="fl" for="corp-date">Preferred Start Date</label><input id="corp-date" class="fi" type="date"></div><div class="fg full"><label class="fl" for="corp-location">Worksite Location(s)</label><input id="corp-location" class="fi" placeholder="Primary worksite address and any additional locations"></div><div class="fg full"><label class="fl" for="corp-notes">Additional Notes</label><textarea id="corp-notes" class="ft" placeholder="Industry, specific hazards, existing safety programs..."></textarea></div></div>`
);

// ── 8. CONTACT FORM — add IDs ─────────────────────────────────────────────
html = html.replace(
  `<div class="form-grid"><div class="fg"><label class="fl">Full Name *</label><input class="fi" placeholder="Your full name"></div><div class="fg"><label class="fl">Company</label><input class="fi" placeholder="Your organization"></div><div class="fg full"><label class="fl">Email *</label><input class="fi" type="email" placeholder="you@company.com"></div><div class="fg full"><label class="fl">Subject</label><select class="fs"><option>General Enquiry</option><option>Corporate Vision Program</option><option>Mobile Clinic Request</option><option>Product Question</option><option>Book Eye Exam</option></select></div><div class="fg full"><label class="fl">Message *</label><textarea class="ft" placeholder="Tell us how we can help..."></textarea></div></div>`,
  `<div class="form-grid"><div class="fg"><label class="fl" for="ct-name">Full Name *</label><input id="ct-name" class="fi" placeholder="Your full name" required></div><div class="fg"><label class="fl" for="ct-company">Company</label><input id="ct-company" class="fi" placeholder="Your organization"></div><div class="fg full"><label class="fl" for="ct-email">Email *</label><input id="ct-email" class="fi" type="email" placeholder="you@company.com" required></div><div class="fg full"><label class="fl" for="ct-subject">Subject</label><select id="ct-subject" class="fs"><option>General Enquiry</option><option>Corporate Vision Program</option><option>Mobile Clinic Request</option><option>Product Question</option><option>Book Eye Exam</option></select></div><div class="fg full"><label class="fl" for="ct-message">Message *</label><textarea id="ct-message" class="ft" placeholder="Tell us how we can help..." required></textarea></div></div>`
);

// ── 9. REPLACE FAKE submitForm WITH REAL FETCH VERSION ────────────────────
html = html.replace(
  /function submitForm\(type\)\{[^}]+\}/,
  `async function submitForm(type){
  const btn=document.querySelector('[onclick="submitForm(\''+type+'\')"]');
  const orig=btn?btn.innerHTML:'';
  if(btn){btn.disabled=true;btn.innerHTML='Sending…';}
  const fields={
    mobile:{org:'#mc-org',contact:'#mc-contact',email:'#mc-email',phone:'#mc-phone',employees:'#mc-employees',date:'#mc-date',address:'#mc-address',notes:'#mc-notes'},
    corporate:{company:'#corp-company',contact:'#corp-contact',email:'#corp-email',phone:'#corp-phone',employees:'#corp-employees',date:'#corp-date',location:'#corp-location',notes:'#corp-notes'},
    contact:{name:'#ct-name',company:'#ct-company',email:'#ct-email',subject:'#ct-subject',message:'#ct-message'}
  };
  const data={};
  for(const[k,sel]of Object.entries(fields[type]||{})){const el=document.querySelector(sel);if(el)data[k]=el.value;}
  try{
    const r=await fetch('/api/'+type,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    const j=await r.json();
    if(r.ok){const msgs={mobile:"Mobile clinic request submitted! We'll contact you within 1 business day.",corporate:"Corporate program request submitted! A representative will be in touch shortly.",contact:"Message sent! We'll respond within 1 business day."};showToast(msgs[type]||j.message||'Submitted!');for(const sel of Object.values(fields[type]||{})){const el=document.querySelector(sel);if(el)el.value='';}}
    else{showToast(j.error||'Something went wrong. Please try again.');}
  }catch(e){showToast('Network error — please check your connection and try again.');}
  finally{if(btn){btn.disabled=false;btn.innerHTML=orig;}}
}`
);

// ── WRITE — pure UTF-8, absolutely no BOM ────────────────────────────────
fs.writeFileSync(DST, html, { encoding: 'utf8' });

// ── VERIFY ────────────────────────────────────────────────────────────────
const written = fs.readFileSync(DST, 'utf8');
const corrupt = ['ðŸ', 'â€"', 'âœ', 'Ã©', 'ï¸'].filter(p => written.includes(p));
const bom = written.charCodeAt(0) === 0xFEFF;

console.log(`Written: ${(written.length / 1024).toFixed(1)} KB`);
console.log(`BOM present: ${bom}`);
console.log(`Encoding corrupt: ${corrupt.length > 0 ? corrupt.join(', ') : 'NONE ✓'}`);
console.log(`Emoji check 📞: ${written.includes('📞') ? '✓' : '✗'}`);
console.log(`Emoji check 🚐: ${written.includes('🚐') ? '✓' : '✗'}`);
console.log(`Emoji check ✉️: ${written.includes('✉️') ? '✓' : '✗'}`);
console.log(`Logo applied: ${written.includes('/images/logo-dark.png') ? '✓' : '✗'}`);
console.log(`onclick count: ${(written.match(/onclick=/g)||[]).length}`);
console.log(`submitForm real: ${written.includes('fetch(') ? '✓' : '✗'}`);
console.log('All done.');
