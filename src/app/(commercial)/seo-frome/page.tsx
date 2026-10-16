import { MapPin, Search, Brain, Shield, Map } from 'lucide-react';
import { LandingHero } from '@/components/landing';
import {
  DynamicLandingProblem as LandingProblem,
  DynamicLandingSolution as LandingSolution,
  DynamicLandingWhatYouGet as LandingWhatYouGet,
  DynamicLandingProof as LandingProof,
  DynamicLandingRelatedServices as LandingRelatedServices,
  DynamicLandingCaseStudy as LandingCaseStudy,
  DynamicFAQSection as FAQSection,
  DynamicLandingCTA as LandingCTA,
  DynamicLandingAreasServed as LandingAreasServed,
} from '@/components/landing/below-fold-dynamic';
import { faqItems } from './faqs';
import { websiteEvidenceChecks as proofStats } from '@/lib/website-evidence-checks';

const problemPoints = [
  {
    title: "Your SEO agency has never been to Frome",
    description: "Most SEO agencies serving Frome are based in Bristol or Bath. They treat your town as a pin on a map, not a community they understand. They don't know the difference between Catherine Hill and the Cheese & Grain. Local knowledge matters for local SEO."
  },
  {
    title: "AI doesn't know your Frome business exists",
    description: "Search engines and AI assistants can use different routes to your business. We check accessible content, accurate business facts and the answers your buyers actually see. Structured data helps describe those facts; it does not guarantee a recommendation."
  },
  {
    title: "You're paying for reports, not results",
    description: "Monthly SEO reports full of vanity metrics and traffic graphs that don't translate to customers. Meanwhile, someone in Frome is asking their phone for a recommendation and your competitor shows up instead. You need SEO that targets how people actually search in 2026."
  },
];

const solutionFeatures = [
  { title: "AI visibility methodology", description: "Get recommended by ChatGPT, not just indexed by Google" },
  { title: "Technical SEO Foundation", description: "Schema markup, SSR, sub-2-second load times" },
  { title: "Local Search Dominance", description: "Google Business Profile, local citations, Frome-specific targeting" },
  { title: "Transparent Reporting", description: "Metrics that matter, not vanity dashboards" },
];

const whatYouGetCards = [
  {
    title: "Technical SEO",
    iconNode: <Search className="w-6 h-6 text-brand-gold" />,
    items: [
      "Complete schema markup validation",
      "Site speed optimisation",
      "Mobile-first indexing",
      "Core Web Vitals tuning",
      "Crawl budget optimisation",
    ],
  },
  {
    title: "AI Visibility (GEO/AEO)",
    iconNode: <Brain className="w-6 h-6 text-brand-gold" />,
    items: [
      "ChatGPT recommendation testing",
      "AI SEO tuning",
      "AI crawler configuration",
      "Structured data engineering",
      "Voice search optimisation",
    ],
  },
  {
    title: "Content & Authority",
    iconNode: <Shield className="w-6 h-6 text-brand-gold" />,
    items: [
      "Content structure for AI",
      "FAQ schema implementation",
      "Topic cluster strategy",
      "Internal linking architecture",
      "E-E-A-T signal strengthening",
    ],
  },
  {
    title: "Local SEO",
    iconNode: <Map className="w-6 h-6 text-brand-gold" />,
    items: [
      "Google Business Profile optimisation",
      "Frome-specific local schema",
      "NAP consistency audit",
      "Local citation building",
      "Review management strategy",
    ],
  },
];



const fromeAreas = [
  'Frome Town Centre',
  'Catherine Hill',
  'Westway',
  'Berkley',
  'Marston Bigot',
  'Nunney',
  'Mells',
  'Coleford',
  'Radstock',
  'Shepton Mallet',
];

export default function SEOFromePage() {
  return (
    <>
      <LandingHero
        badge="Frome SEO"
        badgeIcon={<MapPin className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="SEO FROME:"
        headline="GET YOUR BUSINESS FOUND ON GOOGLE AND AI"
        subheadline="Local SEO and AI visibility from a Frome-based studio."
        bodyCopy={
          <>
            <p className="mb-4">
              Frome is full of brilliant businesses. Creative arts studios, independent retailers on Catherine Hill, food and drink spots, wellness practitioners. The problem isn&apos;t the quality of what you do. It&apos;s that people can&apos;t find you online.
            </p>
            <p className="mb-4">
              Search has changed. Google is only part of the picture now.
            </p>
            <p>
              ScopeSite is based right here in Beckington, Frome. We deliver SEO that covers Google rankings, AI recommendations from ChatGPT and Perplexity, and voice search visibility. Our AI visibility methodology is proven. Veteran-owned, transparent about everything we do, and always available for a coffee and a chat in town.
            </p>
          </>
        }
      />

      <LandingProblem
        title="FROME SEO IS STUCK IN THE PAST"
        intro="Search engine optimisation for Frome businesses hasn't kept pace with how people actually search in 2026. Here's what's going wrong:"
        problems={problemPoints}
        conclusion={{
          title: "The Bottom Line:",
          text: "Frome businesses need SEO that covers Google, AI platforms, and voice search. That is what our AI visibility work delivers."
        }}
      />

      <LandingSolution
        title="SEO THAT ACTUALLY WORKS IN 2026"
        intro="Our AI visibility methodology covers every way your customers search for businesses like yours:"
        features={solutionFeatures}
        layout="table"
      />

      <LandingWhatYouGet
        title="WHAT'S INCLUDED IN FROME SEO"
        cards={whatYouGetCards}
        columns={4}
      />

      <LandingAreasServed
        title="SEO SERVICES ACROSS FROME AND SURROUNDS"
        homeBase="Frome"
        towns={fromeAreas}
        theme="dark"
      />

      <LandingProof
        title="WHAT WE CHECK"
        stats={proofStats}
        theme="light"
      />

      <LandingCaseStudy 
        title="H4TLT case study"
        description="Read about our work with H4TLT, a workplace hearing surveillance provider."
        theme="dark" 
      />

      <LandingRelatedServices
        title="MORE SERVICES FROM SCOPESITE"
        services={[
          {
            title: "AI visibility methodology",
            description: "Our AI visibility framework explained in full",
            href: "/voice"
          },
          {
            title: "Schema Markup",
            description: "Structured data that makes your business machine-readable",
            href: "/schema-markup"
          },
          {
            title: "Web Design Frome",
            description: "AI-first websites built by your local Frome studio",
            href: "/web-design-frome"
          },
          {
            title: "Generative Engine Optimisation",
            description: "Get cited by ChatGPT, Claude, Gemini and Perplexity, not just ranked on Google.",
            href: "/generative-engine-optimisation"
          },
        ]}
        theme="light"
      />

      <FAQSection
        title="FROME SEO: YOUR QUESTIONS ANSWERED"
        items={faqItems}
        theme="light"
      />

      <LandingCTA
        title="GET FOUND BY AI AND GOOGLE"
        description="Stop paying for SEO that only targets half the search picture. Get a free AI visibility audit and find out exactly where your Frome business stands."
        footnote="No obligation • Free AI audit • Veteran-owned"
      />
    </>
  );
}
