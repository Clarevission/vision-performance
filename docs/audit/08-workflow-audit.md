# 08: Workflow audit

| Workflow | Steps | Verified by |
|---|---|---|
| Enquiry: JavaScript path | Validate on the client → `fetch` JSON → 200 → inline "Thank you…" status | E2E `contact form:`; `npm test` `contact API accepts…` |
| Enquiry: no-JS path | Form post → server validation → 303 → `/contact/thank-you`. Errors show an HTML error page with a way back | `npm test` (form-encoded post) |
| Enquiry: storage + notification | Insert into `enquiries` (errors logged, never shown to the user) → Resend notification (console fallback) | Code review of `routes/contact.js`; DB and email not exercised in production (no destructive testing) |
| Topic deep links | `?topic=` preselects the topic (allow-listed values only) | E2E `employer:` |
| Guide request | `?topic=resources&guide=<id>` pre-fills the message from an allow-listed title | E2E `resources:`; `npm test` guide-id test |
| Eyewear shortlist | Toggle styles (`aria-pressed`) → the list persists in `localStorage` → the bar shows count and items → the enquiry is pre-filled | E2E `safety eyewear:` |
| Staff triage | `/staff` login → list and filter enquiries → set status | Code review. Not exercised: needs staff credentials, and production data must not be touched |
| Portal | `/portal` login, password reset | Code review. Not exercised, for the same reason |
| Retired flows | Appointment booking, mobile-clinic booking and the corporate form now return 410. Nothing on the site posts to them | `npm test` `retired endpoints return 410` |

Staff triage and portal are marked REQUIRES EXTERNAL CREDENTIAL for a live test. Code review found parameterized SQL, allow-listed filters and signed cookies ([19](19-security-audit.md)).
