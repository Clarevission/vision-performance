# 06: UX audit (personas)

Each persona's path was run in a real browser against the audit branch, and the key paths are now automated in `test/e2e/journeys.e2e.js`.

| Persona | Goal | Path | Result |
|---|---|---|---|
| A: HSE manager at an Alberta energy firm | Understand VPI's employer vision program and start a conversation | Home → Solutions menu → Occupational Vision → "Discuss a workplace vision program" → contact (topic preselected) | ✅ 3 clicks. E2E `employer:` |
| B: Procurement lead comparing safety-eyewear options | See styles and send a shortlist | Styles → shortlist 2 → "Add shortlist to an enquiry" → message pre-filled with the chosen styles | ✅ E2E `safety eyewear:` |
| C: Site supervisor on a phone at a remote site | Find out whether mobile clinics exist | Mobile menu → Mobile Clinics → status "Planned" + register interest | ✅ The status is clear, so there is no false promise. E2E `mobile navigation`, `mobile clinics` |
| D: Clinic owner (optometrist) | Evaluate Mires | Technology → Mires → product site in a new tab | ✅ The new tab keeps the corporate site open. E2E `SafetyOS and Mires` |
| E: Safety software buyer | Evaluate SafetyOS | Technology → SafetyOS → product site | ✅ Same as D |
| F: Investor / partner | Understand the company and ecosystem | Home → About → "Partnership or investment" (contact topic `partnership`) | ✅ |
| G: Job seeker | Careers | Footer → Careers, or About → "Introduce yourself" → contact topic `careers` | ⚠️ Works, but there is no careers page. Acceptable at the current company size ([20](20-future-proofing.md)) |
| H: Keyboard / screen-reader user | Navigate and submit a form | Skip link → main; error summary receives focus; field errors announced via `aria-describedby` | ✅ E2E `keyboard:`, `contact form:` |

## Friction found and fixed

- **Resources (F-21).** Guides were listed with only a generic "Request a guide" button, so users had to type which guide they meant. Each card now links to the contact form with the guide pre-filled.

## Friction noted, not changed

- **"Client sign-in" in the footer (F-19).** The link suggests existing clients. It is left in place pending an owner decision.
- **Placeholder-only guides.** Resources contains only guides "in preparation". This is honest, but thin. Publishing the first guide is the highest-value content action ([FUTURE-ROADMAP](FUTURE-ROADMAP.md)).
