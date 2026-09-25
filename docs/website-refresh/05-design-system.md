# 05 — Design System

## Audit of the existing system (inconsistencies found)

| Area | Finding |
|---|---|
| Colour | Two token sets (dark glass `--bg-dark/--accent` and light `--navy/--orange`). Two oranges in use: `#FF6A00` and `#F97316`. Neon cyan `#00F0FF`. **White text on orange buttons (2.8:1) fails WCAG AA.** Hundreds of hard-coded inline colours |
| Typography | Three families (Inter, Montserrat, Outfit), 21 weights. Headings are a mix of `h2`, `div.page-hero-title` and `div.form-title`. Sizes are ad hoc (10.5, 11, 11.5, 12, 12.5, 13 px…). Body text at 11–12 px in many places |
| Spacing | No scale; inline margins such as `margin-top:32px`, `36px`, `64px` |
| Buttons | 8 variants (`btn-orange`, `btn-navy`, `btn-outline-white`, `btn-outline-navy`, `btn-white`, `btn-sm`, `btn-lg`, `btn-arrow`) and several one-offs styled inline (cookie, chat) |
| Cards | 12 card types with different radii (7, 12, 24 px), shadows and hover lifts |
| Icons | 49 emoji (inconsistent rendering across OSes, read aloud by screen readers) mixed with 6 inline SVGs |
| Effects | Glow shadows, gradients, glass blur, continuous pulse animations; no `prefers-reduced-motion` |
| Breakpoints | 768/1024 px mixed with 900/1100/600 px |

## New system: principles

Restrained and credible. **Navy and white carry the brand, and orange is reserved for the single primary action.** There are no glows or background gradients. One icon family. The type does the work.

## Colour tokens

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--ink` | `#00071A` | Header, footer, dark sections (matches the logo background exactly) | — |
| `--navy` | `#0A1F44` | Headings on light, secondary dark surfaces | 16.3:1 on white |
| `--navy-2` | `#13315C` | Hover and borders on dark | — |
| `--text` | `#334155` | Body on light | 10.4:1 |
| `--text-2` | `#475569` | Secondary body | 7.6:1 (7.1:1 on mist) |
| `--text-3` | `#64748B` | Meta, captions (≥14 px) | 4.8:1 |
| `--on-dark` | `#E2E8F0` | Body on ink | 16.3:1 |
| `--on-dark-2` | `#94A3B8` | Secondary on ink | 7.8:1 (6.3:1 on navy) |
| `--line` | `#E2E8F0` | Dividers, card borders | — |
| `--mist` | `#F5F7FA` | Alternate section background | — |
| `--accent` | `#F97316` | Primary button background (**ink text**), key rules | ink on accent 7.2:1 |
| `--accent-text` | `#C2410C` | Orange text and links on light | 5.2:1 |
| `--accent-on-dark` | `#FB923C` | Orange text on ink | 8.9:1 |
| `--signal` | `#22D3EE` | Cyan detail from the logo rule. Eyebrows and focus accents on dark only | 11.1:1 on ink |
| Status: available | `#166534` on `#DCFCE7` | Pill | 6.5:1 |
| Status: in development | `#92400E` on `#FEF3C7` | Pill | 6.4:1 |
| Status: planned | `#334155` on `#E2E8F0` | Pill | 8.4:1 |
| Status: internal | `#3730A3` on `#E0E7FF` | Pill | 8.1:1 |
| Focus ring | `2px solid #2563EB` + `2px` offset (light); `#22D3EE` (dark) | All interactive elements | ≥3:1 against adjacent colours |

## Typography

| Role | Family | Weight | Size (fluid) | Line height |
|---|---|---|---|---|
| Display (home h1) | Montserrat | 800 | `clamp(2.25rem, 1.6rem + 3vw, 3.75rem)` | 1.08 |
| h1 (page) | Montserrat | 800 | `clamp(2rem, 1.5rem + 2.2vw, 3rem)` | 1.12 |
| h2 | Montserrat | 700 | `clamp(1.5rem, 1.2rem + 1.3vw, 2.25rem)` | 1.2 |
| h3 | Montserrat | 700 | `1.1875rem` | 1.3 |
| Eyebrow | Inter | 600, `letter-spacing .12em`, uppercase | `0.8125rem` | — |
| Body | Inter | 400 | `1.0625rem` (17 px) | 1.65 |
| Body small | Inter | 400 | `0.9375rem` | 1.6 |
| Meta | Inter | 500 | `0.875rem` | 1.5 |

The font set drops from 21 to 5 weights: Montserrat 700/800 and Inter 400/500/600. Outfit is removed from the corporate site (the portal and staff pages keep their own styles). Measure: `max-width: 68ch` for running text.

## Spacing scale (4 px base)

`--s-1: .25rem` · `--s-2: .5rem` · `--s-3: .75rem` · `--s-4: 1rem` · `--s-5: 1.5rem` · `--s-6: 2rem` · `--s-7: 3rem` · `--s-8: 4rem` · `--s-9: 6rem`
Section padding: `clamp(3.5rem, 2rem + 5vw, 6rem)` block, `--gutter` inline.

## Layout

| Token | Value |
|---|---|
| `--container` | `1200px` max, `--gutter: clamp(1rem, 4vw, 2rem)` |
| `--container-narrow` | `760px` (legal pages, forms) |
| Grid | CSS grid `repeat(auto-fit, minmax(min(100%, 17rem), 1fr))` for card grids. Explicit 2-column split at ≥ 900 px |

## Breakpoints

`480px` (large phones) · `768px` (tablet) · `1024px` (desktop nav appears) · `1280px` (wide). Mobile-first `min-width` queries only.

## Radii, shadows, borders

| Token | Value |
|---|---|
| `--r-sm` | 6px (buttons, inputs) |
| `--r-md` | 10px (cards) |
| `--r-lg` | 16px (feature panels, images) |
| `--r-pill` | 999px (status pills) |
| `--shadow-1` | `0 1px 2px rgba(2,6,23,.06), 0 1px 1px rgba(2,6,23,.04)` (cards at rest) |
| `--shadow-2` | `0 8px 24px rgba(2,6,23,.08)` (card hover, dropdown panels) |

Cards use a 1 px `--line` border plus `--shadow-1`. Hover raises to `--shadow-2`, with no translate on reduced motion.

## Buttons

| Variant | Light background | Dark background |
|---|---|---|
| Primary | `--accent` bg, `--ink` text | same |
| Secondary | 1.5 px `--navy` border, navy text | 1.5 px `rgba(226,232,240,.5)` border, `--on-dark` text |
| Link CTA | `--accent-text`, underline on hover, trailing → | `--accent-on-dark` |

Sizes: default `min-height: 44px` (tap target), padding `.75rem 1.25rem`, 600 weight, 1rem. No uppercase. External-link CTAs append "↗" with `aria-label` text "(opens product site)" hidden visually.

## Forms

Label above the field (always visible, never placeholder-only). Inputs are 44 px tall with a 1 px `#94A3B8` border, which is ≥3:1 non-text contrast. Focus uses the focus ring. Errors show `#B91C1C` text below the field with `aria-describedby`, `aria-invalid="true"`, and an error summary at the top on submit. Required fields are marked with "(required)" text, not an asterisk alone.

## Iconography

One family: **24 px line icons, 1.75 stroke, round caps**, drawn as an inline SVG sprite (`/assets/img/icons.svg`, `<symbol>` + `<use>`). They are decorative by default (`aria-hidden="true"`). Emoji are not used as icons.

## Interactive states

| State | Treatment |
|---|---|
| Hover | Colour shift or shadow raise (150 ms) |
| Focus-visible | Focus ring, always visible, never removed |
| Active | 1 px downward nudge disabled under reduced motion |
| Current page | Nav link `aria-current="page"` with a 2 px accent underline |
| Disabled | 50% opacity, `cursor: not-allowed`, `aria-disabled` |

## Motion

Transitions only (150–200 ms, `ease-out`). No autoplay, parallax, pulsing or scroll-reveal hiding of content. `@media (prefers-reduced-motion: reduce)` removes transitions and smooth scrolling.

## Imagery

- No stock photography of models. The concept van render is used once, captioned "Concept livery. Mobile units are planned."
- Product visuals: neutral SVG line illustrations for eyewear styles, and abstract UI compositions (drawn with HTML and CSS) for SafetyOS and Mires cards. There are no fake screenshots with names or numbers.
- Brand marks: `logo-nav.png` wordmark (on `--ink` only) and a badge-derived favicon.
