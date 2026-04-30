import Link from 'next/link';
import { Search, Brain, Code2, Globe, Shield, Zap, TrendingUp, Eye, FileCode, FileText, Activity } from 'lucide-react';
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
    question: "What is AI visibility?",
    answer: "AI visibility is the measure of how well your business is understood, cited, and recommended by artificial intelligence platforms like ChatGPT, Claude, Perplexity, and Gemini. If a potential customer asks an AI assistant for a recommendation in your industry, your AI visibility determines whether your business is the answer."
  },
  {
    question: "How do I check if AI can find my business?",
    answer: "You can manually test by asking ChatGPT or Perplexity questions related to your services. However, for a systematic and objective baseline, we use our proprietary V.O.I.C.E. scanner. This tool tests your visibility across multiple AI platforms and identifies technical blockers preventing you from being recommended."
  },
  {
    question: "Why is my website not showing up in ChatGPT?",
    answer: "The most common reason is client-side rendering (CSR). If your website uses JavaScript to load content (common in Wix, Squarespace, and basic React sites), AI crawlers like GPTBot often see a blank page. Other reasons include missing JSON-LD schema markup, poor entity relationships, or robots.txt files that accidentally block AI crawlers."
  },
  {
    question: "What is the V.O.I.C.E. scanner?",
    answer: "The V.O.I.C.E. scanner is our proprietary diagnostic tool that tests your business's AI visibility. It checks how major generative engines currently describe your business, analyses your schema markup, verifies AI crawler access, and benchmarks your visibility against competitors."
  },
  {
    question: "Does AI visibility replace SEO?",
    answer: "No, AI visibility and traditional SEO complement each other. While SEO focuses on ranking in Google's traditional search results, AI visibility focuses on being the cited answer in AI platforms. The technical foundation required for AI visibility (fast server-side rendering, comprehensive schema) also heavily benefits traditional SEO."
  },
  {
    question: "Which AI platforms matter for my business?",
    answer: "The 'Big Four' generative engines matter most: ChatGPT (OpenAI), Claude (Anthropic), Perplexity, and Gemini (Google). Additionally, Google's AI Overviews (SGE) are crucial as they integrate AI directly into traditional search results. Optimising for these platforms also improves visibility on voice assistants like Siri and Alexa."
  },
  {
    question: "How long does it take to become AI visible?",
    answer: "Once we implement an AI-first architecture with proper schema and crawler access, we typically see initial citations in Perplexity within 2-4 weeks. Consistent recommendations in ChatGPT and Claude usually take 6-12 weeks as the models update their underlying data and entity confidence grows."
  },
  {
    question: "What is LLM visibility?",
    answer: "LLM (Large Language Model) visibility is another term for AI visibility. It refers specifically to how well your business is represented in the training data and real-time retrieval systems of models like GPT-4, Claude 3.5, and Gemini Pro."
  },
  {
    question: "Can I track my AI visibility over time?",
    answer: "Yes. As part of our AI visibility retainers, we provide ongoing monitoring and reporting. We track direct AI citations, brand mentions in LLM outputs, schema validation scores, and AI crawler access logs to ensure your visibility continues to grow."
  }
];

// Problem points
const problemPoints = [
  {
    title: "The 800 Million User Blind Spot",
    description: "Over 800 million people use ChatGPT weekly. If your business isn't visible to these users, you are ignoring a massive, high-intent audience."
  },
  {
    title: "The JavaScript Trap",
    description: "Most modern websites use client-side rendered JavaScript. AI crawlers like GPTBot and ClaudeBot cannot execute this code, meaning they see a blank page instead of your business."
  },
  {
    title: "Rankings Don't Equal Recommendations",
    description: "You might be #1 on Google, but AI platforms don't rank pages—they recommend businesses. Without proper entity mapping, AI won't recommend you."
  },
  {
    title: "The Trust Deficit",
    description: "AI models rely on structured data and Knowledge Graphs to verify facts. If your business lacks these signals, AI considers you untrustworthy and will cite a competitor instead."
  },
];

// Solution features
const solutionFeatures = [
  {
    title: "V.O.I.C.E. Scanner",
    description: "Our proprietary tool that measures your exact AI visibility across ChatGPT, Claude, Gemini, and Perplexity.",
    iconNode: <Activity className="w-6 h-6 text-brand-gold" />,
  },
  {
    title: "Technical Architecture",
    description: "Server-side rendered (SSR) foundations that guarantee AI crawlers can read your content instantly.",
    iconNode: <Code2 className="w-6 h-6 text-brand-gold" />,
  },
  {
    title: "Schema Engineering",
    description: "Comprehensive JSON-LD structured data that translates your business into machine-readable facts.",
    iconNode: <FileCode className="w-6 h-6 text-brand-gold" />,
  },
  {
    title: "Entity Optimisation",
    description: "Building your presence in Wikidata and the Google Knowledge Graph to establish undeniable authority.",
    iconNode: <Globe className="w-6 h-6 text-brand-gold" />,
  },
];

// What you get cards
const whatYouGetCards = [
  {
    title: "Visibility Audit",
    iconNode: <Eye className="w-6 h-6 text-brand-gold" />,
    items: [
      "V.O.I.C.E. scanner diagnostic",
      "ChatGPT & Claude visibility check",
      "Perplexity citation analysis",
      "Technical crawler access review",
    ],
  },
  {
    title: "Technical Fixes",
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
    title: "Ongoing Tracking",
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
const proofStats = [
  { value: 100, suffix: "%", label: "Lighthouse Scores", description: "Perfect technical performance on every build" },
  { value: 4, suffix: "x", label: "AI Platforms", description: "Optimised for ChatGPT, Claude, Gemini & Perplexity" },
  { value: 800, suffix: "M+", label: "Weekly AI Users", description: "The audience you are currently missing" },
  { value: 1, suffix: "st", label: "AI Recommendation", description: "Our goal for your business" },
];

export default function AIVisibilityPage() {
  return (
    <>
      <LandingHero
        badge="AI Visibility Agency"
        badgeIcon={<Eye className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="AI VISIBILITY"
        headline="BE SEEN BY THE MACHINES."
        subheadline="If AI can't find you, your customers can't either. Not for much longer."
        bodyCopy={
          <>
            <p className="mb-4">
              AI visibility is the new SEO. It&apos;s the measure of how well your business is understood, cited, and recommended by artificial intelligence platforms like ChatGPT, Claude, Perplexity, and Gemini.
            </p>
            <p className="mb-4">
              The technical reality is that most websites are completely invisible to AI crawlers. They rely on client-side rendered JavaScript that ChatGPT-User, ClaudeBot, and PerplexityBot simply cannot execute. If they can&apos;t read your site, they can&apos;t recommend your business.
            </p>
            <p>
              We fix this. As a specialist <Link href="/ai-seo-agency" className="text-brand-gold hover:underline">AI SEO agency</Link> and <Link href="/generative-engine-optimisation" className="text-brand-gold hover:underline">generative engine optimisation</Link> specialist, we use our proprietary V.O.I.C.E. methodology to measure and improve your LLM visibility. Explore our <Link href="/ai-seo-services" className="text-brand-gold hover:underline">AI SEO services</Link> to learn how we rebuild your technical foundation for the AI era.
            </p>
          </>
        }
        primaryCTA={{ text: 'Free V.O.I.C.E. Scan', href: '/voice' }}
        secondaryCTA={{ text: 'Get a Quote', href: '/pricing' }}
      />

      <LandingProblem
        title="THE INVISIBILITY CRISIS"
        intro="Most businesses assume that because they rank on Google, AI knows who they are. This is a dangerous assumption. Here is why you are likely invisible to AI."
        problems={problemPoints}
      />

      <LandingSolution
        title="HOW WE FIX AI VISIBILITY"
        features={solutionFeatures}
        columns={4}
      />

      {/* Thought Leadership / V.O.I.C.E. Section */}
      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <div className="text-center mb-12">
            <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">MEASURING THE INVISIBLE</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              You can&apos;t improve what you can&apos;t measure. That&apos;s why we built the V.O.I.C.E. scanner.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-brand-graphite/30 p-8 rounded-2xl border border-white/10">
              <h3 className="text-brand-gold font-bold text-xl mb-4">The V.O.I.C.E. Methodology</h3>
              <p className="text-white/70 mb-4">
                V.O.I.C.E. stands for Visibility, Optimisation, for Intelligent, Crawler, Engines. It&apos;s our proprietary framework for testing and building AI visibility across all major platforms.
              </p>
              <p className="text-white/70">
                We don&apos;t guess what AI thinks of your business. We systematically test it, identify the technical blockers (like missing schema or client-side rendering), and implement <Link href="/answer-engine-optimisation" className="text-brand-gold hover:underline">Answer Engine Optimisation</Link> to fix them.
              </p>
            </div>
            <div className="bg-brand-graphite/30 p-8 rounded-2xl border border-brand-gold/30 flex flex-col justify-center items-center text-center">
              <Activity className="w-16 h-16 text-brand-gold mb-4" />
              <h3 className="text-white font-bold text-xl mb-4">Run Your Free Scan</h3>
              <p className="text-white/70 mb-6">
                Find out exactly how ChatGPT, Claude, and Perplexity view your business right now.
              </p>
              <Link href="/voice" className="btn-primary">
                Start V.O.I.C.E. Scan
              </Link>
            </div>
          </div>
        </div>
      </section>

      <LandingWhatYouGet
        title="OUR VISIBILITY SERVICES"
        intro="Everything required to turn your website into an AI-recommended authority."
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
        title="AI VISIBILITY FAQS"
        items={faqItems}
        theme="light"
      />

      <LandingCTA
        title="READY TO BE SEEN?"
        description="Stop fighting for blue links while your competitors get recommended by AI. Run a free V.O.I.C.E. scan today to see your current AI visibility, or get an instant quote."
        primaryCTA={{ text: 'Free V.O.I.C.E. Scan', href: '/voice' }}
        secondaryCTA={{ text: 'Get Instant Quote', href: '/pricing' }}
        footnote="No corporate waffle • Real results • Read our latest insights on the blog"
      />
    </>
  );
}
