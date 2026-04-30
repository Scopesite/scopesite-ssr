import { NextResponse } from 'next/server';

const BODY = `# ScopeSite Digital Studios

> Veteran-owned UK web-design and AI-visibility agency. V.O.I.C.E. methodology. Server-side-rendered Next.js 16 sites optimised for ChatGPT, Claude, Gemini and Perplexity citation.

## Core pages

- https://scopesite.co.uk/
- https://scopesite.co.uk/voice
- https://scopesite.co.uk/web-design
- https://scopesite.co.uk/pricing
- https://scopesite.co.uk/territory
- https://scopesite.co.uk/case-studies/h4tlt
- https://scopesite.co.uk/about
- https://scopesite.co.uk/book

## Methodology

- https://scopesite.co.uk/voice
- https://scopesite.co.uk/answer-engine-optimisation
- https://scopesite.co.uk/generative-engine-optimisation
- https://scopesite.co.uk/schema-markup
- https://scopesite.co.uk/ai-seo-services

## Local services

- https://scopesite.co.uk/web-design-frome
- https://scopesite.co.uk/web-design-bristol
- https://scopesite.co.uk/web-design-bath
- https://scopesite.co.uk/web-design-somerset
- https://scopesite.co.uk/seo-frome
- https://scopesite.co.uk/seo-somerset
- https://scopesite.co.uk/seo-bristol

## US market

- https://scopesite.co.uk/us
- https://scopesite.co.uk/us/services
- https://scopesite.co.uk/us/ai-visibility
- https://scopesite.co.uk/us/pricing
- https://scopesite.co.uk/us/quote
- https://scopesite.co.uk/us/generative-engine-optimization

## Featured articles

- https://scopesite.co.uk/blog/we-audited-500-personal-injury-law-firm-websites
- https://scopesite.co.uk/blog/what-is-domain-authority
- https://scopesite.co.uk/blog/geo-vs-seo-vs-aeo
- https://scopesite.co.uk/blog/claude-opus-4-7-investigation
- https://scopesite.co.uk/blog/ai-visibility-checker

## Optional

- https://scopesite.co.uk/privacy-policy
- https://scopesite.co.uk/terms-and-conditions
- https://scopesite.co.uk/accessibility-statement
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
