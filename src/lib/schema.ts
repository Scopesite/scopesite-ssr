/**
 * JSON-LD Schema Generator Functions
 * 
 * Generates structured data for SEO and AI visibility.
 * All schemas use @id references to create a linked graph.
 */

import { GhostPost } from './ghost';

const BASE_URL = 'https://scopesite.co.uk';

// ============================================
// TYPES
// ============================================

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ServiceItem {
  name: string;
  description: string;
  url?: string;
}

export interface HowToStep {
  name: string;
  text: string;
}

// ============================================
// ORGANIZATION SCHEMA
// ============================================

export function generateOrganizationSchema() {
  return {
    '@type': ['Organization', 'LocalBusiness', 'ProfessionalService'],
    '@id': `${BASE_URL}/#organization`,
    name: 'ScopeSite Digital Studios',
    legalName: 'ScopeSite Digital Studios Ltd',
    description:
      'Veteran-owned AI-first web design agency specializing in making UK businesses visible to ChatGPT, Claude, and AI search platforms using the V.O.I.C.E™ methodology.',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/images/logo-icon.svg`,
      width: 512,
      height: 512,
    },
    image: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
    telephone: '+441373311339',
    email: 'support@scopesite.co.uk',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Frome',
      addressRegion: 'Somerset',
      postalCode: 'BA11',
      addressCountry: 'GB',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '51.2308',
      longitude: '-2.3201',
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'United Kingdom',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Somerset',
      },
    ],
    founder: {
      '@type': 'Person',
      '@id': `${BASE_URL}/#founder`,
      name: 'Dan Cartwright',
      jobTitle: 'Founder & Director',
      description:
        'British Army veteran and web design specialist with 6 years CAMHS experience',
    },
    foundingDate: '2024-12',
    priceRange: '££',
    currenciesAccepted: 'GBP',
    paymentAccepted: 'Credit Card, Bank Transfer, Payment Plans',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
    sameAs: [
      'https://www.linkedin.com/company/scopesite',
      'https://www.facebook.com/scopesite',
      'https://www.instagram.com/scopesite',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Web Design Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'AI-First Web Design',
            description: 'Websites optimized for ChatGPT and AI search visibility',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'V.O.I.C.E™ AI Visibility Optimization',
            description:
              'Comprehensive AI search optimization using our proprietary methodology',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Custom Web Applications',
            description: 'Bespoke business tools and web applications',
          },
        },
      ],
    },
    knowsAbout: [
      'AI Search Optimization',
      'ChatGPT Business Recommendations',
      'Voice Search Optimization',
      'JSON-LD Schema Markup',
      'Next.js Development',
      'Web Design',
      'SEO',
    ],
    slogan: 'Making UK Businesses Visible to AI',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '6',
      reviewCount: '6',
    },
  };
}

// ============================================
// WEBSITE SCHEMA
// ============================================

export function generateWebsiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'ScopeSite Digital Studios',
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    inLanguage: 'en-GB',
  };
}

// ============================================
// BREADCRUMB SCHEMA
// ============================================

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${items[items.length - 1]?.url || BASE_URL}/#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ============================================
// FAQ SCHEMA
// ============================================

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ============================================
// SERVICE SCHEMA
// ============================================

export function generateServiceSchema(
  name: string,
  description: string,
  url: string,
  additionalType?: string
) {
  return {
    '@type': additionalType || 'Service',
    '@id': `${url}/#service`,
    name,
    description,
    url,
    provider: {
      '@id': `${BASE_URL}/#organization`,
    },
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
  };
}

// ============================================
// PROFESSIONAL SERVICE SCHEMA
// ============================================

export function generateProfessionalServiceSchema(
  name: string,
  description: string,
  url: string,
  services: ServiceItem[]
) {
  return {
    '@type': 'ProfessionalService',
    '@id': `${url}/#service`,
    name,
    description,
    url,
    provider: {
      '@id': `${BASE_URL}/#organization`,
    },
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${name} Services`,
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          description: service.description,
          url: service.url,
        },
      })),
    },
  };
}

// ============================================
// HOWTO SCHEMA
// ============================================

export function generateHowToSchema(
  name: string,
  description: string,
  steps: HowToStep[]
) {
  return {
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

// ============================================
// PERSON SCHEMA
// ============================================

export function generatePersonSchema(
  name: string,
  jobTitle: string,
  description: string,
  image?: string
) {
  return {
    '@type': 'Person',
    '@id': `${BASE_URL}/#${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    jobTitle,
    description,
    image: image || `${BASE_URL}/images/dan-headshot.webp`,
    worksFor: {
      '@id': `${BASE_URL}/#organization`,
    },
  };
}

// ============================================
// ABOUT PAGE SCHEMA
// ============================================

export function generateAboutPageSchema(url: string) {
  return {
    '@type': 'AboutPage',
    '@id': `${url}/#webpage`,
    url,
    name: 'About ScopeSite Digital Studios',
    description:
      'Learn about ScopeSite, a veteran-owned AI-first web design agency based in Somerset, UK.',
    isPartOf: {
      '@id': `${BASE_URL}/#website`,
    },
    about: {
      '@id': `${BASE_URL}/#organization`,
    },
  };
}

// ============================================
// CONTACT PAGE SCHEMA
// ============================================

export function generateContactPageSchema(url: string) {
  return {
    '@type': 'ContactPage',
    '@id': `${url}/#webpage`,
    url,
    name: 'Book a Strategy Call',
    description:
      'Book a free 30-minute strategy call with Dan Cartwright, director of ScopeSite.',
    isPartOf: {
      '@id': `${BASE_URL}/#website`,
    },
  };
}

// ============================================
// SCHEDULE ACTION SCHEMA
// ============================================

export function generateScheduleActionSchema() {
  return {
    '@type': 'ScheduleAction',
    name: 'Book a Strategy Call',
    description: 'Schedule a free 30-minute consultation with ScopeSite',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/book`,
      actionPlatform: [
        'http://schema.org/DesktopWebPlatform',
        'http://schema.org/MobileWebPlatform',
      ],
    },
    agent: {
      '@id': `${BASE_URL}/#organization`,
    },
  };
}

// ============================================
// BLOG SCHEMA
// ============================================

export function generateBlogSchema(url: string) {
  return {
    '@type': 'Blog',
    '@id': `${url}/#blog`,
    url,
    name: 'ScopeSite Blog',
    description:
      'AI visibility insights, web design tips, and practical advice for UK businesses.',
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    inLanguage: 'en-GB',
  };
}

// ============================================
// COLLECTION PAGE SCHEMA
// ============================================

export function generateCollectionPageSchema(url: string, name: string) {
  return {
    '@type': 'CollectionPage',
    '@id': `${url}/#webpage`,
    url,
    name,
    isPartOf: {
      '@id': `${BASE_URL}/#website`,
    },
  };
}

// ============================================
// BLOG POSTING SCHEMA
// ============================================

export function generateBlogPostingSchema(post: GhostPost, url: string) {
  const schema: Record<string, unknown> = {
    '@type': 'BlogPosting',
    '@id': `${url}/#article`,
    headline: post.title,
    description: post.excerpt || post.custom_excerpt,
    url,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    inLanguage: 'en-GB',
    isPartOf: {
      '@id': `${BASE_URL}/blog/#blog`,
    },
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  // Add image if available
  if (post.feature_image) {
    schema.image = {
      '@type': 'ImageObject',
      url: post.feature_image,
      caption: post.feature_image_alt || post.title,
    };
  }

  // Add author if available
  if (post.primary_author) {
    schema.author = {
      '@type': 'Person',
      name: post.primary_author.name,
      url: `${BASE_URL}/about`,
    };
  }

  // Add word count estimate based on reading time (avg 200 words/min)
  if (post.reading_time) {
    schema.wordCount = post.reading_time * 200;
  }

  return schema;
}

// ============================================
// ARTICLE SCHEMA
// ============================================

export function generateArticleSchema(post: GhostPost, url: string) {
  return {
    '@type': 'Article',
    '@id': `${url}/#article`,
    headline: post.title,
    description: post.excerpt || post.custom_excerpt,
    url,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: post.primary_author
      ? {
          '@type': 'Person',
          name: post.primary_author.name,
        }
      : undefined,
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    image: post.feature_image,
  };
}

// ============================================
// SPEAKABLE SCHEMA
// ============================================

export function generateSpeakableSchema(url: string, cssSelectors: string[]) {
  return {
    '@type': 'WebPage',
    '@id': url,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: cssSelectors,
    },
  };
}

// ============================================
// OFFER SCHEMA (for pricing)
// ============================================

export function generateOfferSchema(
  name: string,
  description: string,
  priceRange: string
) {
  return {
    '@type': 'Offer',
    name,
    description,
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: 'GBP',
      price: priceRange,
    },
    seller: {
      '@id': `${BASE_URL}/#organization`,
    },
  };
}

// ============================================
// REVIEW SCHEMA
// ============================================

export interface ReviewData {
  author: string;
  reviewBody: string;
  datePublished?: string;
  ratingValue?: number;
}

export function generateReviewSchema(review: ReviewData) {
  return {
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author,
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.ratingValue || 5,
      bestRating: 5,
      worstRating: 1,
    },
    itemReviewed: {
      '@id': `${BASE_URL}/#organization`,
    },
  };
}

export function generateReviewsSchema(reviews: ReviewData[]) {
  return reviews.map((review) => generateReviewSchema(review));
}

// ============================================
// GRAPH WRAPPER
// ============================================

export function wrapInGraph(schemas: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  };
}

