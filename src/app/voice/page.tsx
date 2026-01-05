'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  Eye, 
  Settings, 
  Brain, 
  MessageCircle, 
  Cpu,
  Rocket,
  ExternalLink,
  CheckCircle2,
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
        <p className="text-white/70 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

// V.O.I.C.E Acronym Data
const acronymCards = [
  {
    letter: 'V',
    title: 'VISIBILITY',
    description: 'Making your business findable by AI assistants like ChatGPT, Siri, Alexa and Claude',
    icon: Eye,
  },
  {
    letter: 'O',
    title: 'OPTIMISATION',
    description: 'Technical improvements to structured data, schema markup and site architecture',
    icon: Settings,
  },
  {
    letter: 'I',
    title: 'INTELLIGENT',
    description: 'AI-focused strategy that goes beyond traditional SEO',
    icon: Brain,
  },
  {
    letter: 'C',
    title: 'CONVERSATIONAL',
    description: 'Voice search ready - optimised for how people actually talk to AI',
    icon: MessageCircle,
  },
  {
    letter: 'E',
    title: 'ENGINES',
    description: 'Built for ChatGPT, Siri, Alexa, Claude, Perplexity and whatever comes next',
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
    question: 'What is V.O.I.C.E™ GEO?',
    answer: 'V.O.I.C.E™ stands for Visibility Optimisation for Intelligent Conversational Engines. It\'s our AI-first system that makes sure your website gets seen by tools like ChatGPT, Siri, Alexa, and Claude. It\'s not just search engine friendly - it\'s AI fluent.',
  },
  {
    question: 'Why do I need GEO for AI visibility - isn\'t Google enough?',
    answer: 'People are talking to search engines now, not just typing. If your site isn\'t speaking the right structured data language, AI assistants can\'t find you or recommend you. Traditional SEO alone won\'t cut it anymore.',
  },
  {
    question: 'Is the scan really free?',
    answer: '100%, no strings, no sneaky sales pitch. We run a full visibility scan and tell you what\'s working, what\'s invisible, and what needs fixing.',
  },
  {
    question: 'What do I get with the free GEO scan?',
    answer: 'You\'ll receive an AI GEO visibility score, full structured data health breakdown, DA/PA ranking powered by MOZ, spam score, backlink count, AI mentions tracking, and a 90-day implementation guide as a PDF report.',
  },
  {
    question: 'Can ScopeSite help implement the fixes after the scan?',
    answer: 'Absolutely. If you want us to handle it, we\'ve got packages starting from £495. But there\'s no pressure - you can DIY with the report or let us do it for you.',
  },
  {
    question: 'How long does the scan take?',
    answer: 'Usually 1-2 working days. It\'s a proper audit, not a five-second gimmick. We look under the bonnet and give it to you straight.',
  },
  {
    question: 'Is this just SEO with a fancy name?',
    answer: 'Not at all. Traditional SEO focuses on humans and Google. V.O.I.C.E™ is built for how AI understands your site - structure, schema, relationships, and context. It\'s next-gen visibility.',
  },
  {
    question: 'Do I need to be technical to understand the report?',
    answer: 'Nope. We translate everything into plain English. You\'ll get clear explanations, visual diagrams, and a human-friendly summary.',
  },
  {
    question: 'Can I use this if I\'m on Wix, Squarespace, or WordPress?',
    answer: 'You sure can. Whether your site\'s DIY or custom-coded, we\'ll show you what\'s working and what\'s not. We work across all platforms.',
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
            <Image
              src="/images/voice-ai-aeo-geo-uk-scopesite-top-logo.webp"
              alt="V.O.I.C.E™ - Visibility Optimisation for Intelligent Conversational Engines: ScopeSite's AI-first system for making UK businesses findable by ChatGPT, Siri, Alexa, Claude and other AI assistants through structured data, schema markup and conversational search optimisation"
              width={600}
              height={120}
              className="mx-auto mb-4"
              priority
            />
            <p className="text-xl md:text-2xl text-white/90 font-medium mb-8">
              Visibility Optimisation for Intelligent Conversational Engines
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

      {/* What is V.O.I.C.E™ Section */}
      <section className="section-white relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(10,27,54,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(10,27,54,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        <div className="container-content relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-brand-navy mb-4 text-xl sm:text-2xl md:text-h2">What is V.O.I.C.E™?</h2>
            <p className="text-brand-navy/70 max-w-2xl mx-auto">
              Our AI-first visibility system broken down
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {acronymCards.map((card) => (
              <div
                key={card.letter}
                className="group relative p-6 rounded-2xl transition-all duration-400 ease-out
                  bg-white backdrop-blur-sm
                  border border-brand-navy/10
                  hover:translate-y-[-12px]
                  hover:shadow-[0_0_40px_rgba(236,182,21,0.25)]
                  hover:border-brand-gold/50 text-center"
                style={{
                  boxShadow: '0 4px 24px rgba(10,27,54,0.08)'
                }}
              >
                {/* Letter Badge */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full 
                  bg-brand-gold text-brand-navy font-headline text-2xl mb-4
                  group-hover:scale-110 transition-transform duration-400">
                  {card.letter}
                </div>
                
                {/* Icon */}
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl 
                  bg-brand-navy/5 group-hover:bg-brand-gold/10 transition-all duration-400">
                  <card.icon className="w-6 h-6 text-brand-navy group-hover:text-brand-gold transition-colors duration-400" />
                </div>
                
                {/* Content */}
                <h3 className="text-brand-navy font-bold text-sm mb-2">{card.title}</h3>
                <p className="text-brand-navy/60 text-sm">{card.description}</p>
              </div>
            ))}
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
            <p className="text-brand-navy/70 max-w-2xl mx-auto">
              No fluff, no sales pitch - just actionable insights
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="flex items-start gap-4 p-6 rounded-xl bg-brand-navy/[0.02] border border-brand-navy/5"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-gold/10 flex items-center justify-center">
                  <benefit.icon className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <h4 className="text-brand-navy font-bold mb-1">{benefit.title}</h4>
                  <p className="text-brand-navy/60 text-sm">{benefit.description}</p>
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

      {/* FAQ Section */}
      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">Frequently Asked Questions</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Everything you need to know about V.O.I.C.E™ and AI visibility
            </p>
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
          <p className="text-brand-navy/70 mb-8 max-w-xl mx-auto">
            Get your free visibility score or book a call to discuss your results
          </p>
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

