import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import {
  generateBreadcrumbSchema,
  generateServiceSchema,
  generateFAQSchema,
} from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/web-apps`;

export const metadata: Metadata = {
  title: 'Custom Web Applications UK',
  description:
    'Bespoke web applications that solve real business problems. Quote builders, client portals, booking systems, and AI-powered tools.',
  openGraph: {
    title: 'Custom Web Applications UK | ScopeSite Digital Studios',
    description:
      'Bespoke web applications that solve real business problems. Quote builders, client portals, booking systems, and AI-powered tools.',
    url: PAGE_URL,
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'Custom Web Applications by ScopeSite',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Web Applications UK | ScopeSite',
    description:
      'Bespoke web applications that solve real business problems.',
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

// FAQ data for schema
const faqItems = [
  {
    question: 'How much does a custom web app cost?',
    answer:
      "It depends entirely on complexity. A simple calculator might be £1,500-3,000. A full client portal with authentication could be £5,000-15,000+. We scope every project individually and give you a fixed quote before starting - no surprises.",
  },
  {
    question: 'How long does it take to build?',
    answer:
      "Simple tools take 2-4 weeks. Complex applications with multiple integrations can take 2-3 months. We'll give you a realistic timeline based on your specific requirements.",
  },
  {
    question: 'Will I own the code?',
    answer:
      "Yes. 100%. We build it, you own it. No licensing fees, no ongoing royalties. It's yours.",
  },
  {
    question: 'Can you integrate with our existing systems?',
    answer:
      "Usually, yes. We work with most CRMs, payment processors, accounting software, and third-party APIs. If there's an API, we can probably connect to it.",
  },
  {
    question: 'Do I need technical knowledge to use it?',
    answer:
      "No. We build admin interfaces that anyone can use. If you can use Facebook, you can use what we build. We also provide training and documentation.",
  },
  {
    question: 'What if I need changes after launch?',
    answer:
      "We offer ongoing support packages, or you can pay for changes as needed. Because you own the code, you could also hire any developer to modify it - you're not locked in.",
  },
  {
    question: 'Can you rebuild something we already have but better?',
    answer:
      "Absolutely. If you've got a clunky tool that's frustrating your team or customers, we can rebuild it properly. Often costs less than you'd think.",
  },
  {
    question: "What if I'm not sure exactly what I need?",
    answer:
      "That's normal. Book a discovery call and we'll help you figure it out. Sometimes what you think you need and what you actually need are different - we'll be honest about that.",
  },
];

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
    PAGE_URL
  );

  const faqSchema = generateFAQSchema(faqItems);

  return (
    <>
      <JsonLd schema={[breadcrumbSchema, serviceSchema, faqSchema]} />
      {children}
    </>
  );
}
