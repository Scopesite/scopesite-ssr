'use client';

import Link from 'next/link';
import { 
  ChevronDown,
  Eye, 
  Settings, 
  Brain, 
  Cpu,
  ArrowRight,
  Check,
  X,
  Bot,
  ClipboardCheck,
  MessageSquare
} from 'lucide-react';
import { FadeInOnScroll, StaggerContainer, StaggerItem, AnimatedCounter } from '@/components/animations';

// V.O.I.C.E. methodology data
const voiceSteps = [
  {
    letter: 'V',
    title: 'VISIBILITY',
    description: 'Server-side rendered HTML so AI crawlers can read the page without executing JavaScript. A significant share of AI crawlers cannot run client-side code. If your site is built on React, Angular, or Vue without SSR, the AI crawler sees a blank page. Mark\'s old site was invisible for exactly this reason.',
    icon: Eye,
  },
  {
    letter: 'O',
    title: 'OPTIMISATION',
    description: 'Content structured for AI extraction, not keyword density. Statistics, citations, authoritative sources. The Princeton GEO paper (Aggarwal et al., 2024) proved that traditional SEO methods like keyword stuffing performed 10% worse than doing nothing on AI platforms. GEO methods improved visibility by up to 40%.',
    icon: Settings,
  },
  {
    letter: 'I',
    title: 'INTELLIGENT',
    description: 'JSON-LD schema on every page. Organisation, Service, FAQPage, BreadcrumbList, SpeakableSpecification. Schanbacher\'s 2026 study of 1,508 businesses found that FAQPage schema alone makes a site 13 times more likely to be cited by ChatGPT. We built schema for every page on Mark\'s site.',
    icon: Brain,
  },
  {
    letter: 'C',
    title: 'CRAWLER',
    description: 'Robots.txt configured to let ChatGPT-User, ClaudeBot, PerplexityBot and Googlebot in. Clean canonical tags, proper sitemaps, no crawl traps. If the crawlers cannot reach your content, none of the rest matters. Mark\'s site now receives over 20 AI bot crawls per day on average.',
    icon: MessageSquare,
  },
  {
    letter: 'E',
    title: 'ENGINES',
    description: 'Entity building through directory submissions with consistent name, address, phone data. Wikidata entries, sameAs signals, cross-platform consistency. The research (Chen et al., 2025) confirms that earned media signals are weighted more heavily than brand-owned content by AI engines. We built Mark\'s entity presence from nothing to a verified, cross-referenced profile.',
    icon: Cpu,
  },
];

// AI results data
const aiResults = [
  {
    platform: 'Google AI Overview',
    query: '"best HSE industrial hearing tests UK"',
    description: 'H4TLT listed first nationally in Google\'s AI-generated overview. Pricing shown alongside the recommendation. Appearing next to firms that have been operating for decades with significantly larger marketing budgets.',
    quote: 'Known for pioneering a self-service audiometric testing system to lower costs.',
  },
  {
    platform: 'ChatGPT',
    query: '"cheapest industrial HSE hearing tests in the UK"',
    description: 'Named by ChatGPT as the top option for cost-effective HSE-compliant hearing tests. Cited with a direct link to the H4TLT website as a primary source.',
    quote: 'This is the absolute bargain option right now.',
  },
  {
    platform: 'Perplexity',
    query: '"best HSE industrial hearing test company UK"',
    description: 'Cited as a primary source by Perplexity\'s research AI. Named first for cost and flexibility. Listed alongside established nationwide operators including Clarity Occupational Health and Latus Group.',
    quote: 'Hear 4 The Long Term: strongest if you want the lowest reported per-test pricing and a highly flexible, self-service model with HSE-compliant documentation.',
  },
];

// Before/After comparison
const comparison = [
  { metric: 'Weekly traffic', before: '7 visitors', after: '53 unique visitors in the last 30 days, up 36%' },
  { metric: 'Site sessions', before: 'Minimal', after: '85 sessions in last 30 days, up 70%' },
  { metric: 'Google organic', before: 'Negligible', after: '269% increase, 48 sessions from Google alone' },
  { metric: 'AI bot crawls', before: '0', after: '2,169 total since launch, averaging 20+ per day' },
  { metric: 'Average session', before: 'Unknown', after: '5 minutes 30 seconds (better than 76% of health sector sites globally)' },
  { metric: 'Organic search share', before: 'Unknown', after: '73% of all traffic (better than 92% of comparable sites)' },
  { metric: 'AI visibility', before: '0 mentions', after: '#1 nationally across Google AI Overview, ChatGPT and Perplexity' },
  { metric: 'Schema markup', before: 'None', after: 'Full JSON-LD on every page' },
  { metric: 'Ad spend', before: '£0', after: 'Still £0' },
];

export default function H4TLTCaseStudyPage() {
  return (
    <>
      {/* Section 1: Hero */}
      <section className="bg-brand-navy text-white min-h-screen -mt-32 pt-32 flex flex-col justify-center relative">
        <div className="container-content flex-grow flex flex-col justify-center">
          <div className="max-w-4xl mx-auto text-center">
            <FadeInOnScroll delay={0}>
              <div className="text-brand-gold tracking-widest uppercase text-sm font-bold mb-6">CASE STUDY</div>
            </FadeInOnScroll>
            <FadeInOnScroll delay={0.15}>
              <h1 className="text-[32px] sm:text-[40px] md:text-[48px] lg:text-[64px] text-white mb-6 leading-tight">
                From invisible to national <span className="text-brand-gold">#1</span> in <span className="text-brand-gold">4 months</span>.
              </h1>
            </FadeInOnScroll>
            <FadeInOnScroll delay={0.3}>
              <p className="text-slate-400 text-lg md:text-xl italic mb-10 max-w-3xl mx-auto leading-relaxed">
                How a registered audiologist in Somerset went from 7 visitors a week to being recommended nationally by Google AI Overview, ChatGPT and Perplexity. Without ad spend. Without backlinks. Without the usual agency nonsense.
              </p>
            </FadeInOnScroll>
            <FadeInOnScroll delay={0.45}>
              <div className="flex flex-col items-center gap-4">
                <Link href="https://voice.scopesite.co.uk" className="btn-primary text-lg px-10 py-5 rounded-lg">
                  Check your own site for free →
                </Link>
                <Link href="https://scopesite.co.uk/evidence" className="text-white text-sm hover:text-brand-gold transition-colors underline underline-offset-4">
                  Read the peer-reviewed research behind this →
                </Link>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-8 h-8 text-brand-gold animate-bounce" />
        </div>
      </section>

      {/* Section 2: The Client */}
      <section className="bg-slate-50 py-section">
        <div className="container-content">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <FadeInOnScroll direction="left">
              <div>
                <h2 className="text-brand-navy text-3xl sm:text-4xl mb-6">The client</h2>
                <div className="prose-scopesite">
                  <p>
                    Mark Ashmore runs Hear 4 The Long Term. He is a registered audiologist based in Somerset with over 30 years in occupational hearing health.
                  </p>
                  <p>
                    A few years ago he built something genuinely new: a self-service workplace audiometry model that does the same job as traditional audiometry vans, minus the headache, for a fraction of the cost. Competitors charge £40-70 per hearing test. Mark does it from £10.
                  </p>
                  <p>
                    The work was ahead of the market. The problem was nobody knew it existed.
                  </p>
                </div>
              </div>
            </FadeInOnScroll>
            <FadeInOnScroll direction="right">
              <div className="bg-brand-navy rounded-2xl p-8 border-t-4 border-brand-gold shadow-xl">
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <Check className="w-6 h-6 text-brand-gold flex-shrink-0 mt-1" />
                    <span className="text-white text-lg"><strong className="text-brand-gold">30+ years</strong> in occupational audiology</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <Check className="w-6 h-6 text-brand-gold flex-shrink-0 mt-1" />
                    <span className="text-white text-lg"><strong className="text-brand-gold">£10/test</strong> vs industry average £40-70</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <Check className="w-6 h-6 text-brand-gold flex-shrink-0 mt-1" />
                    <span className="text-white text-lg"><strong className="text-brand-gold">Self-service model</strong> — no van, no on-site clinician</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <Check className="w-6 h-6 text-brand-gold flex-shrink-0 mt-1" />
                    <span className="text-white text-lg"><strong className="text-brand-gold">Somerset-based</strong> — serving clients nationally</span>
                  </li>
                </ul>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Section 3: The Problem */}
      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-white text-3xl sm:text-4xl mb-4">The problem</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                When Mark came to ScopeSite in late 2024, his website was effectively invisible.
              </p>
            </div>
          </FadeInOnScroll>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16" staggerDelay={0.2}>
            <StaggerItem>
              <div className="text-center p-8 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-5xl md:text-6xl font-bold text-brand-gold mb-3">
                  <AnimatedCounter value={7} />
                </div>
                <p className="text-white text-sm uppercase tracking-wide">visitors per week</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="text-center p-8 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-5xl md:text-6xl font-bold text-brand-gold mb-3">
                  <AnimatedCounter value={0} />
                </div>
                <p className="text-white text-sm uppercase tracking-wide">AI assistants recommending him</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="text-center p-8 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-5xl md:text-6xl font-bold text-brand-gold mb-3">
                  <AnimatedCounter value={0} />
                </div>
                <p className="text-white text-sm uppercase tracking-wide">JSON-LD schema markup</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="text-center p-8 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-5xl md:text-6xl font-bold text-brand-gold mb-3">
                  £<AnimatedCounter value={0} />
                </div>
                <p className="text-white text-sm uppercase tracking-wide">spent on advertising</p>
              </div>
            </StaggerItem>
          </StaggerContainer>

          <FadeInOnScroll delay={0.4}>
            <div className="max-w-3xl mx-auto bg-brand-navy p-8 rounded-xl border-l-4 border-brand-gold shadow-2xl">
              <p className="text-white text-xl leading-relaxed">
                His competitors were charging four, five, six times his price for the same service. And the AI systems his buyers were already using could not find him.
              </p>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Section 4: First CTA Interrupt */}
      <section className="bg-brand-graphite py-16">
        <div className="container-content text-center">
          <FadeInOnScroll>
            <p className="text-white text-2xl font-medium mb-8">Worried your own site has the same problem?</p>
            <Link href="https://voice.scopesite.co.uk" className="btn-primary text-lg px-8 py-4 rounded-lg animate-pulse-cta inline-block mb-4">
              Run a free V.O.I.C.E.™ scan →
            </Link>
            <p className="text-slate-400 text-sm">Takes 60 seconds. No email required.</p>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Section 5: What We Built — V.O.I.C.E.™ Methodology */}
      <section className="bg-white py-section">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            <FadeInOnScroll>
              <div className="text-center mb-16">
                <h2 className="text-brand-navy text-3xl sm:text-4xl mb-4">What we built: V.O.I.C.E.™</h2>
                <p className="text-slate-400 italic text-lg mb-8">Visibility, Optimisation, for Intelligent, Crawler, Engines.</p>
                <div className="prose-scopesite text-left">
                  <p>
                    Every letter of V.O.I.C.E. is grounded in peer-reviewed research from Princeton, Toronto, and the SSRN. The full 19-page evidence review is available at scopesite.co.uk/evidence. Here is what each letter does and why it matters.
                  </p>
                </div>
              </div>
            </FadeInOnScroll>

            <StaggerContainer className="space-y-6 mb-12" staggerDelay={0.15}>
              {voiceSteps.map((step) => (
                <StaggerItem key={step.letter} direction="left">
                  <div className="bg-brand-navy rounded-2xl p-8 border-l-[6px] border-brand-gold flex flex-col md:flex-row gap-8 items-start shadow-lg">
                    <div className="text-brand-gold font-headline text-7xl leading-none flex-shrink-0">
                      {step.letter}
                    </div>
                    <div>
                      <h3 className="text-white text-xl font-bold mb-3 tracking-wide">{step.title}</h3>
                      <p className="text-white/80 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <FadeInOnScroll delay={0.3}>
              <div className="text-center">
                <Link href="https://scopesite.co.uk/evidence" className="text-brand-navy font-bold hover:text-brand-gold transition-colors underline underline-offset-4">
                  Read the full evidence review (9 sources, 19 pages) →
                </Link>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Section 6: Second CTA Interrupt */}
      <section className="bg-brand-navy py-16 border-t border-white/10">
        <div className="container-content text-center">
          <FadeInOnScroll>
            <p className="text-white text-2xl font-medium mb-8">Want to see which V.O.I.C.E. pillars your site is missing?</p>
            <Link href="https://voice.scopesite.co.uk" className="btn-primary text-lg px-8 py-4 rounded-lg inline-block">
              Check your site for free →
            </Link>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Section 7: The Results — Progressive Platform Reveal */}
      <section className="bg-brand-navy py-section overflow-hidden">
        <div className="container-content">
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-white text-3xl sm:text-4xl mb-4">The results</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Four months after the new site went live. Three major AI platforms. All recommending Mark nationally.
              </p>
            </div>
          </FadeInOnScroll>

          <StaggerContainer className="max-w-4xl mx-auto space-y-8" staggerDelay={0.3}>
            {aiResults.map((result, index) => (
              <StaggerItem key={index} direction="up">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                  <h3 className="text-brand-gold text-2xl font-bold mb-4">{result.platform}</h3>
                  <p className="text-slate-400 italic mb-6 text-lg">Query: {result.query}</p>
                  <p className="text-white text-lg leading-relaxed mb-6">
                    {result.description}
                  </p>
                  <div className="bg-brand-navy/50 border-l-4 border-brand-gold p-6 rounded-r-lg">
                    <p className="text-brand-gold font-medium italic text-lg">
                      "{result.quote}"
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Section 8: The Numbers — Before/After Transformation */}
      <section className="bg-slate-50 py-section">
        <div className="container-content">
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-brand-navy text-3xl sm:text-4xl mb-4">By the numbers</h2>
              <p className="text-slate-400 text-lg">The verified data from January to April 2026.</p>
            </div>
          </FadeInOnScroll>

          <div className="max-w-5xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 px-6 hidden md:grid">
              <div className="font-bold text-brand-navy">Metric</div>
              <div className="font-bold text-slate-400">Before (Nov 2024)</div>
              <div className="font-bold text-brand-gold">After (April 2026)</div>
            </div>
            
            <StaggerContainer className="space-y-4" staggerDelay={0.1}>
              {comparison.map((row, index) => (
                <StaggerItem key={index} direction="left">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="font-bold text-brand-navy md:text-left text-center mb-2 md:mb-0">{row.metric}</div>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500">
                      <X className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span>{row.before}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-brand-navy font-bold">
                      <Check className="w-5 h-5 text-brand-gold flex-shrink-0" />
                      <span>{row.after}</span>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          <FadeInOnScroll delay={0.3}>
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl border-2 border-brand-gold shadow-lg text-center">
              <p className="text-brand-navy text-xl font-bold leading-relaxed">
                Organic search traffic up 269%. Average session duration in the top 24% globally. Nationally recommended by three AI platforms. Zero ad spend.
              </p>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Section 9: Third CTA Interrupt */}
      <section className="bg-brand-navy py-16">
        <div className="container-content text-center">
          <FadeInOnScroll>
            <p className="text-white text-2xl font-medium mb-8 max-w-3xl mx-auto leading-relaxed">
              This was built for a single-operator audiology business. The methodology works for any professional services firm.
            </p>
            <Link href="https://voice.scopesite.co.uk" className="btn-primary text-lg px-8 py-4 rounded-lg inline-block">
              Run a free scan on your own site →
            </Link>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Section 10: The Compliance Checker Section */}
      <section className="bg-white py-section">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            <FadeInOnScroll>
              <div className="text-center mb-12">
                <h2 className="text-brand-navy text-3xl sm:text-4xl mb-4">The compliance checker</h2>
                <p className="text-slate-400 text-lg">A conversion engine that qualifies leads automatically, not a simple contact form.</p>
              </div>
            </FadeInOnScroll>

            <FadeInOnScroll delay={0.1}>
              <div className="prose-scopesite mb-16">
                <p>
                  We built Mark an interactive compliance checker using Fillout with logic-gated routing. Potential clients answer questions about workplace noise exposure, hearing protection, and current testing practices. The system determines which tests they need, whether they are currently compliant with Regulation 9, and routes them to either an instant quote or a discovery call based on the complexity of their requirements.
                </p>
                <p>
                  It works at 2am for a night shift manager who has just had an HSE inspector phone ahead. It works on a Sunday for a safety director preparing a board paper. It qualifies leads before Mark ever picks up the phone.
                </p>
              </div>
            </FadeInOnScroll>

            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6" staggerDelay={0.15}>
              <StaggerItem>
                <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-4xl font-bold text-brand-navy mb-2">
                    <AnimatedCounter value={283} />+
                  </div>
                  <p className="text-slate-500 text-sm uppercase tracking-wide">views</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-4xl font-bold text-brand-navy mb-2">
                    <AnimatedCounter value={99} />
                  </div>
                  <p className="text-slate-500 text-sm uppercase tracking-wide">submissions</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-4xl font-bold text-brand-navy mb-2">
                    <AnimatedCounter value={35} />%
                  </div>
                  <p className="text-slate-500 text-sm uppercase tracking-wide">conversion rate</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-4xl font-bold text-brand-navy mb-2">
                    <AnimatedCounter value={96} />%
                  </div>
                  <p className="text-slate-500 text-sm uppercase tracking-wide">desktop usage</p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Section 11: Why It Worked */}
      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <FadeInOnScroll>
              <h2 className="text-white text-3xl sm:text-4xl mb-10 text-center">Why it worked</h2>
            </FadeInOnScroll>
            
            <FadeInOnScroll delay={0.1}>
              <div className="space-y-6 text-white text-lg leading-relaxed">
                <p>
                  The traditional marketing agencies Mark had spoken to wanted to sell him SEO packages, backlinks, and brand work, none of which would have solved the actual problem, which was that AI crawlers could not read his site.
                </p>
                <p>
                  What changed was not ad spend, not a backlinks campaign, not a rebrand. What changed was how the site was built.
                </p>
                <p>
                  Server-side rendered HTML so AI crawlers can read the page without running JavaScript, proper JSON-LD schema on every page, entity building through directory submissions with consistent data, content architecture designed for AI extraction rather than keyword density, and a robots.txt file configured to let the AI crawlers in.
                </p>
                <p>
                  Boring, unglamorous, and exactly the stuff most agencies skip because they are too busy selling Canva-designed reports.
                </p>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Section 12: Fourth CTA Interrupt */}
      <section className="bg-brand-graphite py-16">
        <div className="container-content text-center">
          <FadeInOnScroll>
            <p className="text-white text-2xl font-medium mb-8">Curious what your V.O.I.C.E. score would be?</p>
            <Link href="https://voice.scopesite.co.uk" className="btn-primary text-lg px-8 py-4 rounded-lg inline-block">
              Free scan, 60 seconds →
            </Link>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Section 13: The Research (Evidence Section) */}
      <section className="bg-slate-50 py-section">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            <FadeInOnScroll>
              <h2 className="text-brand-navy text-3xl sm:text-4xl mb-8 text-center">The research</h2>
            </FadeInOnScroll>

            <FadeInOnScroll delay={0.1}>
              <div className="prose-scopesite mb-10">
                <p>
                  Every component of V.O.I.C.E. maps to published, peer-reviewed research. This is not a methodology we invented and then looked for evidence to support. The evidence came first, the methodology was built from it.
                </p>
                <p>
                  The full evidence review pulls together nine sources including:
                </p>
              </div>
            </FadeInOnScroll>

            <StaggerContainer className="space-y-4 mb-12" staggerDelay={0.1}>
              <StaggerItem>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start gap-4">
                  <div className="w-2 h-2 bg-brand-gold rounded-full mt-2 flex-shrink-0" />
                  <p className="text-brand-navy font-medium">Schanbacher (2026) — JSON-LD and ChatGPT visibility, 1,508 businesses studied</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start gap-4">
                  <div className="w-2 h-2 bg-brand-gold rounded-full mt-2 flex-shrink-0" />
                  <p className="text-brand-navy font-medium">Aggarwal et al. (2024) — Princeton GEO paper, published at KDD '24</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start gap-4">
                  <div className="w-2 h-2 bg-brand-gold rounded-full mt-2 flex-shrink-0" />
                  <p className="text-brand-navy font-medium">Chen et al. (2025) — University of Toronto, AI search dominance</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start gap-4">
                  <div className="w-2 h-2 bg-brand-gold rounded-full mt-2 flex-shrink-0" />
                  <p className="text-brand-navy font-medium">de Rosen (2025) — AIVO Standard, SSRN</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start gap-4">
                  <div className="w-2 h-2 bg-brand-gold rounded-full mt-2 flex-shrink-0" />
                  <p className="text-brand-navy font-medium">Ma et al. (2025) — Generative search engine content preferences</p>
                </div>
              </StaggerItem>
            </StaggerContainer>

            <FadeInOnScroll delay={0.2}>
              <div className="text-center">
                <Link href="https://scopesite.co.uk/evidence" className="text-brand-navy font-bold hover:text-brand-gold transition-colors underline underline-offset-4">
                  Download the full 19-page evidence review →
                </Link>
              </div>
            </FadeInOnScroll>

            {/* FAQs */}
            <div className="mt-24">
              <FadeInOnScroll>
                <h2 className="text-brand-navy text-2xl sm:text-3xl mb-8 text-center">Frequently Asked Questions</h2>
              </FadeInOnScroll>
              
              <StaggerContainer className="space-y-8" staggerDelay={0.1}>
                <StaggerItem>
                  <div>
                    <h3 className="text-brand-navy text-xl font-bold mb-3">How long did it take for H4TLT to appear in AI recommendations?</h3>
                    <p className="text-slate-600 leading-relaxed">The website went live on 1 January 2026. By April 2026, H4TLT was being recommended nationally by Google AI Overview, ChatGPT and Perplexity across multiple search queries.</p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div>
                    <h3 className="text-brand-navy text-xl font-bold mb-3">What is the V.O.I.C.E. methodology?</h3>
                    <p className="text-slate-600 leading-relaxed">V.O.I.C.E. stands for Visibility, Optimisation, for Intelligent, Crawler, Engines. It is a research-backed methodology developed by ScopeSite Digital Studios for making businesses visible to AI assistants like ChatGPT, Claude, Gemini and Perplexity.</p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div>
                    <h3 className="text-brand-navy text-xl font-bold mb-3">Does AI visibility work for small businesses?</h3>
                    <p className="text-slate-600 leading-relaxed">H4TLT is a single-operator audiology business. Within 4 months of implementing V.O.I.C.E., it was recommended nationally alongside firms that have operated for decades with significantly larger marketing budgets. The methodology is designed to level the playing field.</p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div>
                    <h3 className="text-brand-navy text-xl font-bold mb-3">How much does AI visibility optimisation cost?</h3>
                    <p className="text-slate-600 leading-relaxed">The H4TLT project was delivered for under £5,000 including website build, schema implementation, entity building, and content architecture. Start with a free V.O.I.C.E. scan at voice.scopesite.co.uk to see where your site currently stands.</p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div>
                    <h3 className="text-brand-navy text-xl font-bold mb-3">Is AI visibility the same as SEO?</h3>
                    <p className="text-slate-600 leading-relaxed">No. AI platforms use different crawlers, different ranking signals, and different citation logic to traditional search engines. The Princeton GEO paper (2024) found that traditional SEO techniques like keyword stuffing performed 10% worse on AI platforms than doing nothing. AI visibility requires a distinct methodology.</p>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Section 14: Final CTA — The Close */}
      <section className="bg-brand-navy py-32">
        <div className="container-content text-center">
          <div className="max-w-4xl mx-auto">
            <FadeInOnScroll>
              <h2 className="text-white text-3xl sm:text-4xl md:text-[40px] font-bold mb-8 leading-tight">
                When a prospect asks ChatGPT to recommend a good [solicitor / accountant / estate agent] in your area, is your firm on the list?
              </h2>
            </FadeInOnScroll>
            
            <FadeInOnScroll delay={0.15}>
              <p className="text-slate-400 text-xl mb-12">
                Most aren't. Mark is.
              </p>
            </FadeInOnScroll>

            <FadeInOnScroll delay={0.3}>
              <div className="flex flex-col items-center gap-6">
                <Link href="https://voice.scopesite.co.uk" className="btn-primary text-xl px-12 py-6 rounded-lg shadow-2xl hover:scale-105 transition-transform duration-300">
                  Check your site for free →
                </Link>
                <Link href="https://scopesite.co.uk/evidence" className="text-white/80 hover:text-white transition-colors underline underline-offset-4">
                  Or read the evidence first →
                </Link>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>
    </>
  );
}
