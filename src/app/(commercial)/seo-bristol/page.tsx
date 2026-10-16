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
    title: "Bristol's SEO market is fighting yesterday's battle",
    description: "Bristol has dozens of SEO agencies, all competing to rank clients on Google. But while they optimise title tags and build backlinks, AI search platforms are routing an increasing share of queries. ChatGPT, Perplexity, and voice assistants don't care about your Google ranking."
  },
  {
    title: "Tech companies need tech-forward SEO",
    description: "Bristol's tech scene deserves SEO that matches its ambition. Most Bristol SEO agencies can't explain schema markup, don't know what GEO or AEO means, and have never tested whether ChatGPT recommends their clients. We speak the same technical language as Bristol's startups."
  },
  {
    title: "Paying for vanity metrics instead of visibility",
    description: "Monthly reports showing keyword positions and traffic graphs look impressive. But if ChatGPT doesn't mention your business, if voice assistants don't recommend you, and if AI search platforms can't understand your services, those metrics tell half the story."
  },
];

const solutionFeatures = [
  { title: "Google + AI + Voice", description: "We optimise for every way Bristol customers search" },
  { title: "AI visibility methodology", description: "Proprietary framework for AI search visibility" },
  { title: "Technical Foundation", description: "Schema markup, SSR, Core Web Vitals" },
  { title: "Transparent Reporting", description: "AI mention tracking, not just keyword positions" },
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
      "Bristol-specific local schema",
      "NAP consistency audit",
      "Local citation building",
      "Review management strategy",
    ],
  },
];



const bristolAreas = [
  'Bristol City Centre',
  'Harbourside',
  'Clifton',
  'Redcliffe',
  'Temple Quarter',
  'Stokes Croft',
  'Bedminster',
  'Southville',
  'Filton',
  'Bradley Stoke',
  'Portishead',
  'Clevedon',
];

export default function SEOBristolPage() {
  return (
    <>
      <LandingHero
        badge="Bristol SEO"
        badgeIcon={<MapPin className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="SEO SERVICES IN BRISTOL"
        headline=""
        subheadline="Search optimisation that goes beyond Google rankings."
        bodyCopy={
          <>
            <p className="mb-4">
              Bristol&apos;s got more SEO agencies than it knows what to do with. Most of them are still running the same playbook from 2019: keyword research, backlink building, monthly report, invoice. Rinse and repeat.
            </p>
            <p className="mb-4">
              But search has changed fundamentally.
            </p>
            <p>
              ChatGPT handles over 100 million queries daily. Voice assistants field 58% of local searches. AI search platforms are deciding which Bristol businesses get recommended. ScopeSite delivers SEO services that cover the full picture: Google, AI platforms, and voice search. Based in Somerset, 40 minutes from Bristol, with AI visibility methodology that Bristol agencies can&apos;t match.
            </p>
          </>
        }
      />

      <LandingProblem
        title="BRISTOL SEO NEEDS AN UPGRADE"
        intro="Bristol's digital market is competitive. Here's why traditional SEO isn't enough anymore:"
        problems={problemPoints}
        conclusion={{
          title: "The Opportunity:",
          text: "Bristol businesses that optimise for AI search now will have a significant advantage over competitors still focused solely on Google rankings."
        }}
      />

      <LandingSolution
        title="SEO THAT MATCHES BRISTOL'S AMBITION"
        intro="Our AI visibility methodology covers every search channel Bristol businesses need:"
        features={solutionFeatures}
        layout="table"
      />

      <LandingWhatYouGet
        title="WHAT'S INCLUDED IN BRISTOL SEO"
        cards={whatYouGetCards}
        columns={4}
      />

      <LandingAreasServed
        title="SEO SERVICES ACROSS BRISTOL"
        towns={bristolAreas}
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
        title="MORE SERVICES FOR BRISTOL"
        services={[
          {
            title: "Web Design Bristol",
            description: "AI-first websites for Bristol businesses",
            href: "/web-design-bristol"
          },
          {
            title: "AI visibility methodology",
            description: "Our AI visibility framework explained",
            href: "/voice"
          },
          {
            title: "AI SEO Services",
            description: "National AI search optimisation",
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
        title="BRISTOL SEO: YOUR QUESTIONS ANSWERED"
        items={faqItems}
        theme="light"
      />

      <LandingCTA
        title="GET FOUND BY AI AND GOOGLE IN BRISTOL"
        description="Stop paying for SEO that only tells half the story. Get a free AI visibility audit and find out exactly where your Bristol business stands across Google, ChatGPT, and voice search."
        footnote="No obligation • Free AI audit • Veteran-owned"
      />
    </>
  );
}
