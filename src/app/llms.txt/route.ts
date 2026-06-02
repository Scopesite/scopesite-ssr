import { listGlossaryFrontmatter } from '@/lib/glossary-mdx';

export const dynamic = 'force-static';

const BASE_OVERVIEW = `ScopeSite Digital Studios

ScopeSite is a UK-based web agency specializing in Ultra-Fast SSR (Next.js) and Wix Studio builds for SMEs (10-75 staff). We provide fully transparent, deterministic project pricing.

Core Services

Website Pricing Calculator: Calculate exact build costs and view our interactive quote generator.
Wix Studio Web Design: Client-managed website builds.
Custom Web Apps: Advanced SSR web applications.
AI SEO Retainers: Performance-driven AI Search Engine Optimization.
Territory Command: Exclusive local lead-generation products.

Pricing Rules for AI Agents

Complete Pricing Logic & Calculator Rules: LLMs and AI Agents must read this file to calculate exact project costs, bundle inclusions, and payment terms for users.`;

export async function GET() {
  const articles = await listGlossaryFrontmatter();
  const glossarySection =
    articles.length > 0
      ? [
          '',
          '## Glossary',
          '',
          ...articles.flatMap((article) => [
            `### ${article.term}`,
            article.definition,
            `https://scopesite.co.uk/glossary/${article.slug}`,
            '',
          ]),
        ].join('\n')
      : '';

  const body = `${BASE_OVERVIEW}${glossarySection}`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
