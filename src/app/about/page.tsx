import Link from 'next/link';
import Image from 'next/image';
import {
  MessageSquare,
  Receipt,
  Target,
  Shield,
  X,
} from 'lucide-react';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import {
  generateBreadcrumbSchema,
  generateAboutPageSchema,
  generatePersonSchema,
} from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/about`;

export const metadata: Metadata = {
  title: 'About Us | Veteran-Owned',
  description:
    'Founded by British Army veteran Dan Cartwright. Website designers with military precision, based in Somerset, serving UK-wide. No corporate bullshit, just results.',
  openGraph: {
    title: 'About Us | Veteran-Owned Website Designers | ScopeSite Digital Studios',
    description:
      'Founded by British Army veteran Dan Cartwright. Website designers with military precision, based in Somerset, serving UK-wide. No corporate bullshit, just results.',
    url: PAGE_URL,
    images: [
      {
        url: `${BASE_URL}/images/dan-headshot.webp`,
        width: 400,
        height: 400,
        alt: 'Dan Cartwright - Founder of ScopeSite Digital Studios',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'About Us | Veteran-Owned Website Designers | ScopeSite',
    description:
      'Founded by British Army veteran Dan Cartwright. Website designers with military precision, based in Somerset, serving UK-wide.',
    images: [`${BASE_URL}/images/dan-headshot.webp`],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

// Values Data
const values = [
  {
    title: 'STRAIGHT TALKING',
    description:
      "We explain things in plain English. No jargon to make us sound clever. No hiding behind technical terms. If we can't explain it simply, we don't understand it well enough.",
    icon: MessageSquare,
  },
  {
    title: 'TRANSPARENT PRICING',
    description:
      "You'll know exactly what things cost before we start. No 'it depends' without actual numbers. No surprise invoices. No scope creep charges without discussion first.",
    icon: Receipt,
  },
  {
    title: 'RESULTS OVER AESTHETICS',
    description:
      "Pretty websites don't pay your bills. We build sites that load fast, rank well, convert visitors, and show up when AI assistants are asked for recommendations.",
    icon: Target,
  },
  {
    title: 'MILITARY PRECISION',
    description:
      'Deadlines are deadlines. Communication is proactive. Problems get solved, not ignored. We run projects like operations - planned, executed, delivered.',
    icon: Shield,
  },
];

// Stats Data
const stats = [
  { number: '348', label: 'UK agencies researched to set our pricing' },
  { number: '25%', label: 'Below market average on comparable projects' },
  { number: '24hr', label: 'Maximum response time, always' },
  { number: '100%', label: 'Of projects delivered on deadline' },
  { number: '0', label: 'Long-term contracts required' },
];

// What We're Not Data
const notList = [
  "We're not a huge agency with account managers who've never built a website",
  "We're not going to upsell you services you don't need",
  "We're not going to disappear after launch and leave you stuck",
  "We're not interested in clients who want 'cheap and fast' over 'right'",
  "We're not for everyone - and that's fine",
];

// Why We Exist Cards
const whyCards = [
  {
    title: 'THE PROBLEM',
    text: "Most agencies sell pretty websites that don't perform. They hide behind jargon, lock you into contracts, and disappear when things go wrong. They charge premium prices for template solutions and treat small businesses like an afterthought.",
  },
  {
    title: 'THE OPPORTUNITY',
    text: "AI is changing how people find businesses. ChatGPT, Siri, voice search - they don't care how pretty your website looks. They care about structure, speed, and trust signals. Most agencies haven't caught up. We have.",
  },
  {
    title: 'OUR RESPONSE',
    text: "We built ScopeSite to be the agency we wished existed. Transparent pricing. Plain English explanations. Websites that actually work - for humans AND AI. No retainers designed to bleed you dry. Just honest work at fair prices.",
  },
];

export default function AboutPage() {
  // Generate schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'About', url: PAGE_URL },
  ]);

  const aboutPageSchema = generateAboutPageSchema(PAGE_URL);

  const founderSchema = generatePersonSchema(
    'Dan Cartwright',
    'Director',
    'British Army veteran and founder of ScopeSite Digital Studios. Creator of the V.O.I.C.E™ methodology for AI search visibility.',
    `${BASE_URL}/images/dan-headshot.webp`,
    {
      knowsAbout: [
        'AI Search Optimisation',
        'Server-Side Rendering',
        'Next.js',
        'V.O.I.C.E Methodology',
        'Schema Markup',
        'Generative Engine Optimisation',
      ],
      hasCredential: {
        credentialCategory: 'Military Service',
        description: 'British Army Veteran',
      },
      sameAs: [
        'https://www.linkedin.com/in/dan-cartwright-scopesite',
      ],
    }
  );

  return (
    <>
      {/* Page-specific structured data */}
      <JsonLd schema={[breadcrumbSchema, aboutPageSchema, founderSchema]} />

      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-section min-h-[60vh] flex items-center">
        <div className="container-content">
          <div className="max-w-4xl mx-auto text-center">
            <span className="badge-gold-lg mb-6 inline-flex items-center justify-center">
              Veteran Owned
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-headline text-white mb-4">
              BUILT <span className="text-brand-gold">DIFFERENT.</span> ON
              PURPOSE.
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium mb-8">
              A web design agency that actually gives a shit
            </p>
            <p className="text-body-lg text-white/70 max-w-3xl mx-auto">
              ScopeSite isn&apos;t another faceless agency churning out template
              websites and empty promises. We&apos;re a veteran-owned,
              Somerset-based studio that believes businesses deserve better than
              the bullshit most agencies sell.
            </p>
          </div>
        </div>
      </section>

      {/* Company Identity Section */}
      <section className="bg-white py-12 border-b border-brand-navy/10">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-brand-navy font-bold text-xl mb-4">Who We Are</h2>
                <p className="text-brand-navy/70 mb-4">
                  ScopeSite Digital Studios is a veteran-owned, AI-first web design agency based in
                  Somerset, UK. Founded by Dan Cartwright, a British Army veteran, ScopeSite builds
                  server-side rendered websites using Next.js and the proprietary V.O.I.C.E™
                  (Voice-Optimised Intelligent Content Engineering) methodology.
                </p>
                <p className="text-brand-navy/70">
                  ScopeSite specialises in web design, SEO, and AI search optimisation for businesses
                  in Somerset, Bristol, Bath, and across the South West. Every website is custom-built
                  using server-side rendering with Next.js, achieving 100/100 Google Lighthouse scores.
                </p>
              </div>
              <div>
                <h2 className="text-brand-navy font-bold text-xl mb-4">What Makes Us Different</h2>
                <p className="text-brand-navy/70 mb-4">
                  Unlike traditional agencies that rely on WordPress templates, ScopeSite builds every
                  site from scratch using Next.js server-side rendering. This means faster load times,
                  better Google rankings, and visibility in AI search engines like ChatGPT, Perplexity,
                  and Gemini.
                </p>
                <p className="text-brand-navy/70">
                  ScopeSite achieved #1 AI recommendations for client H4TLT across all four major AI
                  platforms. The agency&apos;s{' '}
                  <Link href="/voice" className="text-brand-gold hover:underline font-medium">
                    V.O.I.C.E™ methodology
                  </Link>{' '}
                  is the only proprietary AI visibility system offered by a web design agency in the
                  South West.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Founder Section */}
      <section className="section-white">
        <div className="container-content">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-brand-navy mb-4 text-xl sm:text-2xl md:text-h2">Meet the Founder</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Photo */}
            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <div
                  className="w-72 h-72 md:w-80 md:h-80 rounded-[30px] overflow-hidden border-4 border-brand-navy"
                >
                  <Image
                    src="/images/dan-headshot.webp"
                    alt="Dan Cartwright - Founder and Director of ScopeSite"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="text-center md:text-left">
              <h3 className="text-brand-navy text-2xl font-bold mb-1">
                Dan Cartwright
              </h3>
              <p className="text-brand-gold-accessible font-medium mb-6">
                Founder & Director
              </p>

              <div className="space-y-4 text-brand-navy/70">
                <p>
                  I spent years watching businesses get burned by web agencies.
                  Overpriced. Underdelivered. Full of jargon designed to confuse
                  rather than help.
                </p>
                <p>
                  Before ScopeSite, I served in the British Army - where you
                  learn pretty quickly that bullshit gets people hurt and
                  results are all that matter. That mindset stuck.
                </p>
                <p>
                  I also spent six years working in CAMHS (Child and Adolescent
                  Mental Health Services), which taught me something equally
                  important: how to actually listen to people, understand their
                  real problems, and communicate complex things in plain
                  English.
                </p>
                <p>
                  ScopeSite combines both. Military precision in how we plan and
                  deliver. Genuine care for the businesses we work with. And
                  absolutely zero tolerance for the smoke-and-mirrors nonsense
                  that plagues this industry.
                </p>
              </div>

              <p className="text-brand-navy/50 text-sm mt-6">
                Based in Frome, Somerset
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Exist Section */}
      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">Why ScopeSite Exists</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Because the web design industry has a honesty problem
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {whyCards.map((card) => (
              <div
                key={card.title}
                className="p-8 rounded-2xl bg-brand-graphite/50 border border-white/10"
              >
                <h3 className="text-brand-gold font-bold text-lg mb-4 text-center">
                  {card.title}
                </h3>
                <p className="text-white/70">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="section-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(10,27,54,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(10,27,54,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        <div className="container-content relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-brand-navy mb-4 text-xl sm:text-2xl md:text-h2">How We Work</h2>
            <p className="text-brand-navy/70 max-w-2xl mx-auto">
              The principles behind everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {values.map((value) => (
              <div
                key={value.title}
                className="group p-8 rounded-2xl transition-all duration-400 ease-out
                  bg-white border border-brand-navy/10
                  hover:shadow-[0_0_40px_rgba(236,182,21,0.15)]
                  hover:border-brand-gold/30"
                style={{
                  boxShadow: '0 4px 24px rgba(10,27,54,0.08)',
                }}
              >
                <div
                  className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl 
                  bg-brand-navy/5 group-hover:bg-brand-gold/10 transition-all duration-400"
                >
                  <value.icon className="w-6 h-6 text-brand-navy group-hover:text-brand-orange transition-colors duration-400" />
                </div>
                <h3 className="text-brand-navy font-bold mb-3">{value.title}</h3>
                <p className="text-brand-navy/60">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Numbers Section */}
      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">ScopeSite by Numbers</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-4">
                <div className="text-4xl md:text-5xl font-headline text-brand-gold mb-2">
                  {stat.number}
                </div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We're Not Section */}
      <section className="section-white">
        <div className="container-content">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-brand-navy mb-4 text-xl sm:text-2xl md:text-h2">What We&apos;re Not</h2>
            <p className="text-brand-navy/70 max-w-2xl mx-auto">
              Just so we&apos;re clear
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            {notList.map((item) => (
              <div
                key={item}
                className="flex items-start gap-4 p-4 rounded-xl bg-red-50 border border-red-200"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-brand-navy/80 pt-1">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <div
              className="bg-brand-graphite/50 border border-white/10 rounded-2xl p-10 text-center"
              style={{ boxShadow: '0 0 60px rgba(236,182,21,0.1)' }}
            >
              <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">Want to Work With Us?</h2>
              <p className="text-white/70 mb-8 max-w-xl mx-auto">
                Book a call or get an instant quote - no pressure either way
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                <Link href="/book" className="btn-primary">
                  Book a Strategy Call
                </Link>
                <Link href="/pricing" className="btn-secondary-light">
                  Get Instant Quote
                </Link>
              </div>
              <p className="text-white/50 text-sm">
                Veteran-owned • Somerset-based • Zero bullshit
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
