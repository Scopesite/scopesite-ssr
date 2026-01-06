import Link from 'next/link';
import Image from 'next/image';
import { JsonLd } from '@/components/JsonLd';
import { generateBreadcrumbSchema, generateReviewsSchema } from '@/lib/schema';
import { HomeBelowFold } from './HomeBelowFold';

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

export default function Home() {
  // Homepage breadcrumb
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
  ]);

  // Individual review schemas
  const reviewSchemas = generateReviewsSchema(googleReviews);

  return (
    <>
      {/* Page-specific structured data */}
      <JsonLd schema={[breadcrumbSchema, ...reviewSchemas]} />

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
              <p className="text-body-lg text-white/80 mb-8 max-w-md lg:max-w-lg mx-auto md:mx-0">
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

      {/* Below-fold content with animations (client component) */}
      <HomeBelowFold reviews={googleReviews} />
    </>
  );
}
