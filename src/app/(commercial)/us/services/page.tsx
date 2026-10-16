'use client';

import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { faqItems } from './faqs';

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
        <ChevronDown
          className={`w-5 h-5 text-brand-gold flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div hidden={!open} className="pb-5 text-brand-navy/80 leading-relaxed">{answer}</div>
    </div>
  );
}

export default function USServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-navy">
        <div className="container-content">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-headline text-white mb-6">
              <span className="text-brand-gold block mb-2">WEB DESIGN AND AI VISIBILITY</span>
              <span className="block">SERVICES FOR US BUSINESSES</span>
            </h1>

            <p className="text-xl text-white/90 font-medium mb-6">
              Websites with readable HTML, accurate business facts and checks for AI search access.
            </p>

            <p className="text-white/70 mb-10 max-w-2xl mx-auto">
              Every site we build includes structured schema markup, AI visibility tuning, and the
              technical checks that support search and AI retrieval. Actual citations are assessed
              separately. Built in Britain. Priced in dollars.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/us/pricing"
                className="btn-primary inline-flex items-center gap-2 group"
              >
                See US Pricing
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/us/ai-visibility" className="btn-secondary">
                Check Your AI Visibility
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Ready Web Design */}
      <section className="section-white">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-brand-navy mb-8 text-center">AI-READY WEB DESIGN</h2>
            <div className="divider-gold mx-auto mb-10" />

            <p className="text-brand-navy/80 mb-6">
              Some pages expose their main content only after JavaScript runs. A retrieval tool that does not render those scripts may miss it. WordPress and React can both deliver useful HTML; the implementation needs checking. We inspect the response and access rules rather than assuming every AI tool behaves alike.
            </p>
            <p className="text-brand-navy/80 mb-6">
              We use Next.js to deliver useful page content in the initial HTML. That reduces dependence on client-side scripts for reading the page. We also test links, content and access controls. A readable page is a technical foundation; an assistant still decides what to retrieve and cite.
            </p>
            <p className="text-brand-navy/80 mb-6">
              Our published{' '}
              <Link
                href="/case-studies/h4tlt"
                className="text-brand-gold-accessible hover:text-brand-orange-accessible transition-colors underline underline-offset-2"
              >
                case study with H4TLT
              </Link>{' '}
              documents our work with a workplace hearing surveillance provider. Read it for the
              evidence and context behind the project.
            </p>
            <p className="text-brand-navy/80">
              We test performance, accessibility and responsive behaviour on the actual build.
              Your proposal sets out the agreed delivery targets and support arrangements.
            </p>
          </div>
        </div>
      </section>

      {/* AI Visibility Optimization */}
      <section className="section-navy">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-white mb-8 text-center">AI VISIBILITY OPTIMIZATION</h2>
            <div className="divider-gold mx-auto mb-10" />

            <p className="text-white/80 mb-6">
              <Link
                href="/schema-markup"
                className="text-brand-gold hover:text-brand-orange transition-colors underline underline-offset-2"
              >
                Schema markup
              </Link>{' '}
              describes business facts and relationships using a shared vocabulary. We keep it consistent with the visible page and link services to their real provider. Different search and AI systems decide how to use those facts; valid markup is not proof that a particular system uses it.
            </p>
            <p className="text-white/80 mb-6">
              We select schema types that match the business and the visible content, then validate the JSON-LD against Schema.org. Where relevant, we check Google-supported search features separately. Retrieval and citation checks for other providers remain separate tests.
            </p>
            <p className="text-white/80 mb-6">
              Our{' '}
              <Link
                href="/voice"
                className="text-brand-gold hover:text-brand-orange transition-colors underline underline-offset-2"
              >
                AI visibility methodology
              </Link>{' '}
              uses website evidence to identify technical repairs. We check content, structured facts
              and provider access separately, then record actual assistant answers and citations.
            </p>
            <p className="text-white/80">
              Every project starts with a full AI visibility audit using our AI visibility scanner. You
              can{' '}
              <Link
                href="/us/ai-visibility"
                className="text-brand-gold hover:text-brand-orange transition-colors underline underline-offset-2"
              >
                explore CAFMO
              </Link>{' '}
              and review its current account and credit arrangements before starting.
            </p>
          </div>
        </div>
      </section>

      {/* Answer Engine Optimization */}
      <section className="section-white">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-brand-navy mb-8 text-center">ANSWER ENGINE OPTIMIZATION (AEO)</h2>
            <div className="divider-gold mx-auto mb-10" />

            <p className="text-brand-navy/80 mb-6">
              SEO and answer-engine optimisation share work on useful content and accessible pages. We measure search visibility and AI citations separately, because success in one does not prove success in the other.
            </p>
            <p className="text-brand-navy/80 mb-6">
              An assistant may use model knowledge, search results or a direct page fetch, depending on the product and question. We check the relevant routes, record the sources it cites and distinguish those outcomes from the technical health of your site.
            </p>
            <p className="text-brand-navy/80 mb-6">
              We structure pages to make useful answers easy to find. Headers follow a
              logical hierarchy. Content addresses specific questions with direct, factual responses.
              Schema markup connects your services, locations, reviews, and credentials into a
              set of explicit relationships that can be checked against the visible content.
            </p>
            <p className="text-brand-navy/80">
              We review search visibility and AI answers over time. A technical repair can be
              verified when it is released; whether a provider retrieves or cites the page needs
              separate evidence. There is no guaranteed timetable or permanent position.
            </p>
          </div>
        </div>
      </section>

      {/* How We Work Remotely */}
      <section className="section-navy">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-white mb-8 text-center">HOW WE WORK REMOTELY</h2>
            <div className="divider-gold mx-auto mb-10" />

            <p className="text-white/80 mb-6">
              Working with a UK-based agency from the US is simpler than you might expect. We have
              been remote-first since day one, and our process is built around async communication
              and clear documentation.
            </p>
            <p className="text-white/80 mb-6">
              The time zone difference works in your favor. We are 5 to 8 hours ahead of the US,
              which means we are already working on your project before your day starts. You send
              feedback in the evening, and we deliver updates by your morning. Your project moves
              forward while you sleep.
            </p>
            <p className="text-white/80 mb-6">
              Every project begins with a 30-minute video call. We learn about your business, your
              market, and your goals. From there, we deliver a written proposal with fixed USD
              pricing. No hourly billing, no scope creep. Communication runs through Notion for
              project tracking, Figma for design collaboration, and Loom for recorded walkthroughs.
              When a live call is useful, we schedule one that fits both time zones.
            </p>
            <p className="text-white/80 mb-6">
              A standard website build takes 6 to 8 weeks from kickoff to launch. Complex projects
              with custom functionality or large content migrations take 8 to 12 weeks. Our AI
              Visibility Audit is delivered within 5 business days.
            </p>
            <p className="text-white/80">
              Payment is in USD. 50% upfront, 50% on completion. We accept ACH transfers, wire
              transfers, and all major credit cards. See our full{' '}
              <Link
                href="/us/pricing"
                className="text-brand-gold hover:text-brand-orange transition-colors underline underline-offset-2"
              >
                US pricing
              </Link>{' '}
              for package details.
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
              {faqItems.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-navy">
        <div className="container-content">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-white mb-6">READY TO BE VISIBLE TO AI?</h2>
            <div className="divider-gold mx-auto mb-8" />

            <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
              Start with the evidence your website exposes and the questions your buyers ask.
              We can identify technical problems, scope the repairs and agree how results will
              be measured.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/us/pricing"
                className="btn-primary inline-flex items-center gap-2 group"
              >
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
