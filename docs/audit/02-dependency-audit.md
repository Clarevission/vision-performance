# 02: Dependency audit

`npm audit` finds **0 vulnerabilities**, both before and after this audit. `npm audit fix --force` was not run and no major upgrades were applied, as the brief requires.

## Runtime dependencies

| Package | Before | After | Latest | Action |
|---|---|---|---|---|
| express | 4.22.3 | 4.22.3 | 5.2.1 | DEFERRED: major. v5 changes path-matching syntax, `req.query` parsing and async error handling. Upgrade on its own branch with the full suite |
| helmet | 7.2.0 | 7.2.0 | 8.3.0 | DEFERRED: major. v8 changes some defaults (HSTS, CSP). Low risk, because the CSP is explicit |
| express-rate-limit | 7.5.1 | 7.5.1 | 8.7.0 | DEFERRED: major. v8 changes IPv6 subnet keying. Check that `trust proxy` behaviour behind Cloudflare/Render is unchanged |
| dotenv | 16.6.1 | 16.6.1 | 18.0.4 | DEFERRED: major. Only used locally |
| pg | 8.22.0 | **8.23.0** | 8.23.0 | Updated (in range) |
| resend | 6.14.0 | **6.30.0** | 6.30.0 | Updated (in range) |
| bcryptjs, validator | current | current | n/a | No change |

## Dev dependencies

| Package | Version | Why |
|---|---|---|
| sharp | existing | `npm run images` (derivatives) |
| nodemon | existing | `npm run dev` |
| **playwright-core** | 1.63.0 (new) | E2E journeys and the audit crawl. Drives the *installed* Chrome/Edge; downloads no browsers |
| **axe-core** | 4.13.0 (new) | Automated accessibility checks inside the crawl |

Both new packages are dev-only and are not loaded in production. `npm install` on Render still installs them, because `render.yaml` runs `npm install` without `--omit=dev`. That has no runtime effect, but switching the build command to `npm ci --omit=dev` would slim the image. The change is left to the owner because it alters the deploy pipeline.

## Recommended upgrade order

Upgrade one package per PR, running `npm test && npm run test:e2e` after each:

1. helmet 8
2. express-rate-limit 8
3. dotenv 18
4. express 5, last, because it touches the most code
