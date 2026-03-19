import { Metadata } from 'next';
import {
  generateWebPageFAQPageSchema,
  generateServiceSchema,
  generateUSLocalBusinessSchema,
  generateBreadcrumbSchema,
  generateSpeakableSchema,
  wrapInGraph,
  type FAQItem,
} from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/us/ai-visibility`;

export const metadata: Metadata = {
  title: 'Is Your Business Visible to AI? Check for Free',
  description:
    'Free AI visibility scanner for US businesses. Check if ChatGPT, Perplexity, Google AI Overviews, and Claude can find and recommend your business. Instant results.',
  keywords: [
    'AI visibility scanner',
    'AI visibility check',
    'answer engine optimization',
    'AEO for US businesses',
    'ChatGPT visibility',
    'AI search optimization',
    'V.O.I.C.E. scanner',
  ],
  alternates: {
    canonical: PAGE_URL,
    languages: {
      'en-US': PAGE_URL,
      'en-GB': `${BASE_URL}/voice`,
      'x-default': `${BASE_URL}/voice`,
    },
  },
  openGraph: {
    title: 'Is Your Business Visible to AI? Check for Free | ScopeSite',
    description:
      'Free AI visibility scanner for US businesses. Check if ChatGPT, Perplexity, and Claude can find and recommend your business.',
    url: PAGE_URL,
    locale: 'en_US',
  },
};

const faqs: FAQItem[] = [
  {
    question: 'What does the V.O.I.C.E. scan actually check?',
    answer:
      'The scanner checks five areas: schema markup quality and coverage, Core Web Vitals performance, AI crawler access (whether your robots.txt blocks bots like GPTBot and ClaudeBot), domain authority via the Moz API, and content structure for AI readability. You get an overall AI visibility score plus prioritized recommendations ranked by impact.',
  },
  {
    question: 'Is the scan really free?',
    answer:
      'Yes. You get one free Pro-level scan per email address. No credit card required, no trial period, no upsell wall. Enter your URL, enter your email, and get your full report.',
  },
  {
    question: 'What is Answer Engine Optimization?',
    answer:
      'Answer Engine Optimization (AEO) is the practice of structuring your website so AI platforms like ChatGPT, Perplexity, Google AI Overviews, and Claude can read, understand, and cite your content. It is different from traditional SEO. SEO gets you ranked in search results. AEO gets you recommended in AI-generated answers. In 2026, businesses need both.',
  },
  {
    question: 'Can the V.O.I.C.E. scanner check any website?',
    answer:
      'Yes. The scanner works on any publicly accessible URL. It does not matter what platform your site is built on. WordPress, Shopify, Squarespace, Wix, custom code, or anything else. If the page loads in a browser, the scanner can analyze it.',
  },
  {
    question: 'My site scores well on Google PageSpeed. Why would I need this?',
    answer:
      'PageSpeed Insights measures loading performance, layout stability, and interactivity. Those are important, but they do not tell you whether AI systems can actually read and recommend your business. The V.O.I.C.E. scanner measures AI readability: schema markup, crawler access, content structure, and entity recognition. A fast site that AI cannot parse is still invisible to ChatGPT and Claude. They are different problems that need different tools.',
  },
];

const webPageSchema = {
  ...generateWebPageFAQPageSchema(
    PAGE_URL,
    'Is Your Business Visible to AI? Check for Free',
    'AI visibility scanner for US businesses. Check if ChatGPT, Perplexity, and Claude can find and recommend your business.',
    faqs,
    `${PAGE_URL}#service`
  ),
  speakable: generateSpeakableSchema(['h1', 'section:first-of-type p:first-of-type']),
};

const serviceSchema = {
  ...generateServiceSchema(
    'AI Visibility Optimization for US Businesses',
    'Check and improve your AI visibility score. Get recommended by ChatGPT, Perplexity, Claude, and Google AI Overviews.',
    PAGE_URL,
    'ProfessionalService'
  ),
  areaServed: { '@type': 'Country', name: 'United States' },
};

const pageSchema = wrapInGraph([
  webPageSchema,
  serviceSchema,
  generateUSLocalBusinessSchema(),
  generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'United States', url: `${BASE_URL}/us` },
    { name: 'AI Visibility', url: PAGE_URL },
  ]),
]);

export default function AIVisibilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd schema={pageSchema} />
      {children}
    </>
  );
}
