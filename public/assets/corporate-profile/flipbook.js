// Page data is a JSON block in the page (not executable), so the viewer works under a
// script-src 'self' Content-Security-Policy and when opened from disk.
const D = JSON.parse(document.getElementById('fb-data').textContent);
const $ = (s) => document.querySelector(s);
const N = D.count;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let ed = new URLSearchParams(location.search).get('edition') === 'dark' ? 'dark' : 'light';
let cur = 1;
const src = (n, size) => `${D.base}pages/${ed}/${size}/p${String(n).padStart(2, '0')}.webp${D.v}`;
const isSpread = () => innerWidth >= 1000 && innerHeight >= 520;
function spreadOf(n) { if (!isSpread() || n === 1 || n === N) return [n]; const a = n % 2 === 0 ? n : n - 1; return a + 1 <= N - 1 ? [a, a + 1] : [a]; }
function fit(pages) {
  const st = $('#stage'), W = st.clientWidth - (innerWidth < 900 ? 16 : 128), H = st.clientHeight - 44;
  const r = 8.5 / 11, per = Math.min(H * r, W / pages.length);
  return Math.floor(per);
}
function pageEl(n, w) {
  const p = D.pages[n - 1], el = document.createElement('div');
  el.className = 'pg'; el.style.width = w + 'px';
  const img = new Image(); img.decoding = 'async';
  // Every page image on screen failed: almost always the flipbook was opened from inside a .zip.
  img.onerror = () => { img.dataset.bad = '1'; const all = document.querySelectorAll('#spread img'); if ([...all].every(i => i.dataset.bad)) $('#missing').classList.add('on'); };
  img.onload = () => $('#missing').classList.remove('on');
  img.src = src(n, w * devicePixelRatio > 1150 ? 'l' : 'm');
  img.alt = `Page ${n}: ${p.title}`; img.width = w; img.height = Math.round(w * 11 / 8.5);
  el.appendChild(img);
  for (const l of p.links) {
    const a = document.createElement('a'); a.className = 'hot'; a.href = l.href;
    a.style.cssText = `left:${l.x * 100}%;top:${l.y * 100}%;width:${l.w * 100}%;height:${l.h * 100}%`;
    if (l.href.startsWith('#p')) { a.addEventListener('click', (e) => { e.preventDefault(); go(+l.href.slice(2)); }); a.setAttribute('aria-label', 'Go to page ' + l.href.slice(2)); }
    else { a.target = '_blank'; a.rel = 'noopener'; a.setAttribute('aria-label', l.href.replace('mailto:', 'Email ')); }
    el.appendChild(a);
  }
  return el;
}
function preload(n) { [n - 2, n - 1, n + 1, n + 2, n + 3].filter(k => k >= 1 && k <= N).forEach(k => { const i = new Image(); i.src = src(k, 'm'); }); }
function render(dir = 0) {
  const pages = spreadOf(cur), w = fit(pages), sp = $('#spread');
  const draw = () => { sp.replaceChildren(...pages.map(n => pageEl(n, w))); sp.classList.remove('out-l', 'out-r'); };
  if (dir && !reduce) { sp.classList.add(dir > 0 ? 'out-l' : 'out-r'); setTimeout(draw, 180); } else draw();
  const label = pages.length > 1 ? `Pages ${pages[0]}–${pages[1]} of ${N}` : `Page ${pages[0]} of ${N}`;
  $('#count').textContent = label;
  $('#slider').value = cur; $('#goto').value = cur;
  $('#prev').disabled = pages[0] <= 1; $('#next').disabled = pages[pages.length - 1] >= N;
  document.querySelectorAll('#thumbs button').forEach(b => b.setAttribute('aria-current', pages.includes(+b.dataset.n) ? 'true' : 'false'));
  history.replaceState(null, '', `?edition=${ed}#p${cur}`);
  preload(cur);
}
function go(n, dir) { n = Math.max(1, Math.min(N, n | 0)); if (n === cur) return; const d = dir ?? Math.sign(n - cur); cur = n; closePanels(); render(d); }
function step(d) { const pages = spreadOf(cur); go(d > 0 ? pages[pages.length - 1] + 1 : pages[0] - 1, d); }
function setEdition(e) {
  ed = e; $('#edLight').setAttribute('aria-pressed', e === 'light'); $('#edDark').setAttribute('aria-pressed', e === 'dark');
  $('#dlBtn').href = D.pdf[e]; $('#dlBtn').setAttribute('aria-label', `Download the ${e} edition PDF`);
  document.querySelectorAll('#thumbs img').forEach(i => { i.src = src(+i.dataset.n, 's'); });
  render(); if ($('#zoom').classList.contains('on')) openZoom();
}
function closePanels() { ['#tocPanel', '#thumbPanel'].forEach(s => $(s).classList.remove('open')); $('#tocBtn').setAttribute('aria-expanded', 'false'); $('#thumbBtn').setAttribute('aria-expanded', 'false'); }
function toggle(panel, btn) { const open = !$(panel).classList.contains('open'); closePanels(); if (open) { $(panel).classList.add('open'); $(btn).setAttribute('aria-expanded', 'true'); $(panel).querySelector('a,button:not([data-close])')?.focus(); } }
// thumbnails (lazy)
$('#thumbs').innerHTML = D.pages.map(p => `<button data-n="${p.n}" aria-label="Page ${p.n}: ${p.title}"><img loading="lazy" data-n="${p.n}" src="${src(p.n, 's')}" alt="" width="160" height="207"><span>${String(p.n).padStart(2, '0')} · ${p.title}</span></button>`).join('');
$('#thumbs').addEventListener('click', e => { const b = e.target.closest('button'); if (b) go(+b.dataset.n); });
// contents
$('#toc').innerHTML = `<h3>Sections</h3>` + D.sections.map(s => `<a href="#p${s.page}" data-n="${s.page}"><b>${s.n}</b>${s.name}<span>${s.page}</span></a>`).join('') +
  `<h3>All pages</h3><div class="pl">` + D.pages.map(p => `<a href="#p${p.n}" data-n="${p.n}"><b>${String(p.n).padStart(2, '0')}</b>${p.title}</a>`).join('') + `</div>`;
$('#toc').addEventListener('click', e => { const a = e.target.closest('a'); if (a) { e.preventDefault(); go(+a.dataset.n); } });
document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closePanels));
// accessible reading mode: linear text of every page
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
$('#readerArticle').innerHTML = `<h1>Vision Performance Inc. — Corporate Profile 2026</h1><p class="sub">Accessible reading mode: the full text of the profile in reading order. <a href="${D.pdf.light}">Download the PDF</a>.</p>` +
  D.pages.map(p => `<section id="read-${p.n}" aria-labelledby="rh-${p.n}"><h2 id="rh-${p.n}">Page ${p.n} · ${esc(p.title)}</h2>${p.text.map(t => `<p>${esc(t)}</p>`).join('')}${p.alts.length ? `<p class="alt">Images: ${p.alts.map(esc).join('; ')}.</p>` : ''}${p.links.filter(l => !l.href.startsWith('#')).map(l => `<p><a href="${l.href}">${esc(l.href.replace('mailto:', ''))}</a></p>`).join('')}</section>`).join('');
function setReader(on) { $('#reader').classList.toggle('on', on); $('#readerBtn').setAttribute('aria-pressed', on); if (on) { $('#reader').focus(); document.getElementById('read-' + cur)?.scrollIntoView(); } }
$('#readerBtn').addEventListener('click', () => setReader(!$('#reader').classList.contains('on')));
// zoom (hi-res, pannable)
let zs = 1;
function openZoom() { $('#zoom').classList.add('on'); $('#zoomBtn').setAttribute('aria-pressed', 'true'); const z = $('#zimg'); z.src = src(cur, 'l'); z.alt = `Page ${cur}: ${D.pages[cur - 1].title}`; zs = 1; applyZ(); }
function applyZ() { $('#zimg').style.width = Math.round(Math.min(innerWidth - 20, 1100) * zs) + 'px'; }
function closeZoom() { $('#zoom').classList.remove('on'); $('#zoomBtn').setAttribute('aria-pressed', 'false'); }
$('#zoomBtn').addEventListener('click', () => $('#zoom').classList.contains('on') ? closeZoom() : openZoom());
$('#zIn').addEventListener('click', () => { zs = Math.min(3, zs + .5); applyZ(); });
$('#zOut').addEventListener('click', () => { zs = Math.max(.5, zs - .5); applyZ(); });
$('#zClose').addEventListener('click', closeZoom);
(() => { const z = $('#zoom'); let d = null; z.addEventListener('pointerdown', e => { if (e.target.closest('.btn')) return; d = { x: e.clientX, y: e.clientY, l: z.scrollLeft, t: z.scrollTop }; z.style.cursor = 'grabbing'; });
  addEventListener('pointerup', () => { d = null; z.style.cursor = ''; }); z.addEventListener('pointermove', e => { if (d) { z.scrollLeft = d.l - (e.clientX - d.x); z.scrollTop = d.t - (e.clientY - d.y); } }); })();
// controls
$('#prev').addEventListener('click', () => step(-1)); $('#next').addEventListener('click', () => step(1));
$('#slider').max = N; $('#goto').max = N;
$('#slider').addEventListener('change', e => go(+e.target.value)); $('#goto').addEventListener('change', e => go(+e.target.value));
$('#tocBtn').addEventListener('click', () => toggle('#tocPanel', '#tocBtn')); $('#thumbBtn').addEventListener('click', () => toggle('#thumbPanel', '#thumbBtn'));
$('#edLight').addEventListener('click', () => setEdition('light')); $('#edDark').addEventListener('click', () => setEdition('dark'));
$('#fsBtn').addEventListener('click', () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.());
addEventListener('keydown', e => {
  if (e.target.matches('input')) return;
  const k = e.key;
  if (k === 'ArrowRight' || k === 'PageDown') { e.preventDefault(); step(1); }
  else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); step(-1); }
  else if (k === 'Home') go(1); else if (k === 'End') go(N);
  else if (k === 'Escape') { closePanels(); closeZoom(); setReader(false); }
  else if (k === 't' || k === 'T') toggle('#thumbPanel', '#thumbBtn');
  else if (k === 'c' || k === 'C') toggle('#tocPanel', '#tocBtn');
  else if (k === 'r' || k === 'R') setReader(!$('#reader').classList.contains('on'));
  else if (k === 'z' || k === 'Z') $('#zoom').classList.contains('on') ? closeZoom() : openZoom();
  else if (k === 'f' || k === 'F') $('#fsBtn').click();
});
// swipe on touch devices
(() => { let x0 = null; $('#stage').addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  $('#stage').addEventListener('touchend', e => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); x0 = null; }); })();
let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => render(), 120); });
const h = /#p(\d+)/.exec(location.hash); if (h) cur = Math.max(1, Math.min(N, +h[1]));
addEventListener('hashchange', () => { const m = /#p(\d+)/.exec(location.hash); if (m && +m[1] !== cur) go(+m[1]); });
setEdition(ed);
