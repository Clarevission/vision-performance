# 09: Form audit (contact form, `views/partials/contact-form.html`)

| Aspect | Finding |
|---|---|
| Fields | Name*, Email*, Organization, Role, Phone, Topic*, Message*. Every field has a visible `<label>`; required fields are marked in text, not by colour alone |
| Autocomplete | `name`, `email`, `organization`, `organization-title`, `tel` |
| Client validation | `novalidate` + custom checks on submit. The error summary (a `tabindex="-1"` container) receives focus and lists each problem; each field gets `aria-invalid` and `aria-describedby` → its error text |
| Server validation | Required fields, `validator.isEmail`, allow-listed topic, length limits, 10 KB body limit |
| Spam | Hidden honeypot (`website`) returns a fake success; 8 submissions per 15 min per IP; exact-origin check (fixed, F-03) |
| Feedback | `role="status"` + `aria-live="polite"` for success and failure; the network-failure message offers the email address |
| No-JS | Posts form-encoded; 303 → thank-you page |
| Privacy | A note under the submit button ("We use these details only to reply to you", with a link to the privacy policy); the privacy policy says not to send health information |
| Pre-fill | Topic from `?topic=` (allow-listed); message from the eyewear shortlist or `?guide=` (allow-listed). Arbitrary URL text is never written into the form |

## Tests

- `npm test`: API validation, JSON and no-JS acceptance, honeypot, 400 on malformed JSON, 403 on a foreign origin.
- `npm run test:e2e`: empty submit → summary focused, `aria-invalid` set → valid submit → "Thank you". This runs locally only and never against production.

No form was submitted to production during this audit.
