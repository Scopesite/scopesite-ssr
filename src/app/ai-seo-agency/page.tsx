import Link from 'next/link';
import { Search, Brain, Code2, Globe, Shield, Zap, TrendingUp, Eye, FileCode, FileText } from 'lucide-react';
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
    question: "What is an AI SEO agency?",
    answer: "An AI SEO agency specialises in making your business visible to artificial intelligence platforms like ChatGPT, Claude, Perplexity, and Gemini. Instead of just trying to rank you on Google's traditional search results, we engineer your website's architecture, structured data, and content so that AI models extract it, understand it, and recommend your business to users."
  },
  {
    question: "How is AI SEO different from traditional SEO?",
    answer: "Traditional SEO focuses on keywords, backlinks, and climbing a list of blue links on Google. AI SEO (or Answer Engine Optimisation) focuses on being the single cited answer when someone asks an AI assistant a question. AI platforms don't care about your keyword density; they care about clear entity relationships, comprehensive schema markup, and server-side rendered content they can easily read."
  },
  {
    question: "Can my current website be optimised for AI search?",
    answer: "It depends on how it's built. If your site relies heavily on client-side JavaScript (like many Wix or basic React sites), AI crawlers like GPTBot might see a blank page. We start with a V.O.I.C.E. scan to see what AI currently sees. In many cases, we need to implement server-side rendering (SSR) and rebuild your schema architecture to make you visible."
  },
  {
    question: "How long does it take to appear in AI recommendations?",
    answer: "Unlike traditional SEO which can take 6-12 months, AI platforms often ingest new structured data and content much faster. We typically see clients appearing in Perplexity citations within 2-4 weeks, and becoming consistent recommendations in ChatGPT within 6-12 weeks, depending on the industry and current authority."
  },
  {
    question: "Do you work with businesses outside Somerset?",
    answer: "Yes. While we are based in Frome, Somerset, we work with professional services, clinics, and e-commerce businesses across the UK. AI visibility is a national and global game, and our methodology works regardless of your location."
  },
  {
    question: "What does AI SEO cost?",
    answer: "Our AI SEO retainers start from £750 per month. If you need a new AI-first website built from scratch, those projects start from £2,625. We provide transparent pricing and you can use our quote calculator to get an exact figure for your specific needs."
  },
  {
    question: "How do you measure AI SEO results?",
    answer: "We don't just track Google rankings. We track direct AI citations, brand mentions in LLM outputs, schema validation scores, and AI crawler access logs. We use our proprietary V.O.I.C.E. scanner to benchmark your visibility across ChatGPT, Claude, Gemini, and Perplexity over time."
  },
  {
    question: "What AI platforms do you optimise for?",
    answer: "We optimise for the major generative engines: ChatGPT (OpenAI), Claude (Anthropic), Perplexity, Gemini (Google), and Google's AI Overviews (SGE). By focusing on universal structured data standards and clean server-side HTML, our optimisations also cover voice assistants like Siri and Alexa."
  }
];

// Problem points
const problemPoints = [
  {
    title: "Invisible to AI Crawlers",
    description: "If your website uses client-side rendering, ChatGPT-User and ClaudeBot literally cannot read your content. You are invisible."
  },
  {
    title: "Missing Entity Relationships",
    description: "AI doesn't read keywords; it maps entities. Without proper JSON-LD schema, AI doesn't know what your business actually does."
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
    title: "V.O.I.C.E. Methodology",
    description: "Our proprietary framework for testing and building AI visibility across all major platforms.",
    iconNode: <Brain className="w-6 h-6 text-brand-gold" />,
  },
  {
    title: "Server-Side Rendering",
    description: "Next.js architecture ensuring every AI crawler gets fully rendered HTML instantly.",
    iconNode: <Code2 className="w-6 h-6 text-brand-gold" />,
  },
  {
    title: "Schema Engineering",
    description: "Deep JSON-LD structured data that teaches AI exactly who you are and what you do.",
    iconNode: <FileCode className="w-6 h-6 text-brand-gold" />,
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
    title: "AI Visibility Audit",
    iconNode: <Eye className="w-6 h-6 text-brand-gold" />,
    items: [
      "V.O.I.C.E. scanner diagnostic",
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
const proofStats = [
  { value: 100, suffix: "%", label: "Lighthouse Scores", description: "Perfect technical performance on every build" },
  { value: 4, suffix: "x", label: "AI Platforms", description: "Optimised for ChatGPT, Claude, Gemini & Perplexity" },
  { value: 800, suffix: "M+", label: "Weekly AI Users", description: "The audience you are currently missing" },
  { value: 1, suffix: "st", label: "AI Recommendation", description: "Our goal for your business" },
];

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
              As a specialist AI SEO agency, we understand the difference between ranking for a keyword and being cited as the definitive answer. We engineer your website&apos;s architecture, structured data, and content so that AI platforms extract it, trust it, and recommend your business.
            </p>
            <p>
              Check your current <Link href="/ai-visibility" className="text-brand-gold hover:underline">AI visibility</Link> with our free V.O.I.C.E. scan, explore our <Link href="/generative-engine-optimisation" className="text-brand-gold hover:underline">generative engine optimisation</Link> work, or see our full range of <Link href="/ai-seo-services" className="text-brand-gold hover:underline">AI SEO services</Link>.
            </p>
          </>
        }
        primaryCTA={{ text: 'Free V.O.I.C.E. Scan', href: '/voice' }}
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
              <p className="text-white/70">We run a deep V.O.I.C.E. scan to see how AI views you now, then build a server-side rendered foundation that crawlers can actually read.</p>
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
        title="AI SEO AGENCY FAQS"
        items={faqItems}
        theme="light"
      />

      <LandingCTA
        title="READY TO BE RECOMMENDED?"
        description="Stop fighting for blue links while your competitors get recommended by AI. Run a free V.O.I.C.E. scan today to see your current AI visibility, or get an instant quote."
        primaryCTA={{ text: 'Free V.O.I.C.E. Scan', href: '/voice' }}
        secondaryCTA={{ text: 'Get Instant Quote', href: '/pricing' }}
        footnote="No corporate waffle • Real results • Read our latest insights on the blog"
      />
    </>
  );
}
