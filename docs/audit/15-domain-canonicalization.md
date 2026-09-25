# 15: Domain canonicalization

**Canonical origin:** `https://visionperformanceinc.ca` (apex, HTTPS, lowercase paths, no trailing slash).

| Host | Before | After deploy | Layer |
|---|---|---|---|
| `http://visionperformanceinc.ca` | 301 → https | unchanged | Cloudflare |
| `www.visionperformanceinc.ca` | 301 → apex | unchanged | Cloudflare |
| `visionperformanceinc.com` | **200, full duplicate** | **301 → `https://visionperformanceinc.ca` + path** | App (`server.js` host middleware) |
| `www.visionperformanceinc.com` | 301 → `visionperformanceinc.com` | 301 → .com → 301 → .ca (two hops) | Cloudflare, then app |
| `vision-performance.onrender.com` | **200, full duplicate** | **301 → .ca + path** | App |
| `localhost`, `127.0.0.1`, `::1` | 200 | 200 (exempt for development and tests) | App |
| `/health` on any host | 200 | 200 (exempt so Render's health check keeps working) | App |

## Implementation

The host middleware is the first thing in `server.js`. It handles GET and HEAD requests only, so POSTs are never redirected, and it responds with `301` to `https://visionperformanceinc.ca${req.originalUrl}`. It reads `req.get('host')`, which is the Host header that Cloudflare and Render pass through.

Tests send raw requests with custom `Host` headers to confirm the redirect and the `/health` exemption.

## Owner actions

- **F-18.** In the Cloudflare dashboard for `visionperformanceinc.com` (https://dash.cloudflare.com), replace the `www`→apex rule with one rule. It should match hosts `visionperformanceinc.com` and `www.visionperformanceinc.com`, and send a 301 to `concat("https://visionperformanceinc.ca", http.request.uri.path)`, preserving the query string. That makes every .com URL a single hop.
- **Render custom domains.** Keep `.com` attached to the Render service (or switch it to the Cloudflare rule above) until search engines have processed the redirects. That usually takes a few months.
