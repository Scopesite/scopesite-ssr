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
    title: "Generic websites that don't stand out in a competitive market",
    description: "Westbury sits on the A350 corridor between Trowbridge and Warminster. Businesses here compete with larger towns on both sides. A template WordPress site isn't going to cut it when your neighbours are investing in proper design."
  },
  {
    title: "Invisible to AI search and voice assistants",
    description: "When someone asks 'Find a good business near Westbury' through ChatGPT or a voice assistant, structured data determines who gets mentioned. Most Westbury business websites have no schema markup at all, which means they're missing out on an entirely new search channel."
  },
  {
    title: "Overpaying for agencies that don't know the area",
    description: "Bath and Salisbury agencies charge premium rates but treat Westbury as a pin on a map. You end up paying city prices for a generic site built by someone who doesn't understand the local market or the Wiltshire/Somerset border economy."
  },
];

const solutionFeatures = [
  { title: "15 minutes from Westbury", description: "Based in Frome, right across the county border, available for face-to-face meetings" },
  { title: "AI-optimised as standard", description: "Schema markup, SSR, and structured content so AI platforms recommend your business" },
  { title: "Built for Wiltshire businesses", description: "Designed for the local businesses along the A350 corridor and beyond" },
  { title: "Fair pricing", description: "From £1,875 or £2,000 Ultra Fast. No Bath or Salisbury agency markups." },
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
      "Westbury and Wiltshire local schema",
      "Citation building across both counties",
      "Maps integration",
    ],
  },
];



const westburyTowns = [
  'Westbury Town Centre',
  'Warminster',
  'Trowbridge',
  'Frome',
  'Bratton',
  'Dilton Marsh',
  'Chapmanslade',
  'Steeple Ashton',
];

export default function WebDesignWestburyPage() {
  return (
    <>
      <LandingHero
        badge="Westbury Web Design"
        badgeIcon={<MapPin className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="WEB DESIGN WESTBURY:"
        headline="PROFESSIONAL WEBSITES FOR WILTSHIRE BUSINESSES"
        subheadline="AI-optimised websites for Westbury businesses, built by ScopeSite."
        bodyCopy={
          <>
            <p className="mb-4">
              Westbury is a growing Wiltshire town with a strong local economy. From businesses near the famous White Horse to shops in the town centre and enterprises along the A350 corridor towards Trowbridge, there&apos;s real ambition here. Your website should match it.
            </p>
            <p className="mb-4">
              But a good-looking site isn&apos;t enough on its own any more.
            </p>
            <p>
              When people search for local services, they&apos;re increasingly asking AI assistants and voice search for answers. Structured data and proper markup decide who gets recommended. ScopeSite builds websites that get your Westbury business found by search engines, AI platforms, and voice assistants. We&apos;re based just 15 minutes away in Frome, veteran-owned, and priced fairly.
            </p>
          </>
        }
      />

      <LandingProblem
        title="WESTBURY BUSINESSES DESERVE BETTER"
        intro="Westbury's local businesses are being let down by their online presence. Here's what we keep seeing:"
        problems={problemPoints}
        conclusion={{
          title: "Westbury Deserves:",
          text: "Web design from someone nearby who understands the local market, charges fairly, and builds for how people actually search in 2026."
        }}
      />

      <LandingSolution
        title="WEB DESIGN THAT WORKS FOR WESTBURY"
        features={solutionFeatures}
        layout="table"
      />

      <LandingWhatYouGet
        title="WHAT'S INCLUDED IN WESTBURY WEB DESIGN"
        cards={whatYouGetCards}
        columns={4}
      />

      <LandingAreasServed
        title="SERVING WESTBURY AND SURROUNDING AREAS"
        homeBase="Frome"
        towns={westburyTowns}
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
        title="MORE SERVICES NEAR WESTBURY"
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
            title: "Web Design Trowbridge",
            description: "Web design for businesses in neighbouring Trowbridge.",
            href: "/web-design-trowbridge"
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
        title="WESTBURY WEB DESIGN: YOUR QUESTIONS ANSWERED"
        items={faqItems}
        theme="light"
      />

      <LandingCTA
        title="LET'S BUILD SOMETHING FOR WESTBURY"
        description="Get an instant quote in 60 seconds, or book a call for a proper conversation about what your Westbury business needs."
        footnote="No obligation • Transparent pricing • Veteran-owned"
      />
    </>
  );
}
