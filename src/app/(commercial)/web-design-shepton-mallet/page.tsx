import { MapPin, Palette, Server, Brain, Map } from 'lucide-react';
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
    title: "Outdated websites that don't reflect your business",
    description: "Shepton Mallet has a strong community of independent businesses, from shops around the market cross to enterprises near the Royal Bath and West Showground. Too many are stuck with dated WordPress sites that load slowly and look like they were built a decade ago."
  },
  {
    title: "Invisible to AI search and voice assistants",
    description: "When someone asks ChatGPT 'Where can I find a good business in Shepton Mallet?' or uses voice search on their phone, your site needs structured data to appear. Most local sites don't have it, which means they're missing out entirely."
  },
  {
    title: "Paying too much for too little",
    description: "Bristol and Bath agencies charge premium rates but treat Shepton Mallet as an afterthought. You end up paying city prices for a generic site built by someone who has never set foot in the town."
  },
];

const solutionFeatures = [
  { title: "15 minutes from Shepton Mallet", description: "Based in Frome, local to Somerset, available for face-to-face meetings" },
  { title: "AI-ready from day one", description: "Schema markup, SSR, and structured content so AI platforms recommend your business" },
  { title: "Built for local businesses", description: "Designed for independent shops, service providers, and the businesses that make Shepton Mallet tick" },
  { title: "Fair pricing", description: "From £1,875 or £2,000 Ultra Fast. No Bristol agency markups for a Somerset town." },
];

const whatYouGetCards = [
  {
    title: "Professional Design",
    iconNode: <Palette className="w-6 h-6 text-brand-gold" />,
    items: [
      "Custom design reflecting your brand",
      "Mobile-first responsive layout",
      "Designed for local businesses",
      "Professional photography guidance",
    ],
  },
  {
    title: "Technical Excellence",
    iconNode: <Server className="w-6 h-6 text-brand-gold" />,
    items: [
      "Next.js server-side rendering",
      "Sub-2-second load times",
      "100% Lighthouse accessibility",
      "SSL security certificate",
    ],
  },
  {
    title: "AI Visibility",
    iconNode: <Brain className="w-6 h-6 text-brand-gold" />,
    items: [
      "Complete schema markup",
      "AI SEO tuning",
      "Voice search configuration",
      "ChatGPT recommendation testing",
    ],
  },
  {
    title: "Local SEO",
    iconNode: <Map className="w-6 h-6 text-brand-gold" />,
    items: [
      "Google Business Profile optimisation",
      "Shepton Mallet local schema",
      "Citation building for Somerset",
      "Maps integration",
    ],
  },
];



const sheptonMalletTowns = [
  'Shepton Mallet Town Centre',
  'Pilton',
  'Glastonbury',
  'Wells',
  'Croscombe',
  'Doulting',
  'Evercreech',
  'Frome',
];

export default function WebDesignSheptonMalletPage() {
  return (
    <>
      <LandingHero
        badge="Shepton Mallet Web Design"
        badgeIcon={<MapPin className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="WEB DESIGN SHEPTON MALLET:"
        headline="AI-READY WEBSITES FOR LOCAL BUSINESSES"
        subheadline="AI-optimised websites for Shepton Mallet businesses, built by ScopeSite."
        bodyCopy={
          <>
            <p className="mb-4">
              Shepton Mallet is a town with real character. Home to the Royal Bath and West Showground, Kilver Court, and a proud cider heritage, it&apos;s a place where independent businesses matter. Your website should do that reputation justice.
            </p>
            <p className="mb-4">
              But looking good isn&apos;t enough any more. Your site needs to work for AI search too.
            </p>
            <p>
              When people ask ChatGPT or Google for local recommendations, structured data decides who gets mentioned. ScopeSite builds websites that get your Shepton Mallet business found by search engines, AI platforms, and voice assistants. We&apos;re based 15 minutes away in Frome, veteran-owned, and priced fairly.
            </p>
          </>
        }
      />

      <LandingProblem
        title="SHEPTON MALLET BUSINESSES DESERVE BETTER"
        intro="Shepton Mallet has a thriving local economy, but many businesses are being let down by their websites:"
        problems={problemPoints}
        conclusion={{
          title: "Shepton Mallet Deserves:",
          text: "Web design from someone local who understands the town, charges fairly, and builds for how people actually search in 2026."
        }}
      />

      <LandingSolution
        title="WEB DESIGN THAT WORKS FOR SHEPTON MALLET"
        features={solutionFeatures}
        layout="table"
      />

      <LandingWhatYouGet
        title="WHAT'S INCLUDED IN SHEPTON MALLET WEB DESIGN"
        cards={whatYouGetCards}
        columns={4}
      />

      <LandingAreasServed
        title="SERVING SHEPTON MALLET AND SURROUNDING AREAS"
        homeBase="Frome"
        towns={sheptonMalletTowns}
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
        title="MORE SERVICES NEAR SHEPTON MALLET"
        services={[
          {
            title: "AI visibility",
            description: "Get recommended by ChatGPT, Perplexity, and AI assistants using our proprietary methodology.",
            href: "/voice"
          },
          {
            title: "Pricing",
            description: "Transparent pricing for all our web design packages.",
            href: "/pricing"
          },
          {
            title: "Web Design Somerset",
            description: "Our county-wide web design service for Somerset businesses.",
            href: "/web-design-somerset"
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
        title="SHEPTON MALLET WEB DESIGN: YOUR QUESTIONS ANSWERED"
        items={faqItems}
        theme="light"
      />

      <LandingCTA
        title="LET'S BUILD SOMETHING FOR SHEPTON MALLET"
        description="Get an instant quote in 60 seconds, or book a call for a proper conversation about what your Shepton Mallet business needs."
        footnote="No obligation • Transparent pricing • Veteran-owned"
      />
    </>
  );
}
