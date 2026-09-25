import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Briefcase, FileSearch, Sparkles, ArrowRight } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { RwdOutboundLink } from '@/components/rwd/RwdOutboundLink';
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
    'Custom recruitment website design from £2,000. AI SEO included free with SSR. A typical 10-page SSR site plus Live Jobs Board is £5,249 one-off.',
  availability: 'https://schema.org/InStock',
  priceValidUntil: '2026-12-31',
  seller: { '@id': `${BASE_URL}/#organization` },
};

export const metadata: Metadata = {
  title: 'Recruitment Website Design UK | ScopeSite introduction',
  description:
    'ScopeSite introduction to recruitment website design for UK agencies. The specialist site is Recruitment Web Design. Typical 10-page SSR plus Live Jobs Board is £5,249.',
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Recruitment Website Design | ScopeSite and Recruitment Web Design',
    description:
      'Parent introduction for UK recruitment agencies. Routes to the specialist site for the website, ATS, jobs board, and demos.',
    url: PAGE_URL,
    type: 'website',
    images: [
      {
        url: 'https://scopesite.co.uk/og/recruitment-website-design.png',
        width: 1200,
        height: 630,
        alt: 'ScopeSite recruitment website design introduction',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recruitment Website Design UK | ScopeSite',
    description:
      'Parent introduction for UK agency owners. The specialist site is Recruitment Web Design.',
  },
};

const recruitmentFaqs: FAQItem[] = [
  {
    question: 'What does the agency supply, and what stays with us?',
    answer:
      'You keep the ATS, the candidate records, and the decision about which vacancies are real. ScopeSite supplies the public website: pages, enquiry path, and, if you add it, a Live Jobs Board that can carry JobPosting schema. Recruitment Web Design is the specialist site that explains that work in detail.',
  },
  {
    question: 'How much does a recruitment website cost in the UK?',
    answer:
      'A custom Ultra Fast SSR recruitment website starts at £2,000 for up to 5 pages. A 10-page SSR build is £3,250. The Live Jobs Board add-on is £1,999. Together that is £5,249, one-off, and AI SEO is included free with the SSR build. Pay in Full, 6 months, and 12 months are the same total. Pay Monthly Service is a separate subscription: ScopeSite keeps ownership during the subscription, and a buyout is optional after the 6-month minimum. See https://scopesite.co.uk/pricing for the tier fees.',
  },
  {
    question: 'Does a jobs board depend on our ATS?',
    answer:
      'The public site does not replace the ATS. A live board needs vacancies you are actually recruiting. Some agencies post them on the site, and some want the ATS to feed them. What your current system can send is covered on the specialist ATS integrations page: https://recruitmentwebdesign.com/ats-integrations',
  },
  {
    question: 'Will a job appear in Google for Jobs?',
    answer:
      'JobPosting schema makes a real vacancy eligible for Google for Jobs. Eligibility is the limit of what the markup does. Google decides whether a role appears, and when. Demo listings are sample data and are not live vacancies.',
  },
];

const specialistRoutes: { hrefLabel: string; destination: 'website_design' | 'ats' | 'jobs_board' | 'ai_visibility' | 'software' | 'demos'; text: string }[] = [
  {
    hrefLabel: 'Recruitment website design on the specialist site',
    destination: 'website_design',
    text: 'The page that explains the website itself, for agency owners who want the build detail.',
  },
  {
    hrefLabel: 'ATS integrations',
    destination: 'ats',
    text: 'How a public site sits beside the ATS you already run, and what has to be supplied.',
  },
  {
    hrefLabel: 'Live jobs board',
    destination: 'jobs_board',
    text: 'The jobs layer, including JobPosting schema and the difference between a demo and a real role.',
  },
  {
    hrefLabel: 'AI search visibility for recruitment',
    destination: 'ai_visibility',
    text: 'How the public pages are written so a crawler can read the agency, without a promise of citations.',
  },
  {
    hrefLabel: 'Recruitment software',
    destination: 'software',
    text: 'Where software ends and the website starts, so the two are not treated as the same product.',
  },
  {
    hrefLabel: 'Current recruitment demos',
    destination: 'demos',
    text: 'Walkthroughs of the current specialist demos. Sample data, not your live jobs.',
  },
];

export default function RecruitmentWebsiteDesignPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Services', url: `${BASE_URL}/services` },
    { name: 'Recruitment Website Design', url: PAGE_URL },
  ]);

  const serviceSchema = generateServiceSchema(
    'Recruitment Website Design',
    'Parent introduction to recruitment website design for UK agencies. ScopeSite delivers the site. Recruitment Web Design is the specialist site. From £2,000. Typical 10-page SSR plus Live Jobs Board: £5,249.',
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
      'Recruitment Website Design UK | ScopeSite introduction',
      'Parent introduction for UK recruitment agencies. Routes to Recruitment Web Design for the website, ATS, jobs board, software, and demos.',
      PAGE_URL
    ),
    mainEntity: { '@id': `${PAGE_URL}/#service` },
  };

  const faqSchema = generateFAQSchema(recruitmentFaqs);

  return (
    <>
      <JsonLd schema={[webPageSchema, breadcrumbSchema, serviceSchema, faqSchema]} />

      <section className="bg-brand-navy text-white py-section">
        <div className="container-content max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-display font-headline text-white mb-6 leading-tight uppercase">
            Recruitment{' '}
            <span className="text-[#FF1463]">Website Design</span>
          </h1>
          <p className="text-body-lg text-white/90 max-w-3xl mx-auto mb-4">
            ScopeSite builds the site. Recruitment Web Design is the specialist site for UK agency
            owners who need the public page, the jobs, and a straight way for a client to enquire.
          </p>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            This page is the parent introduction. It stays on scopesite.co.uk. The working detail,
            the ATS notes, and the current demos live on recruitmentwebdesign.com, which is the
            specialist site we run for this work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <RwdOutboundLink
              destination="demos"
              page="recruitment_intro"
              placement="demo"
              className="cta-recruitment inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-[#FF1463] !text-white hover:!text-white font-bold text-lg shadow-lg hover:opacity-95 transition-opacity min-w-[240px] !no-underline hover:!no-underline visited:!text-white [&>svg]:!text-white"
            >
              See current recruitment demos
              <ArrowRight className="w-5 h-5 shrink-0 !text-white" aria-hidden />
            </RwdOutboundLink>
            <Link
              href="/book"
              className="cta-recruitment-ghost inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-white border-2 border-brand-navy !text-brand-navy hover:!text-brand-navy font-bold !no-underline hover:!no-underline hover:bg-gray-100 transition-colors min-w-[200px] visited:!text-brand-navy [&>svg]:!text-brand-navy"
            >
              Book a call
            </Link>
          </div>
          <div className="mt-12 max-w-3xl mx-auto rounded-2xl overflow-hidden border border-white/10 bg-white/5">
            <Image
              src="/images/recruitment/recruitment-website-design-hero.webp"
              alt="Laptop mockup showing a recruitment website on screen"
              width={1200}
              height={675}
              className="w-full h-auto"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>
        </div>
      </section>

      <section className="section-white border-b border-brand-navy/10" aria-labelledby="relationship-heading">
        <div className="container-content max-w-3xl mx-auto">
          <h2 id="relationship-heading" className="text-brand-navy text-2xl sm:text-3xl md:text-h2 font-bold mb-6">
            Parent studio, specialist site
          </h2>
          <div className="prose prose-lg text-muted max-w-none space-y-4">
            <p>
              An agency already pays for an ATS, a job board or two, and a website that was meant to
              be the shop window. The window is the bit clients actually see, and it is also the bit
              that goes stale while the ATS keeps the real vacancies.
            </p>
            <p>
              ScopeSite is the studio that delivers the build, the same way it delivers other UK
              sites. Recruitment Web Design is the specialist site for this buyer, with the pages
              that go into the website, the jobs board, the ATS question, and the demos. Use those
              pages when you want the detail. Use this page when you want the relationship and the
              price in one place.
            </p>
            <p>
              JobBoard Sonar was an earlier interactive demo of the schema idea. The current
              walkthroughs are on the specialist demos page, and Sonar is only mentioned here so
              older references have somewhere honest to land.
            </p>
          </div>
        </div>
      </section>

      <section className="py-section bg-brand-navy/5 border-b border-brand-navy/10" aria-labelledby="routes-heading">
        <div className="container-content max-w-3xl mx-auto">
          <h2 id="routes-heading" className="text-brand-navy text-2xl sm:text-3xl md:text-h2 font-bold mb-4">
            Where to go on the specialist site
          </h2>
          <ul className="space-y-4">
            {specialistRoutes.map((route) => (
              <li key={route.destination} className="rounded-xl border border-brand-navy/10 bg-white p-5">
                <RwdOutboundLink
                  destination={route.destination}
                  page="recruitment_intro"
                  placement="body"
                  className="font-semibold text-brand-navy underline underline-offset-4"
                >
                  {route.hrefLabel}
                </RwdOutboundLink>
                <p className="text-muted mt-2 text-sm leading-relaxed">{route.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-section bg-white border-b border-brand-navy/10" aria-labelledby="what-we-build-heading">
        <div className="container-content">
          <h2 id="what-we-build-heading" className="text-brand-navy text-2xl sm:text-3xl md:text-h2 font-bold text-center mb-4">
            What the build actually covers
          </h2>
          <p className="text-center text-muted max-w-2xl mx-auto mb-12">
            Three parts. The public site, the jobs layer, and the writing a crawler can read.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <article className="rounded-2xl border border-brand-navy/10 bg-white p-8 shadow-sm flex flex-col">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-gold/10">
                <Briefcase className="h-7 w-7 text-brand-gold" aria-hidden />
              </div>
              <Image
                src="/images/recruitment/custom-recruitment-website.webp"
                alt="Graphic with the headline Ultra-Fast AI Visible Next Gen"
                width={800}
                height={600}
                className="w-full rounded-lg mb-4 h-auto object-cover max-h-40"
              />
              <h3 className="text-xl font-bold text-brand-navy mb-3">The public website</h3>
              <p className="text-muted flex-1 text-sm leading-relaxed">
                Server-rendered pages for the desks you cover, the people a client should contact,
                and a form that lands somewhere a human reads. On a purchase paid in full, or over
                6 or 12 months, you buy the build. On Pay Monthly Service you licence it, and
                ScopeSite keeps ownership until a buyout.
              </p>
              <p className="mt-4 text-sm font-bold text-brand-navy border-t border-brand-navy/10 pt-4">
                From £2,000. AI SEO included free with SSR.
              </p>
            </article>
            <article className="rounded-2xl border border-brand-navy/10 bg-white p-8 shadow-sm flex flex-col">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-gold/10">
                <FileSearch className="h-7 w-7 text-brand-gold" aria-hidden />
              </div>
              <Image
                src="/images/recruitment/live-jobs-board-auto-schema.webp"
                alt="Graphic reading Job Vacancies Visible to AI"
                width={800}
                height={600}
                className="w-full rounded-lg mb-4 h-auto object-cover max-h-40"
              />
              <h3 className="text-xl font-bold text-brand-navy mb-3">Live jobs, when they are real</h3>
              <p className="text-muted flex-1 text-sm leading-relaxed">
                The Live Jobs Board can put JobPosting schema on a vacancy you publish. That makes
                the role eligible for Google for Jobs. It does not book a slot, and a demo role is
                sample data. Your ATS still holds the process behind the advert.
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
                alt="Graphic with a Recommended label and the headline Not Just Cited"
                width={800}
                height={600}
                className="w-full rounded-lg mb-4 h-auto object-cover max-h-40"
              />
              <h3 className="text-xl font-bold text-brand-navy mb-3">Pages a crawler can read</h3>
              <p className="text-muted flex-1 text-sm leading-relaxed">
                Structured facts about the agency, the sectors, and the jobs. Useful original
                answers on the page. None of that buys a citation, a ranking, or an index. It gives
                the crawler something accurate to work with.
              </p>
              <p className="mt-4 text-sm font-bold text-brand-navy border-t border-brand-navy/10 pt-4">
                Included with SSR. Standalone retainer is separate.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="py-section bg-[#1E1F5C] text-white" aria-labelledby="demo-heading">
        <div className="container-content max-w-3xl mx-auto text-center">
          <h2 id="demo-heading" className="text-2xl sm:text-3xl md:text-h2 font-bold mb-4">
            Demos use sample jobs
          </h2>
          <p className="text-white/85 mb-8 leading-relaxed">
            The current demos show the recruiter view, the candidate view, and the schema on a
            sample role. They are not your vacancies, and they are not a Google for Jobs listing.
            When a build goes live, only jobs you choose to publish are eligible.
          </p>
          <RwdOutboundLink
            destination="demos"
            page="recruitment_intro"
            placement="demo"
            className="cta-recruitment inline-flex items-center justify-center gap-2 px-10 py-5 rounded-lg bg-[#FF1463] !text-white hover:!text-white font-bold text-lg shadow-lg hover:opacity-95 transition-opacity !no-underline hover:!no-underline visited:!text-white [&>svg]:!text-white"
          >
            Open the specialist demos
            <ArrowRight className="w-5 h-5 shrink-0 !text-white" aria-hidden />
          </RwdOutboundLink>
        </div>
      </section>

      <section className="py-section bg-brand-navy/5 border-b border-brand-navy/10" aria-labelledby="fee-maths-heading">
        <div className="container-content max-w-4xl mx-auto">
          <h2 id="fee-maths-heading" className="text-brand-navy text-2xl sm:text-3xl md:text-h2 font-bold text-center mb-6">
            The £5,249 bundle, and what it leaves out
          </h2>
          <p className="text-muted text-center max-w-3xl mx-auto mb-6 leading-relaxed">
            10-page Ultra Fast SSR is £3,250. Live Jobs Board is £1,999. The one-off total is
            £5,249, the same figure on Pay in Full, 6 months, or 12 months. AI SEO is included
            with the SSR build. The published tables are on the pricing page, and the calculator
            there is the quote.
          </p>
          <p className="text-muted text-center max-w-3xl mx-auto mb-10 leading-relaxed">
            Pay Monthly Service is a different product. You pay a setup and a monthly fee, you
            hold a licence, and ScopeSite keeps the build until you buy it out after the minimum
            term. Monthly payments do not count toward that buyout. The bundle price above is the
            purchase, not the subscription.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div className="rounded-2xl bg-white border border-brand-navy/10 p-6 shadow-sm">
              <p className="text-3xl md:text-4xl font-headline text-brand-navy mb-2">£3,250</p>
              <p className="text-sm text-muted">10-page Ultra Fast SSR, AI SEO included</p>
            </div>
            <div className="rounded-2xl bg-white border border-brand-navy/10 p-6 shadow-sm">
              <p className="text-3xl md:text-4xl font-headline text-brand-navy mb-2">£1,999</p>
              <p className="text-sm text-muted">Live Jobs Board add-on</p>
            </div>
            <div className="rounded-2xl bg-white border border-brand-navy/10 p-6 shadow-sm">
              <p className="text-3xl md:text-4xl font-headline text-brand-navy mb-2">£5,249</p>
              <p className="text-sm text-muted">One-off total, full, 6 months, or 12 months</p>
            </div>
          </div>
          <p className="text-center mt-8">
            <Link href="/pricing" className="text-brand-navy font-semibold underline underline-offset-4">
              Open the pricing page and the quote calculator
            </Link>
          </p>
        </div>
      </section>

      <section className="section-white border-b border-brand-navy/10" aria-labelledby="next-heading">
        <div className="container-content max-w-3xl mx-auto">
          <h2 id="next-heading" className="text-brand-navy text-2xl sm:text-3xl font-bold mb-4">
            A useful next step
          </h2>
          <p className="text-muted leading-relaxed mb-4">
            If you want to see the product, open the specialist demos. If you want a price for
            your page count, use the calculator. If the ATS question is the one that matters,
            read the integrations page before the call, then book twenty minutes and bring the
            system name with you.
          </p>
          <p className="text-brand-navy font-medium">Up to you.</p>
        </div>
      </section>

      <section className="py-section bg-brand-navy/5 border-b border-brand-navy/10" aria-labelledby="faq-heading">
        <div className="container-content max-w-3xl mx-auto">
          <h2 id="faq-heading" className="text-brand-navy text-2xl sm:text-3xl md:text-h2 font-bold text-center mb-10">
            Recruitment website design FAQ
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

      <section className="py-section bg-[#FF1463] text-white" aria-labelledby="final-cta-heading">
        <div className="container-content max-w-3xl mx-auto text-center">
          <h2 id="final-cta-heading" className="text-2xl sm:text-3xl md:text-h2 font-bold mb-4">
            The specialist site has the demos
          </h2>
          <p className="text-white/95 mb-10 leading-relaxed">
            This page stays here as the ScopeSite introduction. The demos, the jobs board notes,
            and the ATS page are one click away on Recruitment Web Design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <RwdOutboundLink
              destination="demos"
              page="recruitment_intro"
              placement="demo"
              className="cta-recruitment-ghost-on-magenta inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-white !text-brand-navy hover:!text-brand-navy font-bold !no-underline hover:!no-underline hover:bg-gray-100 transition-colors [&>svg]:!text-brand-navy"
            >
              Open the specialist demos
              <ArrowRight className="w-5 h-5 shrink-0 !text-brand-navy" aria-hidden />
            </RwdOutboundLink>
            <Link
              href="/book"
              className="cta-recruitment-outline-on-magenta inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border-2 border-white bg-transparent !text-white hover:!text-white font-bold !no-underline hover:!no-underline hover:bg-white/10 transition-colors visited:!text-white"
            >
              Book a call
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
