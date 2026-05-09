import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { JsonLd } from '@/components/JsonLd';
import {
  generateBreadcrumbSchema,
  generateReviewsSchema,
  generateSpeakableSchema,
  generateWebPageSchema,
  generateFAQSchema,
  generateItemListSchema,
  type FAQItem,
} from '@/lib/schema';
import { getAlternates } from '@/lib/hreflang-map';
import { ChevronDown } from 'lucide-react';
import { HomeBelowFoldWrapper } from './HomeBelowFoldWrapper';
import { PRICING_CONFIG } from '@/lib/pricing-config';

const BASE_URL = 'https://scopesite.co.uk';
const VOICE_SCAN_URL = 'https://voice.scopesite.co.uk';
const WIX_FROM = PRICING_CONFIG.baseWebsite.starter;
const ULTRA_FROM = PRICING_CONFIG.ssrWebsite.base;

export const metadata: Metadata = {
  title: 'AI-Visible Websites That Get Recommended | ScopeSite',
  description:
    'When someone asks ChatGPT for a business like yours, whose name comes up? We build sites AI can read, trust, and recommend. Veteran-owned, Somerset.',
  openGraph: {
    title: 'AI-Visible Websites That Get Recommended | ScopeSite Digital Studios',
    description:
      'When someone asks ChatGPT for a business like yours, whose name comes up? We build sites AI can read, trust, and recommend. Veteran-owned, Somerset.',
    url: BASE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-home.png`,
        width: 1200,
        height: 630,
        alt: 'ScopeSite — websites AI can recommend',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Visible Websites That Get Recommended | ScopeSite',
    description:
      'When someone asks ChatGPT for a business like yours, whose name comes up? We build sites AI can read, trust, and recommend. Veteran-owned, Somerset.',
    images: [`${BASE_URL}/images/og/og-home.png`],
  },
  alternates: getAlternates('/', BASE_URL),
};

const googleReviews = [
  {
    author: 'Michelle Mitchell',
    reviewBody:
      'Great service from Scopesite, being completely naive with what building a website entailed and not having a clue about it, Dan made everything so easy and stress free. Best website design company in Somerset!',
    datePublished: '2025-05-15',
  },
  {
    author: 'Colin Ferbrache',
    reviewBody:
      'Dan has helped our business from the very beginning, and has been proactive in helping drive our business. The value he has provided has been more than worth the cost.',
    datePublished: '2025-05-15',
  },
  {
    author: 'Koalla Da 13',
    reviewBody:
      'We had Dan from Scopesite build us a website for our flying school in Bristol. Talk about above and beyond! Professional, responsive, and delivered exactly what we needed.',
    datePublished: '2025-05-15',
  },
  {
    author: 'Louis Dunn',
    reviewBody:
      'Dan demonstrated exceptional performance and proficiency in his work. His pricing remains competitive and reasonable. Highly recommended for any web design needs.',
    datePublished: '2025-04-10',
  },
  {
    author: 'Dean James',
    reviewBody: 'Excellent service, will use again!',
    datePublished: '2024-12-23',
  },
  {
    author: 'Rebecca Archer',
    reviewBody:
      "Excellent communication and finished website. He took care of all the jargon bits such as search engine optimisation so I didn't have to worry about a thing.",
    datePublished: '2024-12-09',
  },
];

const homeFaqs: FAQItem[] = [
  {
    question: 'What does AI visibility mean, without the jargon?',
    answer:
      'It means when someone asks an AI assistant for a recommendation, your business can actually be in the answer. If the AI cannot read your site properly, you are not in the running. We fix the technical side so you are.',
  },
  {
    question: 'Why would a solicitor, accountant, or dentist care about ChatGPT?',
    answer:
      'Because people already ask AI who to hire and who to trust. If your competitor shows up and you do not, you just lost an enquiry you never knew existed. This is not about tech for tech’s sake, it is about being in the conversation when buyers ask.',
  },
  {
    question: 'My website looks fine. Why would AI ignore it?',
    answer:
      'Looking fine to a human is not the same as being readable to a machine. Many template sites load empty shells first and fill in content with JavaScript. AI crawlers often do not run that JavaScript, so they see a blank page. We deliver the full page as HTML from the server, like handing over a typed letter instead of a locked box.',
  },
  {
    question: 'How is this different from normal SEO?',
    answer:
      'Classic SEO chases rankings in Google’s list of blue links. AI visibility is about being cited and recommended inside ChatGPT, Perplexity, Google AI Overviews, and similar. You want both, but they are not the same game.',
  },
  {
    question: 'What is the free AI visibility scan?',
    answer:
      'It is our quick check that scores how well AI systems can read and trust your site. The free scan at voice.scopesite.co.uk shows where you stand today across the categories we track.',
  },
  {
    question: 'How much does a website cost?',
    answer: `Straight numbers: client-managed sites start from £${WIX_FROM.toLocaleString('en-GB')} for up to five pages. Ultra Fast AI visible premium builds start from £${ULTRA_FROM.toLocaleString('en-GB')} for up to five pages, with a published £8,000 cap before enterprise scoping. Payment plans with no interest. Instant quote on our pricing page in a couple of minutes. Every build includes structured data and pages built for speed and AI visibility.`,
  },
  {
    question: 'Do you only work in Somerset?',
    answer:
      'We are based in Frome and work with firms across the South West and nationwide. The process is the same whether you are round the corner or three hundred miles away.',
  },
];

export default function Home() {
  const breadcrumbSchema = generateBreadcrumbSchema([{ name: 'Home', url: BASE_URL }]);

  const reviewSchemas = generateReviewsSchema(googleReviews);

  const homePageSchema = {
    ...generateWebPageSchema(
      'AI-Visible Websites That Get Recommended | ScopeSite Digital Studios',
      'When someone asks ChatGPT or Perplexity for a business like yours, whose name comes up? Veteran-owned web design in Somerset. Sites AI can read, trust, and recommend.',
      BASE_URL
    ),
    speakable: generateSpeakableSchema(['h1', '.hero-description', '.faq-answer', 'h2']),
  };

  const faqSchema = generateFAQSchema(homeFaqs);

  const homeServiceSchemas = [
    {
      '@type': 'Service',
      '@id': `${BASE_URL}/web-design/#service`,
      serviceType: 'AI-Visible Web Design',
      name: 'Web Design by ScopeSite',
      description:
        'Websites built for speed and AI visibility. Structured data, fast load, built for solicitors, accountants, and professional services.',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: { '@type': 'Place', name: 'Somerset, United Kingdom' },
      url: `${BASE_URL}/web-design`,
    },
    {
      '@type': 'Service',
      '@id': `${BASE_URL}/voice/#service`,
      serviceType: 'AI Visibility Optimisation',
      name: 'AI SEO and AI visibility by ScopeSite',
      description:
        'AI SEO retainers, AI visibility audits, and ongoing optimisation. Free scan and paid programmes.',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: { '@type': 'Place', name: 'United Kingdom' },
      url: `${BASE_URL}/voice`,
    },
    {
      '@type': 'Service',
      '@id': `${BASE_URL}/schema-markup/#service`,
      serviceType: 'Structured Data Implementation',
      name: 'Schema Markup by ScopeSite',
      description:
        'Hand-built structured data so AI and search engines know exactly what you do, where you are, and why you are credible.',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: { '@type': 'Place', name: 'United Kingdom' },
      url: `${BASE_URL}/schema-markup`,
    },
    {
      '@type': 'Service',
      '@id': `${BASE_URL}/web-apps/#service`,
      serviceType: 'Custom Web Application Development',
      name: 'Custom Web Apps by ScopeSite',
      description: 'Custom tools and web applications for workflows, quotes, portals, and automation.',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: { '@type': 'Place', name: 'United Kingdom' },
      url: `${BASE_URL}/web-apps`,
    },
    {
      '@type': 'Service',
      '@id': `${BASE_URL}/llm-brain/#service`,
      serviceType: 'AI Assistant Memory System',
      name: 'LLM Brain by ScopeSite',
      description:
        'Persistent memory for Claude and ChatGPT via MCP and Supabase. Your AI stops forgetting your business every session.',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: { '@type': 'Place', name: 'United Kingdom' },
      url: `${BASE_URL}/llm-brain`,
    },
  ];

  const coreServicesListSchema = generateItemListSchema(
    `${BASE_URL}/#core-services`,
    'ScopeSite Core Services',
    homeServiceSchemas
  );

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema,
          homePageSchema,
          faqSchema,
          coreServicesListSchema,
          ...reviewSchemas,
          ...homeServiceSchemas,
        ]}
      />

      <section className="bg-brand-navy text-white min-h-[80vh] overflow-hidden">
        <div className="container-content relative min-h-[80vh]">
          <div className="relative z-10 flex items-center min-h-[80vh] py-section">
            <div className="text-center md:text-left w-full md:max-w-[55%] lg:max-w-[50%]">
              <div className="badge-gold-lg mb-6 mx-auto md:mx-0">Veteran owned. Somerset based.</div>

              <h1 className="text-[2rem] xs:text-[2.75rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[4.25rem] text-white mb-6 leading-[1.05] font-headline">
                <span className="text-brand-gold block sm:inline sm:mr-2">Websites </span>
                <span className="block sm:inline">AI Can Actually Recommend</span>
              </h1>

              <p className="hero-description text-body-lg text-white/80 mb-8 max-w-md lg:max-w-xl mx-auto md:mx-0">
                When someone asks ChatGPT, Google AI, or Perplexity for a business like yours, do they get
                your name or your competitor&apos;s? We build sites AI systems can read, trust, and cite, so
                you are in the conversation, not stuck on the sidelines.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href={VOICE_SCAN_URL} className="btn-primary text-center" target="_blank" rel="noopener noreferrer">
                  Get a free AI visibility scan
                </a>
                <a href="#how-it-works" className="btn-secondary text-center">
                  See How It Works
                </a>
              </div>
              <p className="mt-6 text-sm text-white/70 max-w-md lg:max-w-xl mx-auto md:mx-0">
                <a
                  href={VOICE_SCAN_URL}
                  className="text-brand-gold underline underline-offset-2 hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Run a free AI visibility scan
                </a>
              </p>
            </div>
          </div>

          <div className="hidden md:block absolute bottom-0 right-[-8%] lg:right-[-5%] w-[55%] lg:w-[52%] h-[75%] lg:h-[80%]">
            <Image
              src="/images/scopesite-websites-found-hero-ai.webp"
              alt="Professional services websites built so AI assistants can recommend your business"
              width={800}
              height={800}
              sizes="(max-width: 768px) 0vw, (max-width: 1200px) 55vw, 52vw"
              className="absolute bottom-0 right-0 w-full h-full object-contain object-right-bottom"
              priority
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      <section className="bg-brand-navy/5 border-y border-brand-navy/10 py-6" aria-label="Trust and proof">
        <div className="container-content">
          <ul className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8 text-center text-brand-navy text-sm sm:text-base font-semibold">
            <li className="flex items-center justify-center gap-2">
              <span className="text-brand-gold" aria-hidden>
                ✓
              </span>
              Seen in Google AI Overviews
            </li>
            <li className="flex items-center justify-center gap-2">
              <span className="text-brand-gold" aria-hidden>
                ✓
              </span>
              AI visibility scans, 100+ sites audited
            </li>
            <li className="flex items-center justify-center gap-2">
              <span className="text-brand-gold" aria-hidden>
                ✓
              </span>
              Ultra Fast builds, top Google speed scores
            </li>
            <li className="flex items-center justify-center gap-2">
              <span className="text-brand-gold" aria-hidden>
                ✓
              </span>
              Veteran-owned. Zero bullshit.
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-white py-16 border-b border-brand-navy/10">
        <div className="container-content max-w-4xl mx-auto">
          <h2 className="text-brand-navy text-2xl sm:text-3xl font-bold mb-6 text-center">
            Most websites are invisible to AI
          </h2>
          <p className="text-muted text-lg mb-6 text-center max-w-3xl mx-auto">
            Not low ranking. Invisible. Wix, WordPress, Squarespace, and plenty of custom builds look
            great to you, but AI crawlers often get an empty page or a mess they cannot trust.
          </p>
          <p className="text-muted text-lg text-center max-w-3xl mx-auto">
            When someone asks for a solicitor in Frome, a dentist in Bath, or an accountant in Bristol, the
            AI pulls from sites it can actually understand. If yours is not one of them, you do not exist in
            that answer. Your site might look the part, but if AI cannot read it, AI cannot recommend it.
          </p>
        </div>
      </section>

      <section
        id="how-it-works"
        className="bg-brand-navy py-section text-white"
        aria-labelledby="fix-heading"
      >
        <div className="container-content max-w-4xl mx-auto">
          <h2 id="fix-heading" className="text-2xl sm:text-3xl font-bold mb-8 text-center">
            How we fix it, in plain English
          </h2>
          <div className="space-y-8 text-white/85 text-lg leading-relaxed">
            <p>
              We build for <strong className="text-white">speed and AI visibility</strong>. The full page
              arrives as ready-to-read HTML, not a pile of JavaScript the crawler has to untangle. Think of
              it like handing someone a printed letter instead of a flat-pack with instructions in Swedish.
              AI wants the letter.
            </p>
            <p>
              We add <strong className="text-white">structured data</strong> that spells out what
              you do, where you are, who you are, and what makes you credible. Less guesswork for the
              machine, more chance you get cited.
            </p>
            <p>
              We run everything through{' '}
              <strong className="text-white">our AI visibility scan</strong>, so you are not guessing
              whether you are visible or just hoping. You get a score and a priority list.
            </p>
          </div>
          <div className="mt-10 text-center">
            <a href={VOICE_SCAN_URL} className="btn-primary inline-block" target="_blank" rel="noopener noreferrer">
              Run the free scan
            </a>
          </div>
        </div>
      </section>

      <section className="section-white border-b border-brand-navy/10" aria-labelledby="voice-band-heading">
        <div className="container-content max-w-4xl mx-auto text-center">
          <h2 id="voice-band-heading" className="text-brand-navy text-2xl sm:text-3xl font-bold mb-4">
            AI visibility scan, flagship check
          </h2>
          <p className="text-muted text-lg mb-4 max-w-2xl mx-auto">
            We score your site on structure, structured data, speed, crawler access, and more. If you want
            the detail, read our straight explanation of{' '}
            <Link
              href="/blog/ai-visibility-checker"
              className="link-navy text-brand-navy font-semibold underline underline-offset-2 decoration-brand-navy hover:decoration-brand-gold hover:text-brand-navy"
            >
              what an AI visibility checker actually measures
            </Link>
            . Takes minutes. Costs nothing to start.
          </p>
          <p className="text-muted mb-8 max-w-2xl mx-auto">
            This is the front door for most clients. Run the scan, see the gaps, then we talk if you want
            help fixing them.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={VOICE_SCAN_URL} className="btn-primary text-center" target="_blank" rel="noopener noreferrer">
              Scan your site free
            </a>
            <Link href="/voice" className="btn-secondary text-center">
              Read how AI SEO and scans work
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 border-b border-brand-navy/10">
        <div className="container-content max-w-3xl mx-auto">
          <h2 className="text-brand-navy text-2xl sm:text-3xl font-bold mb-8 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-0 divide-y divide-brand-navy/10">
            {homeFaqs.map((faq) => (
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

      <section className="bg-brand-navy/5 border-t border-brand-navy/10 py-section">
        <div className="container-content max-w-3xl mx-auto text-center">
          <h2 className="text-brand-navy text-2xl sm:text-3xl font-bold mb-4">
            Real results, named clients
          </h2>
          <p className="text-muted text-lg mb-6">
            We don&apos;t do testimonials with first-name-only initials. See
            full case studies with named clients, AI citation results, and the
            AI visibility work behind the wins.
          </p>
          <Link href="/case-studies" className="btn-primary inline-block">
            Read the case studies
          </Link>
        </div>
      </section>

      <HomeBelowFoldWrapper reviews={googleReviews} />
    </>
  );
}
