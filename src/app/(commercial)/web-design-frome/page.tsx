import Link from 'next/link';
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
    title: "Your website doesn't reflect Frome's creative identity",
    description: "Frome is one of the most creative towns in the South West. Catherine Hill, the independent market, the arts scene. But most Frome business websites look like they were built from the same tired WordPress template. Your online presence should be as distinctive as the town itself."
  },
  {
    title: "Invisible to the people searching for Frome businesses",
    description: "When someone asks ChatGPT for a recommendation in Frome, or searches Google for a local service, your website needs to be structured for those platforms. Most Frome business sites have no schema markup, no AI-readable structure, and load too slowly to rank."
  },
  {
    title: "Paying Bath or Bristol prices for an agency that's never visited Frome",
    description: "Big city agencies charge premium rates and treat Frome as a footnote on their Somerset coverage. They don't know Catherine Hill from Cheap Street. You deserve a web designer who lives here and understands the local market."
  },
];

const solutionFeatures = [
  { title: "Based in Frome", description: "Beckington, Frome. Local to the town centre. Face-to-face meetings any time" },
  { title: "AI-first approach", description: "Your business gets recommended by ChatGPT and voice assistants" },
  { title: "Built for local businesses", description: "Designed for Frome's independent retailers, creatives, and service providers" },
  { title: "Fair pricing", description: "From £1,875 or £2,000 Ultra Fast. No big-city agency markup for a local business" },
];

const whatYouGetCards = [
  {
    title: "Professional Design",
    iconNode: <Palette className="w-6 h-6 text-brand-gold" />,
    items: [
      "Custom design reflecting your brand",
      "Mobile-first responsive layout",
      "Conversion-optimised pages",
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
      "Frome-specific local schema",
      "Citation building",
      "Maps integration",
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

export default function WebDesignFromePage() {
  return (
    <>
      <LandingHero
        badge="Frome Web Design"
        badgeIcon={<MapPin className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="WEB DESIGN FROME:"
        headline="AI-FIRST WEBSITES FOR LOCAL BUSINESSES"
        subheadline="AI-optimised websites built by a Frome-based studio."
        bodyCopy={
          <>
            <p className="mb-4">
              This is our home town. ScopeSite Digital Studios is based in Beckington, Frome. We know Catherine Hill, the independent market, the creative community, and the businesses that make this town what it is. For a straight read on local search in the year ahead, we published a dedicated guide to{' '}
              <Link href="/blog/seo-frome-businesses-2026" className="text-brand-gold hover:underline">
                SEO for Frome businesses in 2026
              </Link>
              — what changed, and what still matters on the ground.
            </p>
            <p className="mb-4">
              Frome deserves better than generic templates built by agencies who&apos;ve never set foot here.
            </p>
            <p>
              We build AI-optimised websites on Next.js that score 100/100 on Google Lighthouse, get your business recommended by ChatGPT, and actually reflect what makes Frome special. Veteran-owned, transparent pricing, and always available for a face-to-face meeting in town. If you are tired of mystery quotes, our write-up on{' '}
              <Link
                href="/blog/how-much-should-a-website-cost-in-frome-and-why-most-quotes-are-either-a-rip-off-or-a-waste-of-money"
                className="text-brand-gold hover:underline"
              >
                what a Frome website should actually cost
              </Link>
              {' '}
              walks through the numbers in plain English.
            </p>
          </>
        }
      />

      <LandingProblem
        title="FROME BUSINESSES DESERVE BETTER"
        intro="Frome's independent spirit isn't reflected online. Here's what we keep seeing:"
        problems={problemPoints}
        conclusion={{
          title: "Frome Deserves:",
          text: "Web design from someone who lives here, charges fairly, and builds for how people actually search in 2026."
        }}
      />

      <LandingSolution
        title="WEB DESIGN THAT WORKS FOR FROME"
        features={solutionFeatures}
        layout="table"
      />

      <LandingWhatYouGet
        title="WHAT'S INCLUDED IN FROME WEB DESIGN"
        cards={whatYouGetCards}
        columns={4}
      />

      <LandingAreasServed
        title="SERVING FROME AND SURROUNDING AREAS"
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
            title: "AI visibility",
            description: "Get recommended by ChatGPT, Perplexity, and AI assistants using our proprietary methodology.",
            href: "/voice"
          },
          {
            title: "Pricing",
            description: "Transparent pricing for all our web design and SEO packages",
            href: "/pricing"
          },
          {
            title: "H4TLT Case Study",
            description: "Read about our work with H4TLT, a workplace hearing surveillance provider.",
            href: "/case-studies/h4tlt"
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
        title="FROME WEB DESIGN: YOUR QUESTIONS ANSWERED"
        items={faqItems}
        theme="light"
      />

      <LandingCTA
        title="LET'S BUILD SOMETHING FOR FROME"
        description="Get an instant quote in 60 seconds, or book a call for a proper conversation about what your Frome business needs."
        footnote="No obligation • Transparent pricing • Veteran-owned"
      />
    </>
  );
}
