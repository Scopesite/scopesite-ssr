'use client';

import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqItems = [
  {
    question: 'What is server-side rendering and why does it matter for AI?',
    answer:
      'Server-side rendering (SSR) generates your page content on the server before sending it to the browser. Client-side rendering (CSR), used by most React apps and WordPress page builders, depends on JavaScript to build the page after it loads. AI crawlers from ChatGPT, Perplexity, and Claude do not execute JavaScript. If your site relies on CSR, those crawlers see a blank page. SSR ensures your content is readable by every AI system from the moment it arrives.',
  },
  {
    question: 'Do you work with e-commerce sites?',
    answer:
      'Yes. We build custom e-commerce sites with Product, Offer, and Review schema markup so AI platforms can read your catalog, understand pricing, and surface your products in recommendations. E-commerce projects typically fall at the higher end of our Tier 2 pricing.',
  },
  {
    question: 'What CMS do you use?',
    answer:
      'We use headless CMS platforms like Ghost and Sanity, connected to a Next.js front end. This separates your content management from your presentation layer, giving you an easy editing experience while keeping your site fast, secure, and fully optimized for AI visibility.',
  },
  {
    question: 'How long does a typical project take?',
    answer:
      'A standard website build takes 6 to 8 weeks from kickoff to launch. Complex projects with custom functionality or large content migrations typically take 8 to 12 weeks. Our AI Visibility Audit is delivered within 5 business days.',
  },
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
        <ChevronDown
          className={`w-5 h-5 text-brand-gold flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="pb-5 text-brand-navy/80 leading-relaxed">{answer}</div>
      )}
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
              Server-side rendered websites that AI platforms can read, understand, and recommend.
            </p>

            <p className="text-white/70 mb-10 max-w-2xl mx-auto">
              Every site we build includes structured schema markup, AI visibility tuning, and the
              technical foundation that gets American businesses found by ChatGPT, Perplexity, Claude,
              and Google AI Overviews. Built in Britain. Priced in dollars.
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
              Most websites are invisible to AI. WordPress and client-side rendered frameworks depend
              on JavaScript to display content, and AI crawlers from ChatGPT, Perplexity, and Claude
              do not execute JavaScript. When their bots visit a typical React single-page app or a
              WordPress page-builder site, they see an empty shell. Your content exists, but AI
              cannot read it.
            </p>
            <p className="text-brand-navy/80 mb-6">
              We build every site using Next.js with server-side rendering (SSR). Your content is
              fully rendered as HTML before it reaches the browser or any crawler. AI systems get
              the complete page on the first request, not a blank template waiting for scripts to
              load. This is the same technology used by Nike, Netflix, and TikTok, applied to
              businesses that need to be found by AI.
            </p>
            <p className="text-brand-navy/80 mb-6">
              This is not a minor technical detail. It is the difference between being visible to AI
              and being completely ignored. Our{' '}
              <Link
                href="/case-studies/h4tlt"
                className="text-brand-gold-accessible hover:text-brand-orange-accessible transition-colors underline underline-offset-2"
              >
                case study with H4TLT
              </Link>
              , a UK-based training provider, demonstrated a direct path from zero AI presence to
              active ChatGPT recommendations within six weeks of launching a server-rendered site
              with proper schema markup. The same approach works for US businesses because the
              underlying technology is global.
            </p>
            <p className="text-brand-navy/80">
              Every build ships with sub-2-second load times, 90+ Lighthouse scores across all
              categories, mobile-first responsive design, and enterprise-grade security. No
              WordPress plugins. No template themes. No monthly maintenance fees to keep the
              lights on.
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
              is the language AI platforms use to understand your business. It tells ChatGPT what
              services you offer, where you operate, what your customers think of you, and how your
              content relates to the broader web. Without it, AI guesses about your business based on
              unstructured text. With it, AI knows.
            </p>
            <p className="text-white/80 mb-6">
              99.7% of websites either lack schema markup entirely or implement it incorrectly. That
              is a competitive gap you can step through right now. We implement Organization, Service,
              Product, FAQ, Review, and LocalBusiness schema types as JSON-LD, validated against
              Google&apos;s Rich Results requirements and tested against AI extraction tools.
            </p>
            <p className="text-white/80 mb-6">
              Our{' '}
              <Link
                href="/voice"
                className="text-brand-gold hover:text-brand-orange transition-colors underline underline-offset-2"
              >
                AI visibility methodology
              </Link>{' '}
              (Visibility, Optimization, for Intelligent, Conversational, Engines) is the framework that
              ties it all together. It covers five layers: making your site visible to AI crawlers,
              optimizing content structure for extraction, defining entity relationships that AI can
              map, configuring crawler access via robots.txt and llms.txt, and engineering content
              for answer-engine compatibility.
            </p>
            <p className="text-white/80">
              Every project starts with a full AI visibility audit using our AI visibility scanner. You
              can{' '}
              <Link
                href="/us/ai-visibility"
                className="text-brand-gold hover:text-brand-orange transition-colors underline underline-offset-2"
              >
                run a free scan right now
              </Link>{' '}
              to see where your site stands before committing to anything.
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
              Traditional SEO gets you ranked in search results. Answer Engine Optimization gets you
              recommended in AI-generated answers. They are different disciplines with different
              requirements, and most businesses are only doing one of them.
            </p>
            <p className="text-brand-navy/80 mb-6">
              When someone asks ChatGPT, Perplexity, Claude, or Google AI Overviews a question about
              your industry, the AI pulls from websites it can read and trust. It prioritizes
              structured content with clear entity definitions, proper schema markup, and technical
              signals that indicate authority. A site with strong AEO is cited as a source. A site
              without it is skipped entirely.
            </p>
            <p className="text-brand-navy/80 mb-6">
              We structure every page so AI systems can extract clean answers. Headers follow a
              logical hierarchy. Content addresses specific questions with direct, factual responses.
              Schema markup connects your services, locations, reviews, and credentials into a
              knowledge graph that AI can parse without ambiguity.
            </p>
            <p className="text-brand-navy/80">
              AEO is not a replacement for SEO. It is an additional layer that most businesses have
              not built yet. The businesses that invest in it first will own the AI recommendation
              space in their market for years. That advantage compounds over time as AI platforms
              learn to trust and cite your content more frequently.
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
              Every day your website sits without structured data and server-side rendering, AI
              platforms are recommending your competitors instead. The technology exists right now
              to fix that. We know how to build it.
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
