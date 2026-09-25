require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const site = require('./lib/pages');
const contactRoute     = require('./routes/contact');
const mobileRoute      = require('./routes/mobile');
const corporateRoute   = require('./routes/corporate');
const portalRoute      = require('./routes/portal');
const staffRoute       = require('./routes/staff');
const adminRoute       = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, 'public');
const { pages, notFound } = site.load();
const sitemap = site.sitemapXml(pages);

// Render terminates TLS in front of the app; trust one proxy hop so rate limits see the client IP.
app.set('trust proxy', 1);

// Security headers. Corporate pages have no inline scripts or event handlers.
const CSP = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'"],
  scriptSrcAttr: ["'none'"],
  styleSrc: ["'self'", 'https://fonts.googleapis.com'],
  fontSrc: ["'self'", 'https://fonts.gstatic.com'],
  // Stock photography is served from Unsplash's image CDN (see views/data/photos.js).
  imgSrc: ["'self'", 'data:', 'https://images.unsplash.com'],
  connectSrc: ["'self'"],
  formAction: ["'self'"],
  frameSrc: ["'none'"],
  frameAncestors: ["'none'"],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
};
app.use(helmet({ contentSecurityPolicy: { directives: CSP } }));
app.use((_req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  next();
});

// The client portal and staff dashboard still use inline styles/handlers (see backlog),
// so they get a looser policy and are kept out of search indexes.
const legacyCsp = helmet.contentSecurityPolicy({
  directives: {
    ...CSP,
    scriptSrcAttr: ["'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  },
});
const noindex = (_req, res, next) => { res.setHeader('X-Robots-Tag', 'noindex, nofollow'); next(); };

// ── Redirects ──
const REDIRECTS = {
  '/shop': '/solutions/prescription-safety-eyewear/styles',
  '/book': '/contact',
  '/learn': '/resources',
  '/mobile': '/mobile-clinics',
  '/mobile-clinic': '/mobile-clinics',
  '/industrial': '/solutions/occupational-vision',
  '/industrial-programs': '/solutions/occupational-vision',
  '/index.html': '/',
  '/home': '/',
};
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  if (REDIRECTS[req.path]) return res.redirect(301, REDIRECTS[req.path]);
  if (req.path.length > 1 && req.path.endsWith('/') && !req.path.startsWith('/api/')) {
    const q = req.originalUrl.slice(req.path.length);
    return res.redirect(301, req.path.replace(/\/+$/, '') + q);
  }
  next();
});

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Rate limit all API routes
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
}));
app.use('/api/portal/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { error: 'Too many login attempts.' } }));
app.use('/api/staff/login',  rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { error: 'Too many login attempts.' } }));

// Reject cross-origin form submissions
const ALLOWED_ORIGINS = [
  'https://visionperformanceinc.ca',
  'https://www.visionperformanceinc.ca',
  'https://visionperformanceinc.com',
  'https://www.visionperformanceinc.com',
  ...(process.env.APP_ORIGIN ? [process.env.APP_ORIGIN] : []),
  `http://localhost:${PORT}`,
];
app.use('/api', (req, res, next) => {
  if (req.path.startsWith('/admin')) return next();
  const origin = req.get('origin') || req.get('referer') || '';
  if (origin && !ALLOWED_ORIGINS.some(o => origin.startsWith(o))) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});

// API routes
app.use('/api/contact',     contactRoute);
app.use('/api/mobile',      mobileRoute);
app.use('/api/corporate',   corporateRoute);
app.use('/api/portal',      portalRoute);
app.use('/api/staff',       staffRoute);
app.use('/api/admin',       adminRoute);
// Clinical appointment intake was retired with the 2026 refresh (no clinical services are offered yet).
app.all('/api/appointment', (_req, res) => res.status(410).json({
  error: 'Appointment booking is not available. Please use the contact form at /contact.',
}));
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Client portal and staff dashboard (authenticated apps; unchanged)
app.get('/portal', noindex, legacyCsp, (_req, res) => res.sendFile(path.join(PUBLIC, 'portal.html')));
app.get('/staff',  noindex, legacyCsp, (_req, res) => res.sendFile(path.join(PUBLIC, 'staff.html')));
app.get(['/portal.html', '/staff.html'], (req, res) => res.redirect(301, req.path.replace('.html', '')));

// SEO files
app.get('/sitemap.xml', (_req, res) => res.type('application/xml').send(sitemap));
app.get('/favicon.ico', (_req, res) => res.type('image/png').sendFile(path.join(PUBLIC, 'assets/img/favicon-32.png')));

// Corporate pages (composed at boot from views/)
for (const [pagePath, page] of pages) {
  const handlers = /noindex/.test(page.meta.robots || '') ? [noindex] : [];
  app.get(pagePath, ...handlers, (_req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.type('html').send(page.html);
  });
}

// Static assets. /assets URLs carry a content hash (?v=…), so they can be cached for a year.
app.use('/assets', express.static(path.join(PUBLIC, 'assets'), { maxAge: '365d', immutable: true }));
app.use(express.static(PUBLIC, {
  index: false,
  maxAge: '1d',
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
  },
}));

// 404
app.use((req, res) => {
  res.status(404);
  if (req.accepts('html')) return res.type('html').send(notFound.html);
  res.json({ error: 'Not found' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Vision Performance server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
