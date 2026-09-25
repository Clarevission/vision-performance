# 06 — Component Architecture

## Rendering model

The site has no front-end framework and no new dependencies. `lib/pages.js` is a ~150-line composer that runs once at boot:

```
views/
  layout.html                 <html> shell: head meta, header, main, footer, scripts
  partials/*.html             Reusable components (with {{param}} substitution)
  pages/**/*.html             One file per URL, starting with <!--meta {JSON}-->
  data/eyewear-styles.js      Structured data for the Style Picker (swap in real frames later)
lib/pages.js                  load → resolve partials → wrap in layout → post-process nav → cache
```

- **Front matter** (JSON in the first HTML comment): `path`, `title`, `description`, `breadcrumb`, `robots`, `schema` (extra JSON-LD), `bodyClass`, `ogImage`, `sitemap` (priority/changefreq), `section`.
- **Partial call:** `{{> name key="value" other="value"}}`. Inside a partial, `{{key}}` is replaced, missing keys become an empty string, and nesting is allowed up to depth 6.
- **Dynamic partials:** JS functions registered in `lib/pages.js`, for example `{{> eyewear-style-grid}}` built from `views/data/eyewear-styles.js`, so data-driven markup is still server-rendered HTML.
- **Post-processing:** `aria-current="page"` and `is-active` are applied to `[data-nav]` links, the `{{asset:css}}` / `{{asset:js}}` hashes, and the year.
- **Output:** complete HTML per path, held in memory. Express serves it with an ETag. Tests import the same registry.

## Components

| Component | Implementation | Reuse | Notes |
|---|---|---|---|
| Navigation (desktop) | `partials/header.html` + `site.js` disclosure | Every page | `<button aria-expanded aria-controls>`; panels are `<div hidden>`; Esc and outside-click close; hover opens on `(hover:hover)` |
| Mobile navigation | Same partial; `#mobile-nav` panel | Every page | Focus trap, Esc, `<details>` groups, body scroll lock |
| Announcement banner | `partials/announcement.html` | Every page | Dismiss persisted in `localStorage` (try/catch). Content: SafetyOS launch |
| Breadcrumb | Generated from front matter | All but home | `<nav aria-label="Breadcrumb"><ol>` + `BreadcrumbList` JSON-LD |
| Hero (home) | Inline in `pages/index.html` | 1 | Only one display h1 |
| Page hero | `partials/page-hero.html` (`eyebrow`, `title`, `lede`, `status`) | ~22 pages | Renders the page `<h1>` |
| Section header | CSS pattern `.section-head` (eyebrow + h2 + lede) | Everywhere | Pattern, not a partial: content varies too much |
| Status pill | Dynamic partial `status` (`kind` = available / development / planned / internal) | ~60 uses | Text label always present (never colour alone); unknown kinds fail the build |
| Solution card | `.card` + `.card--link` pattern | Home, Solutions, Industries | Whole-card link via a real `<a>` in the title and a stretched pseudo-element |
| Product card (technology) | `partials/product-safetyos.html`, `partials/product-mires.html` | Home, Technology, Industries, About | Single source for product copy, so product-site claims are edited in one place |
| Industry card | `.card` pattern | Home, Industries | — |
| Feature grid | `.feature-grid` pattern with icon + h3 + p | Many | — |
| Process steps | `.steps` ordered list | Mobile clinics, safety eyewear | Semantic `<ol>` |
| Status table | `partials/status-table.html` | About, Solutions | Canonical current-vs-planned table, one source of truth |
| CTA band | `partials/cta.html` (`title`, `body`, `primary_label`, `primary_href`, `secondary_label`, `secondary_href`, `track`) | Every page end | Differentiated CTAs per page |
| FAQ | Native `<details>/<summary>` | Mobile clinics, safety eyewear | `FAQPage` JSON-LD only where visible |
| Resource card | `.card` pattern with status | Resources, Home | Honest "In preparation" status |
| Contact form | `partials/contact-form.html` | Contact | Progressive enhancement: works without JS (POST → 303 → thank-you) |
| Style picker | Dynamic partial + `site.js` shortlist | Styles page | `<button aria-pressed>` per style; shortlist in `localStorage`; "Add shortlist to enquiry" → `/contact?topic=safety-eyewear` with a prefilled message |
| Footer | `partials/footer.html` | Every page | Server-rendered (previously JS-injected) |
| ~~Notice (cookie banner)~~ | Removed during implementation | — | Public pages set no cookies; localStorage use is disclosed in the privacy policy, so a banner added friction without purpose |

### Deliberately not built

| Component | Reason |
|---|---|
| Statistics block | No verified statistics exist to put in it |
| Logo wall | No verified client or partner logos |
| Testimonial | Archived per owner decision; the pattern will be added when real, consented quotes exist |

All three are listed in the backlog with their prerequisites.

## Client script (`/assets/js/site.js`, target < 8 KB)

1. Nav disclosures, mobile panel, focus trap
2. Announcement and notice dismissal
3. Contact form: `?topic=` prefill, shortlist prefill, validation with error summary, `fetch` submit, inline `aria-live` status
4. Style picker shortlist
5. Analytics dispatcher: `data-track` clicks → `vpiTrack(event, props)` → `window.dataLayer.push` (only if an analytics tool is later installed) + a `vpi:track` CustomEvent. No third-party script is loaded
6. Legacy hash redirects on `/`

No inline event handlers. CSP for corporate pages drops `script-src-attr 'unsafe-inline'`. It is retained only on `/portal` and `/staff`, which still use inline handlers (backlog item).

## Server routes

```
GET  <each registered page path>         → cached HTML (200)
GET  /sitemap.xml                         → generated from registry (indexable pages only)
GET  /robots.txt                          → static
GET  /favicon.ico                         → 32px PNG
301  legacy paths (see IA)                → new paths
GET  /portal, /staff                      → unchanged files + X-Robots-Tag: noindex
POST /api/contact                         → JSON (fetch) or 303 redirect (no-JS form post)
POST /api/mobile, /api/corporate          → unchanged (retained for compatibility)
POST /api/appointment                     → 410 Gone (clinical intake retired)
*    (unmatched GET)                      → 404 page with status 404
```

## Test harness

`node --test` (built in, no dependency). `server.js` exports `app` and only listens when run directly.
