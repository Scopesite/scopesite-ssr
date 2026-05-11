import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Briefcase, FileSearch, Sparkles, ArrowRight } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateServiceSchema,
  generateWebPageSchema,
  type FAQItem,
} from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_PATH = '/recruitment-website-design';
const PAGE_URL = `${BASE_URL}${PAGE_PATH}`;
const DEMO_URL = 'https://jobboard-sonar.vercel.app/';

/** Service JSON-LD Offer: mirrors visible "from £2,000" and SSR cap £8,000 (canonical pricing). */
const recruitmentServiceOffer: Record<string, unknown> = {
  '@type': 'Offer',
  priceCurrency: 'GBP',
  price: '2000',
  priceSpecification: {
    '@type': 'PriceSpecification',
    minPrice: '2000',
    maxPrice: '8000',
    priceCurrency: 'GBP',
  },
  url: PAGE_URL,
  description:
    'Custom recruitment website design from £2,000. AI SEO included free. £5,249 typical with Live Jobs Board add-on.',
  availability: 'https://schema.org/InStock',
  priceValidUntil: '2026-12-31',
  seller: { '@id': `${BASE_URL}/#organization` },
};

export const metadata: Metadata = {
  title: 'Recruitment Website Design UK | Custom-Built, Schema-First, AI-Visible | ScopeSite',
  description:
    'Bespoke recruitment website design for UK agencies. Schema-first, Google for Jobs ready, AI-visible. One extra placement covers the cost. See the live demo.',
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Recruitment Website Design That Earns Its Place',
    description:
      'Custom-built UK recruitment websites with schema baked in, Google for Jobs verified, and ChatGPT-readable from day one. One placement pays for it.',
    url: PAGE_URL,
    type: 'website',
    images: [
      {
        url: 'https://scopesite.co.uk/og/recruitment-website-design.png',
        width: 1200,
        height: 630,
        alt: 'ScopeSite recruitment website design: bespoke, schema-first, AI-visible',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recruitment Website Design UK | ScopeSite',
    description:
      'Custom-built recruitment websites that Google for Jobs reads, ChatGPT cites, and candidates can actually use.',
  },
};

const recruitmentFaqs: FAQItem[] = [
  {
    question: 'What is a recruitment website, exactly?',
    answer:
      "It's the public-facing site that holds your live vacancies, your team bios, and your sector positioning. The bit that ChatGPT, Google, and candidates actually read. Not the ATS backend, that's separate.",
  },
  {
    question: 'How much does a recruitment website cost in the UK?',
    answer:
      'A custom Ultra Fast SSR recruitment website starts at £2,000 for up to 5 pages. A typical 10-page build is £3,250. Add a Live Jobs Board with auto-schema for £1,999, taking a typical recruitment build with jobs board to £5,249, one-off. AI SEO is included free. Same total whether you pay in full, spread over 6 months, or 12 months. Pay Monthly Service is also available; see https://scopesite.co.uk/pricing for tier-specific setup and monthly fees. Volcanic charges £899 a month over a three-year lock-in, totalling £32,364.',
  },
  {
    question: 'How do you design a recruitment website that ranks for Google for Jobs?',
    answer:
      'JSON-LD JobPosting schema on every role page (title, salary, location, employment type), server-side rendered HTML so the schema exists before any JavaScript runs, and Google Search Console submission for the role sitemap. Google indexes the page and surfaces the vacancy inside the Google for Jobs widget. Candidates click through to your domain, not Indeed.',
  },
  {
    question: 'How do you set up a recruitment website with AI visibility?',
    answer:
      'Schema-first SSR architecture, named author bios, AEO-friendly answer blocks, entity-linked content, and monthly V.O.I.C.E methodology monitoring across ChatGPT, Perplexity, Claude, and Google AI Overviews. The goal is for AI engines to cite your agency by name when somebody asks for the best recruitment firm in your niche.',
  },
];

const comparisonRows: { feature: string; template: string; custom: string }[] = [
  { feature: 'You own the code', template: 'No (template SaaS)', custom: 'Yes' },
  { feature: 'Contract length', template: '3-year minimum', custom: 'None' },
  { feature: 'JSON-LD JobPosting schema', template: 'Inconsistent', custom: 'Auto-generated on every role' },
  { feature: 'Google for Jobs verified', template: 'Sometimes', custom: 'Day one, monitored monthly' },
  { feature: 'ChatGPT / Perplexity visibility', template: 'Not measured', custom: 'Tracked via V.O.I.C.E' },
  { feature: 'Mobile PageSpeed score', template: '30-50 typical', custom: '90+ target' },
  { feature: 'Brand differentiation', template: 'Template', custom: 'Bespoke design' },
  { feature: 'Support response', template: 'Tickets, days', custom: 'Direct, hours' },
  { feature: 'ATS migration', template: 'Painful, locked-in', custom: 'Stack-agnostic, sits over existing' },
];

export default function RecruitmentWebsiteDesignPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Services', url: `${BASE_URL}/services` },
    { name: 'Recruitment Website Design', url: PAGE_URL },
  ]);

  const serviceSchema = generateServiceSchema(
    'Recruitment Website Design',
    'Custom recruitment website design for UK agencies from £2,000. AI SEO included free. Schema-first SSR, Google for Jobs ready, ChatGPT-readable. Live Jobs Board add-on £1,999. Typical 10-page build with jobs board: £5,249.',
    PAGE_URL,
    'Service',
    {
      serviceType: 'Recruitment Website Design',
      audience: {
        '@type': 'BusinessAudience',
        audienceType: 'UK recruitment agencies',
      } as unknown as { '@id': string },
      offers: recruitmentServiceOffer,
    }
  );

  const webPageSchema = {
    ...generateWebPageSchema(
      'Recruitment Website Design UK | Custom-Built, Schema-First, AI-Visible | ScopeSite',
      'Custom recruitment website design for UK agencies from £2,000. AI SEO included free. Schema-first SSR, Google for Jobs ready, ChatGPT-readable. See the live demo.',
      PAGE_URL
    ),
    mainEntity: { '@id': `${PAGE_URL}/#service` },
  };

  const faqSchema = generateFAQSchema(recruitmentFaqs);

  return (
    <>
      <JsonLd schema={[webPageSchema, breadcrumbSchema, serviceSchema, faqSchema]} />

      {/* 1. Hero */}
      <section className="bg-brand-navy text-white py-section">
        <div className="container-content max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-display font-headline text-white mb-6 leading-tight uppercase">
            Recruitment{' '}
            <span className="text-[#FF1463]">Website Design</span>
            {' '}
            That Earns Its Place On Your P&amp;L
          </h1>
          <p className="text-body-lg text-white/90 max-w-3xl mx-auto mb-4">
            We don&apos;t replace your ATS. We build the website your ATS should have been sitting behind all along,
            schema-first, Google for Jobs verified, ChatGPT-readable, and yours to keep.
          </p>
          <p className="text-white/80 max-w-2xl mx-auto mb-10">
            Recruitment website design for UK agencies should not mean a rented template and a three-year lock-in.
            If you care about recruitment website cost, recruitment web design, and recruitment SEO in one build, this
            is the stack-agnostic layer that sits over Bullhorn, Idibu, or Tracker RMS without starting another{' '}
            <span className="whitespace-nowrap">ATS migration</span> drama.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-recruitment inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-[#FF1463] !text-white hover:!text-white font-bold text-lg shadow-lg hover:opacity-95 transition-opacity min-w-[240px] !no-underline hover:!no-underline visited:!text-white [&>svg]:!text-white"
            >
              See The Live Demo
              <ArrowRight className="w-5 h-5 shrink-0 !text-white" aria-hidden />
            </a>
            <Link
              href="/book"
              className="cta-recruitment-ghost inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-white border-2 border-brand-navy !text-brand-navy hover:!text-brand-navy font-bold !no-underline hover:!no-underline hover:bg-gray-100 transition-colors min-w-[200px] visited:!text-brand-navy [&>svg]:!text-brand-navy"
            >
              Book A Call
            </Link>
          </div>
          <div className="mt-12 max-w-3xl mx-auto rounded-2xl overflow-hidden border border-white/10 bg-white/5">
            <Image
              src="/images/recruitment/recruitment-website-design-hero.webp"
              alt="Recruitment website design example: schema-first UK agency build"
              width={1200}
              height={675}
              className="w-full h-auto"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>
        </div>
      </section>

      {/* 2. Indeed problem */}
      <section className="section-white border-b border-brand-navy/10" aria-labelledby="indeed-problem-heading">
        <div className="container-content max-w-3xl mx-auto">
          <h2 id="indeed-problem-heading" className="text-brand-navy text-2xl sm:text-3xl md:text-h2 font-bold mb-6">
            The recruitment website cost nobody talks about
          </h2>
          <div className="prose prose-lg text-muted max-w-none space-y-4">
            <p>
              Most UK recruitment agencies have a website. The website was built between 2018 and 2021 by a
              developer who described themselves as a digital agency. The website works, technically, in the sense that
              it loads when you type the URL into a browser.
            </p>
            <p>
              It also generates roughly three applications per role. Job boards generate twenty-five. Indeed has 250
              million monthly visitors. Your website attracts about 9% of total application volume.
            </p>
            <p>
              You have noticed this. You have spent the last decade paying Indeed £25 a day per sponsored job to get
              applications you used to get for free, back when you were giving them a free XML feed of your roles and
              they were still pretending to be on your side.
            </p>
            <p>
              Indeed is not on your side anymore. Volcanic locked you into a three-year contract for a template that
              looks like every other agency in your niche. WordPress breaks every time you push an update. CV-Library
              wants £199 per AI-screened ad and your candidates still ghost interviews.
            </p>
            <p>
              Whether you are comparing recruitment website development quotes, sizing up a recruitment website
              builder, or trying to fix recruitment marketing and{' '}
              <strong className="text-brand-navy">recruitment agency website design</strong> that does not embarrass
              you on mobile, the same truth applies: candidates discover roles through Google for Jobs, job posting
              schema, and AI answers long before they read your careers page design.{' '}
              <strong className="text-brand-navy">Website design for recruitment agencies</strong> is not vanity. It
              is where you prove you are serious enough to{' '}
              <span className="whitespace-nowrap">build a recruitment website</span> candidates trust, with{' '}
              <span className="whitespace-nowrap">recruitment website design uk</span> standards (fast, structured,
              measurable), not a brochure your recruitment agency software vendor forgot to update.
            </p>
            <p className="text-brand-navy font-medium">
              The website should be the one part of the stack that you own. It usually isn&apos;t. We fix that.
            </p>
          </div>
        </div>
      </section>

      {/* 3. What we build */}
      <section className="py-section bg-brand-navy/5 border-b border-brand-navy/10" aria-labelledby="what-we-build-heading">
        <div className="container-content">
          <h2 id="what-we-build-heading" className="text-brand-navy text-2xl sm:text-3xl md:text-h2 font-bold text-center mb-4">
            Recruitment website development, three ways we build it
          </h2>
          <p className="text-center text-muted max-w-2xl mx-auto mb-12">
            Recruitment website development, live jobs, and AI visibility in one coherent build.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <article className="rounded-2xl border border-brand-navy/10 bg-white p-8 shadow-sm flex flex-col">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-gold/10">
                <Briefcase className="h-7 w-7 text-brand-gold" aria-hidden />
              </div>
              <Image
                src="/images/recruitment/custom-recruitment-website.webp"
                alt="Custom recruitment website design example by ScopeSite"
                width={800}
                height={600}
                className="w-full rounded-lg mb-4 h-auto object-cover max-h-40"
              />
              <h3 className="text-xl font-bold text-brand-navy mb-1">Custom Recruitment Web Design</h3>
              <p className="text-brand-gold-accessible font-semibold text-sm mb-3">No templates. No 3-year contracts.</p>
              <p className="text-muted flex-1 text-sm leading-relaxed">
                Built in Next.js 16 with server-side rendering, schema-first architecture, and Lexend typography. You own
                the code. You own the domain. You own the candidates. We can hand the repo over on day one or host it
                for you, your call.
              </p>
              <p className="mt-4 text-sm font-bold text-brand-navy border-t border-brand-navy/10 pt-4">
                From £2,000 - AI SEO included free
              </p>
            </article>
            <article className="rounded-2xl border border-brand-navy/10 bg-white p-8 shadow-sm flex flex-col">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-gold/10">
                <FileSearch className="h-7 w-7 text-brand-gold" aria-hidden />
              </div>
              <Image
                src="/images/recruitment/live-jobs-board-auto-schema.webp"
                alt="Live jobs board with auto-generated JobPosting schema"
                width={800}
                height={600}
                className="w-full rounded-lg mb-4 h-auto object-cover max-h-40"
              />
              <h3 className="text-xl font-bold text-brand-navy mb-1">Live Jobs Board with Google for Jobs Schema</h3>
              <p className="text-brand-gold-accessible font-semibold text-sm mb-3">Google for Jobs verified from day one.</p>
              <p className="text-muted flex-1 text-sm leading-relaxed">
                Every role on your site auto-generates valid JSON-LD JobPosting schema, title, salary, location,
                employment type, all of it. Google for Jobs reads the page and lists your vacancy in the embedded
                widget. Candidates click through to your domain, not Indeed.
              </p>
              <p className="mt-4 text-sm font-bold text-brand-navy border-t border-brand-navy/10 pt-4">
                £1,999 add-on
              </p>
            </article>
            <article className="rounded-2xl border border-brand-navy/10 bg-white p-8 shadow-sm flex flex-col">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-gold/10">
                <Sparkles className="h-7 w-7 text-brand-gold" aria-hidden />
              </div>
              <Image
                src="/images/recruitment/ai-visibility-recruitment-agency.webp"
                alt="AI visibility for UK recruitment agencies via V.O.I.C.E methodology"
                width={800}
                height={600}
                className="w-full rounded-lg mb-4 h-auto object-cover max-h-40"
              />
              <h3 className="text-xl font-bold text-brand-navy mb-1">AI Visibility for Recruitment Agencies</h3>
              <p className="text-brand-gold-accessible font-semibold text-sm mb-3">
                ChatGPT, Perplexity, Claude, Google AI Overviews.
              </p>
              <p className="text-muted flex-1 text-sm leading-relaxed">
                Your agency becomes machine-readable. Schema, named author bios, entity-linked content, AEO-friendly
                answer blocks. When somebody asks Claude &quot;best legal recruitment agency in Bristol,&quot; your firm
                gets cited. Monthly visibility reports included.
              </p>
              <p className="mt-4 text-sm font-bold text-brand-navy border-t border-brand-navy/10 pt-4">
                V.O.I.C.E methodology, monthly retainer
              </p>
            </article>
          </div>
          <div className="mt-12 flex flex-col items-center gap-4 text-center">
            <p className="max-w-2xl text-lg text-brand-navy/80">
              Not sure which build fits your agency? Thirty minutes on a call sorts it. No pitch deck, no obligation.
            </p>
            <Link
              href="/book"
              className="cta-recruitment inline-flex items-center justify-center gap-2 rounded-full bg-[#FF1463] px-8 py-4 font-bold !text-white hover:!text-white !no-underline hover:!no-underline hover:opacity-90 transition-opacity visited:!text-white [&>svg]:!text-white"
            >
              Book A Discovery Call
              <ArrowRight className="h-5 w-5 shrink-0 !text-white" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Live demo CTA */}
      <section className="py-section bg-[#1E1F5C] text-white" aria-labelledby="demo-heading">
        <div className="container-content max-w-3xl mx-auto text-center">
          <h2 id="demo-heading" className="text-2xl sm:text-3xl md:text-h2 font-bold mb-4">
            See A Recruitment Website Builder Built For You, Not For Templates
          </h2>
          <p className="text-white/85 mb-8 leading-relaxed">
            We built a fully interactive demo prototype. Three perspectives, the recruiter admin view, the candidate
            view, and the engine room where the schema fires, Google indexes the role, and the AI engines get pushed
            the listing. No login, no signup. Just click.
          </p>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-recruitment inline-flex items-center justify-center gap-2 px-10 py-5 rounded-lg bg-[#FF1463] !text-white hover:!text-white font-bold text-lg shadow-lg hover:opacity-95 transition-opacity !no-underline hover:!no-underline visited:!text-white [&>svg]:!text-white"
          >
            Open The Live Demo
            <ArrowRight className="w-5 h-5 shrink-0 !text-white" aria-hidden />
          </a>
          <p className="mt-4 text-sm text-white/70">Your real jobs board, custom-built. Not a SaaS.</p>
        </div>
      </section>

      {/* 5. Comparison */}
      <section className="section-white border-b border-brand-navy/10" aria-labelledby="compare-heading">
        <div className="container-content max-w-5xl mx-auto">
          <h2 id="compare-heading" className="text-brand-navy text-2xl sm:text-3xl md:text-h2 font-bold mb-4 text-center">
            Recruitment Website Design UK vs Access Volcanic and Firefish Software
          </h2>
          <p className="text-center text-muted max-w-2xl mx-auto mb-8">
            Honest comparison for owners weighing recruitment web design against template SaaS. Your ATS (Bullhorn,
            Idibu, Tracker RMS, or other) stays; the public site becomes yours again.
          </p>
          <div className="overflow-x-auto rounded-xl border border-brand-navy/10">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="bg-brand-navy/5 border-b border-brand-navy/10">
                  <th scope="col" className="p-4 font-bold text-brand-navy">
                    Feature
                  </th>
                  <th scope="col" className="p-4 font-bold text-brand-navy">
                    Volcanic / Firefish / WordPress
                  </th>
                  <th scope="col" className="p-4 font-bold text-brand-navy">
                    ScopeSite Custom
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.feature} className="border-b border-brand-navy/10 last:border-0">
                    <th scope="row" className="p-4 font-medium text-brand-navy align-top">
                      {row.feature}
                    </th>
                    <td className="p-4 text-muted align-top">{row.template}</td>
                    <td className="p-4 text-brand-navy font-medium align-top">{row.custom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-8 text-muted leading-relaxed max-w-3xl mx-auto">
            Access Volcanic charges £899 a month over three years. Firefish charges £105 per user per month.
            CV-Library charges £199 per AI Premium ad. The total cost of staying on a template platform with rented
            candidate visibility over a typical three-year contract is roughly £43,000.
          </p>
          <p className="mt-4 text-muted leading-relaxed max-w-3xl mx-auto">
            A 10-page recruitment build with a live jobs board is £5,249, one-off. AI SEO included free. Same price
            whether you pay in full, spread over 6 months, or 12 months. No interest, no credit charges.
          </p>
          <p className="mt-4 text-muted leading-relaxed max-w-3xl mx-auto">
            Volcanic at £899 a month over a three-year lock-in is £32,364. We are roughly one-sixth of that, and you own
            the code at the end.
          </p>
        </div>
      </section>

      {/* 6. Fee maths */}
      <section className="py-section bg-brand-navy/5 border-b border-brand-navy/10" aria-labelledby="fee-maths-heading">
        <div className="container-content max-w-4xl mx-auto">
          <h2 id="fee-maths-heading" className="text-brand-navy text-2xl sm:text-3xl md:text-h2 font-bold text-center mb-6">
            Recruitment Website Cost, Honest Maths
          </h2>
          <p className="text-muted text-center max-w-3xl mx-auto mb-6 leading-relaxed">
            A typical recruitment build with us is £5,249. That covers a 10-page Ultra Fast SSR site, a Live Jobs Board
            with auto-schema, AI SEO bundled free, and the same price whether you pay in full, spread over 6 months, or
            12 months.
          </p>
          <p className="text-muted text-center max-w-3xl mx-auto mb-12 leading-relaxed">
            Volcanic costs £32,364 over a three-year lock-in. We are roughly one-sixth of that, and you own the code at
            the end.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div className="rounded-2xl bg-white border border-brand-navy/10 p-6 shadow-sm">
              <p className="text-3xl md:text-4xl font-headline text-brand-navy mb-2">£5,249</p>
              <p className="text-sm text-muted">Your build (10-page SSR + Live Jobs Board)</p>
            </div>
            <div className="rounded-2xl bg-white border border-brand-navy/10 p-6 shadow-sm">
              <p className="text-3xl md:text-4xl font-headline text-brand-navy mb-2">£32,364</p>
              <p className="text-sm text-muted">Volcanic over a 3-year lock-in</p>
            </div>
            <div className="rounded-2xl bg-white border border-brand-navy/10 p-6 shadow-sm">
              <p className="text-3xl md:text-4xl font-headline text-brand-navy mb-2">£10,000</p>
              <p className="text-sm text-muted">Indeed at £25/day x 14 sponsored jobs for one month</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Process */}
      <section className="section-white border-b border-brand-navy/10" aria-labelledby="process-heading">
        <div className="container-content max-w-5xl mx-auto">
          <h2 id="process-heading" className="text-brand-navy text-2xl sm:text-3xl md:text-h2 font-bold text-center mb-12">
            How To Build A Recruitment Website In Eight Weeks
          </h2>
          <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 list-none p-0 m-0">
            <li className="relative rounded-2xl border border-brand-navy/10 bg-white p-6 pt-10">
              <span className="absolute top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold text-brand-navy font-bold text-sm">
                1
              </span>
              <h3 className="font-bold text-brand-navy mb-2 mt-2">Discovery call (30 min)</h3>
              <p className="text-sm text-muted leading-relaxed">
                We map your desks, your placement volumes, and what your candidates actually search for.
              </p>
            </li>
            <li className="relative rounded-2xl border border-brand-navy/10 bg-white p-6 pt-10">
              <span className="absolute top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold text-brand-navy font-bold text-sm">
                2
              </span>
              <h3 className="font-bold text-brand-navy mb-2 mt-2">Schema audit (we do this)</h3>
              <p className="text-sm text-muted leading-relaxed">
                Live JSON-LD inspection of your current site, your top three competitors, and the Google for Jobs
                verification status of each.
              </p>
            </li>
            <li className="relative rounded-2xl border border-brand-navy/10 bg-white p-6 pt-10">
              <span className="absolute top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold text-brand-navy font-bold text-sm">
                3
              </span>
              <h3 className="font-bold text-brand-navy mb-2 mt-2">Build (5-6 weeks)</h3>
              <p className="text-sm text-muted leading-relaxed">
                Next.js 16, schema-first, Lexend typography, Vercel multi-region hosting. You see the staging site
                weekly.
              </p>
            </li>
            <li className="relative rounded-2xl border border-brand-navy/10 bg-white p-6 pt-10">
              <span className="absolute top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold text-brand-navy font-bold text-sm">
                4
              </span>
              <h3 className="font-bold text-brand-navy mb-2 mt-2">Launch + V.O.I.C.E baseline (week 7-8)</h3>
              <p className="text-sm text-muted leading-relaxed">
                Site goes live. We measure AI visibility across ChatGPT, Perplexity, Claude, and Google AI Overviews.
                Monthly reports begin.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-section bg-brand-navy/5 border-b border-brand-navy/10" aria-labelledby="faq-heading">
        <div className="container-content max-w-3xl mx-auto">
          <h2 id="faq-heading" className="text-brand-navy text-2xl sm:text-3xl md:text-h2 font-bold text-center mb-10">
            Recruitment Website Design FAQ
          </h2>
          <div className="space-y-3">
            {recruitmentFaqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-brand-navy/10 bg-white px-5 open:shadow-sm"
              >
                <summary className="cursor-pointer list-none py-4 font-medium text-brand-navy flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <span className="text-brand-gold text-xl shrink-0 group-open:rotate-180 transition-transform" aria-hidden>
                    ▼
                  </span>
                </summary>
                <p className="faq-answer pb-4 text-muted text-sm leading-relaxed border-t border-brand-navy/5 pt-3">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="py-section bg-[#FF1463] text-white" aria-labelledby="final-cta-heading">
        <div className="container-content max-w-3xl mx-auto text-center">
          <h2 id="final-cta-heading" className="text-2xl sm:text-3xl md:text-h2 font-bold mb-4">
            Your real jobs board, custom-built. Not a SaaS.
          </h2>
          <p className="text-white/95 mb-10 leading-relaxed">
            The demo is live. The price is on the page. The maths works on one placement. The only thing left is the
            conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-recruitment-ghost-on-magenta inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-white !text-brand-navy hover:!text-brand-navy font-bold !no-underline hover:!no-underline hover:bg-gray-100 transition-colors [&>svg]:!text-brand-navy"
            >
              Open The Live Demo
              <ArrowRight className="w-5 h-5 shrink-0 !text-brand-navy" aria-hidden />
            </a>
            <Link
              href="/book"
              className="cta-recruitment-outline-on-magenta inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border-2 border-white bg-transparent !text-white hover:!text-white font-bold !no-underline hover:!no-underline hover:bg-white/10 transition-colors visited:!text-white"
            >
              Book A Call
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
