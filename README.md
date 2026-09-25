# Vision Performance Inc. — Corporate Website

The corporate site for [visionperformanceinc.ca](https://visionperformanceinc.ca): occupational vision, workplace eye health and VPI technology (SafetyOS™, Mires™). It is a Node.js/Express app deployed on Render.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000 (nodemon)
npm test           # regression suite (node:test)
npm run check      # syntax check
npm run images     # regenerate web image derivatives (dev-only, uses sharp)
```

With no `.env` file, form emails are logged to the console and database writes fail quietly, so the site runs locally with no configuration.

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
| `/api/contact`, `/api/mobile`, `/api/corporate` | Enquiry endpoints (Postgres + Resend) |
| `/api/admin/*` | Admin API (`x-admin-key` header) |

## Environment variables

| Variable | Purpose |
|---|---|
| `SESSION_SECRET` | **Required in production.** Signs portal/staff cookies |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `RESEND_API_KEY`, `MAIL_FROM`, `NOTIFY_EMAIL` | Email delivery |
| `ADMIN_KEY` | Admin API key |
| `APP_ORIGIN` | Extra allowed origin for API requests |

## Content rules

Every service on the site carries a status: *Available now*, *In development*, *Planned* or *Internal*. Do not publish testimonials, prices, certifications, clinicians, clients or coverage claims without evidence. `npm test` includes a guard that fails on the most common ones. See `docs/website-refresh/` for the audit, strategy, design system and backlog.
