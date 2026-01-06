import { JsonLd } from '@/components/JsonLd';
import { generateBreadcrumbSchema, generateReviewsSchema } from '@/lib/schema';
import { HomePageClient } from './HomePageClient';

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
      
      {/* Client-side animated content */}
      <HomePageClient />
    </>
  );
}
