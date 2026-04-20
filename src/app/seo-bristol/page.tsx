'use client';

import { MapPin, Search, Brain, Shield, Map } from 'lucide-react';
import {
  LandingHero,
  LandingProblem,
  LandingSolution,
  LandingWhatYouGet,
  LandingProof,
  LandingRelatedServices,
  LandingCaseStudy,
  FAQSection,
  LandingCTA,
  LandingAreasServed,
} from '@/components/landing';

const faqItems = [
  { question: "How is your SEO different from Bristol SEO agencies?", answer: "Most Bristol SEO agencies focus exclusively on Google rankings. We optimise for Google, ChatGPT, Perplexity, Claude, and voice assistants. Bristol's tech scene is competitive - AI visibility is the differentiator." },
  { question: "What does SEO in Bristol cost?", answer: "Standalone SEO audits from £500. Ongoing SEO retainers from £300/month. We don't have Bristol office rent, so our rates are significantly below city agencies for the same (or better) work." },
  { question: "Why hire a Somerset agency for Bristol SEO?", answer: "Because we deliver better technology at fairer rates. We're 40 minutes from Bristol, regularly in the city for meetings, and our V.O.I.C.E™ methodology is more advanced than what Bristol agencies offer." },
  { question: "Do you understand Bristol's market?", answer: "Yes. Bristol is a tech hub, creative capital, and competitive digital market. Startups, scale-ups, professional services, and creative agencies all need different SEO approaches. We've worked across all of them." },
  { question: "Can you help Bristol startups with SEO?", answer: "Absolutely. Startups need to build visibility fast without burning through their runway. AI SEO is often less competitive than traditional SEO, giving startups an edge established competitors haven't exploited yet." },
  { question: "What's V.O.I.C.E. methodology?", answer: "V.O.I.C.E. stands for Visibility, Optimisation, for Intelligent, Crawler, Engines. It's our proprietary framework for making businesses visible to both traditional search engines and AI platforms." },
  { question: "How long until I see results?", answer: "Technical SEO improvements show impact within weeks. Content-driven ranking improvements take 3-6 months. AI visibility improvements can happen within 4-8 weeks because the field is less competitive." },
  { question: "Do you guarantee rankings?", answer: "No. Anyone who guarantees rankings is lying. We guarantee technically sound implementation: validated schema, fast load times, proper site structure, and AI-readable content." },
  { question: "Will you meet Bristol clients in person?", answer: "Yes. We're in Bristol regularly and happy to meet at your office or a coffee shop. 40 minutes is nothing." },
  { question: "Can you audit our current SEO?", answer: "Yes. We offer a free AI visibility audit that checks schema markup, load speed, AI crawler accessibility, and content structure. Book a call and we'll run it live." },
];

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
  { title: "V.O.I.C.E™ Methodology", description: "Proprietary framework for AI search visibility" },
  { title: "Technical Foundation", description: "Schema markup, SSR, Core Web Vitals" },
  { title: "Transparent Reporting", description: "AI mention tracking, not just keyword positions" },
];

const whatYouGetCards = [
  {
    title: "Technical SEO",
    icon: Search,
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
    icon: Brain,
    items: [
      "ChatGPT recommendation testing",
      "V.O.I.C.E™ optimisation",
      "AI crawler configuration",
      "Structured data engineering",
      "Voice search optimisation",
    ],
  },
  {
    title: "Content & Authority",
    icon: Shield,
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
    icon: Map,
    items: [
      "Google Business Profile optimisation",
      "Bristol-specific local schema",
      "NAP consistency audit",
      "Local citation building",
      "Review management strategy",
    ],
  },
];

const proofStats = [
  { value: 12, suffix: "+", label: "Bristol Area Clients" },
  { value: 100, suffix: "/100", label: "Lighthouse Scores" },
  { value: 89, suffix: "%", label: "AI Recommendation Rate" },
  { value: 6, suffix: " weeks", label: "Average Time to AI Visibility" },
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
              ChatGPT handles over 100 million queries daily. Voice assistants field 58% of local searches. AI search platforms are deciding which Bristol businesses get recommended. ScopeSite delivers SEO services that cover the full picture: Google, AI platforms, and voice search. Based in Somerset, 40 minutes from Bristol, with V.O.I.C.E™ methodology that Bristol agencies can&apos;t match.
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
        intro="Our V.O.I.C.E™ methodology covers every search channel Bristol businesses need:"
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
        title="BRISTOL SEO RESULTS"
        stats={proofStats}
        quote={{
          text: "We'd been with a Bristol SEO agency for 18 months with marginal improvements. ScopeSite implemented proper schema markup and AI optimisation, and within two months ChatGPT was recommending us by name. That's something our previous agency couldn't even explain.",
          author: "Tech Startup, Bristol"
        }}
        theme="light"
      />

      <LandingCaseStudy 
        title="V.O.I.C.E™ Gets Bristol Results"
        quote="From invisible to #1 AI-recommended in 6 weeks - the approach Bristol's tech scene has been waiting for"
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
            title: "V.O.I.C.E™ Methodology",
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
