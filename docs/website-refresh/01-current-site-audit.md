# 01 — Current Site Audit

Audited version: `main` @ `68762a2`, the same content served live at https://visionperformanceinc.ca on 2026-09-25.
Categories: **KEEP · KEEP + IMPROVE · MERGE · REWRITE · REMOVE · NEW PAGE REQUIRED**

## Executive finding

The current site presents VPI as an **eyewear retailer and optometry clinic** ("Shop Eyewear", "Book Eye Exam", cart, 21 priced frames). It does not present the company as the **umbrella for an occupational-vision business plus two live software products**. Neither SafetyOS nor Mires is mentioned anywhere.

It also makes many **operational claims that cannot be verified from the codebase or public record**, and several read as fabricated: testimonials, "licensed optometrists", "our Edmonton clinic", "CSA Z94.3 Certified", "carbon-neutral shipping", "SSO available", and "30-day guarantee". Under this brief those must be removed or qualified rather than restyled.

There are no real URLs. Every page lives in one document, so no page after the homepage can rank, be shared, or be measured.

---

## Cross-cutting issues (all pages)

| Area | Finding | Severity |
|---|---|---|
| Routing / SEO | No URLs per page; soft-404 catch-all; one title/description for all content; 2×`<h1>` on home, none elsewhere | **High** |
| Truthfulness | See the **Claims Register** below | **High** |
| Positioning | Retail-first (B2C default hero, "Shop", cart) contradicts the employer and technology strategy | **High** |
| Brand | Two token systems; orange glow and gradients; 49 emoji as icons; stock photography for the hero and every product | Medium |
| Accessibility | 401 `onclick` handlers on non-semantic `<a>`/`<div>` elements, patched with JS-added `tabindex`/`role`. Footer injected by JS. Dropdown is hover-only. Several low-contrast texts (e.g. `rgba(255,255,255,.35)` at 11 px). Animations ignore `prefers-reduced-motion` | **High** |
| Performance | 191 KB HTML parsed on every visit. The portal loads a 3.8 MB logo. Three font families, 21 weights | Medium |
| Conversion | 12+ competing CTAs (Shop, Book, Quote, Portal, Chat, Cart, Trial…). A fake chat promises replies | Medium |
| Privacy | Appointment form invites "vision history" (health information) on a marketing site. The privacy page cites PIPEDA only; Alberta PIPA is not addressed | Medium |
| Governance | `TODO: replace with real business phone number before launch` sits beside the published phone number | Medium, owner to confirm |

---

## Page-by-page

### Home (`page-home`): **REWRITE**
| Aspect | Assessment |
|---|---|
| Purpose | Unclear. It switches between "Individual" (retail) and "Corporate" heroes |
| Content | 17 sections: hero, metrics band, path cards, services, mobile clinic, industries, products, ROI calculator, lens packages, testimonials, portal preview, approach, resources, sustainability, "free trial", SEO keyword band, footer |
| UX / hierarchy | Too long; no narrative. A visitor cannot tell in seconds what VPI is, and the technology is invisible |
| Branding | Dark glass UI plus orange glow. Stock images. The mock portal carries fabricated employee names and stats |
| Mobile | Works, but very long |
| Accessibility | 2×h1; emoji icons; click-only cards |
| SEO | Keyword band; fragment URLs |
| Conversion | Diluted across 10+ CTAs |
| **Keep** | The dual-discipline idea ("clinical vision care × occupational health and safety"): it is genuine differentiation. The mobile-access problem statement. The industry list |
| **Remove** | ROI calculator (invented pricing), lens price cards, testimonials, portal mockup data, sustainability claims, "Free Trial / 30-Day Guarantee", SEO keyword band, B2C/B2B toggle, fake chat, sticky booking bar |

### Shop (`page-shop`): **REMOVE (301 → /solutions/prescription-safety-eyewear)**
21 products with invented names ("Performance Frame Alpha"), Unsplash stock photos, fixed prices, "CSA Compliant" badges, and a cart that ends in an email quote request. There is no e-commerce backend and no inventory. The products and prices cannot be verified, and the CSA badges are a regulatory claim. This contradicts the employer-program positioning and the brief's "do not fabricate pricing" rule. The working quote-request path is preserved through the contact form's "Prescription safety eyewear program" category.

### Mobile Clinic (`page-mobile`): **REWRITE → `/mobile-clinics`**
It presents a deployed unit ("Our mobile unit is fully equipped with diagnostic instruments…"), "Dry eye screening … diagnosis & treatment", and a booking form requiring a site address. **None of this is verifiable. The brief states mobile units must be described as planned unless verified.** Keep the access-barrier rationale and the employer benefits. Rebuild as a program-model page with a status label and a "register interest / plan a pilot" CTA.

### Industrial Programs (`page-industrial`): **REWRITE → split into `/solutions/occupational-vision` + `/solutions/prescription-safety-eyewear`**
Keep the program concept (eligibility, authorisation, dispensing, documentation). Remove the volume price table ($220/$190/$165), "Save 31% vs retail", "CSA Z94.3 certified frames", "Licensed optometrists", "maintain WCB compliance", and the unsourced statistic "Vision-related incidents account for a significant proportion of workplace injuries".

### Book (`page-book`): **REMOVE (301 → /contact)**
It books "In-Clinic Eye Exams at our Edmonton clinic" with "licensed optometrists registered with their provincial College". No clinic address is published and no clinician is named. Lunettes Emporium is not open. This is a clinical intake on a corporate site, so it is removed. `/api/appointment` is retired with HTTP 410.

### About (`page-about`): **REWRITE**
Keep the founding narrative (strong and specific) and the values. Remove "Today … serves industrial companies, engineering firms, technology organizations and healthcare professionals across Canada", "CSA Z94.3 Certified", "WCB Compliant" and "7 Industries Served" (unverified). Add the ecosystem, the technology, the current-versus-planned table and a leadership placeholder (no invented people).

### Contact (`page-contact`): **KEEP + IMPROVE**
Keep the phone, email, location and form. Add organisation, role, optional phone and an enquiry category, and remove "On-site across Canada" (unverified). Prefill the category from the CTA (`?topic=`).

### Learn (`page-learn`): **REWRITE → `/resources` (301 from /learn)**
Four cards promise a "3 min watch" video, an "8 min read" guide and so on, but **none of these resources exist** (cards link to Contact). The "2025 Guide" is stale. Rebuild as honest resource architecture: topics marked "In preparation" with a request-a-copy CTA.

### Privacy & Terms (`page-privacy`): **KEEP + IMPROVE → `/privacy`, `/terms`**
Split into two pages. Reference both PIPEDA and Alberta PIPA without asserting compliance determinations. Describe the actual processors (Render hosting, Neon database, Resend email). Describe cookies accurately: one functional auth cookie for portal sign-in, and localStorage for the notice dismissal only. A named privacy officer is flagged for the owner; none is invented.

### Client Portal (`/portal`): **KEEP (not redesigned)**
Working authenticated functionality. Moves from the primary nav to the footer ("Client sign-in"). Gets `noindex`, and its 3.8 MB logo is optimised.

### Staff dashboard (`/staff`): **KEEP (hidden)**
Internal. Add `noindex` and an `X-Robots-Tag` header. Never link it publicly. It is titled "VPI Command Centre", which could be confused with `app.visionperformanceinc.ca`, so it is noted in the backlog.

### New pages required
`/solutions` · `/solutions/occupational-vision` · `/solutions/prescription-safety-eyewear` · `/solutions/visual-ergonomics` · `/solutions/workplace-eye-health` · `/mobile-clinics` · `/technology` · `/technology/safetyos` · `/technology/mires` · `/technology/operations` · `/industries` + 5 industry pages · `/resources` · `/accessibility` · `/terms` · real 404.

---

## Claims Register (flagged before change)

Every item below is **removed or qualified** in the refresh. It can be restored once the owner provides evidence.

| # | Claim (verbatim or close) | Location | Problem | Action |
|---|---|---|---|---|
| C1 | "CSA Z94.3 Compliant / Certified / Safety Compliant" (badges, metrics, About stats) | Home, Shop, Industrial, About, meta description | Certification applies to specific products from specific manufacturers. VPI is not the certifying party, and no product evidence is published | Replace with "CSA Z94.3-rated eyewear where the hazard assessment requires it". No VPI certification claim |
| C2 | "Licensed optometrists", "registered with their provincial College of Optometrists" | Industrial, Book, Services | No named clinician; regulated-profession claim | Remove; describe the planned clinical model as delivered "by licensed eye-care professionals" in future-tense language |
| C3 | "Comprehensive eye exam at our Edmonton clinic" | Book | No clinic address; Lunettes Emporium is not open | Remove |
| C4 | Mobile unit "fully equipped with diagnostic instruments"; "Dry Eye Screening: Diagnosis & treatment" | Mobile | Deployment and clinical scope unverified | Remove; mobile clinics marked **Planned** |
| C5 | Three 5-star testimonials (D.W., M.B., P.K.) labelled "Verified client reviews" | Home | Unverifiable; they name fictional products ("ScreenGuard Series") | Remove |
| C6 | Volume pricing $220/$190/$165; "Save 31% vs retail"; lens +$120/$220/$320; add-on prices; "Bulk pricing from $165/unit"; "Starting from $185" | Home, Industrial, Shop | Unverified pricing; the ROI calculator derives "savings" from it | Remove; "pricing is scoped per program" |
| C7 | ROI calculator "Annual Savings … vs ad-hoc purchasing" | Home | Outputs are generated from C6 | Remove |
| C8 | "PIPEDA-Compliant", "Secure, PIPEDA-compliant data storage" | Home hero, Portal section | A compliance determination is not a marketing badge | Remove; the privacy page describes practices |
| C9 | "Single Sign-On (SSO) integration available" | Portal section | Not implemented in `routes/portal.js` | Remove |
| C10 | "Real-time order tracking… compliance documentation download… program metrics" plus a mock dashboard with employee names and "94% compliance" | Home | Portal exists but real usage is unknown; mock data looks real | Remove the marketing section; the portal stays reachable |
| C11 | "Lens Recycling Program… certified optical recyclers", "Bio-acetate", "Carbon-neutral shipping… verified Canadian forestry programs", "Local supply chain" | Home | Specific environmental claims (Competition Act greenwashing exposure) | Remove |
| C12 | "Test Drive Our Corporate Program — Free"; "30-Day Satisfaction Guarantee… No questions asked" | Home | Commercial offer/guarantee not verifiable | Remove |
| C13 | "Serving professionals across Canada", "Mobile services across Canada", "On-site across Canada", "7 Industries Served Across Canada" | Ann bar, Home, Contact, About | Nationwide coverage unverified | "Based in Edmonton, Alberta. Programs designed to scale across Canada." |
| C14 | "Maintain WCB compliance", "Meet WCB and OH&S on-site" | Industrial, Mobile | Implies VPI confers compliance | "Support your OH&S program and documentation" |
| C15 | "Vision-related incidents account for a significant proportion of workplace injuries" | Industrial | Unsourced statistic | Remove |
| C16 | Chat: "Online · Typically replies in minutes" | Global | Messages are not transmitted anywhere | Remove the widget |
| C17 | "Trusted by Professionals" | Home | Social-proof claim without evidence | Remove |
| C18 | Phone `+1 (780) 886-4397` sits under `TODO: replace with real business phone number` | Sticky bar comment | May be a placeholder | **Owner to confirm.** Retained because it is live today |
| C19 | Blue-light filtering presented as the primary digital-strain solution | Home, Shop, Lens cards | Evidence for blue-light filters in reducing eye strain is weak | Visual ergonomics leads with correct prescription, breaks, lighting and glare, and workstation setup |
