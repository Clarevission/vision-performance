# Remediation report

Branch `audit/vpi-corporate-post-launch`, from `81b73d5`. **Merged to `main` as `77a826b` with the owner's approval, deployed to production on 25 Sep 2026, and verified live** ([04](04-deployment-parity.md)).

## Commits

| Commit | Change | Findings |
|---|---|---|
| `80040bd` | Audit tooling (Playwright/axe crawl) + production baseline | n/a |
| `179c0f2` | Canonical host 301, lowercase 301, 410s, retired endpoints removed, exact origin check, 404/500 pages, JSON 400/413, DB stub | F-01, F-02, F-03, F-06, F-10, F-11, F-13 |
| `6411e48` | Remove unverified supply-partner claim | F-04 |
| `3047703` | Self-hosted fonts, tighter CSP, WebP wordmark, brand masters to `brand/`, staff wording | F-05, F-09, F-12, F-20 |
| `00a1013` | Tests for the above | n/a |
| `1cfc699` | Per-guide request links + allow-listed pre-fill | F-21 |
| `60f141b` | Workplace Eye Health tablet balance; card markup tidy | F-22 |
| `5ea4f72` | pg 8.23, resend 6.30 | F-25 (partial) |
| `e804acc` | Playwright E2E journeys (`npm run test:e2e`) | F-14 |
| `f4e83f4` | Remove 55 dead root scripts, `source-original.htm`, 6 MB backup PNG | F-24 |
| *(final commits)* | README, unique-title test, supplier-claim guard, audit docs | F-31 |

Referrer-Policy (F-23) was changed in `179c0f2`.

## Verification after remediation

| Check | Result |
|---|---|
| `npm test` | 55 / 55 pass |
| `npm run test:e2e` (Chrome 154) | 9 / 9 pass |
| `E2E_CHANNEL=msedge npm run test:e2e` (Edge 154) | 9 / 9 pass |
| Crawl `--label after` (26 URLs × 9 viewports, local) | 0 layout findings, 0 axe violations, 0 failed requests, 0 console errors (except the expected 404 status on the 404 test URL) |
| Lighthouse (local, 3 pages × 2 form factors) | Perf 97–100; a11y, BP, SEO 100 |
| `npm audit` | 0 vulnerabilities |
| Manual browser check | Fonts render from `/assets/fonts` (no Google requests); WebP logos load; no CSP console errors; guide pre-fill works |

## Regression safeguards added

- **Tests:**
  - host redirect and `/health` exemption
  - lowercase redirect
  - 410 for retired assets and endpoints
  - brand masters not served
  - 404 page has no canonical and includes recovery links
  - malformed JSON → 400
  - lookalike origin → 403
  - `Referrer-Policy` value
  - guide ids match between pages and script
  - unique titles and descriptions
  - supplier-claim guard
- **E2E:** employer path, eyewear shortlist, resources guide, contact validation + submit, mobile nav, skip link, 404.

## Deploy status

1. ✅ Merged and deployed (`77a826b`).
2. ✅ Production verified: the redirects, 410s and headers, the read-only E2E (9/9), and the crawl (0 findings). The spot check was:

   ```bash
   curl -sI https://visionperformanceinc.com/about
   ```

   Expect a 301 to `https://visionperformanceinc.ca/about`. Then run the production commands in [04](04-deployment-parity.md). They are read-only and the form is never submitted.
3. ✅ Lighthouse re-run on production: mobile 100 / 99 / 97, desktop 100 / 100 / 100 ([18](18-performance-audit.md)).
4. ⏳ Owner: complete the search-console steps in [16](16-search-index-cleanup.md).

## Owner decisions applied (25 Sep 2026)

The phone number was removed (F-16). The reply promise was softened to "two business days" (C-12). A Privacy Officer was designated (F-17). The footer "Client sign-in" link was removed (F-19). Cloudflare was added to the privacy policy (F-32). Analytics is wired but off until a token is set (F-27).

## Open items for the owner

| ID | Decision / action | Where |
|---|---|---|
| F-07 | Make the GitHub repo private (or remove `archive/legacy-spa`) | https://github.com/Clarevission/vision-performance/settings |
| F-08 | Search Console + Bing: sitemap, re-index, change of address | [16](16-search-index-cleanup.md) |
| F-15 | Set `SESSION_SECRET` in Render | https://dashboard.render.com |
| F-18 | Cloudflare: single-hop `.com` → `.ca` rule | https://dash.cloudflare.com |
| F-27 | Create a Cloudflare Web Analytics site (manual JS snippet, not auto-inject) and set its token as `CF_ANALYTICS_TOKEN` in Render | https://dash.cloudflare.com (Analytics & Logs → Web Analytics) |
| F-28 | Set up uptime monitoring | n/a |
| F-30 | HSTS 1 year / preload | n/a |
