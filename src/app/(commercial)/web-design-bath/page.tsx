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

// Problem points
const problemPoints = [
  {
    title: "A WordPress site built on a theme they use for everyone",
    description: "The typical Bath web agency charges £8,000-£15,000 for a website. For that money, you get a WordPress site, some custom colours and your logo, stock photography that appears on 47 other websites, zero AI optimisation, and ongoing fees to fix things that shouldn't break."
  },
  {
    title: "No AI optimisation - they've never heard of it",
    description: "Meanwhile, your website should load in under 2 seconds (theirs take 4-6), get recommended by ChatGPT (theirs are invisible), convert visitors into customers (theirs look pretty but don't perform), and actually be built custom, not themed."
  },
];

// Solution features
const solutionFeatures = [
  { title: "AI-First Development", description: "Your business gets recommended by ChatGPT, Perplexity, and voice assistants" },
  { title: "Next.js (Not WordPress)", description: "Sub-2-second load times, better security, no plugin nightmares" },
  { title: "Somerset Base", description: "Bath-quality service without Bath-agency overhead costs" },
  { title: "Military Precision", description: "Fixed quotes, met deadlines, no scope creep surprises" },
];

// What you get cards
const whatYouGetCards = [
  {
    title: "Premium Design",
    iconNode: <Palette className="w-6 h-6 text-brand-gold" />,
    items: [
      "Bespoke design (genuinely custom)",
      "Mobile-first responsive",
      "Professional typography",
      "Your brand, not a template",
      "Photography direction included",
    ],
  },
  {
    title: "Technical Excellence",
    iconNode: <Server className="w-6 h-6 text-brand-gold" />,
    items: [
      "Next.js server-side rendering",
      "Sub-2-second load times",
      "100% Lighthouse scores",
      "Enterprise-grade security",
      "GDPR compliance built-in",
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
      "AI crawler access setup",
    ],
  },
  {
    title: "Local SEO",
    iconNode: <Map className="w-6 h-6 text-brand-gold" />,
    items: [
      "Google Business Profile optimisation",
      "Bath-specific local schema",
      "Citation building",
      "Review management setup",
      "Maps integration",
    ],
  },
];

// Proof stats


// Towns served
const bathAreas = [
  'Bath City Centre',
  'Lansdown',
  'Widcombe',
  'Bathwick',
  'Oldfield Park',
  'Keynsham',
  'Midsomer Norton',
  'Radstock',
  'Bradford-on-Avon',
];

export default function WebDesignBathPage() {
  return (
    <>
      {/* Hero Section */}
      <LandingHero
        badge="Bath's AI-First Alternative"
        badgeIcon={<MapPin className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="WEB DESIGN BATH:"
        headline="PREMIUM WITHOUT THE PRICE TAG"
        subheadline="Bath quality. Somerset prices. AI visibility included."
        bodyCopy={
          <>
            <p className="mb-4">
              Bath has no shortage of web design agencies. Most of them charge London rates for Bristol-quality work, talk endlessly about &quot;brand experiences&quot;, and deliver WordPress templates you could have bought for £47.
            </p>
            <p className="mb-4">
              We&apos;re the alternative.
            </p>
            <p>
              ScopeSite builds AI-optimised websites that actually get your Bath business recommended by ChatGPT and voice assistants. We&apos;re based just down the road in Frome, which means you get face-to-face service without Bath agency overheads baked into your quote.
            </p>
          </>
        }
      />

      {/* Problem Section */}
      <LandingProblem
        title="THE BATH WEB DESIGN MARKET IS BROKEN"
        intro="Bath's web design scene has a problem: agencies here think 'premium location' means 'premium prices', regardless of what they actually deliver."
        problems={problemPoints}
        conclusion={{
          text: "Bath businesses deserve better than overpriced templates dressed up as 'bespoke solutions'."
        }}
      />

      {/* Solution Section */}
      <LandingSolution
        title="BATH WEB DESIGN THAT'S ACTUALLY WORTH IT"
        intro="We understand Bath's market - the mix of tourism, professional services, retail, and hospitality that makes this city unique."
        features={solutionFeatures}
        layout="table"
      />

      {/* What You Get Section */}
      <LandingWhatYouGet
        title="WHAT'S INCLUDED IN BATH WEB DESIGN"
        cards={whatYouGetCards}
        columns={4}
      />

      {/* Areas Served */}
      <LandingAreasServed
        title="SERVING BATH AND SURROUNDING AREAS"
        towns={bathAreas}
        theme="dark"
      />

      {/* Proof Section */}
      <LandingProof
        title="WHAT WE CHECK"
        stats={proofStats}
        theme="light"
      />

      {/* Case Study Section */}
      <LandingCaseStudy 
        title="H4TLT case study"
        description="Read about our work with H4TLT, a workplace hearing surveillance provider."
        theme="dark" 
      />

      {/* Related Services Section */}
      <LandingRelatedServices
        title="MORE SERVICES FOR BATH BUSINESSES"
        services={[
          {
            title: "SEO Somerset",
            description: "AI-powered search optimisation for Somerset",
            href: "/seo-somerset"
          },
          {
            title: "Web Design Somerset",
            description: "Our home county - based in Frome",
            href: "/web-design-somerset"
          },
          {
            title: "Web Design Bristol",
            description: "Serving businesses across Bristol too",
            href: "/web-design-bristol"
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

      {/* FAQ Section */}
      <FAQSection
        title="BATH WEB DESIGN: YOUR QUESTIONS ANSWERED"
        items={faqItems}
        theme="light"
      />

      {/* Final CTA Section */}
      <LandingCTA
        title="BATH DESERVES BETTER WEB DESIGN"
        description="Stop overpaying for underwhelming websites. Get a quote that reflects actual work, not agency postcode premiums. See exactly what your Bath business website should cost - in 60 seconds."
        footnote="No obligation • Transparent pricing • Veteran-owned"
      />
    </>
  );
}
