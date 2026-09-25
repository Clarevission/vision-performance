# Vision Performance Inc.: corporate website post-implementation audit

**Site:** https://visionperformanceinc.ca · **Date:** 25 September 2026 · **Baseline:** `81b73d5` (live) · **Branch:** `audit/vpi-corporate-post-launch`, merged as `77a826b` and **live and verified** on 25 Sep 2026

## Verdict

The redesigned site is in good shape:

- Production matches the repository.
- Automated accessibility checks find no violations.
- Security headers and form handling are sound.
- No secrets are committed.
- The content discipline (status labels, no unverified claims) holds and is enforced by tests.

The audit found **no P0 issues**. The most significant problems were outside the pages themselves:

1. **Duplicate hosts** (`.com`, `onrender.com`) served full copies of the site, and **mixed-case URLs** returned duplicates. These are fixed with 301s (F-01, F-02).
2. **Search results still show the old site.** Fixing that needs Search Console and Bing access (F-08), and the public GitHub repo (with the archived old site) is indexed (F-07).
3. **Google Fonts blocked rendering for about 1.7 s on mobile.** Fonts are now self-hosted. On production, mobile Lighthouse performance went from 89 to 97–100, and FCP from about 2.9 s to about 1.0 s (F-05).
4. **An API origin-check bypass** (F-03), **two unmonitored retired form endpoints** (F-06), and **one unverified supplier claim** (F-04). All are fixed.

## Numbers

| Measure | Before | After |
|---|---|---|
| Findings | n/a | 32: **P0 0 · P1 8 · P2 10 · P3 14** |
| Resolved | n/a | **22** (18 in the audit + 4 after owner decisions) |
| Owner input / external credential | n/a | **6** (3 owner input · 3 external credential) |
| Deferred / accepted risk | n/a | **2** deferred (F-25, F-26) · **2** accepted (F-29, F-30) |
| `npm test` | 53 tests, 61 s | **55 tests, all pass, ~1.5 s** |
| E2E journeys | none | **9, pass in Chrome and Edge** |
| axe violations (26 URLs × 2 widths) | 0 | **0** |
| Layout findings (26 URLs × 9 viewports) | 1 | **0** (local and production) |
| Lighthouse mobile performance (home / technology / contact), production | 89 / 89 / 89 | **100 / 99 / 97** |
| Lighthouse a11y / best practices / SEO | 100 / 100 / 100 | 100 / 100 / 100 |
| `npm audit` | 0 | 0 |
| Committed secrets | 0 | 0 |

The counts add up as follows. RESOLVED: F-01 to F-06, F-09 to F-14, F-16, F-17, F-19 to F-24, F-31 and F-32 (22). Owner input: F-07, F-18 and F-28 (3). External credential: F-08, F-15 and F-27 (3). Deferred: F-25 and F-26. Accepted risk: F-29 and F-30.

## Documents

| Topic | Detail | Summary |
|---|---|---|
| Discovery, build, dependencies, routes, parity | [00](00-system-discovery.md) · [01](01-build-health.md) · [02](02-dependency-audit.md) · [03](03-route-inventory.md) · [04](04-deployment-parity.md) | n/a |
| Visual, UX, IA, workflows, forms | [05](05-visual-ui-audit.md) · [06](06-ux-audit.md) · [07](07-information-architecture.md) · [08](08-workflow-audit.md) · [09](09-form-audit.md) | n/a |
| Accessibility | [10](10-accessibility-audit.md) | [ACCESSIBILITY-AUDIT](ACCESSIBILITY-AUDIT.md) |
| Content and claims | [11](11-content-audit.md) · [12](12-claims-register.md) | n/a |
| SEO, legacy, domains, index, schema | [13](13-technical-seo.md) · [14](14-legacy-url-remediation.md) · [15](15-domain-canonicalization.md) · [16](16-search-index-cleanup.md) · [17](17-structured-data.md) | [SEO-REMEDIATION](SEO-REMEDIATION.md) |
| Performance | [18](18-performance-audit.md) | [PERFORMANCE-AUDIT](PERFORMANCE-AUDIT.md) |
| Security | [19](19-security-audit.md) | [SECURITY-AUDIT](SECURITY-AUDIT.md) |
| Future | [20](20-future-proofing.md) | [FUTURE-ROADMAP](FUTURE-ROADMAP.md) |
| All findings | [MASTER-FINDINGS](MASTER-FINDINGS.md) | [REMEDIATION-REPORT](REMEDIATION-REPORT.md) |

## Coverage of other brief areas

- **Headers, privacy:** [19](19-security-audit.md), [11](11-content-audit.md)
- **Error handling:** F-10, F-11
- **External links:** new tab plus `noopener` and a screen-reader hint, tested
- **Brand consistency:** wordmark everywhere, favicon and share image from the wordmark, ™ usage ([11](11-content-audit.md))
- **Navigation, footer, CTAs:** [06](06-ux-audit.md), [07](07-information-architecture.md)
- **Analytics, observability:** F-27, F-28
- **Design system, components, dead code:** [20](20-future-proofing.md), F-24
- **Tests and E2E:** [01](01-build-health.md)

## Limits

- Automated accessibility testing and scripted keyboard checks do not establish WCAG conformance; no screen-reader or user testing was done.
- Firefox and Safari were not tested.
- The portal and staff apps were reviewed as code, not exercised live.
- Search-engine work has not been done (no credentials).
