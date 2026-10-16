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
    title: "Your SEO agency is optimising for 2019",
    description: "Most SEO agencies in Somerset are still focused on keyword density, backlink schemes, and monthly reports full of vanity metrics. Meanwhile, your potential customers are asking ChatGPT and Perplexity for recommendations instead of scrolling through Google results."
  },
  {
    title: "AI doesn't know your business exists",
    description: "Search engines and AI assistants can use different routes to your business. We check accessible content, accurate business facts and the answers your buyers actually see. Structured data helps describe those facts; it does not guarantee a recommendation."
  },
  {
    title: "Rankings aren't the whole picture anymore",
    description: "You could rank #1 on Google and still lose customers to a competitor that ChatGPT recommends first. The search landscape has changed. Somerset businesses need SEO that covers Google, AI platforms, and voice search."
  },
];

const solutionFeatures = [
  { title: "AI visibility methodology", description: "Get recommended by ChatGPT, not just indexed by Google" },
  { title: "Technical SEO Foundation", description: "Schema markup, SSR, sub-2-second load times" },
  { title: "Local Search Dominance", description: "Google Business Profile, local citations, geographic targeting" },
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
      "Somerset-specific local schema",
      "NAP consistency audit",
      "Local citation building",
      "Review management strategy",
    ],
  },
];



const somersetTowns = [
  'Frome',
  'Taunton',
  'Yeovil',
  'Bridgwater',
  'Glastonbury',
  'Wells',
  'Shepton Mallet',
  'Street',
  'Chard',
  'Weston-super-Mare',
  'Minehead',
  'Burnham-on-Sea',
  'Wellington',
  'Ilminster',
];

export default function SEOSomersetPage() {
  return (
    <>
      <LandingHero
        badge="Somerset SEO"
        badgeIcon={<MapPin className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="SEO SOMERSET:"
        headline="BUILT FOR AI SEARCH"
        subheadline="Search optimisation that goes beyond Google rankings."
        bodyCopy={
          <>
            <p className="mb-4">
              Somerset SEO has a problem. Most agencies here are still playing the same game they played five years ago: stuff keywords, buy links, send you a report you don&apos;t understand, and charge you monthly for the privilege.
            </p>
            <p className="mb-4">
              The search landscape has changed.
            </p>
            <p>
              ScopeSite delivers SEO services in Somerset that cover the full picture: Google rankings, AI recommendations, and voice search visibility. Our AI visibility methodology gets your business found by ChatGPT, Perplexity, and Google. Based in Frome, veteran-owned, and transparent about everything we do.
            </p>
          </>
        }
      />

      <LandingProblem
        title="SOMERSET SEO IS STUCK IN THE PAST"
        intro="Search engine optimisation in Somerset hasn't kept pace with how people actually search in 2026. Here's what's going wrong:"
        problems={problemPoints}
        conclusion={{
          title: "The Bottom Line:",
          text: "Somerset businesses need SEO that covers Google, AI platforms, and voice search. That is what our AI visibility work delivers."
        }}
      />

      <LandingSolution
        title="SEO THAT ACTUALLY WORKS IN 2026"
        intro="Our AI visibility methodology covers every way your customers search for businesses like yours:"
        features={solutionFeatures}
        layout="table"
      />

      <LandingWhatYouGet
        title="WHAT'S INCLUDED IN SOMERSET SEO"
        cards={whatYouGetCards}
        columns={4}
      />

      <LandingAreasServed
        title="SEO SERVICES ACROSS SOMERSET"
        homeBase="Frome"
        towns={somersetTowns}
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
        title="MORE SERVICES FOR SOMERSET"
        services={[
          {
            title: "AI visibility methodology",
            description: "Our AI visibility framework explained in full",
            href: "/voice"
          },
          {
            title: "Web Design Somerset",
            description: "AI-first websites for Somerset businesses",
            href: "/web-design-somerset"
          },
          {
            title: "AI SEO Services",
            description: "National AI search optimisation services",
            href: "/ai-seo-services"
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
        title="SOMERSET SEO: YOUR QUESTIONS ANSWERED"
        items={faqItems}
        theme="light"
      />

      <LandingCTA
        title="GET FOUND BY AI AND GOOGLE"
        description="Stop paying for SEO that only targets half the search landscape. Get a free AI visibility audit and find out exactly where your Somerset business stands."
        footnote="No obligation • Free AI audit • Veteran-owned"
      />
    </>
  );
}
