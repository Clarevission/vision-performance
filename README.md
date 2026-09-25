# Vision Performance Inc. — Corporate Website

The corporate site for [visionperformanceinc.ca](https://visionperformanceinc.ca): occupational vision, workplace eye health and VPI technology (SafetyOS™, Mires™). It is a Node.js/Express app deployed on Render.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000 (nodemon)
npm test           # regression suite (node:test)
npm run test:e2e   # browser journeys (Playwright + installed Chrome; E2E_CHANNEL=msedge for Edge)
npm run audit:crawl -- --label after   # 9-viewport layout + axe crawl (see docs/audit/)
npm run check      # syntax check
npm run images     # regenerate web image derivatives (dev-only, uses sharp)
```

With no `.env` file, form emails are logged to the console and database writes are skipped (no `DATABASE_URL` means no database connection is attempted), so the site runs locally with no configuration.

## How pages work

There is no front-end framework and no build step. At boot, `lib/pages.js` composes every file in `views/pages/**` into complete HTML: layout, header, footer, metadata and JSON-LD. The result is cached in memory.

- Each page starts with a `<!--meta {…}-->` JSON block: `path`, `title`, `description`, `crumb`, `breadcrumb`, `section`, `schema`, `robots`.
- Partials: `{{> name key="value"}}`. Inside a partial, `{{$key}}` is a parameter and `{{#$key}}…{{/$key}}` renders only when it is set.
- Data-driven partials are in `lib/dynamic-partials.js`, for example the safety eyewear style picker built from `views/data/eyewear-styles.js`.
- Routes, `sitemap.xml`, canonical URLs and breadcrumbs all come from the same registry. **To add a page, add a file to `views/pages/`.**
- Restart the server after editing views or assets (HTML and asset hashes are computed at boot).

Styles are in `public/assets/css/site.css` and behaviour in `public/assets/js/site.js`. Neither uses inline handlers or styles, because the CSP forbids them on corporate pages.

## Other apps in this repo

| Path | What |
|---|---|
| `/portal` | Client portal (`public/portal.*`, `routes/portal.js`) |
| `/staff` | Internal enquiry dashboard (`public/staff.*`, `routes/staff.js`) |
| `/api/contact` | Enquiry endpoint (Postgres + Resend). `/api/appointment`, `/api/mobile` and `/api/corporate` are retired and return 410 |
| `/api/admin/*` | Admin API (`x-admin-key` header) |

## Images and brand masters

Full-size logo and render masters live in `brand/` and are **not** served. `npm run images` writes the web derivatives (WebP wordmark, favicons, share image, van renders) to `public/assets/img/`. `/assets` is cached for a year, so a changed image needs a new filename. Fonts (Inter, Montserrat; OFL) are self-hosted in `public/assets/fonts/`.

## Domains

`visionperformanceinc.ca` is canonical. Requests for any other host (the `.com`, `onrender.com`) get a 301 to the same path on `.ca`; mixed-case paths get a 301 to lowercase. See `docs/audit/15-domain-canonicalization.md`.

## Environment variables

| Variable | Purpose |
|---|---|
| `SESSION_SECRET` | **Required in production.** Signs portal/staff cookies |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `RESEND_API_KEY`, `MAIL_FROM`, `NOTIFY_EMAIL` | Email delivery |
| `ADMIN_KEY` | Admin API key |
| `APP_ORIGIN` | Extra allowed origin for API requests |
| `CONTACT_RATE_LIMIT` | Contact submissions per 15 min per IP (default 8) |
| `CF_ANALYTICS_TOKEN` | Optional. Cloudflare Web Analytics token; enables the beacon, its CSP allowances and the privacy-policy disclosure together (`lib/analytics.js`) |

## Content rules

Every service on the site carries a status: *Available now*, *In development*, *Planned* or *Internal*. Do not publish testimonials, prices, certifications, clinicians, clients or coverage claims without evidence. `npm test` includes a guard that fails on the most common ones. See `docs/website-refresh/` for the original audit, strategy, design system and backlog, and `docs/audit/` for the post-launch audit and remediation record.
