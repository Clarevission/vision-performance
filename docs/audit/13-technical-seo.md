# 13: Technical SEO

| Area | State | Evidence |
|---|---|---|
| Titles | Unique, 15–70 characters, on all 25 pages | `npm test`: per-page length check + uniqueness test (added) |
| Meta descriptions | Unique, 70–170 characters | Same |
| Canonical | Absolute `https://visionperformanceinc.ca/...` on every indexable page; **none on 404/500** (fixed, F-10) | Tests |
| Host canonicalization | Every other host → 301 to .ca (fixed, F-01) | Test `non-canonical hosts…`; [15](15-domain-canonicalization.md) |
| Case / trailing slash | Uppercase → 301 lowercase (fixed, F-02); trailing slash → 301 | Tests |
| Robots | `index, follow` on content; `noindex` on thank-you, 404, 500, portal and staff; `robots.txt` disallows `/api/` | Tests |
| Sitemap | 24 URLs with `lastmod`, `changefreq` and `priority` from front matter; excludes noindex pages | Test `sitemap lists indexable pages only` |
| Headings | Exactly one H1, no skipped levels | Tests |
| Internal links | All resolve | Test |
| Open Graph / Twitter | `og:title`, `og:description`, `og:image` (1200×630 wordmark), `og:url` (content pages only), `summary_large_image` | Tests |
| Language | `lang="en-CA"`, `og:locale en_CA` | Tests |
| Structured data | See [17](17-structured-data.md) | Every JSON-LD block parses |
| Performance (Core Web Vitals proxy) | Lighthouse SEO 100; mobile LCP ~2.3–2.6 s locally after the change | [18](18-performance-audit.md) |
| Status codes | 404 is a real 404; retired URLs return 410; legacy URLs 301 to a specific page | Tests |

Lighthouse SEO scored 100 on all six runs, before and after.
