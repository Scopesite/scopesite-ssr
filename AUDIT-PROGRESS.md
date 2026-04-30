# WORKTHROUGH.md audit execution log

Sequential execution of [WORKTHROUGH.md](./WORKTHROUGH.md). Global constraints applied (`/territory` & `TerritoryMap.tsx` untouched, Clerk/Stripe/Ghost/Cal preserved).

| # | Title | Status | Notes |
|---|--------|--------|--------|
| 1 | 44 internal 4XX | **BLOCKED** | Needs `.audit/404-list.txt` from Ahrefs export (per WORKTHROUGH). |
| 2 | voice H1 + apex links | **DONE** | Visible H1 on `/voice`; homepage + footer cross-subdomain `<a>` to voice. |
| 3 | www robots.txt | **PARTIAL** | `next.config.ts` already redirects `www` → apex; added `scripts/verify-robots.mjs`. DNS/Vercel: Dan (`fordantocomplete.md`). |
| 4 | Schema validation (8+1) | **BLOCKED/PARTIAL** | Needs `.audit/schema-errors.md` from manual validators; added `WebSite` `additionalProperty` for llms.txt only. |
| 5 | /book duplicate H1 | **DONE** | Cal demote removes empty `h1` before renaming. |
| 6 | Blog duplicate H1 | **DONE** | `demoteBodyHeadings()` on Ghost HTML. |
| 7 | Multiple H1 | **VERIFY** | Covered by 5–6; re-run Ahrefs after deploy. |
| 8 | robots.txt audit | **DONE** | `public/robots.txt` aligned with crawl rules + `Allow: /api/og/` + AI bots + crawl-delay lines. |
| 9 | llms.txt + llms-full | **DONE** | `GET /llms.txt`, `GET /llms-full.txt` route handlers; robots comment; schema `PropertyValue`. |
| 10 | Title/meta length | **BLOCKED/PARTIAL** | Needs `scripts/audit-meta.ts` + voice subdomain project for title tweaks. |
| 11 | Image size + alt | **PARTIAL** | Ghost image: Dan (`fordantocomplete.md`); code paths unchanged aside from global perf work. |
| 12 | Low word count | **DONE** | `/book` expanded copy block before Cal embed. |
| 13 | Crawl `_next` URLs | **DONE** | robots `Disallow` + `headers()` on `/_next/static/*` (Next warns in dev; OK for prod CDN). |
| 14 | Orphan /brief | **DONE** | Footer, pricing blurb, book paragraph link to `/brief`. |
| 15 | Toxic anchors | **SKIP** | Dan / GSC disavow. |
| 16 | hreflang /us | **DONE** (existing) | [`getAlternates`](./src/lib/hreflang-map.ts) + per-page `metadata.alternates` already map GB↔US pairs. |
| 17 | H1 glued words | **PARTIAL** | Homepage hero spacing fixed; full-site grep deferred. |
| 18 | External 4XX/3XX | **BLOCKED** | Needs `.audit/external-links.csv`. |
| 19 | IndexNow | **DONE** | `POST /api/indexnow` + `scripts/indexnow-bulk.ts`; set `INDEXNOW_KEY` and host `https://scopesite.co.uk/<KEY>.txt`. |
| 20 | Schema bloat | **DEFERRED** | Route-aware trimming needs middleware pathname or route-group refactor; do after #4 errors are listed. |
| 21–22 | SERP mismatch / assets | See #10 / #13 | |
| 23 | robots changed | **INFO** | Intentional with this audit; see `git log -- public/robots.txt`. |
| 24 | E-E-A-T internal links | **PARTIAL** | Dan byline block in `AuthorBio` (Dan posts) links `/about`, `/case-studies/h4tlt`, `/voice`. |
| 25 | A11y landmarks | **PARTIAL** | Root `SkipLink`, `<main id="main-content">` already; blog uses `<article>` for body. |

## Commands

```bash
npm run typecheck && npm run lint && npm run build
```

After deploy: `node scripts/verify-robots.mjs` — then median mobile PSI on `/` and `/book` (target ≥96).
