# Future roadmap

## Now: owner actions, no code

1. Approve the merge and deploy of `audit/vpi-corporate-post-launch`.
2. Set `SESSION_SECRET` in Render (F-15).
3. Make the GitHub repo private (F-07).
4. Search Console and Bing: sitemap, re-index, change of address (F-08, [16](16-search-index-cleanup.md)).
5. Cloudflare single-hop `.com` → `.ca` rule (F-18).
6. Confirm or remove:
   - the phone number (F-16)
   - the "one business day" reply promise (C-12)
   - the "Client sign-in" link (F-19)
7. Name a privacy officer (F-17).

## Next 1–3 months: engineering

| Item | Why | Size |
|---|---|---|
| CI on pull requests (`npm test` + E2E) and branch protection | Stops regressions reaching production, since `main` auto-deploys | S |
| Uptime monitor on `/health` + deploy notifications (F-28) | Know about outages before customers do | S |
| Privacy-friendly analytics wired to `vpiTrack` (F-27) | Measure enquiries by topic, product clicks and guide requests | S–M |
| Self-host photographs (F-29) | Performance, privacy, resilience | M |
| Dependency majors one by one (F-25) | Security support windows | M |
| Firefox + WebKit in E2E (F-26) | Safari is the main iPhone browser | S |
| `.gitattributes` for line endings | Clean diffs | XS |

## Later: content and product

| Item | Trigger |
|---|---|
| Publish the first resource guide (safety eyewear programs is the most-linked topic) | Guide requests start arriving |
| Careers page | First open role |
| Frame listings per style | Supplier arrangements in place (C-08) |
| Mobile clinic scheduling | Service moves from *planned* to *in development* |
| Named clinicians and credentials | Licensed staff engaged (check the claims guard first) |
| Case studies or testimonials | Real, consented client evidence. Remove the guard pattern deliberately at that point |
| Move `/portal` and `/staff` onto the strict CSP | Next time either app is touched |
