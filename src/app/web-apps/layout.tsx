import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import {
  generateBreadcrumbSchema,
  generateServiceSchema,
  generateWebPageSchema,
  generateServiceChannels,
} from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/web-apps`;

export const metadata: Metadata = {
  title: 'Custom Web Apps UK',
  description:
    'Bespoke web applications built in Somerset for UK businesses. Quote calculators, client portals, booking systems & AI-powered tools. Solve real problems.',
  openGraph: {
    title: 'Custom Web Apps UK | Bespoke Business Applications | ScopeSite Digital Studios',
    description:
      'Bespoke web applications built in Somerset for UK businesses. Quote calculators, client portals, booking systems & AI-powered tools. Solve real problems.',
    url: PAGE_URL,
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'Custom Web Apps UK - Bespoke Business Applications by ScopeSite',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Web Apps UK | Bespoke Business Applications | ScopeSite',
    description:
      'Bespoke web applications built in Somerset for UK businesses. Quote calculators, client portals, booking systems & AI-powered tools.',
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

export default function WebAppsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Generate schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Custom Web Apps', url: PAGE_URL },
  ]);

  const serviceSchema = generateServiceSchema(
    'Custom Web Application Development',
    'Bespoke web applications built to solve real business problems. Quote calculators, client portals, booking systems, compliance tools, and AI-powered automation.',
    PAGE_URL,
    undefined,
    {
      isRelatedTo: [
        { '@id': `${BASE_URL}/web-design/#service` },
        { '@id': `${BASE_URL}/generative-engine-optimisation/#service` },
      ],
      availableChannel: generateServiceChannels(),
    }
  );

  const webPageSchema = {
    ...generateWebPageSchema(
      'Custom Web Apps UK',
      'Bespoke web applications built in Somerset for UK businesses. Quote calculators, client portals, booking systems & AI-powered tools. Solve real problems.',
      PAGE_URL
    ),
    mainEntity: { '@id': `${PAGE_URL}/#service` },
  };

  return (
    <>
      <JsonLd schema={[webPageSchema, breadcrumbSchema, serviceSchema]} />
      {children}
    </>
  );
}
