# 07: Information architecture

```
Home
├── Solutions ─┬─ Occupational Vision
│              ├─ Prescription Safety Eyewear ── Styles (picker)
│              ├─ Visual Ergonomics
│              └─ Workplace Eye Health
├── Technology ┬─ SafetyOS™  → safetyos.visionperformanceinc.ca (new tab)
│              ├─ Mires™     → mires.visionperformanceinc.ca (new tab)
│              └─ Technology at VPI (operations)
├── Industries ┬─ Energy · Construction · Manufacturing · Transportation · Office
├── Mobile Clinics (planned)
├── About
├── Resources
└── Contact ── Thank you
Legal: Privacy · Terms · Accessibility      Apps: /portal · /staff (noindex)
```

## Assessment

- **Depth:** every page is at most 3 clicks from home through the primary nav, and at most 2 through the footer, which links to all 24 indexable pages.
- **Labels:** the nav labels match the page H1s and breadcrumbs. `aria-current="page"` is set on the matching nav item.
- **Mobile Clinics** appears both in Solutions and as a top-level item. This is intentional (a planned flagship service), and the duplication is consistent.
- **Orphans:** none. The internal-link test confirms every internal link resolves to a real page, anchor or asset.
- **Retired IA** from the single-page site (`/shop`, `/book`, `/learn`, `/mobile`, `/industrial…`) is 301-mapped to its closest equivalent ([14](14-legacy-url-remediation.md)).

No IA changes were needed in this audit.
