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

// FAQ Data
const faqItems = [
  {
    question: "What exactly is schema markup?",
    answer: "Schema markup is code (specifically JSON-LD) that explicitly tells search engines and AI what your content means. Instead of AI guessing that 'John Smith Plumbing' is a business that does plumbing, schema states it definitively - along with location, services, hours, reviews, and how all these connect. It's the difference between AI understanding your business and AI ignoring it."
  },
  {
    question: "Why can't I just use a WordPress plugin for schema?",
    answer: "Plugins generate generic, one-size-fits-all schema that lacks the depth and relationships AI needs. They can't create proper entity connections, often produce duplicate @id errors, and use deprecated properties. For basic rich results in Google, plugins might work. For AI visibility, they're useless. We hand-code everything for your specific business."
  },
  {
    question: "How do I know if my current schema is working?",
    answer: "Run your site through validator.schema.org (not Google's Rich Results Test, which only checks limited schema types). If you see errors, warnings, or your schema doesn't accurately represent your business relationships, it's not working. We offer free schema audits if you want us to check properly."
  },
  {
    question: "What's the difference between Google's validation tool and Schema.org validator?",
    answer: "Google's Rich Results Test only validates schema types that trigger their specific rich results. Schema.org validator checks against the full vocabulary. AI platforms like ChatGPT use the full schema vocabulary, not just Google's subset. If you only validate with Google, you're missing most of what matters for AI."
  },
  {
    question: "How long does schema implementation take?",
    answer: "Typically 2-5 days depending on your site's complexity and how much existing schema needs fixing. Simple sites with clean code take less time. Sites with plugin-generated schema garbage or complex entity relationships take longer. We'll give you a specific timeline after auditing your current setup."
  },
  {
    question: "Will schema markup help my Google rankings?",
    answer: "Schema doesn't directly boost rankings, but it improves how Google understands your content, which can lead to better visibility and rich results (star ratings, FAQ dropdowns, etc.). More importantly, it's essential for AI visibility - ChatGPT, Perplexity, and voice assistants rely heavily on structured data to recommend businesses."
  },
  {
    question: "What platforms can you implement schema on?",
    answer: "Any platform that allows custom code injection: WordPress, Shopify, Wix, Squarespace, custom builds, Next.js, you name it. If you can add code to your site, we can implement schema. Some platforms make it easier than others, but none are impossible."
  },
  {
    question: "Do you fix existing broken schema?",
    answer: "Yes. We start every project with a full audit of existing schema. If there's salvageable work, we fix and extend it. If it's fundamentally broken (which is common with plugin-generated markup), we replace it entirely. Either way, you end up with working schema."
  },
  {
    question: "What's JSON-LD and why do you use it?",
    answer: "JSON-LD (JavaScript Object Notation for Linked Data) is the recommended format for schema markup. It sits in a script tag, separate from your visible content, making it easier to maintain and less likely to break. Google explicitly recommends JSON-LD over other formats like Microdata or RDFa."
  },
  {
    question: "How do entity relationships work in schema?",
    answer: "Entity relationships connect your schema objects using @id references. Your Organization @id is referenced by your Person (founder), LocalBusiness (location), and Service (what you offer) schemas. This creates a knowledge graph that AI can traverse, understanding how everything in your business connects."
  },
  {
    question: "What's speakable schema and do I need it?",
    answer: "Speakable schema tells voice assistants which parts of your content should be spoken aloud in response to queries. If you want Siri or Google Assistant to read specific information about your business, you need speakable markup. We implement it using xpath selectors for maximum compatibility."
  },
  {
    question: "Can schema markup help with voice search?",
    answer: "Absolutely. Voice assistants rely heavily on structured data to provide spoken answers. Proper LocalBusiness schema helps with 'near me' searches. FAQ schema provides direct answers. Service schema helps with 'who can help me with X' queries. Schema is the foundation of voice search visibility."
  },
  {
    question: "What's your 100% validation guarantee?",
    answer: "If any schema we implement doesn't pass Schema.org validation, we fix it at no additional cost. No questions, no excuses. We stand behind our work because we know it's done properly. This guarantee is in writing before you commit."
  },
  {
    question: "Do you provide documentation of what you implement?",
    answer: "Yes. Every project includes full documentation explaining what schema types we implemented, how they're connected, where they're located in your code, and why we made specific decisions. You'll never be left wondering what we did or how to maintain it."
  },
  {
    question: "How much does schema markup implementation cost?",
    answer: "Standalone schema implementation starts from £750 for straightforward sites. Complex sites with multiple locations, services, or extensive existing schema issues cost more. Most projects fall between £750-£2,000. Our quote calculator gives you a specific price based on your requirements."
  },
  {
    question: "Will I need to update the schema over time?",
    answer: "Schema standards evolve slowly, so major updates are rare. However, when your business information changes (new services, updated hours, additional locations), the schema should be updated too. We offer maintenance packages or can train your team to make basic updates."
  },
  {
    question: "What if I'm already working with another SEO agency?",
    answer: "We work alongside other agencies all the time. Schema implementation is specialised work that most general SEO agencies outsource anyway. We can implement schema while your existing agency handles other aspects of your digital marketing. No conflict, no drama."
  },
];

// Problem points
const problemPoints = [
  {
    title: "Plugin-Generated Garbage",
    description: "Those SEO plugins that promise 'automatic schema markup' are lying to you. They generate basic, generic markup that tells AI nothing meaningful about your specific business. Yoast, RankMath, All-in-One SEO - they all produce the same mediocre results."
  },
  {
    title: "Copy-Paste Implementation",
    description: "Someone grabbed a schema template from the internet, changed a few fields, and called it done. Except they left the example URLs in place. Or duplicated @id references. Or used deprecated properties. Google's Rich Results Test says it's fine. Schema.org validator says it's broken."
  },
  {
    title: "No Entity Relationships",
    description: "Individual schema blocks floating in isolation, with no connections between them. AI doesn't know your Person is the founder of your Organization, which provides your Services, at your LocalBusiness location. Without these relationships, you're just noise in the knowledge graph."
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
    description: "robots.txt and llms.txt optimised for GPTBot, ClaudeBot, PerplexityBot",
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
const proofStats = [
  { value: 100, suffix: "%", label: "Validation Rate", description: "of our implementations pass Schema.org validation" },
  { value: 15, suffix: "+", label: "Schema Types", description: "implemented per average project" },
  { value: 100, suffix: "%", label: "Error Reduction", description: "existing schema errors fixed" },
  { value: 73, suffix: "%", label: "Rich Results", description: "of clients see rich results within 8 weeks" },
];

export default function SchemaMarkupPage() {
  return (
    <>
      {/* Hero Section */}
      <LandingHero
        badge="Structured Data Experts"
        badgeIcon={<FileCode className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="SCHEMA MARKUP SERVICES"
        headline="THAT ACTUALLY VALIDATE"
        subheadline="94% of UK websites have broken or missing schema. Don't be one of them."
        bodyCopy={
          <>
            <p className="mb-4">
              You&apos;ve probably been told schema markup is important. Maybe you&apos;ve even tried to implement it yourself or paid someone to do it. And there&apos;s a good chance it&apos;s either broken, incomplete, or completely useless.
            </p>
            <p className="mb-4">
              We&apos;ve audited hundreds of UK business websites. The state of schema markup out there is genuinely embarrassing. Duplicate @id references. Missing required properties. Schema that technically validates but tells AI absolutely nothing useful. It&apos;s a mess.
            </p>
            <p>
              Our schema markup services don&apos;t just add code to your site. We engineer structured data that AI platforms can actually use to understand and recommend your business. Every implementation validates against Schema.org standards. Every piece of markup serves a purpose.
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
          text: "Your schema exists but achieves nothing. AI crawlers see it, can't make sense of it, and move on to your competitors who got it right."
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
        title="SCHEMA THAT PERFORMS"
        stats={proofStats}
        quote={{
          text: "We validate against Schema.org standards, not just Google's Rich Results Test. Google's tool only checks a subset of schema types and properties. If you want AI platforms to understand your markup, you need full compliance - and that's what we deliver."
        }}
        theme="dark"
      />

      {/* Case Study Section */}
      <LandingCaseStudy 
        title="Schema Markup in Action"
        stat="51"
        statLabel="Schema entries"
        quote="51-entry regulatory knowledge library with proper schema - from invisible to #1 AI-recommended in 6 weeks"
        theme="light" 
      />

      {/* Related Services Section */}
      <LandingRelatedServices
        title="RELATED SERVICES"
        intro="Schema markup is the foundation - combine it with these for maximum impact"
        services={[
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
        description="Stop gambling with broken schema markup. Stop trusting plugins that promise more than they deliver. Stop wondering why AI doesn't know your business exists. Get schema implemented properly, validated against Schema.org standards, with a 100% guarantee."
        footnote="No obligation • 100% validation guarantee • Veteran-owned"
      />
    </>
  );
}
