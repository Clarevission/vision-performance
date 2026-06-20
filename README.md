# Vision Performance Inc. — Fullstack Website

A fullstack Node.js/Express website for Vision Performance Inc., a precision vision care and industrial safety eyewear company serving Alberta, Canada.

## Prerequisites

- [Node.js 18+](https://nodejs.org/) (download and install if not already installed)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
copy .env.example .env
# Then edit .env and fill in your SMTP credentials

# 3. Run in development mode (auto-restarts on changes)
npm run dev

# 4. Open http://localhost:3000
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 3000) |
| `NOTIFY_EMAIL` | Where form submissions are sent |
| `MAIL_FROM` | Sender name/email shown to recipients |
| `SMTP_HOST` | Your SMTP provider host |
| `SMTP_PORT` | SMTP port (usually 587) |
| `SMTP_SECURE` | `true` for port 465, `false` otherwise |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password or API key |

**In development**, if you leave SMTP settings blank, emails are logged to the console instead of sent — no config needed to test locally.

## Recommended SMTP Providers

- **[Mailgun](https://mailgun.com)** — Free tier, 100 emails/day. Best for transactional mail.
- **[SendGrid](https://sendgrid.com)** — Free tier, 100 emails/day.
- **Gmail** — Use an [App Password](https://myaccount.google.com/apppasswords), not your account password.

## Deployment

### Render (Recommended — Free tier available)

1. Push this repo to GitHub
2. Create a new **Web Service** at [render.com](https://render.com)
3. Connect your GitHub repo
4. Set environment variables in the Render dashboard
5. Deploy — Render auto-detects the `render.yaml`

### Railway

1. Push to GitHub
2. New project at [railway.app](https://railway.app) → Deploy from GitHub
3. Add environment variables in the Variables tab

### DigitalOcean App Platform

1. Push to GitHub
2. Create App → select repo
3. Add environment variables
4. Deploy

### VPS (any provider)

```bash
npm install --production
NODE_ENV=production node server.js
```

Use [PM2](https://pm2.keymetrics.io/) for process management and Nginx as a reverse proxy.

## Project Structure

```
vision-performance/
├── public/
│   ├── index.html      ← The full SPA (all pages, CSS, client JS)
│   ├── robots.txt
│   └── sitemap.xml
├── routes/
│   ├── contact.js      ← POST /api/contact
│   ├── mobile.js       ← POST /api/mobile
│   └── corporate.js    ← POST /api/corporate
├── lib/
│   └── mailer.js       ← Nodemailer wrapper
├── server.js           ← Express server entry point
├── .env.example        ← Environment variable template
├── .gitignore
├── render.yaml         ← Render.com deploy config
└── package.json
```

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/contact` | POST | General contact form |
| `/api/mobile` | POST | Mobile clinic request |
| `/api/corporate` | POST | Corporate program quote |
| `/health` | GET | Health check |

All endpoints validate required fields, sanitize input, send a notification email to `NOTIFY_EMAIL`, and send an auto-reply to the submitter.

## Features

- Working contact, mobile clinic, and corporate quote forms with real email delivery
- Auto-replies sent to form submitters
- Rate limiting (20 requests per 15 minutes per IP) to prevent spam
- Input sanitization and validation on all form fields
- Security headers via Helmet (CSP, XSS protection, etc.)
- robots.txt and sitemap.xml for SEO
- Static file caching with ETags
- Health check endpoint for uptime monitoring
- In development: emails logged to console when SMTP not configured

## Updating the Domain in sitemap.xml

Open `public/sitemap.xml` and replace `www.visionperformance.ca` with your actual domain before deploying.
