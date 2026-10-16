import { MapPin, Code2, Brain, Shield, Map } from 'lucide-react';
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
    title: "WordPress with a premium theme (that cost them £59)",
    description: "Most Bristol web design agencies charge £10,000-£20,000 and deliver WordPress with a premium theme, custom colour scheme and your logo, stock photos you've seen on 50 other sites, 'SEO optimisation' that means they installed Yoast, and monthly fees to keep the lights on."
  },
  {
    title: "No idea how to make sites visible to AI",
    description: "Meanwhile, the world's moved on. 58% of local searches happen through voice. ChatGPT handles 100+ million queries daily. Your competitor in London is getting recommended by ChatGPT while your expensive Bristol website might as well not exist to AI platforms."
  },
];

// Solution comparison
const solutionFeatures = [
  { title: "Next.js server-side rendering", description: "WordPress with 47 plugins" },
  { title: "Sub-2-second load times", description: "4-6 seconds 'because plugins'" },
  { title: "Full AI visibility engineering", description: "'What's schema markup?'" },
  { title: "Fixed pricing, no surprises", description: "'It'll cost more than quoted'" },
  { title: "Schema.org validated", description: "Yoast says it's fine" },
];

// What you get cards
const whatYouGetCards = [
  {
    title: "Modern Development",
    iconNode: <Code2 className="w-6 h-6 text-brand-gold" />,
    items: [
      "Next.js 16 server-side rendering",
      "React 19 components",
      "Tailwind CSS styling",
      "Sub-2-second load times",
      "Mobile-first responsive",
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
      "AI crawler configuration",
    ],
  },
  {
    title: "Technical Excellence",
    iconNode: <Shield className="w-6 h-6 text-brand-gold" />,
    items: [
      "100% Lighthouse scores",
      "Enterprise-grade security",
      "GDPR compliance",
      "SSL certificates",
      "Performance monitoring",
    ],
  },
  {
    title: "Local SEO",
    iconNode: <Map className="w-6 h-6 text-brand-gold" />,
    items: [
      "Google Business Profile optimisation",
      "Bristol-specific local schema",
      "Citation building",
      "Review management",
      "Maps integration",
    ],
  },
];

// Proof stats


// Bristol areas served
const bristolAreas = [
  'Bristol City Centre',
  'Harbourside',
  'Clifton',
  'Redcliffe',
  'Temple',
  'Stokes Croft',
  'Bedminster',
  'Southville',
  'Filton',
  'Bradley Stoke',
  'Portishead',
  'Clevedon',
];

export default function WebDesignBristolPage() {
  return (
    <>
      {/* Hero Section */}
      <LandingHero
        badge="Bristol's AI-First Alternative"
        badgeIcon={<MapPin className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="WEB DESIGN BRISTOL:"
        headline="AI-FIRST WEBSITES. FAIR PRICES."
        subheadline="Tech-forward web design without the Bristol agency markup."
        bodyCopy={
          <>
            <p className="mb-4">
              Bristol&apos;s got more web agencies than coffee shops. Most of them are still building WordPress sites and calling it &quot;cutting edge&quot;. They&apos;ll charge you £15K, deliver a template with your colours, and wonder why ChatGPT has no idea you exist.
            </p>
            <p className="mb-4">
              We build differently.
            </p>
            <p>
              ScopeSite creates AI-optimised websites that get Bristol businesses recommended by ChatGPT, Perplexity, and voice assistants. We&apos;re based in Somerset, 40 minutes from Bristol city centre. Close enough for face-to-face meetings, far enough to not charge you Bristol agency rates.
            </p>
          </>
        }
      />

      {/* Problem Section */}
      <LandingProblem
        title="BRISTOL'S WEB DESIGN SCENE HAS A PROBLEM"
        intro="Bristol fancies itself a tech hub. And it is. But the website design Bristol businesses are getting? It's stuck in 2018. Most Bristol website designers are still delivering WordPress templates at premium rates."
        problems={problemPoints}
        conclusion={{
          title: "The Real Problem:",
          text: "Bristol businesses are paying website design company prices for technology that's already obsolete. The website designers Bristol relies on haven't adapted to AI search."
        }}
      />

      {/* Solution Section */}
      <LandingSolution
        title="BRISTOL WEB DESIGN FOR THE AI ERA"
        intro="AI optimisation in Bristol starts with the right foundation. Startups and scale-ups here understand that web design Bristol agencies deliver needs to be AI-first. Our AI visibility methodology makes that happen."
        features={solutionFeatures}
        layout="table"
      />

      {/* What You Get Section */}
      <LandingWhatYouGet
        title="WHAT'S INCLUDED IN BRISTOL WEB DESIGN"
        cards={whatYouGetCards}
        columns={4}
      />

      {/* Areas Served */}
      <LandingAreasServed
        title="SERVING BUSINESSES ACROSS BRISTOL"
        towns={bristolAreas}
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
        title="MORE SERVICES FOR BRISTOL BUSINESSES"
        services={[
          {
            title: "SEO Bristol",
            description: "AI search optimisation for Bristol businesses",
            href: "/seo-bristol"
          },
          {
            title: "AI visibility methodology",
            description: "Our AI visibility framework that gets businesses recommended",
            href: "/voice"
          },
          {
            title: "Web Design Somerset",
            description: "Our home county - based in Frome",
            href: "/web-design-somerset"
          },
          {
            title: "Web Design Bath",
            description: "Serving businesses across Bath too",
            href: "/web-design-bath"
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
        title="BRISTOL WEB DESIGN: YOUR QUESTIONS ANSWERED"
        items={faqItems}
        theme="light"
      />

      {/* Final CTA Section */}
      <LandingCTA
        title="BRISTOL DESERVES BETTER WEB DESIGN"
        description="Stop paying Bristol agency prices for 2018 technology. Get AI-optimised websites built on modern tech stacks, priced fairly, delivered on time. Find out exactly what your Bristol business website should cost - in 60 seconds."
        footnote="No obligation • Transparent pricing • Veteran-owned"
      />
    </>
  );
}
