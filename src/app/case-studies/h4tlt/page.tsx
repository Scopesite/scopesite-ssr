'use client';

import Link from 'next/link';
import { 
  Eye, 
  Settings, 
  Brain, 
  Cpu,
  Zap,
  ArrowRight,
  Check,
  X,
  TrendingUp,
  Bot,
  ClipboardCheck,
  Calculator,
  Calendar,
  FileText,
  Globe,
  Code2,
  Users,
  MessageSquare
} from 'lucide-react';
import { FadeInOnScroll, StaggerContainer, StaggerItem, AnimatedCounter } from '@/components/animations';

// V.O.I.C.E. methodology data - Visibility, Optimisation, for Intelligent, Crawler, Engines
const voiceSteps = [
  {
    letter: 'V',
    title: 'VISIBILITY',
    description: 'Make content visible to AI crawlers. Clear structure, logical hierarchy, and properly marked-up content that machines can parse and understand.',
    icon: Eye,
  },
  {
    letter: 'O',
    title: 'OPTIMISATION',
    description: 'Optimise for trust, not just keywords. We built a 51-entry regulatory library with citations to authoritative sources (HSE, legislation.gov.uk).',
    icon: Settings,
  },
  {
    letter: 'I',
    title: 'INTELLIGENT',
    description: 'Target the intelligent systems replacing traditional search. ChatGPT, Perplexity, Claude, Gemini – where B2B buyers now start their research.',
    icon: Brain,
  },
  {
    letter: 'C',
    title: 'CONVERSATIONAL',
    description: 'Answer questions the way buyers actually ask them. Natural language that matches real queries, not keyword-stuffed jargon.',
    icon: MessageSquare,
  },
  {
    letter: 'E',
    title: 'ENGINES',
    description: 'Focus on the new answer engines. AI-powered search is growing exponentially – businesses that optimise now will dominate their niches.',
    icon: Cpu,
  },
];

// Deliverables data
const deliverables = [
  { text: 'Complete website rebuild on Wix Studio with mobile-first design', icon: Globe },
  { text: '51-entry regulatory knowledge library covering legislation, HSE guidance, and standards', icon: FileText },
  { text: 'Three service pages optimised for buyer language (not technical jargon)', icon: Users },
  { text: 'Interactive compliance checker with logic-gated quote engine', icon: Calculator },
  { text: 'JSON-LD schema markup for Organisation, Services, FAQs, and Person', icon: Code2 },
];

// AI results data
const aiResults = [
  {
    query: '"Who is the cheapest company for HSE hearing tests?"',
    result: 'H4TLT recommended FIRST by ChatGPT, Perplexity, Claude, and Gemini',
  },
  {
    query: '"What company does fit testing without calibrated equipment?"',
    result: 'H4TLT named as "the ONLY company" by ChatGPT',
  },
  {
    query: '"We need 500 induction hearing tests – what company is best?"',
    result: 'Gemini called them "The Cost-Effective Disruptor"',
  },
];

// Bot crawl data
const botCrawls = [
  { page: 'Homepage', hits: 48 },
  { page: 'BS EN ISO 8253-1:2010 (Audiometry Standard)', hits: 33 },
  { page: 'HSE Hearing Test Service Page', hits: 14 },
  { page: 'Induction Hearing Test Service Page', hits: 14 },
  { page: 'Earplug Fit Test Service Page', hits: 12 },
];

// Before/After comparison
const comparison = [
  { before: '7 visitors/week', after: '185 AI bot crawls', metric: 'Traffic' },
  { before: '0 AI mentions', after: '#1 on 4 AI platforms', metric: 'Visibility' },
  { before: 'No clear CTAs', after: 'Interactive quote engine', metric: 'Conversion' },
  { before: 'No schema markup', after: '51-entry library', metric: 'Structure' },
];

// Compliance checker steps
const checkerSteps = [
  {
    step: 1,
    title: 'Risk Assessment Questions',
    description: 'Users answer questions about workplace noise exposure, hearing protection, and current testing practices.',
    icon: ClipboardCheck,
  },
  {
    step: 2,
    title: 'Intelligent Routing',
    description: 'The system determines which tests they need and whether they\'re currently compliant with Regulation 9.',
    icon: Brain,
  },
  {
    step: 3,
    title: 'Compliance Feedback',
    description: 'Clear, non-threatening advisory explaining any compliance gaps and how H4TLT can help fix them.',
    icon: MessageSquare,
  },
  {
    step: 4,
    title: 'Two Clear Routes',
    description: 'Instant Quote with transparent pricing OR Book a Discovery Call for complex requirements.',
    icon: ArrowRight,
  },
];

export default function H4TLTCaseStudyPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-section min-h-[60vh] flex items-center">
        <div className="container-content">
          <div className="max-w-4xl mx-auto text-center">
            <FadeInOnScroll>
              <div className="badge-gold mb-6">V.O.I.C.E.™ Case Study</div>
            </FadeInOnScroll>
            <FadeInOnScroll delay={0.1}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-display text-white mb-6">
                V.O.I.C.E.™ IN ACTION
              </h1>
            </FadeInOnScroll>
            <FadeInOnScroll delay={0.2}>
              <p className="text-xl md:text-2xl text-white/90 font-medium mb-8">
                How a UK Hearing Compliance Provider Became the #1 AI-Recommended Option in 6 Weeks
              </p>
            </FadeInOnScroll>
            <FadeInOnScroll delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/book" className="btn-primary">
                  Book a Strategy Call
                </Link>
                <Link href="/voice" className="btn-secondary">
                  Learn About V.O.I.C.E.™
                </Link>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* The Client Section */}
      <section className="section-white">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <FadeInOnScroll>
              <h2 className="text-brand-navy text-2xl sm:text-3xl mb-6 text-center">The Client</h2>
            </FadeInOnScroll>
            <FadeInOnScroll delay={0.1}>
              <p className="text-muted text-lg text-center">
                Mark is a professional audiologist with over 30 years of experience in occupational hearing health. 
                His company, <strong className="text-brand-navy">Hear 4 The Long Term (H4TLT)</strong>, provides workplace 
                hearing compliance services – HSE hearing surveillance, baseline tests for new starters, and earplug 
                fit testing using a proprietary methodology.
              </p>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <h2 className="text-white text-2xl sm:text-3xl mb-4">The Problem</h2>
              <p className="text-white-muted max-w-2xl mx-auto">
                When Mark approached ScopeSite in November 2024, his website was effectively invisible
              </p>
            </div>
          </FadeInOnScroll>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto" staggerDelay={0.1}>
            <StaggerItem>
              <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-4xl md:text-5xl font-bold text-brand-gold mb-2">7</div>
                <p className="text-white/70 text-sm">visitors/week</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-4xl md:text-5xl font-bold text-brand-gold mb-2">0</div>
                <p className="text-white/70 text-sm">clear CTAs</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-4xl md:text-5xl font-bold text-brand-gold mb-2">0</div>
                <p className="text-white/70 text-sm">schema markup</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-4xl md:text-5xl font-bold text-brand-gold mb-2">0</div>
                <p className="text-white/70 text-sm">AI visibility</p>
              </div>
            </StaggerItem>
          </StaggerContainer>

          <FadeInOnScroll delay={0.4}>
            <div className="mt-10 max-w-2xl mx-auto text-center">
              <p className="text-white/80 text-lg">
                The real issue? Competitors were charging <span className="text-red-400 font-bold">£40-70 per test</span>. 
                Mark was offering the same service from <span className="text-brand-gold font-bold">£10 per test</span> – 
                but nobody could find him.
              </p>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* The V.O.I.C.E.™ Solution Section */}
      <section className="section-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-grid" aria-hidden="true" />
        
        <div className="container-content relative z-10">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <h2 className="text-brand-navy text-2xl sm:text-3xl mb-4">The V.O.I.C.E.™ Solution</h2>
              <p className="text-brand-navy font-medium mb-2">Visibility, Optimisation, for Intelligent, Crawler, Engines</p>
              <p className="text-muted max-w-2xl mx-auto">
                Our methodology for Answer Engine Optimisation – building websites that AI assistants want to recommend
              </p>
            </div>
          </FadeInOnScroll>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6" staggerDelay={0.1}>
            {voiceSteps.map((step) => (
              <StaggerItem key={step.letter}>
                <div className="group card-hover card-hover-tall text-center h-full">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-gold text-brand-navy font-headline text-2xl mb-4 group-hover:scale-110 transition-transform">
                    {step.letter}
                  </div>
                  <div className="mb-4 icon-box-md mx-auto">
                    <step.icon className="w-6 h-6 icon-brand" />
                  </div>
                  <h3 className="text-brand-navy font-bold text-sm mb-2">{step.title}</h3>
                  <p className="text-light text-sm">{step.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* What We Built Section */}
      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <h2 className="text-white text-2xl sm:text-3xl mb-4">What We Built</h2>
              <p className="text-white-muted max-w-2xl mx-auto">
                From November 2024 to New Year&apos;s Eve 2025, we delivered
              </p>
            </div>
          </FadeInOnScroll>

          <StaggerContainer className="max-w-3xl mx-auto space-y-4" staggerDelay={0.1}>
            {deliverables.map((item, index) => (
              <StaggerItem key={index}>
                <div className="flex items-center gap-4 p-5 rounded-xl bg-white/5 border border-white/10 hover:border-brand-gold/30 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-brand-gold/20 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-brand-gold" />
                  </div>
                  <p className="text-white">{item.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Compliance Checker Section */}
      <section className="section-white">
        <div className="container-content">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <h2 className="text-brand-navy text-2xl sm:text-3xl mb-4">The Compliance Checker</h2>
              <p className="text-muted max-w-2xl mx-auto">
                A conversion engine that qualifies leads automatically – not a simple contact form
              </p>
            </div>
          </FadeInOnScroll>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" staggerDelay={0.15}>
            {checkerSteps.map((item) => (
              <StaggerItem key={item.step}>
                <div className="relative text-center p-6">
                  {/* Step connector line - desktop only */}
                  {item.step < 4 && (
                    <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-brand-navy/20 -translate-y-1/2 z-0" />
                  )}
                  
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-navy text-brand-gold font-bold text-xl mb-4 shadow-lg">
                      {item.step}
                    </div>
                    <h3 className="text-brand-navy font-bold mb-2">{item.title}</h3>
                    <p className="text-light text-sm">{item.description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeInOnScroll delay={0.3}>
            <div className="max-w-3xl mx-auto bg-brand-navy/5 rounded-2xl p-8 border border-brand-navy/10">
              <h3 className="text-brand-navy font-bold text-lg mb-4 text-center">Why This Matters</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-muted"><strong className="text-brand-navy">Qualifies leads automatically</strong> – Mark knows exactly what they need</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-muted"><strong className="text-brand-navy">Reduces friction</strong> – get a quote without waiting for a callback</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-muted"><strong className="text-brand-navy">Educates while selling</strong> – users learn about compliance gaps</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-muted"><strong className="text-brand-navy">Works 24/7</strong> – night shift managers can quote at 2am</span>
                </div>
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Results Section */}
      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <h2 className="text-white text-2xl sm:text-3xl mb-4">The Results</h2>
              <p className="text-white-muted max-w-2xl mx-auto">
                Within 30 days of launch, tested across four major AI platforms
              </p>
            </div>
          </FadeInOnScroll>

          <StaggerContainer className="max-w-4xl mx-auto space-y-6 mb-12" staggerDelay={0.15}>
            {aiResults.map((item, index) => (
              <StaggerItem key={index}>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-white/60 text-sm mb-2 italic">{item.query}</p>
                  <p className="text-white text-lg font-medium flex items-start gap-3">
                    <Check className="w-6 h-6 text-brand-gold flex-shrink-0 mt-0.5" />
                    {item.result}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Bot Crawl Stats */}
          <FadeInOnScroll delay={0.3}>
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-brand-gold/20 border border-brand-gold/30 mb-6">
                <Bot className="w-6 h-6 text-brand-gold" />
                <span className="text-white font-bold text-lg">
                  <AnimatedCounter value={185} /> AI bot crawls in 30 days
                </span>
              </div>
              <p className="text-white/60 text-sm">
                Crawlers specifically targeting the regulatory library content
              </p>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Before/After Section */}
      <section className="section-white">
        <div className="container-content">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <h2 className="text-brand-navy text-2xl sm:text-3xl mb-4">By the Numbers</h2>
              <p className="text-muted max-w-2xl mx-auto">
                The transformation in just 30 days
              </p>
            </div>
          </FadeInOnScroll>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto" staggerDelay={0.1}>
            {comparison.map((item, index) => (
              <StaggerItem key={index}>
                <div className="card-hover h-full">
                  <p className="text-brand-navy/50 text-xs font-medium uppercase tracking-wide mb-4">{item.metric}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <X className="w-5 h-5 text-red-500" />
                    <span className="text-red-600 line-through">{item.before}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span className="text-emerald-600 font-bold">{item.after}</span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Why It Worked Section */}
      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <FadeInOnScroll>
              <h2 className="text-white text-2xl sm:text-3xl mb-6 text-center">Why It Worked</h2>
            </FadeInOnScroll>
            <FadeInOnScroll delay={0.1}>
              <p className="text-white/80 text-lg text-center mb-8">
                Traditional SEO focuses on keywords and backlinks. V.O.I.C.E.™ focuses on being the <em>best answer</em>.
              </p>
            </FadeInOnScroll>
            
            <FadeInOnScroll delay={0.2}>
              <p className="text-white/70 text-center mb-8">
                When ChatGPT, Perplexity, or Gemini receive a question about workplace hearing tests, they&apos;re looking for:
              </p>
            </FadeInOnScroll>

            <StaggerContainer className="grid sm:grid-cols-2 gap-4" staggerDelay={0.1}>
              <StaggerItem>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5">
                  <Check className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <span className="text-white"><strong>Clear, direct answers</strong> to the actual question</span>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5">
                  <Check className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <span className="text-white"><strong>Authoritative sources</strong> they can cite with confidence</span>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5">
                  <Check className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <span className="text-white"><strong>Transparent information</strong> (pricing, credentials, methodology)</span>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5">
                  <Check className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <span className="text-white"><strong>Structured content</strong> that&apos;s easy to parse and extract</span>
                </div>
              </StaggerItem>
            </StaggerContainer>

            <FadeInOnScroll delay={0.5}>
              <p className="text-brand-gold text-xl font-bold text-center mt-8">
                H4TLT now provides all of this. Their competitors don&apos;t.
              </p>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-white">
        <div className="container-content text-center">
          <FadeInOnScroll>
            <h2 className="text-brand-navy text-2xl sm:text-3xl mb-4">Want These Results for Your Business?</h2>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.1}>
            <p className="text-muted mb-8 max-w-xl mx-auto">
              V.O.I.C.E.™ isn&apos;t magic – it&apos;s methodology. If your business has expertise that buyers are searching for, 
              we can make sure AI engines recommend you first.
            </p>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.2}>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/book" className="btn-primary inline-flex items-center gap-2">
                Book a Strategy Call
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/pricing" className="btn-secondary">
                Get an Instant Quote
              </Link>
            </div>
          </FadeInOnScroll>
        </div>
      </section>
    </>
  );
}
