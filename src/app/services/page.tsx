import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import {
  generateWebPageSchema,
  generateBreadcrumbSchema,
} from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_PATH = '/services';
const PAGE_URL = `${BASE_URL}${PAGE_PATH}`;

export const metadata: Metadata = {
  title: 'Every Service ScopeSite Offers | ScopeSite Digital Studios',
  description:
    'Full index of ScopeSite services: web design, AI visibility, schema markup, LLM Brain, custom apps, AI SEO, and pricing.',
  alternates: {
    canonical: PAGE_URL,
  },
};

const ALL_SERVICES: readonly { title: string; href: string; description: string }[] = [
  {
    title: 'Web Design',
    href: '/web-design',
    description:
      'SSR brochure and business websites built for humans and AI crawlers alike.',
  },
  {
    title: 'AI Website Design',
    href: '/ai-website-design',
    description:
      'AI-first website builds with structured data and performance baked in.',
  },
  {
    title: 'AI SEO Agency',
    href: '/ai-seo-agency',
    description:
      'Agency-led AI search visibility for brands that need depth and execution.',
  },
  {
    title: 'AI SEO Services',
    href: '/ai-seo-services',
    description:
      'Practical AI SEO: audits, schema, content architecture, and crawler access.',
  },
  {
    title: 'Answer Engine Optimisation',
    href: '/answer-engine-optimisation',
    description:
      'Optimise how your business appears in AI answers and conversational results.',
  },
  {
    title: 'Generative Engine Optimisation',
    href: '/generative-engine-optimisation',
    description:
      'GEO strategy for ChatGPT, Gemini, Perplexity, and generative search surfaces.',
  },
  {
    title: 'AI Visibility',
    href: '/ai-visibility',
    description:
      'Improve how AI systems discover, interpret, and cite your business.',
  },
  {
    title: 'Schema Markup',
    href: '/schema-markup',
    description:
      'JSON-LD and structured data engineering so machines trust your facts.',
  },
  {
    title: 'V.O.I.C.E.™ AI Visibility',
    href: '/voice',
    description:
      'Our V.O.I.C.E. methodology and tooling for measurable AI visibility.',
  },
  {
    title: 'Custom Web Apps',
    href: '/web-apps',
    description:
      'Bespoke tools and internal apps on modern SSR stacks.',
  },
  {
    title: 'LLM Brain',
    href: '/llm-brain',
    description:
      'Persistent memory layer so Claude and ChatGPT keep your business context.',
  },
  {
    title: 'Pricing',
    href: '/pricing',
    description:
      'Transparent pricing for websites, retainers, LLM Brain, and add-ons.',
  },
];

const ITEM_LIST_ID = `${PAGE_URL}/#services-itemlist`;

export default function ServicesHubPage() {
  const webPageSchema = {
    ...generateWebPageSchema(
      'Every Service ScopeSite Offers',
      'Browse every ScopeSite service and landing page in one place.',
      PAGE_URL
    ),
    mainEntity: { '@id': ITEM_LIST_ID },
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Services', url: PAGE_URL },
  ]);

  const itemListSchema: Record<string, unknown> = {
    '@type': 'ItemList',
    '@id': ITEM_LIST_ID,
    name: 'Every Service ScopeSite Offers',
    url: PAGE_URL,
    numberOfItems: ALL_SERVICES.length,
    itemListElement: ALL_SERVICES.map((service, index) => {
      const servicePageUrl = `${BASE_URL}${service.href}`;
      return {
        '@type': 'ListItem',
        position: index + 1,
        url: servicePageUrl,
        item: {
          '@type': 'Service',
          '@id': `${servicePageUrl}/#service`,
          name: service.title,
          description: service.description,
          url: servicePageUrl,
          provider: { '@id': `${BASE_URL}/#organization` },
          areaServed: {
            '@type': 'Country',
            name: 'United Kingdom',
          },
        },
      };
    }),
  };

  return (
    <>
      <JsonLd schema={[webPageSchema, breadcrumbSchema, itemListSchema]} />

      <section className="bg-brand-navy text-white pt-32 pb-16 md:pb-20">
        <div className="container-content max-w-4xl">
          <p className="text-brand-gold font-body text-sm font-semibold uppercase tracking-wider mb-4">
            ScopeSite Digital Studios
          </p>
          <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-6">
            Every Service ScopeSite Offers
          </h1>
          <p className="text-white/80 text-body-lg max-w-2xl">
            Browse our core products and specialist landing pages. Same URLs as always — this page is
            your map.
          </p>
        </div>
      </section>

      <section className="section-white border-t border-brand-navy/10">
        <div className="container-content py-section">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ALL_SERVICES.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="group card-hover rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm flex flex-col h-full ring-1 ring-transparent hover:ring-brand-gold/25 transition-all"
              >
                <h2 className="font-headline text-xl text-brand-navy mb-3 group-hover:text-brand-gold-accessible transition-colors">
                  {service.title}
                </h2>
                <p className="text-muted text-sm leading-relaxed flex-1">{service.description}</p>
                <span className="mt-4 text-brand-navy font-semibold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  View service
                  <span aria-hidden className="text-brand-gold">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
