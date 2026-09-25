# VPI corporate website: master findings register

Audit branch: `audit/vpi-corporate-post-launch` (cut from `main` at `81b73d5`, the commit live in production on 25 September 2026).
Severity: **P0** production broken, security breach or legal exposure · **P1** material SEO, security, trust or conversion harm · **P2** meaningful quality issue · **P3** polish or hygiene.
Final status is one of: RESOLVED · ACCEPTED RISK · DEFERRED · REQUIRES OWNER INPUT · REQUIRES EXTERNAL CREDENTIAL.

"RESOLVED" means fixed on the audit branch and verified locally by tests, the crawl and E2E. It reaches the public site only once the branch is merged and deployed (see [REMEDIATION-REPORT](REMEDIATION-REPORT.md)).

No P0 findings were identified.

## Findings

| ID | Sev | Area | Finding | Evidence | Status | Fix / next action |
|---|---|---|---|---|---|---|
| F-01 | P1 | Domains / SEO | `visionperformanceinc.com` and `vision-performance.onrender.com` serve a full 200 copy of the site (canonical tags point to .ca, but crawlers still see duplicate hosts) | `curl -I https://visionperformanceinc.com/` → 200; same for onrender.com | RESOLVED | App-level 301 to `https://visionperformanceinc.ca` + same path for every non-canonical host (`/health` exempt). Tests: `non-canonical hosts…` |
| F-02 | P1 | SEO | Mixed-case paths return 200 duplicates (`/About`) | `curl -I https://visionperformanceinc.ca/About` → 200 | RESOLVED | 301 to lowercase path, query kept |
| F-03 | P1 | Security | API Origin check used `startsWith`, so a lookalike origin such as `https://visionperformanceinc.ca.example.net` passed | `server.js` (before) | RESOLVED | Exact origin match (or origin + `/`). Test: `lookalike origin gets 403` |
| F-04 | P1 | Content / claims | "Frames from our supply partners" implied supplier agreements that are not in place | `safety-eyewear-styles.html` | RESOLVED | Reworded: frames will be listed "once supplier arrangements are in place" |
| F-05 | P1 | Performance / privacy | Google Fonts CSS blocked rendering (Lighthouse: ~1.7 s render-blocking on mobile) and sent every visitor's IP to Google | `docs/audit/data/lighthouse.json` baseline | RESOLVED | Self-hosted Inter + Montserrat (OFL), preloaded; CSP `style-src`/`font-src` tightened to `'self'`; privacy policy updated |
| F-06 | P1 | Forms / data | `/api/mobile` and `/api/corporate` still accepted and stored submissions although no page posts to them (unmonitored enquiry path) | `routes/mobile.js`, `routes/corporate.js` | RESOLVED | Routes removed; `/api/appointment`, `/api/mobile`, `/api/corporate` return 410 |
| F-07 | P1 | SEO / reputation | The public GitHub repo `Clarevission/vision-performance` is indexed and includes `archive/legacy-spa` with the old site's unverified claims | Search results; `archive/legacy-spa/` | REQUIRES OWNER INPUT | Owner decides: make the repo private (recommended), or delete `archive/legacy-spa` from `main` |
| F-08 | P1 | Search index | Search engines still show the old single-page site snapshot ("Precision Vision for Professionals") | Public search results | REQUIRES EXTERNAL CREDENTIAL | Needs Google Search Console + Bing Webmaster access: verify .ca, submit sitemap, request re-indexing of `/`, add .com as a property and use Change of Address. Steps in [16](16-search-index-cleanup.md) |
| F-09 | P2 | Brand assets | 4–6 MB logo and van masters were publicly downloadable from `/images/*` and `/van.webp` | `public/images/`, `public/van.webp` | RESOLVED | Moved to `brand/` (not served); `/van.webp`, `/van.png`, `/app.js` return 410 |
| F-10 | P2 | Error handling | The 404 page emitted a canonical and `og:url` for `/404` | View source of any 404 | RESOLVED | Error pages omit canonical and `og:url`; 404 now offers six recovery links |
| F-11 | P2 | Error handling | No 500 page; malformed JSON bodies produced a generic 500 | `curl -X POST -d '{bad' /api/contact` | RESOLVED | `serverError` page; 400 for bad JSON, 413 for oversized bodies; API errors stay JSON |
| F-12 | P2 | Internal exposure | The staff dashboard was titled "Command Centre", exposing internal system naming on a public URL | `public/staff.html` | RESOLVED | Renamed "Staff Enquiries" / "VPI Enquiries"; the page stays `noindex` |
| F-13 | P2 | Test reliability | `npm test` took 61 s: pg silently fell back to a local Postgres when `DATABASE_URL` was unset and held sockets open | Test timing | RESOLVED | DB stub when `DATABASE_URL` is unset; server closes connections; suite runs in about 1.5 s |
| F-14 | P2 | Test coverage | No browser-level tests of the key journeys | No E2E folder | RESOLVED | 9 Playwright journeys (`npm run test:e2e`) pass in Chrome and Edge |
| F-15 | P2 | Operations | `SESSION_SECRET` not confirmed in Render. Without it, the app uses a random per-process secret (safe, but sessions end on every deploy) | `lib/auth.js` warning | REQUIRES EXTERNAL CREDENTIAL | Owner sets `SESSION_SECRET` in the Render dashboard (https://dashboard.render.com) |
| F-16 | P2 | Content | Phone number +1 (780) 886-4397 is published but not confirmed as monitored | Owner decision log | REQUIRES OWNER INPUT | Confirm, or remove from footer and contact page |
| F-17 | P2 | Privacy | The privacy policy names a "privacy contact" but no accountable individual, which PIPA expects the organization to designate | `privacy.html` | REQUIRES OWNER INPUT | Name a privacy officer (a title is enough) |
| F-18 | P3 | Domains | After deploy, `www.visionperformanceinc.com` → `visionperformanceinc.com` (Cloudflare) → `.ca` (app) is a two-hop chain | `curl -I https://www.visionperformanceinc.com/` → 301 to .com | REQUIRES OWNER INPUT | Add a Cloudflare redirect rule on the .com zone sending all hosts directly to `https://visionperformanceinc.ca/${path}` |
| F-19 | P3 | Content / IA | The "Client sign-in" footer link implies existing portal clients | `footer.html` | REQUIRES OWNER INPUT | Keep only if clients are onboarded; otherwise remove the link (the portal stays reachable by URL) |
| F-20 | P3 | Performance | A 486×300 PNG wordmark was served for an ~88–169 px display | Network panel | RESOLVED | 180w/360w WebP with `srcset`/`sizes` (12 KB / 31 KB) |
| F-21 | P3 | UX / conversion | Resource cards had no per-guide action; visitors had to retype which guide they wanted | `/resources` | RESOLVED | "Request this guide" per card; the contact form pre-fills the topic and message from an allow-listed guide id |
| F-22 | P3 | Visual | Workplace Eye Health: 103 px of blank space in the last card at 768 px | `crawl-baseline.json` | RESOLVED | Card content balanced; after-crawl shows 0 layout findings |
| F-23 | P3 | Referrer | `Referrer-Policy: no-referrer` hid VPI as the source of visits to the SafetyOS and Mires sites | Response headers | RESOLVED | `strict-origin-when-cross-origin` (sends the origin only, never the path, to other sites) |
| F-24 | P3 | Maintainability | 55 one-off root scripts, `source-original.htm` and a 6 MB backup PNG in the repo; one script embedded a local machine path | Repo root | RESOLVED | Removed from `main` (retained in history) |
| F-25 | P3 | Dependencies | Major versions available: express 5, helmet 8, express-rate-limit 8, dotenv 18 | `npm outdated` | DEFERRED | Planned upgrade, one package per PR with the full test + E2E suite ([02](02-dependency-audit.md)). pg 8.23 and resend 6.30 (in-range) applied. `npm audit`: 0 vulnerabilities |
| F-26 | P3 | Testing | Firefox and Safari/WebKit not tested (engines not installed on the audit machine) | Tooling | DEFERRED | Run `npm run test:e2e` in CI with Playwright's Firefox/WebKit builds, or check manually on an iPhone and in Firefox |
| F-27 | P3 | Analytics | `vpiTrack` pushes events to `dataLayer` only; no analytics provider is connected, so conversions are not measured | `site.js` | REQUIRES OWNER INPUT | Choose a privacy-friendly analytics tool; update the privacy policy and CSP `connect-src` when added |
| F-28 | P3 | Observability | No uptime or error alerting; `/health` exists but nothing watches it | Render config | REQUIRES OWNER INPUT | Add an uptime monitor on `/health` and Render deploy/error notifications |
| F-29 | P3 | Third-party | Photographs load from `images.unsplash.com` (availability and privacy dependency) | CSP `img-src` | ACCEPTED RISK | Disclosed in the privacy policy. Future: self-host resized derivatives ([20](20-future-proofing.md)) |
| F-30 | P3 | Security headers | HSTS is 180 days without `preload` (set by Cloudflare) | Response headers | ACCEPTED RISK | Raise to 1 year, and consider preload only once every subdomain is HTTPS-only. Preload is hard to undo, so this is an owner decision |
| F-31 | P3 | Docs | README listed retired endpoints and old DB behaviour | `README.md` | RESOLVED | Updated |

## Things working correctly (verified, no change needed)

- **Accessibility automation:** axe-core 4.13 finds 0 violations on all 26 URLs at 1440×900 and 375×812, both before and after remediation. Lighthouse accessibility scores 100 on every page tested. (Automated checks cover only part of WCAG 2.2 AA; see [ACCESSIBILITY-AUDIT](ACCESSIBILITY-AUDIT.md).)
- **Layout:** the after-crawl (26 URLs × 9 viewports, 234 screenshots) finds no overlaps, clipping, horizontal overflow, broken images or unbalanced grids.
- **Transport:** HTTPS enforced (HTTP → HTTPS 301); `www.visionperformanceinc.ca` → apex 301; HSTS present.
- **CSP:** corporate pages allow no inline script or style (`script-src 'self'`, `script-src-attr 'none'`), plus `frame-ancestors 'none'` and `form-action 'self'`. The legacy `/portal` and `/staff` pages use a separate, looser policy.
- **Forms:**
  - server-side validation
  - allow-listed topics
  - 10 KB body limit
  - honeypot field
  - per-IP rate limit (8 per 15 min)
  - accessible error summary with focus management
  - a no-JavaScript form post that falls back to the thank-you page
- **Auth:**
  - bcrypt password hashing (portal and staff; staff also requires the admin role)
  - HMAC-signed session cookies set `HttpOnly; SameSite=Lax; Secure` in production
  - constant-time admin-key comparison, and an unset `ADMIN_KEY` rejects everything
  - login rate limits
- **SQL:** every query is parameterized; the dynamic filters in the staff API are allow-listed.
- **Secrets:** no live secrets in the working tree or git history. `.env.example` contains placeholders only.
- **SEO basics:**
  - unique titles and descriptions on every page (enforced by tests)
  - a single H1 and a valid heading hierarchy
  - canonical tags on every indexable page
  - `sitemap.xml` with 24 indexable URLs
  - `robots.txt` pointing to it
  - `/portal`, `/staff` and the thank-you page are `noindex`
- **Structured data:** Organization and WebSite (home), BreadcrumbList (inner pages), SoftwareApplication (SafetyOS, Mires) and FAQPage. Every block parses as JSON (tested).
- **Legacy URLs:** `/shop`, `/book`, `/learn`, `/mobile`, `/mobile-clinic`, `/industrial`, `/industrial-programs`, `/index.html` and `/home` each 301 to the most relevant new page. None is sent to the homepage by default.
- **Claims discipline:** planned and in-development services carry status labels, and a test guard fails the build on testimonials, prices, certifications, clinician or client claims.
- **External links:** product and third-party links open in a new tab with `rel="noopener"` and a screen-reader "opens in a new tab" hint.
- **Caching:** hashed `/assets` are served `immutable` for 1 year; HTML is revalidated.
