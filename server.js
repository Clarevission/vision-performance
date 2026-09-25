require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const site = require('./lib/pages');
const { current: analytics } = require('./lib/analytics');
const contactRoute     = require('./routes/contact');
const portalRoute      = require('./routes/portal');
const staffRoute       = require('./routes/staff');
const adminRoute       = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, 'public');
const CANONICAL_HOST = 'visionperformanceinc.ca';
const { pages, notFound, serverError } = site.load();
const sitemap = site.sitemapXml(pages);

// Render terminates TLS in front of the app; trust one proxy hop so rate limits see the client IP.
app.set('trust proxy', 1);

// ── Canonical host ──
// visionperformanceinc.com, www variants and the Render default hostname all reach this app.
// Serve pages only on the canonical .ca host; every other host gets a permanent redirect to the
// same path there. Local development hosts and the health check are exempt.
const LOCAL_HOST = /^(localhost|127\.0\.0\.1|\[::1\]|::1)$/i;
app.use((req, res, next) => {
  const host = (req.get('host') || '').replace(/:\d+$/, '').toLowerCase();
  if (!host || host === CANONICAL_HOST || LOCAL_HOST.test(host) || req.path === '/health') return next();
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  return res.redirect(301, `https://${CANONICAL_HOST}${req.originalUrl}`);
});

// Security headers. Corporate pages have no inline scripts or event handlers.
const CSP = {
  defaultSrc: ["'self'"],
  // Optional cookieless analytics (lib/analytics.js); empty unless CF_ANALYTICS_TOKEN is set.
  scriptSrc: ["'self'", ...analytics.scriptSrc],
  scriptSrcAttr: ["'none'"],
  // Fonts are self-hosted (public/assets/fonts), so no third-party style or font origins.
  styleSrc: ["'self'"],
  fontSrc: ["'self'"],
  // Stock photography is served from Unsplash's image CDN (see views/data/photos.js).
  imgSrc: ["'self'", 'data:', 'https://images.unsplash.com'],
  connectSrc: ["'self'", ...analytics.connectSrc],
  formAction: ["'self'"],
  frameSrc: ["'none'"],
  frameAncestors: ["'none'"],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
};
app.use(helmet({
  contentSecurityPolicy: { directives: CSP },
  // Send only the origin to other sites, so the SafetyOS and Mires sites can see referrals
  // from this site without receiving full URLs.
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));
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
    styleSrc: ["'self'", "'unsafe-inline'"],
  },
});
const noindex = (_req, res, next) => { res.setHeader('X-Robots-Tag', 'noindex, nofollow'); next(); };

// ── Redirects (see docs/audit/14-legacy-url-remediation.md) ──
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
  '/favicon.png': '/assets/img/vpi-favicon-32.png',
};
// Assets of the retired single-page site with no replacement.
const GONE = new Set(['/app.js', '/van.png', '/van.webp']);
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  if (req.path.startsWith('/api/')) return next();
  // Paths are lowercase; mixed-case variants would otherwise serve duplicate pages.
  if (/[A-Z]/.test(req.path)) {
    return res.redirect(301, req.path.toLowerCase() + req.originalUrl.slice(req.path.length));
  }
  if (REDIRECTS[req.path]) return res.redirect(301, REDIRECTS[req.path]);
  if (GONE.has(req.path)) return res.status(410).type('text/plain').send('Gone');
  if (req.path.length > 1 && req.path.endsWith('/')) {
    const q = req.originalUrl.slice(req.path.length);
    return res.redirect(301, req.path.replace(/\/+$/, '') + q);
  }
  next();
});

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Rate limits: all API routes, plus stricter limits on logins and the public contact form.
const limit = (max, windowMin, error) => rateLimit({
  windowMs: windowMin * 60 * 1000, max, standardHeaders: true, legacyHeaders: false, message: { error },
});
app.use('/api', limit(60, 15, 'Too many requests. Please try again later.'));
app.use('/api/portal/login', limit(10, 15, 'Too many login attempts.'));
app.use('/api/staff/login', limit(10, 15, 'Too many login attempts.'));
app.use('/api/contact', limit(Number(process.env.CONTACT_RATE_LIMIT) || 8, 15, 'Too many messages from this connection. Please try again later or email info@visionperformanceinc.ca.'));

// Reject cross-origin form submissions
const ALLOWED_ORIGINS = [
  `https://${CANONICAL_HOST}`,
  ...(process.env.APP_ORIGIN ? [process.env.APP_ORIGIN] : []),
  `http://localhost:${PORT}`,
];
app.use('/api', (req, res, next) => {
  if (req.path.startsWith('/admin')) return next();
  const origin = req.get('origin') || req.get('referer') || '';
  if (origin && !ALLOWED_ORIGINS.some(o => origin === o || origin.startsWith(`${o}/`))) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});

// API routes
app.use('/api/contact',     contactRoute);
app.use('/api/portal',      portalRoute);
app.use('/api/staff',       staffRoute);
app.use('/api/admin',       adminRoute);
// Enquiry endpoints of the retired single-page site. Clinical booking and mobile-clinic
// scheduling are not offered; all enquiries now go through /api/contact.
app.all(['/api/appointment', '/api/mobile', '/api/corporate'], (_req, res) => res.status(410).json({
  error: 'This form is no longer available. Please use the contact form at https://visionperformanceinc.ca/contact.',
}));
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Client portal and staff dashboard (authenticated apps)
app.get('/portal', noindex, legacyCsp, (_req, res) => res.sendFile(path.join(PUBLIC, 'portal.html')));
app.get('/staff',  noindex, legacyCsp, (_req, res) => res.sendFile(path.join(PUBLIC, 'staff.html')));
app.get(['/portal.html', '/staff.html'], (req, res) => res.redirect(301, req.path.replace('.html', '')));

// SEO files
app.get('/sitemap.xml', (_req, res) => res.type('application/xml').send(sitemap));
app.get('/favicon.ico', (_req, res) => res.type('image/png').sendFile(path.join(PUBLIC, 'assets/img/vpi-favicon-32.png')));

// Corporate pages (composed at boot from views/)
for (const [pagePath, page] of pages) {
  const handlers = /noindex/.test(page.meta.robots || '') ? [noindex] : [];
  app.get(pagePath, ...handlers, (_req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.type('html').send(page.html);
  });
}

// Static assets. /assets URLs carry a content hash (?v=…) or a versioned filename, so they can
// be cached for a year.
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

// Errors: never expose stack traces or internals.
app.use((err, req, res, _next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'The request could not be read.' });
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'The request is too large.' });
  console.error('Unhandled error:', err);
  res.status(500);
  if (req.path.startsWith('/api/') || !req.accepts('html')) return res.json({ error: 'Something went wrong. Please try again later.' });
  res.type('html').send(serverError.html);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Vision Performance server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
