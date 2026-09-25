# 14: Legacy URL remediation

The previous site was a single-page app on one URL (`/`). Its "pages" were in-page views or hash states, plus a few server paths. The known legacy paths come from the archived app (`archive/legacy-spa/`), the old navigation and search results.

| Legacy URL | Where it came from | Handling | Rationale |
|---|---|---|---|
| `/` (old "Precision Vision for Professionals" snapshot) | Search index | Same URL, new content | Needs re-crawl (F-08) |
| `/shop` | Old eyewear shop | 301 → `/solutions/prescription-safety-eyewear/styles` | Closest equivalent: the style picker replaced the shop |
| `/book` | Old appointment booking | 301 → `/contact` | No booking exists; contact is the honest next step |
| `/learn` | Old education section | 301 → `/resources` | Direct equivalent |
| `/mobile`, `/mobile-clinic` | Old mobile-clinic view | 301 → `/mobile-clinics` | Direct equivalent |
| `/industrial`, `/industrial-programs` | Old corporate programs | 301 → `/solutions/occupational-vision` | Direct equivalent |
| `/index.html`, `/home` | Alternate home URLs | 301 → `/` | Duplicates |
| `/favicon.png` | Old favicon path | 301 → `/assets/img/vpi-favicon-32.png` | Keeps old bookmarks and icons working |
| `/app.js` | Old SPA bundle | **410 Gone** | No replacement; tells crawlers to drop it |
| `/van.png`, `/van.webp` | Old hero images (4–6 MB) | **410 Gone** | Masters moved to `brand/` (F-09) |
| `/images/logo-*.png` | Old logo masters | 404 (no longer served) | Not linked or indexed; masters in `brand/` |
| `/api/appointment`, `/api/mobile`, `/api/corporate` | Old form endpoints | **410** JSON | F-06 |
| Any mixed-case variant | Links typed by hand or from third parties | 301 → lowercase | F-02 |

No legacy URL is redirected to the homepage as a catch-all. Unknown URLs get a real 404 with recovery links.
