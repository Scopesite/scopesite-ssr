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

// FAQ Data
const faqItems = [
  {
    question: "What is answer engine optimisation (AEO)?",
    answer: "Answer Engine Optimisation (AEO) is the process of structuring your website and content so that AI-powered answer engines (like ChatGPT, Perplexity, and Claude) can easily extract facts and cite your business as the definitive answer to a user's question, rather than just providing a link to your site."
  },
  {
    question: "How is AEO different from SEO?",
    answer: "Traditional SEO focuses on ranking high in a list of search results using keywords and backlinks. AEO focuses on being the single cited answer. While SEO relies heavily on keyword density and content length, AEO relies on structured data (JSON-LD), clear factual statements, entity relationships, and server-side rendered architecture that AI crawlers can easily digest."
  },
  {
    question: "What is the difference between AEO and GEO?",
    answer: "AEO (Answer Engine Optimisation) and GEO (Generative Engine Optimisation) are often used interchangeably. Both focus on optimising for AI platforms rather than traditional search engines. At ScopeSite, we view AEO as the specific tactic of structuring content to be the 'answer', while GEO encompasses the broader technical architecture required for AI visibility."
  },
  {
    question: "Which AI platforms does AEO target?",
    answer: "Our AEO strategies target the major generative AI platforms: ChatGPT (OpenAI), Claude (Anthropic), Perplexity, Gemini (Google), and Google's AI Overviews (SGE). The structured data and content architecture we implement also heavily benefits voice search assistants like Siri and Alexa."
  },
  {
    question: "How do I know if my business appears in AI answers?",
    answer: "You can manually test by asking ChatGPT or Perplexity questions related to your services in your area. However, AI responses can vary. We use our AI visibility scan to systematically test and benchmark your visibility across multiple AI platforms to give you a clear, objective baseline."
  },
  {
    question: "Can AEO work alongside traditional SEO?",
    answer: "Absolutely. In fact, they complement each other perfectly. The technical foundation required for AEO (fast server-side rendering, comprehensive schema markup, clear content structure) are all massive positive signals for traditional Google SEO. You don't have to choose between ranking and being recommended; you can have both."
  },
  {
    question: "What technical changes does AEO require?",
    answer: "AEO requires a shift away from client-side rendered JavaScript (common in Wix, Squarespace, and basic React sites) to Server-Side Rendering (SSR). It also requires deep JSON-LD schema engineering, optimised robots.txt files that allow AI crawlers, and the implementation of llms.txt files to provide AI-specific context."
  },
  {
    question: "How much does answer engine optimisation cost?",
    answer:
      'Our standard AEO / AI SEO retainer is £500 per month with a £750 one-time setup. If your site needs a full AI-first rebuild, project pricing is on our pricing page via the instant quote calculator.',
  },
  {
    question: "What results can I expect from AEO?",
    answer: "Our goal is to move you from being invisible to AI, to being the cited recommendation in your sector. Clients typically see initial citations in Perplexity within 2-4 weeks, and consistent recommendations in ChatGPT within 6-12 weeks as the AI models update their entity graphs and ingest your new structured data."
  }
];

// Problem points
const problemPoints = [
  {
    title: "The Zero-Click Reality",
    description: "Users are asking AI questions and getting answers directly. They aren't clicking through to websites anymore. If you aren't the answer, you don't exist."
  },
  {
    title: "AI Can't Extract Your Facts",
    description: "Long, flowing marketing copy is great for humans, but terrible for AI extraction. If AI can't easily parse your facts, it won't cite you."
  },
  {
    title: "Missing Context",
    description: "Without structured data and entity relationships, AI doesn't know you are the authority in your field. It will recommend a competitor who has clearer signals."
  },
  {
    title: "Technical Invisibility",
    description: "If your site relies on client-side JavaScript, AI crawlers often see a blank page. You can't be the answer if the AI can't even read your site."
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
    description: "Connecting your business to the Google Knowledge Graph and Wikidata.",
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
const proofStats = [
  { value: 100, suffix: "%", label: "Lighthouse Scores", description: "Perfect technical performance on every build" },
  { value: 4, suffix: "x", label: "AI Platforms", description: "Optimised for ChatGPT, Claude, Gemini & Perplexity" },
  { value: 800, suffix: "M+", label: "Weekly AI Users", description: "The audience you are currently missing" },
  { value: 1, suffix: "st", label: "AI Recommendation", description: "Our goal for your business" },
];

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
              Answer Engine Optimisation (AEO) is the technical and content strategy required to ensure your business is the one these AI platforms cite. It requires a completely different approach to traditional SEO: focusing on structured data, entity relationships, and factual extraction rather than keyword density.
            </p>
            <p>
              ScopeSite is a specialist AEO, <Link href="/generative-engine-optimisation" className="text-brand-gold hover:underline">generative engine optimisation</Link> and <Link href="/ai-seo-agency" className="text-brand-gold hover:underline">AI SEO agency</Link>. Check your current <Link href="/ai-visibility" className="text-brand-gold hover:underline">AI visibility</Link> with a free <Link href="/voice" className="text-brand-gold hover:underline">AI visibility scan</Link>, or explore our specific <Link href="/ai-seo-services" className="text-brand-gold hover:underline">AI SEO services</Link>.
            </p>
          </>
        }
        primaryCTA={{ text: 'Free AI visibility scan', href: '/voice' }}
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
              AEO is not just &quot;SEO but for AI.&quot; It requires a fundamental shift in how you build and structure your digital presence.
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
        quote="See how we used our AI visibility methodology to get H4TLT recommended by Google AI Overviews, ChatGPT, and Perplexity."
        theme="light" 
      />

      <FAQSection
        title="ANSWER ENGINE OPTIMISATION FAQS"
        items={faqItems}
        theme="light"
      />

      <LandingCTA
        title="READY TO BE THE ANSWER?"
        description="Stop fighting for blue links while your competitors get recommended by AI. Run a free AI visibility scan today to see your current AI visibility, or get an instant quote."
        primaryCTA={{ text: 'Free AI visibility scan', href: '/voice' }}
        secondaryCTA={{ text: 'Get Instant Quote', href: '/pricing' }}
        footnote="No corporate waffle • Real results • Read our latest insights on the blog"
      />
    </>
  );
}
