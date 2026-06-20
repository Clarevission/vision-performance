require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const contactRoute = require('./routes/contact');
const mobileRoute = require('./routes/mobile');
const corporateRoute = require('./routes/corporate');

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers — allow inline styles/scripts used by the SPA
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://fonts.googleapis.com"],
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

// Rate limit all API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});
app.use('/api', apiLimiter);

// Reject cross-origin form submissions (lightweight CSRF mitigation for a cookieless API)
app.use('/api', (req, res, next) => {
  const allowedOrigin = process.env.APP_ORIGIN || `http://localhost:${PORT}`;
  const origin = req.get('origin') || req.get('referer');
  if (origin && !origin.startsWith(allowedOrigin)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});

// API routes
app.use('/api/contact', contactRoute);
app.use('/api/mobile', mobileRoute);
app.use('/api/corporate', corporateRoute);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Serve static assets with caching — but never cache HTML
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  etag: true,
  setHeaders(res, filePath) {
    // HTML must always be revalidated — never serve stale markup from cache
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
