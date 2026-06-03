'use client';

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

const faqItems = [
  {
    question: 'What does the AI visibility scan actually check?',
    answer:
      'The scanner checks five areas: schema markup quality and coverage, Core Web Vitals performance, AI crawler access (whether your robots.txt blocks bots like GPTBot and ClaudeBot), domain authority via the Moz API, and content structure for AI readability. You get an overall AI visibility score plus prioritized recommendations ranked by impact.',
  },
  {
    question: 'Is the scan really free?',
    answer:
      'Yes. You get one free Pro-level scan per email address. No credit card required, no trial period, no upsell wall. Enter your URL, enter your email, and get your full report.',
  },
  {
    question: 'What is Answer Engine Optimization?',
    answer:
      'Answer Engine Optimization (AEO) is the practice of structuring your website so AI platforms like ChatGPT, Perplexity, Google AI Overviews, and Claude can read, understand, and cite your content. It is different from traditional SEO. SEO gets you ranked in search results. AEO gets you recommended in AI-generated answers. In 2026, businesses need both.',
  },
  {
    question: 'Can the AI visibility scanner check any website?',
    answer:
      'Yes. The scanner works on any publicly accessible URL. It does not matter what platform your site is built on. WordPress, Shopify, Squarespace, Wix, custom code, or anything else. If the page loads in a browser, the scanner can analyze it.',
  },
  {
    question: 'My site scores well on Google PageSpeed. Why would I need this?',
    answer:
      'PageSpeed Insights measures loading performance, layout stability, and interactivity. Those are important, but they do not tell you whether AI systems can actually read and recommend your business. The AI visibility scanner measures AI readability: schema markup, crawler access, content structure, and entity recognition. A fast site that AI cannot parse is still invisible to ChatGPT and Claude. They are different problems that need different tools.',
  },
];

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
              <span className="text-brand-gold">Check for Free.</span>
            </h1>
            <p className="text-body-lg text-white/80 mb-6 max-w-3xl mx-auto">
              94% of B2B buyers already use AI tools during their research process.
              Over half of US adults have used ChatGPT at least once. When someone
              asks an AI assistant &quot;who&apos;s the best {'{'}service{'}'} in{' '}
              {'{'}city{'}'}?&quot;, your business is either in the answer or it is
              not. There is no page two.
            </p>
            <p className="text-body text-white/60 mb-10 max-w-3xl mx-auto">
              The AI visibility scanner tells you exactly where you stand. Run a free
              scan, see your AI visibility score, and find out what is stopping AI
              platforms from recommending your business.
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
              Run Your Free AI Scan
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
              AI visibility is whether AI platforms can find, read, and recommend
              your business. When a potential customer asks ChatGPT for a
              recommendation, the AI does not browse the internet the way a person
              does. It pulls from structured data, entity relationships, and content
              it has already processed. If your website does not present information
              in a format AI systems understand, you will not appear in those
              answers, regardless of how good your service is.
            </p>
            <p className="text-muted mb-4">
              Traditional SEO is built around Google&apos;s ranking algorithm:
              keywords, backlinks, page speed. That still matters, and it is not
              going away. But AI visibility is a separate problem. A website can rank
              on the first page of Google and still be completely invisible to
              ChatGPT, Claude, and Perplexity. The reverse is also true. The
              businesses winning in 2026 are the ones doing both.
            </p>
            <p className="text-muted">
              AI visibility depends on three things: structured data (schema markup
              in JSON-LD), crawler access (whether your robots.txt allows AI bots
              like GPTBot and ClaudeBot), and content architecture (how your
              information is organized for machine reading). The{' '}
              <Link href="/voice" className="text-brand-gold font-medium hover:underline">
                AI visibility scanner
              </Link>{' '}
              checks all three.
            </p>
          </div>
        </div>
      </section>

      {/* Why Most US Websites Fail */}
      <section className="bg-brand-navy/[0.03] py-12 border-b border-brand-navy/10">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-brand-navy text-2xl md:text-3xl font-bold mb-6">
              Why Most US Websites Fail the AI Test
            </h2>
            <p className="text-muted mb-8">
              We have scanned thousands of websites across the US and UK. The
              pattern is consistent. Most businesses fail AI visibility for
              three specific, fixable reasons.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 rounded-xl bg-white border border-brand-navy/10">
                <div className="flex-shrink-0 icon-box-sm bg-brand-gold/10 mb-4">
                  <Code2 className="w-5 h-5 text-brand-gold" />
                </div>
                <h3 className="text-brand-navy font-bold mb-2">Client-Side Rendering</h3>
                <p className="text-light text-sm">
                  Most modern websites load content with JavaScript after the page
                  arrives. AI crawlers do not execute JavaScript. They see a blank
                  page. If your site is built on React, Angular, or Vue without
                  server-side rendering, AI bots get nothing to index.
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
                  Research shows 99.7% of websites lack proper schema implementation.
                  Without it, AI has to guess what your page is about.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-brand-navy/10">
                <div className="flex-shrink-0 icon-box-sm bg-brand-gold/10 mb-4">
                  <Bot className="w-5 h-5 text-brand-gold" />
                </div>
                <h3 className="text-brand-navy font-bold mb-2">Blocked AI Crawlers</h3>
                <p className="text-light text-sm">
                  Many hosting platforms and CMS default configurations block AI
                  crawlers in robots.txt. GPTBot, ClaudeBot, and PerplexityBot are
                  separate from Googlebot. If you have not explicitly allowed them,
                  they may not be able to access your content at all.
                </p>
              </div>
            </div>

            <p className="text-muted text-center">
              The good news: all three problems are fixable. The{' '}
              <Link href="/voice" className="text-brand-gold font-medium hover:underline">
                AI visibility scanner
              </Link>{' '}
              identifies exactly which issues affect your site and tells you how to
              fix them.
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
              This free tool is built by{' '}
              <Link href="/us/services" className="text-brand-gold font-medium hover:underline">
                ScopeSite Digital Studios
              </Link>{' '}
              to measure how well AI systems can read and recommend your website.
              Enter any URL and get a full report in under two minutes.
            </p>
            <p className="text-muted mb-6">
              The scanner checks schema markup implementation across 30+ schema
              types, Core Web Vitals performance, AI crawler access permissions,
              domain authority and spam score via the Moz API, content structure and
              heading hierarchy, and entity recognition patterns. You get a single
              overall score plus a breakdown by category, with each issue ranked by
              priority.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                { icon: Code2, label: 'Schema markup across 30+ types' },
                { icon: BarChart3, label: 'Core Web Vitals performance' },
                { icon: Bot, label: 'AI crawler access (GPTBot, ClaudeBot, PerplexityBot)' },
                { icon: ShieldCheck, label: 'Domain authority and spam score via Moz' },
                { icon: Search, label: 'Content structure and heading hierarchy' },
                { icon: BarChart3, label: 'Entity recognition patterns' },
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
                Scan Your Website Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-light text-sm mt-4">
                Takes 2 minutes. No credit card. One free Pro scan per email.
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
                  Your scan report includes prioritized recommendations. If you have
                  a developer on staff, hand them the report and let them work through
                  the list. The scanner tells you exactly what to fix and why each
                  item matters.
                </p>
                <p className="text-brand-navy font-bold text-sm">Cost: Free</p>
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
              Not sure which path fits? Start with the free scan. The results will
              make the decision obvious.
            </p>
          </div>
        </div>
      </section>

      {/* Proof Point */}
      <section className="bg-white py-12 border-b border-brand-navy/10">
        <div className="container-content">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-brand-navy text-2xl font-bold mb-4">
              It Works. Here Is the Proof.
            </h2>
            <p className="text-muted max-w-3xl mx-auto mb-6">
              ScopeSite used the AI visibility methodology to make H4TLT (Hearing 4
              The Long Term) the first UK hearing compliance business recommended by
              all four major AI platforms: ChatGPT, Claude, Perplexity, and Gemini.
              That result came from the same process the scanner measures.
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
              Your competitors are already showing up in AI-generated answers. The
              question is whether your business is there too. Run the free scan and
              find out in two minutes.
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
                Run Your Free AI Scan
                <ExternalLink className="w-5 h-5" />
              </Link>
            </div>

            <p className="text-white/50 text-sm mt-6">
              No credit card required. One free Pro-level scan per email.
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
