'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronDown,
  Eye, 
  Settings, 
  Brain, 
  Cpu,
  Check,
  X,
  MessageSquare,
  Search
} from 'lucide-react';
import { FadeInOnScroll, StaggerContainer, StaggerItem, AnimatedCounter } from '@/components/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { H4TLTGmailTestimonial } from '@/components/case-studies/H4TLTGmailTestimonial';

// AI visibility methodology data
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

// Before/After comparison — Jan 2026 launch baseline vs Apr 2026 measured results
const comparison = [
  { metric: 'Weekly traffic', before: '7 visitors', after: '53 unique visitors in last 30 days, up 36%' },
  { metric: 'Site sessions', before: 'Minimal', after: '85 sessions in last 30 days, up 70%' },
  { metric: 'Google organic', before: 'Negligible', after: '269% increase, 48 sessions from Google alone' },
  { metric: 'AI bot crawls', before: '0', after: '2,169 total launch-to-date, averaging 20+ per day' },
  { metric: 'Average session duration', before: 'Unknown', after: '6m 57s, up 21% MoM (better than 76% of health sites globally)' },
  { metric: 'Pages per session', before: 'Unknown', after: '1.7, up 14% MoM' },
  { metric: 'Bounce rate', before: 'Unknown', after: '62.6%, down 12% MoM (improvement)' },
  { metric: 'Returning visitors', before: 'Unknown', after: '15% (above the global Health Care benchmark of 13%)' },
  { metric: 'Organic search traffic', before: 'None', after: '73% of all traffic (better than 92% of comparable sites)' },
  { metric: 'AI visibility', before: '0', after: 'Position 1 across Google AI Overview, ChatGPT, Perplexity, Claude, Grok and Bing' },
  { metric: 'Schema markup', before: 'None', after: 'Full JSON-LD on every page' },
  { metric: 'Ad spend', before: '£0', after: '£0' },
];

export default function H4TLTCaseStudyPage() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const defaultTransforms = [
    { rotate: -3, x: -40, y: 0, z: 3 },
    { rotate: 0, x: 0, y: -20, z: 2 },
    { rotate: 3, x: 40, y: -40, z: 1 },
  ];

  function getCardStyle(index: number) {
    const d = defaultTransforms[index];
    const isActive = activeCard === index;
    const hasActive = activeCard !== null;
    const receded = hasActive && !isActive;

    if (prefersReducedMotion) {
      return {
        zIndex: isActive ? 10 : d.z,
        opacity: receded ? 0.7 : 1,
      };
    }

    if (isActive) {
      return {
        transform: 'rotate(0deg) translateX(0px) translateY(0px) scale(1.05)',
        zIndex: 10,
        opacity: 1,
      };
    }

    if (receded) {
      const pushFactor = 1.4;
      return {
        transform: `rotate(${d.rotate}deg) translateX(${d.x * pushFactor}px) translateY(${d.y}px) scale(0.95)`,
        zIndex: d.z,
        opacity: 0.7,
      };
    }

    return {
      transform: `rotate(${d.rotate}deg) translateX(${d.x}px) translateY(${d.y}px) scale(1)`,
      zIndex: d.z,
      opacity: 1,
    };
  }

  const cardInteraction = (index: number) => ({
    onMouseEnter: () => setActiveCard(index),
    onMouseLeave: () => setActiveCard(null),
    onClick: () => setActiveCard(activeCard === index ? null : index),
    onFocus: () => setActiveCard(index),
    onBlur: () => setActiveCard(null),
    tabIndex: 0,
  });

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
                When the new H4TLT site went live on 1 January 2026, the business had seven weekly visitors, zero AI assistant recommendations, no structured data, and no advertising budget.
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
              Run a free AI visibility scan →
            </Link>
            <p className="text-slate-400 text-sm">Takes 60 seconds. No email required.</p>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Section 5: What We Built — AI visibility Methodology */}
      <section className="bg-white py-section">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            <FadeInOnScroll>
              <div className="text-center mb-16">
                <h2 className="text-brand-navy text-3xl sm:text-4xl mb-4">What we built: AI visibility</h2>
                <p className="text-slate-400 italic text-lg mb-8">Visibility, Optimisation, for Intelligent, Crawler, Engines.</p>
                <div className="prose-scopesite text-left">
                  <p>
                    Each pillar in our framework is grounded in peer-reviewed research from Princeton, Toronto, and the SSRN. The full 19-page evidence review is available at scopesite.co.uk/evidence. Here is what each letter does and why it matters.
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
      <section className="bg-brand-graphite py-16">
        <div className="container-content text-center">
          <FadeInOnScroll>
            <p className="text-white text-2xl font-medium mb-8">Want to see which AI visibility pillars your site is missing?</p>
            <Link href="https://voice.scopesite.co.uk" className="btn-primary text-lg px-8 py-4 rounded-lg inline-block">
              Check your site for free →
            </Link>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Section 7: The Results — Overlapping Platform Cards */}
      <section className="bg-brand-navy py-section overflow-hidden">
        <div className="container-content">
          <FadeInOnScroll>
            <div className="text-center mb-16 md:mb-24">
              <h2 className="text-white text-3xl sm:text-4xl mb-4">The results</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Four months after the new site went live. Three major AI platforms. All recommending Mark nationally.
              </p>
            </div>
          </FadeInOnScroll>

          {/* Desktop: overlapping fanned stack */}
          <div
            className="hidden md:flex justify-center items-start max-w-[900px] mx-auto pb-16"
            style={{ perspective: '1000px' }}
            role="group"
            aria-label="AI platform recommendations"
          >
            {/* Card 0: Google AI Overview */}
            <article
              className="relative w-[420px] rounded-xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              style={{
                ...getCardStyle(0),
                willChange: 'transform, opacity',
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                marginRight: '-140px',
              }}
              aria-label="Google AI Overview recommendation for H4TLT"
              {...cardInteraction(0)}
            >
              <div className="bg-white rounded-xl overflow-hidden">
                <div className="bg-[#F1F3F4] px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">
                      <span className="text-[#4285F4]">G</span>
                      <span className="text-[#EA4335]">o</span>
                      <span className="text-[#FBBC05]">o</span>
                      <span className="text-[#4285F4]">g</span>
                      <span className="text-[#34A853]">l</span>
                      <span className="text-[#EA4335]">e</span>
                    </span>
                    <span className="text-[#5F6368] text-sm font-medium">AI Overview</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="inline-block bg-[#E8EAED] rounded-full px-4 py-1.5 text-sm text-[#202124] mb-4">
                    best HSE industrial hearing tests UK
                  </div>
                  <p className="text-[#202124] text-sm leading-relaxed mb-4">
                    H4TLT listed first nationally. Pricing shown alongside the recommendation. Appearing next to firms operating for decades with significantly larger marketing budgets.
                  </p>
                  <div className="border-l-4 border-brand-gold bg-[#FEF9E7] p-4 rounded-r-lg mb-4">
                    <p className="text-[#202124] text-sm italic">
                      &ldquo;Known for pioneering a self-service audiometric testing system to lower costs.&rdquo;
                    </p>
                  </div>
                  <p className="text-[#5F6368] text-xs">April 2026</p>
                </div>
              </div>
            </article>

            {/* Card 1: ChatGPT */}
            <article
              className="relative w-[420px] rounded-xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              style={{
                ...getCardStyle(1),
                willChange: 'transform, opacity',
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                marginRight: '-140px',
              }}
              aria-label="ChatGPT recommendation for H4TLT"
              {...cardInteraction(1)}
            >
              <div className="bg-[#343541] rounded-xl overflow-hidden">
                <div className="bg-[#40414F] px-4 py-3 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#10A37F] flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">AI</span>
                  </div>
                  <span className="text-white text-sm font-medium">ChatGPT</span>
                </div>
                <div className="p-6">
                  <div className="bg-[#40414F] rounded-2xl px-4 py-3 mb-4">
                    <p className="text-[#D1D5DB] text-sm">cheapest industrial HSE hearing tests in the UK</p>
                  </div>
                  <p className="text-[#ECECF1] text-sm leading-relaxed mb-4">
                    Named as the top option for cost-effective HSE-compliant hearing tests. Cited with a direct link to the H4TLT website as a primary source.
                  </p>
                  <p className="text-brand-gold font-medium text-sm italic mb-4">
                    &ldquo;This is the absolute bargain option right now.&rdquo;
                  </p>
                  <p className="text-[#8E8EA0] text-xs">April 2026</p>
                </div>
              </div>
            </article>

            {/* Card 2: Perplexity */}
            <article
              className="relative w-[420px] rounded-xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              style={{
                ...getCardStyle(2),
                willChange: 'transform, opacity',
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
              }}
              aria-label="Perplexity recommendation for H4TLT"
              {...cardInteraction(2)}
            >
              <div className="bg-[#1A1A2E] rounded-xl overflow-hidden">
                <div className="bg-[#252547] px-4 py-3 flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#20B2AA]" />
                  <span className="text-white text-sm font-medium">Perplexity</span>
                  <span className="text-[#20B2AA] text-xs ml-auto">Answer</span>
                </div>
                <div className="p-6">
                  <p className="text-[#8E8EA0] text-sm italic mb-4">best HSE industrial hearing test company UK</p>
                  <p className="text-white/90 text-sm leading-relaxed mb-4">
                    Cited as a primary source. Named first for cost and flexibility. Listed alongside established nationwide operators including Clarity Occupational Health and Latus Group.
                  </p>
                  <p className="text-[#20B2AA] font-medium text-sm italic mb-4">
                    &ldquo;Hear 4 The Long Term: strongest if you want the lowest reported per-test pricing and a highly flexible, self-service model with HSE-compliant documentation.&rdquo;
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-[#20B2AA]/20 text-[#20B2AA] rounded-full text-xs px-3 py-1">hear4thelongterm.co.uk</span>
                  </div>
                  <p className="text-[#8E8EA0] text-xs">April 2026</p>
                </div>
              </div>
            </article>
          </div>

          {/* Mobile: vertical stack with overlap */}
          <div
            className="md:hidden flex flex-col items-center px-4"
            role="group"
            aria-label="AI platform recommendations"
          >
            {/* Mobile Card 0: Google AI Overview */}
            <article
              className="relative w-full max-w-[calc(100vw-48px)] rounded-xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              style={{
                zIndex: activeCard === 0 ? 10 : 3,
                opacity: activeCard !== null && activeCard !== 0 ? 0.7 : 1,
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
              }}
              aria-label="Google AI Overview recommendation for H4TLT"
              {...cardInteraction(0)}
            >
              {activeCard !== 0 && <span className="absolute top-2 right-3 text-[#5F6368] text-[10px] uppercase tracking-wider z-10">Tap to view</span>}
              <div className="bg-white rounded-xl overflow-hidden">
                <div className="bg-[#F1F3F4] px-4 py-3 flex items-center gap-2">
                  <span className="text-lg font-bold">
                    <span className="text-[#4285F4]">G</span>
                    <span className="text-[#EA4335]">o</span>
                    <span className="text-[#FBBC05]">o</span>
                    <span className="text-[#4285F4]">g</span>
                    <span className="text-[#34A853]">l</span>
                    <span className="text-[#EA4335]">e</span>
                  </span>
                  <span className="text-[#5F6368] text-sm font-medium">AI Overview</span>
                </div>
                <div className="p-5">
                  <div className="inline-block bg-[#E8EAED] rounded-full px-3 py-1 text-sm text-[#202124] mb-3">
                    best HSE industrial hearing tests UK
                  </div>
                  <p className="text-[#202124] text-sm leading-relaxed mb-3">
                    H4TLT listed first nationally. Pricing shown alongside the recommendation.
                  </p>
                  <div className="border-l-4 border-brand-gold bg-[#FEF9E7] p-3 rounded-r-lg mb-3">
                    <p className="text-[#202124] text-sm italic">
                      &ldquo;Known for pioneering a self-service audiometric testing system to lower costs.&rdquo;
                    </p>
                  </div>
                  <p className="text-[#5F6368] text-xs">April 2026</p>
                </div>
              </div>
            </article>

            {/* Mobile Card 1: ChatGPT */}
            <article
              className="relative w-full max-w-[calc(100vw-48px)] rounded-xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-gold -mt-8"
              style={{
                zIndex: activeCard === 1 ? 10 : 2,
                opacity: activeCard !== null && activeCard !== 1 ? 0.7 : 1,
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
              }}
              aria-label="ChatGPT recommendation for H4TLT"
              {...cardInteraction(1)}
            >
              {activeCard !== 1 && <span className="absolute top-2 right-3 text-[#8E8EA0] text-[10px] uppercase tracking-wider z-10">Tap to view</span>}
              <div className="bg-[#343541] rounded-xl overflow-hidden">
                <div className="bg-[#40414F] px-4 py-3 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#10A37F] flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">AI</span>
                  </div>
                  <span className="text-white text-sm font-medium">ChatGPT</span>
                </div>
                <div className="p-5">
                  <div className="bg-[#40414F] rounded-2xl px-4 py-2 mb-3">
                    <p className="text-[#D1D5DB] text-sm">cheapest industrial HSE hearing tests in the UK</p>
                  </div>
                  <p className="text-[#ECECF1] text-sm leading-relaxed mb-3">
                    Named as the top option for cost-effective HSE-compliant hearing tests.
                  </p>
                  <p className="text-brand-gold font-medium text-sm italic mb-3">
                    &ldquo;This is the absolute bargain option right now.&rdquo;
                  </p>
                  <p className="text-[#8E8EA0] text-xs">April 2026</p>
                </div>
              </div>
            </article>

            {/* Mobile Card 2: Perplexity */}
            <article
              className="relative w-full max-w-[calc(100vw-48px)] rounded-xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-gold -mt-8"
              style={{
                zIndex: activeCard === 2 ? 10 : 1,
                opacity: activeCard !== null && activeCard !== 2 ? 0.7 : 1,
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
              }}
              aria-label="Perplexity recommendation for H4TLT"
              {...cardInteraction(2)}
            >
              {activeCard !== 2 && <span className="absolute top-2 right-3 text-[#8E8EA0] text-[10px] uppercase tracking-wider z-10">Tap to view</span>}
              <div className="bg-[#1A1A2E] rounded-xl overflow-hidden">
                <div className="bg-[#252547] px-4 py-3 flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#20B2AA]" />
                  <span className="text-white text-sm font-medium">Perplexity</span>
                  <span className="text-[#20B2AA] text-xs ml-auto">Answer</span>
                </div>
                <div className="p-5">
                  <p className="text-[#8E8EA0] text-sm italic mb-3">best HSE industrial hearing test company UK</p>
                  <p className="text-white/90 text-sm leading-relaxed mb-3">
                    Cited as a primary source. Named first for cost and flexibility.
                  </p>
                  <p className="text-[#20B2AA] font-medium text-sm italic mb-3">
                    &ldquo;Hear 4 The Long Term: strongest if you want the lowest reported per-test pricing and a highly flexible, self-service model.&rdquo;
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[#20B2AA]/20 text-[#20B2AA] rounded-full text-xs px-3 py-1">hear4thelongterm.co.uk</span>
                  </div>
                  <p className="text-[#8E8EA0] text-xs">April 2026</p>
                </div>
              </div>
            </article>
          </div>
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
              <div className="font-bold text-slate-400">Before (Jan 2026)</div>
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
                Organic search traffic up 269%. Average session duration up 21% to nearly seven minutes (readers, not browsers). Bounce rate down 12% (lower is better). 15% of traffic now comes from returning visitors, above the global Health Care benchmark of 13%. Nationally recommended by three AI platforms. Zero ad spend.
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

      {/* Section 9b: Client Testimonial (Gmail-style email card) */}
      <section className="bg-slate-50 py-section">
        <div className="container-content">
          <FadeInOnScroll>
            <div className="text-center mb-10">
              <h2 className="text-brand-navy text-3xl sm:text-4xl mb-4">Client testimonial</h2>
            </div>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.1}>
            <H4TLTGmailTestimonial />
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
                <p>
                  In four months, Hear 4 The Long Term has gone from seven weekly visitors to a Position 1 national ranking across six AI engines, with sessions averaging nearly seven minutes, falling bounce rate, and a returning visitor rate above the global Health Care benchmark. Same operator. Same single audiologist. No paid media. No advertising budget.
                </p>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Section 11b: Primary Discovery Call CTA */}
      <section className="bg-brand-navy py-section border-t border-white/10">
        <div className="container-content">
          <div className="max-w-3xl mx-auto text-center">
            <FadeInOnScroll>
              <h2 className="text-white text-3xl sm:text-4xl mb-4 leading-tight">
                Ready to talk about your own AI visibility position?
              </h2>
              <p className="text-slate-300 text-lg mb-10 leading-relaxed">
                A 15-minute discovery call gives you a clear picture of where your business sits today and what&apos;s possible. Or run a free V.O.I.C.E. scan first to see your starting position.
              </p>
            </FadeInOnScroll>
            <FadeInOnScroll delay={0.1}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/book"
                  className="btn-primary text-lg px-8 py-4 rounded-lg inline-block w-full sm:w-auto"
                >
                  Book a 15-minute discovery call →
                </Link>
                <Link
                  href="https://voice.scopesite.co.uk"
                  className="btn-secondary-light text-lg px-8 py-4 rounded-lg inline-block w-full sm:w-auto"
                >
                  Run a free V.O.I.C.E. scan →
                </Link>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Section 12: Fourth CTA Interrupt */}
      <section className="bg-brand-graphite py-16">
        <div className="container-content text-center">
          <FadeInOnScroll>
            <p className="text-white text-2xl font-medium mb-8">Curious what your AI visibility score would be?</p>
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
                  Each part of our framework maps to published, peer-reviewed research. This is not a methodology we invented and then looked for evidence to support. The evidence came first, the methodology was built from it.
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
                  <p className="text-brand-navy font-medium">Aggarwal et al. (2024) — Princeton GEO paper, published at KDD &apos;24</p>
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
                    <h3 className="text-brand-navy text-xl font-bold mb-3">What is the AI visibility methodology?</h3>
                    <p className="text-slate-600 leading-relaxed">Our AI visibility methodology is a research-backed framework developed by ScopeSite Digital Studios for making businesses visible to AI assistants like ChatGPT, Claude, Gemini and Perplexity.</p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div>
                    <h3 className="text-brand-navy text-xl font-bold mb-3">Does AI visibility work for small businesses?</h3>
                    <p className="text-slate-600 leading-relaxed">H4TLT is a single-operator audiology business. Within 4 months of implementing our AI visibility stack, it was recommended nationally alongside firms that have operated for decades with significantly larger marketing budgets. The methodology is designed to level the playing field.</p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div>
                    <h3 className="text-brand-navy text-xl font-bold mb-3">How much does AI visibility optimisation cost?</h3>
                    <p className="text-slate-600 leading-relaxed mb-5">The H4TLT engagement combined a full website rebuild, custom Compliance Checker app, and ongoing AI visibility programme. Typical engagements in professional services sectors range from £3,000 setup with retainers from £500/month for single-site businesses, scaling to £20,000+ for multi-product or multi-location operations. The exact figure depends on your sector, current schema position, and the AI visibility gap. A free V.O.I.C.E. scan at voice.scopesite.co.uk gives you a starting picture, and a 15-minute discovery call gives you a realistic figure for your business.</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href="/book"
                        className="btn-primary px-6 py-3 rounded-lg inline-block text-center"
                      >
                        Book a 15-minute discovery call →
                      </Link>
                      <Link
                        href="https://voice.scopesite.co.uk"
                        className="btn-secondary px-6 py-3 rounded-lg inline-block text-center"
                      >
                        Run a free V.O.I.C.E. scan →
                      </Link>
                    </div>
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
              <h2 className="text-white text-[28px] sm:text-[36px] md:text-[42px] font-body font-bold normal-case mb-8 leading-tight">
                When a prospect asks ChatGPT to recommend a good <span className="text-brand-gold">[solicitor / accountant / estate agent]</span> in your area, is your firm on the list?
              </h2>
            </FadeInOnScroll>
            
            <FadeInOnScroll delay={0.15}>
              <p className="text-slate-400 text-xl mb-12">
                Most aren&apos;t. Mark is.
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
