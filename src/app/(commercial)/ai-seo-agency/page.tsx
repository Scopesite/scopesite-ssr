import Link from 'next/link';
import { Brain, Code2, Globe, TrendingUp, Eye, FileCode } from 'lucide-react';
import {
  LandingHero,
  LandingProblem,
  LandingSolution,
  LandingWhatYouGet,
  LandingProof,
  LandingCaseStudy,
  FAQSection,
  LandingCTA,
} from '@/components/landing';
import { faqItems } from './faqs';
import { websiteEvidenceChecks as proofStats } from '@/lib/website-evidence-checks';

// Problem points
const problemPoints = [
  {
    title: "Invisible to AI Crawlers",
    description: "If important content only appears after JavaScript runs, some retrieval tools may miss it. We inspect the initial HTML, rendered page and provider access rules before deciding what needs repair."
  },
  {
    title: "Missing Entity Relationships",
    description: "Conflicting business names, unclear services and disconnected profiles make your facts harder to verify. Accurate schema can describe real relationships explicitly, alongside clear page content."
  },
  {
    title: "Traditional SEO Isn't Enough",
    description: "You can rank #1 on Google for a keyword, but if someone asks ChatGPT for a recommendation, your competitor might get cited instead."
  },
  {
    title: "Losing the Zero-Click Search",
    description: "Users are getting answers directly from AI without ever clicking a link. If you aren't the answer, you lose the prospect."
  },
];

// Solution features
const solutionFeatures = [
  {
    title: 'AI visibility methodology',
    description: "Our proprietary framework for testing and building AI visibility across all major platforms.",
    iconNode: <Brain className="w-6 h-6 text-brand-gold" />,
  },
  {
    title: "Server-Side Rendering",
    description: "Next.js architecture that delivers useful page content in the initial HTML response.",
    iconNode: <Code2 className="w-6 h-6 text-brand-gold" />,
  },
  {
    title: "Schema Engineering",
    description: "Validated JSON-LD describing your business and its evidenced relationships.",
    iconNode: <FileCode className="w-6 h-6 text-brand-gold" />,
  },
  {
    title: "Entity Building",
    description: "Checking consistent business identity across your website and verified public profiles.",
    iconNode: <Globe className="w-6 h-6 text-brand-gold" />,
  },
];

// What you get cards
const whatYouGetCards = [
  {
    title: "AI Visibility Audit",
    iconNode: <Eye className="w-6 h-6 text-brand-gold" />,
    items: [
      "AI visibility scanner diagnostic",
      "ChatGPT & Claude visibility check",
      "Perplexity citation analysis",
      "Technical crawler access review",
    ],
  },
  {
    title: "Technical Architecture",
    iconNode: <Code2 className="w-6 h-6 text-brand-gold" />,
    items: [
      "Server-side rendered (SSR) builds",
      "robots.txt & llms.txt configuration",
      ".well-known/ai-context.json setup",
      "100/100 Lighthouse performance",
    ],
  },
  {
    title: "Structured Data",
    iconNode: <FileCode className="w-6 h-6 text-brand-gold" />,
    items: [
      "Comprehensive JSON-LD schema",
      "Speakable schema for voice search",
      "Entity relationship mapping",
      "Knowledge Graph alignment",
    ],
  },
  {
    title: "Ongoing Monitoring",
    iconNode: <TrendingUp className="w-6 h-6 text-brand-gold" />,
    items: [
      "AI citation tracking",
      "Schema maintenance",
      "Content architecture updates",
      "Monthly visibility reporting",
    ],
  },
];

// Proof stats


export default function AISEOAgencyPage() {
  return (
    <>
      <LandingHero
        badge="AI SEO Agency"
        badgeIcon={<Brain className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="AI SEO AGENCY"
        headline="WE GET YOU RECOMMENDED."
        subheadline="We don't just get you ranked. We get you recommended by ChatGPT, Claude, Gemini and Perplexity."
        bodyCopy={
          <>
            <p className="mb-4">
              Traditional SEO agencies are still chasing Google rankings while your customers are asking ChatGPT for recommendations.
            </p>
            <p className="mb-4">
              We check your website architecture, structured data and content against the facts of your business. Search results and AI citations are measured separately, so a technical score does not get passed off as a recommendation.
            </p>
            <p>
              Check your current <Link href="/ai-visibility" className="text-brand-gold hover:underline">AI visibility</Link> with the current scanner, explore our <Link href="/generative-engine-optimisation" className="text-brand-gold hover:underline">generative engine optimisation</Link> work, or see our full range of <Link href="/ai-seo-services" className="text-brand-gold hover:underline">AI SEO services</Link>.
            </p>
          </>
        }
        primaryCTA={{ text: 'Explore CAFMO', href: '/voice' }}
        secondaryCTA={{ text: 'Get a Quote', href: '/pricing' }}
      />

      <LandingProblem
        title="WHY TRADITIONAL SEO IS FAILING YOU"
        intro="The search landscape has fundamentally changed. If you are only optimising for Google's blue links, you are ignoring how millions of people now find businesses."
        problems={problemPoints}
      />

      <LandingSolution
        title="THE SCOPESITE DIFFERENCE"
        features={solutionFeatures}
        columns={4}
      />

      {/* How it works / Process */}
      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <div className="text-center mb-12">
            <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">HOW WE MAKE YOU VISIBLE</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Our approach to <Link href="/answer-engine-optimisation" className="text-brand-gold hover:underline">Answer Engine Optimisation</Link> is systematic, technical, and proven.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-brand-graphite/30 p-8 rounded-2xl border border-white/10">
              <div className="text-brand-gold font-headline text-4xl mb-4">01</div>
              <h3 className="text-white font-bold text-xl mb-3">Audit & Architecture</h3>
              <p className="text-white/70">We inspect the HTML, access rules and structured data, then scope the repairs your website needs. Actual assistant answers are checked separately.</p>
            </div>
            <div className="bg-brand-graphite/30 p-8 rounded-2xl border border-white/10">
              <div className="text-brand-gold font-headline text-4xl mb-4">02</div>
              <h3 className="text-white font-bold text-xl mb-3">Schema & Entities</h3>
              <p className="text-white/70">We engineer complex JSON-LD structured data to map your business entities, teaching AI exactly what you do and why you are the authority.</p>
            </div>
            <div className="bg-brand-graphite/30 p-8 rounded-2xl border border-white/10">
              <div className="text-brand-gold font-headline text-4xl mb-4">03</div>
              <h3 className="text-white font-bold text-xl mb-3">Content & Citation</h3>
              <p className="text-white/70">We structure your content for extraction, ensuring your answers are the ones AI platforms choose to cite when users ask questions.</p>
            </div>
          </div>
        </div>
      </section>

      <LandingWhatYouGet
        title="OUR AI SEO METHODOLOGY"
        intro="Technical checks and evidence-led improvements for your website and AI visibility."
        cards={whatYouGetCards}
        columns={4}
      />

      <LandingProof
        title="WHAT WE CHECK"
        stats={proofStats}
        quote={{
          text: "ScopeSite took us from being completely invisible to ChatGPT, to being the number one recommended provider in our sector nationally in under 4 months.",
          author: "Hear 4 The Long Term"
        }}
        theme="dark"
      />

      <LandingCaseStudy 
        title="H4TLT case study"
        description="Read about our work with H4TLT, a workplace hearing surveillance provider."
        theme="light" 
      />

      <FAQSection
        title="AI SEO AGENCY FAQS"
        items={faqItems}
        theme="light"
      />

      <LandingCTA
        title="READY TO BE RECOMMENDED?"
        description="Explore CAFMO and its access terms, or get an instant quote for the work your website needs."
        primaryCTA={{ text: 'Explore CAFMO', href: '/voice' }}
        secondaryCTA={{ text: 'Get Instant Quote', href: '/pricing' }}
        footnote="No corporate waffle • Real results • Read our latest insights on the blog"
      />
    </>
  );
}
