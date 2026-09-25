# 18: Performance audit

The summary is in [PERFORMANCE-AUDIT](PERFORMANCE-AUDIT.md). Raw data: `docs/audit/data/lighthouse.json`.

## Method

- **Tool:** Lighthouse 12, Chrome headless, default throttling (mobile: simulated slow 4G + 4× CPU; desktop preset).
- **Pages:** `/`, `/technology`, `/contact`.
- **Baseline:** production (`https://visionperformanceinc.ca`, through Cloudflare, `81b73d5`).
- **After:** audit branch on a local production-mode server (`http://localhost:3100`).

The environments differ. Local has no CDN, no Brotli (the app has no compression middleware because Cloudflare compresses) and no HTTP/2. That makes local transfer sizes larger, and it means the scores are not a like-for-like comparison. The render-blocking and FCP changes come from the removed third-party request chain, not from the environment. A production re-run after deploy is listed in [04](04-deployment-parity.md).

## Results

| Page | Form factor | Perf (before → after) | FCP ms | LCP ms | Render-blocking ms | CLS |
|---|---|---|---|---|---|---|
| Home | mobile | 89 → **98** | 2909 → 1236 | 3059 → 2286 | 1659 → 255 | 0.011 → 0.000 |
| Home | desktop | 97 → **100** | 963 → 336 | 983 → 544 | 515 → 0 | 0.052 → 0.000 |
| Technology | mobile | 89 → **98** | 2906 → 1068 | 3056 → 2420 | 1687 → 122 | 0.036 → 0.000 |
| Technology | desktop | 98 → **100** | 898 → 291 | 918 → 800 | 545 → 7 | 0.004 → 0.018 |
| Contact | mobile | 89 → **97** | 2907 → 1062 | 3057 → 2615 | 1690 → 240 | 0.018 → 0.000 |
| Contact | desktop | 98 → **100** | 886 → 389 | 886 → 637 | 502 → 80 | 0.002 → 0.034 |

Accessibility, Best Practices and SEO scored 100 in all 12 runs. TBT is 0–50 ms throughout.

## What changed

1. **Self-hosted fonts (F-05).** The baseline's main render-blocking item was `fonts.googleapis.com/css2?...` (852 ms of estimated savings on mobile home), followed by a second connection to `fonts.gstatic.com`. Latin-subset variable WOFF2 files for Inter (47 KB) and Montserrat (37 KB) are now served from `/assets/fonts`, preloaded, with `font-display: swap`. The only remaining render-blocking resource is the site's own CSS.
2. **WebP wordmark (F-20).** The header logo was a 55 KB PNG (486×300) and is now a 12 KB WebP (180w). 2× screens get the 31 KB 360w version.
3. **Brand masters removed from `public/` (F-09).** This doesn't affect page loads, but it removes 10+ MB of public downloadable files.

## Remaining opportunities (not done)

- **Hero photographs** come from `images.unsplash.com` with `w=`/`q=` parameters; they are the LCP candidate on some pages. Self-hosting AVIF/WebP derivatives would remove the third-party connection ([20](20-future-proofing.md)).
- **CSS is 47 KB uncompressed** (about 10 KB compressed). Inlining critical CSS isn't worth the complexity at this size.
- **CLS:** desktop CLS of 0.018 and 0.034 on two pages comes from the font swap. It is well under the 0.1 threshold. A metric-matched fallback font (`size-adjust`) could remove it.
