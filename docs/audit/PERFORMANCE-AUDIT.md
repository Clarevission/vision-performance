# Performance audit summary

Both columns are production (https://visionperformanceinc.ca through Cloudflare), measured the same way: before at `81b73d5`, after at `77a826b`.

| Page (mobile) | Perf before → after | FCP before → after | LCP before → after | Render-blocking |
|---|---|---|---|---|
| Home | 89 → **100** | 2.9 s → **1.0 s** | 3.1 s → **1.7 s** | 1.66 s → **0** |
| Technology | 89 → **99** | 2.9 s → **1.0 s** | 3.1 s → **2.2 s** | 1.69 s → **0.10 s** |
| Contact | 89 → **97** | 2.9 s → **1.0 s** | 3.1 s → **2.5 s** | 1.69 s → **0** |

Desktop scores went from 97–98 to **100** on all three pages, with FCP about 0.3 s. CLS is **0.000** in all six production runs, and page weight fell by 8–40 KB per page. Accessibility, Best Practices and SEO remain 100.

The local pre-deploy runs are also kept in `data/lighthouse.json` (`after-*`).

## Changes

- Self-hosted, preloaded variable fonts (84 KB total, Latin subset).
- Responsive WebP wordmark (12 KB at 1×, instead of a 55 KB PNG).
- 10+ MB of masters removed from the public web root.

## Next

- Self-host hero photographs as AVIF/WebP (removes the last third-party connection and helps LCP).
- Use metric-matched fallback fonts to remove the small font-swap CLS.

Full data and method are in [18](18-performance-audit.md) and `data/lighthouse.json`.
