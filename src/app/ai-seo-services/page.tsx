import Link from 'next/link';
import { Search, Brain, Code2, Globe, Shield, Zap, TrendingUp, Eye, FileCode, FileText, Settings, Database } from 'lucide-react';
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

// FAQ Data
const faqItems = [
  {
    question: "What AI SEO services do you offer?",
    answer: "We offer a comprehensive suite of AI SEO services including V.O.I.C.E. AI visibility audits, AI-first website builds using server-side rendering (SSR), JSON-LD schema engineering, entity building across Knowledge Graphs, content architecture for AI extraction, and AI crawler configuration (robots.txt, llms.txt, ai-context.json)."
  },
  {
    question: "Do I need a new website for AI SEO?",
    answer: "Not always, but often yes. If your current website relies heavily on client-side JavaScript (like many Wix, Squarespace, or basic React sites), AI crawlers cannot read your content. In these cases, an AI-first website build using Next.js SSR is required. If your site is already server-side rendered, we can often implement schema and content architecture over the top."
  },
  {
    question: "What is a V.O.I.C.E. audit?",
    answer: "A V.O.I.C.E. audit is our proprietary diagnostic scan that tests your business's visibility across 4 major AI platforms: ChatGPT, Claude, Gemini, and Perplexity. It identifies whether AI can see you, how it describes you, and what technical blockers are preventing you from being recommended."
  },
  {
    question: "How does schema markup help AI find my business?",
    answer: "Schema markup (JSON-LD) is the structured data language that AI platforms use to understand facts about your business. Instead of forcing AI to guess what your website is about by reading paragraphs of text, schema explicitly states your services, prices, location, and credentials in a machine-readable format."
  },
  {
    question: "What is entity building and why does it matter?",
    answer: "Entity building is the process of establishing your business as a recognised 'thing' (entity) in databases like Wikidata and the Google Knowledge Graph. AI models rely on these entity databases to verify facts. If you aren't an established entity, AI is less likely to trust and recommend you."
  },
  {
    question: "Can you optimise my existing Wix/WordPress/Squarespace site for AI?",
    answer: "We can implement basic schema and content changes on WordPress, but platforms like Wix and Squarespace are fundamentally limited for true AI SEO because of how they render code and restrict server access. For serious AI visibility, we strongly recommend a custom SSR build."
  },
  {
    question: "What is an AI visibility retainer?",
    answer: "An AI visibility retainer is our ongoing service where we monitor your AI citations, update your schema as your business changes, add new content structured for AI extraction, and adapt to the rapidly changing algorithms of ChatGPT, Claude, and Perplexity."
  },
  {
    question: "How quickly will I see results from AI SEO services?",
    answer: "Once an AI-first website is launched with proper schema and crawler access, we typically see initial citations in Perplexity within 2-4 weeks. Consistent recommendations in ChatGPT and Claude usually take 6-12 weeks as the models update their underlying data and entity confidence grows."
  }
];

// Problem points
const problemPoints = [
  {
    title: "Client-Side Rendering Blockers",
    description: "Most modern websites load a blank page and use JavaScript to fill in the content. AI crawlers don't run JavaScript. They see nothing."
  },
  {
    title: "Unstructured Data",
    description: "Without JSON-LD schema, AI has to guess what your business does. Guessing leads to hallucinations or being ignored entirely."
  },
  {
    title: "Blocked Crawlers",
    description: "Many standard robots.txt configurations accidentally block GPTBot, ClaudeBot, and PerplexityBot. You are locking the door on AI."
  },
  {
    title: "Poor Content Architecture",
    description: "Long, rambling paragraphs are hard for AI to extract facts from. Content must be structured for machine reading, not just human reading."
  },
];

// Solution features
const solutionFeatures = [
  {
    title: "V.O.I.C.E. Audit",
    description: "Diagnostic scan across 4 AI platforms to establish your baseline visibility.",
    iconNode: <Eye className="w-6 h-6 text-brand-gold" />,
  },
  {
    title: "AI-First Builds",
    description: "Next.js SSR architecture delivering server-rendered HTML that AI crawlers can read.",
    iconNode: <Code2 className="w-6 h-6 text-brand-gold" />,
  },
  {
    title: "Schema Engineering",
    description: "JSON-LD structured data that explicitly teaches AI what your business is.",
    iconNode: <FileCode className="w-6 h-6 text-brand-gold" />,
  },
  {
    title: "Entity Building",
    description: "Wikidata, Google Knowledge Graph, directory submissions, and sameAs signals.",
    iconNode: <Database className="w-6 h-6 text-brand-gold" />,
  },
];

// What you get cards
const whatYouGetCards = [
  {
    title: "Content Architecture",
    iconNode: <FileText className="w-6 h-6 text-brand-gold" />,
    items: [
      "Content structured for AI extraction",
      "FAQ-first content design",
      "Clear entity relationships",
      "Speakable schema for voice",
    ],
  },
  {
    title: "Crawler Configuration",
    iconNode: <Settings className="w-6 h-6 text-brand-gold" />,
    items: [
      "Optimised robots.txt",
      "llms.txt implementation",
      ".well-known/ai-context.json",
      "Crawler access monitoring",
    ],
  },
  {
    title: "AI Visibility Retainer",
    iconNode: <TrendingUp className="w-6 h-6 text-brand-gold" />,
    items: [
      "Ongoing AI citation monitoring",
      "Schema maintenance",
      "Content updates",
      "Algorithm adaptation",
    ],
  },
  {
    title: "Technical Foundation",
    iconNode: <Shield className="w-6 h-6 text-brand-gold" />,
    items: [
      "Server-Side Rendering (SSR)",
      "100/100 Lighthouse scores",
      "Core Web Vitals optimisation",
      "Fast global edge delivery",
    ],
  },
];

// Proof stats
const proofStats = [
  { value: 100, suffix: "%", label: "Lighthouse Scores", description: "Perfect technical performance on every build" },
  { value: 4, suffix: "x", label: "AI Platforms", description: "Optimised for ChatGPT, Claude, Gemini & Perplexity" },
  { value: 800, suffix: "M+", label: "Weekly AI Users", description: "The audience you are currently missing" },
  { value: 1, suffix: "st", label: "AI Recommendation", description: "Our goal for your business" },
];

export default function AISEOServicesPage() {
  return (
    <>
      <LandingHero
        badge="AI SEO Services"
        badgeIcon={<Code2 className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="AI SEO SERVICES"
        headline="EVERYTHING YOU NEED TO BE VISIBLE."
        subheadline="Everything your business needs to become visible to AI search."
        bodyCopy={
          <>
            <p className="mb-4">
              Being recommended by AI doesn't happen by accident. It requires a specific technical architecture, deep structured data, and content engineered for machine extraction.
            </p>
            <p className="mb-4">
              Our AI SEO services cover the entire stack: from auditing your current visibility with our V.O.I.C.E. scanner, to rebuilding your site with Server-Side Rendering (SSR), to engineering the JSON-LD schema that teaches AI exactly who you are.
            </p>
            <p>
              Learn more about our <Link href="/ai-seo-agency" className="text-brand-gold hover:underline">AI SEO agency</Link>, or check your current <Link href="/ai-visibility" className="text-brand-gold hover:underline">AI visibility</Link> with a free scan.
            </p>
          </>
        }
        primaryCTA={{ text: 'Free V.O.I.C.E. Scan', href: '/voice' }}
        secondaryCTA={{ text: 'Get a Quote', href: '/pricing' }}
      />

      <LandingProblem
        title="WHY YOUR CURRENT SITE IS INVISIBLE"
        intro="Most websites are built for humans to look at, not for AI to read. Here are the technical blockers preventing you from being recommended."
        problems={problemPoints}
      />

      <LandingSolution
        title="OUR AI SEO SERVICES"
        features={solutionFeatures}
        columns={4}
      />

      {/* Service Breakdown */}
      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <div className="text-center mb-12">
            <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">THE FULL STACK</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              We don't just tweak meta tags. We rebuild your technical foundation for <Link href="/answer-engine-optimisation" className="text-brand-gold hover:underline">Answer Engine Optimisation</Link>.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-brand-graphite/30 p-8 rounded-2xl border border-white/10">
              <h3 className="text-brand-gold font-bold text-xl mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5" /> V.O.I.C.E. AI Visibility Audit
              </h3>
              <p className="text-white/70">A diagnostic scan across 4 AI platforms to establish your baseline visibility and identify technical blockers.</p>
            </div>
            <div className="bg-brand-graphite/30 p-8 rounded-2xl border border-white/10">
              <h3 className="text-brand-gold font-bold text-xl mb-3 flex items-center gap-2">
                <Code2 className="w-5 h-5" /> AI-First Website Build
              </h3>
              <p className="text-white/70">Next.js SSR architecture delivering server-rendered HTML that AI crawlers can read instantly, without relying on JavaScript execution.</p>
            </div>
            <div className="bg-brand-graphite/30 p-8 rounded-2xl border border-white/10">
              <h3 className="text-brand-gold font-bold text-xl mb-3 flex items-center gap-2">
                <FileCode className="w-5 h-5" /> Schema Engineering
              </h3>
              <p className="text-white/70">Deep JSON-LD structured data that explicitly teaches AI what your business is, mapping your services, pricing, and credentials.</p>
            </div>
            <div className="bg-brand-graphite/30 p-8 rounded-2xl border border-white/10">
              <h3 className="text-brand-gold font-bold text-xl mb-3 flex items-center gap-2">
                <Database className="w-5 h-5" /> Entity Building
              </h3>
              <p className="text-white/70">Establishing your business in Wikidata, Google Knowledge Graph, and directories with strong sameAs signals.</p>
            </div>
            <div className="bg-brand-graphite/30 p-8 rounded-2xl border border-white/10">
              <h3 className="text-brand-gold font-bold text-xl mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Content Architecture
              </h3>
              <p className="text-white/70">Content structured for AI extraction, not just human reading. FAQ-first design and clear factual statements.</p>
            </div>
            <div className="bg-brand-graphite/30 p-8 rounded-2xl border border-white/10">
              <h3 className="text-brand-gold font-bold text-xl mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5" /> AI Crawler Configuration
              </h3>
              <p className="text-white/70">Optimised robots.txt, llms.txt, .well-known/ai-context.json, and speakable schema to ensure AI has full access.</p>
            </div>
          </div>
        </div>
      </section>

      <LandingWhatYouGet
        title="BEYOND THE BUILD"
        intro="What happens after your AI-first site goes live."
        cards={whatYouGetCards}
        columns={4}
      />

      <LandingProof
        title="PROVEN AI VISIBILITY"
        stats={proofStats}
        quote={{
          text: "ScopeSite took us from being completely invisible to ChatGPT, to being the number one recommended provider in our sector nationally in under 4 months.",
          author: "Hear 4 The Long Term"
        }}
        theme="dark"
      />

      <LandingCaseStudy 
        title="From Invisible to AI Recommended"
        quote="See how we used our V.O.I.C.E. methodology to get H4TLT recommended by Google AI Overviews, ChatGPT, and Perplexity."
        theme="light" 
      />

      <FAQSection
        title="AI SEO SERVICES FAQS"
        items={faqItems}
        theme="light"
      />

      <LandingCTA
        title="READY FOR AI VISIBILITY?"
        description="Stop fighting for blue links while your competitors get recommended by AI. Run a free V.O.I.C.E. scan today, or get an instant quote for our AI SEO services."
        primaryCTA={{ text: 'Free V.O.I.C.E. Scan', href: '/voice' }}
        secondaryCTA={{ text: 'Get Instant Quote', href: '/pricing' }}
        footnote="No corporate waffle • Real results • Read our latest insights on the blog"
      />
    </>
  );
}
