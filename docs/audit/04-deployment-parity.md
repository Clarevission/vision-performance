# 04: Deployment parity

## Baseline (25 Sep 2026, before remediation)

| Source | Version |
|---|---|
| `main` (GitHub `Clarevission/vision-performance`) | `81b73d5`: "content: remove the redundant label above the homepage headline" |
| Production `https://visionperformanceinc.ca` | Serves `81b73d5`. Asset hashes in production HTML are `site.css?v=2127fbe710` and `site.js?v=31c7d29661`, identical to the MD5 prefixes of `public/assets/css/site.css` and `public/assets/js/site.js` at `81b73d5`. Content spot checks also match: no hero eyebrow, no image credit, `vpi-favicon-32.png` / `vpi-share.jpg`, and product links with `target="_blank"` |
| Local production-mode build (`NODE_ENV=production PORT=3100`) | Same 25 routes, same sitemap, same titles and descriptions |

**Result:** the repo, the local build and production were in parity at the start of the audit.

Two differences are expected, because they come from the edge rather than the app:

- **Response headers:** Cloudflare adds HSTS `max-age=15552000; includeSubDomains`, Brotli and `cf-cache-status: DYNAMIC`.
- **Redirects:** `www`→apex and `http`→`https` are Cloudflare rules, not app code.

## Production observations (read-only)

These were captured with `curl.exe -I` (HEAD requests only; nothing was posted to production):

| URL | Status |
|---|---|
| `https://visionperformanceinc.ca/` | 200 |
| `https://www.visionperformanceinc.ca/` | 301 → `https://visionperformanceinc.ca/` |
| `http://visionperformanceinc.ca/` | 301 → `https://visionperformanceinc.ca/` |
| `https://visionperformanceinc.com/` | **200 (duplicate site, F-01)** |
| `https://www.visionperformanceinc.com/` | 301 → `https://visionperformanceinc.com/` |
| `https://vision-performance.onrender.com/` | **200 (duplicate site, F-01)** |
| `https://visionperformanceinc.ca/About` | **200 (case duplicate, F-02)** |
| `https://visionperformanceinc.ca/nope` | 404 |

## After merge and deploy (to verify)

Run these checks once the audit branch is deployed:

```bash
npm run audit:crawl -- --label prod-after --base https://visionperformanceinc.ca --no-shots
```

```bash
E2E_BASE=https://visionperformanceinc.ca npm run test:e2e
```

The first is a read-only crawl. The second runs the journeys against production read-only: the contact form is validated but never submitted.

Expected results:

- `.com` returns 301 to `.ca`.
- `onrender.com` returns 301 to `.ca`.
- `/About` returns 301 to `/about`.
- `/api/mobile` returns 410.
- Response headers show `referrer-policy: strict-origin-when-cross-origin`, and the CSP no longer lists `fonts.googleapis.com`.
