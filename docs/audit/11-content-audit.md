# 11: Content audit

## Scope

The audit covered all 25 public pages, the 404 and 500 pages, and the staff and portal page chrome. The content model uses four status labels, rendered by the `status` partial:

| Status | Meaning | Where it appears |
|---|---|---|
| Available now | Live product | SafetyOS™, Mires™ (their product sites are live) |
| In development | Being built | Occupational vision programs, prescription safety eyewear, visual ergonomics, workplace eye health, the resources guides, and some industry offers |
| Planned | Not started | Mobile vision clinics, and planned elements on the industry pages |
| Internal | VPI's own operations | Technology at VPI (operations platform) |

Every solution, industry and product page carries at least one label (enforced by the test `planned and in-development services carry status labels`).

## Changes in this audit

| Page | Before | After | Why |
|---|---|---|---|
| `/solutions/prescription-safety-eyewear/styles` | "Frames from our supply partners will be listed under each style as programs launch." | "Specific frames will be listed under each style once supplier arrangements are in place." | F-04: there are no confirmed supply partners |
| `/privacy` | Named the Google Fonts connection | "The site loads photographs from a third-party image service… Fonts are hosted on our own servers." | Fonts are now self-hosted (F-05). The image-library name stays out, per the owner's instruction |
| `/solutions/workplace-eye-health` | Referral pathways card (1 sentence) | Adds: "Pathways are designed so the worker, not the employer, holds their own health information." | F-22 layout balance. The sentence restates the page's existing promise ("without the employer handling personal health information"), so it adds no new claim |
| `/resources`, `/` | Guides without an action | "Request this guide" on each card | F-21 |
| `/404` | Short message | Six recovery links: Home, Solutions, Technology, SafetyOS, Mires, Contact | F-10 |
| `/500` (new) | Did not exist | "Something went wrong on our side" + Home / Contact | F-11 |
| `/staff` | "Command Centre" | "Staff Enquiries" / "VPI Enquiries" | F-12 |

## Tone and consistency

- **Voice:** plain, second-person and employer-focused, in Canadian English (`en-CA`: "colour", "organization"). It is consistent across pages.
- **Trademarks:** SafetyOS™ and Mires™ carry ™ in headings, navigation and the footer.
- **Contact details:** `info@visionperformanceinc.ca` and the phone number appear only in the footer and on the contact page. The phone number is unconfirmed (F-16).
- **Placeholder content:** none. No "lorem", "TBD" or "coming soon" without a status label. The test for unresolved `{{ }}` tokens passes on every page.
