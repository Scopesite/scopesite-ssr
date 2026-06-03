'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronDown,
  Database,
  RefreshCw,
  Wrench,
  ListTodo,
  CalendarClock,
  Users,
  Lightbulb,
  History,
  BookOpen,
  Mic2,
  Shield,
  Bot,
  MessageSquare,
  Clock,
  PoundSterling,
  Loader2,
} from 'lucide-react';

const PDF_GUIDE_URL =
  'https://cd2a442a-c7c5-41f7-a575-ec3260f53540.usrfiles.com/ugd/cd2a44_d1bee5c09d1a44c09b49bf5ce6ac0e17.pdf';

const faqs = [
  {
    question: 'Does LLM Brain work with ChatGPT?',
    answer:
      'Yes. ChatGPT connects through a Make.com bridge that syncs your Supabase database to Google Sheets. Claude uses native MCP. Both assistants read and write to the same brain, so you are not locked into one provider.',
  },
  {
    question: 'Is my data safe?',
    answer:
      'Your data lives in your own database on Supabase, hosted in the EU. We do not see it unless you give us access for support. You control credentials and access.',
  },
  {
    question: 'Can I add my own reference material?',
    answer:
      'Yes. You can upload ebooks, research, frameworks, playbooks, and anything you want your AI to pull from during conversations. It all sits in your knowledge base.',
  },
  {
    question: 'What if I cancel the managed service?',
    answer:
      'You own the database. We hand over all credentials. It keeps working, you just manage hosting and updates yourself.',
  },
  {
    question: 'How long does setup take?',
    answer:
      'Typically two to three hours for a full setup, including initial data seeding and your thirty-minute onboarding call.',
  },
  {
    question: 'Do you offer a discount?',
    answer:
      'We run launch pricing through our LinkedIn community. Follow us there for exclusive offers.',
  },
];

const storeItems = [
  {
    title: 'Tasks and priorities',
    description: 'Track what matters, with categories and deadlines your AI can update as you go.',
    icon: ListTodo,
  },
  {
    title: 'Deadlines and reminders',
    description: 'Nothing slips through because the brain knows what is due and when.',
    icon: CalendarClock,
  },
  {
    title: 'Contacts and relationships',
    description: 'Who you know, who you owe a call, and how people fit your business.',
    icon: Users,
  },
  {
    title: 'Ideas and action plans',
    description: 'Capture sparks in the moment and turn them into next steps without starting a fresh chat.',
    icon: Lightbulb,
  },
  {
    title: 'Session history',
    description: 'What you did, what you decided, what comes next. No more guessing where you left off.',
    icon: History,
  },
  {
    title: 'Knowledge base',
    description: 'Ebook extracts, research, frameworks, reference material. Your AI cites what you gave it.',
    icon: BookOpen,
  },
  {
    title: 'Writing voice and brand rules',
    description: 'Tone, taboos, and phrasing so output sounds like you, not a generic assistant.',
    icon: Mic2,
  },
  {
    title: 'Governance and access',
    description: 'Control who sees what. Your rules, your database, not a black box inside a vendor.',
    icon: Shield,
  },
];

export default function LlmBrainPage() {
  const [loadingPlan, setLoadingPlan] = useState<'setup' | 'managed' | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  async function handleCheckout(plan: 'setup' | 'managed') {
    setLoadingPlan(plan);
    try {
      const res = await fetch('/api/llm-brain/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoadingPlan(null);
      }
    } catch {
      setLoadingPlan(null);
    }
  }

  function renderPricingCards() {
    return (
      <>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl border-2 border-brand-navy/15 bg-white p-8 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 text-brand-navy mb-4">
              <PoundSterling className="w-6 h-6" aria-hidden />
              <span className="font-bold text-lg">Done-for-you setup</span>
            </div>
            <p className="text-brand-navy font-headline text-4xl mb-2">£250</p>
            <p className="text-muted text-sm mb-6">One-time. We build it, configure it, seed it, hand it over.</p>
            <ul className="text-brand-navy/80 text-sm space-y-2 mb-8 flex-1 list-disc pl-5">
              <li>Initial setup and configuration</li>
              <li>Data seeding from what you give us</li>
              <li>Claude MCP connection</li>
              <li>ChatGPT bridge (Make.com)</li>
              <li>Thirty-minute onboarding call</li>
            </ul>
            <button
              onClick={() => handleCheckout('setup')}
              disabled={loadingPlan !== null}
              className="btn-primary w-full text-center inline-flex items-center justify-center gap-2"
            >
              {loadingPlan === 'setup' ? (
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
              ) : null}
              {loadingPlan === 'setup' ? 'Redirecting...' : 'Buy Setup, £250'}
            </button>
          </div>
          <div className="rounded-2xl border-2 border-brand-gold/40 bg-white p-8 shadow-sm flex flex-col ring-2 ring-brand-gold/20">
            <div className="flex items-center gap-2 text-brand-navy mb-4">
              <Clock className="w-6 h-6" aria-hidden />
              <span className="font-bold text-lg">Managed service</span>
            </div>
            <p className="text-brand-navy font-headline text-4xl mb-2">£85</p>
            <p className="text-muted text-sm mb-1">per month</p>
            <p className="text-muted text-sm mb-6">Hosted, maintained, updates and backups handled by us.</p>
            <ul className="text-brand-navy/80 text-sm space-y-2 mb-8 flex-1 list-disc pl-5">
              <li>Everything in the setup package</li>
              <li>Ongoing hosting and health checks</li>
              <li>We handle updates and backups</li>
              <li>Support when you need a hand</li>
            </ul>
            <button
              onClick={() => handleCheckout('managed')}
              disabled={loadingPlan !== null}
              className="btn-primary w-full text-center inline-flex items-center justify-center gap-2"
            >
              {loadingPlan === 'managed' ? (
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
              ) : null}
              {loadingPlan === 'managed' ? 'Redirecting...' : 'Subscribe, £85/mo'}
            </button>
          </div>
        </div>
        <p className="text-center text-muted text-sm mt-8">
          Both options include initial setup, data seeding, Claude MCP, ChatGPT bridge, and your
          onboarding call.
        </p>
        <p className="text-center text-brand-navy/50 text-xs mt-4">
          Follow us on{' '}
          <a
            href="https://www.linkedin.com/in/scopesite"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-brand-gold-accessible"
          >
            LinkedIn
          </a>{' '}
          for exclusive launch pricing.
        </p>
      </>
    );
  }

  return (
    <>
      {/* 1. Hero */}
      <section className="bg-brand-navy text-white min-h-[70vh] flex items-center py-section">
        <div className="container-content">
          <div className="max-w-3xl">
            <div className="badge-gold-lg mb-6">New from ScopeSite</div>
            <h1 className="text-[2rem] sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] font-headline text-white leading-[1.05] mb-6">
              Your AI Forgets Everything.{' '}
              <span className="text-brand-gold">Every. Single. Time.</span>
            </h1>
            <div className="w-full max-w-[600px] mx-auto mb-8">
              <Image
                src="/images/llm-brain-hero.webp"
                alt="LLM Brain — One Source of Truth for Claude, ChatGPT, Notion, Perplexity, DeepSeek and Copilot"
                width={1240}
                height={945}
                priority
                sizes="(min-width: 768px) 600px, 100vw"
                className="w-full h-auto rounded-lg"
              />
            </div>
            <p className="hero-description text-body-lg text-white/85 mb-8 max-w-2xl">
              You have spent hours briefing Claude or ChatGPT about your business. Tomorrow, it will
              not remember a word. LLM Brain fixes that with a permanent database your assistants read
              and write to, so context builds instead of resetting every session.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleCheckout('setup')}
                disabled={loadingPlan !== null}
                className="btn-primary text-center inline-flex items-center justify-center gap-2"
              >
                {loadingPlan === 'setup' ? (
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
                ) : null}
                {loadingPlan === 'setup' ? 'Redirecting...' : 'Buy Setup, £250'}
              </button>
              <a
                href={PDF_GUIDE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-center"
              >
                Download the Free Guide
              </a>
            </div>
            <p className="mt-4">
              <button
                onClick={() => handleCheckout('managed')}
                disabled={loadingPlan !== null}
                className="text-white/60 text-sm hover:text-brand-gold underline underline-offset-4 transition-colors"
              >
                {loadingPlan === 'managed' ? 'Redirecting...' : 'Or subscribe to managed service, £85/mo'}
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* 2. The Problem */}
      <section className="section-white border-b border-brand-navy/10">
        <div className="container-content max-w-4xl mx-auto">
          <h2 className="text-brand-navy text-2xl sm:text-3xl font-bold mb-6">
            The Input Paradox
          </h2>
          <p className="text-muted text-lg mb-6">
            AI tools are meant to save time, but most of us burn it re-explaining who we are, what we
            sell, what we decided last week, and where we left off. We call that the Input Paradox: the
            tool is fast, the setup is endless.
          </p>
          <p className="text-muted text-lg mb-8">
            You have walked your AI through your clients, your pricing, your brand voice, your current
            projects, and your goals. You close the chat. Tomorrow, it is a stranger again. That is the
            digital lobotomy, every new thread is a factory reset.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-brand-navy/10 bg-brand-navy/5 p-6">
              <p className="font-headline text-4xl sm:text-5xl text-brand-gold mb-2">~520</p>
              <p className="text-brand-navy font-semibold mb-1">Hours a year</p>
              <p className="text-muted text-sm">
                Roughly one to two hours a week re-briefing, if you use AI regularly for real work.
              </p>
            </div>
            <div className="rounded-2xl border border-brand-navy/10 bg-brand-navy/5 p-6">
              <p className="font-headline text-4xl sm:text-5xl text-brand-gold mb-2">~43</p>
              <p className="text-brand-navy font-semibold mb-1">Twelve-hour days</p>
              <p className="text-muted text-sm">
                That is how many full working days you could get back if that time was not repeating
                yourself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pricing (early) */}
      <section className="section-white" aria-labelledby="pricing-heading">
        <div className="container-content max-w-5xl mx-auto">
          <h2 id="pricing-heading" className="text-brand-navy text-2xl sm:text-3xl font-bold mb-4 text-center">
            Pricing
          </h2>
          <p className="text-muted text-center mb-12 max-w-2xl mx-auto">
            Two simple options. Same outcome: a brain that survives the close button.
          </p>
          {renderPricingCards()}
        </div>
      </section>

      {/* 4. What Happens Next */}
      <section className="bg-brand-navy/5 py-section border-y border-brand-navy/10" aria-labelledby="next-steps-heading">
        <div className="container-content max-w-4xl mx-auto">
          <h2 id="next-steps-heading" className="text-brand-navy text-2xl sm:text-3xl font-bold mb-10 text-center">
            What happens after you buy?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <p className="text-teal-500 font-headline text-4xl mb-3">1</p>
              <h3 className="text-brand-navy font-bold mb-2">Pay securely</h3>
              <p className="text-muted text-sm leading-relaxed">
                You pay through Stripe, promo codes accepted at checkout. Quick, safe, and no
                messing about.
              </p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-teal-500 font-headline text-4xl mb-3">2</p>
              <h3 className="text-brand-navy font-bold mb-2">We get to work</h3>
              <p className="text-muted text-sm leading-relaxed">
                Your LLM Brain is built, configured, and seeded with your data. Usually live
                same day.
              </p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-teal-500 font-headline text-4xl mb-3">3</p>
              <h3 className="text-brand-navy font-bold mb-2">You are up and running</h3>
              <p className="text-muted text-sm leading-relaxed">
                We send you a confirmation email with your onboarding call link. You will be
                live within 24 hours of a working day, Monday to Friday.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="bg-brand-navy py-section" aria-labelledby="how-heading">
        <div className="container-content">
          <h2 id="how-heading" className="text-white text-2xl sm:text-3xl font-bold mb-12 text-center">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                title: 'We build your brain',
                text: 'We set up a Supabase database tailored to your business, wired to your AI tools through MCP and, where needed, Make.com.',
                icon: Wrench,
              },
              {
                step: '2',
                title: 'Your AI remembers',
                text: 'Every conversation reads from and writes to the same store, so decisions, tasks, and context stack up instead of vanishing.',
                icon: Database,
              },
              {
                step: '3',
                title: 'You stop repeating yourself',
                text: 'Your assistant picks up where you left off, with your knowledge base, contacts, and history already in place.',
                icon: RefreshCw,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="card-dark-hover rounded-2xl p-8 border border-white/10 text-center md:text-left"
              >
                <div className="text-brand-gold font-headline text-5xl mb-4">{item.step}</div>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 mb-4 mx-auto md:mx-0">
                  <item.icon className="w-7 h-7 text-brand-gold" aria-hidden />
                </div>
                <h3 className="text-white text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/75 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. What It Stores (white) */}
      <section className="section-white relative overflow-hidden" aria-labelledby="stores-heading">
        <div className="absolute inset-0 opacity-[0.03] bg-grid" aria-hidden />
        <div className="container-content relative z-10">
          <h2 id="stores-heading" className="text-brand-navy text-2xl sm:text-3xl font-bold mb-4 text-center">
            What it stores
          </h2>
          <p className="text-muted text-center max-w-2xl mx-auto mb-12">
            One brain for tasks, people, ideas, history, and reference material. Your AI stops
            improvising and starts working from facts you already approved.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {storeItems.map((item) => (
              <div key={item.title} className="group card-hover p-6 rounded-2xl h-full">
                <div className="icon-box-md mb-4">
                  <item.icon className="w-6 h-6 icon-brand" aria-hidden />
                </div>
                <h3 className="text-brand-navy font-bold mb-2">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Cross-Platform (navy) */}
      <section className="bg-brand-navy py-section">
        <div className="container-content max-w-4xl mx-auto">
          <h2 className="text-white text-2xl sm:text-3xl font-bold mb-8 text-center">
            Works with Claude and ChatGPT
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="bg-white/10 rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Bot className="w-8 h-8 text-brand-gold" aria-hidden />
                <h3 className="text-white text-xl font-bold">Claude</h3>
              </div>
              <p className="text-white/75">
                Native MCP connection. Plug in, authenticate, and your brain is live. No duct tape
                required.
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-8 h-8 text-brand-gold" aria-hidden />
                <h3 className="text-white text-xl font-bold">ChatGPT</h3>
              </div>
              <p className="text-white/75">
                Connects through a Make.com workflow that keeps Supabase and Google Sheets in sync, so
                both assistants share one source of truth.
              </p>
            </div>
          </div>
          <p className="text-white/80 text-center text-lg font-medium">
            Your data lives in <span className="text-brand-gold font-bold">your</span> database, not
            trapped inside a single AI vendor. Switch tools, your brain comes with you.
          </p>
        </div>
      </section>

      {/* 8. The Numbers (light) */}
      <section className="section-white" aria-labelledby="numbers-heading">
        <div className="container-content">
          <h2 id="numbers-heading" className="text-brand-navy text-2xl sm:text-3xl font-bold mb-10 text-center">
            The numbers
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto text-center">
            <div>
              <p className="text-brand-gold font-headline text-4xl mb-2">520</p>
              <p className="text-brand-navy/80 text-sm">Hours a year you could claw back from re-briefing</p>
            </div>
            <div>
              <p className="text-brand-gold font-headline text-4xl mb-2">43</p>
              <p className="text-brand-navy/80 text-sm">Twelve-hour working days, same maths, different lens</p>
            </div>
            <div>
              <p className="text-brand-gold font-headline text-4xl mb-2">£250</p>
              <p className="text-brand-navy/80 text-sm">One-time setup versus the cost of another year of amnesia</p>
            </div>
            <div>
              <p className="text-brand-gold font-headline text-4xl mb-2">Day one</p>
              <p className="text-brand-navy/80 text-sm">Most clients are productive from the first conversation after setup</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Pricing (repeat, navy) */}
      <section className="bg-brand-navy py-section" aria-labelledby="pricing-heading-repeat">
        <div className="container-content max-w-5xl mx-auto">
          <h2 id="pricing-heading-repeat" className="text-white text-2xl sm:text-3xl font-bold mb-4 text-center">
            Ready to get started?
          </h2>
          <p className="text-white/70 text-center mb-12 max-w-2xl mx-auto">
            Two simple options. Same outcome: a brain that survives the close button.
          </p>
          {renderPricingCards()}
        </div>
      </section>

      {/* 10. FAQ */}
      <section className="bg-white py-16">
        <div className="container-content max-w-3xl mx-auto">
          <h2 className="text-brand-navy text-2xl sm:text-3xl font-bold mb-8 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-0 divide-y divide-brand-navy/10">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex items-center justify-between cursor-pointer list-none text-brand-navy font-medium text-lg pr-8">
                  {faq.question}
                  <ChevronDown className="w-5 h-5 text-brand-gold transition-transform group-open:rotate-180 flex-shrink-0" />
                </summary>
                <p className="faq-answer mt-3 text-brand-navy/70 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Final CTA */}
      <section className="section-navy" aria-labelledby="final-cta-heading">
        <div className="container-content text-center max-w-2xl mx-auto">
          <h2 id="final-cta-heading" className="text-white text-2xl sm:text-3xl md:text-h2 mb-4">
            Stop briefing. Start building.
          </h2>
          <p className="text-white/80 mb-8">
            Your AI should already know your business. For £250, it will.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
            <button
              onClick={() => handleCheckout('setup')}
              disabled={loadingPlan !== null}
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              {loadingPlan === 'setup' ? (
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
              ) : null}
              {loadingPlan === 'setup' ? 'Redirecting...' : 'Buy Setup, £250'}
            </button>
            <a
              href={PDF_GUIDE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary-light"
            >
              Download the Free Guide
            </a>
          </div>
          <p className="mb-8">
            <button
              onClick={() => handleCheckout('managed')}
              disabled={loadingPlan !== null}
              className="text-white/60 text-sm hover:text-brand-gold underline underline-offset-4 transition-colors"
            >
              {loadingPlan === 'managed' ? 'Redirecting...' : 'Or subscribe to managed service, £85/mo'}
            </button>
          </p>
          <p className="text-white/60 text-sm">
            Veteran-owned. Built in Somerset. Your data, your database, your rules.
          </p>
          <p className="text-white/50 text-sm mt-4">
            <Link href="/" className="underline hover:text-brand-gold">
              Back to ScopeSite home
            </Link>
          </p>
        </div>
      </section>

      {/* Sticky buy bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-brand-navy/95 backdrop-blur-md border-t border-white/10 transition-transform duration-300 ${
          showStickyBar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="container-content py-3 flex items-center justify-between gap-4">
          <p className="text-white text-sm font-medium hidden sm:block">
            LLM Brain, £250 setup
          </p>
          <button
            onClick={() => handleCheckout('setup')}
            disabled={loadingPlan !== null}
            className="btn-primary text-sm px-6 py-2 inline-flex items-center justify-center gap-2 ml-auto"
          >
            {loadingPlan === 'setup' ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
            ) : null}
            {loadingPlan === 'setup' ? 'Redirecting...' : 'Buy Now'}
          </button>
        </div>
      </div>
    </>
  );
}
