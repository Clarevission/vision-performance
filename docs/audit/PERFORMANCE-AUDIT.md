# Performance audit summary

| Page (mobile) | Perf before → after | FCP before → after | LCP before → after |
|---|---|---|---|
| Home | 89 → **98** | 2.9 s → **1.2 s** | 3.1 s → **2.3 s** |
| Technology | 89 → **98** | 2.9 s → **1.1 s** | 3.1 s → **2.4 s** |
| Contact | 89 → **97** | 2.9 s → **1.1 s** | 3.1 s → **2.6 s** |

Desktop scores went from 97–98 to **100** on all three pages. TBT is 0–50 ms throughout, and CLS stays at or below 0.034.

**Caveat:** the "before" runs are production through Cloudflare; the "after" runs are a local production-mode server. The main cause of the improvement doesn't depend on the environment: removing the Google Fonts request chain cut render-blocking time from about 1.7 s to about 0.1–0.25 s on mobile. A production re-run is scheduled for after deploy.

## Changes

- Self-hosted, preloaded variable fonts (84 KB total, Latin subset).
- Responsive WebP wordmark (12 KB at 1×, instead of a 55 KB PNG).
- 10+ MB of masters removed from the public web root.

## Next

- Self-host hero photographs as AVIF/WebP (removes the last third-party connection and helps LCP).
- Use metric-matched fallback fonts to remove the small font-swap CLS.

Full data and method are in [18](18-performance-audit.md) and `data/lighthouse.json`.
