import Link from 'next/link';
import Image from 'next/image';
import { JsonLd } from '@/components/JsonLd';
import { generateBreadcrumbSchema, generateReviewsSchema, generateSpeakableSchema, generateWebPageSchema, generateFAQSchema, type FAQItem } from '@/lib/schema';
import { ChevronDown } from 'lucide-react';
import { HomeBelowFoldWrapper } from './HomeBelowFoldWrapper';

const BASE_URL = 'https://scopesite.co.uk';

// Google Reviews data for schema generation
const googleReviews = [
  {
    author: 'Michelle Mitchell',
    reviewBody: 'Great service from Scopesite, being completely naive with what building a website entailed and not having a clue about it, Dan made everything so easy and stress free. Best website design company in Somerset!',
    datePublished: '2025-05-15',
  },
  {
    author: 'Colin Ferbrache',
    reviewBody: 'Dan has helped our business from the very beginning, and has been proactive in helping drive our business. The value he has provided has been more than worth the cost.',
    datePublished: '2025-05-15',
  },
  {
    author: 'Koalla Da 13',
    reviewBody: 'We had Dan from Scopesite build us a website for our flying school in Bristol. Talk about above and beyond! Professional, responsive, and delivered exactly what we needed.',
    datePublished: '2025-05-15',
  },
  {
    author: 'Louis Dunn',
    reviewBody: 'Dan demonstrated exceptional performance and proficiency in his work. His pricing remains competitive and reasonable. Highly recommended for any web design needs.',
    datePublished: '2025-04-10',
  },
  {
    author: 'Dean James',
    reviewBody: 'Excellent service, will use again!',
    datePublished: '2024-12-23',
  },
  {
    author: 'Rebecca Archer',
    reviewBody: 'Excellent communication and finished website. He took care of all the jargon bits such as search engine optimisation so I didn\'t have to worry about a thing.',
    datePublished: '2024-12-09',
  },
];

const homeFaqs: FAQItem[] = [
  {
    question: 'What is AI search optimisation?',
    answer: 'AI search optimisation (also called GEO or AEO) is the process of making your website visible to AI chatbots like ChatGPT, Perplexity, and Gemini. Google Trends UK shows "geo vs seo" searches have grown over 1,150% in the past year. Traditional SEO gets you ranked on Google. AI search optimisation gets you recommended by AI assistants. ScopeSite uses the V.O.I.C.E™ methodology to achieve both.',
  },
  {
    question: 'How do I get my business recommended by ChatGPT?',
    answer: 'Getting recommended by ChatGPT requires three things: structured data (JSON-LD schema markup) that describes your business clearly, server-side rendered HTML that AI crawlers can read, and content engineered for AI extraction. ScopeSite achieved #1 AI recommendations for client H4TLT across all four major AI platforms using these exact techniques.',
  },
  {
    question: 'Is a website still worth it for a small business in 2026?',
    answer: 'Yes, but only if it is built for AI visibility. Social media pages cannot be recommended by AI chatbots. They need structured data from your own website to cite and recommend your business. A website without schema markup is invisible to AI. A website built with SSR and proper structured data becomes your most powerful marketing asset.',
  },
  {
    question: 'How much does a website cost in the UK?',
    answer: 'ScopeSite websites start from £2,625 for simple sites, £5,625 for standard builds, and £9,375+ for complex projects. Monthly payment plans are available with no interest and no credit checks. Every build includes AI-optimised schema markup, 100/100 Lighthouse scores, and server-side rendering. Visit our pricing page for an instant quote in under 2 minutes.',
  },
  {
    question: 'What is V.O.I.C.E™?',
    answer: 'V.O.I.C.E™ (Voice-Optimised Intelligent Content Engineering) is ScopeSite\'s proprietary methodology for making websites visible to AI search engines. It combines server-side rendering, structured data engineering, and content architecture designed specifically for generative AI citation. It is the only systemised AI visibility methodology offered by a web design agency in the South West.',
  },
];

export default function Home() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
  ]);

  const reviewSchemas = generateReviewsSchema(googleReviews);

  const homePageSchema = {
    ...generateWebPageSchema(
      'ScopeSite Digital Studios | AI-First Web Design Agency',
      'Veteran-owned AI-first web design agency in Somerset. SSR websites that get recommended by ChatGPT, Perplexity, and Google. 100/100 Lighthouse scores.',
      BASE_URL
    ),
    speakable: generateSpeakableSchema(['h1', '.hero-description']),
  };

  const faqSchema = generateFAQSchema(homeFaqs);

  return (
    <>
      <JsonLd schema={[breadcrumbSchema, homePageSchema, faqSchema, ...reviewSchemas]} />

      {/* Hero Section - Server Rendered for fast LCP */}
      <section className="bg-brand-navy text-white min-h-[80vh] overflow-hidden">
        <div className="container-content relative min-h-[80vh]">
          {/* Text Content - Left Side */}
          <div className="relative z-10 flex items-center min-h-[80vh] py-section">
            <div className="text-center md:text-left w-full md:max-w-[55%] lg:max-w-[50%]">
              {/* Badge */}
              <div className="badge-gold-lg mb-6 mx-auto md:mx-0">Veteran Owned &amp; Operated</div>

              {/* Headline */}
              <h1 className="text-[2.5rem] xs:text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-display text-white mb-6 leading-[0.95]">
                <span className="text-brand-gold block">WEBSITES</span>
                <span className="block">THAT GET</span>
                <span className="block">FOUND</span>
              </h1>

              {/* Subtext */}
              <p className="hero-description text-body-lg text-white/80 mb-8 max-w-md lg:max-w-lg mx-auto md:mx-0">
                We build AI-optimized websites that rank in both traditional search 
                and AI assistants like ChatGPT and Claude. No bullshit. Just results.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link 
                  href="/pricing" 
                  className="btn-primary"
                >
                  Get Instant Quote
                </Link>
                <Link 
                  href="/book" 
                  className="btn-secondary"
                >
                  Book Strategy Call
                </Link>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="hidden md:block absolute bottom-0 right-[-8%] lg:right-[-5%] w-[55%] lg:w-[52%] h-[75%] lg:h-[80%]">
            <Image
              src="/images/scopesite-websites-found-hero-ai.webp"
              alt="AI-optimized websites that get found in search and AI assistants"
              width={800}
              height={800}
              sizes="(max-width: 768px) 0vw, (max-width: 1200px) 55vw, 52vw"
              className="absolute bottom-0 right-0 w-full h-full object-contain object-right-bottom"
              priority
            />
          </div>
        </div>
      </section>

      {/* Why ScopeSite Section */}
      <section className="bg-white py-16 border-b border-brand-navy/10">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-brand-navy text-2xl sm:text-3xl font-bold mb-8 text-center">
              Why UK Businesses Choose ScopeSite
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-brand-navy font-bold text-lg mb-3">Built for AI Search</h3>
                <p className="text-muted mb-6">
                  Most websites are invisible to ChatGPT, Claude, and Perplexity because they use 
                  client-side JavaScript that AI crawlers can't read. We build server-side rendered 
                  sites that deliver complete HTML on every request - making your content instantly 
                  visible to both humans and AI assistants. When potential customers ask AI for 
                  recommendations, you actually show up.
                </p>
                <h3 className="text-brand-navy font-bold text-lg mb-3">Veteran-Owned, Veteran Values</h3>
                <p className="text-muted">
                  Founded by Dan Cartwright, a British Army veteran, ScopeSite brings military 
                  precision to web design. Deadlines are deadlines. Communication is proactive. 
                  Problems get solved, not ignored. We don't disappear after launch - we stick around 
                  because that's what integrity looks like.
                </p>
              </div>
              <div>
                <h3 className="text-brand-navy font-bold text-lg mb-3">Transparent Pricing, Always</h3>
                <p className="text-muted mb-6">
                  No "it depends" without actual numbers. No surprise invoices. We researched 348 UK 
                  web agencies to benchmark our pricing - you'll see exactly what things cost before 
                  we start, and our prices are typically 25% below market average for comparable work. 
                  Use our instant quote calculator to see what your project costs in under 2 minutes.
                </p>
                <h3 className="text-brand-navy font-bold text-lg mb-3">Results Over Aesthetics</h3>
                <p className="text-muted">
                  Pretty websites don't pay your bills. We build sites that load fast (100/100 Lighthouse 
                  scores), rank well (proper schema markup and technical SEO), convert visitors (clear CTAs 
                  and user flows), and show up when AI assistants are asked for recommendations. If it 
                  doesn't work, it doesn't matter how good it looks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Areas We Serve Section */}
      <section className="bg-brand-navy py-16" aria-labelledby="areas-heading">
        <div className="container-content">
          <h2 id="areas-heading" className="text-white text-2xl sm:text-3xl font-bold mb-4 text-center">
            Areas We Serve
          </h2>
          <p className="text-white/70 text-center max-w-2xl mx-auto mb-10">
            Based in Frome, Somerset. Serving businesses across the South West with AI-first web design and SEO.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { name: 'Web Design Somerset', href: '/web-design-somerset' },
              { name: 'Web Design Bristol', href: '/web-design-bristol' },
              { name: 'Web Design Bath', href: '/web-design-bath' },
              { name: 'Web Design Glastonbury', href: '/web-design-glastonbury' },
              { name: 'Web Design Burnham-on-Sea', href: '/web-design-burnham-on-sea' },
              { name: 'SEO Somerset', href: '/seo-somerset' },
              { name: 'SEO Bristol', href: '/seo-bristol' },
            ].map((area) => (
              <Link
                key={area.href}
                href={area.href}
                className="btn block text-center min-w-[140px] px-5 py-2.5 rounded-full border-2 border-white/20 bg-white/5 !text-brand-gold font-bold no-underline shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] hover:border-brand-gold/50 hover:shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2),0_0_12px_rgba(236,182,21,0.15)] transition-all duration-300 text-sm drop-shadow-[0_0_6px_rgba(236,182,21,0.4)]"
              >
                {area.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16 border-b border-brand-navy/10">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-brand-navy text-2xl sm:text-3xl font-bold mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-0 divide-y divide-brand-navy/10">
              {homeFaqs.map((faq) => (
                <details key={faq.question} className="group py-5">
                  <summary className="flex items-center justify-between cursor-pointer list-none text-brand-navy font-medium text-lg pr-8">
                    {faq.question}
                    <ChevronDown className="w-5 h-5 text-brand-gold transition-transform group-open:rotate-180 flex-shrink-0" />
                  </summary>
                  <p className="mt-3 text-brand-navy/70 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Below-fold content - static on mobile, animated on desktop */}
      <HomeBelowFoldWrapper reviews={googleReviews} />
    </>
  );
}
