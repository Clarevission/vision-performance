# 00 — Repository & Environment Assessment

**Project:** visionperformanceinc.ca corporate website
**Repository:** `C:\Users\clare\Claude\vision-performance` (GitHub remote `origin/main`)
**Branch for this work:** `feature/vpi-corporate-website-refresh` (created from `main` @ `68762a2`)
**Assessment date:** 2026-09-25
**Status:** Discovery only. Nothing was changed during this phase.

---

## 1. Framework

| Item | Finding |
|---|---|
| Runtime | Node.js (`engines: >=18`; local toolchain is Node 24.16) |
| Server | Express 4.19 (`server.js`) |
| Front end | **No framework.** One hand-written HTML document, `public/index.html` (1,828 lines, **191 KB**), with about 1,080 lines of inline `<style>`, plus `public/app.js` (304 lines, 25 KB) |
| Rendering model | Client-side "pseudo-SPA". Every "page" is a `<div class="page" id="page-*">` in the same document. `navigate(page)` toggles `display`. **The URL never changes**: no History API and no hash routing. |
| Build step | None. `render.yaml` runs `npm install` → `npm start` |

## 2. package.json

- **Runtime deps:** `express`, `helmet`, `express-rate-limit`, `pg`, `bcryptjs`, `validator`, `resend`, `dotenv`, and `nodemailer`. **`nodemailer` is unused**: `lib/mailer.js` uses Resend only.
- **Dev deps:** `nodemon`, `sharp`. `sharp` is available locally for image optimisation.
- **Scripts:** `start`, `dev` only. There is **no `test`, `lint`, or `build` script.**

## 3. Project structure

```
server.js                Express entry: helmet CSP, rate limits, origin check, API routes, static, SPA catch-all
lib/                     auth.js (HMAC cookie), db.js (pg Pool), mailer.js (Resend), schema.sql
routes/                  contact, mobile, corporate, appointment (public forms)
                         portal (client portal API), staff (enquiry dashboard API), admin (ADMIN_KEY API)
public/index.html        ENTIRE public website (all 10 "pages", CSS, footer <template>)
public/app.js            Product data, cart, navigate(), ROI calc, forms, fake chat, reveal animations
public/portal.html/.js   Client portal (login + dashboard)
public/staff.html/.js    Staff enquiry dashboard ("Staff — VPI Command Centre")
public/images/           5 logo PNGs (3.8–4.5 MB each) + logo-nav.png (65 KB)
public/favicon.png       4.1 MB (2048×2048). index.html uses an inline base64 icon instead
public/van.webp          67 KB. This is a concept render (fictional licence plate), not a photo of a deployed unit
public/robots.txt, sitemap.xml
~50 root-level one-off scripts  extract*.js, find-nav*.js, fix-*.js, replace-images*.js … (dead: past patching tools)
source-original.htm      306 KB legacy export (dead)
.assets-backup/          van-original-backup.png (dead)
loan-package/            UNTRACKED. Not part of the site; left untouched
```

## 4. Routing architecture

| Route | Handler | Notes |
|---|---|---|
| `/` and `*` (catch-all) | `index.html` | **Every unknown URL returns 200 with the homepage**, so there is no real 404 (soft-404 SEO risk) |
| `/portal` | `portal.html` | Client portal. Linked from the main nav |
| `/staff` | `staff.html` | Internal enquiry dashboard. Not linked, but publicly reachable and indexable (no `noindex`) |
| `/health` | JSON | Health check |
| `/api/contact`, `/api/mobile`, `/api/corporate`, `/api/appointment` | POST | Public forms. DB insert and Resend notification plus auto-reply |
| `/api/portal/*`, `/api/staff/*` | JSON | Cookie-authenticated |
| `/api/admin/*` | JSON | `x-admin-key` header == `ADMIN_KEY` |

Internal "pages" (`home, shop, mobile, industrial, book, about, contact, learn, privacy`) have **no URLs at all**. `sitemap.xml` lists `/#shop`, `/#mobile` and so on, but those fragments are ignored by the app and all resolve to the homepage.

## 5. Deployment environment

- **Host:** Render web service (`render.yaml`), `NODE_ENV=production`, `PORT=3000`, `APP_ORIGIN=https://visionperformanceinc.ca`.
- **DB:** Neon PostgreSQL via `DATABASE_URL` (`ssl.rejectUnauthorized=false`).
- **Email:** Resend (`RESEND_API_KEY`, `MAIL_FROM`, `NOTIFY_EMAIL`).
- **Deploy trigger:** push to `main` → Render auto-deploy.
- **Sibling properties (all live, HTTP 200 on 2026-09-25):**
  - `safetyos.visionperformanceinc.ca`: VPI SafetyOS marketing site plus app ("Health & Safety Management for Alberta Contractors")
  - `mires.visionperformanceinc.ca`: VPI Mires ("Practice management for Optometry and Optical Clinics")
  - `app.visionperformanceinc.ca`: VPI Command Centre (internal; Railway)

## 6. Styling framework

No framework. There is one inline `<style>` block. It defines **two competing token sets**:

1. A dark "glass" set: `--bg-dark #020617`, `--accent #FF6A00`, `--accent-cyan #00F0FF`, …
2. A "light-section palette" added later to fix a white-on-white bug: `--navy #0A1F44`, `--orange #F97316`, `--steel`, `--grey`, …

On top of these there are hundreds of inline `style=""` attributes. Three font families load: Inter, Montserrat and Outfit, with 21 weights in total.

## 7. Component system

None. Repeated markup such as cards, buttons, benefit rows and page heroes is copy-pasted. Only the footer is shared: a `<template>` cloned into 9 placeholders by JS, so it is **invisible to crawlers and no-JS users**.

## 8. CMS

None. All content is hard-coded in `index.html` and `app.js`.

## 9. Analytics

A GA4 snippet is **commented out**, with placeholder ID `G-XXXXXXXXXX`. **No analytics are active.** No event instrumentation exists.

## 10. SEO implementation

- One `<title>` and meta description for the whole site. `meta keywords` is present (ignored by search engines).
- No canonical, Open Graph, Twitter or JSON-LD structured data.
- **Two `<h1>` elements** on the homepage (B2C/B2B hero toggle). Other "pages" use `div.page-hero-title` (no heading).
- A "Serving Professionals Searching For" band of 12 keyword tags. This is keyword stuffing.
- The sitemap contains fragment URLs that are not indexable as separate pages.

## 11. Forms and backend integrations

| Form | Endpoint | Required | Concerns |
|---|---|---|---|
| Contact | `/api/contact` | name, email, message | OK |
| Mobile clinic request | `/api/mobile` | org, contact, email, site address | Presents mobile clinic as bookable |
| Corporate quote | `/api/corporate` | company, contact, email, **phone** | Phone required |
| Appointment | `/api/appointment` | name, email, exam type | **Clinical intake**: invites "vision history" and books exams "at our Edmonton clinic" |
| Chat widget | none | – | **Fake**: typed messages go nowhere, yet the UI says "Online · Typically replies in minutes" |

The server side is sound: parameterised SQL, `validator.escape` for email HTML, a length cap, and rate limiting (60 per 15 minutes per IP on `/api`, 10 per 15 minutes on logins). A same-origin check applies on `/api` except `/api/admin`.

## 12. Environment variables

| Var | Where | Risk |
|---|---|---|
| `SESSION_SECRET` | `lib/auth.js` | **Falls back to `'vpi-dev-secret-change-me'`**, which is committed in a public repo. If it is unset on Render, portal and staff cookies can be forged. **Owner must verify it is set.** |
| `ADMIN_KEY` | `routes/admin.js` | If unset, `key !== undefined` rejects all requests (safe). Compared with `!==`, not a constant-time compare (low risk) |
| `DATABASE_URL`, `RESEND_API_KEY`, `MAIL_FROM`, `NOTIFY_EMAIL`, `APP_ORIGIN` | server | Not exposed client-side ✔ |

No secrets appear in client-side code. `.env` is git-ignored.

## 13. Testing framework

**None.** There are no tests, no CI and no `npm test`.

## 14. Linting and type-checking

**None.** Plain JS, no ESLint or Prettier config, no TypeScript.

## 15. Existing design tokens

See §6. Brand assets used for this refresh:

- **Wordmark** `logo-nav.png`: "VISION / PERFORMANCE / INC." in white and slate on navy `#00071A`, with a cyan rule and orange "INC.". The background is opaque, so the header must sit on the same navy.
- **Badge** `logo-badge.png`: circular seal, "VISION PERFORMANCE INC. · EDMONTON · ALBERTA · CANADA", in orange, cyan and navy. Suitable for the favicon.
- **Palette in use:** navy `#0A1F44` / `#00071A`, orange `#F97316` / `#FF6A00`, slate `#475569` / `#64748B`, and cyan `#00F0FF` (logo rule and van livery).

## 16. Current website pages (in-document)

`home`, `shop`, `mobile`, `industrial`, `book`, `about`, `contact`, `learn`, `privacy` (privacy and terms are combined). The home page alone holds 17 sections. Standalone pages: `/portal`, `/staff`.

## 17. Unused and dead code

- `nodemailer` dependency (unused).
- `lib/schema.sql`: the `session` table (unused; auth is cookie-based) and a duplicated `DO $$` block.
- `app.js`: `drawFrame` canvas renderer (every product has a `photo`, so the canvas path never runs), `setPath` B2C/B2B toggle, and the chat engine.
- CSS: `.logo-shield*`, `.chat-notif`, `.sticky-bar-text` and others.
- Images: `logo-full.png` (3.8 MB) and `logo-light.png` (4.5 MB) are referenced nowhere. `logo-dark.png` (3.9 MB) is referenced nowhere. `favicon.png` (4.1 MB) is referenced nowhere.
- About 50 root scripts plus `source-original.htm` plus `.assets-backup/`: historical patch tooling, not deployed logic.

---

## Baseline measurements (local, homepage, before any change)

| Metric | Value |
|---|---|
| HTML document | 191 KB decoded |
| `app.js` | 25 KB |
| DOM nodes | 2,296 |
| `onclick` attributes | **401** |
| Emoji used as icons in body text | 49 |
| `<h1>` count | 2 |
| LCP (local, unthrottled) | ~1.8 s (hero Unsplash image) |
| CLS | 0.000 |
| Portal and staff pages | load `logo-dark-alt.png`: **3.8 MB** each |

## Implications for the refresh

1. **Real URLs are the single most important structural fix.** SEO, sharing, analytics, breadcrumbs and "one page per solution" all depend on them.
2. **Chosen approach: server-composed multi-page site, zero new dependencies.**
   - Page bodies live in `views/pages/**.html` with a small JSON front-matter block (title, description, breadcrumb, schema type).
   - `lib/pages.js` composes layout, header, body and footer at boot and caches the result in memory, so every URL returns complete, crawlable HTML (header and footer included).
   - Routes, `sitemap.xml`, canonical URLs, Open Graph and JSON-LD are all generated from the same registry.
   - A real 404 with status 404. 301 redirects for retired pages.
   - One external stylesheet (`/assets/css/site.css`) and one small script (`/assets/js/site.js`). No inline handlers.
3. **Tests:** Node's built-in `node:test` (no new dependency) will check route status codes, metadata, heading structure, internal links, prohibited-claim guards, and form validation.
4. **Keep working back-office functionality intact:** `/portal`, `/staff` and all `/api/*` routes. Mark `/portal` and `/staff` `noindex` and remove `/staff` from any public surface.
