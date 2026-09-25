# 08 — SEO Audit & Implementation

## Before

- **One indexable URL.** All content lived in one document; the "pages" had no URLs. The sitemap listed `/#shop`, `/#mobile` and so on, and search engines ignore fragments.
- A soft-404 catch-all: every unknown path returned the homepage with status 200.
- One title and description sitewide. `meta keywords`. No canonical, Open Graph, Twitter or structured data.
- A keyword-stuffing band ("Serving Professionals Searching For", 12 tags).
- Two `h1`s on the homepage.

## After

| Area | Implementation |
|---|---|
| URLs | 25 descriptive, hierarchical URLs (`/solutions/prescription-safety-eyewear`, `/industries/energy`, …). Canonical form has no trailing slash, and trailing slashes 301 to it |
| Titles | Unique per page, ≤ 70 characters (test). Pattern: `{Page} \| Vision Performance Inc.`, or `\| VPI` when the full brand would exceed 65 characters |
| Descriptions | Unique per page, 70–170 characters (test). No unverified claims |
| Canonical | Absolute `https://visionperformanceinc.ca{path}` on every page (test) |
| Open Graph / Twitter | `og:title/description/url/image/type/locale=en_CA`, `twitter:card=summary_large_image`. Default share image 1200×630 (`/assets/img/og-default.jpg`, 59 KB) |
| Structured data | `Organization` + `WebSite` (home). `BreadcrumbList` (every inner page). `SoftwareApplication` (SafetyOS, Mires: no ratings or offers, so nothing is fabricated). `FAQPage` only where the FAQ is visible (mobile clinics, safety eyewear). All JSON-LD parses (test) |
| Headings | One `h1` per page; logical hierarchy (test) |
| Sitemap | `/sitemap.xml` generated from the page registry: 24 indexable URLs. It excludes `/contact/thank-you`, the 404 page, `/portal` and `/staff` (test) |
| robots.txt | `Allow: /`, `Disallow: /api/`, `Sitemap:` line |
| noindex | `/portal`, `/staff`: meta robots plus `X-Robots-Tag` header. `/contact/thank-you` and 404: `noindex, follow` |
| 404 | Real status 404 with helpful links (test) |
| Internal linking | Mega-nav, breadcrumbs, "More in …" section sub-nav, contextual cross-links (solution ↔ industry ↔ technology), and a footer sitemap. All internal links and anchors resolve (test) |
| Alt text | All images have alt text (test) |
| `lang` | `en-CA`; Canadian spelling |
| Keyword stuffing | Removed |

## Redirects (301)

`/shop` → `/solutions/prescription-safety-eyewear/styles` · `/book` → `/contact` · `/learn` → `/resources` · `/mobile`, `/mobile-clinic` → `/mobile-clinics` · `/industrial`, `/industrial-programs` → `/solutions/occupational-vision` · `/index.html`, `/home` → `/` · `/portal.html` → `/portal` · `/staff.html` → `/staff`.
Legacy fragments (`/#shop`, `/#mobile`, …) are redirected client-side on `/`.

## Keyword coverage (natural placement, no stuffing)

| Theme | Primary page |
|---|---|
| occupational vision Canada / employee vision programs | `/solutions/occupational-vision` |
| workplace eye health | `/solutions/workplace-eye-health` |
| mobile eye clinic | `/mobile-clinics` |
| prescription safety eyewear | `/solutions/prescription-safety-eyewear`, `/styles` |
| visual ergonomics / digital eye strain | `/solutions/visual-ergonomics`, `/industries/office` |
| industrial eye protection by sector | `/industries/*` |
| health and safety management software | `/technology/safetyos` |
| optometry practice management software | `/technology/mires` |

"Industrial eye exams" and "workplace vision testing" are deliberately **not** targeted, because VPI does not currently provide exams. Target them once clinical services exist.

## Indexing risks and follow-ups

| Risk | Action |
|---|---|
| Search engines have indexed only `/` so far; the new URLs need discovery | After deploy, submit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools (backlog SEO-1) |
| Product subdomains compete for the "SafetyOS"/"Mires" brand queries | Intended: the corporate summaries link out with a primary CTA. Keep product detail on the product sites (content governance) |
| `.com` domains are in the CORS allow-list | If `visionperformanceinc.com` serves this site, 301 it to `.ca` at the DNS/CDN level to avoid duplicates (SEO-2) |
| No published articles yet | The Resources page is honest about this. Publishing the six planned guides is the main organic-growth lever (SEO-3) |
