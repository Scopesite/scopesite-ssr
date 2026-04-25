import { Metadata } from 'next';
import { generateLandingPageSchema, type FAQItem } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/ai-website-design`;

export const metadata: Metadata = {
  title: 'AI Website Design | Built for ChatGPT | ScopeSite',
  description: 'AI website design that gets your business recommended by ChatGPT, not just indexed. UK agency specialising in AI-first web design with V.O.I.C.E™ methodology.',
  keywords: ['ai website design', 'ai web design', 'ai powered website design', 'chatgpt website optimisation'],
  openGraph: {
    title: 'AI Website Design | Websites Built for ChatGPT & Voice Search',
    description: 'AI website design that gets your business recommended by ChatGPT, not just indexed. UK agency specialising in AI-first web design with V.O.I.C.E™ methodology.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-ai-website-design.png`,
        width: 1200,
        height: 630,
        alt: 'AI Website Design by ScopeSite - Built for ChatGPT and Voice Search',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Website Design | Websites Built for ChatGPT & Voice Search',
    description: 'AI website design that gets your business recommended by ChatGPT, not just indexed. UK agency specialising in AI-first web design.',
    images: [`${BASE_URL}/images/og/og-ai-website-design.png`],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

// FAQ data for schema
const faqs: FAQItem[] = [
  {
    question: "What's the difference between AI website design and regular web design?",
    answer: "Regular web design focuses on how humans see your site. AI website design focuses on how machines read it. We add schema markup, entity relationships, and structured content that AI platforms can understand. Without this, AI literally cannot recommend your business because it doesn't know what you do or where you operate."
  },
  {
    question: "Will my website still look good to human visitors?",
    answer: "Absolutely. The AI optimisation happens in the code, not the design. Your visitors see a beautiful, fast, easy-to-use website. The AI layer works behind the scenes, making your content machine-readable without affecting the visual experience."
  },
  {
    question: "How long before I see results from AI-optimised design?",
    answer: "Most clients see AI recommendation improvements within 4-8 weeks. AI platforms need time to re-crawl and process your new structured data. Unlike traditional SEO that can take 6-12 months, AI visibility tends to improve faster because the signals are clearer."
  },
  {
    question: "Do I need to replace my entire website?",
    answer: "Not always. If your current site is built on solid foundations, we can add the AI visibility layer without a complete rebuild. However, if you're on an older platform or have significant technical debt, a rebuild is often more cost-effective than retrofitting."
  },
  {
    question: "What's schema markup and why does it matter?",
    answer: "Schema markup is code that tells AI exactly what your content means. Instead of AI guessing that 'John Smith' is a person, schema explicitly states 'This is a person, they're the founder of this business, they offer these services.' Without schema, AI is guessing. With it, AI knows."
  },
  {
    question: "Which AI platforms will my website work with?",
    answer: "We optimise for ChatGPT, Perplexity, Claude, Google's AI Overviews, Bing Copilot, and voice assistants like Siri, Alexa, and Google Assistant. Our approach ensures compatibility across all major AI platforms because we follow universal structured data standards."
  },
  {
    question: "How much does AI website design cost?",
    answer: "Our AI website design packages start from £2,625 for a simple site. Most businesses invest between £5,000-£9,000 for a full AI-optimised website with all the bells and whistles. Use our instant quote calculator for a specific price based on your requirements."
  },
  {
    question: "Can you add AI optimisation to my existing website?",
    answer: "Yes, if your platform supports custom code. We offer V.O.I.C.E™ optimisation as a standalone service for existing websites. This adds schema markup, entity relationships, and AI crawler configuration without rebuilding your entire site."
  },
  {
    question: "What CMS do you use for AI websites?",
    answer: "We build on Next.js with server-side rendering, not WordPress. WordPress sites are slower, harder to optimise, and more vulnerable to security issues. Next.js gives us complete control over the code, faster load times, and better AI crawler access."
  },
  {
    question: "How do you measure AI visibility success?",
    answer: "We track direct AI mentions (when ChatGPT recommends you), schema validation scores, AI crawler access logs, and voice search appearances. We also monitor traditional metrics like rankings and traffic, but AI recommendation is the primary success metric."
  },
  {
    question: "Is AI website design just a fad?",
    answer: "The shift to AI-powered search is accelerating, not slowing. ChatGPT has over 100 million users. Voice search handles 58% of local queries. Google is integrating AI Overviews into search results. This isn't a trend - it's the new reality of how people find businesses."
  },
  {
    question: "What industries benefit most from AI website design?",
    answer: "Service businesses with local presence see the biggest gains - trades, professional services, healthcare, hospitality, and retail. Any business where people search 'best X near me' or 'who should I hire for Y' benefits from AI optimisation."
  },
  {
    question: "Do you offer ongoing maintenance?",
    answer: "Yes. Schema standards evolve, AI platforms update their algorithms, and your business changes. We offer maintenance packages that keep your AI visibility current and monitor for any issues. Most clients choose our monthly support option."
  },
  {
    question: "How is this different from traditional SEO?",
    answer: "Traditional SEO optimises for keyword rankings in Google's blue links. AI website design optimises for recommendation in AI answer engines. Both matter, but the AI side is growing faster. We include both in our approach because you need visibility everywhere."
  },
  {
    question: "What happens during the design process?",
    answer: "We start with an AI visibility audit of your current situation, then move to wireframes and design approval, development with schema implementation, testing across AI platforms, and finally launch with monitoring. The whole process typically takes 4-6 weeks."
  },
  {
    question: "Can I update the website myself after launch?",
    answer: "Yes. We provide training on how to update content while maintaining AI optimisation. For clients who prefer hands-off management, we offer content update services. Either way, you're never locked in or dependent on us."
  },
  {
    question: "What guarantee do you offer?",
    answer: "We guarantee 100% schema validation against Schema.org standards. If your markup doesn't validate, we fix it at no cost. We also guarantee specific load time and accessibility scores in writing before you commit."
  },
];

// Generate page schema
const pageSchema = generateLandingPageSchema(
  PAGE_URL,
  'AI Website Design',
  'AI Website Design | Websites Built for ChatGPT & Voice Search',
  'AI website design that gets your business recommended by ChatGPT, not just indexed. UK agency specialising in AI-first web design with V.O.I.C.E™ methodology.',
  faqs,
  {
    name: 'AI Website Design',
    alternateNames: ['AI Web Design', 'AI-Powered Website Design', 'Artificial Intelligence Website Design'],
    description: 'AI website design service that builds websites optimised for ChatGPT recommendations, voice search, and AI answer engines using schema markup and structured data.',
  },
  undefined,
  undefined,
  ['h1', '.hero-description', '.faq-answer', 'h2']
);

export default function AIWebsiteDesignLayout({
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
