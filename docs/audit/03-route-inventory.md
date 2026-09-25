# 03: Route inventory

## Public pages (25). All in `sitemap.xml` except the thank-you page

| Path | Robots | JSON-LD | Title |
|---|---|---|---|
| `/` | index | Organization, WebSite | Vision Performance Inc. \| Workplace Vision, Safety & Technology |
| `/about` | index | Breadcrumb | About VPI: Our Story, Mission & Ecosystem |
| `/solutions` | index | Breadcrumb | Solutions: Occupational Vision & Workplace Eye Health |
| `/solutions/occupational-vision` | index | Breadcrumb | Occupational Vision Programs for Employers |
| `/solutions/prescription-safety-eyewear` | index | Breadcrumb, FAQPage | Prescription Safety Eyewear Programs for Employers |
| `/solutions/prescription-safety-eyewear/styles` | index | Breadcrumb | Safety Eyewear Styles: Browse & Shortlist |
| `/solutions/visual-ergonomics` | index | Breadcrumb | Visual Ergonomics & Digital Eye Strain at Work |
| `/solutions/workplace-eye-health` | index | Breadcrumb | Workplace Eye Health: Education, Screening & Referral |
| `/mobile-clinics` | index | Breadcrumb, FAQPage | Mobile Vision Clinics for Employers (Planned) |
| `/technology` | index | Breadcrumb | VPI Technology: SafetyOS™ & Mires™ |
| `/technology/safetyos` | index | Breadcrumb, SoftwareApplication | VPI SafetyOS™: Health & Safety Management Software |
| `/technology/mires` | index | Breadcrumb, SoftwareApplication | VPI Mires™: Optometry Practice Management Software |
| `/technology/operations` | index | Breadcrumb | Technology at VPI: Our Operating Platform |
| `/industries` | index | Breadcrumb | Industries: Workplace Vision Across Sectors |
| `/industries/energy` | index | Breadcrumb | Workplace Vision for Energy, Oil & Gas and Utilities |
| `/industries/construction` | index | Breadcrumb | Workplace Vision for Construction |
| `/industries/manufacturing` | index | Breadcrumb | Workplace Vision for Manufacturing & Warehousing |
| `/industries/transportation` | index | Breadcrumb | Workplace Vision for Transportation & Logistics |
| `/industries/office` | index | Breadcrumb | Workplace Vision for Offices & Knowledge Work |
| `/resources` | index | Breadcrumb | Resources & Insights on Workplace Vision |
| `/contact` | index | Breadcrumb | Contact VPI |
| `/contact/thank-you` | **noindex** | Breadcrumb | Message sent |
| `/privacy`, `/terms`, `/accessibility` | index | Breadcrumb | Legal pages |

Error pages `/404` and `/500` are not routable. They are rendered by the 404 and error handlers, carry `noindex`, and have no canonical tag.

## Applications (noindex, not linked from the main nav)

| Path | Purpose | Protection |
|---|---|---|
| `/portal` | Client portal (legacy UI) | Session cookie; `legacyCsp` (allows inline styles) |
| `/staff` | Staff enquiry dashboard | Session cookie (staff) |
| `/portal.html`, `/staff.html` | 301 to the clean path | n/a |

## API

| Method + path | Purpose | Limits / auth |
|---|---|---|
| `POST /api/contact` | Enquiry (JSON or form post) | 8 per 15 min per IP; exact origin check; 10 KB body; honeypot |
| `POST /api/portal/login`, `…/logout`, `forgot-password`, `reset-password`; `GET me, dashboard, employees, orders, compliance` | Portal | 10 logins per 15 min; signed cookie |
| `POST /api/staff/login`, `…/logout`; `GET me, enquiries, stats`; `PATCH enquiries/:id` | Staff dashboard | 10 logins per 15 min; staff cookie |
| `/api/admin/*` (setup, companies, users, employees, orders, compliance-docs) | Admin | `x-admin-key` (constant-time) |
| `ANY /api/appointment`, `/api/mobile`, `/api/corporate` | Retired | **410** JSON |
| Any other `/api/*` | n/a | 404 JSON |
| `GET /health` | Health check | Exempt from the host redirect |

## Redirects and gone

| From | To | Code |
|---|---|---|
| any host other than `visionperformanceinc.ca` (or localhost) | `https://visionperformanceinc.ca` + same path | 301 |
| any path containing uppercase | lowercase path, same query | 301 |
| trailing slash (except `/`) | path without slash | 301 |
| `/shop` | `/solutions/prescription-safety-eyewear/styles` | 301 |
| `/book` | `/contact` | 301 |
| `/learn` | `/resources` | 301 |
| `/mobile`, `/mobile-clinic` | `/mobile-clinics` | 301 |
| `/industrial`, `/industrial-programs` | `/solutions/occupational-vision` | 301 |
| `/index.html`, `/home` | `/` | 301 |
| `/favicon.png` | `/assets/img/vpi-favicon-32.png` | 301 |
| `/favicon.ico` | favicon PNG | served |
| `/app.js`, `/van.png`, `/van.webp` | n/a | **410** |
| `/sitemap.xml`, `/robots.txt` | generated / static | 200 |

The exact redirect targets for `/shop` and the other legacy paths are defined in the `REDIRECTS` map in `server.js`, and the table above mirrors it. The test `legacy URLs redirect permanently` asserts every entry.
