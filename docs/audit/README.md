# docs/audit

Post-implementation audit of visionperformanceinc.ca, September 2026. Start with [VPI-WEBSITE-MASTER-AUDIT](VPI-WEBSITE-MASTER-AUDIT.md), then [MASTER-FINDINGS](MASTER-FINDINGS.md).

| Path | Contents |
|---|---|
| `00-…20-*.md` | Phase reports (discovery → future-proofing) |
| `MASTER-FINDINGS.md` | Every finding with severity, evidence and final status, plus "Things working correctly" |
| `REMEDIATION-REPORT.md` | Commits, verification and open owner items |
| `SEO-REMEDIATION.md`, `SECURITY-AUDIT.md`, `ACCESSIBILITY-AUDIT.md`, `PERFORMANCE-AUDIT.md`, `FUTURE-ROADMAP.md` | Topic summaries |
| `data/crawl-baseline.json` | Production crawl before remediation (layout + axe + console, 26 URLs × 9 viewports) |
| `data/crawl-after.json` | Same crawl on the audit branch |
| `data/lighthouse.json` | Lighthouse summaries, before (production) and after (local) |
| `screenshots/`, `screenshots-after/` | **Git-ignored** (234 JPEGs each). Regenerate them with the commands below |

## Regenerating screenshots

```bash
npm run audit:crawl -- --label baseline --base https://visionperformanceinc.ca
```

```bash
npm run audit:crawl -- --label after
```

With no `--base`, the crawl boots a local production-mode server on port 3100. Use `--no-shots` to skip screenshots, and `--channel msedge` to crawl with Edge.
