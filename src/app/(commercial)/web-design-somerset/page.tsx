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

// Problem points
const problemPoints = [
  {
    title: "Option 1: The Local Freelancer",
    description: "Nice enough, charges reasonable rates, but builds everything on WordPress templates. Your site looks exactly like every other local business. No AI optimisation, no schema markup. You might rank eventually, but AI doesn't know you exist."
  },
  {
    title: "Option 2: The Bristol/Bath Agency",
    description: "Charges London prices without London results. £10K for a WordPress site with some custom styling. They'll talk about 'digital transformation' while delivering template-based work."
  },
  {
    title: "Option 3: DIY Website Builders",
    description: "Wix, Squarespace, GoDaddy - fine for a hobby, terrible for a business. Slow, bloated, impossible to optimise for AI."
  },
];

// Solution features
const solutionFeatures = [
  { title: "Based in Frome", description: "Face-to-face meetings, local understanding, someone who answers the phone" },
  { title: "AI-First Approach", description: "Your site gets recommended by ChatGPT, not just indexed by Google" },
  { title: "Military Precision", description: "Deadlines met, budgets respected, no surprises" },
  { title: "Fair Pricing", description: "25% below typical agency rates - no London overheads" },
];

// What you get cards
const whatYouGetCards = [
  {
    title: "Professional Design",
    iconNode: <Palette className="w-6 h-6 text-brand-gold" />,
    items: [
      "Custom design (not templates)",
      "Mobile-first responsive",
      "Your brand colours throughout",
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
      "Local schema with Somerset targeting",
      "Citation building for Somerset directories",
      "Maps integration",
    ],
  },
];

// Proof stats


// Towns served
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

export default function WebDesignSomersetPage() {
  return (
    <>
      {/* Hero Section */}
      <LandingHero
        badge="Somerset's AI-First Agency"
        badgeIcon={<MapPin className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="WEB DESIGN SOMERSET:"
        headline="WEBSITES THAT GET RECOMMENDED"
        subheadline="Based in Frome. Building websites that ChatGPT actually recommends."
        bodyCopy={
          <>
            <p className="mb-4">
              Most Somerset web designers are still building websites for 2019. Pretty designs that load slowly, rank nowhere, and are completely invisible to AI. The same shortfall shows up in local search: we break down what it really takes to reach the{' '}
              <Link
                href="/blog/first-page-google-somerset"
                className="text-brand-gold hover:underline"
              >
                first page of Google for Somerset businesses
              </Link>
              , and why design alone is not enough.
            </p>
            <p className="mb-4">
              We&apos;re doing something different.
            </p>
            <p>
              ScopeSite is a Somerset web design agency that builds websites for the AI era. When someone asks ChatGPT &quot;Who&apos;s the best [your service] in Somerset?&quot;, our clients are the ones getting mentioned. We&apos;re based in Frome, veteran-owned, and we&apos;ve been in your shoes - running a local business in Somerset where every customer matters. We also see the same three patterns on repeat, which is why we wrote up{' '}
              <Link
                href="/blog/3-seo-mistakes-somerset-businesses-make-and-how-to-fix-them"
                className="text-brand-gold hover:underline"
              >
                the 3 SEO mistakes Somerset businesses make
              </Link>
              — and how to fix them before you pour more budget into the wrong things.
            </p>
          </>
        }
      />

      {/* Problem Section */}
      <LandingProblem
        title="THE SOMERSET WEB DESIGN PROBLEM"
        intro="Somerset businesses have three options for web design. None of them are great:"
        problems={problemPoints}
        conclusion={{
          title: "What Somerset Actually Needs:",
          text: "A web design agency that understands local business, charges fair prices, and builds sites that work in 2026. That's why we started ScopeSite in Frome."
        }}
      />

      {/* Solution Section */}
      <LandingSolution
        title="SOMERSET WEB DESIGN THAT WORKS DIFFERENTLY"
        features={solutionFeatures}
        layout="table"
      />

      {/* What You Get Section */}
      <LandingWhatYouGet
        title="WHAT'S INCLUDED IN SOMERSET WEB DESIGN"
        cards={whatYouGetCards}
        columns={4}
      />

      {/* Areas Served */}
      <LandingAreasServed
        title="SERVING BUSINESSES ACROSS SOMERSET"
        homeBase="Frome"
        towns={somersetTowns}
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
        title="MORE SERVICES FOR SOMERSET BUSINESSES"
        services={[
          {
            title: "SEO Somerset",
            description: "AI-powered search optimisation for Somerset businesses",
            href: "/seo-somerset"
          },
          {
            title: "AI Website Design",
            description: "Websites engineered for ChatGPT and AI recommendations",
            href: "/ai-website-design"
          },
          {
            title: "Web Design Bath",
            description: "Serving businesses across Bath and surrounds",
            href: "/web-design-bath"
          },
          {
            title: "Web Design Bristol",
            description: "Tech-forward web design for Bristol businesses",
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
        title="SOMERSET WEB DESIGN: YOUR QUESTIONS ANSWERED"
        items={faqItems}
        theme="light"
      />

      {/* Final CTA Section */}
      <LandingCTA
        title="LET'S BUILD SOMETHING PROPER"
        description="Get an instant quote in 60 seconds, or book a call for a proper conversation about what your business needs."
        footnote="No obligation • Transparent pricing • Veteran-owned"
      />
    </>
  );
}
