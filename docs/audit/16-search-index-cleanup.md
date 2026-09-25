# 16: Search index cleanup

**Status: REQUIRES EXTERNAL CREDENTIAL (F-08).** None of the steps below have been done. They need Google Search Console and Bing Webmaster Tools access, which the audit did not have.

## Observed

- Public search results for "Vision Performance Inc" show the old single-page site's homepage snapshot ("Precision Vision for Professionals") with outdated claims.
- The duplicate hosts (`.com`, `onrender.com`) were crawlable until this audit's fix is deployed.
- The public GitHub repository (including `archive/legacy-spa`) is indexed (F-07).

## Steps, in order, after deploying the audit branch

1. **Google Search Console** (https://search.google.com/search-console)
   - Add a *Domain property* for `visionperformanceinc.ca` (DNS TXT verification in Cloudflare).
   - Sitemaps → submit `https://visionperformanceinc.ca/sitemap.xml`.
   - URL Inspection → `https://visionperformanceinc.ca/` → *Request indexing*. Repeat for `/about`, `/solutions`, `/technology` and `/contact`.
   - Add a Domain property for `visionperformanceinc.com` → Settings → *Change of address* → `visionperformanceinc.ca`. This works only after the .com 301 is live.
   - Pages report: check that the .com and onrender.com URLs move to "Page with redirect".
2. **Bing Webmaster Tools** (https://www.bing.com/webmasters): import from Search Console, submit the sitemap, and use *Site Move* for .com → .ca.
3. **GitHub** (F-07): make `Clarevission/vision-performance` private (Settings → General → Danger Zone → Change visibility). If it must stay public, remove `archive/legacy-spa/` from `main`, and ask Google to drop cached copies with the Removals tool (https://search.google.com/search-console/removals) or the outdated-content tool (https://search.google.com/search-console/remove-outdated-content).
4. **Recheck in 2–4 weeks:** `site:visionperformanceinc.com` and `site:vision-performance.onrender.com` should return nothing, and the .ca snippet should show the new title and description.

Do not use the Removals tool on the .ca homepage. That hides it entirely rather than refreshing it.
