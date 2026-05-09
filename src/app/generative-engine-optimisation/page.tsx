import Link from 'next/link';
import { Quote, MessageSquare, Code2, Globe, FileCode, FileText, Eye, TrendingUp } from 'lucide-react';
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
    question: "What is generative engine optimisation?",
    answer: "Generative engine optimisation is the practice of structuring your website, schema and content so that generative AI models (ChatGPT, Claude, Gemini and Perplexity) cite your business when someone asks a question in your field. Traditional SEO targets a list of ten blue links. GEO targets the one or two sources the model actually names in its answer."
  },
  {
    question: "What is the difference between GEO and SEO?",
    answer: "SEO fights for ranking on a search engine results page. GEO fights to be a citation inside a generative AI answer. SEO cares about keywords, backlinks and click-through rate. GEO cares about structured data, entity relationships, server-rendered HTML and whether the model can extract a clean fact from your page in the first place."
  },
  {
    question: "What is the difference between GEO and AEO?",
    answer: "AEO (answer engine optimisation) is about being the single extracted answer to a specific question. GEO (generative engine optimisation) is broader, covering every technical and content signal that influences whether a generative model trusts and cites your brand. In practice the two overlap heavily, and most agency briefs use the terms interchangeably."
  },
  {
    question: "How do AI models decide which businesses to recommend?",
    answer: "Generative models blend training data, real-time retrieval and entity confidence scoring. If your business is an established entity in Wikidata and the Google Knowledge Graph, has rich structured data and is reachable via fast, server-rendered HTML, you are more likely to be cited. If your site is a JavaScript shell with no structured facts, the model has nothing to work with and picks a competitor."
  },
  {
    question: "Do I need GEO if I already have SEO?",
    answer: "Yes. Strong SEO gives you clicks from Google traditional results, but it does not guarantee a single citation inside ChatGPT, Gemini, Claude or Perplexity. Those platforms rank by entity confidence and extraction quality, not keyword density. GEO adds the structured data, content architecture and crawler access that AI models specifically require."
  },
  {
    question: "Which AI platforms does generative engine optimisation target?",
    answer: "ChatGPT (OpenAI), Claude (Anthropic), Perplexity, Gemini (Google) and Google AI Overviews are the five platforms that matter for UK businesses in 2026. The same structured data signals also help with voice search on Siri and Alexa, so the work carries over."
  },
  {
    question: "How long does generative engine optimisation take to work?",
    answer: "Perplexity typically starts citing correctly structured sources within 2 to 4 weeks. ChatGPT and Claude usually take 6 to 12 weeks as their retrieval layers pick up your new schema. Persistent citations, where the model names your business by default in a category, take 3 to 6 months depending on your starting authority."
  },
  {
    question: "How much does a generative engine optimisation agency cost?",
    answer:
      'Our standard GEO retainer is £500 per month with a £750 one-time setup, covering ongoing schema maintenance, entity work, citation tracking and monthly reporting. A full AI-first website rebuild, if your site blocks AI crawlers, is priced as a project — use the quote calculator at /pricing.',
  }
];

// Problem points
const problemPoints = [
  {
    title: "JavaScript Walls",
    description: "Your website renders client-side, so GPTBot and ClaudeBot see a blank page. Blank pages do not get cited."
  },
  {
    title: "Unknown Entity",
    description: "You are not in Wikidata, not in the Google Knowledge Graph, and not linked to the people and places that define you. AI has no confidence to recommend you."
  },
  {
    title: "Unstructured Facts",
    description: "Flowing marketing prose reads well to humans. AI cannot extract a clean fact from it. If the model cannot quote you, it will not cite you."
  },
  {
    title: "Ranking Without Citation",
    description: "You can hold position one on Google and still be absent from ChatGPT, Perplexity and Gemini answers. Different engines, different rules."
  },
];

// Solution features
const solutionFeatures = [
  {
    title: "Citation Engineering",
    description: "We engineer the specific signals AI models use when deciding which brand to cite in an answer.",
    iconNode: <MessageSquare className="w-6 h-6 text-brand-gold" />,
  },
  {
    title: 'Structured data & facts',
    description: 'Deep structured data covering every service, price, review, FAQ and credential on your site.',
    iconNode: <FileCode className="w-6 h-6 text-brand-gold" />,
  },
  {
    title: "Entity Disambiguation",
    description: "Wikidata entries, Google Knowledge Graph signals, sameAs links and consistent NAP data.",
    iconNode: <Globe className="w-6 h-6 text-brand-gold" />,
  },
  {
    title: "Content Architecture",
    description: "Short, factual, extractable statements organised by question and by entity.",
    iconNode: <FileText className="w-6 h-6 text-brand-gold" />,
  },
];

// What you get cards
const whatYouGetCards = [
  {
    title: 'AI visibility GEO audit',
    iconNode: <Eye className="w-6 h-6 text-brand-gold" />,
    items: [
      "Citation baseline across 4 AI platforms",
      "Competitor citation benchmarking",
      "Schema validation and gap analysis",
      "Crawler access and rendering checks",
    ],
  },
  {
    title: "Technical Foundation",
    iconNode: <Code2 className="w-6 h-6 text-brand-gold" />,
    items: [
      "Server-rendered HTML delivery",
      "Optimised robots.txt and llms.txt",
      ".well-known/ai-context.json setup",
      "Strong Core Web Vitals and speed scores",
    ],
  },
  {
    title: "Entity & Schema Work",
    iconNode: <FileCode className="w-6 h-6 text-brand-gold" />,
    items: [
      "Deep structured data for services and FAQs",
      "Speakable markup for voice assistants",
      "Wikidata and Knowledge Graph signals",
      "sameAs and NAP consistency",
    ],
  },
  {
    title: "Citation Monitoring",
    iconNode: <TrendingUp className="w-6 h-6 text-brand-gold" />,
    items: [
      "Monthly AI citation tracking",
      "Brand mention reporting",
      "Schema maintenance",
      "Algorithm adaptation",
    ],
  },
];

// Proof stats
const proofStats = [
  { value: 100, suffix: "%", label: "Speed scores", description: "Strong technical performance on every build" },
  { value: 4, suffix: "x", label: "AI Platforms", description: "Optimised for ChatGPT, Claude, Gemini & Perplexity" },
  { value: 800, suffix: "M+", label: "Weekly AI Users", description: "The audience you are currently missing" },
  { value: 1, suffix: "st", label: "AI Recommendation", description: "Our goal for your business" },
];

export default function GenerativeEngineOptimisationPage() {
  return (
    <>
      <LandingHero
        badge="GEO Agency"
        badgeIcon={<Quote className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="GENERATIVE ENGINE OPTIMISATION"
        headline="BE THE CITED SOURCE."
        subheadline="When AI picks sources to cite, your business should be one of them."
        bodyCopy={
          <>
            <p className="mb-4">
              Search changed. People ask ChatGPT, Claude, Gemini and Perplexity for answers, and the model picks a handful of sources to cite. Generative engine optimisation is the technical discipline of being one of them. If you are still untangling the vocabulary, start with{' '}
              <Link href="/blog/geo-vs-seo-vs-aeo" className="text-brand-gold hover:underline">
                the difference between GEO, SEO, and AEO
              </Link>
              — three related disciplines with different success metrics.
            </p>
            <p className="mb-4">
              As a specialist generative engine optimisation agency, we engineer the structured data, entity signals and server-rendered HTML that AI models actually read. Rankings are not citations. You do not want a blue link on page one. You want the recommendation — the outcome we unpack in{' '}
              <Link
                href="/blog/how-to-get-recommended-by-chatgpt"
                className="text-brand-gold hover:underline"
              >
                how to get recommended by ChatGPT in 2026
              </Link>
              , alongside what it takes to earn the same on other generative engines.
            </p>
            <p>
              We also run the closely related disciplines: our <Link href="/ai-seo-agency" className="text-brand-gold hover:underline">AI SEO agency</Link> work covers the broader stack, our <Link href="/ai-seo-services" className="text-brand-gold hover:underline">AI SEO services</Link> page lists each deliverable, <Link href="/answer-engine-optimisation" className="text-brand-gold hover:underline">answer engine optimisation</Link> is the content-side sibling of GEO, and our <Link href="/ai-visibility" className="text-brand-gold hover:underline">AI visibility</Link> scanner measures the lot.
            </p>
          </>
        }
        primaryCTA={{ text: 'Free AI visibility scan', href: '/voice' }}
        secondaryCTA={{ text: 'Get a Quote', href: '/pricing' }}
      />

      <LandingProblem
        title="WHY YOU ARE NOT IN THE ANSWER"
        intro="AI models pick a small, specific set of sources to cite. Everyone else is invisible. Here is why you are probably the everyone else."
        problems={problemPoints}
      />

      <LandingSolution
        title="HOW GENERATIVE ENGINE OPTIMISATION WORKS"
        features={solutionFeatures}
        columns={4}
      />

      {/* How it works / Process */}
      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <div className="text-center mb-12">
            <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">THE GEO PROCESS</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Three phases. No guesswork. Every phase produces measurable output you can audit.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-brand-graphite/30 p-8 rounded-2xl border border-white/10">
              <div className="text-brand-gold font-headline text-4xl mb-4">01</div>
              <h3 className="text-white font-bold text-xl mb-3">Measure</h3>
              <p className="text-white/70">We start with an AI visibility scan across ChatGPT, Claude, Gemini and Perplexity to see exactly how the models describe you, which competitors they cite instead, and which technical blockers are getting in the way.</p>
            </div>
            <div className="bg-brand-graphite/30 p-8 rounded-2xl border border-white/10">
              <div className="text-brand-gold font-headline text-4xl mb-4">02</div>
              <h3 className="text-white font-bold text-xl mb-3">Re-engineer</h3>
              <p className="text-white/70">We rebuild your technical foundation where needed: server-rendered HTML, deep structured data, robots.txt and llms.txt, entity profiles in Wikidata and Knowledge Graph, and content restructured for citation eligibility.</p>
            </div>
            <div className="bg-brand-graphite/30 p-8 rounded-2xl border border-white/10">
              <div className="text-brand-gold font-headline text-4xl mb-4">03</div>
              <h3 className="text-white font-bold text-xl mb-3">Monitor</h3>
              <p className="text-white/70">Citations are not a one-off project. We track your AI visibility monthly, adapt to algorithm shifts in each model, and update your schema and entity signals as your business evolves.</p>
            </div>
          </div>
        </div>
      </section>

      <LandingWhatYouGet
        title="WHAT A GEO RETAINER INCLUDES"
        intro="The specific work that turns a website from invisible to cited."
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
        title="GENERATIVE ENGINE OPTIMISATION FAQS"
        items={faqItems}
        theme="light"
      />

      <LandingCTA
        title="READY TO BE CITED?"
        description="Stop being invisible to generative AI. Run a free AI visibility scan today and see exactly how ChatGPT, Claude, Gemini and Perplexity describe your business right now."
        primaryCTA={{ text: 'Free AI visibility scan', href: '/voice' }}
        secondaryCTA={{ text: 'Get Instant Quote', href: '/pricing' }}
        footnote="No corporate waffle • Real results • Read our latest insights on the blog"
      />
    </>
  );
}
