'use strict';
const fs = require('fs');
const file = 'public/index.html';
let html = fs.readFileSync(file, 'utf8');

// Find submitForm function boundaries
const funcStart = html.indexOf('async function submitForm');
const funcEnd   = html.indexOf('\n// ════ TOAST', funcStart);

if (funcStart < 0 || funcEnd < 0) {
  console.error('Could not find submitForm boundaries. funcStart=' + funcStart + ' funcEnd=' + funcEnd);
  process.exit(1);
}

console.log('Found submitForm: chars', funcStart, 'to', funcEnd);

// Clean replacement — avoids ALL attribute-selector quoting by using Array.find instead
const newFunc = [
  'async function submitForm(type){',
  '  // Find submit button by matching its onclick attribute text',
  "  const btn=Array.from(document.querySelectorAll('[onclick]')).find(function(el){",
  "    var oc=el.getAttribute('onclick')||'';",
  "    return oc===('submitForm('+\"'\"+ type +\"'\"+')');",
  '  });',
  "  const orig=btn?btn.innerHTML:'';",
  "  if(btn){btn.disabled=true;btn.innerHTML='Sending…';}",
  '  var fields={',
  "    mobile:{org:'#mc-org',contact:'#mc-contact',email:'#mc-email',phone:'#mc-phone',employees:'#mc-employees',date:'#mc-date',address:'#mc-address',notes:'#mc-notes'},",
  "    corporate:{company:'#corp-company',contact:'#corp-contact',email:'#corp-email',phone:'#corp-phone',employees:'#corp-employees',date:'#corp-date',location:'#corp-location',notes:'#corp-notes'},",
  "    contact:{name:'#ct-name',company:'#ct-company',email:'#ct-email',subject:'#ct-subject',message:'#ct-message'}",
  '  };',
  '  var data={};',
  "  var map=fields[type]||{};",
  '  Object.keys(map).forEach(function(k){var el=document.querySelector(map[k]);if(el)data[k]=el.value;});',
  '  fetch("/api/"+type,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)})',
  '  .then(function(r){return r.json().then(function(j){',
  '    if(r.ok){',
  "      var msgs={mobile:\"Mobile clinic request submitted! We'll contact you within 1 business day.\",corporate:\"Corporate program request submitted! A representative will be in touch shortly.\",contact:\"Message sent! We'll respond within 1 business day.\"};",
  "      showToast(msgs[type]||j.message||'Submitted!');",
  '      Object.keys(map).forEach(function(k){var el=document.querySelector(map[k]);if(el)el.value="";});',
  "    }else{showToast(j.error||'Something went wrong. Please try again.');}",
  '  });}).catch(function(){',
  "    showToast('Network error — please check your connection and try again.');",
  '  }).finally(function(){',
  '    if(btn){btn.disabled=false;btn.innerHTML=orig;}',
  '  });',
  '}'
].join('\n');

// Validate it parses cleanly BEFORE writing
try {
  new Function(newFunc);
  console.log('New submitForm: VALID JS ✓');
} catch(e) {
  console.error('SYNTAX ERROR in new function:', e.message);
  process.exit(1);
}

// Splice it in
html = html.substring(0, funcStart) + newFunc + html.substring(funcEnd);
fs.writeFileSync(file, html, 'utf8');
console.log('Written:', (html.length/1024).toFixed(1), 'KB');

// Validate ALL inline script blocks
const scriptRe = /<script(?![^>]*\bsrc\b)[^>]*>([\s\S]*?)<\/script>/gi;
let m, idx = 0, allOk = true;
while ((m = scriptRe.exec(html)) !== null) {
  const body = m[1].trim();
  if (!body) continue;
  try {
    new Function(body);
    console.log('Script ' + idx + ' (' + body.length + ' chars): OK ✓');
  } catch(e) {
    allOk = false;
    // Find approx location of error
    const lines = body.split('\n');
    console.error('Script ' + idx + ' SYNTAX ERROR: ' + e.message);
    // Print lines around the error
    const lineMatch = e.message.match(/line (\d+)/i);
    const errLine = lineMatch ? parseInt(lineMatch[1]) - 1 : -1;
    if (errLine >= 0) {
      console.error('  Line ' + errLine + ': ' + (lines[errLine]||'').trim());
      console.error('  Line ' + (errLine+1) + ': ' + (lines[errLine+1]||'').trim());
    } else {
      console.error('  First 300 chars:', body.substring(0,300));
    }
  }
  idx++;
}
if (allOk) console.log('\nAll ' + idx + ' script blocks parse cleanly ✓');
else { console.error('\nFIX NEEDED'); process.exit(1); }
