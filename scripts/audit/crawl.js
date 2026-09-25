'use strict';
// Audit crawler: screenshots, layout checks, axe accessibility scans and console/network errors
// for every public route at the audit viewports, using the locally installed Chrome (or Edge).
//
//   node scripts/audit/crawl.js --label baseline [--base https://visionperformanceinc.ca] [--no-shots]
//
// Without --base, a local production-mode server is started on port 3100.
// Output: docs/audit/<shotsDir>/*.jpg (git-ignored) and docs/audit/data/crawl-<label>.json.
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(`--${name}`); return i === -1 ? dflt : args[i + 1]; };
const LABEL = opt('label', 'run');
const BASE = opt('base', null);
const SHOTS = !args.includes('--no-shots');
const CHANNEL = opt('channel', 'chrome');
const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(ROOT, 'docs', 'audit');
const SHOT_DIR = path.join(OUT, LABEL === 'after' ? 'screenshots-after' : 'screenshots');

const VIEWPORTS = [
  [1920, 1080], [1440, 900], [1280, 800], [1024, 768], [768, 1024],
  [430, 932], [390, 844], [375, 812], [320, 568],
];
const AXE_VIEWPORTS = new Set(['1440x900', '375x812']);

// In-page layout analysis (same rules as the manual audit): grid rows with gaps, lopsided
// two-column sections, blank card space, narrow orphan blocks, overlaps, clipping, overflow.
function analyze() {
  const vis = el => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    if (!(r.width > 0 && r.height > 0)) return false;
    if (el.closest('[hidden],.visually-hidden,.icon-sprite,.skip-link,.field--hp,.mobile-nav,.mega')) return false;
    const d = el.closest('details:not([open])');
    return !(d && !el.closest('summary'));
  };
  const name = el => el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
  const txt = el => (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
  const issues = [];
  document.querySelectorAll('main *').forEach(g => {
    if (getComputedStyle(g).display !== 'grid' || !vis(g)) return;
    const kids = [...g.children].filter(vis);
    if (kids.length < 2) return;
    const tops = [...new Set(kids.map(k => Math.round(k.getBoundingClientRect().top)))].sort((a, b) => a - b);
    if (tops.length < 2) return;
    const W = g.getBoundingClientRect().width;
    const row = t => kids.filter(k => Math.abs(k.getBoundingClientRect().top - t) < 3);
    const rowW = t => row(t).reduce((s, k) => s + k.getBoundingClientRect().width, 0);
    if (rowW(tops[0]) > W * 0.9 && rowW(tops[tops.length - 1]) < W * 0.75 && row(tops[0]).length > 1) {
      issues.push({ type: 'grid-last-row-gap', el: name(g), near: txt(kids[0]) });
    }
  });
  document.querySelectorAll('main .split, main .page-hero__grid, main .hero__grid, main .legal-layout').forEach(s => {
    const kids = [...s.children].filter(vis);
    if (kids.length !== 2) return;
    const [a, b] = kids.map(k => k.getBoundingClientRect());
    if (b.left < a.right - 5 || getComputedStyle(kids[1]).position === 'sticky') return;
    const hs = [a.height, b.height];
    if (Math.max(...hs) - Math.min(...hs) > 140 && Math.min(...hs) / Math.max(...hs) < 0.7) {
      issues.push({ type: 'split-imbalance', el: name(s), heights: hs.map(Math.round), near: txt(s) });
    }
  });
  document.querySelectorAll('main .card, main .product-card, main .style-card, main .steps li').forEach(c => {
    if (!vis(c)) return;
    const kids = [...c.children].filter(vis);
    if (!kids.length) return;
    const content = Math.max(...kids.map(k => k.getBoundingClientRect().bottom)) - Math.min(...kids.map(k => k.getBoundingClientRect().top));
    const cs = getComputedStyle(c);
    const blank = c.getBoundingClientRect().height - content - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    if (blank > 90) issues.push({ type: 'card-blank', el: name(c), blank: Math.round(blank), near: txt(c) });
  });
  if (innerWidth >= 900) {
    document.querySelectorAll('main .container').forEach(ct => {
      const CW = ct.getBoundingClientRect().width - parseFloat(getComputedStyle(ct).paddingLeft) * 2;
      [...ct.children].filter(vis).forEach(ch => {
        const r = ch.getBoundingClientRect();
        if (r.height < 260 || ch.matches('.section-head,.crumbs')) return;
        const beside = [...ct.children].filter(o => o !== ch && vis(o)).some(o => { const q = o.getBoundingClientRect(); return q.top < r.bottom && q.bottom > r.top; });
        if (!beside && r.width < CW * 0.62) issues.push({ type: 'narrow-orphan', el: name(ch), near: txt(ch) });
      });
    });
  }
  const leaves = [...document.querySelectorAll('body *')].filter(el => vis(el) &&
    (el.tagName === 'IMG' || [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) && !el.closest('.photo-tile,.shortlist-bar'));
  const rects = leaves.flatMap(el => [...el.getClientRects()].map(r => [el, r]));
  for (let i = 0; i < rects.length; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      const [e1, a] = rects[i]; const [e2, b] = rects[j];
      if (e1 === e2 || e1.contains(e2) || e2.contains(e1)) continue;
      const ix = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const iy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (ix > 3 && iy > 3) issues.push({ type: 'overlap', a: `${name(e1)} "${txt(e1)}"`, b: `${name(e2)} "${txt(e2)}"` });
    }
  }
  document.querySelectorAll('body *').forEach(el => {
    if (!vis(el)) return;
    const cs = getComputedStyle(el);
    if (el.scrollWidth > el.clientWidth + 2 && !['auto', 'scroll'].includes(cs.overflowX) && el.clientWidth > 0 &&
      !el.closest('.table-wrap') && !['IMG', 'svg', 'use', 'path'].includes(el.tagName)) {
      issues.push({ type: 'clipped', el: name(el), near: txt(el) });
    }
  });
  if (document.documentElement.scrollWidth > innerWidth) issues.push({ type: 'page-overflow' });
  const broken = [...document.images].filter(i => i.complete && !i.naturalWidth).map(i => i.currentSrc || i.src);
  if (broken.length) issues.push({ type: 'broken-image', srcs: broken });
  return issues;
}

async function startLocal() {
  const port = 3100;
  const child = spawn(process.execPath, ['server.js'], {
    cwd: ROOT, env: { ...process.env, PORT: String(port), NODE_ENV: 'production', DATABASE_URL: '', RESEND_API_KEY: '' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  await new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('server did not start')), 15000);
    child.stdout.on('data', d => { if (/running on/.test(String(d))) { clearTimeout(t); resolve(); } });
    child.on('exit', c => reject(new Error(`server exited ${c}`)));
  });
  return { base: `http://localhost:${port}`, stop: () => child.kill() };
}

(async () => {
  const server = BASE ? null : await startLocal();
  const base = BASE || server.base;
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  const routes = [...sitemap.matchAll(/<loc>https:\/\/visionperformanceinc\.ca([^<]*)<\/loc>/g)].map(m => m[1] || '/');
  routes.push('/contact/thank-you', '/this-page-does-not-exist');
  if (SHOTS) fs.mkdirSync(SHOT_DIR, { recursive: true });
  fs.mkdirSync(path.join(OUT, 'data'), { recursive: true });

  const browser = await chromium.launch({ channel: CHANNEL, headless: true });
  const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
  const result = { label: LABEL, base, channel: CHANNEL, date: new Date().toISOString(), routes: routes.length, viewports: VIEWPORTS.map(v => v.join('x')), pages: {} };
  let shots = 0;

  for (const route of routes) {
    const slug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/[/?#]+/g, '-');
    const entry = result.pages[route] = { layout: {}, axe: {}, console: [], failedRequests: [], status: null };
    for (const [w, h] of VIEWPORTS) {
      const vp = `${w}x${h}`;
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, bypassCSP: AXE_VIEWPORTS.has(vp) });
      const page = await ctx.newPage();
      page.on('console', m => { if (m.type() === 'error') entry.console.push(`${vp}: ${m.text().slice(0, 200)}`); });
      page.on('requestfailed', r => entry.failedRequests.push(`${vp}: ${r.url().slice(0, 120)} (${r.failure() && r.failure().errorText})`));
      const resp = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 45000 }).catch(e => ({ status: () => `ERR ${e.message.slice(0, 80)}` }));
      entry.status = resp.status();
      // Make lazy images load before measuring and capturing.
      await page.evaluate(async () => {
        document.querySelectorAll('img[loading="lazy"]').forEach(i => { i.loading = 'eager'; });
        await Promise.all([...document.images].map(i => (i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 8000); }))));
      });
      const issues = await page.evaluate(analyze);
      if (issues.length) entry.layout[vp] = issues;
      if (AXE_VIEWPORTS.has(vp)) {
        await page.addScriptTag({ content: axeSource });
        const axe = await page.evaluate(async () => {
          const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } });
          return r.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length, targets: v.nodes.slice(0, 3).map(n => n.target.join(' ')) }));
        });
        if (axe.length) entry.axe[vp] = axe;
      }
      if (SHOTS) {
        await page.screenshot({ path: path.join(SHOT_DIR, `${slug}-${vp}.jpg`), fullPage: true, type: 'jpeg', quality: 55 });
        shots++;
      }
      await ctx.close();
    }
    const n = Object.values(entry.layout).flat().length + Object.values(entry.axe).flat().length + entry.console.length + entry.failedRequests.length;
    console.log(`${String(entry.status).padEnd(4)} ${route.padEnd(48)} findings: ${n}`);
  }
  result.screenshots = shots;
  await browser.close();
  if (server) server.stop();
  const file = path.join(OUT, 'data', `crawl-${LABEL}.json`);
  fs.writeFileSync(file, JSON.stringify(result, null, 2));
  console.log(`\nSaved ${path.relative(ROOT, file)} (${shots} screenshots)`);
})().catch(e => { console.error(e); process.exit(1); });
