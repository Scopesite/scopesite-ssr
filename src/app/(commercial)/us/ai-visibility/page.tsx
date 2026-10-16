'use client';

import { CAFMO_PRODUCT_STORY } from '@/lib/product-story';

import Link from 'next/link';
import { useState } from 'react';
import {
  ChevronDown,
  ArrowRight,
  Rocket,
  ExternalLink,
  Search,
  Code2,
  ShieldCheck,
  Bot,
  BarChart3,
} from 'lucide-react';
import { faqItems } from './faqs';

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
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

export default function AIVisibilityPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-section min-h-[60vh] flex items-center">
        <div className="container-content">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold mb-6 leading-tight">
              Is Your Business Visible to AI?{' '}
              <span className="text-brand-gold">Check the Evidence.</span>
            </h1>
            <p className="text-body-lg text-white/80 mb-6 max-w-3xl mx-auto">
              When an employer asks an assistant for a supplier, the answer may name a business, cite a source or leave both out. Check what happened for a recorded question and date before deciding what the website needs.
            </p>
            <p className="text-body text-white/60 mb-10 max-w-3xl mx-auto">
              {CAFMO_PRODUCT_STORY.measurement}
            </p>
            <Link
              href="/voice"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl
                bg-brand-gold font-bold text-xl
                shadow-[0_0_40px_rgba(236,182,21,0.5)]
                hover:shadow-[0_0_60px_rgba(236,182,21,0.7)]
                hover:scale-105 transition-all duration-300"
              style={{ color: '#0A1B36' }}
            >
              <Rocket className="w-6 h-6" />
              See the current scanner
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* What Is AI Visibility? */}
      <section className="bg-white py-12 border-b border-brand-navy/10">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-brand-navy text-2xl md:text-3xl font-bold mb-6">
              What Is AI Visibility?
            </h2>
            <p className="text-muted mb-4">
              AI visibility concerns how assistants find, describe and cite your business. Their answers can draw on model knowledge, search results or retrieved pages. We record actual answers and sources, and investigate website issues separately.
            </p>
            <p className="text-muted mb-4">
              Traditional SEO is built around Google&apos;s ranking algorithm:
              keywords, backlinks, page speed. That still matters, and it is not
              going away. But AI visibility is a separate problem. A website can rank
              on the first page of Google and still be completely invisible to
              ChatGPT, Claude, and Perplexity. The reverse is also true. The
              practical approach is to check search performance and assistant answers separately.
            </p>
            <p className="text-muted">
              Technical checks include the HTML response, accurate structured data and access rules for the relevant search and user-requested bots. Training crawlers have a different role. These checks help diagnose the website; they do not establish whether an assistant recommends it. The{' '}
              <Link href="/voice" className="text-brand-gold font-medium hover:underline">
                AI visibility scanner
              </Link>{' '}
              provides a starting point for reviewing the evidence it can retrieve. Its report does not replace provider-specific access checks.
            </p>
          </div>
        </div>
      </section>

      {/* Website evidence checks */}
      <section className="bg-brand-navy/[0.03] py-12 border-b border-brand-navy/10">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-brand-navy text-2xl md:text-3xl font-bold mb-6">
              Three Website Checks Worth Making
            </h2>
            <p className="text-muted mb-8">
              We inspect the actual site for access and content problems. These are three useful areas to check before drawing conclusions from an absent AI citation.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 rounded-xl bg-white border border-brand-navy/10">
                <div className="flex-shrink-0 icon-box-sm bg-brand-gold/10 mb-4">
                  <Code2 className="w-5 h-5 text-brand-gold" />
                </div>
                <h3 className="text-brand-navy font-bold mb-2">Client-Side Rendering</h3>
                <p className="text-light text-sm">
                  Some sites load their main content after the initial page response. Some retrieval tools may miss content that only appears after scripts run. We check the delivered HTML and provider access separately.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-brand-navy/10">
                <div className="flex-shrink-0 icon-box-sm bg-brand-gold/10 mb-4">
                  <Search className="w-5 h-5 text-brand-gold" />
                </div>
                <h3 className="text-brand-navy font-bold mb-2">Missing Schema Markup</h3>
                <p className="text-light text-sm">
                  Schema markup is the structured data that tells AI systems what
                  your business does, where you operate, and what services you offer.
                  Schema needs to match the business facts and the visible page.
                  Markup should support clear visible content; it cannot guarantee how an assistant interprets the page.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-brand-navy/10">
                <div className="flex-shrink-0 icon-box-sm bg-brand-gold/10 mb-4">
                  <Bot className="w-5 h-5 text-brand-gold" />
                </div>
                <h3 className="text-brand-navy font-bold mb-2">Blocked AI Crawlers</h3>
                <p className="text-light text-sm">
                  Check robots.txt and access controls for the relevant bot. OpenAI and Anthropic distinguish search, training and user-requested fetches. An absent explicit Allow rule alone does not prove a crawler is blocked.
                </p>
              </div>
            </div>

            <p className="text-muted text-center">
              The good news: all three problems are fixable. The{' '}
              <Link href="/voice" className="text-brand-gold font-medium hover:underline">
                AI visibility scanner
              </Link>{' '}
              can highlight retrieved issues for review. Failed requests and checks without data remain limits of the report.
            </p>
          </div>
        </div>
      </section>

      {/* AI visibility scanner */}
      <section className="bg-white py-12 border-b border-brand-navy/10">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-brand-navy text-2xl md:text-3xl font-bold mb-6">
              The AI visibility scanner
            </h2>
            <p className="text-muted mb-4">
              The earlier scanner was built by{' '}
              <Link href="/us/services" className="text-brand-gold font-medium hover:underline">
                ScopeSite Digital Studios
              </Link>{' '}
              to inspect technical website evidence. CAFMO is the replacement product in development; the public scanner still uses the earlier V.O.I.C.E. interface.
            </p>
            <p className="text-muted mb-6">
              A useful report distinguishes the website content it retrieved, the structured data it found, external metrics and generated advice. Failed requests and missing provider data should remain explicit. Actual assistant citations need separate observations.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                { icon: Code2, label: 'Structured data found on the page' },
                { icon: BarChart3, label: 'Core Web Vitals performance' },
                { icon: Bot, label: 'Crawler access findings returned by the scan' },
                { icon: ShieldCheck, label: 'External authority data, where returned' },
                { icon: Search, label: 'Content structure and heading hierarchy' },
                { icon: BarChart3, label: 'Consistent business facts' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-brand-navy/[0.03]">
                  <item.icon className="w-5 h-5 text-brand-gold flex-shrink-0" />
                  <span className="text-brand-navy text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/voice"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl
                  bg-brand-gold font-bold text-xl
                  shadow-[0_0_40px_rgba(236,182,21,0.5)]
                  hover:shadow-[0_0_60px_rgba(236,182,21,0.7)]
                  hover:scale-105 transition-all duration-300"
                style={{ color: '#0A1B36' }}
              >
                <Rocket className="w-6 h-6" />
                See the current scanner
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-light text-sm mt-4">
                See the current scanner for its access and credit arrangements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Happens After Your Scan */}
      <section className="bg-brand-navy/[0.03] py-12 border-b border-brand-navy/10">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-brand-navy text-2xl md:text-3xl font-bold mb-6">
              What Happens After Your Scan?
            </h2>
            <p className="text-muted mb-8">
              Your report gives you a clear picture. What you do next depends on
              your team, your budget, and how quickly you want to move.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 rounded-xl bg-white border border-brand-navy/10">
                <div className="text-brand-gold font-bold text-xs uppercase tracking-wider mb-3">
                  Path 1
                </div>
                <h3 className="text-brand-navy font-bold text-lg mb-2">
                  Fix It Yourself
                </h3>
                <p className="text-light text-sm mb-3">
                  Use the findings returned in your report to build a repair list with
                  your developer. Check each recommendation against the live site,
                  and investigate failed requests before treating missing data as a fault.
                </p>
                <p className="text-brand-navy font-bold text-sm">Your team implements the repairs</p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-brand-navy/10 ring-2 ring-brand-gold/30">
                <div className="text-brand-gold font-bold text-xs uppercase tracking-wider mb-3">
                  Path 2
                </div>
                <h3 className="text-brand-navy font-bold text-lg mb-2">
                  AI Visibility Audit
                </h3>
                <p className="text-light text-sm mb-3">
                  A detailed manual audit by our team. We review your scan results,
                  analyze your competitors, and deliver a step-by-step implementation
                  plan tailored to your platform and market. Includes a 30-minute
                  walkthrough call.
                </p>
                <p className="text-brand-navy font-bold text-sm">
                  Starting at $2,500
                </p>
                <Link
                  href="/us/pricing"
                  className="text-brand-gold text-sm font-medium hover:underline inline-flex items-center gap-1 mt-2"
                >
                  View pricing <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-6 rounded-xl bg-white border border-brand-navy/10">
                <div className="text-brand-gold font-bold text-xs uppercase tracking-wider mb-3">
                  Path 3
                </div>
                <h3 className="text-brand-navy font-bold text-lg mb-2">
                  Full AI-First Build
                </h3>
                <p className="text-light text-sm mb-3">
                  We rebuild or build your website from scratch using server-side
                  rendering, full schema markup, and the AI visibility methodology. Your
                  site ships ready for both Google and AI platforms from day one.
                </p>
                <p className="text-brand-navy font-bold text-sm">Custom quote</p>
                <Link
                  href="/us/services"
                  className="text-brand-gold text-sm font-medium hover:underline inline-flex items-center gap-1 mt-2"
                >
                  View services <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <p className="text-muted text-center">
              Start with the question you need answered. A technical report can inform the next repair, while a conversation establishes the work and scope.
            </p>
          </div>
        </div>
      </section>

      {/* Proof Point */}
      <section className="bg-white py-12 border-b border-brand-navy/10">
        <div className="container-content">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-brand-navy text-2xl font-bold mb-4">
              Read the Published Case Study
            </h2>
            <p className="text-muted max-w-3xl mx-auto mb-6">
              Our published H4TLT case study describes the work with Hear 4 The Long Term, a workplace hearing surveillance business. Read the scope and reported results in that case study; a scanner score alone does not establish those outcomes.
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

      {/* FAQ Section */}
      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">
              Frequently Asked Questions
            </h2>
            <p className="text-white-muted max-w-2xl mx-auto">
              Common questions about the AI visibility scanner and AI visibility
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
      <section className="bg-brand-navy relative overflow-hidden py-section">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/20 rounded-full blur-[150px] animate-pulse" />

        <div className="container-content relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">
              Find Out Where You Stand
            </h2>
            <p className="text-white/70 mb-10 max-w-2xl mx-auto">
              Read the current scanner and CAFMO status, then choose the website or answer checks that fit your question.
            </p>

            <div className="relative inline-block">
              <div className="absolute inset-0 bg-brand-gold/40 rounded-2xl blur-xl animate-pulse" />
              <Link
                href="/voice"
                className="relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl
                  bg-brand-gold font-bold text-xl
                  shadow-[0_0_40px_rgba(236,182,21,0.5)]
                  hover:shadow-[0_0_60px_rgba(236,182,21,0.7)]
                  hover:scale-105 transition-all duration-300"
                style={{ color: '#0A1B36' }}
              >
                <Rocket className="w-6 h-6" />
                See the current scanner
                <ExternalLink className="w-5 h-5" />
              </Link>
            </div>

            <p className="text-white/50 text-sm mt-6">
              Existing scanner access is separate from future CAFMO subscription plans.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link
                href="/us/pricing"
                className="text-white/70 hover:text-white font-medium inline-flex items-center gap-1 transition-colors"
              >
                View US pricing <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/us/services"
                className="text-white/70 hover:text-white font-medium inline-flex items-center gap-1 transition-colors"
              >
                View services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
