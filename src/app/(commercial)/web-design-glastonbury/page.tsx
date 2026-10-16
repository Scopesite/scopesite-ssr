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
    title: "Generic templates that look like every other shop on the High Street",
    description: "Most Glastonbury businesses end up with WordPress sites that look identical to their neighbours. Same themes, same layouts, same slow load times. In a town that thrives on being unique, your website shouldn't look like a template."
  },
  {
    title: "Invisible to the tourists researching their trip",
    description: "Glastonbury draws visitors from across the world. They're asking ChatGPT, Google, and voice assistants 'What to do in Glastonbury' before they arrive. If your business isn't structured for AI search, you're invisible to these visitors before they even set foot in town."
  },
  {
    title: "Paying Bristol prices for someone who doesn't get Glastonbury",
    description: "Bristol agencies charge premium rates and treat Glastonbury as 'just another Somerset town'. They don't understand the festival economy, the pilgrimage tourism, or the independent creative scene that makes this market different."
  },
];

const solutionFeatures = [
  { title: "25 minutes from Glastonbury", description: "Based in Frome, local to Somerset, available for face-to-face meetings" },
  { title: "AI-first approach", description: "Your business gets recommended by ChatGPT and voice assistants" },
  { title: "Tourism-ready design", description: "Structured for the visitors researching before they arrive" },
  { title: "Fair pricing", description: "From £1,875 or £2,000 Ultra Fast, not Bristol agency rates for Glastonbury businesses" },
];

const whatYouGetCards = [
  {
    title: "Professional Design",
    iconNode: <Palette className="w-6 h-6 text-brand-gold" />,
    items: [
      "Custom design reflecting your brand",
      "Mobile-first responsive",
      "Tourism-optimised layouts",
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
      "Glastonbury local schema",
      "Tourism-focused citation building",
      "Maps integration",
    ],
  },
];



const glastonburyAreas = [
  'Glastonbury Town Centre',
  'Street',
  'Wells',
  'Shepton Mallet',
  'Somerton',
  'Castle Cary',
  'Bruton',
  'Pilton',
];

export default function WebDesignGlastonburyPage() {
  return (
    <>
      <LandingHero
        badge="Glastonbury Web Design"
        badgeIcon={<MapPin className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="WEB DESIGN IN GLASTONBURY"
        headline=""
        subheadline="AI-optimised websites for Glastonbury's independent businesses."
        bodyCopy={
          <>
            <p className="mb-4">
              Glastonbury isn&apos;t like anywhere else. The town runs on tourism, independent retailers, creative studios, and businesses with stories worth telling. Your website should reflect that - not look like a generic template you could find anywhere.
            </p>
            <p className="mb-4">
              But it also needs to work harder than looking good.
            </p>
            <p>
              When visitors plan their trip to Glastonbury, they&apos;re asking ChatGPT and Google for recommendations. When locals search for services, voice assistants are answering. ScopeSite builds websites that get your Glastonbury business found by all of them. Based in Frome, 25 minutes away, veteran-owned, and priced fairly.
            </p>
          </>
        }
      />

      <LandingProblem
        title="GLASTONBURY BUSINESSES DESERVE BETTER"
        intro="Glastonbury's digital presence doesn't match its reputation. Here's what we keep seeing:"
        problems={problemPoints}
        conclusion={{
          title: "Glastonbury Deserves:",
          text: "Web design from someone who understands the town, charges fairly, and builds for how people actually search in 2026."
        }}
      />

      <LandingSolution
        title="WEB DESIGN THAT WORKS FOR GLASTONBURY"
        features={solutionFeatures}
        layout="table"
      />

      <LandingWhatYouGet
        title="WHAT'S INCLUDED IN GLASTONBURY WEB DESIGN"
        cards={whatYouGetCards}
        columns={4}
      />

      <LandingAreasServed
        title="SERVING GLASTONBURY AND SURROUNDING AREAS"
        homeBase="Frome"
        towns={glastonburyAreas}
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
        title="MORE SERVICES NEAR GLASTONBURY"
        services={[
          {
            title: "Web Design Somerset",
            description: "Our county-wide web design service",
            href: "/web-design-somerset"
          },
          {
            title: "SEO Somerset",
            description: "AI-powered search optimisation for Somerset",
            href: "/seo-somerset"
          },
          {
            title: "Web Design Bath",
            description: "Serving businesses across Bath and surrounds",
            href: "/web-design-bath"
          },
          {
            title: "AI visibility",
            description: "Get recommended by ChatGPT, Perplexity, and AI assistants using our proprietary methodology.",
            href: "/voice"
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
        title="GLASTONBURY WEB DESIGN: YOUR QUESTIONS ANSWERED"
        items={faqItems}
        theme="light"
      />

      <LandingCTA
        title="LET'S BUILD SOMETHING FOR GLASTONBURY"
        description="Get an instant quote in 60 seconds, or book a call for a proper conversation about what your Glastonbury business needs."
        footnote="No obligation • Transparent pricing • Veteran-owned"
      />
    </>
  );
}
