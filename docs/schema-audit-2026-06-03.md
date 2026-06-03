# ScopeSite SSR — Full Per-Page Schema Audit

Date: 2026-06-03
Mode: READ ONLY. No code changed, nothing committed.
Scope: every JSON-LD source in the repo, mapped to the routes it reaches.

---

## TL;DR (the three things that matter)

1. **A self-referential `aggregateRating` (5.0, ratingCount 6, reviewCount 6) rides the global `Organization` node onto every single route.** It is defined once in [`src/lib/schema.ts`](../src/lib/schema.ts) line 349 and injected by the root layout [`src/app/layout.tsx`](../src/app/layout.tsx) line 142. Real, individually visible reviews are rendered on only **two** pages: the homepage (`/`, 6 Google reviews) and `/case-studies/h4tlt` (1 testimonial). Every other indexable route carries the rating with no reviews on the page. This is the compliance risk.
2. **`@id` collisions with conflicting content.** `#organization` is re-declared with different data on all `/us/*` pages and on `/case-studies/h4tlt`. `#dan-cartwright` is re-declared on `/case-studies/h4tlt`. `/glossary#set` is declared with two different names by two different builders.
3. **`/aeo` and `/geo` are the glossary pages** `/glossary/answer-engine-optimisation` and `/glossary/generative-engine-optimisation` (MDX-backed). At page level they already emit the correct definition profile (WebPage + DefinedTerm + DefinedTermSet + Article + ImageObject). Their only problem is the inherited commercial `Organization` + `aggregateRating`. The separate commercial routes `/answer-engine-optimisation` and `/generative-engine-optimisation` are Service landing pages and are a different thing.

`eligibleCustomerType`: **zero matches anywhere.** Confirmed genuinely gone.

---

## STEP 1 — Schema source inventory

### Injector
- [`src/components/JsonLd.tsx`](../src/components/JsonLd.tsx) — server component, renders one `<script type="application/ld+json">`. Arrays are wrapped in `@context` + `@graph`. SSR confirmed (no client-only injection anywhere).

### ROOT LAYOUT — inherited by ALL routes
- [`src/app/layout.tsx`](../src/app/layout.tsx) lines 131-142 injects five nodes on every route:
  - `Organization` (`@id #organization`, multi-typed `Organization, LocalBusiness, ProfessionalService`) — carries `aggregateRating`, `hasOfferCatalog` (3 Offers), `priceRange`, nested founder `Person #dan-cartwright`, `#logo`, `#hero-image`, brands, certifications, `knowsAbout`.
  - `WebSite` (`@id #website`, with `SearchAction`)
  - `DefinedTermSet` (`@id #voice-methodology`, + 5 `DefinedTerm` `#voice-*`)
  - `BusinessAudience` (`@id #target-audience`)
  - `ScheduleAction`
  - All produced by generators in `src/lib/schema.ts`.

### HELPER / CONFIG MODULES
- [`src/lib/schema.ts`](../src/lib/schema.ts) — the central generator library (Organization, WebPage, Service, FAQ, Breadcrumb, Article, BlogPosting, Glossary builders, pricing offers, etc.).
- [`src/lib/territory/schema-jsonld.ts`](../src/lib/territory/schema-jsonld.ts) — hand-built graph for `/territory`.
- [`src/lib/glossary-db.ts`](../src/lib/glossary-db.ts) — glossary term data (DB + static seed).
- [`src/lib/glossary-mdx.ts`](../src/lib/glossary-mdx.ts) — MDX article frontmatter loader (feeds the glossary article graph).

### NOT page JSON-LD (decorative or non-schema — flagged so they are not mistaken for live schema)
- `src/components/animations/CodeBlock.tsx`, `SchemaVisualization.tsx`, `VoiceSchemaDemo.tsx` — display schema as on-screen illustration; not emitted to the document head.
- `src/app/schema-markup/page.tsx` line 160 — the string "Review and AggregateRating" is UI copy in a feature list, not emitted schema.
- `src/app/.well-known/ai-context.json/route.ts` — separate AI context endpoint, not page JSON-LD.

### SEGMENT / PAGE level sources
Each route adds schema via its own `layout.tsx` or `page.tsx`. Full list in the matrix below.

---

## STEP 2 — Master route matrix

Legend for "Purpose": C = commercial, T = content, G = glossary, U = utility.
Every row **also** inherits the 5 root-layout nodes (Organization+LocalBusiness+ProfessionalService with aggregateRating/OfferCatalog/priceRange, WebSite, DefinedTermSet #voice-methodology, BusinessAudience, ScheduleAction). "Reviews visible?" refers to real individually displayed customer reviews on that page.

- `/` — C/T — WebPage(#webpage), FAQPage(7Q), Service x5 (by @id), Review x6, BreadcrumbList — src: `app/page.tsx` — **Reviews visible: YES (6)**
- `/about` — T — AboutPage(#webpage), ImageObject(headshot), BreadcrumbList — `app/about/page.tsx` — Reviews: NO
- `/accessibility-statement` — U — WebPage, BreadcrumbList — `app/accessibility-statement/page.tsx` — NO
- `/ai-seo-agency` — C — WebPage, FAQPage, Service(+offers 750/500), BreadcrumbList — `app/ai-seo-agency/layout.tsx` — NO
- `/ai-seo-services` — C — WebPage, FAQPage, Service(+offers), BreadcrumbList — `app/ai-seo-services/layout.tsx` — NO
- `/ai-visibility` — C — WebPage, FAQPage, Service, BreadcrumbList — `app/ai-visibility/layout.tsx` — NO
- `/ai-website-design` — C — WebPage, FAQPage, Service(+AggregateOffer range), BreadcrumbList — `app/ai-website-design/layout.tsx` — NO
- `/answer-engine-optimisation` — C — WebPage, FAQPage(9Q visible), Service(#service, offers 750/500), BreadcrumbList — `app/answer-engine-optimisation/layout.tsx` — NO
- `/generative-engine-optimisation` — C — WebPage, FAQPage(8Q visible), Service(#service, offers 750/500), BreadcrumbList — `app/generative-engine-optimisation/layout.tsx` — NO
- `/blog` — T — Blog(#blog), CollectionPage, ItemList, BreadcrumbList — `app/blog/page.tsx` — NO
- `/blog/[slug]` — T — WebPage, BlogPosting(#article, +FAQPage/HowTo conditional), BreadcrumbList — `app/blog/[slug]/page.tsx` — NO
- `/book` — U — ContactPage(#webpage), BreadcrumbList — `app/book/layout.tsx` — NO
- `/brief` — U — WebPage, BreadcrumbList — `app/brief/page.tsx` — NO
- `/case-studies` — T — CollectionPage, ItemList, BreadcrumbList — `app/case-studies/page.tsx` — NO
- `/case-studies/h4tlt` — T — own @graph: Organization(#organization RE-DECLARED), Person(#dan-cartwright RE-DECLARED), Organization(H4TLT), Service, 2x ScholarlyArticle, WebPage, Article, Review(1), FAQPage(5Q visible), BreadcrumbList — `app/case-studies/h4tlt/layout.tsx` — **Reviews visible: YES (1)**, but aggregateRating claims 6
- `/glossary` — G — DefinedTermSet(`/glossary#set`) — `app/glossary/page.tsx` — NO
- `/glossary/answer-engine-optimisation` ("/aeo") — G — WebPage(#webpage), DefinedTerm(#term), DefinedTermSet(`/glossary#set`), Article(#article), ImageObject(#primaryimage) — `app/glossary/[slug]/page.tsx` (MDX path) — NO
- `/glossary/generative-engine-optimisation` ("/geo") — G — same as above — `app/glossary/[slug]/page.tsx` (MDX path) — NO
- `/glossary/[other DB slugs]` (json-schema, structured-data, schema-markup, ai-overviews, featured-snippet, query-fan-out, ai-mode, schema, indexed, search-engine-optimisation, ai-answer, ai-citation, llms-txt, robots-txt-for-ai-bots) — G — single DefinedTerm(#term) only — `app/glossary/[slug]/page.tsx` (DB path) — NO
- `/llm-brain` — C — Product(#product, +offers), FAQPage, WebPage, BreadcrumbList — `app/llm-brain/layout.tsx` — NO
- `/llm-brain/order-confirmed` — U — inherited only — `app/llm-brain/order-confirmed/layout.tsx` — NO
- `/pricing` — C — WebPage, Service(#service, 14 offers), WebApplication(Quote Calculator, 14 offers), BreadcrumbList — `app/pricing/page.tsx` — NO
- `/privacy-policy` — U — WebPage, BreadcrumbList — `app/privacy-policy/page.tsx` — NO
- `/recruitment-website-design` — C — WebPage, Service, FAQPage, BreadcrumbList — `app/recruitment-website-design/page.tsx` — NO
- `/schema-markup` — C — WebPage, FAQPage, Service(+offers), BreadcrumbList — `app/schema-markup/layout.tsx` — NO
- `/search` — U — inherited only — `app/search/page.tsx` — NO
- `/seo-bristol`, `/seo-frome`, `/seo-somerset` — C — WebPage+FAQPage, FAQPage, Service(local), LocalBusiness(#local-business), BreadcrumbList — `app/seo-*/layout.tsx` — NO
- `/services` — C — WebPage, BreadcrumbList — `app/services/page.tsx` — NO
- `/terms-and-conditions` — U — WebPage, BreadcrumbList — `app/terms-and-conditions/page.tsx` — NO
- `/territory` — C — WebPage, Service(#service, 4 offers), FAQPage, BreadcrumbList — `lib/territory/schema-jsonld.ts` via `app/territory/page.tsx` — NO
- `/territory/apply`, `/territory/confirmed`, `/territory/waitlist-confirmed` — U — inherited only — NO
- `/voice` — C — Service(#service, offers), HowTo, ImageObject(#voice logo), WebPage, SoftwareApplication(#voice-scanner), FAQPage, BreadcrumbList — `app/voice/layout.tsx` — NO
- `/web-apps` — C — WebPage, Service(#service), Service(anon, AggregateOffer £2000-8000), BreadcrumbList — `app/web-apps/layout.tsx` — NO
- `/web-design` — C — ProfessionalService(#service), FAQPage, WebPage, BreadcrumbList — `app/web-design/layout.tsx` — NO
- `/web-design-bath`, `-bristol`, `-burnham-on-sea`, `-frome`, `-glastonbury`, `-shepton-mallet`, `-somerset`, `-trowbridge`, `-warminster`, `-westbury` — C — WebPage+FAQPage, FAQPage, Service(local), LocalBusiness(#local-business), BreadcrumbList — `app/web-design-*/layout.tsx` — NO
- `/us` — C — Service(#service), Organization(#organization RE-DECLARED, USD), BreadcrumbList — `app/us/layout.tsx` — NO
- `/us/ai-visibility` — C — WebPage+FAQPage, Service, Organization(#organization RE-DECLARED), BreadcrumbList — `app/us/ai-visibility/layout.tsx` — NO
- `/us/generative-engine-optimization` — C — WebPage+FAQPage, Service, Organization(#organization RE-DECLARED), BreadcrumbList — `app/us/generative-engine-optimization/layout.tsx` — NO
- `/us/pricing` — C — WebPage+FAQPage, 3x Offer, Organization(#organization RE-DECLARED), ItemList, BreadcrumbList — `app/us/pricing/layout.tsx` — NO
- `/us/quote` — C — WebPage, Organization(#organization RE-DECLARED), BreadcrumbList — `app/us/quote/layout.tsx` — NO
- `/us/services` — C — WebPage+FAQPage, Service(local, USD offers 2500/8000/2000), Organization(#organization RE-DECLARED), BreadcrumbList — `app/us/services/layout.tsx` — NO
- `/portal/*`, `/territory/admin/*` — U — inherited only (noindex app areas) — NO

---

## STEP 3 — aggregateRating sweep (PRIORITY)

**Single source of `aggregateRating`:** `generateOrganizationSchema()` at [`src/lib/schema.ts`](../src/lib/schema.ts) lines 349-356:

```
aggregateRating: { '@type': 'AggregateRating', ratingValue: '5', bestRating: '5', worstRating: '1', ratingCount: '6', reviewCount: '6' }
```

**Injection point:** [`src/app/layout.tsx`](../src/app/layout.tsx) line 142 (root layout) — therefore present on **100% of routes**.

**`Review` nodes (separate from aggregateRating):**
- `/` (homepage) — `generateReviewsSchema(googleReviews)`, [`app/page.tsx`](../src/app/page.tsx) line 133. 6 reviews, all visibly rendered. OK.
- `/case-studies/h4tlt` — one `Review` (Mark Ashmore), [`app/case-studies/h4tlt/layout.tsx`](../src/app/case-studies/h4tlt/layout.tsx) lines 178-196. Visibly rendered as a testimonial. OK in isolation.

**Pages where `aggregateRating` is present but reviews are NOT displayed (the risk set):**
Every indexable route **except `/`**. That includes all commercial pages (`/pricing`, `/voice`, `/web-design`, `/web-design-*`, `/seo-*`, `/ai-*`, `/answer-engine-optimisation`, `/generative-engine-optimisation`, `/territory`, `/llm-brain`, `/web-apps`, `/us/*`), all content pages (`/about`, `/blog`, `/blog/*`, `/case-studies`, `/glossary`, `/glossary/*`), and all utility pages (`/book`, `/brief`, `/terms-and-conditions`, `/privacy-policy`, `/accessibility-statement`, `/search`, etc.).

Special case: `/case-studies/h4tlt` displays 1 review but the inherited `aggregateRating` asserts `ratingCount 6` / `reviewCount 6`, which do not correspond to anything countable on that page.

---

## STEP 4 — Schema-vs-page mismatch list, ranked by risk

1. **[COMPLIANCE — highest] Sitewide `aggregateRating` with no on-page reviews.** ~all routes except `/`. Source: `schema.ts:349` via `layout.tsx:142`. Google's review-snippet policy requires the rated content and reviews to be on the same page.
2. **[DUPLICATE @id] `#organization` declared with conflicting content.**
   - Root layout: rich UK Organization, GBP, `aggregateRating`, OfferCatalog, `addressCountry GB`, `telephone +441373311339`, `foundingDate 2024-12-01`.
   - `generateUSOrganizationSchema()` on `/us`, `/us/quote`, `/us/services`, `/us/ai-visibility`, `/us/generative-engine-optimization`, `/us/pricing`: USD, US `areaServed`, no rating — **same `@id`, emitted alongside the root version on the same page.**
   - `app/case-studies/h4tlt/layout.tsx` lines 64-90: slim Organization, `addressLocality Beckington`, `addressCountry UK`, `telephone 01373 311339`, `foundingDate 2024`, no rating — **same `@id`, conflicts with the root version on that page.**
3. **[DUPLICATE @id] `#dan-cartwright` conflicting.** Full founder Person (root, nested in Organization) vs slim Person in `app/case-studies/h4tlt/layout.tsx` lines 92-98.
4. **[DUPLICATE @id] `/glossary#set` conflicting name.** `generateGlossaryDefinedTermSetSchema` / `generateGlossaryDefinedTermSchema` name it "ScopeSite Web & Marketing Glossary" (index + DB term path); `generateGlossaryArticleGraph` names it "ScopeSite Digital Studios Glossary" (MDX article path). Same `@id`, different `name`/`publisher`.
5. **[MISMATCH] Commercial schema on non-commercial pages.** `Organization`+`LocalBusiness`+`ProfessionalService`+`hasOfferCatalog`+`priceRange` land on every content/glossary/utility page via the root layout: `/about`, `/blog`, `/blog/*`, `/case-studies`, `/glossary`, `/glossary/*`, `/privacy-policy`, `/terms-and-conditions`, `/accessibility-statement`, `/search`, `/book`, confirmation pages.
6. **[UNDERSPEC] Glossary structure gaps.**
   - DB-only glossary term pages emit a single bare `DefinedTerm` (no WebPage, Article, or BreadcrumbList).
   - Glossary index `/glossary` emits only `DefinedTermSet`; missing `CollectionPage`, `ItemList`, `BreadcrumbList` (the Phase 2 target).
   - MDX glossary `Article` has `datePublished` only — no `dateModified`; WebPage uses `mainEntity` (Phase 2 wants `about`) and lacks `inLanguage`.
7. **[MINOR] `/web-apps` anonymous Service.** `customSsrWebAppsServiceSchema` ([`app/web-apps/layout.tsx`](../src/app/web-apps/layout.tsx) lines 80-100) has no `@id` and an inline `provider` Organization (name only) instead of referencing `#organization`; carries an `AggregateOffer` £2000-8000. Verify against the page's visible pricing.
8. **[VERIFY] US-page prices.** `/us/services` LocalService offers (USD 2500/8000/2000) and `/us/pricing` Offers should be checked against the visible USD prices on those pages.

**Checks that PASSED:**
- `eligibleCustomerType`: zero matches. Confirmed removed.
- Relative / non-resolving URLs in schema: none. All `logo`, `image`, OG, glossary feature images and `sameAs` entries are absolute `https://...`. (Deleted Wikidata entity is commented out, not emitted.)
- Orphan `FAQPage` (no visible Q&A): none found. Every emitted `FAQPage`/FAQ set corresponds to visible Q&A (landing pages, `/territory`, `/case-studies/h4tlt`, blog conditional).

---

## STEP 5 — Specific pages, called out

- **Homepage `/`** — sitewide nodes + WebPage(#webpage, speakable) + FAQPage(7 visible Q) + 5 Service refs + 6 Review (visible) + Breadcrumb. The only page where the inherited `aggregateRating` is backed by visible reviews.
- **`/pricing`** — Commercial. WebPage + Service(14 offers) + WebApplication(14 offers) + Breadcrumb. Prices read from `PRICING_CONFIG`/`VOICE_SPEC`. Inherited aggregateRating not backed by reviews here.
- **`/voice`** — Commercial. Service(+offers) + HowTo + ImageObject + WebPage + SoftwareApplication(#voice-scanner) + FAQPage + Breadcrumb.
- **`/web-apps`** — Commercial. WebPage + Service(#service) + a second anonymous Service with AggregateOffer £2000-8000 + Breadcrumb. See mismatch #7.
- **`/web-design`** — Commercial. ProfessionalService(#service) + FAQPage + WebPage + Breadcrumb.
- **`/answer-engine-optimisation`** — **Commercial Service page** (NOT a definition page). WebPage + FAQPage(9 visible Q incl. a pricing answer) + Service(#service, £750 setup + £500/mo) + Breadcrumb.
- **`/generative-engine-optimisation`** — **Commercial Service page.** Same shape as above.
- **`/about`** — Content. AboutPage(#webpage) + ImageObject(headshot) + Breadcrumb. Inherits commercial Organization + aggregateRating.
- **Glossary `/glossary`** — DefinedTermSet only.
- **`/glossary/answer-engine-optimisation` ("/aeo")** and **`/glossary/generative-engine-optimisation` ("/geo")** — **Definition pages.** Each emits WebPage(#webpage) + DefinedTerm(#term) + DefinedTermSet(`/glossary#set`) + Article(#article, author `#dan-cartwright` and publisher `#organization` by @id reference, `about` #term, `datePublished` only) + ImageObject(#primaryimage). No FAQPage (no visible Q&A on these pages). **Correct at page level; the only defect is the inherited commercial Organization + aggregateRating.**

**Plain statement on AEO/GEO:** there are two AEO and two GEO surfaces. `/answer-engine-optimisation` and `/generative-engine-optimisation` are **commercial Service pages**. `/glossary/answer-engine-optimisation` and `/glossary/generative-engine-optimisation` are **definition (glossary) pages** and are the "/aeo" and "/geo" referenced for Phase 2. They are MDX-backed; all other glossary slugs are DB-only and render a bare `DefinedTerm`.

---

## Appendix — Phase 2 precondition: current glossary builder

Per the instruction to confirm the existing builder before extending it, here is the current source, its call sites, and its inputs. **Nothing here is changed.**

### Source: `generateGlossaryArticleGraph()` — `src/lib/schema.ts` lines 486-574

Inputs:
- `frontmatter: GlossaryArticleSchemaInput` = `{ term, slug, alternateName?, definition, featureImage, featureAlt, relatedSlugs, citations, publishDate }`
- `mentionTerms: GlossaryTerm[]`

Emits an array (no `@context`; the `JsonLd` component adds it):
- `WebPage` — `@id [pageUrl]#webpage`, `isPartOf #website`, `primaryImageOfPage #primaryimage`, `mainEntity #term`, `relatedLink[]`.
- `DefinedTerm` — `@id [pageUrl]#term`, `name`, optional `alternateName`, `description`, `inDefinedTermSet /glossary#set`.
- `DefinedTermSet` — `@id /glossary#set`, name "ScopeSite Digital Studios Glossary", `publisher #organization`.
- `Article` — `@id [pageUrl]#article`, `headline`, `author { @id #dan-cartwright }`, `publisher { @id #organization }`, `image #primaryimage`, `about #term`, `datePublished`, `speakable`, `citation[]`, `mentions[]`.
- `ImageObject` — `@id [pageUrl]#primaryimage`, absolute `url`/`contentUrl`, width 1200 x height 630.

Soundness notes (for the extend decision):
- Organization and Person are **already @id references only** — good, no full re-declaration.
- No `aggregateRating`, `Offer`, `OfferCatalog`, `LocalBusiness`, `ProfessionalService`, or `priceRange` in the builder — good.
- No hardcoded prices or commercial data — good.
- Gaps vs the Phase 2 target (the ~10%): no `dateModified`; no `inLanguage` on WebPage; no `BreadcrumbList`; no optional `FAQPage`; WebPage links the term via `mainEntity` rather than `about`; `/glossary#set` name differs from the index builder (duplicate-@id issue #4 above).

Conclusion: the builder is sound and worth extending. A second parallel builder is not justified.

### Call sites
- `src/app/glossary/[slug]/page.tsx` line 80 — MDX path, calls `generateGlossaryArticleGraph(article.frontmatter, article.matchedTerms)`.
- `src/app/glossary/[slug]/page.tsx` line 104 — DB path, calls `generateGlossaryDefinedTermSchema(term)` (single DefinedTerm, the under-specified case).
- `src/app/glossary/page.tsx` line 58 — index, calls `generateGlossaryDefinedTermSetSchema(terms)`.

### Frontmatter availability for new fields
MDX frontmatter ([`content/scopesite-intel-deck/answer-engine-optimisation.mdx`](../content/scopesite-intel-deck/answer-engine-optimisation.mdx)) provides `publishDate` but **no `dateModified`** field yet. Adding `dateModified` to the builder will require either a new frontmatter field or a sensible fallback. Flagging as a decision for Phase 2.

---

## Decisions still needed before Phase 2 build (from earlier exchange)

- **Inheritance fix mechanism** (how glossary pages stop carrying the sitewide `Organization` + `aggregateRating`) — not yet chosen. The `aggregateRating` decision itself is reserved by you and is out of scope for this work.
- **Builder extension** — agreed in principle (extend, do not duplicate), pending your "go" after reviewing the source above.
