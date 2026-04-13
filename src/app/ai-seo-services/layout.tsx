import { Metadata } from 'next';
import { generateLandingPageSchema, generateServiceChannels, type FAQItem } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/ai-seo-services`;

export const metadata: Metadata = {
  title: 'AI SEO Services UK | Get Recommended by ChatGPT & AI Platforms',
  description: 'AI SEO services that get your business recommended by ChatGPT, Perplexity, and voice assistants. UK agency specialising in AI search optimisation with proven results.',
  keywords: ['ai seo services', 'ai seo agency uk', 'chatgpt seo', 'ai search optimisation'],
  alternates: {
    canonical: PAGE_URL,
  },
};

// FAQ data for schema
const faqs: FAQItem[] = [
  {
    question: "What's the difference between traditional SEO and AI SEO?",
    answer: "Traditional SEO focuses on Google rankings through keywords, backlinks, and on-page optimisation. AI SEO focuses on getting recommended by AI platforms through schema markup, entity relationships, and content structure. Both matter, but they require different approaches. You can rank #1 on Google and still be invisible to ChatGPT."
  },
  {
    question: "How do you get ChatGPT to recommend my business?",
    answer: "ChatGPT uses structured data, entity recognition, and content signals to decide which businesses to recommend. We implement schema markup that explicitly describes your business, services, location, and credentials. We structure your content so ChatGPT can extract clear answers. And we ensure AI crawlers can access and understand your site."
  },
  {
    question: "How long does AI SEO take to show results?",
    answer: "Most clients see improvements in AI recommendations within 4-8 weeks. AI platforms re-crawl and update their understanding faster than traditional Google indexing. However, building strong entity recognition in knowledge graphs is an ongoing process that improves over time."
  },
  {
    question: "Do I still need traditional SEO if I do AI SEO?",
    answer: "Yes. Google isn't going away, and many people still use traditional search. AI SEO and traditional SEO complement each other - good schema markup helps Google too, and quality content works across all platforms. We recommend doing both, which is why our packages include elements of each."
  },
  {
    question: "What AI platforms do you optimise for?",
    answer: "We optimise for ChatGPT, Perplexity, Claude, Google's AI Overviews, Bing Copilot, and voice assistants including Siri, Alexa, and Google Assistant. Our approach uses universal structured data standards that work across all platforms rather than trying to game individual systems."
  },
  {
    question: "How do you measure AI SEO success?",
    answer: "We track direct AI mentions (when ChatGPT recommends you by name), voice search appearances, schema validation scores, and AI crawler access logs. We also benchmark against competitors' AI visibility. Traditional metrics like rankings and traffic matter too, but AI recommendation is our primary success metric."
  },
  {
    question: "What's the V.O.I.C.E™ methodology?",
    answer: "V.O.I.C.E.™ stands for Visibility, Optimisation, for Intelligent, Crawler, Engines. It's our proprietary methodology that combines server-side rendering, structured data engineering, and content architecture specifically designed for generative AI citation. V.O.I.C.E.™ is the only systemised AI visibility methodology offered by a web design agency in the South West."
  },
  {
    question: "What is the difference between GEO and SEO?",
    answer: "SEO (Search Engine Optimisation) targets Google rankings through keywords, backlinks, and technical optimisation. GEO (Generative Engine Optimisation) targets AI chatbot recommendations through structured data, entity graphs, and content engineering. SEO gets you ranked. GEO gets you recommended. In 2026, you need both. Google Trends UK shows 'geo vs seo' searches have grown over 1,150% in the past year."
  },
  {
    question: "What is Answer Engine Optimisation (AEO)?",
    answer: "AEO is the practice of optimising your website so AI-powered answer engines (ChatGPT, Perplexity, Gemini, Claude) can extract, understand, and cite your content. It focuses on structured data, clear factual content, and entity relationships. AEO and GEO are closely related, and both are part of ScopeSite's V.O.I.C.E™ methodology."
  },
  {
    question: "How do AI search engines decide which businesses to recommend?",
    answer: "AI search engines use several signals: JSON-LD schema markup that describes your business, content structured in a way AI can extract, server-side rendered HTML (not client-side JavaScript), authority signals from backlinks and entity graphs, and freshness of content. Websites built on WordPress or Wix often fail multiple criteria because they rely on client-side rendering and plugin-generated schema."
  },
  {
    question: "Can my existing website be optimised for AI search?",
    answer: "It depends on the tech stack. WordPress can be partially optimised with custom code (not plugins). Wix and Squarespace have limited options. Server-side rendered sites (Next.js, Nuxt) are the gold standard because AI crawlers receive complete HTML on every request. During our audit, we assess what is achievable on your current platform."
  },
  {
    question: "How long does it take to appear in AI search results?",
    answer: "Typically 4-12 weeks depending on your existing authority and the competitiveness of your industry. AI platforms re-crawl faster than Google, but building strong entity recognition takes time. Early wins (like appearing in Perplexity results) often happen within 4 weeks. Consistent ChatGPT recommendations usually take 8-12 weeks."
  },
  {
    question: "How much does AI SEO cost?",
    answer: "AI SEO packages start from £750/month for ongoing optimisation. One-time implementations for smaller projects start from £1,500. The exact cost depends on your site's current state, competition level, and goals. Our quote calculator gives you a specific price based on your requirements."
  },
  {
    question: "Can you help with voice search specifically?",
    answer: "Yes. Voice search optimisation is a core part of our AI SEO services. We implement speakable schema markup, optimise content for conversational queries, and structure FAQ sections for voice assistant extraction. Voice search accounts for 58% of local searches - it's not optional anymore."
  },
  {
    question: "What if my industry is very competitive?",
    answer: "Competitive industries often benefit most from AI SEO because fewer competitors are doing it properly. While everyone fights over Google rankings, the AI recommendation space is relatively uncrowded. Getting in early on AI optimisation gives you an advantage that's hard for competitors to replicate quickly."
  },
  {
    question: "Do you work with e-commerce businesses?",
    answer: "Yes. E-commerce AI SEO includes Product schema, Offer schema, AggregateRating schema, and FAQ schema for product pages. We optimise for product-related AI queries like 'best X for Y' and 'where to buy Z'. The principles are the same, but the implementation is tailored to e-commerce needs."
  },
  {
    question: "What's included in your AI visibility audit?",
    answer: "Our audit checks how ChatGPT currently describes your business, your schema markup status, AI crawler access configuration, competitor AI visibility, voice search phrase opportunities, and knowledge graph presence. You get a detailed report with specific recommendations and priority actions."
  },
  {
    question: "How often do you report on results?",
    answer: "Monthly reports are standard, covering AI visibility metrics, schema validation status, new AI mentions detected, and recommendations for continued improvement. We also provide quarterly strategy reviews to adjust our approach based on results and any changes in the AI landscape."
  },
  {
    question: "Can AI SEO help with local business visibility?",
    answer: "Absolutely. Local businesses see some of the biggest gains from AI SEO because local searches are heavily shifting to voice assistants and AI. When someone asks 'Who's the best plumber near me?', proper LocalBusiness schema and entity relationships determine whether you get mentioned."
  },
  {
    question: "What makes your approach different from other AI SEO agencies?",
    answer: "Most agencies claiming to do AI SEO are just adding schema plugins and calling it done. We hand-code all schema markup, build proper entity relationships, validate against Schema.org standards (not just Google's limited tool), and actually test AI recommendations. Our 100% schema validation guarantee is unique in the industry."
  },
  {
    question: "Do I need a new website for AI SEO to work?",
    answer: "Not necessarily. If your current site allows custom code, we can implement AI optimisation without rebuilding. However, some platforms severely limit what's possible. During the audit, we'll tell you honestly whether your current setup can support proper AI SEO or if a rebuild makes more sense."
  },
  {
    question: "What guarantee do you offer?",
    answer: "We guarantee 100% schema validation against Schema.org standards. We also guarantee specific deliverables in writing before you commit - audit completion, schema implementation, and ongoing monitoring. We can't guarantee specific ChatGPT rankings (no one legitimately can), but we guarantee the work that creates visibility."
  },
];

  // Generate page schema
  const pageSchema = generateLandingPageSchema(
    PAGE_URL,
    'AI SEO Services',
    'AI SEO Services UK | Get Recommended by ChatGPT & AI Platforms',
    'AI SEO services that get your business recommended by ChatGPT, Perplexity, and voice assistants. UK agency specialising in AI search optimisation with proven results.',
    faqs,
    {
      name: 'AI SEO Services',
      alternateNames: ['AI Search Optimisation', 'ChatGPT SEO', 'AI SEO Agency', 'Artificial Intelligence SEO'],
      description: 'AI SEO services that get your business recommended by ChatGPT, Perplexity, and voice assistants using the V.O.I.C.E™ methodology.',
    },
    undefined,
    {
      isRelatedTo: [
        { '@id': `${BASE_URL}/schema-markup/#service` },
        { '@id': `${BASE_URL}/web-design/#service` },
      ],
      availableChannel: generateServiceChannels(),
    },
    ['h1', '.hero-description', '.faq-answer', 'h2']
  );

export default function AISEOServicesLayout({
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
