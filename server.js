require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const path = require('path');

const contactRoute = require('./routes/contact');
const mobileRoute = require('./routes/mobile');
const corporateRoute = require('./routes/corporate');
const portalRoute = require('./routes/portal');
const adminRoute = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      scriptSrcAttr: ["'unsafe-inline'"],
    },
  },
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Sessions — stored in PostgreSQL so they survive restarts
if (process.env.DATABASE_URL) {
  app.use(session({
    store: new pgSession({
      conString: process.env.DATABASE_URL,
      tableName: 'session',
      ssl: { rejectUnauthorized: false },
    }),
    secret: process.env.SESSION_SECRET || 'vpi-dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
      sameSite: 'lax',
    },
  }));
} else {
  // Dev fallback — in-memory sessions (no DB needed locally)
  app.use(session({
    secret: 'vpi-dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 8 * 60 * 60 * 1000 },
  }));
}

// Rate limit all API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});
app.use('/api', apiLimiter);

// Stricter limit for login
app.use('/api/portal/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { error: 'Too many login attempts.' } }));

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
app.use('/api/contact', contactRoute);
app.use('/api/mobile', mobileRoute);
app.use('/api/corporate', corporateRoute);
app.use('/api/portal', portalRoute);
app.use('/api/admin', adminRoute);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Standalone portal page
app.get('/portal', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'portal.html'));
});

// Static assets
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  etag: true,
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  },
}));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Vision Performance server running on http://localhost:${PORT}`);
});
