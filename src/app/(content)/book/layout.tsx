import { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import {
  generateBreadcrumbSchema,
  generateContactPageSchema,
} from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/book`;

export const metadata: Metadata = {
  title: 'Book a Free Strategy Call | ScopeSite',
  description:
    'Book a free 30-minute strategy call with Dan Cartwright. No sales pitch, just honest advice on your website and AI visibility. Veteran-owned, Somerset.',
  openGraph: {
    title: 'Book a Free Strategy Call | Web Design Consultation | ScopeSite Digital Studios',
    description:
      'Book a free 30-minute strategy call with Dan Cartwright. No sales pitch, just honest advice on your website and AI visibility. Veteran-owned, Somerset.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-book.png`,
        width: 1200,
        height: 630,
        alt: 'Book a Free Strategy Call with ScopeSite Digital Studios',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book a Free Strategy Call | ScopeSite',
    description: 'Book a free 30-minute strategy call with Dan Cartwright. No sales pitch, just honest advice on your website and AI visibility. Veteran-owned, Somerset.',
    images: [`${BASE_URL}/images/og/og-book.png`],
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

  return (
    <>
      <JsonLd
        schema={[breadcrumbSchema, contactPageSchema]}
      />
      {children}
    </>
  );
}
