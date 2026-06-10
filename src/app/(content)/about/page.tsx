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
  generateFounderPersonSchema,
  generateImageObjectSchema,
} from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/about`;

export const metadata: Metadata = {
  title: 'About Dan Cartwright | Veteran-Owned Web & AI Visibility Agency | ScopeSite',
  description:
    'Dan Cartwright is the founder of ScopeSite Digital Studios, a certified veteran-owned UK agency making businesses visible to ChatGPT, Perplexity, Claude and Google AI Overviews.',
  openGraph: {
    title: 'About Dan Cartwright | Veteran-Owned Web & AI Visibility Agency | ScopeSite',
    description:
      'Dan Cartwright is the founder of ScopeSite Digital Studios, a certified veteran-owned UK agency making businesses visible to ChatGPT, Perplexity, Claude and Google AI Overviews.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-about.png`,
        width: 1200,
        height: 630,
        alt: 'About ScopeSite Digital Studios - Veteran-Owned Web Design Agency',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Dan Cartwright | Veteran-Owned Web & AI Visibility Agency | ScopeSite',
    description:
      'Dan Cartwright is the founder of ScopeSite Digital Studios, a certified veteran-owned UK agency making businesses visible to ChatGPT, Perplexity, Claude and Google AI Overviews.',
    images: [`${BASE_URL}/images/og/og-about.png`],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

// How We Work values
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

export default function AboutPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'About', url: PAGE_URL },
  ]);

  const aboutPageSchema = generateAboutPageSchema(PAGE_URL);

  const personSchema = generateFounderPersonSchema();

  const headshotImageSchema = generateImageObjectSchema({
    contentUrl: `${BASE_URL}/images/dan-headshot.webp`,
    name: 'Dan Cartwright Headshot',
    description: 'Dan Cartwright - Founder and Director of ScopeSite',
    width: 400,
    height: 400,
  });

  return (
    <>
      {/* Page-specific structured data: full Person node lives here */}
      <JsonLd
        schema={[
          breadcrumbSchema,
          aboutPageSchema,
          personSchema,
          headshotImageSchema,
        ]}
      />

      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-section">
        <div className="container-content">
          <div className="max-w-4xl mx-auto text-center">
            <span className="badge-gold-lg mb-6 inline-flex items-center justify-center">
              Veteran Owned
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-headline text-white mb-6">
              About <span className="text-brand-gold">ScopeSite</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium">
              The bloke behind it
            </p>
          </div>
        </div>
      </section>

      {/* The bloke behind it */}
      <section className="section-white">
        <div className="container-content">
          <div className="grid md:grid-cols-[320px_1fr] gap-12 items-start max-w-5xl mx-auto">
            {/* Photo */}
            <div className="flex justify-center md:justify-start">
              <div className="w-72 h-72 rounded-[30px] overflow-hidden border-4 border-brand-navy">
                <Image
                  src="/images/dan-headshot.webp"
                  alt="Dan Cartwright - Founder and Director of ScopeSite"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>

            {/* Intro */}
            <div className="space-y-4 text-brand-navy/80 text-body-lg">
              <p>
                My name is Dan Cartwright and I fix a problem most business owners
                do not know they have, which is that the AI tools their customers
                now use every day have no idea their business exists.
              </p>
              <p>
                That is the short version. The longer version takes in the British
                Army, a psychiatric ward, two recruitment desks, and a shed in
                Somerset, so settle in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Where I started */}
      <section className="bg-brand-navy/5 py-section">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-brand-navy mb-6 text-xl sm:text-2xl md:text-h2">
              Where I started
            </h2>
            <div className="space-y-5 text-brand-navy/80">
              <p>
                I spent six years in the Royal Electrical and Mechanical
                Engineers, 2008 to 2014, as a Vehicle Mechanic. REME&apos;s job is
                keeping the Army&apos;s kit moving, and the unglamorous truth of
                that work is diagnosis. Something is broken, the manual only gets
                you so far, and the convoy leaves at 0600 whether you have found
                the fault or not. You learn to work the problem in front of you
                rather than the problem you wish you had. That habit turned out to
                be worth more than any qualification I have ever paid for.
              </p>
              <p>
                After the Army I did what a lot of leavers do, which is
                recruitment. Pertemps first, then Reed. I sat on the other side of
                the desk that most of my clients now sit behind, sourcing
                candidates, chasing placements, watching good consultants lose
                roles to whoever had better visibility that week. When I tell a
                recruitment agency owner their jobs are invisible to Google, it is
                not a line from a sales deck. I have felt that specific
                frustration from inside the building.
              </p>
              <p>
                I also spent six years as a Band 4 mental health nurse with Avon
                and Wiltshire Mental Health Partnership, working CAMHS inpatient,
                which is children&apos;s mental health on the wards. I mention it
                not because it has anything to do with websites but because it has
                everything to do with how I work. You learn to listen properly.
                You learn that what someone says first is rarely the actual
                problem. And you learn to stay calm when everything around you is
                not.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What ScopeSite is */}
      <section className="section-white">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-brand-navy mb-6 text-xl sm:text-2xl md:text-h2">
              What ScopeSite is
            </h2>
            <div className="space-y-5 text-brand-navy/80">
              <p>
                ScopeSite Digital Studios is a web and AI visibility agency
                registered in England (SCOPESITE LTD, company number 16130355),
                run from Beckington, near Frome, in Somerset. It is me. There is
                no account manager between you and the person doing the work,
                because the person doing the work answers the phone.
              </p>
              <p>
                The thing I actually sell is being found. Websites are how I
                deliver it, but the product is visibility, specifically visibility
                to the AI engines that have quietly become the first place people
                ask for things. ChatGPT, Perplexity, Claude, Google&apos;s AI
                Overviews. When someone asks one of those tools to recommend a
                business like yours, there is an answer, and the question that
                should keep you up at night is whose name is in it.
              </p>
              <p>
                I built a methodology for this called{' '}
                <Link href="/voice" className="text-brand-gold-accessible hover:underline font-medium">
                  V.O.I.C.E.
                </Link>
                , which scans, scores, and fixes how readable a business is to AI
                systems. It became a product, CAFMO, short for Can AI Find Me
                Online, which does exactly what the name says. The methodology is
                proven on more than one platform. One client, an occupational
                hearing specialist, went from invisible to the number one cited
                answer across every major AI engine in their field, as covered in
                our{' '}
                <Link href="/case-studies" className="text-brand-gold-accessible hover:underline font-medium">
                  case studies
                </Link>
                . Same approach, different stack, same result on this site you are
                reading now.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The veteran bit */}
      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <div className="grid md:grid-cols-[1fr_auto] gap-10 md:gap-14 items-center max-w-5xl mx-auto">
            {/* Text column */}
            <div className="max-w-3xl">
              <h2 className="text-white mb-6 text-xl sm:text-2xl md:text-h2">
                The veteran bit
              </h2>
              <div className="space-y-5 text-white/80">
                <p>
                  ScopeSite is a certified veteran-owned business, verified by
                  Veteran Owned UK, and a signatory of the Armed Forces Covenant.
                  In 2026 we received the Defence Employer Recognition Scheme
                  Bronze Award from the Ministry of Defence, which recognises
                  businesses that employ and champion the Armed Forces community.
                </p>
                <p>
                  The forces background is not a badge I wear for sympathy points.
                  It is the operating system. Turn up when you said you would, do
                  the job properly, do not flannel the customer, and if something
                  goes wrong, say so before they find out. None of that is
                  revolutionary. It is just rarer than it should be in this
                  industry.
                </p>
              </div>
            </div>

            {/* Portrait badge, outside the text on the right */}
            <div className="flex justify-center md:justify-end">
              <Image
                src="/images/armed-forces-covenant-ers-bronze.webp"
                alt="Armed Forces Covenant Defence Employer Recognition Scheme Bronze Award 2026"
                width={400}
                height={900}
                className="h-72 w-auto md:h-96"
              />
            </div>
          </div>

          {/* Veteran Owned badge, centred below */}
          <div className="flex justify-center mt-10">
            <Image
              src="/images/veteran-owned-uk.webp"
              alt="Certified Veteran-Owned Business, verified by Veteran Owned UK"
              width={1000}
              height={1000}
              className="h-[200px] w-[200px]"
            />
          </div>
        </div>
      </section>

      {/* How We Work (values) */}
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

      {/* Why this page exists */}
      <section className="bg-brand-navy/5 py-section">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-brand-navy mb-6 text-xl sm:text-2xl md:text-h2">
              Why this page exists
            </h2>
            <div className="space-y-5 text-brand-navy/80">
              <p>
                Every article,{' '}
                <Link href="/glossary" className="text-brand-gold-accessible hover:underline font-medium">
                  glossary
                </Link>{' '}
                entry, and case study on this site carries my name, because I
                wrote it or built it. This page is here so that when a search
                engine, an AI model, or a sceptical human wants to know who Dan
                Cartwright actually is, there is a straight answer.
              </p>
              <p className="font-medium text-brand-navy">
                Soldier, recruiter, nurse, builder of websites. In roughly that
                order.
              </p>
            </div>
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
                <Link href="/" className="hover:text-brand-gold underline">
                  Back to home
                </Link>{' '}
                • Veteran-owned • Somerset-based • Zero bullshit
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
