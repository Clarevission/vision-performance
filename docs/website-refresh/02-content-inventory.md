# 02 — Content Inventory (pre-refresh)

Source: `public/index.html`, `public/app.js`, `public/sitemap.xml`, `public/robots.txt` @ `68762a2`.
Disposition codes: **K** keep · **K+** keep and improve · **Q** keep only if qualified · **R** rewrite · **X** remove.

## 1. Pages

| Page id | Proposed URL | Disposition |
|---|---|---|
| home | `/` | R |
| shop | — (301 → `/solutions/prescription-safety-eyewear`) | X |
| mobile | `/mobile-clinics` | R |
| industrial | `/solutions/occupational-vision`, `/solutions/prescription-safety-eyewear` | R (split) |
| book | — (301 → `/contact`) | X |
| about | `/about` | R |
| contact | `/contact` | K+ |
| learn | `/resources` (301 from `/learn`) | R |
| privacy | `/privacy` + `/terms` | K+ (split) |
| /portal | `/portal` (noindex) | K |
| /staff | `/staff` (noindex, X-Robots-Tag) | K |

## 2. Global chrome

| Element | Content | Disposition |
|---|---|---|
| Announcement bar | "New · Serving professionals across Canada — Free consultation for new corporate clients" | X → replaced by a factual SafetyOS announcement |
| Nav | Home · Shop▾ · Mobile Clinic · Industrial Programs · Learn · About · Contact + Client Portal, Book Exam, Cart | R → Solutions▾ · Technology▾ · Industries▾ · Mobile Clinics · About · Resources · Contact |
| Mobile drawer | 8 links + 5 collections + 2 CTAs, emoji icons | R |
| Sticky bottom bar | Logo, phone, "Book Exam", "Corporate Quote" | X |
| Chat widget | Canned bot, "Online" | X (C16) |
| Cart sidebar | Items, subtotal, "Request a quote" | X (with Shop) |
| Toast | Feedback for forms | K+ (becomes inline form status with `aria-live`) |
| Cookie notice | "Essential cookies only… Got it" | K+ (accurate wording; localStorage only) |
| Footer | Shop, Services, Learn (5 non-existent guides), Company (Careers → contact, Sustainability → about), Privacy, Terms, Accessibility → about, Sitemap → home | R |

## 3. Home sections

| # | Section | Disposition |
|---|---|---|
| 1 | Hero B2C "Precision Vision for Professionals" / B2B "Protect Your Workforce's Vision" | R |
| 2 | Metrics band (Vision Care · CSA Z94.3 · Mobile · 7 Industries) | X (C1, C13) |
| 3 | Path cards (Corporate / Individual) with pricing bullets | X (C6) |
| 4 | Services grid (6 cards) | R → 3 pillars + solutions |
| 5 | Mobile clinic feature + van image | R (status: planned; image captioned as concept livery) |
| 6 | Industries grid (7) | R → 11 industries, framed as "designed to serve" |
| 7 | Product preview tabs | X |
| 8 | ROI calculator | X (C6, C7) |
| 9 | Lens packages + add-ons | X (C6, C19) |
| 10 | Testimonials | X (C5) |
| 11 | Portal preview + mock data | X (C8–C10) |
| 12 | Approach / dual discipline + quote | K+ (moved to "Why VPI" and About) |
| 13 | Resources preview (3 non-existent guides) | R (honest status) |
| 14 | Sustainability band | X (C11) |
| 15 | Free trial + guarantee | X (C12) |
| 16 | SEO keyword band | X |

## 4. CTAs (distinct labels found)

Shop Eyewear · Book Eye Exam · Request Corporate Quote · Client Portal → · Request Mobile Clinic · Book Individual Exam · View All → · Get Your Custom Quote · Request a Quote (×3) · Access Client Portal · Request Program Demo · Our Full Story · Book an Exam · View All Resources → · Start Free Consultation · Speak to Our Team · Learn More → · Shop Now → · Explore → · Our Story → · Add to Cart · Bulk Pricing → · Schedule Mobile Clinic Visit · Send Message · Request Appointment · Watch Video → · Read Guide → · Read Article →

**27 distinct CTAs, and none of them reaches SafetyOS or Mires.**

## 5. Forms

| Form | Fields | Endpoint | Disposition |
|---|---|---|---|
| contactForm | name*, company, email*, subject(select), message* | `/api/contact` | K+ → name*, organisation, role, email*, phone (optional), enquiry category*, message*, honeypot |
| mobileForm | org*, contact*, email*, phone, employees, date, address*, notes | `/api/mobile` | X from UI (endpoint retained; category on contact form) |
| corporateForm | company*, contact*, email*, phone*, employees, date, location, notes | `/api/corporate` | X from UI (endpoint retained) |
| apptForm | name*, phone, email*, exam type*, date, time, notes ("vision history") | `/api/appointment` | X; endpoint returns 410 |
| chat input | free text | none | X |

## 6. Images

| Asset | Size | Use | Disposition |
|---|---|---|---|
| `images/logo-nav.png` | 320×215, 65 KB | Nav, footer, drawer | K (primary wordmark) |
| `images/logo-dark-alt.png` | 2528×1696, 3.8 MB | Portal, staff | K+ → resized derivative (<60 KB) |
| `images/logo-badge.png` | 2048², ~4.3 MB | 1 ref | K+ → favicon / apple-touch-icon / OG derivative |
| `images/logo-full.png`, `logo-light.png`, `logo-dark.png` | 3.8–4.5 MB | unreferenced | leave in repo (brand masters); not served in pages |
| `favicon.png` | 2048², 4.1 MB | unreferenced | replace with 32/180/512 px derivatives |
| `van.webp` | 960×584, 67 KB | Home mobile section | Q: caption "Concept livery. Mobile unit in planning." |
| Unsplash photos | ~35 URLs | Hero, founder, resources, learn, 21 products | X (stock-heavy, not VPI) |

## 7. Downloads

None exist. The previous site advertised guides and a video that do not exist.

## 8. Outbound links

`tel:+17808864397`, `mailto:info@visionperformanceinc.ca`, Google Fonts. **No links to SafetyOS, Mires, LinkedIn, or any other VPI property.**

## 9. Product links (new, required)

- https://safetyos.visionperformanceinc.ca/ (live)
- https://mires.visionperformanceinc.ca/ (live)
- https://app.visionperformanceinc.ca/ (internal; **not** linked publicly as a product. It may appear only as a staff sign-in link in the footer's utility row, if at all. Decision: not linked.)

## 10. Regulatory statements

CSA Z94.3 (C1), provincial College of Optometrists (C2), WCB (C14), PIPEDA (C8). See the Claims Register in `01-current-site-audit.md`.

## 11. Service claims

Mobile clinics, in-clinic exams, dry-eye diagnosis and treatment, compliance documentation, "full regulatory reporting", corporate programs, bulk pricing, lens recycling, carbon-neutral shipping, SSO, 30-day guarantee. See the Claims Register.

## 12. Metadata

| Item | Value | Disposition |
|---|---|---|
| `<title>` | "Vision Performance Inc. — Precision Vision for Professionals \| Canada" | R, per page |
| description | "Premium prescription safety eyewear… CSA Z94.3 compliant." | R, per page (no C1) |
| keywords | present | X |
| canonical / OG / Twitter | absent | New |
| favicon | inline base64 PNG | R → files |
| lang | `en` | → `en-CA` |

## 13. Structured data

None. New: `Organization` (sitewide), `WebSite`, `BreadcrumbList` (per page), `SoftwareApplication` summaries on the SafetyOS and Mires pages (no ratings or offers, to avoid fabricated data), and `FAQPage` only where visible FAQs exist.
