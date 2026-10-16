import Link from 'next/link';
import { RwdOutboundLink } from '@/components/rwd/RwdOutboundLink';
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
import { faqItems } from './faqs';
import { websiteEvidenceChecks as proofStats } from '@/lib/website-evidence-checks';

const problemPoints = [
  {
    title: 'The 800 million user blind spot',
    description:
      'If an assistant cannot retrieve useful information about your business, your own explanation may be missing from its answer. We check access and content alongside actual citations.',
  },
  {
    title: 'The JavaScript trap',
    description:
      'Some retrieval tools may miss text that appears only after JavaScript runs. We inspect the initial HTML and the rendered page.',
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
              for the full programme. Recruitment agencies who want that work applied to client enquiries
              and job pages can read{' '}
              <RwdOutboundLink
                destination="ai_visibility"
                page="ai_visibility"
                placement="body"
                className="text-brand-gold hover:underline"
              >
                AI search visibility for recruitment websites
              </RwdOutboundLink>
              , or{' '}
              <RwdOutboundLink
                destination="ai_discovery"
                page="ai_visibility"
                placement="body"
                className="text-brand-gold hover:underline"
              >
                how to improve a recruitment website&apos;s chances of appearing in AI answers
              </RwdOutboundLink>
              .
            </p>
          </>
        }
        primaryCTA={{ text: 'Explore CAFMO', href: '/voice' }}
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
              <h3 className="text-white font-bold text-xl mb-4">Explore CAFMO</h3>
              <p className="text-white/70 mb-6">
                Review the scanner&apos;s access terms and the website evidence it checks.
              </p>
              <Link href="/voice" className="btn-primary">
                Explore CAFMO
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

      <FAQSection title="AI VISIBILITY FAQS" items={faqItems} theme="light" />

      <LandingCTA
        title="READY TO BE SEEN?"
        description="Explore CAFMO and its access terms, or get an instant quote."
        primaryCTA={{ text: 'Explore CAFMO', href: '/voice' }}
        secondaryCTA={{ text: 'Get Instant Quote', href: '/pricing' }}
        footnote="No corporate waffle • Real results • Read our latest insights on the blog"
      />
    </>
  );
}
