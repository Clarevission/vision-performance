# 09 — Performance Audit

**Environment:** local Express server, Chromium (in-app browser pane), no throttling. Production sits behind Cloudflare, which already serves Brotli (`content-encoding: br`, verified against the live site on 2026-09-25), so compressed sizes below use Brotli.

## Homepage: before and after

| Metric | Before (SPA) | After |
|---|---|---|
| HTML (decoded) | 191 KB | 42 KB |
| HTML (Brotli) | 38 KB | 7 KB |
| DOM nodes | 2,296 | 774 |
| JS | 25 KB `app.js` (product data, cart, canvas renderer, chat) | 12 KB `site.js` (3 KB Brotli), deferred |
| CSS | ~70 KB inline in every document | 38 KB external (7 KB Brotli), cached for a year via content hash |
| Font families / weights | 3 / 21 | 2 / 5 |
| Largest images | Unsplash hero (48 KB) plus a stock photo per product | Wordmark 23 KB, badge 13 KB. Van concept is responsive WebP (22 KB at 480w, 61 KB at 960w, lazy-loaded) |
| CLS | 0.000 | 0.000 (every `<img>` has width and height) |
| Local load event | ~1.4 s | ~30 ms (cached assets) |
| Portal / staff logo | **3.8 MB** PNG | 65 KB (`logo-nav.png`) |
| Portal favicon | **4.3 MB** PNG | 2 KB |

Average page HTML is 29 KB (max 42 KB, the homepage) before compression. About 14 KB of that is shared header, footer and icon sprite.

## Core Web Vitals (expected)

- **LCP:** on text-led pages the LCP element is the hero `h1`, rendered from server HTML with no image dependency. Fonts use `display=swap`, so text paints on the fallback immediately. Local LCP entries were not emitted in the emulated pane, so **field measurement after deploy is required** (backlog PERF-1).
- **INP:** minimal JS with no framework. Handlers are small DOM toggles. Expect well under 200 ms.
- **CLS:** 0. No late-injected banners (the announcement is server-rendered and only hides on dismissal). No web-font-dependent layout jumps beyond `swap`.

## Optimizations made

1. Server-composed HTML per URL instead of one 191 KB document.
2. External, content-hashed CSS and JS with `Cache-Control: max-age=31536000, immutable`. HTML is `max-age=0, must-revalidate` with an ETag.
3. Font weights trimmed; `preconnect` to Google Fonts.
4. `scripts/optimize-images.js` (`npm run images`) generates web derivatives from the brand masters: favicon 32 px, apple-touch 180 px, icon 512 px, OG JPEG, wordmark and van WebP at 480 and 960.
5. Removed third-party image hosting (Unsplash) and the canvas frame renderer.
6. `trust proxy` set so rate limiting keys on the client IP rather than the proxy, which also avoids express-rate-limit warnings behind Render and Cloudflare.

## Not changed (deliberately)

- **Compression middleware:** Cloudflare already compresses. Adding `compression` would be a redundant dependency.
- **Self-hosted fonts:** would remove a third-party connection and improve privacy, but needs font files in the repo. Listed as backlog PERF-2.
- **Brand master PNGs** (`public/images/logo-*.png`, 3.8–4.5 MB each) stay in the repo as masters. They are no longer referenced by any page.
