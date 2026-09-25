# 07 — Accessibility Audit (WCAG 2.2 AA)

**Scope:** all 25 corporate pages plus the 404 page, on branch `feature/vpi-corporate-website-refresh`.
**Method:** code review, the automated regression suite (`npm test`), and in-browser programmatic checks (Chromium) at 8 viewport widths.
**Not covered:** screen-reader walkthroughs with NVDA or VoiceOver on real devices (see backlog A11Y-1), and `/portal` and `/staff`, which were not redesigned.

## Issues found in the previous site, and resolution

| # | Issue (before) | WCAG | Severity | Resolution |
|---|---|---|---|---|
| 1 | 401 `onclick` handlers on `<a>`/`<div>` without `href`, patched by JS adding `tabindex`/`role` | 2.1.1, 4.1.2 | High | All navigation uses real `<a href>`; actions use `<button>`. **Zero** inline handlers (enforced by test) |
| 2 | Two `<h1>`s on home; other "pages" had no heading (titles were `div`s) | 1.3.1, 2.4.6 | High | Exactly one `<h1>` per page. No skipped levels, and the first heading is the h1 (test) |
| 3 | Footer injected by JS from a `<template>` | 1.3.1 | Medium | Footer is server-rendered on every page |
| 4 | Dropdown was hover-only, with `role="menu"` but no menu keyboard model | 2.1.1, 4.1.2 | High | Disclosure pattern: `<button aria-expanded aria-controls>`. Enter/Space toggles, Esc closes and returns focus, and outside click or focus closes (verified in browser) |
| 5 | Mobile drawer: `role="dialog"` without focus management | 2.4.3 | Medium | Focus moves into the panel on open. Tab is trapped between the toggle and the panel. Esc closes and restores focus. Body scroll locks |
| 6 | 49 emoji used as icons (announced by screen readers) | 1.1.1 | Medium | Inline SVG icons with `aria-hidden="true"`; text always carries the meaning |
| 7 | Low-contrast text (e.g. `rgba(255,255,255,.35)` at 11 px; white on orange 2.8:1) | 1.4.3 | High | Token palette verified (05-design-system). **In-browser scan of 3,993 text elements across all pages: 0 failures** |
| 8 | Animations ignored `prefers-reduced-motion`; pulsing badges | 2.3.3 | Medium | No animations. Transitions are removed under reduced motion; no auto-play |
| 9 | Placeholder-only hints, asterisk-only required markers, toast-only errors | 1.3.1, 3.3.1, 3.3.2 | High | Visible labels. "(required)"/"(optional)" in text. Inline errors via `aria-describedby` + `aria-invalid`. A focusable error summary with links. `role="status"` result message |
| 10 | Fake chat widget claiming "Online" | 3.3 / trust | Medium | Removed |
| 11 | No skip link | 2.4.1 | Medium | "Skip to main content", visible on focus |
| 12 | Fragment-only "pages" with one `<title>` | 2.4.2 | Medium | Unique descriptive `<title>` per page |
| 13 | Status conveyed by colour on badges | 1.4.1 | Medium | Status pills always contain the words ("Planned", "In development"…) |

## Current state: checks performed

| Check | Result |
|---|---|
| One `h1`, no skipped heading levels (all pages) | ✅ test |
| Every `<img>` has `alt` (decorative badge uses `alt=""`) | ✅ test |
| Every `aria-controls`, `aria-labelledby`, `aria-describedby` and in-page `#` link resolves | ✅ test |
| No duplicate `id`s | ✅ test |
| Landmarks: `header`, `nav[aria-label]` ×3 (Primary, Mobile, Footer), `main`, `footer`, labelled `aside` | ✅ review |
| Colour contrast (text, AA) | ✅ 0 failures / 3,993 elements (after fixing grey-on-mist 4.43:1 → 7.1:1) |
| Focus visible on all interactive elements (blue ring on light, cyan on dark) | ✅ review |
| Keyboard: dropdowns, mobile menu, FAQ `<details>`, shortlist toggles (`aria-pressed`) and form | ✅ browser |
| Reflow at 320 px with no horizontal scrolling (27 URLs × 8 widths) | ✅ browser |
| Tap targets ≥ 24 px (2.5.8). Buttons and inputs are 44–46 px. Card titles use full-card link areas | ✅ browser |
| `lang="en-CA"` | ✅ test |
| Form: labels, autocomplete tokens, error identification and suggestion | ✅ browser |

## Remaining items (not blocking launch)

| ID | Item | Priority |
|---|---|---|
| A11Y-1 | Manual screen-reader pass (NVDA + Firefox, VoiceOver + Safari iOS) | P1 |
| A11Y-2 | `/portal` and `/staff` still use inline handlers and older styles; audit and refactor | P2 |
| A11Y-3 | Consider `@media (forced-colors: active)` refinements for status pills and borders | P3 |
