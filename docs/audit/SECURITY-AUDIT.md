# Security audit summary

**Overall:** no critical issues. No live secrets are committed, either in the current files or in git history. One real vulnerability (F-03) and two attack-surface issues (F-06, F-09) were fixed.

| ID | Sev | Issue | Status |
|---|---|---|---|
| F-03 | P1 | API origin check accepted lookalike origins (prefix match) | RESOLVED: exact match; tested |
| F-06 | P1 | Retired form endpoints still accepted and stored data | RESOLVED: removed, 410 |
| F-09 | P2 | Brand masters publicly downloadable | RESOLVED: moved out of `public/` |
| F-11 | P2 | Generic 500 on malformed input | RESOLVED: 400/413 JSON, no stack traces |
| F-12 | P2 | Internal "Command Centre" naming on the staff page | RESOLVED |
| F-24 | P3 | Dead scripts with a local path in a public repo | RESOLVED |
| F-05 | P1 | Third-party font origins in CSP and in page loads | RESOLVED: CSP now `style-src 'self'; font-src 'self'` |
| F-23 | P3 | `no-referrer` (functional, not a vulnerability) | RESOLVED: `strict-origin-when-cross-origin` |
| F-15 | P2 | `SESSION_SECRET` not confirmed in Render | REQUIRES EXTERNAL CREDENTIAL |
| F-07 | P1 | Public repository (full source + legacy site indexed) | REQUIRES OWNER INPUT |
| F-30 | P3 | HSTS 180 days, no preload | ACCEPTED RISK (owner decision) |
| n/a | n/a | `/portal` and `/staff` need `'unsafe-inline'` (legacy UI) | DEFERRED (roadmap) |

## Controls confirmed

- strict CSP on corporate pages
- `frame-ancestors 'none'`
- COOP and CORP set to same-origin
- `nosniff`
- Permissions-Policy
- HTTPS enforced, with HSTS
- rate limits on the API, logins and the contact form
- 10 KB body limit
- honeypot
- bcrypt password hashing
- HMAC-signed `HttpOnly; SameSite=Lax; Secure` cookies
- constant-time admin key
- parameterized SQL
- `npm audit` clean

Method, header values and scan details are in [19](19-security-audit.md). Testing against production was read-only (HEAD requests); nothing was posted and nothing destructive was run.
