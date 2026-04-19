# Sitewide JSON-LD audit — ScopeSite (live HTML)

**Date:** 2026-04-19  
**Branch:** `audit/schema-sitewide-2026-04-19`  
**Ground truth:** Production HTML from `https://scopesite.co.uk` (not application source).  
**MCP server (namespaced):** `project-0-scopesite-ssr-schema-org`

## Severity legend

| Level | Meaning |
| --- | --- |
| **Critical** | Validator `errors` or clear spec breakage likely to confuse consumers. |
| **High** | Validator `warnings` or strong consumer mismatch (e.g. duplicate `@id` graphs). |
| **Medium** | Spec or consumer ambiguity; drill-down recommended. |
| **Low** | MCP `suggestions` only (SEO / completeness hints). |
| **Info** | Methodology notes, tooling limits, or non-actionable observations. |

## Methodology

1. Fetch live HTML: `curl.exe -sSL "https://scopesite.co.uk/<path>" -o temp.html` (PowerShell-friendly).
2. Extract every `<script type="application/ld+json">` block; parse JSON.
3. **Validator note:** `validate_jsonld_batch` rejects documents whose root is only `@context` + `@graph` with no root `@type` (“Missing @type property”). For MCP validation, each `@graph` node was treated as a separate item with `"@context": "https://schema.org"` plus that node’s properties (same JSON values as in the live graph).
4. Call `validate_jsonld_batch` with `{ "items": [ ... ] }` on those items.
5. For types needing schema reference, `get_type_properties` / `get_schema_type` on `project-0-scopesite-ssr-schema-org`.
6. Delete `temp.html` after each route (removed after this homepage pass).
7. Batches stop at agreed gates; homepage only in this document section until approval.

## MCP access check

`get_schema_type` on `Service` (server `project-0-scopesite-ssr-schema-org`) returned type metadata (`schema:Service`, description, superTypes) — MCP reachable.

---

## Batch 1 — proof route: Homepage `/`

### Fetch

- URL: `https://scopesite.co.uk/`
- Result: HTML saved to `temp.html` then deleted after extraction.

### Live JSON-LD inventory

- **Script blocks (`application/ld+json`):** **2**
- **`@graph` sizes:** script A **5** nodes; script B **16** nodes (**21** typed nodes total when flattened for validation).

### Duplicate / overlap (live HTML)

- **`https://scopesite.co.uk/#hero-image`** appears as an embedded `ImageObject` on the organization in the first graph **and** again as a top-level `ImageObject` in the second graph — same `@id` in two scripts. **Severity: High** (duplicate entity declaration across separate JSON-LD documents; consumer-dependent merge behaviour).

### SearchAction (`WebSite`)

- Live shape uses `"query-input": "required name=search_term_string"` on `SearchAction` nested under `WebSite.potentialAction`.
- `validate_jsonld` on a `WebSite` object mirroring that shape: **`valid: true`**, no errors/warnings.
- `get_type_properties` for `SearchAction` lists a **`query`** property in schema.org’s property list; it does **not** list `query-input` (legacy microdata-style string). **Severity: Medium** (widely used Google pattern; not flagged as invalid by this MCP, but spec naming is awkward vs `query`).

### Organization node (full graph)

- The full `Organization` + `LocalBusiness` + `ProfessionalService` node from live HTML is large (~9.7 KB as a single JSON object). It was **not** re-sent as one `validate_jsonld_batch` item in this session (assistant payload limits). **Severity: Info** (gap for a future chunk or local MCP run).
- **Representative fragments from the same live graph** were validated with **`valid: true`**, no errors/warnings:
  - One representative **`Offer`** (from `hasOfferCatalog`).
  - **`DefinedTermSet`** (including all live `hasDefinedTerm` entries) via `validate_jsonld`.
  - **`BusinessAudience`** and the standalone top-level **`ScheduleAction`** via `validate_jsonld_batch`.

### Page graph batch (`BreadcrumbList`, `WebPage`, `FAQPage`, `ImageObject`, `ItemList`)

`validate_jsonld_batch` on the five live-derived items (full FAQ text preserved):

- All five: **`valid: true`**, `errors: []`, `warnings: []`.
- **Suggestions (Low):**
  - `BreadcrumbList`: consider `name`, `description`, `url`, `image`.
  - `WebPage`: consider `image`.
  - `FAQPage`: consider `name`, `description`, `url`, `image`.
  - `ImageObject`: consider `image` (meta-suggestion).
  - `ItemList`: consider `description`, `url`, `image`.

### Reviews (6 × `Review`)

- Batch validation for all six live `Review` objects: each **`valid: true`**, no errors/warnings.
- **Suggestions (Low):** each review suggests `name`, `description`, `url`, `image` on the review object.

### `Service` entities (5)

- Batch included `web-design`, `voice`, `schema-markup`, `web-apps`, `llm-brain` service `@id`s from live HTML.
- All: **`valid: true`**, no errors/warnings.
- **Suggestions (Low):** “Consider adding `image` property for better SEO” on each.

### Homepage summary

| Severity | Count / note |
| --- | --- |
| Critical | **0** |
| High | **1** — duplicate `@id` `#hero-image` across two JSON-LD scripts. |
| Medium | **1** — `query-input` string on `SearchAction` vs schema.org `query` property naming. |
| Low | **Many** — MCP SEO-style suggestions (`image`, etc.). |
| Info | Full `Organization` single-object MCP pass deferred to a follow-up with agreed chunking. |

---

## Gate — Batch 1 continuation

**Stopped after homepage `/` per instructions.**  
Next (pending your approval): live fetch and same pipeline for `/about` through `/web-apps` (no batch chaining until approved).
