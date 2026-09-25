# 05: Visual and UI audit

## Method

`scripts/audit/crawl.js` loads every public URL (25 pages + a 404) in Chrome 154 at 9 viewports:

- 1920×1080
- 1440×900
- 1280×800
- 1024×768
- 768×1024
- 430×932
- 390×844
- 375×812
- 320×568

On each load it takes a full-page screenshot and runs in-page layout checks:

- **Grid gaps:** the last row of a grid is missing columns.
- **Split imbalance:** one side of a two-column split is much taller than the other.
- **Card blank space:** a card has more than about 90 px of empty space under its content.
- **Orphaned blocks:** narrow blocks left stranded.
- **Collisions:** overlapping boxes.
- **Clipping:** clipped text.
- **Overflow:** horizontal page overflow.
- **Broken images.**

The screenshots are in `docs/audit/screenshots/` (baseline, taken of production) and `docs/audit/screenshots-after/` (after, local). They are git-ignored (234 JPEGs per run); regenerate them with `npm run audit:crawl`.

## Results

| Run | Pages × viewports | Layout findings |
|---|---|---|
| Baseline (production, `81b73d5`) | 26 × 9 | **1**: `/solutions/workplace-eye-health` @768: 103 px blank in the "Referral pathways" card (F-22) |
| After (audit branch, local) | 26 × 9 | **0** |

Manual review of the screenshots found no overlaps, cropped headings, orphaned buttons, or photos with awkward crops at any width. The logo (WebP) stays sharp at 1.5× and 2× device pixel ratio.

## Changes

- **F-22:** balanced the Referral pathways card, and removed blank lines left over from the icon removal in the solutions and industries cards.
- **F-20:** the header, footer and home ecosystem logo use 180w/360w WebP with `sizes`. Rendered widths are 88 / 107 / 124 / 169 px, which are unchanged.
- **F-21:** resource cards gained a `card__meta` "Request this guide" link. It uses existing card styles, and the cards' bottoms align because `.card__meta` has `margin-top: auto`.
