import { NextResponse } from 'next/server';

/** Concatenated summaries for AI crawlers; keep under ~200 KB. */
const BODY = `# ScopeSite Digital Studios — full context

## Home (/)
ScopeSite builds server-side rendered websites for UK businesses so Google and AI assistants (ChatGPT, Claude, Perplexity, Gemini) can read, trust, and cite them. Veteran-owned, Somerset-based. Core offer: web design, AI visibility audits and scans, structured data engineering, and GEO/AEO consulting.

## AI visibility scanner (/voice)
The AI visibility scanner is our methodology and tooling stack for measuring AI visibility: structured data quality, Core Web Vitals, crawler access, authority signals, and content structure. Paid scans from low per-scan pricing; credits-based model.

## Web design (/web-design)
AI-first brochure and marketing sites using Next.js SSR, JSON-LD, performance budgets targeting strong Lighthouse scores, and copy structured for machine extraction—not keyword stuffing.

## Pricing (/pricing)
Transparent packages and an instant quote calculator for page count, e-commerce, and options. Payment plans available; pricing aligned to published config in the codebase.

## Territory (/territory)
Productised territory exploration for AI-visibility sector positioning (see live site for current UX; this file only summarises purpose for LLMs).

## Case study: H4TLT (/case-studies/h4tlt)
Audiology compliance business case: from low traffic to multi-platform AI recommendations using SSR, structured data, entity signals, and technical SEO aligned to answer engines.

## About (/about)
Founder-led UK agency story: British Army veteran founder, Somerset base, focus on honest scoping and measurable AI visibility outcomes.

## Book (/book)
Free strategy calls via Cal.com embed; used for qualified discovery without high-pressure sales.

## Answer Engine Optimisation (/answer-engine-optimisation)
AEO: optimising to be the cited answer in Chat-style interfaces—structured data, factual extraction, SSR, and robots/llm discovery files.

## Generative Engine Optimisation (/generative-engine-optimisation)
GEO: broader generative search surfaces (AI Overviews, blended results) and how content + entities win visibility.

## Schema markup (/schema-markup)
Service page for JSON-LD engineering: types, nesting, validation, and integration with SSR pages.

## AI SEO services (/ai-seo-services)
Retainers and projects covering audits, implementation, schema, performance, and ongoing measurement.

## US mirror (/us, /us/services, /us/ai-visibility, /us/pricing, /us/quote, /us/generative-engine-optimization)
US English variants of core UK service pages; hreflang pairs connect GB and US URLs where configured.

## Legal
Privacy, terms, and accessibility statements describe data handling, contractual terms, and WCAG-oriented commitments.
`;

export function GET() {
  return new NextResponse(BODY, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
