# 11 — QA Report

**Build:** `feature/vpi-corporate-website-refresh` · **Date:** 2026-09-25 · **Browser:** Chromium (Claude desktop in-app browser) · **Server:** local `node server.js`

## Automated gates

| Gate | Command | Result |
|---|---|---|
| Syntax check | `npm run check` (`node --check` on server, composer, client script) | ✅ pass |
| Regression suite | `npm test` (node:test, 45 tests) | ✅ **45 / 45 pass** |
| Dependency audit | `npm audit` (prod and dev) | ✅ 0 vulnerabilities |
| Lint / typecheck | — | n/a: the project has no linter or TypeScript. Adding them is backlog QA-2 |
| Build | — | n/a: no build step. Pages are composed at boot, and the composer throws on any unresolved token or unknown partial, so a broken template fails startup and tests |

### What the suite covers

Per page (×25): 200 status, `lang`, one h1, heading order, title and description length, canonical, OG image, valid JSON-LD, no unresolved tokens, no duplicate ids, resolvable ARIA references and in-page anchors, `alt` on images, no inline handlers or styles.
Site-wide: all internal links, anchors and assets resolve · icon references · **unverified-claim guard** (testimonials, CSA certification, clinician and clinic claims, prices, ROI, sustainability, guarantees, "PIPEDA-compliant", SSO, national coverage, internal Command Centre link) · status labels on planned and in-development services · eyewear data has no prices or certifications · 301 redirects · real 404 · sitemap inclusion and exclusion · robots · noindex on portal and staff · CSP and security headers · immutable asset caching · client script parses · contact API validation, success (JSON and no-JS 303), honeypot · topics match the form options · 410 on the appointment endpoint · cross-origin rejection · admin key rejection · production cookie secret never equals the published dev secret.

## Manual and in-browser checks

| Area | Check | Result |
|---|---|---|
| Navigation | Desktop dropdowns: click, Enter, Esc returns focus, one open at a time, outside click closes, hover on fine pointers | ✅ |
| Navigation | Mobile menu: opens below the header even with the announcement bar visible; focus moves in; Tab trapped; Esc closes; label switches Menu/Close; scroll lock | ✅ (**bug found and fixed:** the panel covered the Close button when the announcement bar was visible) |
| Current page | `aria-current="page"` on the nav link, footer and sub-nav; section underline on the parent menu | ✅ |
| CTAs | Topic prefill via `?topic=` for every category; product CTAs go to the product subdomains | ✅ |
| Style picker | Toggle styles and lens features (`aria-pressed`), sticky shortlist bar with count and names, Clear, shortlist carried into the contact message, shortlist cleared after a successful send | ✅ |
| Forms | Empty/invalid submit → error summary focused, inline errors, `aria-invalid`/`aria-describedby`. Valid submit → success status, form reset, notification and auto-reply emails generated (dev mailer) | ✅ |
| Forms (no JS) | Native POST → 303 to `/contact/thank-you` | ✅ (test) |
| Routing | Legacy `/#shop` on a fresh load → styles page; `/shop`, `/book`, `/learn`, `/mobile`, `/industrial` → 301 | ✅ |
| 404 | Unknown URL → 404 status and helpful page | ✅ |
| Favicon / social | `/favicon.ico` 200; OG image 200 (1200×630, 59 KB); per-page OG/Twitter tags | ✅ |
| Portal / staff | Still load and show sign-in; logo swapped to the 65 KB asset; noindex | ✅ (the 401 in the console is the expected signed-out session check) |
| Console | No errors or CSP violations on corporate pages | ✅ |
| Layout | 27 URLs × 8 widths (320, 375, 390, 430, 768, 1024, 1280, 1440): no horizontal overflow | ✅ (**bugs found and fixed:** product-card header, grid min-width, long domain in About definition list) |
| Contrast | 3,993 text elements scanned: 0 below AA | ✅ (**fixed:** grey on mist 4.43:1) |

## Visual regression (before → after)

The baseline homepage was captured before any change: dark "glass" hero, orange glow, B2C "Precision Vision for Professionals" toggle, "Shop Eyewear / Book Eye Exam" CTAs, and a cookie bar. The new homepage was reviewed at 375, 1024 and 1440 px, along with Technology, the Style Picker and Contact.

| Area | Before | After |
|---|---|---|
| Header | Translucent glass bar, 7 links + Portal + Book + Cart + hamburger | Solid brand navy matching the logo background; 3 dropdowns + 3 links + one primary CTA; accessible mobile menu |
| Hero | Retail B2C/B2B toggle | Company positioning plus an ecosystem diagram with status labels |
| Cards | 12 card styles, emoji icons | One card system, line icons, status pills |
| Footer | JS-injected, links to non-existent guides | Server-rendered sitemap footer, product domains, legal row |
| Mobile | Very long page with a dense drawer | Shorter sections, compact ecosystem, simple one-level menu |

## Not tested / limitations

- **Browsers:** only Chromium was exercised. Firefox, Safari (macOS and iOS) and Edge need a pass before launch (QA-1). The site uses no bleeding-edge APIs; `:focus-visible`, CSS `clamp()` and `<details>` are supported in all current engines.
- **Real devices and a screen-reader pass:** see A11Y-1.
- **Production email and DB:** tested with the dev mailer fallback and no database. Verify on staging or production with a real enquiry after deploy (QA-3).
- **LCP/INP field data:** not measurable in the emulated pane; measure after deploy (PERF-1).
