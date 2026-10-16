# Eight-article evidence reconciliation

Reviewed 16 October 2026. Base: `d8ad8fba17b8bfc44851a5ff0996e58181b39dcf` (PR16).

Two published articles contained unsupported client stories, result timelines and allegations that could not be repaired safely by replacing a sentence. They now have complete, practical replacements (approximately 950 and 980 words). Six other articles receive 53 exact block repairs, including three removed figures that carried withdrawn technical/product assertions. The public URLs, IDs, authors and original publication dates are retained.

This correction separates initial HTML from rendered pages, search crawlers from model training and user-directed fetching, technical checks from actual assistant answers, schema validation from citation outcomes, and Lighthouse lab scores from field data. It removes universal 100/100 results and unsupported 99.7%/43% claims in the targeted passages. Current CAFMO copy distinguishes the private replacement preview from the earlier public scanner. No prices, payment flows, forms, privacy controls or access settings are changed.

Hosted preview inspection also identified stale free-scanner labels in the shared blog author/footer template and a pre-existing tracking-cleanup bug that deleted question marks from prose. The shared blog links now describe the current scanner overview. Tracking cleanup operates only on actual quoted anchor href attributes, removing the verified `ref=scopesite-digital-studios.ghost.io` value. Other referral parameters, encoding, fragments, other attributes, prose and malformed URLs are preserved. Sixteen regression cases cover that boundary.

## Articles

| Slug | Treatment |
| --- | --- |
| how-to-get-recommended-by-chatgpt | Full replacement; old feature/social images withdrawn |
| why-your-website-is-invisible-to-chatgpt-and-how-to-fix-it | Full replacement; old feature/social images withdrawn |
| business-not-showing-up-ai-search | 12 exact blocks |
| geo-vs-seo-vs-aeo | 9 exact blocks |
| how-much-should-a-website-cost-in-frome-and-why-most-quotes-are-either-a-rip-off-or-a-waste-of-money | 9 exact blocks |
| html-structure-schema-ai-visibility | 4 exact blocks |
| 3-seo-mistakes-somerset-businesses-make-and-how-to-fix-them | 9 exact blocks, including one removed figure |
| seo-frome-businesses-2026 | 10 exact blocks, including two removed figures |

## Source and authority

Fresh read-only Ghost Content API snapshots were captured at 10:27:50 UTC. Public versions of all eight articles returned HTTP200 when recaptured at approximately 10:32 UTC. Test fixtures preserve the source HTML and the public fields needed for matching. They contain no API key or account credentials. The original CMS content is not changed by this repository repair.

Internal route: INDEX-000, MATRIX-001 and AGENT-ROUTER-001; current ScopeSite brand, recruitment ICP and Clarkson structural voice sources; TECH-001; PROOF-001 (ScopeSite__Approved_Claims_and_Evidence__CURRENT.md, effective 13 July 2026); current CAFMO product facts and the verified product story released in PR16. H4TLT is linked only to the approved published case study; its results are not transferred to recruitment or used as a general timetable.

Current primary sources checked on 16 October:

- [Google Search generative AI guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google Search JavaScript processing](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) and [speakable](https://developers.google.com/search/docs/appearance/structured-data/speakable)
- [OpenAI crawler roles](https://developers.openai.com/api/docs/bots)
- [Anthropic crawler roles](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Perplexity crawler roles](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
- [Browser-agent usability](https://web.dev/articles/ai-agent-site-ux) and [llms.txt proposal](https://llmstxt.org/)
- [Lighthouse score variability](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring) and [PageSpeed Insights lab/field data](https://developers.google.com/speed/docs/insights/v5/about)

## Application and maintenance

`applyEvidenceEditorialCorrection` runs centrally in Ghost `cleanPost`, before the ordinary heading/tracking cleanup and before cards, detail pages, metadata and schema use the post. Titles, descriptions, excerpts and social fields are corrected together. The date formatter is separated from the Ghost client so client-side cards do not import the server-only hashing code or correction data.

A later CMS `updated_at` than the frozen review cutoff takes precedence. Otherwise the post must match a SHA256 fingerprint of its source HTML, identity, timestamp and every replaced metadata/image field. Each exact block must occur once; all blocks are validated before any replacement. Attributes and existing IDs are retained on narrow replacements.

Unexpected old-source drift or an invalid timestamp leaves the entire source post unchanged and emits an explicit `[EditorialCorrection] Unapplied correction requires review` error with slug/reason, without source content or credentials. **An unapplied correction is unresolved work, not a successful repair.** Recapture and review the CMS source before updating its fixture and fingerprint. Do not suppress the diagnostic or switch to fuzzy replacement. Retire the repository override after a reviewed correction is reconciled in Ghost.

## Validation and limits

- The initial 123-test suite passed across 20 files; 24 new editorial tests exercise real source snapshots, retained identity/dates/anchors, metadata and schema propagation, later-CMS bypass, whole-post preservation and diagnostic on drift, atomic duplicate/missing-block rejection, and listing/detail/featured integration. The subsequent link-cleanup repair adds 16 passing regression cases; final combined validation is recorded in the release receipt.
- Production build and TypeScript check pass. Targeted lint for all changed TypeScript/TSX files passes.
- Full repository lint remains red with eight errors and 48 warnings in unchanged files, including the book page and portal/territory components. This branch does not claim to resolve that baseline.
- Independent review approved both full replacements and verified that all 17 adjacent paragraph/caption findings and three affected figures were addressed.
- This is a targeted technical/product reconciliation. Unrelated historical audience-adoption percentages, pricing comparisons and ROI assertions in the six partial articles are **not certified by this review**. Their remaining sources need a separate review before reusing those claims elsewhere.
- Hosted preview checks are recorded in the task release receipt once the exact commit is deployed. A local build alone does not establish the live Ghost response or production release.
