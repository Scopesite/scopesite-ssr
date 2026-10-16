import Link from 'next/link';
import { Search, Brain, Code2, Globe, Shield, Zap, TrendingUp, Eye, FileCode, FileText, MessageSquare } from 'lucide-react';
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
    title: "The Zero-Click Reality",
    description: "Users are asking AI questions and getting answers directly. They aren't clicking through to websites anymore. If you aren't the answer, you don't exist."
  },
  {
    title: "AI Can't Extract Your Facts",
    description: "Useful answers need clear facts and supporting evidence. We make those details easy for visitors and retrieval tools to find, then check whether the relevant assistants use them."
  },
  {
    title: "Missing Context",
    description: "Without structured data and entity relationships, AI doesn't know you are the authority in your field. It will recommend a competitor who has clearer signals."
  },
  {
    title: "Technical Invisibility",
    description: "Content delivered only through client-side JavaScript can be missed by tools that do not render it. We check the actual HTML and access conditions rather than inferring a problem from the platform name."
  },
];

// Solution features
const solutionFeatures = [
  {
    title: "Fact-First Content",
    description: "Structuring your content so AI can easily extract the facts it needs to answer user queries.",
    iconNode: <FileText className="w-6 h-6 text-brand-gold" />,
  },
  {
    title: "Schema Engineering",
    description: "Deep JSON-LD structured data that explicitly teaches AI what your business is.",
    iconNode: <FileCode className="w-6 h-6 text-brand-gold" />,
  },
  {
    title: "Server-Side Rendering",
    description: "Next.js SSR architecture delivering server-rendered HTML that AI crawlers can read instantly.",
    iconNode: <Code2 className="w-6 h-6 text-brand-gold" />,
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
    title: "AEO Strategy",
    iconNode: <Brain className="w-6 h-6 text-brand-gold" />,
    items: [
      "Query intent analysis",
      "Competitor citation benchmarking",
      "Content gap identification",
      "Entity relationship mapping",
    ],
  },
  {
    title: "Content Restructuring",
    iconNode: <FileText className="w-6 h-6 text-brand-gold" />,
    items: [
      "FAQ-first content design",
      "Factual statement extraction",
      "Clear heading hierarchies",
      "Speakable schema for voice",
    ],
  },
  {
    title: "Technical Implementation",
    iconNode: <Code2 className="w-6 h-6 text-brand-gold" />,
    items: [
      "Server-side rendered (SSR) builds",
      "Comprehensive JSON-LD schema",
      "llms.txt implementation",
      ".well-known/ai-context.json",
    ],
  },
  {
    title: "Citation Monitoring",
    iconNode: <Eye className="w-6 h-6 text-brand-gold" />,
    items: [
      "AI citation tracking",
      "Brand mention monitoring",
      "Schema validation",
      "Monthly AEO reporting",
    ],
  },
];

// Proof stats


export default function AEOPage() {
  return (
    <>
      <LandingHero
        badge="AEO Agency"
        badgeIcon={<MessageSquare className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="ANSWER ENGINE OPTIMISATION"
        headline="BE THE ANSWER."
        subheadline="When someone asks AI a question about your industry, your business should be the answer."
        bodyCopy={
          <>
            <p className="mb-4">
              The shift from search engines to answer engines is already here. People aren&apos;t looking for a list of links anymore; they are asking ChatGPT, Claude, and Perplexity for direct answers and recommendations.
            </p>
            <p className="mb-4">
              Answer Engine Optimisation (AEO) examines whether answer systems can find and use accurate information about your business. We work on accessible pages, useful answers and evidenced relationships, then check actual citations. This overlaps with SEO and needs provider-specific testing.
            </p>
            <p>
              ScopeSite is a specialist AEO, <Link href="/generative-engine-optimisation" className="text-brand-gold hover:underline">generative engine optimisation</Link> and <Link href="/ai-seo-agency" className="text-brand-gold hover:underline">AI SEO agency</Link>. Check your current <Link href="/ai-visibility" className="text-brand-gold hover:underline">AI visibility</Link> with a free <Link href="/voice" className="text-brand-gold hover:underline">AI visibility scan</Link>, or explore our specific <Link href="/ai-seo-services" className="text-brand-gold hover:underline">AI SEO services</Link>.
            </p>
          </>
        }
        primaryCTA={{ text: 'Explore CAFMO', href: '/voice' }}
        secondaryCTA={{ text: 'Get a Quote', href: '/pricing' }}
      />

      <LandingProblem
        title="THE END OF THE BLUE LINK"
        intro="If you are only optimising for Google's traditional search results, you are preparing for a battle that is already over. Here is why you need AEO."
        problems={problemPoints}
      />

      <LandingSolution
        title="HOW WE OPTIMISE FOR ANSWERS"
        features={solutionFeatures}
        columns={4}
      />

      {/* AEO vs SEO */}
      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <div className="text-center mb-12">
            <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">AEO VS SEO: THE DIFFERENCE</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              AEO builds on useful content and accessible pages. The extra work is identifying and testing the retrieval routes that matter to your buyers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-brand-graphite/30 p-8 rounded-2xl border border-white/10">
              <h3 className="text-brand-gold font-bold text-xl mb-4">Traditional SEO</h3>
              <ul className="space-y-4 text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✕</span> Goal: Rank high in a list of links
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✕</span> Tactic: Keyword density and backlinks
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✕</span> Content: Long-form marketing copy
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✕</span> Metric: Clicks and impressions
                </li>
              </ul>
            </div>
            <div className="bg-brand-graphite/30 p-8 rounded-2xl border border-brand-gold/30">
              <h3 className="text-brand-gold font-bold text-xl mb-4">Answer Engine Optimisation</h3>
              <ul className="space-y-4 text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span> Goal: Be the single cited answer
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span> Tactic: Structured data and entities
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span> Content: Factual, extractable statements
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span> Metric: AI citations and recommendations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <LandingWhatYouGet
        title="OUR AEO METHODOLOGY"
        intro="We rebuild your technical and content foundation so AI can easily extract and cite your expertise."
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
        title="ANSWER ENGINE OPTIMISATION FAQS"
        items={faqItems}
        theme="light"
      />

      <LandingCTA
        title="READY TO BE THE ANSWER?"
        description="Explore CAFMO and its access terms, or get an instant quote for the work your website needs."
        primaryCTA={{ text: 'Explore CAFMO', href: '/voice' }}
        secondaryCTA={{ text: 'Get Instant Quote', href: '/pricing' }}
        footnote="No corporate waffle • Real results • Read our latest insights on the blog"
      />
    </>
  );
}
