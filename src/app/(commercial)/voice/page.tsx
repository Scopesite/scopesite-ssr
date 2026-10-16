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
import { useState, useId } from 'react';
import { AI_VISIBILITY_FAQS as faqItems, CAFMO_PRODUCT_STORY } from '@/lib/product-story';

// FAQ Accordion Component
function FAQItem({ question, answer, isOpen, onClick }: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onClick: () => void;
}) {
  const answerId = useId();
  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={answerId}
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
        id={answerId}
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
    description: 'We check the website evidence available to a scan, then test named questions separately.',
    icon: Eye,
  },
  {
    step: '2',
    title: 'STRUCTURE',
    description: 'We publish clear HTML and structured facts that agree with the visible page.',
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
    description: 'Server-rendered pages give crawlers useful content before browser scripts run.',
    icon: MessageCircle,
  },
  {
    step: '5',
    title: 'REPORT',
    description: 'You get the findings, their limits, and a plan for the next repair.',
    icon: Cpu,
  },
];

// Benefits Data
const benefits = [
  {
    title: 'Technical readiness score',
    description: 'Read a score of the signals checked, with its limits',
    icon: BarChart3,
  },
  {
    title: 'Structured Data Health',
    description: 'Check the structured data found on the scanned page',
    icon: Code2,
  },
  {
    title: 'DA/PA Ranking',
    description: 'External authority metrics where the provider returns them',
    icon: BarChart3,
  },
  {
    title: 'Spam Score Analysis',
    description: 'Review an external risk signal alongside the actual links',
    icon: Shield,
  },
  {
    title: 'Backlink Count',
    description: 'Link counts reported by the external data source',
    icon: Link2,
  },
  {
    title: 'Separate answer checks',
    description: 'Use dated provider answers to check actual mentions and citations',
    icon: Search,
  },
  {
    title: 'Repair priorities',
    description: 'Prioritise the issues the scan actually reports',
    icon: FileText,
  },
];

// FAQ copy is shared with the server-rendered structured data.

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
              Check your website, then check the answers
            </p>
            <p className="text-body-lg text-white/70 mb-6 max-w-3xl mx-auto">
              A recruitment agency can have a perfectly respectable website and still be described badly in an AI answer. We check the public facts, the pages a crawler can retrieve, and the questions your buyers actually ask.
            </p>
            <p className="text-body text-white/60 mb-10 max-w-3xl mx-auto">
              {CAFMO_PRODUCT_STORY.description} {CAFMO_PRODUCT_STORY.measurement}
            </p>
            <a
              href="https://canaifindme.online"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 text-lg"
            >
              Open the current scanner
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
                V.O.I.C.E. names the methodology behind our AI visibility work. We check what your website says about your services, who provides them and what supports the claims, then fix the problems we can demonstrate. For a practical introduction, read{' '}
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
            <h2 className="text-brand-navy text-2xl font-bold mb-6 text-center">Check the route a buyer actually uses</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-muted mb-4">
                  A Google result, a Claude search and a ChatGPT answer can take different routes to your business. Some answers use retrieved pages, others rely on information already in a model. A single website score cannot stand in for all of them.
                </p>
                <p className="text-muted">
                  Start with the evidence: accessible pages, clear services, consistent company details and useful answers. Then record the provider, question, date and cited source when checking an AI response.
                </p>
              </div>
              <div>
                <p className="text-muted mb-4">
                  Our programme combines a technical website audit with separate checks of real answers. Read our guide to{' '}
                  <Link
                    href="/blog/how-to-get-recommended-by-chatgpt"
                    className="text-brand-gold hover:underline"
                  >
                    how to get recommended by ChatGPT in 2026
                  </Link>
                  , then compare the evidence for each provider.
                </p>
                <p className="text-muted">
                  A recruitment website also needs to do its day job: explain the desks you cover, publish real vacancies and help a hiring manager enquire. Our specialist service is at recruitmentwebdesign.com, with its scope, integration questions and demonstrations laid out in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-12">
        <div className="container-content max-w-4xl flex flex-wrap justify-center gap-6">
          <a href="https://recruitmentwebdesign.com/explainers/ai-discovery" className="text-brand-navy underline">AI discovery for recruitment websites</a>
          <Link href="/pricing" className="text-brand-navy underline">Agency service pricing</Link>
          <Link href="/terms-and-conditions" className="text-brand-navy underline">Service and guarantee terms</Link>
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
            <h2 className="text-brand-navy text-2xl font-bold mb-4">Published client evidence</h2>
            <p className="text-brand-navy/80 leading-relaxed text-lg max-w-3xl mx-auto mb-6">
              Our published case study covers work with Hear 4 The Long Term, a workplace hearing surveillance business. It sets out the engagement and its reported results, with the context a headline cannot carry.
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
            <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">CAFMO and the current scanner</h2>
            <p className="text-white/70 mb-10">
              {CAFMO_PRODUCT_STORY.availability}
            </p>
            
            {/* Prominent CTA Card */}
            <div className="relative inline-block">
              {/* Glow effect behind button */}
              <div className="absolute inset-0 bg-brand-gold/40 rounded-2xl blur-xl animate-pulse" />
              
              <a
                href="https://canaifindme.online"
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
                Open the current scanner
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
            
            <p className="text-white/50 text-sm mt-6">
              Opens the existing scanner in a new tab. Check its current access and credit terms there.
            </p>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="section-white">
        <div className="container-content">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-brand-navy mb-4 text-xl sm:text-2xl md:text-h2">What to look for in a scan report</h2>
            <p className="text-muted max-w-2xl mx-auto">
              A useful report explains what was checked, what failed and what could not be measured. Technical readiness, third-party metrics and actual AI answer observations should remain distinguishable.
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
              href="https://canaifindme.online"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              Open the current scanner
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
            Illustrative workflow. Retrieval, citations and enquiries need their own measurement.
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
                <p className="text-white/70 text-sm">The page publishes relevant article, author and publisher facts. Other markup depends on the content.</p>
              </div>
              <div className="bg-[#16213e] rounded-lg border border-white/10 p-5">
                <div className="text-brand-gold font-bold text-xs uppercase tracking-wider mb-2">3. Check Answers</div>
                <p className="text-white/70 text-sm">Check dated answers and their sources. A published page does not guarantee a recommendation.</p>
              </div>
            </div>
          </noscript>

          <p className="text-white/70 text-center mt-10 text-sm">
            Publishing can update the page and its markup. An assistant choosing to cite it is a separate event.
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
          <h2 className="text-brand-navy mb-4 text-xl sm:text-2xl md:text-h2">Where should you start?</h2>
            <p className="text-muted mb-8 max-w-xl mx-auto">Open the current scanner, or discuss the website evidence with ScopeSite.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://canaifindme.online"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Open the current scanner
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

