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
import { faqItems } from './faqs';
import { websiteEvidenceChecks as proofStats } from '@/lib/website-evidence-checks';

// Problem points
const problemPoints = [
  {
    title: "JavaScript Walls",
    description: "If a page depends on JavaScript to expose its content, some retrieval tools may miss it. We check the delivered HTML and the access rules for the relevant search and user-requested bots."
  },
  {
    title: "Unknown Entity",
    description: "You are not in Wikidata, not in the Google Knowledge Graph, and not linked to the people and places that define you. AI has no confidence to recommend you."
  },
  {
    title: "Unstructured Facts",
    description: "A buyer should be able to find the service, location and supporting evidence without digging through vague claims. Clear answers also make those facts easier for retrieval tools to extract."
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
        title="GENERATIVE ENGINE OPTIMISATION FAQS"
        items={faqItems}
        theme="light"
      />

      <LandingCTA
        title="READY TO BE CITED?"
        description="Check the technical evidence your website exposes, then assess actual AI answers separately. Start with a website scan or discuss a scoped audit."
        primaryCTA={{ text: 'Free AI visibility scan', href: '/voice' }}
        secondaryCTA={{ text: 'Get Instant Quote', href: '/pricing' }}
        footnote="No corporate waffle • Real results • Read our latest insights on the blog"
      />
    </>
  );
}
