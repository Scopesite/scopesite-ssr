'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const VoiceSchemaDemo = dynamic(
  () => import('@/components/animations/VoiceSchemaDemo').then((m) => m.VoiceSchemaDemo),
  { ssr: false, loading: () => <div className="h-[500px]" /> }
);
import { 
  Eye, 
  Settings, 
  Brain, 
  MessageCircle, 
  Cpu,
  Rocket,
  ExternalLink,
  ChevronDown,
  ArrowRight,
  BarChart3,
  Code2,
  Shield,
  Link2,
  Search,
  FileText
} from 'lucide-react';
import { useState } from 'react';

// FAQ Accordion Component
function FAQItem({ question, answer, isOpen, onClick }: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onClick: () => void;
}) {
  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-white font-medium text-lg pr-8">{question}</span>
        <ChevronDown 
          className={`w-6 h-6 text-brand-gold transition-transform duration-300 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? 'max-h-96 pb-6' : 'max-h-0'
        }`}
      >
        <p className="text-white-muted leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

// Five pillars we use to explain AI visibility work to customers
const pillarCards = [
  {
    step: '1',
    title: 'MEASURE',
    description: 'We score how AI platforms read you today, not how your brochure reads to humans.',
    icon: Eye,
  },
  {
    step: '2',
    title: 'STRUCTURE',
    description: 'Facts are auto-formatted for AI to read, with clean HTML and structured data.',
    icon: Settings,
  },
  {
    step: '3',
    title: 'CONTENT',
    description: 'We shape pages around the questions buyers ask ChatGPT and Perplexity.',
    icon: Brain,
  },
  {
    step: '4',
    title: 'SPEED',
    description: 'Ultra Fast Next.js delivery so crawlers get full pages, not empty shells.',
    icon: MessageCircle,
  },
  {
    step: '5',
    title: 'REPORT',
    description: 'You get plain-English fixes, tracked scores, and a plan you can act on.',
    icon: Cpu,
  },
];

// Benefits Data
const benefits = [
  {
    title: 'AI GEO Visibility Score',
    description: 'See exactly how visible you are to AI assistants',
    icon: BarChart3,
  },
  {
    title: 'Structured Data Health',
    description: 'Full breakdown of your schema markup and what\'s missing',
    icon: Code2,
  },
  {
    title: 'DA/PA Ranking',
    description: 'Your domain authority powered by MOZ',
    icon: BarChart3,
  },
  {
    title: 'Spam Score Analysis',
    description: 'Check if your backlinks are helping or hurting',
    icon: Shield,
  },
  {
    title: 'Backlink Count',
    description: 'How many sites are linking to you',
    icon: Link2,
  },
  {
    title: 'AI Mentions Tracking',
    description: 'See if you show up for specific keywords in AI chat',
    icon: Search,
  },
  {
    title: '90-Day Implementation Guide',
    description: 'Full PDF roadmap to fix what\'s broken',
    icon: FileText,
  },
];

// FAQ Data
const faqItems = [
  {
    question: 'What is the AI visibility methodology?',
    answer:
      'It is our ScopeSite framework for AI SEO: fast HTML, structured facts, crawler access, and content laid out for AI extraction. It helps ChatGPT, Perplexity, Gemini, and Claude cite you accurately.',
  },
  {
    question: 'Who built it?',
    answer:
      'Dan Cartwright, founder of ScopeSite Digital Studios. Dan is a British Army veteran who focused on a simple problem: good-looking sites that AI still cannot read.',
  },
  {
    question: 'How is this different from traditional SEO?',
    answer:
      'Classic SEO chases rankings. AI SEO chases citations inside AI answers. You usually want both. Generative engine optimisation covers the AI side, search SEO covers the blue links.',
  },
  {
    question: 'What results have you proven?',
    answer:
      'Client H4TLT (Hearing 4 The Long Term) reached number one AI recommendations across ChatGPT, Perplexity, Claude, and Gemini. That made them a standout UK case in their sector.',
  },
  {
    question: 'How much does the AI SEO retainer cost?',
    answer:
      'The scan is free. The standard AI SEO retainer is £500 per month with a £750 one-time setup on a 6- or 12-month commitment. See our pricing page for detail. After three months on the retainer, our 80 Score Guarantee applies. If your AI visibility score stays below 80 while you follow our direction, you pay nothing more until the score reaches 80 and holds for 30 consecutive days.',
  },
  {
    question: 'Is this only for Somerset businesses?',
    answer:
      'No. ScopeSite is based in Somerset and works UK-wide. The technical approach is the same wherever you operate.',
  },
];

export default function VoicePage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-section min-h-[70vh] flex items-center">
        <div className="container-content">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-headline text-white text-2xl sm:text-3xl md:text-4xl mb-4 leading-tight max-w-3xl mx-auto">
              <span className="normal-case">AI visibility scan and AI SEO for UK businesses</span>
            </h1>
            <Image
              src="/images/voice-ai-aeo-geo-uk-scopesite-top-logo.webp"
              alt="AI visibility scanning tool by ScopeSite Digital Studios"
              width={600}
              height={120}
              className="mx-auto mb-4"
              priority
            />
            <p className="text-xl md:text-2xl text-white/90 font-medium mb-8">
              Measure, fix, and track how AI cites you
            </p>
            <p className="text-body-lg text-white/70 mb-6 max-w-3xl mx-auto">
              UK businesses are already being found by AI assistants as often as traditional search. 
              Whether your customers ask &quot;Siri, find a reliable plumber near me&quot; or &quot;ChatGPT, 
              who does the best web design in my area?&quot;, the results come from structured data, 
              technical performance and trust signals - not just pretty pages.
            </p>
            <p className="text-body text-white/60 mb-10 max-w-3xl mx-auto">
              That is where our AI visibility system helps. We make sure assistants understand your services,
              areas, and proof. You get a free AI visibility score, a plain-English action plan, and optional
              hands-on implementation.
            </p>
            <a
              href="https://voice.scopesite.co.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 text-lg"
            >
              Get Your Free AI Score
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* AI visibility definition */}
      <section id="voice-definition" className="voice-definition bg-white py-12 border-b border-brand-navy/10">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 rounded-2xl bg-brand-navy/[0.03] border border-brand-navy/10">
              <h2 className="text-brand-navy text-2xl font-bold mb-4">What is the AI visibility system?</h2>
              <p className="text-brand-navy/80 leading-relaxed text-lg">
                It is how ScopeSite turns your website into something AI can read, trust, and cite. We combine
                Ultra Fast delivery, structured facts, crawler access, and content layout built for AI answers.
                Dan Cartwright, a British Army veteran, designed the workflow around one goal: stop losing
                enquiries to competitors who simply publish clearer machine-readable facts. Before you run a
                scan, read{' '}
                <Link href="/blog/ai-visibility-checker" className="text-brand-gold hover:underline">
                  what an AI visibility checker actually measures
                </Link>
                , including inputs, scoring, and what each signal means for your site.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Context Section */}
      <section className="bg-white py-12">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-brand-navy text-2xl font-bold mb-6 text-center">The Problem With Traditional SEO</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-muted mb-4">
                  Your business might rank well on Google, but when someone asks ChatGPT or Claude
                  for recommendations in your industry, you&apos;re nowhere to be found. That&apos;s because
                  AI assistants don&apos;t crawl websites like Google does - they need structured data,
                  clear context, and trust signals that traditional SEO ignores.
                </p>
                <p className="text-muted">
                  Most UK businesses are completely invisible to AI search. When potential customers
                  ask AI assistants for local recommendations, your competitors show up while you
                  don&apos;t. Not because they&apos;re better - because their websites speak the language AI
                  understands.
                </p>
              </div>
              <div>
                <p className="text-muted mb-4">
                  Our AI visibility programme fixes this. We audit how AI reads you, show the gaps, then ship
                  the technical work so assistants recognise and recommend your business. The practical goal is{' '}
                  <Link
                    href="/blog/how-to-get-recommended-by-chatgpt"
                    className="text-brand-gold hover:underline"
                  >
                    how to get recommended by ChatGPT in 2026
                  </Link>
                  . The same foundation supports Perplexity, Claude, and Gemini.
                </p>
                <p className="text-muted">
                  This isn&apos;t about gaming algorithms or chasing trends. It&apos;s about fundamentally
                  restructuring how your website communicates what you do, where you operate, and why
                  you&apos;re trustworthy. The same signals that help AI also improve your traditional SEO -
                  it&apos;s not either/or.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Five pillars */}
      <section className="section-white relative overflow-hidden border-t border-brand-navy/10">
        <div className="absolute inset-0 opacity-[0.03] bg-grid" aria-hidden="true" />
        
        <div className="container-content relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-brand-navy mb-4 text-xl sm:text-2xl md:text-h2">How we structure AI visibility work</h2>
            <p className="text-muted max-w-2xl mx-auto">Five pillars you can scan in seconds</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {pillarCards.map((card) => (
              <div key={card.step} className="group card-hover card-hover-tall text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-gold text-brand-navy font-headline text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {card.step}
                </div>
                <div className="mb-4 icon-box-md mx-auto">
                  <card.icon className="w-6 h-6 icon-brand" />
                </div>
                <h3 className="text-brand-navy font-bold text-sm mb-2">{card.title}</h3>
                <p className="text-light text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof Point Section */}
      <section className="bg-brand-navy/[0.03] py-12 border-t border-brand-navy/10">
        <div className="container-content">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-brand-navy text-2xl font-bold mb-4">Proven Results</h2>
            <p className="text-brand-navy/80 leading-relaxed text-lg max-w-3xl mx-auto mb-6">
              Our AI SEO work has been proven in practice. ScopeSite delivered number one AI recommendations
              for client H4TLT (Hearing 4 The Long Term) across ChatGPT, Perplexity, Claude,
              and Gemini. This made it the first UK hearing compliance business to be recommended
              by all four major AI platforms.
            </p>
            <Link
              href="/case-studies/h4tlt"
              className="inline-flex items-center gap-2 text-brand-gold font-medium hover:underline"
            >
              Read the H4TLT case study
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* AI Scanner CTA Section */}
      <section className="bg-brand-navy py-section relative overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/20 rounded-full blur-[150px] animate-pulse" />
        
        <div className="container-content relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">Check Your AI Visibility Score</h2>
            <p className="text-white/70 mb-10">
              The first pro scan is on us - no strings attached
            </p>
            
            {/* Prominent CTA Card */}
            <div className="relative inline-block">
              {/* Glow effect behind button */}
              <div className="absolute inset-0 bg-brand-gold/40 rounded-2xl blur-xl animate-pulse" />
              
              <a
                href="https://voice.scopesite.co.uk/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl
                  bg-brand-gold font-bold text-xl
                  shadow-[0_0_40px_rgba(236,182,21,0.5)]
                  hover:shadow-[0_0_60px_rgba(236,182,21,0.7)]
                  hover:scale-105 transition-all duration-300"
                style={{ color: '#0A1B36' }}
              >
                <Rocket className="w-6 h-6" />
                Launch Your Free AI Scan
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
            
            <p className="text-white/50 text-sm mt-6">
              Opens in new tab • Takes 2 minutes • No card details required • 1 Free Pro Scan
            </p>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="section-white">
        <div className="container-content">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-brand-navy mb-4 text-xl sm:text-2xl md:text-h2">What&apos;s Included in Your Free Scan?</h2>
            <p className="text-muted max-w-2xl mx-auto">
              No fluff, no sales pitch, just actionable insight. If you are comparing free tools first, read our
              take on the{' '}
              <Link href="/blog/free-ai-visibility-tools" className="text-brand-gold hover:underline">
                free AI visibility tools we tested
              </Link>
              , and how they stack up before you pay for anything.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="card-subtle flex items-start gap-4">
                <div className="flex-shrink-0 icon-box-sm bg-brand-gold/10">
                  <benefit.icon className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <h4 className="text-brand-navy font-bold mb-1">{benefit.title}</h4>
                  <p className="text-light text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <a
              href="https://voice.scopesite.co.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              Get Your Free Score
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* AI visibility interactive demo */}
      <section className="bg-[#1a1a2e] py-section">
        <div className="container-content">
          <h2 className="text-white text-center mb-2 text-xl sm:text-2xl md:text-h2">
            See AI visibility in action
          </h2>
          <p className="text-white/50 text-center mb-10 max-w-xl mx-auto text-sm">
            From publish to AI recommendation in seconds
          </p>

          <VoiceSchemaDemo />

          {/* noscript fallback for JS-disabled browsers */}
          <noscript>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-[#16213e] rounded-lg border border-white/10 p-5">
                <div className="text-brand-gold font-bold text-xs uppercase tracking-wider mb-2">1. Publish</div>
                <p className="text-white/70 text-sm">You write and publish a blog post in Ghost CMS. One click.</p>
              </div>
              <div className="bg-[#16213e] rounded-lg border border-white/10 p-5">
                <div className="text-brand-gold font-bold text-xs uppercase tracking-wider mb-2">2. Schema Generates</div>
                <p className="text-white/70 text-sm">6 schema types auto-generated: BlogPosting, Author, Publisher, FAQ, Speakable, and entity mentions.</p>
              </div>
              <div className="bg-[#16213e] rounded-lg border border-white/10 p-5">
                <div className="text-brand-gold font-bold text-xs uppercase tracking-wider mb-2">3. AI Recommends</div>
                <p className="text-white/70 text-sm">AI platforms read your schema and recommend your business to users asking relevant questions.</p>
              </div>
            </div>
          </noscript>

          <p className="text-white/70 text-center mt-10 text-sm">
            This happens automatically. Every time you publish. No plugins. No manual work.
          </p>
          <div className="text-center mt-6">
            <Link
              href="/book"
              className="btn inline-block bg-brand-gold !text-[#0A1B36] no-underline font-extrabold text-lg px-10 py-4 rounded-xl shadow-[0_4px_0_#b8860b] hover:shadow-[0_2px_0_#b8860b] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-150"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">Frequently Asked Questions</h2>
            <p className="text-white-muted max-w-2xl mx-auto">Everything you need to know about AI visibility scans and AI SEO</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {faqItems.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section-white">
        <div className="container-content text-center">
          <h2 className="text-brand-navy mb-4 text-xl sm:text-2xl md:text-h2">Ready to See How AI Sees You?</h2>
            <p className="text-muted mb-8 max-w-xl mx-auto">Get your free visibility score or book a call to discuss your results</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://voice.scopesite.co.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Get Free AI Score
            </a>
            <Link href="/book" className="btn-secondary">
              Book Strategy Call
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

