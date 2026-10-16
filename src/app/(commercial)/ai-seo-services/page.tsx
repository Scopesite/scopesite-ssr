import Link from 'next/link';
import { Code2, Shield, TrendingUp, Eye, FileCode, FileText, Settings, Database } from 'lucide-react';
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
import { QuoteRedirectNotice } from '@/components/quote/QuoteRedirectNotice';
import { faqItems } from './faqs';
import { websiteEvidenceChecks as proofStats } from '@/lib/website-evidence-checks';

const problemPoints = [
  {
    title: 'Thin client pages',
    description:
      'Many sites load an empty shell and fill it with JavaScript. AI crawlers often skip that work. They see nothing.',
  },
  {
    title: 'Unstructured facts',
    description:
      'Without structured data, AI has to guess what you do. Guessing leads to wrong answers or silence.',
  },
  {
    title: 'Blocked crawlers',
    description:
      'robots.txt files sometimes block GPTBot, ClaudeBot, or PerplexityBot. You lock the door on AI.',
  },
  {
    title: 'Weak content layout',
    description:
      'Long unstructured paragraphs are hard for AI to parse. Facts need clear layout for machines and humans.',
  },
];

const solutionFeatures = [
  {
    title: 'AI visibility scan',
    description: 'Baseline read across four AI platforms before we change anything.',
    iconNode: <Eye className="w-6 h-6 text-brand-gold" />,
  },
  {
    title: 'Ultra Fast builds',
    description: 'Next.js pages that ship full HTML AI crawlers can read.',
    iconNode: <Code2 className="w-6 h-6 text-brand-gold" />,
  },
  {
    title: 'Structured data',
    description: 'Facts auto-formatted for AI to read, mapped to your services and credentials.',
    iconNode: <FileCode className="w-6 h-6 text-brand-gold" />,
  },
  {
    title: 'Entity building',
    description: 'Wikidata, Knowledge Graph signals, directories, and sameAs links that build trust.',
    iconNode: <Database className="w-6 h-6 text-brand-gold" />,
  },
];

const whatYouGetCards = [
  {
    title: 'Content architecture',
    iconNode: <FileText className="w-6 h-6 text-brand-gold" />,
    items: [
      'Content structured for AI extraction',
      'FAQ-first layouts where they help',
      'Clear entity relationships',
      'Speakable markup for voice surfaces',
    ],
  },
  {
    title: 'Crawler configuration',
    iconNode: <Settings className="w-6 h-6 text-brand-gold" />,
    items: [
      'robots.txt tuned for AI bots',
      'llms.txt where it helps',
      '.well-known/ai-context.json',
      'Crawler access checks',
    ],
  },
  {
    title: 'AI SEO retainer',
    iconNode: <TrendingUp className="w-6 h-6 text-brand-gold" />,
    items: [
      'AI citation monitoring',
      'Structured data maintenance',
      'Content updates for AI',
      'Model and algorithm shifts',
    ],
  },
  {
    title: 'Technical foundation',
    iconNode: <Shield className="w-6 h-6 text-brand-gold" />,
    items: [
      'Ultra Fast HTML delivery',
      'Top Google speed scores on our builds',
      'Core Web Vitals work',
      'Fast global edge hosting',
    ],
  },
];



export default function AISEOServicesPage() {
  return (
    <>
      <QuoteRedirectNotice />
      <LandingHero
        badge="AI SEO Services"
        badgeIcon={<Code2 className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="AI SEO SERVICES"
        headline="EVERYTHING YOU NEED TO BE VISIBLE."
        subheadline="Everything your business needs to become visible to AI search."
        bodyCopy={
          <>
            <p className="mb-4">
              Being recommended by AI does not happen by accident. You need fast HTML, structured facts, and
              content laid out for machine reading.
            </p>
            <p className="mb-4">
              Our AI SEO work runs from the free scan through Ultra Fast rebuilds when needed, plus structured
              data that tells AI exactly who you are.
            </p>
            <p>
              Learn more about our{' '}
              <Link href="/ai-seo-agency" className="text-brand-gold hover:underline">
                AI SEO agency
              </Link>
              , our{' '}
              <Link href="/generative-engine-optimisation" className="text-brand-gold hover:underline">
                generative engine optimisation
              </Link>{' '}
              service, or check your{' '}
              <Link href="/ai-visibility" className="text-brand-gold hover:underline">
                AI visibility
              </Link>{' '}
              with a free scan.
            </p>
          </>
        }
        primaryCTA={{ text: 'Free AI visibility scan', href: '/voice' }}
        secondaryCTA={{ text: 'Get a Quote', href: '/pricing' }}
      />

      <LandingProblem
        title="WHY YOUR CURRENT SITE IS INVISIBLE"
        intro="Most websites are built for humans to look at, not for AI to read. Here are the usual blockers."
        problems={problemPoints}
      />

      <LandingSolution title="OUR AI SEO SERVICES" features={solutionFeatures} columns={4} />

      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <div className="text-center mb-12">
            <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">THE FULL STACK</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              We do not stop at meta tags. We rebuild your technical foundation for{' '}
              <Link href="/answer-engine-optimisation" className="text-brand-gold hover:underline">
                answer engine optimisation
              </Link>
              .
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-brand-graphite/30 p-8 rounded-2xl border border-white/10">
              <h3 className="text-brand-gold font-bold text-xl mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5" /> AI visibility audit
              </h3>
              <p className="text-white/70">
                A diagnostic scan across four AI platforms to show your baseline and blockers.
              </p>
            </div>
            <div className="bg-brand-graphite/30 p-8 rounded-2xl border border-white/10">
              <h3 className="text-brand-gold font-bold text-xl mb-3 flex items-center gap-2">
                <Code2 className="w-5 h-5" /> Ultra Fast website build
              </h3>
              <p className="text-white/70">
                Next.js delivery with full HTML so AI crawlers can read you without running heavy JavaScript.
              </p>
            </div>
            <div className="bg-brand-graphite/30 p-8 rounded-2xl border border-white/10">
              <h3 className="text-brand-gold font-bold text-xl mb-3 flex items-center gap-2">
                <FileCode className="w-5 h-5" /> Structured data engineering
              </h3>
              <p className="text-white/70">
                Deep structured markup that maps services, pricing, locations, and proof points.
              </p>
            </div>
            <div className="bg-brand-graphite/30 p-8 rounded-2xl border border-white/10">
              <h3 className="text-brand-gold font-bold text-xl mb-3 flex items-center gap-2">
                <Database className="w-5 h-5" /> Entity building
              </h3>
              <p className="text-white/70">
                Signals across Wikidata, Knowledge Graph, and directories with strong sameAs links.
              </p>
            </div>
            <div className="bg-brand-graphite/30 p-8 rounded-2xl border border-white/10">
              <h3 className="text-brand-gold font-bold text-xl mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Content architecture
              </h3>
              <p className="text-white/70">
                Layout that surfaces facts for AI extraction, not just long prose blocks.
              </p>
            </div>
            <div className="bg-brand-graphite/30 p-8 rounded-2xl border border-white/10">
              <h3 className="text-brand-gold font-bold text-xl mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5" /> AI crawler configuration
              </h3>
              <p className="text-white/70">
                robots.txt, llms.txt, ai-context.json, and speakable markup so AI can reach your pages.
              </p>
            </div>
          </div>
        </div>
      </section>

      <LandingWhatYouGet
        title="BEYOND THE BUILD"
        intro="What happens after your Ultra Fast site goes live."
        cards={whatYouGetCards}
        columns={4}
      />

      <LandingProof
        title="WHAT WE CHECK"
        stats={proofStats}
        quote={{
          text: 'ScopeSite took us from being completely invisible to ChatGPT, to being the number one recommended provider in our sector nationally in under 4 months.',
          author: 'Hear 4 The Long Term',
        }}
        theme="dark"
      />

      <LandingCaseStudy
        title="H4TLT case study"
        description="Read about our work with H4TLT, a workplace hearing surveillance provider."
        theme="light"
      />

      <FAQSection title="AI SEO SERVICES FAQS" items={faqItems} theme="light" />

      <LandingCTA
        title="READY FOR AI VISIBILITY?"
        description="Stop fighting for blue links while competitors get recommended. Run a free AI visibility scan today, or get an instant quote for AI SEO."
        primaryCTA={{ text: 'Free AI visibility scan', href: '/voice' }}
        secondaryCTA={{ text: 'Get Instant Quote', href: '/pricing' }}
        footnote="No corporate waffle • Real results • Read our latest insights on the blog"
      />
    </>
  );
}
