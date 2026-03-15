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
  { question: "How much does SEO cost in Frome?", answer: "SEO is built into every web design project. Standalone SEO audits start from £500. Ongoing retainers from £300/month. We're based in Frome so there's no travel markup or big-city agency pricing." },
  { question: "Can SEO help my Frome business get on ChatGPT?", answer: "Yes. Our V.O.I.C.E methodology is specifically designed to get businesses recommended by AI platforms like ChatGPT, Perplexity, and Claude. We proved it works with our client H4TLT, who went from invisible to #1 AI-recommended in 6 weeks." },
  { question: "What is local SEO?", answer: "Local SEO targets people searching for services in a specific area. When someone searches 'plumber in Frome' or asks Alexa for a local recommendation, local SEO determines whether your business shows up. It involves Google Business Profile optimisation, local schema markup, citation building, and location-specific content." },
  { question: "How long does SEO take to show results?", answer: "Technical SEO improvements like speed, schema, and site structure show impact within weeks. Content-driven ranking improvements typically take 3-6 months. AI visibility improvements can happen faster because the field is less competitive." },
  { question: "What is V.O.I.C.E methodology?", answer: "V.O.I.C.E stands for Visibility, Optimisation, Integration, Content, and Engagement. It's our proprietary framework for making businesses visible to both traditional search engines and AI platforms like ChatGPT and Perplexity." },
  { question: "Do you guarantee first page rankings?", answer: "No. Anyone who guarantees rankings is lying. What we guarantee is technically sound implementation: validated schema, fast load times, proper site structure, and AI-readable content. The results speak for themselves." },
  { question: "Can you help with Google Business Profile?", answer: "Yes. GBP optimisation is part of every local SEO engagement. We optimise your profile, manage citations, and ensure NAP consistency across the web. Being in Frome means we can photograph your premises too." },
  { question: "What's the difference between SEO and AI optimisation?", answer: "Traditional SEO focuses on Google rankings. AI optimisation (what we call GEO and AEO) ensures your business gets recommended by ChatGPT, Perplexity, Claude, and voice assistants. We do both." },
  { question: "Will AI search replace Google?", answer: "Not replace, but it's already changing how people find businesses. 58% of local searches now happen through voice. ChatGPT handles 100+ million queries daily. Businesses that optimise for both will win." },
  { question: "Can you audit my current SEO?", answer: "Yes. We offer a free AI visibility audit that checks your site's schema markup, load speed, AI crawler accessibility, and content structure. We're in Frome, so we can walk you through the results in person." },
];

const problemPoints = [
  {
    title: "Your SEO agency has never been to Frome",
    description: "Most SEO agencies serving Frome are based in Bristol or Bath. They treat your town as a pin on a map, not a community they understand. They don't know the difference between Catherine Hill and the Cheese & Grain. Local knowledge matters for local SEO."
  },
  {
    title: "AI doesn't know your Frome business exists",
    description: "ChatGPT handles over 100 million queries daily. Voice assistants field 58% of local searches. If your website doesn't have proper schema markup, structured content, and AI-readable data, these platforms can't recommend you. Traditional SEO alone won't fix that."
  },
  {
    title: "You're paying for reports, not results",
    description: "Monthly SEO reports full of vanity metrics and traffic graphs that don't translate to customers. Meanwhile, someone in Frome is asking their phone for a recommendation and your competitor shows up instead. You need SEO that targets how people actually search in 2026."
  },
];

const solutionFeatures = [
  { title: "V.O.I.C.E™ AI Methodology", description: "Get recommended by ChatGPT, not just indexed by Google" },
  { title: "Technical SEO Foundation", description: "Schema markup, SSR, sub-2-second load times" },
  { title: "Local Search Dominance", description: "Google Business Profile, local citations, Frome-specific targeting" },
  { title: "Transparent Reporting", description: "Metrics that matter, not vanity dashboards" },
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
      "Frome-specific local schema",
      "NAP consistency audit",
      "Local citation building",
      "Review management strategy",
    ],
  },
];

const proofStats = [
  { value: 15, suffix: "+", label: "Somerset Clients" },
  { value: 100, suffix: "/100", label: "Lighthouse Scores" },
  { value: 89, suffix: "%", label: "AI Recommendation Rate" },
  { value: 6, suffix: " weeks", label: "Average Time to AI Visibility" },
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

export default function SEOFromePage() {
  return (
    <>
      <LandingHero
        badge="Frome SEO"
        badgeIcon={<MapPin className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="SEO FROME:"
        headline="GET YOUR BUSINESS FOUND ON GOOGLE AND AI"
        subheadline="Local SEO and AI visibility from a Frome-based studio."
        bodyCopy={
          <>
            <p className="mb-4">
              Frome is full of brilliant businesses. Creative arts studios, independent retailers on Catherine Hill, food and drink spots, wellness practitioners. The problem isn&apos;t the quality of what you do. It&apos;s that people can&apos;t find you online.
            </p>
            <p className="mb-4">
              Search has changed. Google is only part of the picture now.
            </p>
            <p>
              ScopeSite is based right here in Beckington, Frome. We deliver SEO that covers Google rankings, AI recommendations from ChatGPT and Perplexity, and voice search visibility. Our V.O.I.C.E™ methodology is proven. Veteran-owned, transparent about everything we do, and always available for a coffee and a chat in town.
            </p>
          </>
        }
      />

      <LandingProblem
        title="FROME SEO IS STUCK IN THE PAST"
        intro="Search engine optimisation for Frome businesses hasn't kept pace with how people actually search in 2026. Here's what's going wrong:"
        problems={problemPoints}
        conclusion={{
          title: "The Bottom Line:",
          text: "Frome businesses need SEO that covers Google, AI platforms, and voice search. That's what V.O.I.C.E™ delivers."
        }}
      />

      <LandingSolution
        title="SEO THAT ACTUALLY WORKS IN 2026"
        intro="Our V.O.I.C.E™ methodology covers every way your customers search for businesses like yours:"
        features={solutionFeatures}
        layout="table"
      />

      <LandingWhatYouGet
        title="WHAT'S INCLUDED IN FROME SEO"
        cards={whatYouGetCards}
        columns={4}
      />

      <LandingAreasServed
        title="SEO SERVICES ACROSS FROME AND SURROUNDS"
        homeBase="Frome"
        towns={fromeAreas}
        theme="dark"
      />

      <LandingProof
        title="FROME SEO RESULTS"
        stats={proofStats}
        theme="light"
      />

      <LandingCaseStudy 
        title="V.O.I.C.E™ Gets Results"
        quote="From invisible to #1 AI-recommended in 6 weeks using our proprietary methodology"
        theme="dark" 
      />

      <LandingRelatedServices
        title="MORE SERVICES FROM SCOPESITE"
        services={[
          {
            title: "V.O.I.C.E™ Methodology",
            description: "Our AI visibility framework explained in full",
            href: "/voice"
          },
          {
            title: "Schema Markup",
            description: "Structured data that makes your business machine-readable",
            href: "/schema-markup"
          },
          {
            title: "Web Design Frome",
            description: "AI-first websites built by your local Frome studio",
            href: "/web-design-frome"
          },
        ]}
        theme="light"
      />

      <FAQSection
        title="FROME SEO: YOUR QUESTIONS ANSWERED"
        items={faqItems}
        theme="light"
      />

      <LandingCTA
        title="GET FOUND BY AI AND GOOGLE"
        description="Stop paying for SEO that only targets half the search picture. Get a free AI visibility audit and find out exactly where your Frome business stands."
        footnote="No obligation • Free AI audit • Veteran-owned"
      />
    </>
  );
}
