# 03 — Information Architecture

## Owner decisions that shape the IA (2026-09-25)

| Topic | Decision |
|---|---|
| Mobile eye clinics | **Planned. Not operating.** |
| Licensed eye-care professionals | **Not yet.** Clinical services are planned |
| Shop | **Rebuild as a Safety Eyewear Style Picker.** Real style categories, no prices, no certification badges. Visitors shortlist styles into their program enquiry. A single data file lets real supplier frames replace the categories later |
| Testimonials | Remove and archive (see Appendix A) |
| Pricing and ROI calculator | Remove. "Pricing is scoped per program" |
| Sustainability claims | Remove for now |
| Phone +1 (780) 886-4397 | Keep as published; flagged in backlog for owner confirmation |

## Status model (used on every page)

| Status | Meaning | Applies to |
|---|---|---|
| **Available now** | Live and can be engaged today | VPI SafetyOS™, VPI Mires™ (live product sites with demo requests) |
| **In development** | Program design under way; VPI welcomes early employer conversations | Occupational vision programs, prescription safety eyewear programs, visual ergonomics, workplace eye health |
| **Planned** | Future service delivery model | Mobile vision clinics, clinical and optical care network (incl. Lunettes Emporium) |
| **Internal** | Proprietary, not offered for sale | VPI Command Centre |

## Sitemap

```
/                                              Home
├── /solutions                                 Solutions overview
│   ├── /solutions/occupational-vision         Occupational Vision Programs
│   ├── /mobile-clinics  (canonical; also listed under Solutions)
│   ├── /solutions/prescription-safety-eyewear Prescription Safety Eyewear Programs
│   │   └── /solutions/prescription-safety-eyewear/styles   Safety Eyewear Style Picker (successor to /shop)
│   ├── /solutions/visual-ergonomics           Visual Ergonomics & Digital Eye Strain
│   └── /solutions/workplace-eye-health        Workplace Eye Health
├── /technology                                VPI Technology overview
│   ├── /technology/safetyos                   VPI SafetyOS™ (summary → safetyos.visionperformanceinc.ca)
│   ├── /technology/mires                      VPI Mires™ (summary → mires.visionperformanceinc.ca)
│   └── /technology/operations                 Technology at VPI (Command Centre, internal)
├── /industries                                Industries overview (11 sectors)
│   ├── /industries/energy                     Energy, Oil & Gas, Utilities
│   ├── /industries/construction               Construction
│   ├── /industries/manufacturing              Manufacturing & Warehousing
│   ├── /industries/transportation             Transportation & Logistics
│   └── /industries/office                     Office & Knowledge Work
├── /mobile-clinics                            Mobile Vision Clinics (planned)
├── /about                                     About VPI
├── /resources                                 Resources & Insights (architecture; topics in preparation)
├── /contact                                   Contact / Talk to VPI
├── /privacy   /terms   /accessibility         Legal & policy
└── 404                                        Real 404 (status 404)

Not in sitemap, noindex: /portal (client sign-in), /staff (internal), /contact/thank-you
```

## Primary navigation (desktop)

`[VPI wordmark → /]`  **Solutions ▾ · Technology ▾ · Industries ▾ · Mobile Clinics · About · Resources**  `[Talk to VPI]` (Contact)

- "Home" is the wordmark: the conventional pattern, and it saves a slot. The mobile menu lists "Home" explicitly.
- Dropdowns are **disclosure buttons** (`aria-expanded`), not ARIA `menu`s. They open on click, Enter or Space, and on hover for fine pointers. Esc closes and returns focus. Each panel ends with an "All …" overview link.

| Solutions ▾ | Technology ▾ | Industries ▾ |
|---|---|---|
| Occupational Vision | VPI SafetyOS™ (Available) | Energy, Oil & Gas |
| Mobile Vision Clinics (Planned) | VPI Mires™ (Available) | Construction |
| Prescription Safety Eyewear | Technology at VPI | Manufacturing |
| Safety Eyewear Styles | Technology overview → | Transportation |
| Visual Ergonomics | | Office & Corporate |
| Workplace Eye Health | | All industries → |
| All solutions → | | |

## Mobile navigation

A single "Menu" button opens a full-height panel with a focus trap. Esc closes it.
Top-level links, plus three `<details>` groups (Solutions, Technology, Industries) one level deep. There is no nesting beyond that. "Talk to VPI" is pinned at the bottom of the panel.

## Secondary navigation

- **Breadcrumbs** on every page except Home (visible, plus `BreadcrumbList` JSON-LD).
- **Section sub-nav** ("In this section") at the foot of the Solutions, Technology and Industries child pages, linking sibling pages.
- **Announcement banner** (dismissible): "New: VPI SafetyOS™, health & safety management for Alberta contractors. Explore SafetyOS ↗"

## Footer navigation

| Solutions | Technology | Industries | Company |
|---|---|---|---|
| Occupational Vision | VPI SafetyOS™ ↗ summary | Energy, Oil & Gas | About |
| Mobile Vision Clinics | VPI Mires™ ↗ summary | Construction | Resources |
| Prescription Safety Eyewear | Technology at VPI | Manufacturing | Contact |
| Safety Eyewear Styles | | Transportation | Accessibility |
| Visual Ergonomics | | Office & Corporate | |
| Workplace Eye Health | | | |

Utility row: © year Vision Performance Inc. · Edmonton, Alberta, Canada · Privacy · Terms · Client sign-in (`/portal`)
Product-site row: `safetyos.visionperformanceinc.ca ↗` · `mires.visionperformanceinc.ca ↗`

`app.visionperformanceinc.ca` (Command Centre) is **not linked** anywhere public.

## Product relationships (endorsed-brand architecture)

```
Vision Performance Inc.  (corporate umbrella: visionperformanceinc.ca)
├── Occupational Vision & Workplace Eye Health      [In development / Planned]
│     programs · mobile clinics · safety eyewear · visual ergonomics · eye-health education
├── Clinical & Optical Care network                  [Planned]
│     referral pathways · comprehensive care · dispensing · Lunettes Emporium (future brand)
└── VPI Technology
      ├── VPI SafetyOS™     [Available]  safetyos.visionperformanceinc.ca
      ├── VPI Mires™        [Available]  mires.visionperformanceinc.ca
      └── VPI Command Centre [Internal]  (not linked)
```

## Cross-linking rules

1. Every solution page links to at least one relevant industry page and one technology page. Occupational vision links to SafetyOS (HSE context), and Mires links to the clinical network.
2. Every industry page links to 2–4 solutions (different per industry) and to SafetyOS where HSE operations matter.
3. Technology summary pages link **out** to the product site with a primary CTA (opens in the same tab: it is a VPI property, and "↗" plus the visible domain signal the move). A secondary CTA stays on the corporate site.
4. Every page ends with a contextual CTA pre-selecting the enquiry category (`/contact?topic=…`).
5. There is no link to `/staff` or `app.visionperformanceinc.ca`.

## Redirects (301)

| From | To |
|---|---|
| `/shop` | `/solutions/prescription-safety-eyewear/styles` |
| `/book` | `/contact` |
| `/learn` | `/resources` |
| `/mobile`, `/mobile-clinic` | `/mobile-clinics` |
| `/industrial`, `/industrial-programs` | `/solutions/occupational-vision` |
| `/index.html`, `/home` | `/` |
| trailing slash (`/about/`) | no trailing slash |
| Legacy fragments `/#shop`, `/#mobile`, `/#industrial`, `/#book`, `/#learn`, `/#about`, `/#contact`, `/#privacy` | Client-side `location.replace` on the homepage (fragments never reach the server) |

## Appendix A — Archived testimonials (not published; unverified)

Kept only so real, consented client stories can replace them later. **Do not republish these.**

1. "The mobile clinic visit was seamless…" (attributed to "D.W., EHS Manager · Energy Sector, Alberta")
2. "I've worn prescription glasses my whole career…" (attributed to "M.B., Senior Engineer · Construction Sector, Alberta")
3. "Our IT team was struggling with digital eye strain…" (attributed to "P.K., IT Director · Healthcare Sector, Alberta")

Full text is in git history: `public/index.html` @ `68762a2`, lines 1471–1485.
