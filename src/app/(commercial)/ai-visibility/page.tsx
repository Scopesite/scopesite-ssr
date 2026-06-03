import Link from 'next/link';
import { Code2, Globe, TrendingUp, Eye, FileCode, Activity } from 'lucide-react';
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

const faqItems = [
  {
    question: 'What is AI visibility?',
    answer:
      'AI visibility is how well AI platforms understand, cite, and recommend your business. When someone asks ChatGPT or Perplexity for help in your market, your AI visibility decides if you are part of the answer.',
  },
  {
    question: 'How do I check if AI can find my business?',
    answer:
      'You can ask ChatGPT or Perplexity manual questions, but the reliable baseline is our free AI visibility scan. It tests multiple platforms and lists the technical blocks that stop recommendations.',
  },
  {
    question: 'Why is my website not showing up in ChatGPT?',
    answer:
      'Often the site loads content with JavaScript after the page shell. AI crawlers may skip that step and see a blank page. Missing structured data, weak entity signals, or blocked crawlers are the other usual causes.',
  },
  {
    question: 'What does the AI visibility scan do?',
    answer:
      'It shows how major AI engines describe you today, checks structured data, verifies crawler access, and benchmarks you against competitors.',
  },
  {
    question: 'Does AI visibility replace SEO?',
    answer:
      'No. Classic SEO targets rankings. AI visibility targets citations inside AI answers. The same technical work, fast HTML plus structured facts, helps both.',
  },
  {
    question: 'Which AI platforms matter?',
    answer:
      'ChatGPT, Claude, Perplexity, and Gemini matter most. Google AI Overviews matter because AI sits inside normal search. Voice assistants benefit from the same structured facts.',
  },
  {
    question: 'How long does it take to become AI visible?',
    answer:
      'After an Ultra Fast architecture with structured data and crawler access, we often see early Perplexity citations in 2 to 4 weeks. ChatGPT and Claude usually need 6 to 12 weeks as trust builds.',
  },
  {
    question: 'What is LLM visibility?',
    answer:
      'It is another name for AI visibility. It focuses on how large language models represent you in retrieval and answers.',
  },
  {
    question: 'Can I track AI visibility over time?',
    answer:
      'Yes. On retainers we monitor citations, schema health, crawler access, and reporting monthly. Standalone AI SEO is £750 setup and £500 per month on a 6- or 12-month commitment.',
  },
];

const problemPoints = [
  {
    title: 'The 800 million user blind spot',
    description:
      'Hundreds of millions of people ask ChatGPT every week. If AI cannot read you, that demand never reaches you.',
  },
  {
    title: 'The JavaScript trap',
    description:
      'Many sites render text in the browser. AI crawlers often skip that work and see an empty page.',
  },
  {
    title: 'Rankings are not recommendations',
    description:
      'You can rank in Google while AI still cites a competitor with clearer facts and entities.',
  },
  {
    title: 'The trust gap',
    description:
      'AI checks structured facts and knowledge sources. Weak signals mean AI picks someone else.',
  },
];

const solutionFeatures = [
  {
    title: 'AI visibility scan',
    description: 'Measures how ChatGPT, Claude, Gemini, and Perplexity currently read you.',
    iconNode: <Activity className="w-6 h-6 text-brand-gold" />,
  },
  {
    title: 'Ultra Fast architecture',
    description: 'Pages built for speed and AI visibility so crawlers get full HTML.',
    iconNode: <Code2 className="w-6 h-6 text-brand-gold" />,
  },
  {
    title: 'Structured data',
    description: 'Facts auto-formatted for AI to read, not buried in prose alone.',
    iconNode: <FileCode className="w-6 h-6 text-brand-gold" />,
  },
  {
    title: 'Entity signals',
    description: 'Wikidata, Knowledge Graph, and directory signals that back your facts.',
    iconNode: <Globe className="w-6 h-6 text-brand-gold" />,
  },
];

const whatYouGetCards = [
  {
    title: 'Visibility audit',
    iconNode: <Eye className="w-6 h-6 text-brand-gold" />,
    items: [
      'AI visibility scan',
      'ChatGPT and Claude checks',
      'Perplexity citation review',
      'Crawler access review',
    ],
  },
  {
    title: 'Technical fixes',
    iconNode: <Code2 className="w-6 h-6 text-brand-gold" />,
    items: [
      'Ultra Fast Next.js builds',
      'robots.txt and llms.txt tuning',
      '.well-known/ai-context.json setup',
      'Top Google speed scores on our builds',
    ],
  },
  {
    title: 'Structured data',
    iconNode: <FileCode className="w-6 h-6 text-brand-gold" />,
    items: [
      'Deep structured markup',
      'Speakable markup for voice',
      'Entity relationship mapping',
      'Knowledge Graph alignment',
    ],
  },
  {
    title: 'Ongoing tracking',
    iconNode: <TrendingUp className="w-6 h-6 text-brand-gold" />,
    items: [
      'AI citation tracking',
      'Structured data maintenance',
      'Content architecture updates',
      'Monthly reporting',
    ],
  },
];

const proofStats = [
  {
    value: 100,
    suffix: '%',
    label: 'Speed scores',
    description: 'Strong technical performance on every Ultra Fast build',
  },
  { value: 4, suffix: 'x', label: 'AI platforms', description: 'ChatGPT, Claude, Gemini, Perplexity' },
  { value: 800, suffix: 'M+', label: 'Weekly AI users', description: 'The audience you are missing today' },
  { value: 1, suffix: 'st', label: 'AI recommendation', description: 'The outcome we engineer for' },
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
              AI visibility is the new SEO. It is how well ChatGPT, Claude, Perplexity, and Gemini understand
              and cite you.
            </p>
            <p className="mb-4">
              Most sites lean on browser JavaScript. AI crawlers often skip that path, so they see nothing. No
              read means no recommendation.
            </p>
            <p>
              We fix it. As a specialist{' '}
              <Link href="/ai-seo-agency" className="text-brand-gold hover:underline">
                AI SEO agency
              </Link>{' '}
              and{' '}
              <Link href="/generative-engine-optimisation" className="text-brand-gold hover:underline">
                generative engine optimisation
              </Link>{' '}
              partner, we measure AI visibility, then rebuild or patch the technical base. Explore our{' '}
              <Link href="/ai-seo-services" className="text-brand-gold hover:underline">
                AI SEO services
              </Link>{' '}
              for the full programme.
            </p>
          </>
        }
        primaryCTA={{ text: 'Free AI visibility scan', href: '/voice' }}
        secondaryCTA={{ text: 'Get a Quote', href: '/pricing' }}
      />

      <LandingProblem
        title="THE INVISIBILITY CRISIS"
        intro="Ranking in Google does not guarantee AI knows you. Here is why you may still be invisible."
        problems={problemPoints}
      />

      <LandingSolution title="HOW WE FIX AI VISIBILITY" features={solutionFeatures} columns={4} />

      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <div className="text-center mb-12">
            <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">MEASURING THE INVISIBLE</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              You cannot improve what you do not measure. That is why we ship a disciplined AI visibility scan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-brand-graphite/30 p-8 rounded-2xl border border-white/10">
              <h3 className="text-brand-gold font-bold text-xl mb-4">How we score visibility</h3>
              <p className="text-white/70 mb-4">
                We test structure, structured data, speed, crawler access, and how models describe you today.
                No guesswork.
              </p>
              <p className="text-white/70">
                Then we implement{' '}
                <Link href="/answer-engine-optimisation" className="text-brand-gold hover:underline">
                  answer engine optimisation
                </Link>{' '}
                so AI has facts it can trust.
              </p>
            </div>
            <div className="bg-brand-graphite/30 p-8 rounded-2xl border border-brand-gold/30 flex flex-col justify-center items-center text-center">
              <Activity className="w-16 h-16 text-brand-gold mb-4" />
              <h3 className="text-white font-bold text-xl mb-4">Run your free scan</h3>
              <p className="text-white/70 mb-6">
                See how ChatGPT, Claude, and Perplexity view your business right now.
              </p>
              <Link href="/voice" className="btn-primary">
                Start free scan
              </Link>
            </div>
          </div>
        </div>
      </section>

      <LandingWhatYouGet
        title="OUR VISIBILITY SERVICES"
        intro="What we use to turn your site into something AI can cite."
        cards={whatYouGetCards}
        columns={4}
      />

      <LandingProof
        title="PROVEN AI VISIBILITY"
        stats={proofStats}
        quote={{
          text: 'ScopeSite took us from being completely invisible to ChatGPT, to being the number one recommended provider in our sector nationally in under 4 months.',
          author: 'Hear 4 The Long Term',
        }}
        theme="dark"
      />

      <LandingCaseStudy
        title="From Invisible to AI Recommended"
        quote="See how our AI SEO work put H4TLT in Google AI Overviews, ChatGPT, and Perplexity."
        theme="light"
      />

      <FAQSection title="AI VISIBILITY FAQS" items={faqItems} theme="light" />

      <LandingCTA
        title="READY TO BE SEEN?"
        description="Stop fighting for blue links while competitors get recommended. Run a free AI visibility scan today, or get an instant quote."
        primaryCTA={{ text: 'Free AI visibility scan', href: '/voice' }}
        secondaryCTA={{ text: 'Get Instant Quote', href: '/pricing' }}
        footnote="No corporate waffle • Real results • Read our latest insights on the blog"
      />
    </>
  );
}
