import { Metadata } from 'next';
import { generateLandingPageSchema, generateServiceChannels, type FAQItem } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/schema-markup`;

export const metadata: Metadata = {
  title: 'Schema Markup Services | Professional JSON-LD Implementation UK',
  description: 'Expert schema markup implementation that makes your business visible to AI. 100% validation guarantee. Professional structured data services for UK businesses.',
  keywords: ['schema markup services', 'structured data implementation', 'json-ld services', 'schema markup agency'],
  openGraph: {
    title: 'Schema Markup Services | Professional JSON-LD Implementation UK',
    description: 'Expert schema markup implementation that makes your business visible to AI. 100% validation guarantee. Professional structured data services for UK businesses.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-schema-markup.png`,
        width: 1200,
        height: 630,
        alt: 'Schema Markup Services - Professional JSON-LD Implementation by ScopeSite',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Schema Markup Services | Professional JSON-LD Implementation UK',
    description: 'Expert schema markup implementation that makes your business visible to AI. 100% validation guarantee.',
    images: [`${BASE_URL}/images/og/og-schema-markup.png`],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

// FAQ data for schema
const faqs: FAQItem[] = [
  {
    question: "What exactly is schema markup?",
    answer: "Schema markup is code (specifically JSON-LD) that explicitly tells search engines and AI what your content means. Instead of AI guessing that 'John Smith Plumbing' is a business that does plumbing, schema states it definitively - along with location, services, hours, reviews, and how all these connect. It's the difference between AI understanding your business and AI ignoring it."
  },
  {
    question: "Why can't I just use a WordPress plugin for schema?",
    answer: "Plugins generate generic, one-size-fits-all schema that lacks the depth and relationships AI needs. They can't create proper entity connections, often produce duplicate @id errors, and use deprecated properties. For basic rich results in Google, plugins might work. For AI visibility, they're useless. We hand-code everything for your specific business."
  },
  {
    question: "How do I know if my current schema is working?",
    answer: "Run your site through validator.schema.org (not Google's Rich Results Test, which only checks limited schema types). If you see errors, warnings, or your schema doesn't accurately represent your business relationships, it's not working. We offer free schema audits if you want us to check properly."
  },
  {
    question: "What's the difference between Google's validation tool and Schema.org validator?",
    answer: "Google's Rich Results Test only validates schema types that trigger their specific rich results. Schema.org validator checks against the full vocabulary. AI platforms like ChatGPT use the full schema vocabulary, not just Google's subset. If you only validate with Google, you're missing most of what matters for AI."
  },
  {
    question: "How long does schema implementation take?",
    answer: "Typically 2-5 days depending on your site's complexity and how much existing schema needs fixing. Simple sites with clean code take less time. Sites with plugin-generated schema garbage or complex entity relationships take longer. We'll give you a specific timeline after auditing your current setup."
  },
  {
    question: "Will schema markup help my Google rankings?",
    answer: "Schema doesn't directly boost rankings, but it improves how Google understands your content, which can lead to better visibility and rich results (star ratings, FAQ dropdowns, etc.). More importantly, it's essential for AI visibility - ChatGPT, Perplexity, and voice assistants rely heavily on structured data to recommend businesses."
  },
  {
    question: "What platforms can you implement schema on?",
    answer: "Any platform that allows custom code injection: WordPress, Shopify, Wix, Squarespace, custom builds, Next.js, you name it. If you can add code to your site, we can implement schema. Some platforms make it easier than others, but none are impossible."
  },
  {
    question: "Do you fix existing broken schema?",
    answer: "Yes. We start every project with a full audit of existing schema. If there's salvageable work, we fix and extend it. If it's fundamentally broken (which is common with plugin-generated markup), we replace it entirely. Either way, you end up with working schema."
  },
  {
    question: "What's JSON-LD and why do you use it?",
    answer: "JSON-LD (JavaScript Object Notation for Linked Data) is the recommended format for schema markup. It sits in a script tag, separate from your visible content, making it easier to maintain and less likely to break. Google explicitly recommends JSON-LD over other formats like Microdata or RDFa."
  },
  {
    question: "How do entity relationships work in schema?",
    answer: "Entity relationships connect your schema objects using @id references. Your Organization @id is referenced by your Person (founder), LocalBusiness (location), and Service (what you offer) schemas. This creates a knowledge graph that AI can traverse, understanding how everything in your business connects."
  },
  {
    question: "What's speakable schema and do I need it?",
    answer: "Speakable schema tells voice assistants which parts of your content should be spoken aloud in response to queries. If you want Siri or Google Assistant to read specific information about your business, you need speakable markup. We implement it using xpath selectors for maximum compatibility."
  },
  {
    question: "Can schema markup help with voice search?",
    answer: "Absolutely. Voice assistants rely heavily on structured data to provide spoken answers. Proper LocalBusiness schema helps with 'near me' searches. FAQ schema provides direct answers. Service schema helps with 'who can help me with X' queries. Schema is the foundation of voice search visibility."
  },
  {
    question: "What's your 100% validation guarantee?",
    answer: "If any schema we implement doesn't pass Schema.org validation, we fix it at no additional cost. No questions, no excuses. We stand behind our work because we know it's done properly. This guarantee is in writing before you commit."
  },
  {
    question: "Do you provide documentation of what you implement?",
    answer: "Yes. Every project includes full documentation explaining what schema types we implemented, how they're connected, where they're located in your code, and why we made specific decisions. You'll never be left wondering what we did or how to maintain it."
  },
  {
    question: "How much does schema markup implementation cost?",
    answer: "Standalone schema implementation starts from £750 for straightforward sites. Complex sites with multiple locations, services, or extensive existing schema issues cost more. Most projects fall between £750-£2,000. Our quote calculator gives you a specific price based on your requirements."
  },
  {
    question: "Will I need to update the schema over time?",
    answer: "Schema standards evolve slowly, so major updates are rare. However, when your business information changes (new services, updated hours, additional locations), the schema should be updated too. We offer maintenance packages or can train your team to make basic updates."
  },
  {
    question: "What if I'm already working with another SEO agency?",
    answer: "We work alongside other agencies all the time. Schema implementation is specialised work that most general SEO agencies outsource anyway. We can implement schema while your existing agency handles other aspects of your digital marketing. No conflict, no drama."
  },
  {
    question: "Is schema markup dead in 2026?",
    answer: "The opposite. 99.7% of websites still lack proper schema markup, yet AI systems rely on it more than ever to understand and recommend businesses. Schema has become the primary language AI chatbots use to decide which businesses to cite. Google, ChatGPT, Perplexity, and Claude all parse schema data to build their understanding of your business. Ignoring schema in 2026 is like ignoring mobile in 2015."
  },
  {
    question: "How does schema markup help with AI search specifically?",
    answer: "AI chatbots like ChatGPT and Perplexity need structured context to recommend your business. Schema provides exactly this: your business name, services, location, credentials, and relationships. Without schema, AI sees unstructured text and guesses. With schema, AI receives explicit facts it can confidently cite. This is why ScopeSite's V.O.I.C.E™ methodology puts schema at the centre of every AI visibility project."
  },
];

// Generate page schema
const pageSchema = generateLandingPageSchema(
  PAGE_URL,
  'Schema Markup Services',
  'Schema Markup Services | Professional JSON-LD Implementation UK',
  'Expert schema markup implementation that makes your business visible to AI. 100% validation guarantee. Professional structured data services for UK businesses.',
  faqs,
  {
    name: 'Schema Markup Services',
    alternateNames: ['Structured Data Services', 'JSON-LD Implementation', 'Schema Markup Implementation'],
    description: 'Professional schema markup implementation service with 100% validation guarantee. Hand-coded JSON-LD structured data for AI visibility and rich results.',
  },
  undefined,
  {
    isRelatedTo: [
      { '@id': `${BASE_URL}/web-design/#service` },
      { '@id': `${BASE_URL}/ai-seo-services/#service` },
    ],
    availableChannel: generateServiceChannels(),
  }
);

export default function SchemaMarkupLayout({
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
