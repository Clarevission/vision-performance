# 19: Security audit

The summary is in [SECURITY-AUDIT](SECURITY-AUDIT.md). No destructive testing was performed against production. Production was probed only with HEAD requests.

## Secrets

- **Working tree:** a pattern scan for Resend keys, Postgres URLs with passwords, AWS/Stripe/GitHub tokens, private keys, and assignments to `ADMIN_KEY`, `SESSION_SECRET`, `RESEND_API_KEY` or `STAFF_PASSWORD` found only `.env.example`. There the key is a placeholder (`re_` followed by x's).
- **Git history (`git log --all -p`):** the same patterns found only that placeholder, in commit `e3b30ae`.
- **Result:** no live secrets are committed, so no credential rotation is required from this audit.
- No `.env` file exists locally, and `.gitignore` covers `.env`.

## Headers

Production baseline, then after:

| Header | Production (before) | After |
|---|---|---|
| Content-Security-Policy | `default-src 'self'; script-src 'self'; script-src-attr 'none'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com; connect-src 'self'; form-action 'self'; frame-src 'none'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; upgrade-insecure-requests` | Same, but `style-src 'self'` and `font-src 'self'` |
| Strict-Transport-Security | `max-age=15552000; includeSubDomains` (Cloudflare) | unchanged (F-30) |
| Referrer-Policy | `no-referrer` | `strict-origin-when-cross-origin` (F-23) |
| Permissions-Policy | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` | unchanged |
| X-Content-Type-Options, X-Frame-Options, COOP, CORP | `nosniff`, `SAMEORIGIN`, `same-origin`, `same-origin` | unchanged |

`/portal` and `/staff` use `legacyCsp`, which additionally allows `'unsafe-inline'` for style and script attributes. Those legacy UIs use inline handlers. Refactoring them is on the roadmap.

## Application

| Control | Finding |
|---|---|
| Origin check on `/api/*` state-changing requests | **Fixed (F-03).** It previously used `origin.startsWith(allowed)`. Now it requires `origin === allowed` or `origin.startsWith(allowed + '/')` |
| Rate limits | `/api` 60 per 15 min; logins 10 per 15 min; contact 8 per 15 min (configurable with `CONTACT_RATE_LIMIT`) |
| Body limits | 10 KB for JSON and urlencoded bodies. Oversized bodies get 413 and malformed JSON gets 400, both with JSON errors and no stack traces (F-11) |
| Auth | Portal and staff both authenticate against `portal_users` with bcrypt; staff access also requires `role = 'admin'`. Sessions: HMAC-signed cookies (`HttpOnly; SameSite=Lax; Secure` in production). If `SESSION_SECRET` is unset, the app uses a random per-process secret (F-15) |
| Admin API | `x-admin-key` compared in constant time; an unset key denies all requests |
| SQL | Parameterized throughout; staff filters allow-listed |
| Retired endpoints | Removed and return 410 (F-06), which shrinks the attack surface |
| Error pages | No stack traces; errors are logged on the server |
| Internal exposure | Staff UI no longer says "Command Centre" (F-12). The guard test blocks links to the internal app host. `/portal` and `/staff` are `noindex` and out of the main nav |
| Dead code | 55 unreferenced scripts removed, one of which exposed a local machine path (F-24) |
| Dependencies | `npm audit`: 0 vulnerabilities ([02](02-dependency-audit.md)) |

## Owner items

- Set `SESSION_SECRET` in Render (F-15).
- Decide on the repo's visibility (F-07). A public repo exposes the full server code. That isn't a vulnerability in itself, but it gives attackers the route map and rate limits.
- HSTS: decide on a 1-year max-age and preload (F-30).
