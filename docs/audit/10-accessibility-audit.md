# 10: Accessibility audit

The summary is in [ACCESSIBILITY-AUDIT](ACCESSIBILITY-AUDIT.md). This document records the method and the raw results.

## Automated

- **axe-core 4.13 (WCAG 2.0/2.1/2.2 A + AA rules):** 26 URLs at 1440×900 and 375×812. Baseline: 0 violations. After: 0 violations. Data: `docs/audit/data/crawl-*.json` → `pages[*].axe`.
- **Lighthouse 12 accessibility:** 100 on home, technology and contact, on mobile and desktop, before and after.
- **`npm test` structural checks on every page:**
  - `lang="en-CA"`
  - exactly one H1
  - no skipped heading levels
  - every `aria-controls`, `aria-labelledby`, `aria-describedby` and `#fragment` target exists
  - no duplicate ids
  - every `<img>` has `alt`
  - no inline handlers or styles

## Manual and scripted checks

| WCAG 2.2 criterion | Check | Result |
|---|---|---|
| 2.4.1 Bypass Blocks | Skip link is the first Tab stop and moves focus to `<main>` | ✅ (E2E) |
| 2.1.1 Keyboard / 2.1.2 No Trap | Mega-menus open with Enter/Space and close with Escape; the mobile menu closes with Escape and returns focus | ✅ (E2E for mobile) |
| 2.4.7 / 2.4.11 Focus Visible / Not Obscured | Visible 2 px focus ring; the sticky header does not cover focused elements (`scroll-padding-top`) | ✅ |
| 2.5.8 Target Size (Minimum) | Nav, buttons and shortlist toggles are ≥ 24×24 CSS px | ✅ |
| 3.3.1 / 3.3.3 Error Identification / Suggestion | Error summary + per-field messages in text | ✅ (E2E) |
| 3.3.7 Redundant Entry | Shortlist and guide pre-fill avoid retyping | ✅ |
| 1.4.10 Reflow | No horizontal scroll at 320 px (crawl, 26 pages) | ✅ |
| 1.4.3 Contrast | axe contrast rule passes, including text over photos (scrim) | ✅ |
| 2.4.4 Link Purpose | Repeated "Request this guide" links carry visually hidden guide titles; new-tab links say so | ✅ |
| 4.1.3 Status Messages | Form status is `aria-live="polite"` | ✅ |

## Not covered

These gaps are why this audit does not claim WCAG conformance:

- No screen-reader session with NVDA, JAWS or VoiceOver was performed.
- No test was run with Windows High Contrast / forced colours.
- There was no user testing with disabled participants.
- The `/portal` and `/staff` apps were not audited to the same depth.
