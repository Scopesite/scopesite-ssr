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
  Globe,
  FileCode,
  FileText,
  MessageSquare,
  Eye,
  TrendingUp
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
    question: "What is generative engine optimization?",
    answer: "Generative engine optimization is the practice of structuring your website, schema and content so that generative AI models (ChatGPT, Claude, Gemini and Perplexity) cite your business when someone asks a question in your field. Traditional SEO targets a list of ten blue links. GEO targets the one or two sources the model actually names in its answer."
  },
  {
    question: "What is the difference between GEO and SEO?",
    answer: "SEO fights for ranking on a search engine results page. GEO fights to be a citation inside a generative AI answer. SEO cares about keywords, backlinks and click-through rate. GEO cares about structured data, entity relationships, server-rendered HTML and whether the model can extract a clean fact from your page in the first place."
  },
  {
    question: "What is the difference between GEO and AEO?",
    answer: "AEO (answer engine optimization) is about being the single extracted answer to a specific question. GEO (generative engine optimization) is broader, covering every technical and content signal that influences whether a generative model trusts and cites your brand. In practice the two overlap heavily, and most agency briefs use the terms interchangeably."
  },
  {
    question: "How do AI models decide which businesses to recommend?",
    answer: "Generative models blend training data, real-time retrieval and entity confidence scoring. If your business is an established entity in Wikidata and the Google Knowledge Graph, has deep JSON-LD schema and is reachable via server-rendered HTML, you are more likely to be cited. If your site is a JavaScript shell with no structured data, the model has nothing to work with and picks a competitor."
  },
  {
    question: "Do I need GEO if I already have SEO?",
    answer: "Yes. Strong SEO gives you clicks from Google traditional results, but it does not guarantee a single citation inside ChatGPT, Gemini, Claude or Perplexity. Those platforms rank by entity confidence and extraction quality, not keyword density. GEO adds the structured data, content architecture and crawler access that AI models specifically require."
  },
  {
    question: "Which AI platforms does generative engine optimization target?",
    answer: "ChatGPT (OpenAI), Claude (Anthropic), Perplexity, Gemini (Google) and Google AI Overviews are the five platforms that matter for US businesses in 2026. The same structured data signals also help with voice search on Siri and Alexa, so the work carries over."
  },
  {
    question: "How long does generative engine optimization take to work?",
    answer: "Perplexity typically starts citing correctly structured sources within 2 to 4 weeks. ChatGPT and Claude usually take 6 to 12 weeks as their retrieval layers pick up your new schema. Persistent citations, where the model names your business by default in a category, take 3 to 6 months depending on your starting authority."
  },
  {
    question: "How much does a generative engine optimization agency cost?",
    answer: "Our GEO retainers start at $1,000 per month, covering ongoing schema maintenance, entity work, citation tracking and monthly reporting. A full AI-first website rebuild, if your current site blocks AI crawlers, starts at $3,500 as a one-off. The quote calculator at /us/pricing gives you an exact figure."
  }
];

export default function USGenerativeEngineOptimizationPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-section min-h-[60vh] flex items-center">
        <div className="container-content">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold mb-6 leading-tight">
              Generative Engine Optimization for US Businesses.{' '}
              <span className="text-brand-gold block mt-2">Be the Cited Source.</span>
            </h1>
            <p className="text-body-lg text-white/80 mb-6 max-w-3xl mx-auto">
              Search changed. People ask ChatGPT, Claude, Gemini and Perplexity for answers, and the model picks a handful of sources to cite. Generative engine optimization is the technical discipline of being one of them.
            </p>
            <p className="text-body text-white/60 mb-6 max-w-3xl mx-auto">
              As a specialist generative engine optimization agency, we engineer the structured data, entity signals and server-rendered HTML that AI models actually read. Rankings are not citations. You do not want a blue link on page one. You want the recommendation.
            </p>
            <p className="text-body text-white/60 mb-10 max-w-3xl mx-auto">
              We also run the closely related disciplines: our <Link href="/us/services" className="text-brand-gold hover:underline">AI SEO services</Link> cover the broader stack, and our <Link href="/us/ai-visibility" className="text-brand-gold hover:underline">AI visibility</Link> scanner measures the lot.
            </p>
            <Link
              href="/us/quote"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl
                bg-brand-gold font-bold text-xl
                shadow-[0_0_40px_rgba(236,182,21,0.5)]
                hover:shadow-[0_0_60px_rgba(236,182,21,0.7)]
                hover:scale-105 transition-all duration-300"
              style={{ color: '#0A1B36' }}
            >
              <Rocket className="w-6 h-6" />
              Get an Instant Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Most US Websites Fail */}
      <section className="bg-brand-navy/[0.03] py-12 border-b border-brand-navy/10">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-brand-navy text-2xl md:text-3xl font-bold mb-6">
              Why You Are Not In The Answer
            </h2>
            <p className="text-muted mb-8">
              AI models pick a small, specific set of sources to cite. Everyone else is invisible. Here is why you are probably the everyone else.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-xl bg-white border border-brand-navy/10">
                <div className="flex-shrink-0 icon-box-sm bg-brand-gold/10 mb-4">
                  <Code2 className="w-5 h-5 text-brand-gold" />
                </div>
                <h3 className="text-brand-navy font-bold mb-2">JavaScript Walls</h3>
                <p className="text-light text-sm">
                  Your website renders client-side, so GPTBot and ClaudeBot see a blank page. Blank pages do not get cited.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-brand-navy/10">
                <div className="flex-shrink-0 icon-box-sm bg-brand-gold/10 mb-4">
                  <Globe className="w-5 h-5 text-brand-gold" />
                </div>
                <h3 className="text-brand-navy font-bold mb-2">Unknown Entity</h3>
                <p className="text-light text-sm">
                  You are not in Wikidata, not in the Google Knowledge Graph, and not linked to the people and places that define you. AI has no confidence to recommend you.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-brand-navy/10">
                <div className="flex-shrink-0 icon-box-sm bg-brand-gold/10 mb-4">
                  <FileText className="w-5 h-5 text-brand-gold" />
                </div>
                <h3 className="text-brand-navy font-bold mb-2">Unstructured Facts</h3>
                <p className="text-light text-sm">
                  Flowing marketing prose reads well to humans. AI cannot extract a clean fact from it. If the model cannot quote you, it will not cite you.
                </p>
              </div>
              
              <div className="p-6 rounded-xl bg-white border border-brand-navy/10">
                <div className="flex-shrink-0 icon-box-sm bg-brand-gold/10 mb-4">
                  <BarChart3 className="w-5 h-5 text-brand-gold" />
                </div>
                <h3 className="text-brand-navy font-bold mb-2">Ranking Without Citation</h3>
                <p className="text-light text-sm">
                  You can hold position one on Google and still be absent from ChatGPT, Perplexity and Gemini answers. Different engines, different rules.
                </p>
              </div>
            </div>

            <p className="text-muted text-center">
              The good news: all of these problems are fixable. The{' '}
              <Link href="/us/ai-visibility" className="text-brand-gold font-medium hover:underline">
                AI visibility scanner
              </Link>{' '}
              identifies exactly which issues affect your site.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-12 border-b border-brand-navy/10">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-brand-navy text-2xl md:text-3xl font-bold mb-6">
              How Generative Engine Optimization Works
            </h2>
            <p className="text-muted mb-8">
              We fix the underlying technical signals that AI systems use to decide what business is the authority.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                { icon: MessageSquare, label: 'Citation Engineering - engineering specific citation signals' },
                { icon: FileCode, label: 'Schema & Structured Data - deep JSON-LD implementation' },
                { icon: Globe, label: 'Entity Disambiguation - Wikidata and Knowledge Graph' },
                { icon: FileText, label: 'Content Architecture - extractable factual statements' },
                { icon: Eye, label: 'AI visibility GEO audit — measuring baseline visibility' },
                { icon: Code2, label: 'Technical Foundation - SSR delivery and fast load times' },
                { icon: TrendingUp, label: 'Citation Monitoring - monthly tracking' }
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-brand-navy/[0.03]">
                  <item.icon className="w-5 h-5 text-brand-gold flex-shrink-0" />
                  <span className="text-brand-navy text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/us/quote"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl
                  bg-brand-gold font-bold text-xl
                  shadow-[0_0_40px_rgba(236,182,21,0.5)]
                  hover:shadow-[0_0_60px_rgba(236,182,21,0.7)]
                  hover:scale-105 transition-all duration-300"
                style={{ color: '#0A1B36' }}
              >
                <Rocket className="w-6 h-6" />
                Get an Instant Quote
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Proof Point */}
      <section className="bg-brand-navy/[0.03] py-12 border-b border-brand-navy/10">
        <div className="container-content">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-brand-navy text-2xl font-bold mb-4">
              It Works. Here Is the Proof.
            </h2>
            <p className="text-muted max-w-3xl mx-auto mb-6">
              ScopeSite used the AI visibility methodology to make H4TLT the first UK hearing compliance business recommended by
              all four major AI platforms: ChatGPT, Claude, Perplexity, and Gemini.
              That result came from the exact generative engine optimization process we use for US businesses.
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
              Common questions about Generative Engine Optimization
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
              Ready To Be Cited?
            </h2>
            <p className="text-white/70 mb-10 max-w-2xl mx-auto">
              Stop being invisible to generative AI. Find out what it takes to get recommended.
            </p>

            <div className="relative inline-block">
              <div className="absolute inset-0 bg-brand-gold/40 rounded-2xl blur-xl animate-pulse" />
              <Link
                href="/us/quote"
                className="relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl
                  bg-brand-gold font-bold text-xl
                  shadow-[0_0_40px_rgba(236,182,21,0.5)]
                  hover:shadow-[0_0_60px_rgba(236,182,21,0.7)]
                  hover:scale-105 transition-all duration-300"
                style={{ color: '#0A1B36' }}
              >
                <Rocket className="w-6 h-6" />
                Get an Instant Quote
                <ExternalLink className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link
                href="/us/pricing"
                className="text-white/70 hover:text-white font-medium inline-flex items-center gap-1 transition-colors"
              >
                View US pricing <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/us/ai-visibility"
                className="text-white/70 hover:text-white font-medium inline-flex items-center gap-1 transition-colors"
              >
                Run Free Scan <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
