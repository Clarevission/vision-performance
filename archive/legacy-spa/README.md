# Legacy single-page site (archived 2026-09-25)

`index.html` and `app.js` are the pre-refresh visionperformanceinc.ca, which was a single HTML document with client-side page switching. They are kept here so the previous site can be restored or referenced. They are **not served**: Express only serves `public/` and the pages composed from `views/`.

To restore the old site temporarily, move both files back into `public/` and remove the page routes in `server.js`, or check out commit `68762a2`.

These files contain content that must **not** be republished without evidence: unverified testimonials, pricing, CSA claims and sustainability claims. See `docs/website-refresh/01-current-site-audit.md` (Claims Register).
