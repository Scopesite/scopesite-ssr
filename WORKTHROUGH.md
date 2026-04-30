# ScopeSite.co.uk — Forensic SEO + AI Visibility Audit

Audit run: 30 Apr 2026 against Ahrefs project `7358242` (Scopesite, mode=subdomains, protocol=both). Site Audit health score 93/100. 623 URLs crawled. 44 URLs with errors, 19 with warnings, 93 with notices. DR 13. 65 live referring domains. 546 live backlinks. 2 organic keywords / 4 visits (GB).

Two deliverables follow as separate Markdown documents.

---

# DOCUMENT 1 — `scopesite-audit-cursor-prompts.md`

> Comprehensive technical SEO + AEO/GEO findings sorted by **urgency of impact on combined search-engine and AI-visibility performance**. Each issue includes a self-contained Composer 2 / Cursor prompt. Global constraints listed once at the top apply to **every** prompt below.

## Global constraints (apply to every Cursor prompt)
- Do **NOT** touch `/territory` route or `TerritoryMap.tsx` (complex, working — out of scope).
- Do **NOT** touch `BrevoTracker.tsx` `beforeInteractive` strategy (deliberate — see Brain note).
- Schema/JSON-LD lives in `layout.tsx` files for routes — preserve all schema; only add or correct, never remove.
- For any performance change, validate with the **median of 3–5 PageSpeed runs** on the affected URL on both Mobile and Desktop. Mobile must remain ≥ 96, Desktop = 100.
- Always show a `git diff` (or Cursor diff view) before applying.
- Never change Clerk auth on `/portal/*`. Never change Stripe handling on `/llm-brain` checkout.
- Preserve Ghost CMS fetch behaviour for `/blog`. Preserve Cal.com embed on `/book`.
- Run `pnpm typecheck`, `pnpm lint`, `pnpm build` after each change. Don't ship if any fail.

## Table of contents
1. CRITICAL — 44 internal 404 pages (4XX) leaking link equity (Pages-to-IndexNow 44)
2. CRITICAL — `voice.scopesite.co.uk` subdomain has no H1 and no internal-link graph
3. CRITICAL — `www.` host returning 301 but Ahrefs sees `www.scopesite.co.uk/robots.txt` as `http_code=0` (host-edge / DNS-edge inconsistency)
4. CRITICAL — Schema validation errors on 8 pages + 1 Google Rich-Results validation error
5. HIGH — `/book` has duplicate H1 (one empty) — AI extraction confusion
6. HIGH — `/blog/html-structure-schema-ai-visibility` has duplicate H1 (one empty)
7. HIGH — Multiple H1 tags on 2 indexable pages (Ahrefs `Multiple H1 tags = 2`)
8. HIGH — Robots.txt rules disallow crawl on at least one path; `Robots.txt has too many redirects` flag tripped on a single path
9. HIGH — Missing `llms.txt` and `llms-full.txt` (AEO/GEO competitive moat — agency sells AI visibility)
10. HIGH — Title too long on 1 page; meta description too long on 1 page; SERP/page title mismatch on 1 page
11. HIGH — Image file size too large (1 page) + 1 missing alt-text instance
12. HIGH — Low word count warning on 1 indexable page
13. HIGH — 33 URLs with more than 3 query parameters (mostly `_next/image` and Vercel chunks) — crawl-budget bleed
14. MEDIUM — Orphan page (1 indexable page with zero incoming internal links)
15. MEDIUM — `referring domains dropped` notice (–1) and toxic-anchor profile (5 of top 10 anchors are spam/SEO-tool spam)
16. MEDIUM — No hreflang between `/` and `/us/*` mirror pages — duplicate-content risk for international targeting
17. MEDIUM — H1 contains glued words (e.g. "WebsitesAI Can Actually Recommend", "WEB DESIGN BURNHAM-ON-SEA" with spacing artefacts) — AI tokeniser confusion
18. MEDIUM — 4 external 4XX links and 4 external 3XX redirects from internal pages
19. MEDIUM — IndexNow not wired up (44 pages flagged "to submit to IndexNow")
20. MEDIUM — Schema bloat: 11–14 schema types per page including `BusinessAudience`, `DefinedTermSet`, `ScheduleAction` on every page (legal/tax/privacy pages don't need a Service graph)
21. LOW — `Page and SERP titles do not match` on 1 page
22. LOW — Vercel `_next/static/chunks` and `_next/image` URLs being treated as crawlable (no `Cache-Control: immutable` signal in robots, depth=1 dilution)
23. LOW — `Robots.txt changed` warning — verify intentional
24. LOW — DR 13 / Ahrefs Rank 12.6M — link-velocity & E-E-A-T building (mostly Dan-side, but a code piece in here)
25. LOW — Accessibility hooks for AEO (skip-links, landmark roles, `aria-label` on icon links)

---

### 1. CRITICAL — 44 internal 4XX/404 pages leaking equity
**Severity:** Critical. Ahrefs flagged `404 page` and `4XX page` both at **crawled=44, change=+44** on this run — every one of these is a fresh discovery. They appear as internal links from indexed pages.

**Why it matters (SEO):** 4XX pages waste Googlebot crawl budget, drop link equity, and are the single biggest signal of site-decay rot. With only 65 referring domains live, every link to a 404 is a measurable loss.

**Why it matters (AEO/GEO):** ChatGPT, Perplexity, Claude and Gemini crawlers either skip 404s or — worse — cite the URL anyway and produce hallucinated answers. For an agency that sells AI visibility, having 44 broken internal URLs is reputational.

**Where:** Without `site-explorer-crawled-pages` filter access (the Ahrefs MCP tool errored repeatedly on `where` filters in this run — see "for Dan to complete" doc), the 44 URLs need to be retrieved by Dan from the Ahrefs Site Audit dashboard → Internal pages → 4XX. Likely candidates based on crawl evidence: stale links to `/territory/*` deep paths, `/portal/*` from public pages, and old `/blog/*` slugs (e.g. legacy `/post/just-google-it-and-uk-geo-seo` from the old `www.` Wix site is being indexed by web search).

**Cursor prompt:**
```
[Global constraints apply.]

GOAL: Locate and fix the 44 internal 4XX URLs flagged by Ahrefs Site Audit on 2026-04-30.

STEPS:
1. Run `pnpm dlx next-sitemap --config next-sitemap.config.js` (or read the existing sitemap output) and diff against the list of 44 URLs Dan will paste into `/.audit/404-list.txt` (he'll do this manually — wait until that file exists before continuing).
2. For each URL in `/.audit/404-list.txt`:
   a. If the URL maps to a renamed page, add a permanent 308 in `next.config.ts` `redirects()` to the canonical equivalent. Do NOT use 301 in App Router config — use the built-in `redirects()` async function.
   b. If the URL is genuinely deleted, add a 410 via a custom route handler at `app/[...gone]/route.ts` returning `new Response(null, { status: 410 })` for matched paths.
   c. If the URL is a typo'd internal link, grep the codebase (`rg -n "old-slug"`) and fix the link in the source component.
3. After redirects/410s are added, regenerate the sitemap and confirm none of the 44 URLs appear in `app/sitemap.ts` output.
4. Build and verify with `curl -I https://scopesite.co.uk/<each-url>` — must return 200, 308, or 410. No 404s allowed for any URL on the list.
5. Validate Mobile PageSpeed median 3 runs on `/` — must remain ≥96.

DO NOT TOUCH: /territory, TerritoryMap.tsx, BrevoTracker.tsx, layout.tsx schema blocks, /portal Clerk auth, Stripe routes.
SHOW DIFF before applying any redirect rule.
```

**Expected outcome:** Ahrefs `404 page` count drops from 44 → 0 on next crawl. Crawl-budget recovery within 2 Googlebot cycles. AI crawlers stop returning broken URLs to citations.

---

### 2. CRITICAL — `voice.scopesite.co.uk` has no H1 and zero internal links
**Severity:** Critical. From `site-audit-page-explorer`: `https://voice.scopesite.co.uk/` has `h1: []` (empty array), `links_count_internal: 0`, `links_count_external: 0`, page rating 48. Title: "V.O.I.C.E. by ScopeSite — AI Visibility Scanner | Cheapest AI Visibility Checker".

**Why it matters (SEO):** This is the flagship product subdomain. A missing H1 on the most commercially valuable page is a catastrophic on-page miss. Internal-link count of 0 from the rest of the site means it cannot accrue PageRank from the apex.

**Why it matters (AEO/GEO):** Without an H1, LLMs cannot extract the page's primary entity. ChatGPT, Perplexity and Gemini all use the H1 as the "what is this page" extraction token. The page is selling AI visibility scans — being invisible to AI is fatal positioning.

**Cursor prompt:**
```
[Global constraints apply.]

GOAL: Add a single, semantically perfect H1 to https://voice.scopesite.co.uk/ root page, and ensure the apex scopesite.co.uk site links to it from at least the homepage hero and footer.

STEPS:
1. Locate the root component for the voice.* subdomain. It's likely in a separate Vercel project or under `apps/voice/` in this monorepo. Confirm with `find . -path '*voice*' -name 'page.tsx' -not -path '*/node_modules/*'`.
2. Add ONE `<h1>` immediately under the hero, e.g. `<h1>V.O.I.C.E. — AI Visibility Scanner for UK Businesses</h1>`. The H1 must contain the primary entity ("AI Visibility Scanner") and qualifier ("UK Businesses"). Do not stylise as ALL CAPS at the DOM level — use Tailwind `uppercase` utility instead so the actual text remains case-correct for AI parsers.
3. Confirm there is exactly one H1 on the page (no others). Use `next dev` and check DOM with `document.querySelectorAll('h1').length === 1`.
4. On the apex site, locate `app/page.tsx` (homepage) and footer component (likely `components/Footer.tsx` or similar). Add an internal link to `https://voice.scopesite.co.uk/` with anchor text "Run a free AI visibility scan with V.O.I.C.E.". Make sure the link uses `<a href>` not `next/link` (cross-subdomain navigation).
5. Validate Mobile PageSpeed median 3 runs on voice subdomain root — must remain ≥96 Mobile / 100 Desktop.

DO NOT TOUCH: /territory, TerritoryMap.tsx, BrevoTracker.tsx, schema in layout.tsx files.
SHOW DIFF before applying.
```

**Expected outcome:** H1 present and unique. Internal-link graph from apex → voice subdomain established. Page rating in next Ahrefs crawl should rise from 48 toward 60+.

---

### 3. CRITICAL — `www.` host inconsistency (`www.scopesite.co.uk/robots.txt` returns `http_code=0`)
**Severity:** Critical. Ahrefs sees `https://www.scopesite.co.uk/` 301 → `https://scopesite.co.uk/` correctly (good), but `https://www.scopesite.co.uk/robots.txt` returns `http_code: 0` — meaning the request **fails** (timeout, refused, or DNS). This is logged as **`Robots.txt is not accessible`** with `crawled=1` (Error severity).

**Why it matters (SEO):** Googlebot, Bingbot and AhrefsBot probe both apex and `www.` for robots.txt. If `www.` host hangs, crawlers may apply a default-deny or default-allow inconsistently and you'll get sporadic indexing flips.

**Why it matters (AEO/GEO):** Most AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) respect robots.txt strictly. A non-resolvable `www.` host can cause LLM crawlers to skip the entire domain on a host mismatch.

**Cursor prompt:**
```
[Global constraints apply.]

GOAL: Ensure https://www.scopesite.co.uk/robots.txt returns 200 (or follows the 301 to apex robots.txt and the apex returns 200) under all conditions.

STEPS:
1. In Vercel project settings (cannot be done from code — flag for Dan in fordantocomplete.md if missing). From code side:
2. Confirm `next.config.ts` has a `redirects()` rule:
   { source: '/:path*', has: [{ type: 'host', value: 'www.scopesite.co.uk' }], destination: 'https://scopesite.co.uk/:path*', permanent: true }
   This must apply to /robots.txt and /sitemap.xml the same as any other path.
3. Verify `app/robots.ts` (or static `public/robots.txt`) exists and outputs the canonical robots payload. If using `app/robots.ts`, confirm Next.js 16 generates `/robots.txt` correctly.
4. Add an integration test at `tests/e2e/robots.spec.ts` (Playwright or Vitest+fetch) that asserts:
   - `https://scopesite.co.uk/robots.txt` returns 200 with `text/plain` content-type.
   - `https://www.scopesite.co.uk/robots.txt` returns 301 to apex AND the apex returns 200 (follow redirect).
5. Validate with `curl -IL https://www.scopesite.co.uk/robots.txt` after deploy.

DO NOT TOUCH: /territory, TerritoryMap.tsx, BrevoTracker.tsx, schema in layout.tsx files.
SHOW DIFF before applying.
```

**Expected outcome:** Both apex and `www.` robots.txt resolve to 200 (apex direct, www. via 301). Ahrefs `Robots.txt is not accessible` error clears.

---

### 4. CRITICAL — Schema validation errors on 8 pages + 1 Google rich-results error
**Severity:** Critical. Ahrefs: `Structured data has schema.org validation error` crawled=8. `Structured data has Google rich results validation error` crawled=1.

**Why it matters (SEO):** Invalid JSON-LD silently disables rich snippet eligibility (FAQ, HowTo, Article, Product, LocalBusiness). Google may still parse partial schema but suppresses the visual treatment.

**Why it matters (AEO/GEO):** This is the worst possible failure for an AI-visibility agency. ChatGPT and Perplexity ingest JSON-LD as a primary signal for entity extraction. Invalid schema on the agency selling schema is a credibility issue that will surface in any peer audit.

**Likely culprits** (from page-rating data showing 11–14 schema types per page): `BusinessAudience` and `DefinedTermSet` on every page (these belong only on pages that actually define audiences/terms — privacy-policy and terms-and-conditions don't need them). `Service` graph on `/privacy-policy` is invalid (a privacy policy isn't a service offering). `Offer` on `/territory` and `/us/pricing` needs `priceCurrency` + `availability` checked. `HowTo` on `/voice` and `/blog/how-to-get-recommended-by-chatgpt` needs `step` array correctness.

**Cursor prompt:**
```
[Global constraints apply.]

GOAL: Identify and fix all 9 structured-data validation errors flagged by Ahrefs Site Audit (8 schema.org + 1 Google rich-results).

STEPS:
1. For each page in this priority order, run the JSON-LD through Google's Rich Results Test (https://search.google.com/test/rich-results) AND Schema Markup Validator (https://validator.schema.org/). Pages: /, /pricing, /voice, /web-design, /territory, /us/pricing, /case-studies/h4tlt, /privacy-policy, /terms-and-conditions, /accessibility-statement.
2. For each error returned, edit the schema source file in the corresponding `app/<route>/layout.tsx` (or shared schema utility, likely `lib/schema/*.ts`).
3. Fix the most likely systemic errors:
   a. Remove `Service` and `Offer` graphs from /privacy-policy, /terms-and-conditions, /accessibility-statement.
   b. Remove `BusinessAudience` and `DefinedTermSet` from any page that doesn't actually define a business audience or term — keep only on / (homepage), /voice, /web-design, /pricing, /territory, /case-studies/h4tlt.
   c. On `Offer` schemas (/territory, /us/pricing, /llm-brain), confirm `priceCurrency` is "GBP" or "USD", `availability` is `https://schema.org/InStock`, and `price` is a number string not "from £X".
   d. On `HowTo` schemas (/voice, /blog/how-to-get-recommended-by-chatgpt), confirm `step` is an array of `HowToStep` objects with both `name` and `text` properties.
   e. On `Review` schema (homepage), confirm `itemReviewed` is set and `author` is a `Person` or `Organization` object, not a string.
   f. On `BlogPosting` schemas, confirm `author`, `datePublished`, `dateModified`, `headline`, `image`, `publisher` (with logo) are all present.
4. PRESERVE all other schema. Do NOT remove `LocalBusiness`, `Organization`, `WebSite`, `BreadcrumbList`, `FAQPage`, `Article`, `WebPage`, `ProfessionalService`, `ScheduleAction` — these are correct.
5. After each file change, run `pnpm typecheck` and re-test the affected URL with both validators. Both must return 0 errors.
6. Commit per-page so any regressions can be bisected.

DO NOT TOUCH: /territory page logic or TerritoryMap.tsx; only the schema export attached to /territory layout.
DO NOT remove any schema graph that validates cleanly today.
SHOW DIFF before applying.
```

**Expected outcome:** All 8 schema.org errors and 1 Google rich-results error clear in next Ahrefs crawl. Eligibility for FAQ, HowTo, Article, LocalBusiness, Offer rich snippets restored.

---

### 5. HIGH — `/book` has a duplicate H1 with an empty second one
**Severity:** High. From page-explorer: `"h1": ["BOOK A FREE STRATEGY CALL", ""]`.

**Why it matters:** Empty H1 is parsed by some crawlers as "missing", confusing the H1-presence signal. AI extraction picks the first non-empty H1 but logs the inconsistency.

**Cursor prompt:**
```
[Global constraints apply.]

GOAL: Remove the empty H1 on /book so only one H1 remains.

STEPS:
1. Open `app/book/page.tsx`.
2. Find both `<h1>` elements. One contains "BOOK A FREE STRATEGY CALL" (likely with `<br/>` line breaks rendering as visual line wrapping), the other is empty — probably a placeholder or a leftover from a hero variant.
3. Delete the empty `<h1>`. If it has Tailwind classes that affect spacing, replace with a `<div>` carrying the same classes.
4. Confirm `document.querySelectorAll('h1').length === 1` in the dev preview.
5. Validate Mobile PageSpeed on /book median 3 runs — must remain ≥96.

DO NOT TOUCH: Cal.com embed component, BrevoTracker, schema.
SHOW DIFF before applying.
```

**Expected outcome:** Single H1 on /book. Ahrefs `Multiple H1 tags` count drops by 1.

---

### 6. HIGH — `/blog/html-structure-schema-ai-visibility` has duplicate H1
**Severity:** High. Page H1: `["Why Your Website's HTML Structure Matters as Much as Your Schema Markup ...", ""]`.

**Why it matters:** This article's whole thesis is that HTML structure matters for AI. Having broken HTML structure on the article itself is an own-goal for E-E-A-T.

**Cursor prompt:**
```
[Global constraints apply.]

GOAL: Fix the duplicate H1 on the Ghost-CMS-rendered post /blog/html-structure-schema-ai-visibility.

STEPS:
1. The blog uses Ghost as headless CMS. Locate the rendering route `app/blog/[slug]/page.tsx` (or similar).
2. The empty H1 is probably because the Ghost post body contains an `<h1>` AND the page template renders post.title as a separate `<h1>`. Standard fix: render `post.title` as the only `<h1>` in the template, and downgrade any in-body `<h1>` to `<h2>` either at template-render time (regex/HTML-parse the post.html) or by editing the source post in Ghost.
3. Preferred approach (template-side, no Ghost edit needed): in `app/blog/[slug]/page.tsx`, post-process `post.html` with `rehype` / `parse5` to convert any `<h1>` in post body to `<h2>`, shifting `<h2>→<h3>` etc. Use existing rehype plugins if any are already in the dependency tree; otherwise use a small regex pass `html.replace(/<h([1-5])([^>]*)>/g, ...)` with care for self-closing tags.
4. Verify the post renders with exactly one H1 and a logical heading hierarchy.
5. Spot-check 3 other blog posts to confirm no regressions.

DO NOT TOUCH: Ghost API fetch logic credentials. Don't edit Ghost-side post unless template fix isn't viable.
SHOW DIFF before applying.
```

**Expected outcome:** One H1 per blog post. Heading hierarchy clean for AI extraction.

---

### 7. HIGH — Multiple H1 tags warning on 2 indexable pages
**Severity:** High. Ahrefs: `Multiple H1 tags` (Notice, indexable=true) crawled=2. Items 5 and 6 above account for both. Once those two are fixed this clears.

**Cursor prompt:** Covered by items 5 + 6 above. Verify after both are deployed.

---

### 8. HIGH — Robots.txt rules disallow at least one crawlable path; redirect-loop flag
**Severity:** High. Ahrefs `Robots.txt rules disallow to crawl` Notice crawled=1; combined with `Robots.txt has too many redirects or redirect loop` Error item present (crawled=0 currently but watched). Probable cause: `Disallow: /portal/` is correct (Clerk-protected), but verify nothing important is disallowed, e.g. `/api/og/` (OG image generation routes, used by social previews) or `/_next/`.

**Cursor prompt:**
```
[Global constraints apply.]

GOAL: Audit robots.txt to confirm only intended paths are disallowed; fix any redirect chains.

STEPS:
1. Open `app/robots.ts` (or `public/robots.txt`).
2. Confirm the following Disallow lines (and ONLY these):
   - Disallow: /portal/
   - Disallow: /api/
   - Disallow: /_next/data/   (only the data subroute, NOT all of /_next/)
3. Confirm Allow lines: /api/og/ (so OG images render in social previews and AI crawler link unfurling).
4. Confirm Sitemap line points to https://scopesite.co.uk/sitemap.xml (apex, not www).
5. Add explicit User-agent blocks for AI crawlers we WANT to allow: GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot — all `Allow: /` (this signals intent and prevents accidental future blocks).
6. Add `Crawl-delay: 10` for AhrefsBot and SemrushBot only.
7. Test the file with Google Search Console robots.txt tester and with `curl https://scopesite.co.uk/robots.txt`.
8. Verify no rule line creates a redirect by referencing a URL that itself 301s.

DO NOT block GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, ChatGPT-User, Google-Extended, or CCBot. The business sells AI visibility — these crawlers are revenue.
SHOW DIFF before applying.
```

**Expected outcome:** Robots.txt is intentional, AI-crawler-friendly, and no rule causes a redirect loop.

---

### 9. HIGH — Missing `llms.txt` and `llms-full.txt` (AEO/GEO competitive moat)
**Severity:** High. The site does not appear to publish `/llms.txt`. For an agency selling AI visibility, this is a positioning signal as much as a technical one. Note: Google has stated llms.txt provides no SEO benefit, but Anthropic, OpenAI and Perplexity tooling do increasingly reference it; more importantly, it's a marketing artefact that proves you eat your own dog food.

**Cursor prompt:**
```
[Global constraints apply.]

GOAL: Publish /llms.txt and /llms-full.txt at the apex.

STEPS:
1. Create `app/llms.txt/route.ts` (Route Handler) returning `text/plain` content per the llmstxt.org spec:
   - H1: "# ScopeSite Digital Studios"
   - Blockquote: 1-line description ("Veteran-owned UK web-design and AI-visibility agency. V.O.I.C.E. methodology. Server-side-rendered Next.js 16 sites optimised for ChatGPT, Claude, Gemini and Perplexity citation.")
   - Section "## Core pages" with bullet links to: /, /voice, /web-design, /pricing, /territory, /case-studies/h4tlt, /about, /book.
   - Section "## Methodology" with /voice, /answer-engine-optimisation, /generative-engine-optimisation, /schema-markup, /ai-seo-services.
   - Section "## Local services" with /web-design-frome, /web-design-bristol, /web-design-bath, /web-design-somerset, /seo-frome, /seo-somerset, /seo-bristol.
   - Section "## US market" with /us, /us/services, /us/ai-visibility, /us/pricing, /us/quote, /us/generative-engine-optimization.
   - Section "## Featured articles" with the 5 highest-rated blog posts (by Ahrefs page rating): /blog/we-audited-500-personal-injury-law-firm-websites, /blog/what-is-domain-authority, /blog/geo-vs-seo-vs-aeo, /blog/claude-opus-4-7-investigation, /blog/ai-visibility-checker.
   - Section "## Optional" with /privacy-policy, /terms-and-conditions, /accessibility-statement.
2. Create `app/llms-full.txt/route.ts` returning a concatenated Markdown export of the same priority pages — one section per page with H1 = page title, then a 200–400 word AI-friendly summary of that page's content (use existing copy, do not hallucinate). Total file should be ≤ 200 KB.
3. Reference both files in /robots.txt as a courtesy (non-standard but harmless): `# llms.txt: https://scopesite.co.uk/llms.txt`.
4. Add a JSON-LD `WebSite` `additionalProperty` on the homepage with name="llms.txt" and value="https://scopesite.co.uk/llms.txt" (low-confidence signal but cheap to add).
5. Validate both files render with correct `Content-Type: text/plain; charset=utf-8` and `Cache-Control: public, max-age=3600`.

DO NOT touch existing schema graphs in layout.tsx — only ADD the additionalProperty.
SHOW DIFF before applying.
```

**Expected outcome:** `https://scopesite.co.uk/llms.txt` and `https://scopesite.co.uk/llms-full.txt` resolve, valid llmstxt.org-compliant, and the agency credibly demonstrates the artefact it sells.

---

### 10. HIGH — Title too long (1 page), meta description too long (1 page), SERP/page title mismatch (1 page)
**Severity:** High. Ahrefs flags `Title too long` warning crawled=1, `Meta description too long` warning crawled=1, `Page and SERP titles do not match` notice crawled=1.

**Likely culprit pages** (from data):
- Title too long: `/web-design-warminster` ("Web Design Warminster | Websites Built for AI Visibility | ScopeSite") = 65 chars — borderline. Or `/web-design-trowbridge` ("Web Design Trowbridge | Modern Websites Built Near You | ScopeSite") = 67 chars. Or `voice.scopesite.co.uk/` ("V.O.I.C.E. by ScopeSite — AI Visibility Scanner | Cheapest AI Visibility Checker") = 81 chars — most likely culprit.
- Meta description too long: Several look long; without programmatic length check, the most likely is `voice.scopesite.co.uk/` description at 270 chars (limit ~160).

**Cursor prompt:**
```
[Global constraints apply.]

GOAL: Bring all titles ≤60 chars and all meta descriptions ≤155 chars; resolve the one Page-vs-SERP title mismatch.

STEPS:
1. Audit titles: write a small node script `scripts/audit-meta.ts` that fetches every URL in app/sitemap.ts output, parses `<title>` and `<meta name="description">`, and prints offenders. Run it and produce `.audit/meta-audit.csv`.
2. For each offender, edit the `metadata` export in the corresponding `app/<route>/page.tsx` (Next.js 16 App Router metadata API). Targets:
   - Title: 50–60 chars including " | ScopeSite". Front-load primary keyword.
   - Description: 140–155 chars. End with a clear CTA or qualifier.
3. Specific fixes (verify before editing — the script output is authoritative):
   a. voice.scopesite.co.uk/: change title to "V.O.I.C.E. — AI Visibility Scanner UK | ScopeSite" (51 chars). Description: "Cheapest AI visibility checker from £0.58 per scan. Schema, Core Web Vitals & AI crawler checks. 20-page PDF report. No subscription." (140 chars).
4. For the page-vs-SERP title mismatch (Ahrefs flags 1 page): identify by comparing `<title>` vs Google SERP title via Search Console (Dan to provide screenshot if not detectable in code) — usually caused by Google rewriting because the title looks too promotional or because brand placement is wrong. Fix by moving brand to end, removing emoji, removing pipe-stuffing.
5. Validate Mobile PageSpeed on every edited page — must stay ≥96.

DO NOT TOUCH: /territory page or its metadata block. Schema in layout.tsx is separate from page.tsx metadata — do not move it.
SHOW DIFF before applying.
```

**Expected outcome:** Zero "title too long" / "description too long" / "title mismatch" warnings on next Ahrefs crawl.

---

### 11. HIGH — Image file size too large (1 page) + 1 missing alt-text
**Severity:** High. Ahrefs: `Image file size too large` Error crawled=1, `Missing alt text` Warning crawled=1.

**Likely culprit:** Ghost-served images proxied through `_next/image?url=https%3A%2F%2Fstorage.ghost.io%2F...&w=1920&q=75` — several at 1920px width. The `feature_image_what_is_domain_authority_scopesite_digital_studios.png` at w=1920 q=75 is likely the offender.

**Cursor prompt:**
```
[Global constraints apply.]

GOAL: Reduce the oversize image to under 200 KB at the rendered size, and add the missing alt text.

STEPS:
1. Identify the oversize image — likely a Ghost-hosted PNG. Run `curl -sI "https://scopesite.co.uk/_next/image?url=...&w=1920&q=75" | grep -i content-length` for top blog feature images and find the one >500 KB.
2. Three options, pick the cheapest that works:
   a. In Ghost admin, replace the source PNG with a re-saved WebP/AVIF at correct dimensions (max 1600px wide). Cursor cannot do this — flag for Dan.
   b. In Next.js image rendering, lower `q` (quality) to 70 from 75 in the relevant `<Image>` `quality` prop. This is a code change Cursor CAN do.
   c. In `next.config.ts`, set `images.formats: ['image/avif', 'image/webp']` (already default in Next 16 — confirm).
3. For the missing alt-text instance: grep for `<Image` and `<img` and find any without an `alt` prop. The most common offender is decorative imagery in hero sections. Add `alt=""` for genuinely decorative images, descriptive alt for content images.
4. Run Lighthouse — confirm Mobile ≥96 maintained.

DO NOT change image-rendering logic in /territory or any TerritoryMap component.
SHOW DIFF before applying.
```

**Expected outcome:** Image file size flag clears. Alt-text count = 0 missing.

---

### 12. HIGH — Low word count on 1 indexable page
**Severity:** High (in context). Ahrefs: `Low word count` Warning indexable=true crawled=1.

**Likely culprit:** `/book` page (Cal.com embed dominates, page copy is sparse) or `/case-studies` index (just card grid, low text).

**Cursor prompt:**
```
[Global constraints apply.]

GOAL: Bring the one indexable thin-content page above 300 words of substantive on-page copy.

STEPS:
1. Identify the page — most likely /book, /case-studies, or /us/quote. Run `scripts/audit-meta.ts` extended to also count words inside `<main>`.
2. For /book: above the Cal.com embed, add a 250-300 word section with H2 "What happens on your free strategy call" with bullets covering: (1) we audit your current AI visibility live in the call using V.O.I.C.E.™, (2) we identify the 3 highest-impact fixes, (3) you get the audit PDF whether or not you book us, (4) no sales pitch, no contracts.
3. For /case-studies: above the card grid, add 200-300 words framing the agency's track record, with FAQPage schema added (e.g. "How does ScopeSite measure case study success?").
4. Validate Mobile PageSpeed median 3 runs — must remain ≥96.

DO NOT touch the Cal.com embed or its iframe attributes.
SHOW DIFF before applying.
```

**Expected outcome:** Low-word-count warning clears.

---

### 13. HIGH — 33 URLs with >3 query parameters (crawl-budget)
**Severity:** High. Ahrefs `More than three parameters in URL` notice crawled=33. Mostly `_next/image?url=...&w=...&q=...&dpl=...` (4 params) and `_next/static/chunks/<hash>.js?dpl=...` (1 param but URL pattern is high-cardinality).

**Cursor prompt:**
```
[Global constraints apply.]

GOAL: Stop crawlers wasting budget on Next.js asset URLs.

STEPS:
1. In `app/robots.ts` (or public/robots.txt) add:
   Disallow: /_next/image
   Disallow: /_next/static/chunks/
   Allow: /_next/image$    (allow exact-match if any are content images we want indexed — usually none are)
2. Add `Cache-Control: public, max-age=31536000, immutable` headers for /_next/static/ paths via `next.config.ts` `headers()`. Most likely already configured by Vercel — verify.
3. For images we DO want crawlable (OG images, key blog feature images), serve them via `/api/og/` or `/images/` and reference those URLs in JSON-LD `image` properties — not the `_next/image` proxy. Update schema.org `image` properties to point to the canonical asset URL not the Next.js optimiser URL.
4. Verify with `curl -I https://scopesite.co.uk/robots.txt` and `Disallow` rules listed.

DO NOT block /_next/static/css/ — pages need their CSS to render for crawler visibility (Googlebot evaluates rendered DOM).
SHOW DIFF before applying.
```

**Expected outcome:** Ahrefs URL-parameter notice drops below 5. Crawl budget refocused on content URLs.

---

### 14. MEDIUM — Orphan page (1 indexable page with no incoming internal links)
**Severity:** Medium. Ahrefs: `Orphan page (has no incoming internal links)` Error indexable=true crawled=1.

**Likely culprit:** `/brief` (incoming_all_links: 1, links_count_internal: 42 outgoing — but only 1 incoming, possibly only from sitemap). Or `voice.scopesite.co.uk/` from apex perspective.

**Cursor prompt:**
```
[Global constraints apply.]

GOAL: Link to the orphan page from at least 3 other indexable pages.

STEPS:
1. Identify the orphan page from Ahrefs Site Audit > Links > Orphan pages (Dan to confirm if not /brief).
2. Add internal links from:
   a. Footer (component, applies site-wide) — link "Send us a brief" → /brief.
   b. /pricing — within the QuoteCalculator outro, "Prefer to send a written brief? /brief".
   c. /book — alternative path "Not ready to book? /brief".
   d. /contact (if exists) or homepage CTA section — "Got a longer brief? Send it here" → /brief.
3. Validate the page now appears in `next-sitemap` output as referenced and has a click-depth of ≤2 from /.

DO NOT TOUCH: /territory, BrevoTracker, schema in layout.tsx.
SHOW DIFF before applying.
```

**Expected outcome:** Orphan page count = 0.

---

### 15. MEDIUM — Toxic-anchor profile (5 of top 10 anchors are spam)
**Severity:** Medium. From `site-explorer-anchors`: anchors include `"Navigate canaifindme.online success: guest posts + high-quality backlinks; DR/DA/TF climb — worldwide niches. | Visit buyseolink.com for any Query"`, `"Boost visibility with SeoZino.com at scopesite.co.uk!"`, `"fromewebdesign.com, unstoppable is the new normal—iTxoft.com ensures you get there."`, `"Upgrade Your SEO for https://scopesite.co.uk: Our Guest Post Service & Dofollow Links—Experts in Gambling & Every Niche..."`. These are spam-link injections — Black-hat SEO tools dropping spam to inflate competitor backlink stats. Half the link profile is contaminated.

**Severity rationale:** Algorithmic trust hit. With only 65 referring domains, 5 spam anchors is a meaningful share.

**Cursor prompt:** This is a Dan-side task (disavow file in GSC), see `fordantocomplete.md`. Cursor cannot disavow links.

---

### 16. MEDIUM — No hreflang between `/` and `/us/*` mirror pages
**Severity:** Medium. Pages `/us`, `/us/services`, `/us/ai-visibility`, `/us/pricing`, `/us/quote`, `/us/generative-engine-optimization` are content-mirrors of `/`, `/web-design`, `/voice`, `/pricing`, `/pricing` (calculator), `/generative-engine-optimisation`. Without `hreflang`, Google may treat them as duplicate content and pick the wrong one for each market.

**Cursor prompt:**
```
[Global constraints apply.]

GOAL: Add hreflang annotations (en-GB ↔ en-US) on each mirror-pair.

STEPS:
1. In each `app/<route>/page.tsx` for /us/* pages, add to `metadata.alternates.languages`:
   { 'en-GB': 'https://scopesite.co.uk/<gb-equivalent>', 'en-US': 'https://scopesite.co.uk/us/<us-equivalent>', 'x-default': 'https://scopesite.co.uk/<gb-equivalent>' }
2. Mirror the same `alternates.languages` block on the GB-equivalent pages (/, /web-design, /voice, /pricing, /generative-engine-optimisation).
3. Mappings:
   /us → /
   /us/services → /web-design
   /us/ai-visibility → /voice
   /us/pricing → /pricing
   /us/quote → /pricing
   /us/generative-engine-optimization → /generative-engine-optimisation
4. Confirm Next.js renders the `<link rel="alternate" hreflang="...">` tags correctly in <head>.
5. Validate with `curl -s https://scopesite.co.uk/ | grep hreflang` and Ahrefs Site Audit on next crawl.

DO NOT TOUCH: existing canonical tags. Hreflang is additive.
SHOW DIFF before applying.
```

**Expected outcome:** Google geo-targets each variant correctly. No duplicate-content penalty risk for /us/* pages.

---

### 17. MEDIUM — H1 glued-words artefact
**Severity:** Medium. Several H1s have visual line-breaks via CSS but render as glued strings to crawlers, e.g. "WebsitesAI Can Actually Recommend", "WEBSITES THAT GET FOUNDBY GOOGLE AND BY AI", "SEO SOMERSET:BUILT FOR AI SEARCH". An LLM tokeniser sees "WebsitesAI" as a single token — breaks entity extraction.

**Cursor prompt:**
```
[Global constraints apply.]

GOAL: Insert literal whitespace (or a `<br/>`) at every visual line-break in H1s and H2s so crawler text reads naturally.

STEPS:
1. Grep for all `<h1>` and `<h2>` elements in app/. List every glued-word case.
2. For each, replace `<span>Websites</span><span>AI Can</span>` with `<span>Websites </span><span>AI Can</span>` (literal trailing space) OR insert `{' '}` JSX whitespace OR use `<br/>` if a linebreak is intended.
3. Confirm rendered text passes:
   `document.querySelector('h1').innerText.match(/[a-z][A-Z]/) === null` (no camelCase joins).
4. Visual styling stays identical (Tailwind `block` + responsive sizing handles wrap).

DO NOT alter layout/visual breaks. Only insert text-level spacing.
SHOW DIFF before applying.
```

**Expected outcome:** AI tokeniser reads each H1 as natural English, improving entity extraction.

---

### 18. MEDIUM — 4 external 4XX links + 4 external 3XX redirects from internal pages
**Severity:** Medium. Ahrefs `External 4XX` crawled=4, `External 3XX redirect` crawled=4. Probable culprits: blog posts with citations (Anthropic blog post, AI tooling links). E.g. /blog/geo-vs-seo-vs-aeo has 1 external 4XX; /blog/business-not-showing-up-ai-search has 1 external 4XX; /blog/first-page-google-somerset has 1 external 4XX; /blog/fired-like-dogs-trumps-war-on-anthropic has 2 external 4XX.

**Cursor prompt:**
```
[Global constraints apply.]

GOAL: Replace dead external citations and update 3XX-redirected URLs to their final destinations.

STEPS:
1. From Ahrefs Site Audit > External pages, export the 4 broken external URLs and the 4 redirected ones (Dan to paste into `.audit/external-links.csv` if not accessible to Cursor).
2. For each broken (4XX) external URL: either find the new location of the cited content (use web search) and update the link, or remove the link and replace with a non-linked citation, or use Wayback Machine archive URL. Edit the corresponding blog post source.
3. For each 3XX external URL: replace with the final destination URL (skip the redirect chain).
4. Keep nofollow / sponsored attributes where present.

DO NOT remove citations entirely — replace or update. Author trust requires sourced claims.
SHOW DIFF before applying.
```

**Expected outcome:** Zero external 4XX from internal pages. Cleaner outbound trust graph.

---

### 19. MEDIUM — IndexNow not wired up (44 pages flagged)
**Severity:** Medium. Ahrefs: `Pages to submit to IndexNow` notice crawled=44, change=+44. Bing's IndexNow protocol pushes URL changes to Bing/Yandex/Naver instantly. Microsoft Copilot uses Bing index — directly relevant for AI visibility.

**Cursor prompt:**
```
[Global constraints apply.]

GOAL: Implement IndexNow URL submission for all new and updated pages.

STEPS:
1. Generate an IndexNow API key (32-128 hex chars) — Cursor can use `crypto.randomUUID().replace(/-/g,'') + crypto.randomUUID().replace(/-/g,'')`.
2. Place the key file at `public/<key>.txt` containing only the key on a single line.
3. Create `app/api/indexnow/route.ts` POST handler that accepts `{ urls: string[] }` and forwards to `https://api.indexnow.org/indexnow` with body { host:'scopesite.co.uk', key:'<key>', keyLocation:'https://scopesite.co.uk/<key>.txt', urlList:[...] }.
4. Add a Vercel deploy hook OR a Next.js `revalidatePath`/`revalidateTag` callback that, on successful deploy, POSTs the changed URLs to /api/indexnow.
5. For the initial 44-page push, run a one-off `scripts/indexnow-bulk.ts` that submits the full sitemap once.
6. Document key location in README and store the key value in Vercel env var INDEXNOW_KEY.

DO NOT commit the key value to source. Only the public key-file at /public/<key>.txt.
SHOW DIFF before applying.
```

**Expected outcome:** Bing/Copilot index Scopesite changes within minutes, not days.

---

### 20. MEDIUM — Schema bloat (BusinessAudience/DefinedTermSet/Service on inappropriate pages)
**Severity:** Medium. Every page carries 9–14 schema graphs including some that don't belong (Service/Offer on privacy-policy, BusinessAudience on terms-and-conditions). Search engines may dampen the credibility of schema that's clearly reused-everywhere boilerplate.

**Cursor prompt:** Combined with item 4 fix above. Once item 4 is done, this clears.

---

### 21. LOW — Page-vs-SERP title mismatch (1 page)
Covered in item 10.

---

### 22. LOW — Vercel asset URLs being treated as crawlable
Covered in item 13.

---

### 23. LOW — Robots.txt changed warning
**Severity:** Low. Ahrefs flag indicates the file changed since last crawl. If intentional (e.g. recent llms.txt addition), no action. If unintentional, investigate. **Cursor prompt:** confirm by running `git log --diff-filter=AMD -- public/robots.txt app/robots.ts` and explain the change in the next deploy commit message.

---

### 24. LOW — DR 13 / Ahrefs Rank 12.6M (link velocity & E-E-A-T)
Mostly Dan-side (outreach, PR, directory submissions — see `fordantocomplete.md`). Code-side: ensure every blog post links to /about (author bio), every page links to /case-studies/h4tlt (proof), every service page links to /voice (product). **Cursor prompt:**
```
[Global constraints apply.]
GOAL: Strengthen internal-link graph for E-E-A-T.
STEPS:
1. In every blog post template, add a footer block "Written by Dan Cartwright, British Army veteran and founder of ScopeSite Digital Studios" with link to /about and JSON-LD Person schema with sameAs (LinkedIn, Companies House profile — Dan to provide URLs).
2. Every service page (/web-design, /voice, /ai-seo-services, /schema-markup, /generative-engine-optimisation, /answer-engine-optimisation) links to /case-studies/h4tlt within the proof section.
3. Every blog post links once to /voice as the conversion path.
SHOW DIFF before applying.
```

---

### 25. LOW — Accessibility hooks for AEO
**Severity:** Low (but high upside for AI extraction). LLMs use ARIA landmarks to identify page structure. **Cursor prompt:**
```
[Global constraints apply.]
GOAL: Ensure semantic HTML5 landmarks on every page: <header>, <nav>, <main id="main">, <article> for blog posts, <aside> for related-posts, <footer>.
STEPS:
1. Audit `app/layout.tsx` and per-route layouts. Confirm exactly one <main id="main"> per page.
2. Add a skip-link `<a href="#main" class="sr-only focus:not-sr-only">Skip to content</a>` as the first child of <body>.
3. Confirm every icon-only link has aria-label (LinkedIn, GitHub, X icons in footer).
4. Validate with axe-core via `pnpm dlx @axe-core/cli https://scopesite.co.uk/` — must report 0 critical issues.
SHOW DIFF before applying.
```

---

# DOCUMENT 2 — `fordantocomplete.md`

> Tasks Cursor cannot execute — they need Dan to action manually. Sorted by urgency of impact.

## Table of contents
1. [CRITICAL] Disavow toxic anchor-text spam in Google Search Console
2. [CRITICAL] Re-image the oversize Ghost-hosted blog feature image
3. [CRITICAL] Export the 44 internal 404 URLs from Ahrefs Site Audit
4. [CRITICAL] Confirm `www.scopesite.co.uk` DNS/SSL/Vercel domain config
5. [HIGH] Submit/verify in Bing Webmaster Tools and IndexNow
6. [HIGH] Update Google Business Profile with current trading name "ScopeSite Digital Studios"
7. [HIGH] Add `sameAs` URLs to Organization schema (LinkedIn, Companies House, X, Crunchbase)
8. [HIGH] Submit /sitemap.xml in Google Search Console + Bing Webmaster Tools
9. [HIGH] Manually validate the 8 schema-error pages in Google Rich Results + Schema.org validator
10. [HIGH] Identify the page-vs-SERP title mismatch
11. [MEDIUM] UK directory submissions (DR-building campaign)
12. [MEDIUM] Manual outreach for first-tier backlinks
13. [MEDIUM] Trademark V.O.I.C.E.™ if not already filed
14. [MEDIUM] File a Knowledge Panel claim for ScopeSite Digital Studios
15. [MEDIUM] Verify Brevo, Vercel, Cal.com, Stripe, Ghost CMS — outbound link health from agency dashboards
16. [LOW] Set up Ahrefs Rank Tracker properly (currently 7 keywords — too few)
17. [LOW] Add ScopeSite to "alternative SEO tools" listicles via outreach
18. [LOW] Set up Google Search Console + Bing Webmaster Tools alerts for crawl errors

---

### 1. [CRITICAL] Disavow toxic anchor-text spam
**Why it matters:** 5 of the top 10 anchors are clearly spam injections from SEO-tool spam platforms ("buyseolink.com", "shop.skylinkseo.com", "SeoZino.com", "iTxoft.com"). With only 65 referring domains, this is a measurable share of the link profile. Algorithmic trust will be dampened.

**What to do:**
1. Log into Google Search Console for `scopesite.co.uk`.
2. Tools & Reports → Disavow Tool.
3. Build a `disavow.txt` listing the spam domains:
```
domain:buyseolink.com
domain:shop.skylinkseo.com
domain:seozino.com
domain:itxoft.com
domain:fromewebdesign.com
```
   (Add any others identified by Ahrefs > Backlinks profile filtered by spam score.)
4. Upload to GSC. Acknowledge the warning.
5. Also file with Bing Webmaster Tools' disavow tool (separate UI).

**Time:** 30 minutes. **Impact:** Recover algorithmic trust within 60–90 days.

---

### 2. [CRITICAL] Re-image the oversize Ghost feature image
**Why it matters:** Ahrefs flags `Image file size too large` as Error severity. Slows LCP on the affected blog post.

**What to do:**
1. Identify the image — most likely `/blog/what-is-domain-authority` feature image.
2. In Ghost admin → Posts → that post → Replace feature image.
3. Upload a new version: max 1600×900px, WebP format, < 200 KB. Use Squoosh.app or similar.
4. Re-test PageSpeed on the post.

**Time:** 15 minutes. **Impact:** LCP improvement on affected page; image-too-large error clears.

---

### 3. [CRITICAL] Export the 44 internal 404 URLs
**Why it matters:** Cursor needs the actual list to fix them (item 1 in document 1). The Ahrefs MCP `where` filter failed during this audit.

**What to do:**
1. Log into Ahrefs Site Audit → Project: Scopesite → Internal pages → Filter `HTTP code = 404`.
2. Export all 44 URLs as CSV.
3. Save the CSV to the repo at `.audit/404-list.txt` (one URL per line).
4. Commit with message "audit: 44 internal 404s pending fix".

**Time:** 10 minutes. **Impact:** Unblocks Cursor on the highest-priority fix.

---

### 4. [CRITICAL] Confirm `www.scopesite.co.uk` DNS/SSL/Vercel config
**Why it matters:** Ahrefs sees `https://www.scopesite.co.uk/robots.txt` returning `http_code: 0` — meaning it failed (timeout/refused). The www. host needs to redirect cleanly to apex.

**What to do:**
1. Vercel dashboard → scopesite.co.uk project → Settings → Domains.
2. Confirm both `scopesite.co.uk` and `www.scopesite.co.uk` are added.
3. Confirm `www.scopesite.co.uk` is configured as "Redirect to scopesite.co.uk" (308 permanent).
4. Confirm SSL certs cover both hostnames.
5. Test: `curl -IL https://www.scopesite.co.uk/robots.txt` should return 308 → 200.

**Time:** 15 minutes. **Impact:** Robots.txt accessibility error clears; AI crawlers stop bouncing on www host.

---

### 5. [HIGH] Bing Webmaster Tools + IndexNow
**Why it matters:** Microsoft Copilot uses Bing's index. Most agencies skip Bing — easy AEO win.

**What to do:**
1. Sign in to Bing Webmaster Tools (bing.com/webmasters) with the same Microsoft account used for any Microsoft 365 / Azure resources.
2. Add property `scopesite.co.uk`.
3. Verify via DNS TXT record (Cursor can add the DNS record once you give the value, but you need to copy it from Bing first).
4. Submit `https://scopesite.co.uk/sitemap.xml`.
5. Generate an IndexNow key (Cursor will do this in code — see item 19 in document 1). Paste the key value back to you, you save it to Vercel env vars as `INDEXNOW_KEY`.

**Time:** 30 minutes. **Impact:** Bing/Copilot indexing accelerated. Direct AEO win for Microsoft AI surfaces.

---

### 6. [HIGH] Update Google Business Profile
**Why it matters:** Local pack & AI-Overview citations rely on GBP. Trading name change ("ScopeSite Ltd" → "ScopeSite Digital Studios") needs to be reflected.

**What to do:**
1. Sign into Google Business Profile at business.google.com.
2. Update name to "ScopeSite Digital Studios".
3. Confirm address (Beckington, Frome, Somerset).
4. Confirm primary category "Website Designer" + secondary "Marketing Agency".
5. Add the V.O.I.C.E.™ product, /case-studies/h4tlt as a featured post, recent blog posts as Updates.
6. Upload Dan's photo and 5+ recent project screenshots.
7. Verify the website URL is `https://scopesite.co.uk/` (not the old www. or Wix URL).

**Time:** 45 minutes. **Impact:** Local pack visibility, Google AI Overview citation eligibility.

---

### 7. [HIGH] Add `sameAs` URLs to Organization schema
**Why it matters:** AI knowledge graphs use `sameAs` to triangulate entity identity. Without it, ChatGPT may hallucinate unrelated "Scope" companies.

**What to do:**
1. Send Dan-controlled URLs to Cursor: LinkedIn company page, Companies House filing (https://find-and-update.company-information.service.gov.uk/company/16130355), X/Twitter account, Crunchbase profile, GitHub org if any, Trustpilot profile if any, Yell.com profile, Clutch profile, the old Wix legacy site (www.scopesite.co.uk content — only if you control it; otherwise skip).
2. Cursor adds them to the Organization JSON-LD `sameAs` array in the shared schema utility.

**Time:** 20 minutes (just collecting URLs). **Impact:** Knowledge graph coherence, AI citation accuracy.

---

### 8. [HIGH] Submit sitemap to Google Search Console
**Why it matters:** Even with a working sitemap, GSC needs the explicit submission. Same for Bing.

**What to do:**
1. GSC → Sitemaps → Add new sitemap → paste `sitemap.xml` → Submit.
2. Bing Webmaster Tools → Sitemaps → submit same URL.
3. Confirm status "Success" within 24 hours; check coverage report.

**Time:** 5 minutes. **Impact:** Faster discovery of new pages.

---

### 9. [HIGH] Manually validate the 8 schema-error pages
**Why it matters:** Cursor can fix once the errors are identified, but the validation tools don't have an MCP and must be run manually.

**What to do:**
1. For each of these URLs, run https://search.google.com/test/rich-results AND https://validator.schema.org/:
   - https://scopesite.co.uk/
   - https://scopesite.co.uk/pricing
   - https://scopesite.co.uk/voice
   - https://scopesite.co.uk/web-design
   - https://scopesite.co.uk/territory
   - https://scopesite.co.uk/us/pricing
   - https://scopesite.co.uk/case-studies/h4tlt
   - https://scopesite.co.uk/privacy-policy
   - https://scopesite.co.uk/terms-and-conditions
2. Copy each error message into a file `.audit/schema-errors.md` with the page URL and the error.
3. Commit so Cursor can use it as the source of truth for item 4 in document 1.

**Time:** 30 minutes. **Impact:** Unblocks the schema-fix prompt.

---

### 10. [HIGH] Identify the page-vs-SERP title mismatch
**Why it matters:** Cursor cannot see Google SERPs.

**What to do:**
1. GSC → Performance → Pages.
2. Click each top-impression URL and compare the listed title to the on-page `<title>` (use View Source).
3. The mismatched one is the culprit. Add to `.audit/serp-mismatches.md`.

**Time:** 20 minutes.

---

### 11. [MEDIUM] UK directory submissions
**Why it matters:** DR 13 needs raising. Quality UK directories are still effective for citation flow + local SEO.

**What to do:** Submit to (in priority order, with consistent NAP — Name, Address, Phone):
1. Yell.com (free listing).
2. Thomson Local.
3. Yelp UK.
4. Bark.com (lead-gen, but provides a citation).
5. Cylex UK.
6. FreeIndex.
7. Hotfrog UK.
8. UK Small Business Directory.
9. Companies House profile completeness check.
10. Clutch.co (agency-specific, requires verification).
11. Sortlist.
12. DesignRush.
13. ProvenExpert.
14. Trustpilot business account.
15. Google for Startups (if eligible — veteran-owned).
16. UK Government's "Buy Social" if eligible.

**Time:** 4 hours total over a week. **Impact:** +10–15 referring domains, DR + 2–3 over 90 days.

---

### 12. [MEDIUM] Manual outreach for first-tier backlinks
**Why it matters:** With DR 13 the ceiling on rankings for competitive AI-visibility queries is low. Need 5–10 DR 50+ links.

**What to do:**
1. Identify 20 UK SEO/marketing publications that cover AI search (Search Engine Journal UK, BrightonSEO speakers, Marketing Week, The Drum, Search Engine Land guest posts).
2. Pitch the H4TLT case study as an exclusive — "How we took a Somerset audiologist from 7 visitors a week to #1 cited on ChatGPT, Perplexity AND Google AIO in 4 months".
3. Pitch the "We audited 500 personal injury law firm websites" piece as a data exclusive to Legal Cheek, Above the Law, Lawyer Monthly.
4. Pitch the Anthropic/Trump piece (already published) — promote for citations rather than re-pitch.
5. Submit V.O.I.C.E. to ProductHunt, BetaList, Indie Hackers.
6. Apply to be a HARO/Connectively source on AI/SEO topics.

**Time:** 1 day pitch-writing + 30 min/day for 30 days follow-up. **Impact:** DR 13 → 25+ within 6 months if 5+ links land.

---

### 13. [MEDIUM] Trademark V.O.I.C.E.™
**Why it matters:** Currently using ™ (common-law). Registered ® gives stronger AI knowledge-graph entity identity and prevents competitors from using the term.

**What to do:**
1. Search the UK IPO database (gov.uk/search-for-trademark) for "VOICE" in classes 35 (advertising/business) and 42 (technical services).
2. If clear, file UK trademark application via gov.uk for ~£170 (one class) or £270 (two classes).
3. Optionally file EU and US (Madrid Protocol via WIPO) for broader protection.
4. Once registered, update all schema, llms.txt, marketing copy from ™ to ®.

**Time:** 2 hours for filing; 4–6 months for registration. **Impact:** Legal moat + entity disambiguation.

---

### 14. [MEDIUM] Knowledge Panel claim
**What to do:**
1. Search Google for "ScopeSite Digital Studios". If a Knowledge Panel appears, click "Claim this knowledge panel".
2. If no panel, build one by ensuring: Wikipedia mention (use the "We audited 500 law firms" data piece as a citation source for someone else's edit), Crunchbase profile, LinkedIn company page complete, X verified.

**Time:** 1 hour. **Impact:** Direct AI knowledge graph signal.

---

### 15. [MEDIUM] Verify outbound link health from third-party dashboards
- Brevo (transactional + marketing email): confirm domain authentication SPF/DKIM/DMARC.
- Vercel: confirm Pro plan, custom domain, image optimization budget.
- Cal.com: confirm /book embed allowlist includes scopesite.co.uk.
- Stripe: confirm /llm-brain product webhook endpoints respond 200.
- Ghost CMS: confirm headless API key has read-only scope.

**Time:** 1 hour. **Impact:** Prevents silent integration drift.

---

### 16. [LOW] Set up Ahrefs Rank Tracker properly
Currently tracking 7 keywords. Should be 30-50.

**What to do:** Add target keywords:
- ai visibility checker uk
- generative engine optimisation uk
- answer engine optimisation agency
- web design frome
- web design somerset
- web design bristol
- web design bath
- seo somerset
- seo frome
- seo bristol
- ai seo services uk
- ai seo agency uk
- schema markup services
- chatgpt seo uk
- perplexity seo uk
- v.o.i.c.e. methodology
- territory command ai visibility
- llm brain
- next.js web design uk
- veteran owned web design
- british army web designer
- ai-first web design
- ssr website agency uk
- jsonld services uk
- structured data agency uk
- ai visibility audit uk
- ai visibility scan
- get recommended by chatgpt
- domain authority uk
- ai content optimisation uk
- (plus the 12 location/service combos already tracked)

**Time:** 30 minutes. **Impact:** Visibility into competitive position.

---

### 17. [LOW] Outreach for "alternative AI visibility tools" listicle inclusion
**What to do:** Search Google for "best AI visibility tools 2026", "alternatives to Otterly", "alternatives to Peec AI". Email each author offering V.O.I.C.E. as an inclusion (with the 58p price-point as the hook). Provide a screenshot, 2-line description, link.

**Time:** 2 hours. **Impact:** 3–5 backlinks from comparison content.

---

### 18. [LOW] GSC + Bing alerts
**What to do:** GSC → Settings → enable email alerts for coverage issues. Bing Webmaster → similar. Configure Vercel Slack/email notifications for deploy failures.

**Time:** 10 minutes.

---

## Summary metrics

| Metric | Current | Target (90 days) |
|---|---|---|
| Ahrefs health score | 93 | 99 |
| URLs with errors | 44 | 0 |
| URLs with warnings | 19 | < 5 |
| 4XX pages | 44 | 0 |
| Domain Rating | 13 | 22+ |
| Live referring domains | 65 | 90+ |
| Organic keywords (GB) | 2 | 25+ |
| Organic traffic (GB) | 4 | 200+ |
| Schema validation errors | 9 | 0 |
| Mobile PageSpeed | 96 | maintain ≥96 |
| Desktop PageSpeed | 100 | maintain 100 |
| llms.txt published | No | Yes |
| IndexNow live | No | Yes |
| Hreflang on /us/* | No | Yes |
| Toxic anchors disavowed | No | Yes |

---

## Audit run notes (for transparency)
- Ahrefs MCP `site-explorer-top-pages`, `site-explorer-organic-keywords`, `site-explorer-referring-domains`, `site-explorer-organic-competitors`, `site-explorer-crawled-pages` all returned `error calling MCP tool` even with valid required `select` and `target` params during this run. Re-running them later may surface additional issues (e.g. lost backlinks list, broken-backlink list, organic-keyword cannibalisation). When those tools recover, re-run them and append findings as items 26+.
- The Site Audit was crawled on 2026-04-30 with status "In_progress" — final crawl may surface 1-2 additional notices.
- All counts and URLs in this audit are sourced directly from Ahrefs project 7358242 site-audit-issues and site-audit-page-explorer endpoints on 30 Apr 2026.
- Backlink-quality assessment is from the `site-explorer-anchors` top-10 sample (10 anchors, 6 spam-pattern); a full anchor sweep should be run once that endpoint stabilises.