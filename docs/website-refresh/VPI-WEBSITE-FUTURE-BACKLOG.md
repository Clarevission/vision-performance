# VPI Website: Future Backlog

Items that should **not** block launch unless marked P0.

## P0: Critical (before or at deploy)

| ID | Item | Owner | Notes |
|---|---|---|---|
| SEC-1 | Confirm `SESSION_SECRET` is set in Render (long random string) | Owner | Code now refuses the published fallback in production, but a fixed secret keeps sessions across restarts. https://dashboard.render.com/ |
| DEP-1 | Review the branch, then merge `feature/vpi-corporate-website-refresh` → `main` (Render auto-deploys `main`) | Owner | Production change: needs owner approval |
| QA-3 | After deploy: send one real enquiry and confirm the DB row, notification email and auto-reply | Owner/Dev | Tested locally with the dev mailer only |

## P1: High

| ID | Item | Notes |
|---|---|---|
| CONT-1 | Leadership section: founder bio, credentials, photo | Needs owner facts; no invented people |
| CONT-2 | Confirm the business phone `+1 (780) 886-4397` (a code comment called it a placeholder) | Used in the footer, contact page, accessibility page and Organization JSON-LD |
| CONT-5 | Name a privacy officer (or confirm the role mailbox) and have counsel review privacy and terms | PIPA/PIPEDA |
| SEO-1 | Submit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools; watch coverage for the new URLs | |
| PERF-1 | Measure field LCP/INP/CLS (Search Console CWV or PageSpeed Insights) after deploy | |
| QA-1 | Cross-browser pass: Firefox, Safari macOS and iOS, Edge | Only Chromium tested |
| A11Y-1 | Screen-reader pass (NVDA + Firefox, VoiceOver + iOS) | |
| CONT-3 | Publish the first resource guide (the employer guide to safety eyewear programs) | Converts "In preparation" into real SEO content |

## P2: Medium

| ID | Item | Notes |
|---|---|---|
| SUP-1 | When a safety-eyewear supplier is signed, add real frames to `views/data/eyewear-styles.js` (`frames: [...]`) with manufacturer, model and printed CSA marking | The test currently asserts `frames` is empty; update it with the data |
| SEC-2 | Refactor `/portal` and `/staff` to external JS without inline handlers or styles, then drop the legacy CSP | |
| SEC-3 | `/api/admin/*` returns raw DB error messages; return generic errors and log details | Admin-only |
| A11Y-2 | Accessibility review of `/portal` and `/staff` | |
| ANALYTICS-1 | Choose a privacy-respecting analytics tool (e.g. Plausible or self-hosted Umami). Load it and forward `vpi:track` events. Update the CSP `script-src`/`connect-src` and the privacy policy | Events already emitted: contact_cta, safetyos_click, mires_click, enquiry_submitted, occupational_vision_enquiry, mobile_clinic_enquiry, resource_request, phone_click, email_click |
| SEO-2 | If `visionperformanceinc.com` serves this app, 301 it to `.ca` at DNS/CDN | Avoid duplicate content |
| PERF-2 | Self-host Inter and Montserrat (removes the Google Fonts connection; privacy and performance) | Update the privacy policy afterwards |
| QA-2 | Add ESLint and Prettier (dev-only) and a CI workflow running `npm test` on pull requests | |
| CLEAN-1 | Delete ~50 obsolete root scripts (`extract*.js`, `find-nav*.js`, `fix-*.js`, `replace-images*.js`…), `source-original.htm` and `.assets-backup/` | Not deployed logic; history is in git |
| CLEAN-2 | `lib/schema.sql`: remove the unused `session` table and the duplicated `DO $$` block; move enquiry `role` from `notes` into its own column via a migration | |
| NAME-1 | `/staff` is titled "VPI Command Centre", which is easily confused with `app.visionperformanceinc.ca`. Rename it to "VPI Enquiries" or retire it in favour of the Command Centre | |

## P3: Future

| ID | Item | Notes |
|---|---|---|
| CONT-4 | Careers or team page once hiring | |
| CONT-6 | Client stories and testimonial component, only with real, consented quotes | Archived unverified testimonials must not be reused |
| CONT-7 | Mobile clinic launch page: confirmed services, clinicians, equipment, service area and booking | When the planned status changes |
| CONT-8 | Clinical and optical network / Lunettes Emporium section | When operational |
| CONT-9 | Downloadable program overview (PDF) for employers | |
| I18N-1 | French-language version (fr-CA) for national reach | |
| A11Y-3 | Forced-colours mode refinements | |
| CMS-1 | Move resources/insights to Markdown files rendered by the composer (no CMS dependency) once publishing starts | |
