# Accessibility audit summary

**Target:** WCAG 2.2 Level AA. **Conformance claim: none.** Automated and scripted checks pass, but manual assistive-technology testing has not been done, so conformance can't be claimed.

## Evidence

| Check | Result |
|---|---|
| axe-core 4.13, 26 URLs × {1440, 375} px, before and after | **0 violations** |
| Lighthouse accessibility, 6 runs before + 6 after | **100** |
| Structural tests on every page (lang, one H1, heading order, ARIA references, unique ids, alt text) | Pass |
| Reflow at 320 px, 26 URLs | No horizontal scroll |
| Keyboard: skip link, mega-menu Escape, mobile menu Escape + focus return and focus trap | Pass (E2E + code) |
| Forms: labels, error summary focus, `aria-invalid`, `aria-describedby`, live status | Pass (E2E) |
| Link purpose: repeated "Request this guide" links include hidden guide titles; new-tab links announce it | Pass |
| Target size ≥ 24×24 (2.5.8) | Buttons 40–44 px min-height |
| Focus visible (2.4.7) / not obscured (2.4.11) | 2 px outline; `scroll-padding-top` clears the sticky header |

## Not yet done (recommended before claiming conformance)

1. **Screen-reader passes:**
   - NVDA + Firefox on Windows: home, the eyewear style picker, and the contact form with errors.
   - VoiceOver + Safari on iOS: mobile nav and the contact form.
2. **Forced-colours / Windows High Contrast check:** status labels, focus rings and the shortlist toggle state.
3. **200% and 400% zoom review:** of the mega-menu and shortlist bar.
4. **The same audit for `/portal` and `/staff`,** which were reviewed only for security.

The public accessibility statement (`/accessibility`) makes no conformance claim, and it gives a contact route for barriers.
