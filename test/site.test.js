'use strict';
// Regression suite for the corporate site. Run with `npm test` (node:test, no dependencies).
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

process.env.NODE_ENV = 'test';
delete process.env.DATABASE_URL;
delete process.env.RESEND_API_KEY;

const app = require('../server');
const { load, SITE_URL } = require('../lib/pages');
const { pages } = load();

let base;
let server;
const silence = console.log;
before(async () => {
  console.log = () => {}; // mailer dev fallback logs every email
  await new Promise(r => { server = app.listen(0, r); });
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => { console.log = silence; server.close(); });

const get = (p, opts = {}) => fetch(base + p, { redirect: 'manual', ...opts });
const textOf = html => html
  .replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<svg[\s\S]*?<\/svg>/g, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
const attr = (html, re) => [...html.matchAll(re)].map(m => m[1]);

// ---------------------------------------------------------------- pages
for (const [p] of pages) {
  test(`page ${p}: status, metadata and structure`, async () => {
    const res = await get(p);
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type'), /text\/html/);
    const html = await res.text();

    assert.match(html, /<html lang="en-CA">/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, 'exactly one h1');
    const title = html.match(/<title>([^<]*)<\/title>/)[1];
    assert.ok(title.length >= 15 && title.length <= 70, `title length ${title.length}: ${title}`);
    const desc = html.match(/<meta name="description" content="([^"]*)"/)[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"');
    assert.ok(desc.length >= 70 && desc.length <= 170, `description length ${desc.length}`);
    assert.ok(html.includes(`<link rel="canonical" href="${SITE_URL}${p === '/' ? '/' : p}">`), 'canonical');
    assert.match(html, /<meta property="og:image" content="https:\/\/visionperformanceinc\.ca\/assets\/img\/og-default\.jpg">/);
    assert.ok(!/\{\{|\}\}/.test(html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')), 'no unresolved template tokens');

    for (const block of attr(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(block);

    const ids = attr(html, /\sid="([^"]+)"/g);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    assert.deepEqual(dupes, [], 'no duplicate ids');
    for (const ref of [...attr(html, /aria-(?:controls|labelledby|describedby)="([^"]+)"/g).flatMap(v => v.split(' ')),
      ...attr(html, /href="#([^"]+)"/g)]) {
      assert.ok(ids.includes(ref), `reference #${ref} resolves`);
    }
    for (const img of html.match(/<img\b[^>]*>/g) || []) assert.match(img, /\salt="/, `img has alt: ${img}`);
    assert.ok(!/\sonclick=|\sonload=|\sonerror=/.test(html), 'no inline event handlers');
    assert.ok(!/\sstyle="/.test(html), 'no inline style attributes (CSP)');
  });
}

test('internal links resolve to real pages, anchors and assets', async () => {
  const targets = new Set([...pages.keys(), '/portal']);
  const problems = [];
  for (const [p, page] of pages) {
    for (const href of attr(page.html, /href="(\/[^"]*)"/g)) {
      const [pathPart, hash] = href.replace(/&amp;/g, '&').split('#');
      const clean = pathPart.split('?')[0];
      if (clean.startsWith('/assets/') || clean.startsWith('/images/')) {
        if (!fs.existsSync(path.join(__dirname, '..', 'public', clean))) problems.push(`${p} → missing asset ${clean}`);
        continue;
      }
      if (!targets.has(clean)) { problems.push(`${p} → ${href}`); continue; }
      if (hash && !pages.get(clean).html.includes(`id="${hash}"`)) problems.push(`${p} → ${href} (anchor missing)`);
    }
  }
  assert.deepEqual(problems, []);
});

test('every icon referenced exists in the sprite', () => {
  const sprite = fs.readFileSync(path.join(__dirname, '../views/partials/icons.html'), 'utf8');
  for (const [, page] of pages) {
    for (const id of attr(page.html, /<use href="#([^"]+)"/g)) assert.ok(sprite.includes(`id="${id}"`), `icon ${id}`);
  }
});

// ---------------------------------------------------------------- truthfulness guards
const FORBIDDEN = [
  [/verified (client )?reviews?/i, 'unverified testimonials'],
  [/testimonial/i, 'testimonials'],
  [/CSA[\s-]*Z94\.3[\s-]*(certified|compliant)/i, 'CSA certification claim'],
  [/our (licensed )?optometrists/i, 'clinician claim'],
  [/licensed optometrists (on staff|registered)/i, 'clinician claim'],
  [/our (edmonton )?clinic\b/i, 'clinic claim'],
  [/\$\s?\d/, 'pricing'],
  [/\bROI\b|savings calculator/i, 'ROI calculator'],
  [/carbon[\s-]neutral|carbon offset|bio-acetate|lens recycling/i, 'sustainability claim'],
  [/free trial|satisfaction guarantee|no questions asked/i, 'offer/guarantee'],
  [/PIPEDA[\s-]compliant/i, 'compliance badge'],
  [/single sign-on|\bSSO\b/i, 'unimplemented feature'],
  [/(serving|serves|on-site|services) (professionals )?across Canada/i, 'national coverage claim'],
  [/nationwide/i, 'national coverage claim'],
  [/trusted by/i, 'social proof claim'],
  [/app\.visionperformanceinc\.ca/i, 'internal Command Centre link'],
];
test('no unverified claims or internal links are published', () => {
  const hits = [];
  for (const [p, page] of pages) {
    const text = textOf(page.html) + ' ' + attr(page.html, /href="([^"]+)"/g).join(' ');
    for (const [re, why] of FORBIDDEN) if (re.test(text)) hits.push(`${p}: ${why} (${text.match(re)[0]})`);
  }
  assert.deepEqual(hits, []);
});

test('planned and in-development services carry status labels', () => {
  assert.match(pages.get('/mobile-clinics').html, /status--planned/);
  assert.match(pages.get('/mobile-clinics').html, /not yet operating/i);
  for (const p of ['/solutions/occupational-vision', '/solutions/prescription-safety-eyewear',
    '/solutions/visual-ergonomics', '/solutions/workplace-eye-health']) {
    assert.match(pages.get(p).html, /status--development/, p);
  }
  assert.match(pages.get('/technology/operations').html, /Not offered for sale/);
  assert.match(pages.get('/about').html, /Lunettes Emporium[\s\S]{0,200}not yet open/);
});

test('eyewear style data has no prices, certifications or product claims', () => {
  const { styles, lensFeatures } = require('../views/data/eyewear-styles');
  const text = JSON.stringify([styles.map(s => ({ ...s, svg: '' })), lensFeatures]);
  assert.ok(!/\$\s?\d|certified|compliant|guarantee/i.test(text));
  for (const s of styles) assert.deepEqual(s.frames, [], `${s.id}: frames must come from a signed supplier`);
});

// ---------------------------------------------------------------- routing
test('legacy URLs redirect permanently', async () => {
  const cases = {
    '/shop': '/solutions/prescription-safety-eyewear/styles', '/book': '/contact', '/learn': '/resources',
    '/mobile': '/mobile-clinics', '/industrial': '/solutions/occupational-vision', '/index.html': '/',
    '/about/': '/about', '/portal.html': '/portal',
  };
  for (const [from, to] of Object.entries(cases)) {
    const res = await get(from);
    assert.equal(res.status, 301, from);
    assert.equal(res.headers.get('location'), to, from);
  }
});

test('unknown pages return a real 404', async () => {
  const res = await get('/no-such-page', { headers: { accept: 'text/html' } });
  assert.equal(res.status, 404);
  assert.match(await res.text(), /We couldn't find that page/);
  assert.equal((await get('/api/nope')).status, 404);
});

test('sitemap lists indexable pages only; robots points to it', async () => {
  const xml = await (await get('/sitemap.xml')).text();
  for (const [p, page] of pages) {
    const listed = xml.includes(`<loc>${SITE_URL}${p === '/' ? '/' : p}</loc>`);
    if (/noindex/.test(page.meta.robots || '') || page.meta.sitemap === false) assert.ok(!listed, `${p} excluded`);
    else assert.ok(listed, `${p} listed`);
  }
  assert.ok(!/portal|staff|thank-you/.test(xml));
  assert.match(await (await get('/robots.txt')).text(), /Sitemap: https:\/\/visionperformanceinc\.ca\/sitemap\.xml/);
});

test('portal and staff stay reachable but are not indexed', async () => {
  for (const p of ['/portal', '/staff']) {
    const res = await get(p);
    assert.equal(res.status, 200, p);
    assert.equal(res.headers.get('x-robots-tag'), 'noindex, nofollow', p);
    assert.match(await res.text(), /name="robots" content="noindex/);
  }
});

test('security headers are set on corporate pages', async () => {
  const res = await get('/');
  const csp = res.headers.get('content-security-policy');
  assert.match(csp, /script-src 'self'/);
  assert.match(csp, /script-src-attr 'none'/);
  assert.match(csp, /frame-ancestors 'none'/);
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  assert.match(res.headers.get('permissions-policy'), /camera=\(\)/);
});

test('hashed assets are served with long-lived caching', async () => {
  const html = await (await get('/')).text();
  const css = html.match(/href="(\/assets\/css\/site\.css\?v=[a-f0-9]+)"/)[1];
  const res = await get(css);
  assert.equal(res.status, 200);
  assert.match(res.headers.get('cache-control'), /immutable/);
  const js = html.match(/src="(\/assets\/js\/site\.js\?v=[a-f0-9]+)"/)[1];
  assert.equal((await get(js)).status, 200);
});

test('client script parses', () => {
  new vm.Script(fs.readFileSync(path.join(__dirname, '../public/assets/js/site.js'), 'utf8'));
});

// ---------------------------------------------------------------- forms
const post = (p, body, type = 'application/json', accept = 'application/json') => fetch(base + p, {
  method: 'POST', redirect: 'manual',
  headers: { 'Content-Type': type, Accept: accept },
  body: type === 'application/json' ? JSON.stringify(body) : new URLSearchParams(body).toString(),
});
const valid = { name: 'Test Person', email: 'test@example.com', topic: 'occupational-vision', message: 'Hello', organization: 'Acme', role: 'HSE Manager', phone: '' };

test('contact API validates input', async () => {
  assert.equal((await post('/api/contact', { ...valid, name: '' })).status, 400);
  assert.equal((await post('/api/contact', { ...valid, email: 'not-an-email' })).status, 400);
  assert.equal((await post('/api/contact', { ...valid, topic: 'nonsense' })).status, 400);
  assert.equal((await post('/api/contact', { ...valid, phone: 'call me maybe' })).status, 400);
});

test('contact API accepts a valid enquiry (JSON and no-JS form post)', async () => {
  const res = await post('/api/contact', valid);
  assert.equal(res.status, 200);
  assert.ok((await res.json()).message);
  const form = await post('/api/contact', valid, 'application/x-www-form-urlencoded', 'text/html,application/xhtml+xml');
  assert.equal(form.status, 303);
  assert.equal(form.headers.get('location'), '/contact/thank-you');
});

test('contact API silently drops honeypot submissions', async () => {
  const res = await post('/api/contact', { ...valid, website: 'http://spam.example' });
  assert.equal(res.status, 200);
});

test('contact topics match the form options', () => {
  const { TOPICS } = require('../routes/contact');
  const formHtml = fs.readFileSync(path.join(__dirname, '../views/partials/contact-form.html'), 'utf8');
  const options = attr(formHtml, /<option value="([^"]+)"/g);
  assert.deepEqual(options.sort(), Object.keys(TOPICS).sort());
});

test('retired appointment endpoint returns 410', async () => {
  assert.equal((await post('/api/appointment', { name: 'x', email: 'x@example.com' })).status, 410);
});

test('cross-origin API posts are rejected', async () => {
  const res = await fetch(base + '/api/contact', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://evil.example' }, body: JSON.stringify(valid),
  });
  assert.equal(res.status, 403);
});
