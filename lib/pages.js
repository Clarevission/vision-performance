'use strict';
// Server-side page composer for the corporate site.
// Pages live in views/pages/**.html and start with <!--meta {JSON}-->.
// Partials: {{> name key="value"}}; inside a partial, {{$key}} is a param and
// {{#$key}}…{{/$key}} renders only when the param is non-empty.
// Globals ({{year}}, {{asset_css}} …) are resolved last, after the layout wrap.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const VIEWS = path.join(ROOT, 'views');
const PUBLIC = path.join(ROOT, 'public');
const SITE_URL = 'https://visionperformanceinc.ca';
const SITE_NAME = 'Vision Performance Inc.';
const DEFAULT_OG = '/assets/img/vpi-share.jpg';

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const read = f => fs.readFileSync(f, 'utf8').replace(/^﻿/, '');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d =>
    d.isDirectory() ? walk(path.join(dir, d.name)) : d.name.endsWith('.html') ? [path.join(dir, d.name)] : []);
}

function fileHash(rel) {
  return crypto.createHash('md5').update(fs.readFileSync(path.join(PUBLIC, rel))).digest('hex').slice(0, 10);
}

const PARTIAL_RE = /\{\{>\s*([\w-]+)((?:\s+[\w-]+="[^"]*")*)\s*\}\}/g;

function renderPartials(html, ctx, depth = 0) {
  if (depth > 6) throw new Error('Partial nesting too deep');
  return html.replace(PARTIAL_RE, (_, name, attrStr) => {
    const params = {};
    for (const [, k, v] of attrStr.matchAll(/([\w-]+)="([^"]*)"/g)) params[k] = v;
    let out;
    if (ctx.dynamic[name]) out = ctx.dynamic[name](params, ctx);
    else if (ctx.partials[name] != null) out = ctx.partials[name];
    else throw new Error(`Unknown partial "${name}" in ${ctx.file}`);
    // Sections may nest, so repeat until stable.
    for (let prev; prev !== out;) {
      prev = out;
      out = out
        .replace(/\{\{#\$([\w-]+)\}\}([\s\S]*?)\{\{\/\$\1\}\}/g, (m, k, inner) => (params[k] ? inner : ''))
        .replace(/\{\{\^\$([\w-]+)\}\}([\s\S]*?)\{\{\/\$\1\}\}/g, (m, k, inner) => (params[k] ? '' : inner));
    }
    out = out.replace(/\{\{\$([\w-]+)\}\}/g, (m, k) => params[k] ?? '');
    return renderPartials(out, ctx, depth + 1);
  });
}

function breadcrumbHtml(meta) {
  if (meta.path === '/' || !meta.crumb) return '';
  const trail = [['Home', '/'], ...(meta.breadcrumb || [])];
  const items = trail.map(([label, href]) => `<li><a href="${esc(href)}">${esc(label)}</a></li>`).join('');
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items}<li><span aria-current="page">${esc(meta.crumb)}</span></li></ol></nav>`;
}

function jsonLd(meta, org) {
  const blocks = [];
  if (meta.path === '/') {
    blocks.push(org, { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: SITE_URL + '/' });
  } else if (meta.crumb) {
    const trail = [['Home', '/'], ...(meta.breadcrumb || []), [meta.crumb, meta.path]];
    blocks.push({
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: trail.map(([name, href], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE_URL + href })),
    });
  }
  for (const s of meta.schema || []) blocks.push({ '@context': 'https://schema.org', ...s });
  return blocks.map(b => `<script type="application/ld+json">${JSON.stringify(b).replace(/</g, '\\u003c')}</script>`).join('\n');
}

const ORG = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL + '/',
  logo: SITE_URL + '/assets/img/vpi-icon-512.png',
  email: 'info@visionperformanceinc.ca',
  telephone: '+1-780-886-4397',
  address: { '@type': 'PostalAddress', addressLocality: 'Edmonton', addressRegion: 'AB', addressCountry: 'CA' },
  brand: [
    { '@type': 'Brand', name: 'VPI SafetyOS', url: 'https://safetyos.visionperformanceinc.ca/' },
    { '@type': 'Brand', name: 'VPI Mires', url: 'https://mires.visionperformanceinc.ca/' },
  ],
};

function load() {
  const partials = {};
  for (const f of walk(path.join(VIEWS, 'partials'))) partials[path.basename(f, '.html')] = read(f);
  const dynamic = require('./dynamic-partials');
  const layout = read(path.join(VIEWS, 'layout.html'));
  const globals = {
    year: String(new Date().getFullYear()),
    site_url: SITE_URL,
    asset_css: '/assets/css/site.css?v=' + fileHash('assets/css/site.css'),
    asset_js: '/assets/js/site.js?v=' + fileHash('assets/js/site.js'),
  };

  const pages = new Map();
  let notFound = null;
  for (const file of walk(path.join(VIEWS, 'pages'))) {
    const src = read(file);
    const m = src.match(/^\s*<!--meta\s*([\s\S]*?)-->/);
    if (!m) throw new Error(`Missing <!--meta--> block in ${file}`);
    const meta = JSON.parse(m[1]);
    const ctx = { partials, dynamic, file, meta };
    const body = renderPartials(src.slice(m[0].length), ctx);
    const canonical = SITE_URL + (meta.path === '/' ? '/' : meta.path);
    // Keep titles inside search-result width: fall back to the short brand when the full one won't fit.
    const full = `${meta.title} | ${SITE_NAME}`;
    const title = meta.path === '/' ? meta.title : full.length <= 65 ? full : `${meta.title} | VPI`;
    const vars = {
      ...globals,
      title: esc(title),
      og_title: esc(meta.ogTitle || meta.title),
      description: esc(meta.description),
      canonical: esc(canonical),
      robots: esc(meta.robots || 'index, follow'),
      og_image: SITE_URL + (meta.ogImage || DEFAULT_OG),
      og_type: meta.path === '/' ? 'website' : 'article',
      jsonld: jsonLd(meta, ORG),
      breadcrumbs: breadcrumbHtml(meta),
      body_class: esc(meta.bodyClass || ''),
      section: esc(meta.section || ''),
    };
    let html = renderPartials(layout, ctx).replace('{{content}}', () => body);
    html = html.replace(/\{\{([a-z_]+)\}\}/g, (tok, k) => (k in vars ? vars[k] : tok));
    // Navigation state: exact page gets aria-current, its section gets .is-active.
    html = html.split(`data-nav="${meta.path}"`).join(`data-nav="${meta.path}" aria-current="page"`);
    if (meta.section) html = html.split(`data-section="${meta.section}"`).join(`data-section="${meta.section}" data-active`);
    const leftover = html.match(/\{\{[^}]*\}\}/);
    if (leftover) throw new Error(`Unresolved token ${leftover[0]} in ${file}`);
    const page = { meta, html, file };
    if (meta.path === '/404') notFound = page;
    else pages.set(meta.path, page);
  }
  return { pages, notFound };
}

function sitemapXml(pages) {
  const urls = [...pages.values()]
    .filter(p => p.meta.sitemap !== false && !/noindex/.test(p.meta.robots || ''))
    .sort((a, b) => a.meta.path.localeCompare(b.meta.path))
    .map(p => `  <url><loc>${SITE_URL}${p.meta.path === '/' ? '/' : p.meta.path}</loc>` +
      `<changefreq>${p.meta.changefreq || 'monthly'}</changefreq><priority>${p.meta.priority || '0.6'}</priority></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

module.exports = { load, sitemapXml, SITE_URL, esc };
