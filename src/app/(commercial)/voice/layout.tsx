import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import {
  generateBreadcrumbSchema,
  generateServiceSchema,
  generateSpeakableSchema,
  generateImageObjectSchema,
  generateWebPageSchema,
  generateVOICESoftwareApplicationSchema,
  generateServiceChannels,
  generateFAQSchema,
  schemaStandardTierServiceOffers,
} from '@/lib/schema';
import { getAlternates } from '@/lib/hreflang-map';
import { AI_VISIBILITY_FAQS as faqs, CAFMO_PRODUCT_STORY } from '@/lib/product-story';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/voice`;

export const metadata: Metadata = {
  title: 'AI visibility checker and AI SEO | ScopeSite',
  description:
    'Website evidence, technical readiness and separate model answer checks. Explore the live CAFMO application and ScopeSite’s AI SEO services.',
  openGraph: {
    title: 'AI visibility checker and AI SEO | ScopeSite',
    description:
      'Website checks and AI SEO support from ScopeSite. CAFMO is live, with the earlier scanner and its credits available separately.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-voice.png`,
        width: 1200,
        height: 630,
        alt: 'AI visibility scan by ScopeSite Digital Studios',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI visibility checker | ScopeSite',
    description:
      'Check technical website evidence and understand what an AI visibility score can tell you.',
    images: [`${BASE_URL}/images/og/og-voice.png`],
  },
  alternates: getAlternates('/voice', BASE_URL),
};

export default function VoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Generate schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'AI visibility scan', url: PAGE_URL },
  ]);

  const serviceSchema = {
    ...generateServiceSchema(
      'AI visibility scan and AI SEO',
      'ScopeSite’s AI SEO methodology checks readable HTML, structured facts, crawler access and useful content, alongside separately observed provider answers.',
      PAGE_URL,
      undefined,
      {
        availableChannel: generateServiceChannels(),
        serviceType: 'AI visibility methodology',
        category: 'Search engine optimisation',
        offers: schemaStandardTierServiceOffers(PAGE_URL),
      }
    ),
    isRelatedTo: [
      { '@id': `${BASE_URL}/ai-seo-services/#service` },
      { '@id': `${BASE_URL}/schema-markup/#service` },
      { '@id': CAFMO_PRODUCT_STORY.applicationId },
      { '@id': `${BASE_URL}/generative-engine-optimisation/#service` },
    ],
  };


  const voiceLogoSchema = generateImageObjectSchema({
    contentUrl: `${BASE_URL}/images/voice-ai-aeo-geo-uk-scopesite-top-logo.webp`,
    name: 'AI visibility scan logo',
    description: 'AI visibility scanning tool by ScopeSite Digital Studios',
    width: 600,
    height: 120,
    id: `${PAGE_URL}/#voice-logo`,
  });

  const webPageSchema = {
    ...generateWebPageSchema(
      'AI visibility scan | ScopeSite',
      'Technical website checks and AI SEO support, with CAFMO product status and the limits of scanner scores.',
      PAGE_URL
    ),
    mainEntity: { '@id': `${PAGE_URL}/#service` },
    speakable: generateSpeakableSchema(['h1', '#voice-definition', '.voice-definition']),
  };

  const softwareAppSchema = generateVOICESoftwareApplicationSchema();

  const faqSchema = generateFAQSchema(faqs);

  return (
    <>
      <JsonLd schema={[webPageSchema, breadcrumbSchema, serviceSchema, softwareAppSchema, voiceLogoSchema, faqSchema]} />
      {children}
    </>
  );
}
