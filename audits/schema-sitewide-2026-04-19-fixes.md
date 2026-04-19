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

## Next

- **Batch 3** (legal + blog index): `/terms-and-conditions`, `/privacy-policy`, `/accessibility-statement`, `/blog` — continue same cycle unless CONFIRM-FIX / CRITICAL.
