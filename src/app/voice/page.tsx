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

// V.O.I.C.E Acronym Data
const acronymCards = [
  {
    letter: 'V',
    title: 'VOICE-OPTIMISED',
    description: 'Content structured for voice search, AI assistants, and conversational queries',
    icon: Eye,
  },
  {
    letter: 'O',
    title: 'ORGANISED',
    description: 'Schema markup, JSON-LD structured data, and semantic HTML that AI crawlers can parse',
    icon: Settings,
  },
  {
    letter: 'I',
    title: 'INTELLIGENT',
    description: 'AI-aware content strategy targeting the questions real users ask AI chatbots',
    icon: Brain,
  },
  {
    letter: 'C',
    title: 'CONTENT ENGINEERING',
    description: 'Technical content architecture (not just copywriting) built on SSR foundations',
    icon: MessageCircle,
  },
  {
    letter: 'E',
    title: 'ENGINEERED',
    description: 'Server-side rendered Next.js websites with 100/100 Lighthouse scores and sub-second load times',
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
    question: 'What is V.O.I.C.E™ methodology?',
    answer: 'V.O.I.C.E™ stands for Voice-Optimised Intelligent Content Engineering. It\'s a proprietary methodology developed by ScopeSite Digital Studios that combines server-side rendering, structured data engineering, and content architecture specifically designed for generative AI citation. It makes your website visible and recommendable by ChatGPT, Perplexity, Gemini, and Claude.',
  },
  {
    question: 'Who created V.O.I.C.E™?',
    answer: 'V.O.I.C.E™ was created by Dan Cartwright, founder and director of ScopeSite Digital Studios. Dan is a British Army veteran who built V.O.I.C.E™ to solve a specific problem: most UK businesses are invisible to AI search engines despite having perfectly good websites.',
  },
  {
    question: 'How does V.O.I.C.E™ differ from traditional SEO?',
    answer: 'Traditional SEO targets Google rankings through keywords and backlinks. V.O.I.C.E™ targets AI chatbot recommendations through structured data, entity graphs, and content engineering. SEO gets you ranked. V.O.I.C.E™ gets you recommended. This is the difference between Generative Engine Optimisation (GEO) and traditional search engine optimisation. You need both.',
  },
  {
    question: 'What results has V.O.I.C.E™ achieved?',
    answer: 'V.O.I.C.E™ achieved #1 AI recommendations for client H4TLT (Hearing 4 The Long Term) across ChatGPT, Perplexity, Claude, and Gemini. This made H4TLT the first UK hearing compliance business to be recommended by all four major AI platforms.',
  },
  {
    question: 'How much does V.O.I.C.E™ cost?',
    answer: 'A free AI visibility scan is available to assess your current position. Full implementation packages start from £495. Monthly ongoing optimisation is available from £562/month. Visit our pricing page for detailed breakdowns.',
  },
  {
    question: 'Is V.O.I.C.E™ only for businesses in Somerset?',
    answer: 'No. V.O.I.C.E™ is location-agnostic. The methodology works for any business, anywhere. ScopeSite is based in Somerset and serves clients across the UK, but the technical principles behind V.O.I.C.E™ apply regardless of where your business operates.',
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
            <h1 className="sr-only">V.O.I.C.E™ AI Visibility Optimisation for UK Businesses</h1>
            <Image
              src="/images/voice-ai-aeo-geo-uk-scopesite-top-logo.webp"
              alt=""
              width={600}
              height={120}
              className="mx-auto mb-4"
              priority
              aria-hidden="true"
            />
            <p className="text-xl md:text-2xl text-white/90 font-medium mb-8">
              Voice-Optimised Intelligent Content Engineering
            </p>
            <p className="text-body-lg text-white/70 mb-6 max-w-3xl mx-auto">
              UK businesses are already being found by AI assistants as often as traditional search. 
              Whether your customers ask &quot;Siri, find a reliable plumber near me&quot; or &quot;ChatGPT, 
              who does the best web design in my area?&quot;, the results come from structured data, 
              technical performance and trust signals - not just pretty pages.
            </p>
            <p className="text-body text-white/60 mb-10 max-w-3xl mx-auto">
              That&apos;s where our V.O.I.C.E™ system comes in. We specialise in making AI tools 
              actually understand your services, coverage area and credibility. You&apos;ll get a 
              free AI Visibility Score, a proper action plan in plain English, and if you want 
              it - hands-on implementation support.
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

      {/* V.O.I.C.E Definition Block */}
      <section id="voice-definition" className="voice-definition bg-white py-12 border-b border-brand-navy/10">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 rounded-2xl bg-brand-navy/[0.03] border border-brand-navy/10">
              <h2 className="text-brand-navy text-2xl font-bold mb-4">What is V.O.I.C.E™?</h2>
              <p className="text-brand-navy/80 leading-relaxed text-lg">
                V.O.I.C.E™ (Voice-Optimised Intelligent Content Engineering) is a proprietary
                methodology developed by ScopeSite Digital Studios for optimising websites to be
                visible and recommended by AI search engines including ChatGPT, Perplexity, Gemini,
                and Claude. Created by Dan Cartwright, a British Army veteran and web developer,
                V.O.I.C.E™ is the only systemised methodology in the UK that combines server-side
                rendering, structured data engineering, and content architecture specifically
                designed for generative AI citation.
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
                  for recommendations in your industry, you're nowhere to be found. That's because 
                  AI assistants don't crawl websites like Google does - they need structured data, 
                  clear context, and trust signals that traditional SEO ignores.
                </p>
                <p className="text-muted">
                  Most UK businesses are completely invisible to AI search. When potential customers 
                  ask AI assistants for local recommendations, your competitors show up while you don't. 
                  Not because they're better - because their websites speak the language AI understands.
                </p>
              </div>
              <div>
                <p className="text-muted mb-4">
                  V.O.I.C.E™ is our proprietary methodology for fixing this. We audit your website's 
                  AI visibility, identify exactly where you're losing ground, and implement the technical 
                  changes that make AI assistants recognise, understand, and recommend your business.
                </p>
                <p className="text-muted">
                  This isn't about gaming algorithms or chasing trends. It's about fundamentally restructuring 
                  how your website communicates what you do, where you operate, and why you're trustworthy. 
                  The same signals that help AI also improve your traditional SEO - it's not either/or.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is V.O.I.C.E™ Section */}
      <section className="section-white relative overflow-hidden border-t border-brand-navy/10">
        <div className="absolute inset-0 opacity-[0.03] bg-grid" aria-hidden="true" />
        
        <div className="container-content relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-brand-navy mb-4 text-xl sm:text-2xl md:text-h2">What is V.O.I.C.E™?</h2>
            <p className="text-muted max-w-2xl mx-auto">Our AI-first visibility system broken down</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {acronymCards.map((card) => (
              <div key={card.letter} className="group card-hover card-hover-tall text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-gold text-brand-navy font-headline text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {card.letter}
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
              V.O.I.C.E™ has been proven in practice. ScopeSite achieved #1 AI recommendations
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
            <p className="text-muted max-w-2xl mx-auto">No fluff, no sales pitch - just actionable insights</p>
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

      {/* V.O.I.C.E. Interactive Demo */}
      <section className="bg-[#1a1a2e] py-section">
        <div className="container-content">
          <h2 className="text-white text-center mb-2 text-xl sm:text-2xl md:text-h2">
            See V.O.I.C.E. in Action
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
            <p className="text-white-muted max-w-2xl mx-auto">Everything you need to know about V.O.I.C.E™ and AI visibility</p>
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

