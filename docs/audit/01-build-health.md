# 01: Build health

The site has no build step. "Build health" here means installing, syntax-checking, booting and testing.

| Check | Command | Result (audit branch) |
|---|---|---|
| Install | `npm install` | Clean; 0 vulnerabilities (`npm audit`) |
| Syntax | `npm run check` | Pass |
| Boot | `node server.js` | Composes 25 pages + 404 + 500 at boot; fails fast if either error page is missing |
| Unit/integration | `npm test` | **55 / 55 pass** in about 1.5 s (was 53 tests taking 61 s before F-13 was fixed) |
| E2E | `npm run test:e2e` | **9 / 9 pass** in Chrome 154, and 9 / 9 in Edge 154 (`E2E_CHANNEL=msedge`) |
| Layout + axe crawl | `npm run audit:crawl -- --label after` | 26 URLs × 9 viewports; 0 layout findings; 0 axe violations |

## Issues found and fixed

- **Slow, hanging tests (F-13).** With `DATABASE_URL` unset, `pg` connected to `localhost:5432`. On the audit machine an unrelated Postgres was listening there, so tests held open sockets for 60 s. On a clean machine the same code would fail slowly. `lib/db.js` now returns a stub pool that rejects immediately, and the test teardown closes every connection.
- **The server started on `require`.** `server.js` now exports the app and listens only when run directly, so tests and E2E can mount it on their own port.

## Notes

- Git reports LF→CRLF conversion warnings on Windows (`core.autocrlf`). They are harmless; consider adding a `.gitattributes` with `* text=auto eol=lf` to keep the repo's line endings consistent.
- Continuous integration is not configured (no `.github/workflows`). The recommendation is in [20](20-future-proofing.md).
