'use client';

import Link from 'next/link';
import { ArrowRight, Globe, Clock, Zap, Users, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { JsonLd } from '@/components/JsonLd';
import { generateFAQSchema } from '@/lib/schema';
import { faqItems as faqs } from './faqs';

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
      <JsonLd schema={generateFAQSchema(faqs, { id: 'https://scopesite.co.uk/us/#webpage', inLanguage: 'en-US' })} />
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
              Custom websites with readable content, clear business facts and checks for search and AI access.
            </p>

            <div className="text-body-lg text-white/70 mb-10 max-w-3xl mx-auto">
              <p>
                We are a UK-based web design agency building custom Next.js websites, with core content delivered in HTML, structured business facts and crawler access checks. We check those foundations separately from whether an assistant actually mentions or cites a business. US projects use USD pricing and a remote workflow with clear written updates.
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
              Distance is a reasonable thing to question when hiring an agency. So are the build, the evidence behind its claims and who handles the work after launch. Those are useful things to compare, whichever side of the Atlantic the agency sits on.
            </p>
            <p className="text-brand-navy/80 mb-6">
              Our work combines custom Next.js development, readable page content, structured business facts and crawler configuration. You can inspect those deliverables. A badge saying &quot;AI-ready&quot; gives you rather less to go on.
            </p>
            <p className="text-brand-navy/80 mb-6">
              AI visibility work covers several different questions: can a service access the page, can it extract useful information, and does a live answer actually mention or cite the business? ChatGPT, Claude, Perplexity and Google use different tools and retrieval paths. Search crawlers and browser agents also behave differently, so one provider&apos;s guidance cannot settle every check.
            </p>
            <p className="text-brand-navy/80">
              Readable content and accurate business information matter in both Austin and Frome. The market, location, question and provider still affect what needs testing. We apply the technical checks to your site, then assess answer evidence in the context of the people you want to serve.
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
              Our Next.js builds deliver core page content in the initial HTML, reducing reliance on a visitor or crawler running JavaScript to obtain it. Rendering support varies between search crawlers, fetch tools and browser agents. We inspect the initial response and the rendered page, then check the access controls relevant to each provider.
            </p>
            <p className="text-white/80 mb-6">
              We use JSON-LD structured data to describe supported facts about the business, its services and the areas it serves. Those facts must agree with the visible page. Valid markup helps make the information explicit; it does not guarantee indexing, citation or a recommendation from an assistant.
            </p>
            <p className="text-white/80 mb-6">
              Our <Link href="/voice" className="text-brand-gold hover:text-brand-orange transition-colors underline underline-offset-2">AI visibility methodology</Link> connects content access, factual consistency, entity relationships and crawler checks. Observed answers and citations are assessed separately, with the question and provider recorded so the result has some context.
            </p>
            <p className="text-white/80">
              Our published <Link href="/case-studies/h4tlt" className="text-brand-gold hover:text-brand-orange transition-colors underline underline-offset-2">H4TLT case study</Link> documents our work with a workplace hearing surveillance provider. Read it for the evidence and context behind the project.
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
                  We work from the UK on GMT/BST. Written updates keep the project moving between calls, which we arrange at mutually suitable times for your US location.
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
              The work suits businesses looking for a custom site they can maintain and improve over time. Search results, AI answers and direct visits are different ways people may find you, and the website needs to serve the people who arrive as well as the systems that discover it.
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
              Start with evidence from your own website: what arrives in the HTML, which pages are accessible and whether the business facts agree. Those checks give us a concrete basis for improvements. Actual mentions and citations need their own assessment.
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
