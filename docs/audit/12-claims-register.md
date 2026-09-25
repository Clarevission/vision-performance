# 12: Claims register

Every factual or implied claim on the public site, with its evidence status. "Owner-stated" means the owner confirmed it during the redesign; VPI has not produced third-party evidence for it.

| # | Claim | Pages | Evidence | Status |
|---|---|---|---|---|
| C-01 | VPI is based in Edmonton, Alberta | Footer, About, Privacy, JSON-LD `PostalAddress` | Owner-stated | Keep |
| C-02 | VPI SafetyOS™ is available now | Technology, SafetyOS, Home | Product site live at safetyos.visionperformanceinc.ca | Keep |
| C-03 | VPI Mires™ is available now | Technology, Mires, Home | Product site live at mires.visionperformanceinc.ca | Keep |
| C-04 | Occupational vision, eyewear, ergonomics and eye-health programs are *in development* | Solutions pages | Owner-stated | Keep: labelled |
| C-05 | Mobile vision clinics are *planned* | Mobile Clinics, nav, Home | Owner decision | Keep: labelled "Planned" in the title, nav description and status |
| C-06 | Screening will be offered only once qualified personnel are in place | Workplace Eye Health | Reflects the "no clinicians yet" decision | Keep |
| C-07 | Referral "through VPI's planned clinical network" | Workplace Eye Health | Labelled *planned* | Keep |
| C-08 | Specific frames will be listed once supplier arrangements are in place | Styles | Replaces the unverified "supply partners" claim (F-04) | Changed |
| C-09 | CSA Z94.3 is referenced as a *standard to consider*, not as a certification | Eyewear, Resources | Guard test blocks "CSA Z94.3 certified/compliant" | Keep |
| C-10 | Contact email `info@visionperformanceinc.ca` | Footer, Contact, Legal | Domain mail in use | Keep |
| C-11 | Phone +1 (780) 886-4397 | Footer, Contact | Owner kept it, but it is **not confirmed as monitored** | REQUIRES OWNER INPUT (F-16) |
| C-12 | "We aim to reply by email within one business day" | Contact form success message | A service commitment, not evidence-based | REQUIRES OWNER INPUT: confirm the commitment or soften it to "as soon as we can" |
| C-13 | Handling in line with PIPA / PIPEDA | Privacy | Policy statement, not a certification. The guard blocks "PIPEDA-compliant" | Keep |
| C-14 | Service providers Render, Neon and Resend (US processing possible) | Privacy | Matches the architecture | Keep |
| C-15 | "Client sign-in" (implies existing portal clients) | Footer | Unverified | REQUIRES OWNER INPUT (F-19) |

## Blocked by test (must never appear)

The test suite fails the build if any of these appear:

- testimonials and "verified reviews"
- prices
- ROI calculators
- sustainability claims (carbon-neutral, recycling)
- clinician or clinic claims ("our optometrists", "our clinic")
- national-coverage claims ("across Canada", "nationwide")
- "trusted by"
- compliance badges ("PIPEDA-compliant")
- unimplemented features (SSO)
- free-trial or guarantee language
- links to the internal Command Centre
- **supplier-relationship claims** (added in this audit)

The patterns live in `FORBIDDEN` in `test/site.test.js`.
