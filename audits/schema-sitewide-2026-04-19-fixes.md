# Schema sitewide find-fix log — 2026-04-19

Rolling audit for live-fetch + MCP validation fixes (`project-0-scopesite-ssr-schema-org`).  
Commits target `main`; schema fixes committed per route when code changed. This file committed after Batch 1 + Batch 2 per plan.

---

## Batch 1 — Core + conversion (`/` … `/web-apps`)

### `/` (homepage)

**Commit:** `c74fb93`  
**Before:** Duplicate `@id` `https://scopesite.co.uk/#hero-image` across two `application/ld+json` payloads (root layout `Organization.image` + homepage `JsonLd`). Prior MCP on flattened nodes: **0 errors**, **0 warnings** (suggestions only).  
**After:** Live HTML: single canonical `#hero-image` under `Organization.image`.

**Auto-fixes applied:**
- Removed standalone `heroImageSchema` from `src/app/page.tsx`; dropped unused `generateImageObjectSchema` import.

**Flag-only:** MCP low suggestions; `SearchAction` `query-input` (Google pattern — no change).

---

### `/about`

**Commit:** _(none — no code changes)_  
**Before / after:** Live fetch + MCP spot on `AboutPage`, `BreadcrumbList`, `ImageObject` (headshot): **0 errors**, **0 warnings**; no duplicate `@id` vs org `#hero-image` / founder pattern requiring change.

**Auto-fixes applied:** —  
**Flag-only:** MCP optional-field suggestions as applicable.

---

### `/pricing`

**Commit:** _(none)_  
**Before / after:** `WebPage`, `Service`, `Offer` ×3, `ItemList`, `BreadcrumbList` — MCP spot on representative `Offer` with range string price: **valid**, **0 errors**, **0 warnings**.

**Auto-fixes applied:** —  
**Flag-only:** Completeness suggestions only.

---

### `/brief`

**Commit:** _(none)_  
**Before / after:** `BreadcrumbList` + `WebPage` only — **0 errors**, **0 warnings** on spot validation.

**Auto-fixes applied:** —  

---

### `/book`

**Commit:** `d7c9896`  
**Before:** Root layout already emits `generateScheduleActionSchema()`; `/book` layout repeated the same standalone `ScheduleAction` in a second JSON-LD document (redundant with `Organization.potentialAction` booking pattern).  
**After:** Live HTML after deploy: `"@type":"ScheduleAction"` occurrence count reduced vs prior; page `JsonLd` contains breadcrumb + `ContactPage` only.

**Auto-fixes applied:**
- Removed `generateScheduleActionSchema` from `src/app/book/layout.tsx` `JsonLd` and import list.

**Flag-only:** `ContactPage` image suggestion (MCP).

---

### `/web-apps`

**Commit:** _(none)_  
**Before / after:** `WebPage`, `Service`, `BreadcrumbList` — spot MCP **valid**, **0 errors**, **0 warnings**.

**Auto-fixes applied:** —  

---

## Gate C — Batch 1 summary

- **Routes covered:** `/` (prior), `/about`, `/pricing`, `/brief`, `/book`, `/web-apps`.
- **Commits in this batch (new work):** `d7c9896` (`/book` only; `/` was `c74fb93` earlier).
- **Auto-fix count:** **1** (duplicate `ScheduleAction` on `/book`).
- **Flag-only / no fix:** Low MCP noise on several routes; no CONFIRM-FIX items.
- **Template note:** None triggered (no same issue ≥3 routes in this batch).

---

## Batch 2 — Case studies + territory

### `/case-studies`

**Commit:** _(none)_  
**Before / after:** `CollectionPage`, `ItemList`, `BreadcrumbList` — spot validation clean; ItemList `Article` `@id`s already use `.../h4tlt/#article` form.

**Auto-fixes applied:** —  

---

### `/case-studies/h4tlt`

**Commit:** `8f01fe2`  
**Before:** A `Service` used `@id` `https://scopesite.co.uk/#voice-methodology`, colliding with the root layout **DefinedTermSet** same `@id` (different `@type`). `WebPage` / `Article` / `FAQPage` used `.../h4tlt#fragment` without slash before `#`, inconsistent with the case-studies index `Article` `@id`s.  
**After:** Live HTML contains `methodology-service` fragment; MCP `validate_jsonld_batch` on representative nodes: **0 errors**, **0 warnings**.

**Auto-fixes applied:**
- `Service` → `@id` `https://scopesite.co.uk/case-studies/h4tlt/#methodology-service`.
- `WebPage`, `Article`, `FAQPage` → `.../h4tlt/#...`; updated `Article` `isPartOf` / `mainEntityOfPage` refs.

**Flag-only:** Image / name suggestions on truncated MCP samples.

---

### `/territory`

**Commit:** `8bb330c`  
**Before:** All territory entity `@id`s used `https://scopesite.co.uk/territory#...` (no slash before fragment), inconsistent with sitewide `.../path/#fragment` pattern.  
**After:** After ISR/cache window, live HTML contains `territory/#webpage` style `@id`s.

**Auto-fixes applied:**
- Normalised `${TERRITORY_URL}#…` → `${TERRITORY_URL}/#…` in `src/lib/territory/schema-jsonld.ts` (WebPage, breadcrumb ref, BreadcrumbList, Service, Offer refs, Offer, FAQPage).

**Flag-only:** —  

---

## Gate C — Batch 2 summary

- **Routes:** `/case-studies`, `/case-studies/h4tlt`, `/territory`.
- **Commits:** `8f01fe2`, `8bb330c`.
- **Auto-fixes:** **2** (H4TLT `@id` collision + path consistency; territory `@id` consistency).
- **Template-level:** None flagged for pause (territory is single helper; one commit).

---

## Batch 3 — Legal + blog index

**Shared commit:** `91048b6` (`src/lib/schema.ts`) — applies to all four routes below.

### `/terms-and-conditions`, `/privacy-policy`, `/accessibility-statement`

**Commit:** `91048b6` (helper)  
**Before:** `BreadcrumbList` used `@id` `…/path#breadcrumb` while `WebPage` used `…/path/#webpage` and pointed `breadcrumb` at `…/path#breadcrumb` — fragment segment inconsistent with the slash-before-`#` pattern used elsewhere.  
**After:** Live HTML: `terms-and-conditions/#breadcrumb` present (grep count **4** on fetched page); **0** matches for legacy `terms-and-conditions#breadcrumb` substring.

**Auto-fixes applied (via helpers):**
- `generateBreadcrumbSchema`: `@id` → `${pageUrl}/#breadcrumb`.
- `generateWebPageSchema`: `breadcrumb` ref → `${pageUrl}/#breadcrumb`.

**Flag-only:** MCP low suggestions on sample `WebPage` + `BreadcrumbList` pairs.

---

### `/blog`

**Commit:** `91048b6` (helper)  
**Before / after:** Index graph (`BreadcrumbList`, `Blog`, `CollectionPage`, `ItemList`) uses the same breadcrumb helpers; **no separate page edits.** Live/build unchanged beyond helper.

**Auto-fixes applied:** Same as above for `BreadcrumbList` on `/blog`.

**Flag-only:** —  

---

## Gate C — Batch 3 summary

- **Routes:** `/terms-and-conditions`, `/privacy-policy`, `/accessibility-statement`, `/blog`.
- **Commits:** **1** — `91048b6` (shared `schema.ts` fix; no per-route-only commits).
- **Auto-fixes:** Breadcrumb / `WebPage` `@id` alignment sitewide for these generators.
- **Template-level:** Intentional single-helper change (same pattern as territory slash pass).

---

## Batch 4 — National service landings

**Shared commit:** `91048b6` — all seven routes use `generateLandingPageSchema` and/or `generateWebPageSchema`; no layout-only edits required.

| Route | Source | Notes |
|--------|--------|--------|
| `/ai-seo-agency` | `generateLandingPageSchema` | Post-deploy: `ai-seo-agency/#webpage` substring present; bare page URL as sole `WebPage` `@id` **removed**. |
| `/ai-seo-services` | same | Covered by helper. |
| `/ai-visibility` | same | Covered by helper. |
| `/ai-website-design` | same | Covered by helper. |
| `/answer-engine-optimisation` | same | Covered by helper. |
| `/schema-markup` | same | Covered by helper. |
| `/llm-brain` | `generateWebPageSchema` + product | Breadcrumb + `WebPage` via updated helper. |

**Auto-fixes applied:** `generateWebPageFAQPageSchema`: `WebPage` `@id` was the bare page URL; now `${pageUrl}/#webpage` with matching `breadcrumb` ref. Aligns with `Service` `@id` `…/#service` and `BreadcrumbList`.

**Flag-only:** MCP image / completeness suggestions on spot checks.

---

## Gate C — Batch 4 summary

- **Routes:** `/ai-seo-agency` … `/llm-brain` (7 national landings).
- **Commits:** **0** additional (included in `91048b6` with Batch 3).
- **Live verification:** `/terms-and-conditions` and `/ai-seo-agency` fetched post-deploy; new `@id` patterns confirmed.

---

## Batch 5 — `/web-design` hub + 10 local `web-design-*` routes

**Shared commit:** `6f8c8c0` — `src/lib/schema.ts` (`generateLocalBusinessSchema`), **all 10** `web-design-*/layout.tsx`, and `src/app/web-design/layout.tsx` (speed-test `@id`).

### Cross-cutting fix (3+ routes): `LocalBusiness` `@id` collision

**Before:** `generateLocalBusinessSchema` emitted `@id` `https://scopesite.co.uk/#local-<city>` (e.g. `#local-bristol`). **Different landings** (`/web-design-bristol` vs `/seo-bristol`) **shared the same apex `@id`**, which is invalid when both pages ship JSON-LD.

**After:** `@id` → **`${pageCanonical}/#local-business`** and **`url`** → that landing’s canonical URL. All local web-design layouts pass **`PAGE_URL`**.

### `/web-design` hub (speed test)

**Before:** `WebApplication` used `@id` `https://scopesite.co.uk/web-design#speed-test` (no slash before `#`).  
**After:** `https://scopesite.co.uk/web-design/#speed-test`. Live HTML verified post-deploy.

### Per-route validation (live + MCP)

- **`/web-design`:** Prior hub work (`8a0ad61` area) unchanged except speed-test fragment; MCP spot: **0 errors**, **0 warnings** beyond LOW suggestions.
- **`/web-design-bath` … `/web-design-westbury`:** No per-city postal/geo edits needed (HQ Frome `BA11` / coords intentional in helper). **ServiceChannel** URLs unchanged (`generateServiceChannels` shared). Live check: **`web-design-bristol/#local-business`** present; legacy **`#local-bristol`** on apex **absent** after deploy.

**Flag-only:** `generateWebPageFAQPageSchema` still does not embed FAQ entities in the returned object (pre-existing); not changed (CONFIRM-FIX / content scope).

---

## Gate C — Batch 5 summary

- **Routes:** `/web-design` + 10 local `web-design-*` pages.
- **Commits:** **1** — `6f8c8c0` (helper + hub + 10 locals).
- **Auto-fixes:** Page-scoped **`LocalBusiness`**; **`WebApplication`** fragment consistency on `/web-design`.
- **Paused for helper:** Yes — duplicate `@id` pattern met **≥3** routes; fixed once in **`generateLocalBusinessSchema`**.

---

## Batch 6 — SEO locality (`/seo-bristol`, `/seo-frome`, `/seo-somerset`)

**Same commit as Batch 5:** `6f8c8c0` — three layouts updated to pass **`PAGE_URL`** into **`generateLocalBusinessSchema`**.

**Before / after:** Same collision class as web-design vs SEO for shared city names; resolved by page-scoped **`#local-business`**. Live: **`seo-bristol/#local-business`** present; apex **`#local-bristol`** absent on fetched `/seo-bristol` HTML.

**Gate C — Batch 6 summary:** 1 commit (shared with Batch 5); 3 routes; no additional code edits beyond the helper call sites.

**Follow-up verification (2026-04-19):** No further code changes. Build + route list confirms three SEO routes static; pattern matches Batch 5 helper.

---

## Batch 7 — US cluster (`/us`, `/us/pricing`, `/us/quote`, `/us/services`, `/us/ai-visibility`)

**Commit:** `8ffee25`

**Issue:** All five layouts embedded **`generateUSLocalBusinessSchema()`** with a shared **`@id`** **`${BASE_URL}/#local-us`** and fixed **`url`** **`/us`** — duplicate entity across routes (same class as UK **`#local-*`** collisions).

**Auto-fixes applied:**
- **`generateUSLocalBusinessSchema(pageUrl)`** in **`src/lib/schema.ts`**: **`@id`** **`${pageBase}/#local-business`**, **`url`**: **`pageBase`** (mirrors UK **`generateLocalBusinessSchema`**).
- All five **`src/app/us/**/layout.tsx`** call sites pass each route’s **`PAGE_URL`**.
- **`/us/quote`:** Replaced hand-rolled partial **`WebPage`** (missing stable graph shape vs other pages) with **`generateWebPageSchema`** so **`@type`**, **`@id`** **`…/quote/#webpage`**, **`isPartOf`** **`#website`**, **`breadcrumb`**, **`publisher`** align with sitewide **`WebPage`** pattern.

**Gate C — Batch 7 summary:** 1 commit; 5 routes.

---

## Batch 8 — `/voice` (single route)

**Commit:** `f3be5c4`

**Issue:** **`ImageObject`** for the V.O.I.C.E. logo had no **`@id`** (anonymous node in **`@graph`**).

**Auto-fixes applied:**
- **`src/app/voice/layout.tsx`:** **`generateImageObjectSchema`** now passes **`id: \`${PAGE_URL}/#voice-logo\``**.

**Gate C — Batch 8 summary:** 1 commit; 1 route.

---

## Batch 9 — Blog posts (`/blog/[slug]` template, all Ghost SSG slugs)

**Commit:** `240035c`

**Issue:** **`BlogPosting.mainEntityOfPage`** referenced **`${pageUrl}/#webpage`**, but no **`WebPage`** entity was emitted in the same JSON-LD **`@graph`** — dangling **`@id`** reference for every post.

**Auto-fixes applied:**
- **`src/app/blog/[slug]/page.tsx`:** Emit **`generateWebPageSchema(...)`** first in the graph, with **`mainEntity: { '@id': \`${pageUrl}/#article\` }`**, matching **`BlogPosting`** **`@id`**.

**Gate C — Batch 9 summary:** 1 commit; covers all blog SSG routes from **`getAllPostSlugs`** (no per-slug edits).

---

## Next

- Further batches per roadmap (e.g. remaining static routes, cross-cutting FAQ embedding) or Gate D wrap-up.
