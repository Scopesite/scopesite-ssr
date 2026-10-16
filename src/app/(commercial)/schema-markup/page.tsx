'use client';

import { FileCode, Link2, Bot, Mic, Code2, CheckCircle, FileText, HeadphonesIcon } from 'lucide-react';
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
    title: "Unchecked Generated Markup",
    description: "Automated schema needs checking against the real business. A plugin may produce useful markup, or it may leave gaps and conflicts. We inspect the output before deciding what to keep, extend or replace."
  },
  {
    title: "Copy-Paste Implementation",
    description: "Someone grabbed a schema template from the internet, changed a few fields, and called it done. Except they left the example URLs in place. Or duplicated @id references. Or used deprecated properties. Google's Rich Results Test says it's fine. Schema.org validator says it's broken."
  },
  {
    title: "No Entity Relationships",
    description: "Disconnected or conflicting identities can make the business harder to describe consistently. We connect services to their provider and people to their real roles, without inventing offices, ownership or credentials."
  },
];

// Solution features
const solutionFeatures = [
  {
    title: "15+ Schema Types",
    description: "Organization, Person, LocalBusiness, Service, FAQPage, BreadcrumbList, and more",
    icon: FileCode,
  },
  {
    title: "Entity Relationships",
    description: "Proper @id references connecting your entire business graph",
    icon: Link2,
  },
  {
    title: "AI Crawler Config",
    description: "Separate access checks for search, training and user-requested retrieval",
    icon: Bot,
  },
  {
    title: "Speakable Markup",
    description: "Voice search optimisation with proper speakable schema implementation",
    icon: Mic,
  },
];

// What you get cards
const whatYouGetCards = [
  {
    title: "Core Business Schema",
    icon: FileCode,
    items: [
      "Organization with full business details",
      "Person schema for key team members",
      "LocalBusiness with location data",
      "ContactPoint for all contact methods",
      "sameAs links to all social profiles",
    ],
  },
  {
    title: "Service & Product Schema",
    icon: Code2,
    items: [
      "Service schema for each offering",
      "OfferCatalog with pricing",
      "hasOfferCatalog relationships",
      "serviceType categorisation",
      "areaServed geographic targeting",
    ],
  },
  {
    title: "Content Schema",
    icon: FileText,
    items: [
      "FAQPage for all FAQ sections",
      "BreadcrumbList for navigation",
      "Article/BlogPosting for content",
      "HowTo for process content",
      "Review and AggregateRating",
    ],
  },
  {
    title: "Technical Implementation",
    icon: CheckCircle,
    items: [
      "Hand-coded JSON-LD (no plugins)",
      "@graph structure for relationships",
      "Proper @id reference system",
      "Schema.org validation certificate",
      "Implementation documentation",
    ],
  },
];

// Proof stats


export default function SchemaMarkupPage() {
  return (
    <>
      {/* Hero Section */}
      <LandingHero
        badge="Structured Data Experts"
        badgeIcon={<FileCode className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="SCHEMA MARKUP SERVICES"
        headline="THAT ACTUALLY VALIDATE"
        subheadline="Structured data that accurately describes your business, its services and its relationships."
        bodyCopy={
          <>
            <p className="mb-4">
              You&apos;ve probably been told schema markup is important. Maybe you&apos;ve even tried to implement it yourself or paid someone to do it. And there&apos;s a good chance it&apos;s either broken, incomplete, or completely useless.
            </p>
            <p className="mb-4">
              Schema can validate and still describe the wrong organisation, contradict the page or contain an unsupported claim. An audit needs to check the facts and relationships as well as the syntax.
            </p>
            <p>
              We select types and properties that describe your actual business, connect the relevant entities and validate the result against Schema.org. We also check that the markup agrees with what visitors can read on the page.
            </p>
          </>
        }
      />

      {/* Problem Section */}
      <LandingProblem
        title="WHY YOUR CURRENT SCHEMA ISN'T WORKING"
        intro="Here's what usually goes wrong with schema markup:"
        problems={problemPoints}
        conclusion={{
          title: "The Result:",
          text: "A valid-looking block of code can still describe the wrong business, repeat an unsupported claim or contradict the page. We check the facts as well as the syntax."
        }}
      />

      {/* Solution Section */}
      <LandingSolution
        title="SCHEMA ENGINEERING, NOT SCHEMA GUESSING"
        intro="We approach schema markup like engineering, not decoration. Every implementation follows a structured methodology: Audit, Architecture, Implementation, Validation, Documentation."
        features={solutionFeatures}
        columns={4}
      />

      {/* What You Get Section */}
      <LandingWhatYouGet
        title="COMPLETE SCHEMA MARKUP IMPLEMENTATION"
        intro="Every schema implementation includes:"
        cards={whatYouGetCards}
        columns={4}
      />

      {/* Proof Section */}
      <LandingProof
        title="WHAT WE CHECK"
        stats={proofStats}
        subtitle="We validate the vocabulary with Schema.org and check the facts against the page. Google-supported rich results get a separate test. Neither validator proves what another AI provider uses or guarantees a citation."
        theme="dark"
      />

      {/* Case Study Section */}
      <LandingCaseStudy 
        title="H4TLT case study"
        stat="51"
        statLabel="Schema entries"
        description="Read about our work with H4TLT, a workplace hearing surveillance provider."
        theme="light" 
      />

      {/* Related Services Section */}
      <LandingRelatedServices
        title="RELATED SERVICES"
        intro="Schema markup is the foundation - combine it with these for maximum impact"
        services={[
          {
            title: "AI visibility",
            description: "Get recommended by ChatGPT, Perplexity, and AI assistants using our proprietary methodology.",
            href: "/voice"
          },
          {
            title: "AI Website Design",
            description: "Websites engineered from the ground up for AI visibility",
            href: "/ai-website-design"
          },
          {
            title: "AI SEO Services",
            description: "Ongoing optimisation for ChatGPT and voice assistant recommendations",
            href: "/ai-seo-services"
          },
        ]}
        theme="dark"
      />

      {/* FAQ Section */}
      <FAQSection
        title="SCHEMA MARKUP SERVICES: YOUR QUESTIONS ANSWERED"
        items={faqItems}
        theme="light"
      />

      {/* Final CTA Section */}
      <LandingCTA
        title="GET SCHEMA THAT ACTUALLY WORKS"
        description="Get schema checked against your business facts and the Schema.org vocabulary. We document what is implemented and fix validation problems within the agreed scope."
        footnote="No obligation • 100% validation guarantee • Veteran-owned"
      />
    </>
  );
}
