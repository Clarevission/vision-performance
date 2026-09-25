'use strict';
// End-to-end user journeys in a real browser (installed Chrome via playwright-core).
// Runs against a local in-process server by default; set E2E_BASE to target another
// environment (read-only journeys only — the form submission is skipped off-localhost).
// Run with `npm run test:e2e`.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require('playwright-core');

process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.CONTACT_RATE_LIMIT = '100';
// The API only accepts same-origin posts from http://localhost:$PORT, so listen on that port.
process.env.PORT = process.env.E2E_PORT || '3101';

let server, base, browser;
const remote = !!process.env.E2E_BASE;
const silence = console.log;

before(async () => {
  if (remote) base = process.env.E2E_BASE.replace(/\/$/, '');
  else {
    console.log = () => {}; // the mailer logs enquiries to the console when Resend isn't configured
    const app = require('../../server');
    server = app.listen(Number(process.env.PORT));
    await new Promise(r => server.once('listening', r));
    base = `http://localhost:${server.address().port}`;
  }
  browser = await chromium.launch({ channel: process.env.E2E_CHANNEL || 'chrome' });
});

after(async () => {
  await browser?.close();
  console.log = silence;
  if (server) {
    server.closeAllConnections();
    await new Promise(r => server.close(r));
    await require('../../lib/db').end();
  }
});

async function page(viewport = { width: 1440, height: 900 }) {
  const ctx = await browser.newContext({ viewport });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !/status of 404/.test(m.text())) errors.push(m.text()); });
  p.done = async () => { await ctx.close(); assert.deepEqual(errors, [], 'no console errors'); };
  return p;
}

test('employer: home → occupational vision → contact with topic preselected', async () => {
  const p = await page();
  await p.goto(base + '/');
  await p.click('.primary-nav__trigger[aria-controls="menu-solutions"]');
  await p.click('#menu-solutions a[href="/solutions/occupational-vision"]');
  await p.waitForURL('**/solutions/occupational-vision');
  assert.match(await p.textContent('h1'), /vision/i);
  await p.click('main a[href^="/contact?topic=occupational-vision"] >> nth=0');
  await p.waitForURL('**/contact?topic=occupational-vision');
  assert.equal(await p.inputValue('#cf-topic'), 'occupational-vision');
  await p.done();
});

test('mobile clinics are presented as planned, with a way to register interest', async () => {
  const p = await page();
  await p.goto(base + '/mobile-clinics');
  assert.ok(await p.locator('.status--development, .status--planned').count() > 0, 'status label visible');
  assert.ok(await p.locator('main a[href^="/contact"]').count() > 0, 'contact path present');
  await p.done();
});

test('SafetyOS and Mires product links open their sites in a new tab', async () => {
  const p = await page();
  for (const [path, host] of [['/technology/safetyos', 'safetyos.'], ['/technology/mires', 'mires.']]) {
    await p.goto(base + path);
    const link = p.locator(`main a[href*="${host}visionperformanceinc.ca"]`).first();
    assert.equal(await link.getAttribute('target'), '_blank', path);
    assert.match(await link.getAttribute('rel'), /noopener/, path);
    assert.match(await link.textContent(), /new tab/i, `${path}: screen-reader new-tab hint`);
  }
  await p.done();
});

test('safety eyewear: shortlist styles and carry them into an enquiry', async () => {
  const p = await page();
  await p.goto(base + '/solutions/prescription-safety-eyewear/styles');
  const toggles = p.locator('.shortlist-toggle');
  assert.ok(await toggles.count() >= 2);
  await toggles.nth(0).click();
  await toggles.nth(1).click();
  assert.equal(await toggles.nth(0).getAttribute('aria-pressed'), 'true');
  assert.match(await p.textContent('[data-shortlist-count]'), /2 items/);
  const labels = [await toggles.nth(0).getAttribute('data-label'), await toggles.nth(1).getAttribute('data-label')];
  await p.click('[data-shortlist-bar] a[href*="shortlist=1"]');
  await p.waitForURL('**/contact?**');
  assert.equal(await p.inputValue('#cf-topic'), 'safety-eyewear');
  const msg = await p.inputValue('#cf-message');
  for (const label of labels) assert.ok(msg.includes(`- ${label}`), `message lists ${label}`);
  await p.done();
});

test('resources: request a specific guide', async () => {
  const p = await page();
  await p.goto(base + '/resources');
  await p.click('main a[href*="guide=digital-eye-strain"]');
  await p.waitForURL('**/contact?**');
  assert.equal(await p.inputValue('#cf-topic'), 'resources');
  assert.match(await p.inputValue('#cf-message'), /Digital eye strain/);
  await p.done();
});

test('contact form: inline validation, error summary, then successful submission', async () => {
  const p = await page();
  await p.goto(base + '/contact');
  await p.click('form[data-contact-form] [type="submit"]');
  const summary = p.locator('[data-error-summary]');
  assert.equal(await summary.isVisible(), true, 'error summary shown');
  assert.equal(await p.getAttribute('#cf-name', 'aria-invalid'), 'true');
  assert.equal(await p.evaluate(() => document.activeElement.hasAttribute('data-error-summary')), true, 'focus moved to summary');
  if (remote) return p.done(); // never submit to a shared environment
  await p.fill('#cf-name', 'E2E Test');
  await p.fill('#cf-email', 'e2e@example.com');
  await p.selectOption('#cf-topic', 'occupational-vision');
  await p.fill('#cf-message', 'Automated end-to-end test message.');
  await p.click('form[data-contact-form] [type="submit"]');
  await p.waitForFunction(() => document.querySelector('[data-form-status]').textContent.trim().length > 0);
  assert.match(await p.textContent('[data-form-status]'), /Thank you/);
  await p.done();
});

test('mobile navigation opens, is keyboard-closable and reaches every section', async () => {
  const p = await page({ width: 375, height: 812 });
  await p.goto(base + '/');
  const toggle = p.locator('.menu-toggle');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(await p.isVisible('#mobile-nav'), true);
  for (const href of ['/solutions', '/technology', '/industries', '/mobile-clinics', '/about', '/resources', '/contact']) {
    assert.ok(await p.locator(`#mobile-nav a[href="${href}"]`).count() > 0, `mobile nav links to ${href}`);
  }
  await p.keyboard.press('Escape');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(await p.isVisible('#mobile-nav'), false);
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 0, `no horizontal scroll (${overflow}px)`);
  await p.done();
});

test('keyboard: skip link moves focus to main content', async () => {
  const p = await page();
  await p.goto(base + '/about');
  await p.keyboard.press('Tab');
  assert.equal(await p.evaluate(() => document.activeElement.className), 'skip-link');
  await p.keyboard.press('Enter');
  assert.equal(await p.evaluate(() => document.activeElement.id), 'main');
  await p.done();
});

test('unknown URLs show the helpful 404 page', async () => {
  const p = await page();
  const res = await p.goto(base + '/no-such-page');
  assert.equal(res.status(), 404);
  assert.ok(await p.locator('main a[href="/contact"]').count() > 0);
  await p.done();
});
