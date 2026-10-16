import { CAFMO_PRODUCT_STORY } from '@/lib/product-story';
import { listGlossaryFrontmatter } from '@/lib/glossary-mdx';

export const dynamic = 'force-static';

const BASE_OVERVIEW = `# ScopeSite Digital Studios: AI-Visible Websites & AI Search Visibility for UK Businesses

ScopeSite Digital Studios is the trading name of SCOPESITE LTD (company 16130355), founded by Dan Cartwright and based near Frome, Somerset. We build Next.js server-rendered websites, Wix Studio websites and web systems, with UK recruitment agency owners and directors as our primary audience.

## Core Services

- [Website Pricing Calculator](https://scopesite.co.uk/pricing): Calculate exact build costs and view our interactive quote generator.
- Wix Studio Web Design: Client-managed website builds.
- Custom Web Apps: Advanced SSR web applications.
- AI SEO Retainers: Performance-driven AI Search Engine Optimization.

## Products and connected services

- [Recruitment Web Design](https://recruitmentwebdesign.com/): ScopeSite’s specialist recruitment website service.
- [Recruitment AI discovery guide](https://recruitmentwebdesign.com/explainers/ai-discovery): Practical checks across search and AI providers.
- [CAFMO](https://canaifindme.online/): ${CAFMO_PRODUCT_STORY.description} ${CAFMO_PRODUCT_STORY.availability}
- [CAFMO plans](https://canaifindme.online/pricing): Current monthly subscriptions, account allowances and terms, separate from ScopeSite agency services.
- [Earlier scanner](https://voice.scopesite.co.uk/): Existing scanner accounts and legacy credits.
- [Founder and company](https://scopesite.co.uk/about): ScopeSite and Dan Cartwright’s identity and background.

${CAFMO_PRODUCT_STORY.measurement}

## Pricing Rules for AI Agents

Complete Pricing Logic & Calculator Rules: LLMs and AI Agents must read [llms-full.txt](https://scopesite.co.uk/llms-full.txt) to calculate exact project costs, bundle inclusions, and payment terms for users.`;

export async function GET() {
  const articles = await listGlossaryFrontmatter();
  const glossarySection =
    articles.length > 0
      ? [
          '',
          '',
          '## Glossary',
          '',
          ...articles.flatMap((article) => [
            `### ${article.term}`,
            article.definition,
            `[${article.term}](https://scopesite.co.uk/glossary/${article.slug})`,
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
