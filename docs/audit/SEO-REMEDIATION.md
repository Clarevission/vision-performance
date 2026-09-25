# SEO remediation summary

## Fixed in code (effective on deploy)

| Issue | Fix |
|---|---|
| `visionperformanceinc.com` and `vision-performance.onrender.com` served full duplicates (F-01) | 301 to the same path on `https://visionperformanceinc.ca` |
| Mixed-case duplicates such as `/About` (F-02) | 301 to lowercase |
| 404 page had a canonical and `og:url` (F-10) | Removed from error pages; 404 and 500 are `noindex` |
| Old SPA assets (`/app.js`, `/van.*`) lingering | 410 Gone |
| Duplicate titles or descriptions could slip in | Uniqueness test added |
| Render-blocking fonts hurt mobile CWV (F-05) | Self-hosted; mobile FCP about 2.9 s → 1.1 s (local measurement) |

Unchanged and already correct:

- legacy 301 map ([14](14-legacy-url-remediation.md))
- sitemap (24 URLs), robots
- canonicals on content pages
- structured data ([17](17-structured-data.md))
- one H1 per page and heading order
- Open Graph and Twitter cards

## Needs credentials (not done)

These steps have **not** been done. The full list is in [16](16-search-index-cleanup.md).

- Verify `.ca` and `.com` in Google Search Console.
- Submit the sitemap.
- Request re-indexing of the homepage and key pages.
- File a change of address from `.com` to `.ca`.
- Do the same in Bing Webmaster Tools.
- Make the GitHub repo private, or clean it up (F-07).
- Add a single-hop Cloudflare rule for `www.visionperformanceinc.com` (F-18).

## What to expect

Once deployed and resubmitted:

- The .com and onrender.com URLs should drop out of results within weeks.
- The homepage snippet updates when Google recrawls `/`. A manual indexing request usually speeds that up to days.

The audit can't guarantee timing; it depends on the search engines.
