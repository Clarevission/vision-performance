# VPI Corporate Website Refresh: Summary

**Branch:** `feature/vpi-corporate-website-refresh` · **Date:** 2026-09-25 · **Status:** implemented and tested locally; **not deployed** (merging to `main` triggers a Render production deploy and needs owner approval).

## Executive summary

visionperformanceinc.ca was a single-page eyewear retail site: "Shop Eyewear", "Book Eye Exam", a cart of 21 stock-photo frames. It made many operational claims that could not be verified (testimonials labelled "verified", CSA certification, licensed optometrists, an Edmonton clinic, pricing and an ROI calculator, carbon-neutral shipping, a 30-day guarantee). It did not mention VPI's two live software products at all, and none of its pages had a URL.

The refreshed site makes Vision Performance Inc. the corporate umbrella for **occupational vision, planned mobile and clinical care, and VPI technology**. It has 25 real, crawlable pages. Every service is labelled *Available now*, *In development*, *Planned* or *Internal*, so the site can be ambitious without being inaccurate. It was built with no new runtime dependencies, keeps the client portal, staff dashboard and enquiry APIs working, and is covered by a 45-test regression suite.

## Original site assessment: major weaknesses

1. **No URLs:** one 191 KB document with fragment "pages", a soft-404 catch-all and a sitemap of fragments.
2. **Wrong positioning:** retail-first, with no mention of SafetyOS or Mires.
3. **Unverifiable claims:** 19 items recorded in the Claims Register (`01-current-site-audit.md`).
4. **Prototype features:** a fake chat, "coming soon" guides, and a shop with invented products and prices.
5. **Accessibility:** 401 `onclick` handlers on non-semantic elements, emoji icons, contrast failures, a hover-only dropdown.
6. **Operational risk:** a published fallback session secret, 3.8–4.3 MB images on the portal, and a clinical intake form on a marketing site.

## New corporate architecture

| Element | Role on the site |
|---|---|
| **Vision Performance Inc.** | Corporate umbrella and home of occupational vision work. Edmonton, Alberta; designed to scale across Canada |
| **Occupational Vision** | Employer programs, prescription safety eyewear (with the Style Picker), visual ergonomics, workplace eye health. **In development** |
| **Clinical / Mobile** | Mobile vision clinics and a clinical and optical network. **Planned**, with no clinical services claimed |
| **VPI Technology** | The Technology section, with corporate summaries linking to product sites |
| **VPI SafetyOS™** | Health & safety management. **Available.** → safetyos.visionperformanceinc.ca |
| **VPI Mires™** | Optometry and optical practice management. **Available.** → mires.visionperformanceinc.ca |
| **VPI Command Centre** | Proprietary operations platform, presented as evidence of a technology-enabled operating model. **Internal**, not linked |
| **Lunettes Emporium** | Future clinical and optical brand. Mentioned once on About as "not yet open" |

## Pages added (new URLs)

`/solutions` · `/solutions/occupational-vision` · `/solutions/prescription-safety-eyewear` · `/solutions/prescription-safety-eyewear/styles` · `/solutions/visual-ergonomics` · `/solutions/workplace-eye-health` · `/technology` · `/technology/safetyos` · `/technology/mires` · `/technology/operations` · `/industries` · `/industries/energy` · `/industries/construction` · `/industries/manufacturing` · `/industries/transportation` · `/industries/office` · `/terms` · `/accessibility` · `/contact/thank-you` · real 404

## Pages rewritten

Home (`/`) · Mobile Clinic → `/mobile-clinics` · About (`/about`) · Contact (`/contact`) · Learn → `/resources` · Privacy & Terms → `/privacy` + `/terms`

## Pages removed (with 301 redirects)

Shop → `/solutions/prescription-safety-eyewear/styles` (rebuilt as the honest Style Picker) · Book → `/contact` (no clinical booking) · Industrial Programs → `/solutions/occupational-vision`

## Design improvements

- One token-based design system: brand navy matching the logo, orange reserved for the primary action, cyan detail from the logo rule, and verified contrast.
- Montserrat and Inter (5 weights, down from 21). One line-icon family in place of emoji. One card system and status pills.
- Calm, restrained layouts: no glows, glass effects or pulsing animations. Every section has a clear heading, supporting copy and at most two CTAs.

## UX improvements

- Grouped navigation (Solutions / Technology / Industries) with accessible dropdowns, a simple mobile menu, breadcrumbs and "More in …" sub-navigation.
- Differentiated CTAs by intent, with topic prefill on the contact form.
- The Style Picker gives employers a concrete first step, and their shortlist flows into the enquiry.
- A contact form with an error summary, inline errors and a no-JS fallback. Honest response-time wording.
- Removed the fake chat, the sticky booking bar, the cart, the cookie banner (no cookies on public pages) and the B2C/B2B toggle.

## SEO improvements

25 indexable URLs with unique titles, descriptions and canonicals. Open Graph/Twitter tags and a share image. JSON-LD for Organization, WebSite, BreadcrumbList, SoftwareApplication and FAQPage. A generated sitemap, a real 404, 301s for retired paths, and legacy fragment redirects. One h1 per page, and keyword stuffing removed. Details: `08-seo-audit.md`.

## Accessibility improvements

Semantic links and buttons (0 inline handlers), a skip link, visible focus, a disclosure-pattern nav, and a mobile menu with a focus trap. Labelled forms with an error summary. Text status labels. Reduced motion. 0 contrast failures across 3,993 elements. No horizontal scroll from 320 px up. Details: `07-accessibility-audit.md`.

## Performance improvements

Homepage HTML 191 KB → 42 KB (Brotli 38 KB → 7 KB). DOM nodes 2,296 → 774. JS 25 KB → 12 KB. Hashed CSS and JS cached for a year. Font weights 21 → 5. Portal logo 3.8 MB → 65 KB, portal favicon 4.3 MB → 2 KB. Responsive WebP. CLS 0. Details: `09-performance-audit.md`.

## Security improvements

- No published session secret in production. Constant-time admin key comparison.
- Strict CSP on corporate pages (no inline script or style); the looser policy is confined to the portal and staff pages.
- `Permissions-Policy`. `trust proxy` for correct rate limiting. Honeypot.
- Clinical intake endpoint retired (410). Portal and staff pages noindexed.
- 0 dependency vulnerabilities. Unused and stale packages removed.

Details: `10-security-privacy-audit.md`.

## Remaining risks

1. **`SESSION_SECRET` on Render is unconfirmed** (P0, owner).
2. The phone number is unconfirmed (a code TODO called it a placeholder).
3. Only Chromium was tested. No screen-reader or real-device pass yet.
4. Production email and database were not exercised (dev fallbacks only).
5. Investor-facing credibility is limited until leadership information and real traction can be published.
6. The portal and staff pages keep their legacy code (inline handlers, older styles).

## Future recommendations

Publish the first two guides. Add leadership bios. Connect privacy-respecting analytics to the existing `vpiTrack` events. Add real supplier frames to the Style Picker when signed. Launch pages for mobile clinics and the clinical network when they become real. Self-host fonts. Add CI. Clean up the ~50 obsolete root scripts. See `VPI-WEBSITE-FUTURE-BACKLOG.md`.

## Documentation set

`00-repository-assessment` · `01-current-site-audit` (with Claims Register) · `02-content-inventory` · `03-information-architecture` · `04-content-strategy` · `05-design-system` · `06-component-architecture` · `07-accessibility-audit` · `08-seo-audit` · `09-performance-audit` · `10-security-privacy-audit` · `11-qa-report` · `12-final-review` · this summary · `VPI-WEBSITE-FUTURE-BACKLOG`
