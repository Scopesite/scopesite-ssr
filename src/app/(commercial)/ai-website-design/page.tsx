'use client';

import { Brain, Code2, Server, Zap, Bot, FileCode, HeadphonesIcon } from 'lucide-react';
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
} from '@/components/landing';
import { faqItems } from './faqs';
import { websiteEvidenceChecks as proofStats } from '@/lib/website-evidence-checks';

// Problem points
const problemPoints = [
  {
    title: "AI Can't Parse Your Content",
    description: "Your website's code is a mess of divs and spans that mean nothing to AI crawlers."
  },
  {
    title: "No Entity Recognition",
    description: "AI doesn't know your business is related to your industry, location, or services."
  },
  {
    title: "Zero Recommendation Potential",
    description: "Even if AI finds you, there's nothing signalling that you're worth recommending."
  },
];

// Solution features
const solutionFeatures = [
  {
    title: "Schema Engineering",
    description: "15+ schema types implemented correctly, validated against Schema.org standards",
    icon: FileCode,
  },
  {
    title: "Entity Mapping",
    description: "Your business connected to industry, location, and service entities AI recognises",
    icon: Brain,
  },
  {
    title: "Content Architecture",
    description: "Information structured for AI extraction and voice search responses",
    icon: Code2,
  },
  {
    title: "Crawler Optimisation",
    description: "GPTBot, ClaudeBot, and PerplexityBot welcomed and guided properly",
    icon: Bot,
  },
];

// What you get cards
const whatYouGetCards = [
  {
    title: "Technical Foundation",
    icon: Server,
    items: [
      "Server-side rendered Next.js build (not WordPress)",
      "Sub-2-second load times",
      "100% Lighthouse accessibility score",
      "Mobile-first responsive design",
      "HTTPS with proper security headers",
    ],
  },
  {
    title: "AI Visibility Layer",
    icon: Brain,
    items: [
      "Complete schema markup implementation",
      "Entity relationship mapping",
      "Structured data for all content types",
      "AI crawler access configuration",
      "robots.txt and llms.txt optimisation",
    ],
  },
  {
    title: "Conversion Engineering",
    icon: Zap,
    items: [
      "Clear calls-to-action throughout",
      "Form optimisation for higher completion",
      "Trust signals properly implemented",
      "Local business information schema",
      "Review and testimonial markup",
    ],
  },
  {
    title: "Ongoing Support",
    icon: HeadphonesIcon,
    items: [
      "Schema validation monitoring",
      "AI visibility tracking",
      "Monthly performance reports",
      "Priority support access",
      "Content update guidance",
    ],
  },
];

// Proof stats


export default function AIWebsiteDesignPage() {
  return (
    <>
      {/* Hero Section */}
      <LandingHero
        badge="AI-First Design"
        badgeIcon={<Brain className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="AI WEBSITE DESIGN"
        headline="THAT ACTUALLY GETS FOUND"
        subheadline="Readable pages, accurate business facts and checks against actual AI answers."
        bodyCopy={
          <>
            <p className="mb-4">
              A website can look excellent and still expose incomplete or conflicting information to a retrieval tool.
            </p>
            <p className="mb-4">
              We inspect the initial HTML, access rules and structured data, then check the relevant search and AI services separately. The useful question is what they can retrieve and cite from your site.
            </p>
            <p>
              We build websites for people and make the underlying business facts clear to machines. Design, accessibility and accurate content belong in the same brief.
            </p>
          </>
        }
      />

      {/* Problem Section */}
      <LandingProblem
        title="CHECK WHAT YOUR WEBSITE ACTUALLY EXPOSES"
        intro="Voice search now accounts for 58% of local searches. AI-powered answer engines are handling 40% of informational queries. And that number's climbing every month."
        problems={problemPoints}
        conclusion={{
          title: "The Result:",
          text: "Someone asks ChatGPT for an accountant in Bristol and your business is absent. That answer alone does not explain why. We check the sources, the website and the query before recommending a repair."
        }}
      />

      {/* Solution Section */}
      <LandingSolution
        title="AI-FIRST DESIGN THAT MACHINES UNDERSTAND"
        intro="We don't just build websites. We engineer them for AI comprehension using our AI visibility methodology - Visibility, Optimisation, for Intelligent, Crawler, Engines."
        features={solutionFeatures}
        columns={4}
      />

      {/* What You Get Section */}
      <LandingWhatYouGet
        title="WHAT'S INCLUDED IN AI WEBSITE DESIGN"
        intro="Every AI website we build includes:"
        cards={whatYouGetCards}
        columns={4}
      />

      {/* Proof Section */}
      <LandingProof
        title="WHAT WE CHECK"
        stats={proofStats}
        theme="dark"
      />

      {/* Case Study Section */}
      <LandingCaseStudy theme="light" />

      {/* Related Services Section */}
      <LandingRelatedServices
        title="RELATED SERVICES"
        intro="AI website design works best when combined with these complementary services"
        services={[
          {
            title: "Schema Markup Services",
            description: "Professional JSON-LD implementation with 100% validation guarantee",
            href: "/schema-markup"
          },
          {
            title: "AI SEO Services",
            description: "Get recommended by ChatGPT, Perplexity, and voice assistants",
            href: "/ai-seo-services"
          },
          {
            title: 'AI SEO tuning',
            description: "Our proprietary methodology for AI platform visibility",
            href: "/voice"
          },
        ]}
        theme="dark"
      />

      {/* FAQ Section */}
      <FAQSection
        title="AI WEBSITE DESIGN: YOUR QUESTIONS ANSWERED"
        items={faqItems}
        theme="light"
      />

      {/* Final CTA Section */}
      <LandingCTA
        title="READY TO BE RECOMMENDED BY AI?"
        description="Every day you wait, your competitors are getting mentioned by ChatGPT instead of you. Every voice search, every AI query, every 'who should I hire' question - they're finding someone else. Let's fix that."
        footnote="No obligation • Transparent pricing • Veteran-owned"
      />
    </>
  );
}
