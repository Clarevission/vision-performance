# 10 — Security & Privacy Audit

## Findings and actions

| # | Area | Finding | Severity | Action |
|---|---|---|---|---|
| S1 | Session signing | `lib/auth.js` fell back to `'vpi-dev-secret-change-me'`, which is published in the repository. If `SESSION_SECRET` is unset on Render, anyone can forge a portal or **staff admin** cookie and read all enquiries (PII) | **Critical (conditional)** | **Fixed:** in production a missing secret now uses a random per-process secret (logins work; sessions end on restart) and logs a warning. **Owner must still confirm `SESSION_SECRET` is set on Render** (backlog P0) |
| S2 | Admin API | `ADMIN_KEY` compared with `!==` | Low | **Fixed:** constant-time comparison; an unset key rejects all requests (test) |
| S3 | Dependencies | `qs` (via Express), a moderate advisory. Dev-only: `sharp` <0.35.4 (high), `brace-expansion` (high) | Moderate | **Fixed:** `npm audit fix`, non-breaking. **0 vulnerabilities** (prod and dev) |
| S4 | Unused dependency | `nodemailer` plus stale `express-session`/`connect-pg-simple` lock entries | Low | Removed |
| S5 | CSP | Corporate pages needed `script-src-attr 'unsafe-inline'` for 401 inline handlers. Unsplash allowed | Medium | Corporate pages: `script-src 'self'`, `script-src-attr 'none'`, `style-src 'self' fonts.googleapis.com` (no `unsafe-inline`), `img-src 'self' data:`, `frame-ancestors 'none'`, `form-action 'self'`, `object-src 'none'`, `base-uri 'self'`. The looser policy applies **only** to `/portal` and `/staff` (test) |
| S6 | Headers | Helmet defaults already present | — | Kept. Added `Permissions-Policy` (camera, microphone, geolocation, payment, usb disabled) |
| S7 | Rate limiting behind proxy | `trust proxy` unset, so every visitor shared the proxy IP's limit (and express-rate-limit warns) | Medium | `app.set('trust proxy', 1)` |
| S8 | Internal exposure | `/staff` ("VPI Command Centre" enquiry dashboard) indexable; `app.visionperformanceinc.ca` could be linked | Medium | `/staff` and `/portal` get `noindex` meta plus `X-Robots-Tag`. Removed from nav and sitemap. No public link to `app.visionperformanceinc.ca` (test) |
| S9 | Clinical intake | `/api/appointment` accepted "vision history" free text on a marketing site with no clinical service | Medium (privacy) | Form removed. Endpoint returns **410 Gone** (test). Route file deleted |
| S10 | Spam | No bot protection on forms | Low | Honeypot field (silently accepted, not stored or emailed) plus the existing rate limit (test) |
| S11 | XSS | Email templates escape user input (`validator.escape`). Pages are static server HTML with no user content rendered. The client uses `textContent` for dynamic strings | — | Verified. No change |
| S12 | Injection | All SQL is parameterized | — | Verified |
| S13 | CSRF | JSON APIs plus an origin/referer allow-list on `/api` (non-admin). Cookies are `SameSite=Lax`, `HttpOnly`, `Secure` in production | — | Verified. Cross-origin POST returns 403 (test) |
| S14 | Secrets client-side | No keys or env values in client code. `.env` is git-ignored | — | Verified |
| S15 | Error leakage | `/api/admin/*` returns raw DB error messages (admin-only) | Low | Backlog SEC-3 |
| S16 | Legacy page code | `/portal` and `/staff` rely on inline handlers and inline styles | Low | Backlog SEC-2 (enables removing `unsafe-inline` everywhere) |

## Privacy review (forms and data)

| Topic | Before | After |
|---|---|---|
| Contact fields | name, company, email, subject, message | name, email (required); organization, role, phone (optional); topic (required, from a fixed list); message. Minimum needed for a corporate enquiry |
| Health information | Appointment form invited vision history | No health fields. The form hint and privacy policy ask users not to send health information |
| Storage | `enquiries` table (Neon) | Unchanged schema. Role is stored in `notes` as "Role: …" |
| Cookies | Banner claimed "essential cookies for session management" on public pages (there were none) | No cookies on public pages. The auth cookie is set only on portal sign-in. `localStorage` holds only the announcement dismissal and the eyewear shortlist, both documented in the privacy policy. The banner was removed as unnecessary |
| Third parties | Google Fonts, Unsplash (hotlinked) | Google Fonts only (disclosed). Processors named: Render, Neon, Resend |
| Policy | PIPEDA-only; "compliant" badges | Alberta PIPA plus PIPEDA; practices described; rights; OIPC Alberta and OPC links; privacy contact role (no invented name) |
| Analytics | GA snippet commented out | None loaded. A first-party `vpiTrack()` dispatcher emits events to `window.dataLayer` **only if** an analytics tool is installed later |

## Owner actions

1. **Confirm `SESSION_SECRET` is set** in the Render dashboard (long random string). → https://dashboard.render.com/
2. Name a privacy officer (or confirm the role mailbox) and review the privacy policy with counsel.
3. Confirm the business phone number (`+1 (780) 886-4397`), which is flagged by a code `TODO`.
