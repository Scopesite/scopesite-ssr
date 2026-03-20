import { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import {
  generateBreadcrumbSchema,
  generateContactPageSchema,
  generateScheduleActionSchema,
} from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/book`;

export const metadata: Metadata = {
  title: 'Book a Free Strategy Call',
  description:
    'Book a free 30-minute strategy call with Dan Cartwright. No sales pitch, just honest advice about your website, AI visibility, and what would actually move the needle for your business.',
  openGraph: {
    title: 'Book a Free Strategy Call | Web Design Consultation | ScopeSite Digital Studios',
    description:
      'Book a free 30-minute strategy call with Dan Cartwright. No sales pitch, just honest advice about your website, AI visibility, and what would actually move the needle for your business.',
    url: PAGE_URL,
    images: [
      {
        url: `${BASE_URL}/images/dan-headshot.webp`,
        width: 400,
        height: 400,
        alt: 'Dan Cartwright - Director of ScopeSite Digital Studios',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Book a Free Strategy Call | ScopeSite',
    description: 'Book a free 30-minute strategy call with Dan Cartwright. No sales pitch, just honest advice about your website and AI visibility.',
    images: [`${BASE_URL}/images/dan-headshot.webp`],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Book a Call', url: PAGE_URL },
  ]);

  const contactPageSchema = generateContactPageSchema(PAGE_URL);
  const scheduleActionSchema = generateScheduleActionSchema();

  return (
    <>
      <JsonLd
        schema={[breadcrumbSchema, contactPageSchema, scheduleActionSchema]}
      />
      {children}
    </>
  );
}
