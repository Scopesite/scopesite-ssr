'use client';

import Link from 'next/link';
import { ArrowRight, Globe, Clock, Zap, Users, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  { question: "Why should I hire a UK web agency instead of a US one?", answer: "Because AI visibility is a global challenge and the technology doesn\u2019t change based on geography. ScopeSite specializes in server-side rendered websites with full schema markup and AI optimization, a combination most US agencies aren\u2019t offering yet. You get a specialist, not a generalist who\u2019s bolted \u2018AI\u2019 onto their existing services." },
  { question: "What time zone do you work in?", answer: "ScopeSite is based in the UK (GMT/BST). That gives us 5-8 hours of overlap with US East Coast business hours and full overlap with US West Coast mornings. All communication is async-friendly, and we schedule calls at times that work for both sides." },
  { question: "Do you accept payment in USD?", answer: "Yes. All US pricing is in USD. We invoice in dollars and accept payment via bank transfer or card." },
  { question: "Can I see the AI visibility scanner before committing to anything?", answer: "Absolutely. Run a free scan at scopesite.co.uk/voice on any URL. No signup required. You\u2019ll get an instant AI visibility report showing where your site stands." },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-brand-navy/10 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
        aria-expanded={open}
      >
        <span className="text-lg font-black text-brand-navy pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-brand-gold flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pb-5 text-brand-navy/80 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function USPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy text-white py-section min-h-[85vh] flex items-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] animate-grid-flow"
          style={{
            backgroundImage: `linear-gradient(rgba(236,182,21,0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(236,182,21,0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-brand-gold/10 rounded-full blur-[150px] animate-glow-pulse" />

        <div className="container-content relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 bg-brand-gold/10 border border-brand-gold/30 rounded-full px-5 py-2 mb-8">
              <Globe className="w-4 h-4 text-brand-gold" />
              <span className="text-brand-gold font-medium text-sm">Now Serving US Businesses</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-headline text-white mb-4">
              <span className="text-brand-gold block mb-2">AI-FIRST WEB DESIGN FOR US BUSINESSES.</span>
              <span className="block">BUILT IN BRITAIN. OPTIMIZED FOR AI.</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 font-medium mb-6">
              Server-side rendered websites that AI platforms can actually read, understand, and recommend to their users.
            </p>

            <div className="text-body-lg text-white/70 mb-10 max-w-3xl mx-auto">
              <p>
                We are a UK-based web design agency that builds websites specifically for AI visibility. Not templates. Not WordPress. Custom-built, server-rendered sites with the kind of structured data and schema markup that makes ChatGPT, Perplexity, and Claude pay attention. We now serve businesses across the United States with USD pricing and a remote-first workflow that makes the Atlantic feel like a hallway.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/us/quote" className="btn-primary inline-flex items-center gap-2 group">
                Get Instant Quote
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/us/pricing" className="btn-secondary">
                See US Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why a UK Agency? */}
      <section className="section-white">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-brand-navy mb-8 text-center">WHY A UK AGENCY?</h2>
            <div className="divider-gold mx-auto mb-10" />

            <p className="text-brand-navy/80 mb-6">
              It&apos;s a fair question. You&apos;ve got thousands of web agencies in the US, so why hire one from across the pond? The honest answer: because almost none of them are doing what we do.
            </p>
            <p className="text-brand-navy/80 mb-6">
              The vast majority of US web agencies are still building websites the old way. WordPress themes, page builders, maybe some basic SEO sprinkled on top. They&apos;ll tell you they&apos;re &quot;AI-ready&quot; because they added a chatbot to the homepage. That&apos;s not AI visibility. That&apos;s a widget.
            </p>
            <p className="text-brand-navy/80 mb-6">
              AI visibility means your website is built so that AI platforms, including ChatGPT, Perplexity, Claude, Google&apos;s AI Overviews, and voice assistants like Siri and Alexa, can read your content, understand what your business does, and recommend you when someone asks a relevant question. That requires server-side rendering, structured schema markup, entity relationships, and proper crawler configuration. It&apos;s a different discipline entirely from traditional web design.
            </p>
            <p className="text-brand-navy/80">
              We&apos;ve been building this way from day one. It&apos;s not something we bolted onto an existing service. Our AI visibility methodology was designed for this exact problem. And because the technology behind AI crawlers and structured data is universal, it works the same whether your business is in Austin, Texas or Frome, Somerset.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do Differently */}
      <section className="section-navy">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-white mb-8 text-center">WHAT WE DO DIFFERENTLY</h2>
            <div className="divider-gold mx-auto mb-10" />

            <p className="text-white/80 mb-6">
              Every website we build is server-side rendered using Next.js. That means the full HTML content is delivered to the browser (and to AI crawlers) on the first request. Most websites built with React, Angular, or modern JavaScript frameworks are client-side rendered, which means the browser has to download and execute JavaScript before any content appears. AI crawlers don&apos;t wait for that. They see a blank page and move on.
            </p>
            <p className="text-white/80 mb-6">
              On top of server-side rendering, we implement structured data using JSON-LD schema markup. This is the language AI platforms use to understand what your business is, what services you offer, where you operate, and what your customers say about you. Without it, AI is guessing. With it, AI knows.
            </p>
            <p className="text-white/80 mb-6">
              Our <Link href="/voice" className="text-brand-gold hover:text-brand-orange transition-colors underline underline-offset-2">AI visibility methodology</Link> is the framework that ties this together. It covers five layers of optimization: making your site visible to AI crawlers, optimizing the content structure for extraction, building intelligent entity relationships, configuring crawler access, and engineering the content itself for answer-engine compatibility.
            </p>
            <p className="text-white/80">
              The results speak for themselves. Our client <Link href="/case-studies/h4tlt" className="text-brand-gold hover:text-brand-orange transition-colors underline underline-offset-2">H4TLT</Link>, a UK-based training provider, went from zero AI visibility to being actively recommended by ChatGPT within six weeks of launch. The same approach works for US businesses because the underlying technology is global.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-white">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-brand-navy mb-8 text-center">HOW IT WORKS</h2>
            <div className="divider-gold mx-auto mb-10" />

            <div className="grid md:grid-cols-3 gap-8 mb-10">
              <div className="card-hover text-center p-8">
                <div className="icon-box-lg mx-auto mb-4">
                  <Clock className="w-7 h-7 text-brand-gold" />
                </div>
                <h3 className="text-lg mb-3">Time Zone Friendly</h3>
                <p className="text-brand-navy/70 text-sm">
                  We&apos;re 5-8 hours ahead of the US. That means when you finish your workday, we&apos;ve already been working on your project for half a day. You wake up to progress, not silence.
                </p>
              </div>
              <div className="card-hover text-center p-8">
                <div className="icon-box-lg mx-auto mb-4">
                  <Zap className="w-7 h-7 text-brand-gold" />
                </div>
                <h3 className="text-lg mb-3">Async-First Process</h3>
                <p className="text-brand-navy/70 text-sm">
                  We don&apos;t need daily standups or endless Zoom calls. We communicate through documented briefs, recorded walkthroughs, and clear written updates. When a call is useful, we schedule one that fits both time zones.
                </p>
              </div>
              <div className="card-hover text-center p-8">
                <div className="icon-box-lg mx-auto mb-4">
                  <Globe className="w-7 h-7 text-brand-gold" />
                </div>
                <h3 className="text-lg mb-3">Discovery Call</h3>
                <p className="text-brand-navy/70 text-sm">
                  Every project starts with a 30-minute video call. We learn about your business, your market, and your goals. Then we deliver a written proposal with fixed USD pricing. No hourly billing surprises.
                </p>
              </div>
            </div>

            <p className="text-brand-navy/80 mb-6">
              We&apos;ve worked remotely with clients across the world since day one. The process is designed around async communication, clear documentation, and predictable timelines. Most projects take four to six weeks from kickoff to launch. You&apos;ll have a dedicated point of contact throughout, and every deliverable is documented so nothing gets lost in translation.
            </p>
            <p className="text-brand-navy/80">
              Payment is straightforward. We quote in USD, invoice in USD, and accept payment via bank transfer or card. 50% upfront, 50% on completion. For larger projects, we offer monthly payment plans.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Work With */}
      <section className="section-navy">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-white mb-8 text-center">WHO WE WORK WITH</h2>
            <div className="divider-gold mx-auto mb-10" />

            <div className="flex items-start gap-4 mb-6">
              <Users className="w-6 h-6 text-brand-gold flex-shrink-0 mt-1" />
              <p className="text-white/80">
                Our US clients are typically small to mid-sized businesses that rely on being found online. Service businesses, professional firms, e-commerce brands, SaaS companies, consultancies, and specialist providers. If people search for what you do and you want AI platforms to recommend you, we&apos;re a good fit.
              </p>
            </div>
            <p className="text-white/80 mb-6">
              We&apos;re not the right agency for everyone. If you want a cheap template site or a quick WordPress build, there are faster and cheaper options out there. We&apos;re the right choice if you care about long-term visibility, especially as AI-powered search continues to replace traditional Google results. Our clients tend to think in years, not weeks.
            </p>
            <p className="text-white/80 mb-6">
              We also work well with US marketing agencies and SEO firms that need a technical partner for builds. If you&apos;re an agency looking for a white-label web development team that understands AI optimization at a technical level, we should talk. You handle the client relationship and strategy. We handle the build, the schema, and the AI visibility layer.
            </p>
            <p className="text-white/80">
              Browse our <Link href="/us/services" className="text-brand-gold hover:text-brand-orange transition-colors underline underline-offset-2">full list of US services</Link> to see exactly what we offer, or jump straight to <Link href="/us/pricing" className="text-brand-gold hover:text-brand-orange transition-colors underline underline-offset-2">US pricing</Link> for package details in USD.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-white">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-brand-navy mb-8 text-center">FREQUENTLY ASKED QUESTIONS</h2>
            <div className="divider-gold mx-auto mb-10" />

            <div className="bg-white rounded-xl border border-brand-navy/10 p-6 md:p-8 shadow-card">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-navy">
        <div className="container-content">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-white mb-6">READY TO BE VISIBLE TO AI?</h2>
            <div className="divider-gold mx-auto mb-8" />

            <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
              Every day your website sits without structured data and server-side rendering, AI platforms are recommending your competitors instead. The technology exists right now to fix that. We know how to build it.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/us/pricing" className="btn-primary inline-flex items-center gap-2 group">
                See US Pricing
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/us/ai-visibility" className="btn-secondary">
                Check Your AI Visibility
              </Link>
            </div>

            <p className="text-white/50 text-sm">
              No obligation. Transparent pricing. Veteran-owned.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
