# 20: Future-proofing (design system, components, operations)

## Design system and components

- **Tokens:** colour, spacing, radius, shadow and easing are CSS custom properties in `site.css :root` (documented in `docs/website-refresh/05-design-system.md`).
- **Components:** partials in `views/partials/` cover the page hero, CTA band, cards, status labels, contact form, product panels, the legal aside and photos. The `photo`, `status`, eyewear-grid and lens-option partials are data-driven through `lib/dynamic-partials.js`.
- **Adding a page:** a new file in `views/pages/` gets routing, the sitemap, the canonical, breadcrumbs and nav state automatically. The test suite then checks its metadata, headings, links, images, claims and CSP compliance.
- **Brand assets:** masters live in `brand/` and derivatives are regenerated with `npm run images`. Asset URLs are immutable, so a changed image needs a new filename.

## Operational gaps and recommendations

| Area | Recommendation | Owner decision needed |
|---|---|---|
| CI | Add a GitHub Actions workflow on pull requests: `npm ci`, `npm test`, `npm run test:e2e` (use Playwright's bundled Chromium in CI with `npx playwright install chromium` and `E2E_CHANNEL=chromium`). Protect `main` | Yes (repo settings) |
| Analytics (F-27) | `vpiTrack` already emits `data-track` events (contact, product clicks, shortlist, resource requests) to `dataLayer`. Connect a privacy-friendly analytics tool, then update the privacy policy and CSP | Yes |
| Monitoring (F-28) | Uptime check on `https://visionperformanceinc.ca/health`, plus Render notifications for failed deploys | Yes |
| Error visibility | Server errors go only to Render logs. Consider a log drain or error tracker | Yes |
| Photographs (F-29) | Download the chosen photos and generate AVIF/WebP derivatives into `public/assets/img/photos/`. Then drop `images.unsplash.com` from CSP and the privacy policy | No (engineering), but keep the no-credit rule |
| Dependencies (F-25) | Majors one at a time ([02](02-dependency-audit.md)); Dependabot for minors | No |
| Legacy apps | Move `/portal` and `/staff` off inline handlers so the strict CSP can apply everywhere | No |
| Line endings | Add `.gitattributes` (`* text=auto eol=lf`) | No |
| Cross-browser (F-26) | Add Firefox and WebKit projects to the E2E run in CI | No |
| Careers | Add a `/careers` page when hiring starts; the footer link currently goes to the contact topic | Yes |
| Content | Publish the first resource guide. Every "Request this guide" enquiry is demand evidence | Yes |
