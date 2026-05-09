/**
 * JSON-LD Schema Generator Functions
 * 
 * Generates structured data for SEO and AI visibility.
 * All schemas use @id references to create a linked graph.
 */

import { GhostPost } from './ghost';
import { ADDON_CATALOG, PRICING_CONFIG, VOICE_SPEC } from './pricing-config';

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
      'Veteran-owned AI-first web design agency in Somerset, UK. We build fast, HTML-first websites optimised for Google, ChatGPT, Claude, Perplexity and Google AI Overviews using our AI visibility methodology.',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      '@id': `${BASE_URL}/#logo`,
      contentUrl: `${BASE_URL}/images/logo-icon.svg`,
      url: `${BASE_URL}/images/logo-icon.svg`,
      name: 'ScopeSite Digital Studios Logo',
      description: 'ScopeSite Digital Studios logo',
      width: 512,
      height: 512,
      inLanguage: 'en-GB',
    },
    image: {
      '@type': 'ImageObject',
      '@id': `${BASE_URL}/#hero-image`,
      contentUrl: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
      url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
      name: 'ScopeSite Websites That Get Found Hero',
      description: 'AI-optimized websites that get found in search and AI assistants',
      width: 800,
      height: 800,
      inLanguage: 'en-GB',
    },
    telephone: '+441373311339',
    email: 'support@scopesite.co.uk',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '4 Horse Close',
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
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: 51.2672,
          longitude: -2.2890,
        },
        geoRadius: '80000',
      },
      {
        '@type': 'Country',
        name: 'United Kingdom',
      },
      {
        '@type': 'Country',
        name: 'United States',
      },
    ],
    founder: generateFounderPersonSchema(),
    foundingDate: '2024-12-01',
    priceRange: '££-£££',
    currenciesAccepted: 'GBP',
    paymentAccepted: 'Bank Transfer, Credit Card',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: '+441373311339',
        email: 'dan@scopesite.co.uk',
        availableLanguage: ['en-GB', 'en-US'],
        areaServed: [
          { '@type': 'Country', name: 'United Kingdom' },
          { '@type': 'Country', name: 'United States' },
        ],
      },
    ],
    sameAs: [
      'https://www.linkedin.com/in/scopesite',
      'https://www.linkedin.com/company/106028304',
      'https://www.facebook.com/scopesite',
      'https://www.instagram.com/scopesitedigitalstudios',
      'https://x.com/DlgltaI',
      'https://find-and-update.company-information.service.gov.uk/company/16130355',
      // TEMP REMOVED 2026-04-18: Wikidata entity Q138866631 deleted 6 April 2026 (spam/advertising). Awaiting admin review. Restore if entity is reinstated.
      // 'https://www.wikidata.org/wiki/Q138866631',
      'https://www.google.com/maps/place/ScopeSite+Digital+Studios/@51.2672214,-2.2915633,17z',
      'https://github.com/Scopesite/scopesite-ssr',
      'https://github.com/Scopesite/voice',
      'https://www.trustpilot.com/review/scopesite.co.uk',
      'https://www.yell.com/biz/scopesite-digital-studios-beckington-11012422/',
      'https://fromechamber.com/member/scopesite-ltd/',
      'https://www.gov.uk/armed-forces-covenant-businesses/scopesite-digital-studios-scopesite-digital-ltd',
      'https://www.approvedbusiness.co.uk/companies/scopesite-ltd',
      'https://www.threads.com/@aiseo_experts',
      'https://www.pinterest.com/scopesitedigitalstudios',
      'https://bsky.app/profile/webdesignsomerset.bsky.social',
      'https://www.tiktok.com/@dan_the_webdesigner',
      'https://frome.cylex-uk.co.uk/company/scopesite-digital-studios-28469047.html',
      'https://diib.com/featuredmembers/scopesite-digital-studios/',
      'https://www.hotfrog.co.uk/company/ef91c8e5a352cf95b1dd6f23891ed6b6/scopesite-digital-studios/frome/web-design',
      'https://www.crunchbase.com/organization/scopesite-digital-studios',
      'https://www.designrush.com/agency/profile/scopesite-digital-studios',
      'https://www.bark.com/en/gb/company/scopesite/VVVVPy/',
    ],
    hasCertification: [
      {
        '@type': 'Certification',
        name: 'Companies House Registration',
        issuedBy: {
          '@type': 'Organization',
          name: 'Companies House',
          url: 'https://www.gov.uk/government/organisations/companies-house',
        },
        certificationIdentification: '16130355',
        url: 'https://find-and-update.company-information.service.gov.uk/company/16130355',
      },
      {
        '@type': 'Certification',
        name: 'ICO Data Protection Registration',
        issuedBy: {
          '@type': 'Organization',
          name: "Information Commissioner's Office",
          url: 'https://ico.org.uk',
        },
        certificationIdentification: 'ZC071472',
        expires: '2026-12-22',
      },
      {
        '@type': 'Certification',
        name: 'Armed Forces Covenant Signatory',
        issuedBy: {
          '@type': 'GovernmentOrganization',
          name: 'Ministry of Defence',
          url: 'https://www.gov.uk/government/organisations/ministry-of-defence',
        },
        url: 'https://www.gov.uk/armed-forces-covenant-businesses/scopesite-digital-studios-scopesite-digital-ltd',
      },
    ],
    publishingPrinciples: `${BASE_URL}/terms-and-conditions`,
    correctionsPolicy: `${BASE_URL}/terms-and-conditions`,
    brand: [
      {
        '@type': 'Brand',
        '@id': `${BASE_URL}/#brand-scopesite`,
        name: 'ScopeSite Digital Studios',
        url: BASE_URL,
        logo: { '@id': `${BASE_URL}/#logo` },
      },
      {
        '@type': 'Brand',
        '@id': `${BASE_URL}/#brand-voice`,
        name: 'AI visibility by ScopeSite',
        slogan: 'Recommend Your Business',
        url: `${BASE_URL}/voice`,
        description:
          'AI visibility methodology and scanning tools that measure how well ChatGPT, Claude, Gemini, and Perplexity can read and recommend your business.',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'ScopeSite Services',
      itemListElement: [
        {
          '@type': 'Offer',
          priceCurrency: 'GBP',
          priceSpecification: {
            '@type': 'PriceSpecification',
            minPrice: '1875',
            maxPrice: '8000',
            priceCurrency: 'GBP',
          },
          availability: 'https://schema.org/InStock',
          url: `${BASE_URL}/pricing`,
          description:
            'AI-visible website design from Wix-managed builds to Ultra Fast sites with structured data, strong speed scores, and optimisation for ChatGPT, Claude, and Gemini.',
          itemOffered: {
            '@type': 'Service',
            name: 'AI-First Web Design',
            serviceType: 'Web Design',
            description:
              'Fast HTML-first websites built for AI visibility. Includes structured data, strong Core Web Vitals, and optimisation for ChatGPT, Claude, and Gemini.',
            provider: { '@id': `${BASE_URL}/#organization` },
            areaServed: {
              '@type': 'Place',
              name: 'Somerset, United Kingdom',
            },
            url: `${BASE_URL}/web-design`,
          },
        },
        {
          '@type': 'Offer',
          price: '0.58',
          priceCurrency: 'GBP',
          availability: 'https://schema.org/InStock',
          url: `${BASE_URL}/voice`,
          description: 'AI visibility scan from £0.58 per scan. No subscription. Credits never expire.',
          eligibleQuantity: {
            '@type': 'QuantitativeValue',
            value: 1,
            unitText: 'scan',
          },
          itemOffered: {
            '@type': 'Service',
            name: 'AI visibility by ScopeSite',
            serviceType: 'AI Visibility Optimisation',
            alternateName: 'AI visibility scan',
            description:
              'AI visibility audits and optimisation: structured data checks, Core Web Vitals analysis, AI crawler access checks, and implementation support from £0.58 per scan.',
            provider: { '@id': `${BASE_URL}/#organization` },
            areaServed: {
              '@type': 'Place',
              name: 'United Kingdom',
            },
            url: `${BASE_URL}/voice`,
          },
        },
        {
          '@type': 'Offer',
          priceCurrency: 'GBP',
          priceSpecification: {
            '@type': 'PriceSpecification',
            minPrice: '5000',
            priceCurrency: 'GBP',
          },
          availability: 'https://schema.org/InStock',
          url: `${BASE_URL}/web-apps`,
          description: 'Bespoke web applications and automation tools.',
          itemOffered: {
            '@type': 'Service',
            name: 'Custom Web Apps by ScopeSite',
            serviceType: 'Custom Web Application Development',
            description: 'Bespoke tools and web applications built to automate business workflows. Built with modern frameworks and server-side rendering.',
            provider: { '@id': `${BASE_URL}/#organization` },
            areaServed: {
              '@type': 'Place',
              name: 'United Kingdom',
            },
            url: `${BASE_URL}/web-apps`,
          },
        },
      ],
    },
    knowsAbout: [
      'AI visibility methodology',
      'Generative Engine Optimisation',
      'Answer Engine Optimisation',
      'AI Search Visibility',
      'AI Search Optimization',
      'ChatGPT Business Recommendations',
      'Structured data for AI',
      'Next.js Development',
      'Core Web Vitals',
      'Web Design',
      'SEO',
      // SSR web-design service lines (Thing); valid on Organization, not on Service
      {
        '@type': 'Thing',
        name: 'Brochure websites',
        description:
          'Fast HTML-first 5–10 page websites for small businesses and professionals. AI-visible from day one.',
      },
      {
        '@type': 'Thing',
        name: 'E-commerce websites',
        description:
          'Fast, AI-optimised online stores with product management, payment processing, and quick page loads.',
      },
      {
        '@type': 'Thing',
        name: 'Website Redesign & Migration',
        description:
          'Migrate from WordPress, Wix, or Squarespace to a modern HTML-first stack with improved AI visibility.',
      },
      {
        '@type': 'Thing',
        name: 'Landing pages',
        description:
          'High-converting single pages built with Next.js for campaigns, products, or lead generation.',
      },
    ],
    slogan: 'Making UK Businesses Visible to AI',
    potentialAction: {
      '@type': 'ScheduleAction',
      name: 'Book a Strategy Call',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/book`,
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
      },
    },
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
// FOUNDER PERSON SCHEMA
// ============================================

export function generateFounderPersonSchema() {
  return {
    '@type': 'Person',
    '@id': `${BASE_URL}/#dan-cartwright`,
    name: 'Dan Cartwright',
    jobTitle: 'Founder & Director',
    description:
      'British Army veteran and founder of ScopeSite Digital Studios. Leads our AI visibility methodology for AI search.',
    worksFor: { '@id': `${BASE_URL}/#organization` },
    url: `${BASE_URL}/about`,
    image: `${BASE_URL}/images/dan-headshot.webp`,
    sameAs: [
      'https://www.linkedin.com/in/dan-cartwright-scopesite',
    ],
    knowsAbout: [
      'AI Search Optimisation',
      'HTML-first web delivery',
      'Next.js',
      'AI visibility methodology',
      'Structured data',
      'Generative Engine Optimisation',
      'AI Visibility',
      'Answer Engine Optimisation',
      'Web Design',
      'Entity SEO',
    ],
    knowsLanguage: 'en-GB',
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Founder & Director, AI-First Web Design Agency',
      occupationLocation: {
        '@type': 'Country',
        name: 'United Kingdom',
      },
      skills: 'AI Visibility, structured data, HTML-first web design, Next.js, entity SEO',
    },
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Military Service',
      description: 'British Army veteran, Royal Electrical and Mechanical Engineers (REME)',
    },
  };
}

// ============================================
// V.O.I.C.E. DEFINED TERM SET SCHEMA
// ============================================

export function generateVOICEDefinedTermSetSchema() {
  return {
    '@type': 'DefinedTermSet',
    '@id': `${BASE_URL}/#voice-methodology`,
    name: 'AI visibility framework',
    description:
      "ScopeSite's framework for measuring and improving how AI platforms read, trust, and recommend your business.",
    url: `${BASE_URL}/voice`,
    creator: { '@id': `${BASE_URL}/#organization` },
    hasDefinedTerm: [
      {
        '@type': 'DefinedTerm',
        '@id': `${BASE_URL}/#voice-visibility`,
        name: 'Visibility',
        description: 'Measuring and improving how visible a business is to AI search engines and answer engines.',
        inDefinedTermSet: { '@id': `${BASE_URL}/#voice-methodology` },
      },
      {
        '@type': 'DefinedTerm',
        '@id': `${BASE_URL}/#voice-optimisation`,
        name: 'Optimisation',
        description: 'Technical and content optimisation strategies that improve how AI systems interpret and recommend a business.',
        inDefinedTermSet: { '@id': `${BASE_URL}/#voice-methodology` },
      },
      {
        '@type': 'DefinedTerm',
        '@id': `${BASE_URL}/#voice-intelligent`,
        name: 'Intelligent',
        description: 'Building intelligent, machine-readable content structures that AI systems can parse, trust, and cite.',
        inDefinedTermSet: { '@id': `${BASE_URL}/#voice-methodology` },
      },
      {
        '@type': 'DefinedTerm',
        '@id': `${BASE_URL}/#voice-crawler`,
        name: 'Crawler',
        description: 'Ensuring AI crawlers (ChatGPT, Perplexity, Google AI, Claude) can access, read, and index website content.',
        inDefinedTermSet: { '@id': `${BASE_URL}/#voice-methodology` },
      },
      {
        '@type': 'DefinedTerm',
        '@id': `${BASE_URL}/#voice-engines`,
        name: 'Engines',
        description: 'Targeting AI answer engines and large language models as distinct platforms from traditional search engines.',
        inDefinedTermSet: { '@id': `${BASE_URL}/#voice-methodology` },
      },
    ],
  };
}

// ============================================
// BUSINESS AUDIENCE SCHEMA
// ============================================

export function generateBusinessAudienceSchema() {
  return {
    '@type': 'BusinessAudience',
    '@id': `${BASE_URL}/#target-audience`,
    audienceType: 'UK Small and Medium Enterprises',
    geographicArea: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 1,
      maxValue: 250,
    },
  };
}

// ============================================
// V.O.I.C.E. SOFTWARE APPLICATION SCHEMA
// ============================================

export function generateVOICESoftwareApplicationSchema() {
  return {
    '@type': 'SoftwareApplication',
    '@id': `${BASE_URL}/#voice-scanner`,
    name: 'AI visibility scanner',
    description:
      'AI visibility scoring that reviews schema health, page structure, speed, AI crawler access, accessibility, authority, and entity signals using a clear deductive model.',
    url: 'https://voice.scopesite.co.uk',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    creator: { '@id': `${BASE_URL}/#organization` },
    about: { '@id': `${BASE_URL}/#voice-methodology` },
    offers: [
      {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'GBP',
        name: 'Free AI Visibility Scan',
        description: 'Instant AI visibility score across 7 categories',
      },
    ],
    featureList:
      'Schema markup scoring, On-page structure analysis, Performance analysis, AI crawler access detection, Accessibility scoring, Domain authority check, Entity signal analysis',
    potentialAction: {
      '@type': 'AssessAction',
      name: 'Scan Website AI Visibility',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://voice.scopesite.co.uk',
        actionPlatform: 'https://schema.org/DesktopWebPlatform',
      },
    },
  };
}

// ============================================
// ITEM LIST SCHEMA
// ============================================

export function generateItemListSchema(
  id: string,
  name: string,
  items: Array<{ '@id'?: string; '@type'?: string | string[]; [key: string]: unknown }>
) {
  return {
    '@type': 'ItemList',
    '@id': id,
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: item['@id'] ? { '@id': item['@id'] } : item,
    })),
  };
}

// ============================================
// SERVICE CHANNELS SCHEMA
// ============================================

export function generateServiceChannels() {
  return [
    {
      '@type': 'ServiceChannel',
      name: 'Online Booking',
      serviceUrl: `${BASE_URL}/book`,
    },
    {
      '@type': 'ServiceChannel',
      name: 'Project Brief',
      serviceUrl: `${BASE_URL}/brief`,
    },
    {
      '@type': 'ServiceChannel',
      name: 'Phone Enquiry',
      servicePhone: {
        '@type': 'ContactPoint',
        telephone: '+441373311339',
      },
    },
  ];
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
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'llms.txt',
        value: 'https://scopesite.co.uk/llms.txt',
      },
    ],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

// ============================================
// BREADCRUMB SCHEMA
// ============================================

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  const pageUrl = (items[items.length - 1]?.url || BASE_URL).replace(/\/$/, '');
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}/#breadcrumb`,
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
  additionalType?: string,
  options?: {
    isRelatedTo?: Array<{ '@id': string }>;
    availableChannel?: Record<string, unknown>[];
    potentialAction?: Record<string, unknown>;
    audience?: { '@id': string };
    serviceType?: string;
    category?: string;
    offers?: Record<string, unknown> | Record<string, unknown>[];
  }
) {
  const schema: Record<string, unknown> = {
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

  if (options?.isRelatedTo) {
    schema.isRelatedTo = options.isRelatedTo;
  }
  if (options?.availableChannel) {
    schema.availableChannel = options.availableChannel;
  }
  if (options?.potentialAction) {
    schema.potentialAction = options.potentialAction;
  }
  if (options?.audience) {
    schema.audience = options.audience;
  }
  if (options?.serviceType) {
    schema.serviceType = options.serviceType;
  }
  if (options?.category) {
    schema.category = options.category;
  }
  if (options?.offers) {
    schema.offers = options.offers;
  }

  return schema;
}

/** Published catalogue prices: align with site review cycle */
export const SCHEMA_PUBLIC_PRICE_VALID_UNTIL = '2026-12-31';

/** GBP one-time Offer (copy-led landing pages, FAQ pricing) */
export function schemaOfferGbpOneTime(price: string, pageUrl: string): Record<string, unknown> {
  return {
    '@type': 'Offer',
    price,
    priceCurrency: 'GBP',
    availability: 'https://schema.org/InStock',
    priceValidUntil: SCHEMA_PUBLIC_PRICE_VALID_UNTIL,
    url: pageUrl,
    seller: { '@id': `${BASE_URL}/#organization` },
  };
}

/** GBP recurring monthly Offer */
export function schemaOfferGbpMonthly(price: string, pageUrl: string): Record<string, unknown> {
  return {
    '@type': 'Offer',
    price,
    priceCurrency: 'GBP',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price,
      priceCurrency: 'GBP',
      billingDuration: 'P1M',
      unitCode: 'MON',
    },
    availability: 'https://schema.org/InStock',
    url: pageUrl,
    seller: { '@id': `${BASE_URL}/#organization` },
  };
}

/** Range pricing from FAQ (e.g. schema implementation £750–£2,000) */
export function schemaAggregateOfferRange(
  lowPrice: string,
  highPrice: string,
  offerCount: string = '1'
): Record<string, unknown> {
  return {
    '@type': 'AggregateOffer',
    lowPrice,
    highPrice,
    priceCurrency: 'GBP',
    offerCount,
    availability: 'https://schema.org/InStock',
  };
}

/** “From £X” style floor without inventing a ceiling */
export function schemaAggregateOfferLowOnly(
  lowPrice: string,
  offerCount: string = '1'
): Record<string, unknown> {
  return {
    '@type': 'AggregateOffer',
    lowPrice,
    priceCurrency: 'GBP',
    offerCount,
    availability: 'https://schema.org/InStock',
  };
}

/**
 * Canonical Standard tier (national SEO/AEO/GEO landing pages): £750 setup + £500/mo.
 * Territory Command premium tier uses {@link schemaTerritoryCommandServiceOffers} (£1,250 setup + £750/mo).
 */
export function schemaStandardTierServiceOffers(pageUrl: string): Record<string, unknown>[] {
  const seller = { '@id': `${BASE_URL}/#organization` };
  return [
    {
      '@type': 'Offer',
      name: 'Setup',
      price: '750',
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
      url: pageUrl,
      seller,
    },
    {
      '@type': 'Offer',
      name: 'Monthly Retainer',
      price: '500',
      priceCurrency: 'GBP',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '500',
        priceCurrency: 'GBP',
        billingDuration: 'P1M',
        unitText: 'MONTH',
      },
      availability: 'https://schema.org/InStock',
      url: pageUrl,
      seller,
    },
  ];
}

/** Territory Command premium tier — £1,250 setup + £750/mo (high-competition postcodes). */
export function schemaTerritoryCommandServiceOffers(pageUrl: string): Record<string, unknown>[] {
  const seller = { '@id': `${BASE_URL}/#organization` };
  return [
    {
      '@type': 'Offer',
      name: 'Setup',
      price: '1250',
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
      url: pageUrl,
      seller,
    },
    {
      '@type': 'Offer',
      name: 'Monthly Retainer (Territory Command)',
      price: '750',
      priceCurrency: 'GBP',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '750',
        priceCurrency: 'GBP',
        billingDuration: 'P1M',
        unitText: 'MONTH',
      },
      availability: 'https://schema.org/InStock',
      url: pageUrl,
      seller,
    },
  ];
}

// ============================================
// PRODUCT SCHEMA
// ============================================

export function generateProductSchema(
  name: string,
  description: string,
  url: string,
  offers?: Record<string, unknown>[],
  options?: {
    image?: string[];
    brand?: Record<string, unknown>;
  }
) {
  const schema: Record<string, unknown> = {
    '@type': 'Product',
    '@id': `${url}/#product`,
    name,
    description,
    brand: options?.brand ?? { '@id': `${BASE_URL}/#organization` },
  };

  if (options?.image && options.image.length > 0) {
    schema.image = options.image;
  }

  if (offers && offers.length > 0) {
    schema.offers = offers;
  }

  return schema;
}

const LLM_BRAIN_MERCHANT_RETURN_POLICY = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: 'GB',
  returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
};

const LLM_BRAIN_SHIPPING_DETAILS = {
  '@type': 'OfferShippingDetails',
  shippingRate: {
    '@type': 'MonetaryAmount',
    value: '0',
    currency: 'GBP',
  },
  shippingDestination: {
    '@type': 'DefinedRegion',
    addressCountry: 'GB',
  },
  deliveryTime: {
    '@type': 'ShippingDeliveryTime',
    businessDays: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    transitTime: {
      '@type': 'QuantitativeValue',
      minValue: 0,
      maxValue: 1,
      unitCode: 'DAY',
    },
  },
};

const LLM_BRAIN_OFFER_SELLER = {
  '@type': 'Organization',
  name: 'ScopeSite Digital Studios',
  url: BASE_URL,
};

/**
 * Product Offer[] for /llm-brain JSON-LD — includes fields required by Google Product rich results.
 */
export function generateLlmBrainProductOffers(): Record<string, unknown>[] {
  return [
    {
      '@type': 'Offer',
      name: 'LLM Brain done-for-you setup',
      description:
        'One-time build, configure, seed your data, Claude MCP and ChatGPT bridge, thirty-minute onboarding.',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'GBP',
        price: '250',
      },
      availability: 'https://schema.org/InStock',
      hasMerchantReturnPolicy: LLM_BRAIN_MERCHANT_RETURN_POLICY,
      shippingDetails: LLM_BRAIN_SHIPPING_DETAILS,
      seller: LLM_BRAIN_OFFER_SELLER,
    },
    {
      '@type': 'Offer',
      name: 'LLM Brain managed hosting',
      description: 'Hosted, maintained, updates and backups handled by ScopeSite.',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'GBP',
        price: '85',
      },
      availability: 'https://schema.org/InStock',
      hasMerchantReturnPolicy: LLM_BRAIN_MERCHANT_RETURN_POLICY,
      shippingDetails: LLM_BRAIN_SHIPPING_DETAILS,
      seller: LLM_BRAIN_OFFER_SELLER,
    },
  ];
}

// ============================================
// PROFESSIONAL SERVICE SCHEMA
// ============================================

export function generateProfessionalServiceSchema(
  name: string,
  description: string,
  url: string,
  services: ServiceItem[],
  image?: string
) {
  return {
    '@type': 'ProfessionalService',
    '@id': `${url}/#service`,
    name,
    description,
    url,
    image: image || `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
    // NAP (telephone, address, priceRange) lives on Organization — not duplicated here.
    // /web-design emits @type Service; those properties are invalid on Service and redundant vs provider.
    provider: {
      '@id': `${BASE_URL}/#organization`,
    },
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
    // List service types as text (avoids Offer validation issues)
    serviceType: services.map((service) => service.name),
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
  image?: string,
  options?: {
    knowsAbout?: string[];
    hasCredential?: { credentialCategory: string; description: string };
    sameAs?: string[];
  }
) {
  const schema: Record<string, unknown> = {
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

  if (options?.knowsAbout && options.knowsAbout.length > 0) {
    schema.knowsAbout = options.knowsAbout;
  }

  if (options?.hasCredential) {
    schema.hasCredential = {
      '@type': 'EducationalOccupationalCredential',
      ...options.hasCredential,
    };
  }

  if (options?.sameAs && options.sameAs.length > 0) {
    schema.sameAs = options.sameAs;
  }

  return schema;
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
// GENERIC WEBPAGE SCHEMA
// ============================================

export function generateWebPageSchema(
  title: string,
  description: string,
  url: string
) {
  const pageUrl = url.replace(/\/$/, '');
  return {
    '@type': 'WebPage',
    '@id': `${pageUrl}/#webpage`,
    name: title,
    description,
    url,
    isPartOf: { '@id': `${BASE_URL}/#website` },
    publisher: { '@id': `${BASE_URL}/#organization` },
    breadcrumb: { '@id': `${pageUrl}/#breadcrumb` },
    inLanguage: 'en-GB',
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
// UTILITY: HTML TO PLAIN TEXT
// ============================================

/**
 * Strips HTML tags and decodes HTML entities
 * Used for FAQ answers, HowTo steps, etc.
 */
export function stripHtmlToText(html: string): string {
  if (!html) return '';
  
  return html
    // Remove HTML tags
    .replace(/<[^>]+>/g, ' ')
    // Decode common HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&pound;/g, '£')
    .replace(/&euro;/g, '€')
    .replace(/&copy;/g, '©')
    .replace(/&trade;/g, '™')
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)))
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

// ============================================
// SMART MENTIONS EXTRACTION
// ============================================

// Known tools/platforms with their schema types
// Using 'Thing' type instead of 'SoftwareApplication' to avoid Google Rich Results
// validation errors (SoftwareApplication requires offers/aggregateRating)
const KNOWN_TOOLS: Record<string, { type: string; description: string }> = {
  'ChatGPT': { type: 'Thing', description: 'AI Assistant by OpenAI' },
  'GPT-4': { type: 'Thing', description: 'AI language model by OpenAI' },
  'GPT-4o': { type: 'Thing', description: 'AI language model by OpenAI' },
  'GPTBot': { type: 'Thing', description: 'Web crawler for ChatGPT' },
  'Claude': { type: 'Thing', description: 'AI Assistant by Anthropic' },
  'ClaudeBot': { type: 'Thing', description: 'Web crawler for Claude' },
  'Perplexity': { type: 'Thing', description: 'AI-powered search engine' },
  'PerplexityBot': { type: 'Thing', description: 'Web crawler for Perplexity' },
  'Gemini': { type: 'Thing', description: 'AI Assistant by Google' },
  'Google': { type: 'Organization', description: 'Technology company' },
  'Bing': { type: 'Thing', description: 'Search engine by Microsoft' },
  'Siri': { type: 'Thing', description: 'AI Assistant by Apple' },
  'Alexa': { type: 'Thing', description: 'AI Assistant by Amazon' },
  'WordPress': { type: 'Thing', description: 'Content management system' },
  'Wix': { type: 'Thing', description: 'Website builder platform' },
  'Squarespace': { type: 'Thing', description: 'Website builder platform' },
  'Shopify': { type: 'Thing', description: 'E-commerce platform' },
  'Webflow': { type: 'Thing', description: 'Website builder platform' },
  'Next.js': { type: 'Thing', description: 'React web framework' },
  'React': { type: 'Thing', description: 'JavaScript UI library' },
  'Ghost': { type: 'Thing', description: 'Publishing platform' },
  'Vercel': { type: 'Thing', description: 'Web hosting platform' },
  'Netlify': { type: 'Thing', description: 'Web hosting platform' },
  'Schema.org': { type: 'WebSite', description: 'Structured data vocabulary' },
  'JSON-LD': { type: 'Thing', description: 'Linked data format' },
  'GTmetrix': { type: 'Thing', description: 'Website performance tool' },
  'PageSpeed Insights': { type: 'Thing', description: 'Google performance tool' },
  'Lighthouse': { type: 'Thing', description: 'Web auditing tool' },
  'Ahrefs': { type: 'Thing', description: 'SEO analysis tool' },
  'Semrush': { type: 'Thing', description: 'SEO and marketing tool' },
  'MOZ': { type: 'Thing', description: 'SEO software' },
  'V.O.I.C.E': { type: 'Service', description: 'ScopeSite AI visibility methodology and scans' },
  'Google Lighthouse': { type: 'Thing', description: 'Web auditing tool by Google' },
};

/**
 * Extracts mentions of known tools/platforms from content
 * Returns array of matched mentions with their schema type
 */
export function extractMentionsFromContent(html: string): Array<{
  name: string;
  type: string;
  description: string;
}> {
  if (!html) return [];
  
  const mentions: Array<{ name: string; type: string; description: string }> = [];
  const contentLower = html.toLowerCase();
  
  for (const [name, info] of Object.entries(KNOWN_TOOLS)) {
    // Use word boundary check for more accurate matching
    const pattern = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (pattern.test(html) || contentLower.includes(name.toLowerCase())) {
      mentions.push({ name, ...info });
    }
  }
  
  return mentions;
}

// ============================================
// SMART ABOUT/TOPIC EXTRACTION
// ============================================

/**
 * Extracts topics from tags, title, and excerpt
 * Limited to primary_tag + first 3 tags to avoid bloat
 */
export function extractTopicsFromContent(
  tags: GhostPost['tags'],
  primaryTag: GhostPost['primary_tag']
): Array<Record<string, string>> {
  const topics: Array<Record<string, string>> = [];
  const addedNames = new Set<string>();
  
  // Add primary tag first
  if (primaryTag && !addedNames.has(primaryTag.name)) {
    topics.push({
      '@type': 'Thing',
      name: primaryTag.name,
    });
    addedNames.add(primaryTag.name);
  }
  
  // Add up to 3 more tags (excluding primary)
  if (tags) {
    for (const tag of tags) {
      if (!addedNames.has(tag.name) && topics.length < 4) {
        topics.push({
          '@type': 'Thing',
          name: tag.name,
        });
        addedNames.add(tag.name);
      }
    }
  }
  
  return topics;
}

// ============================================
// BLOG POSTING SCHEMA (Enhanced for GEO)
// ============================================

export function generateBlogPostingSchema(post: GhostPost, url: string, citations?: Array<{ name: string; url: string }>) {
  // Extract keywords from tags
  const keywords = post.tags?.map(t => t.name) || [];
  
  // Extract mentions from content
  const mentions = extractMentionsFromContent(post.html || '');
  
  // Extract about topics (limited to primary + 3 tags)
  const aboutTopics = extractTopicsFromContent(post.tags, post.primary_tag);

  // Multi-typing via tag mapping
  const tagSlugs = new Set(post.tags?.map(t => t.slug.toLowerCase()) || []);
  const types: string[] = ['BlogPosting'];
  if (tagSlugs.has('guide')) types.push('Guide');
  if (tagSlugs.has('tech-article')) types.push('TechArticle');
  if (tagSlugs.has('learning-resource')) types.push('LearningResource');

  const schema: Record<string, unknown> = {
    '@type': types.length === 1 ? types[0] : types,
    '@id': `${url}/#article`,
    headline: post.title,
    description: post.excerpt || post.custom_excerpt,
    url,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    inLanguage: 'en-GB',
    isAccessibleForFree: true,
    isPartOf: {
      '@id': `${BASE_URL}/blog/#blog`,
    },
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    mainEntityOfPage: {
      '@id': `${url}/#webpage`,
    },
    author: {
      '@id': `${BASE_URL}/#dan-cartwright`,
    },
  };

  // Add articleSection from primary tag
  if (post.primary_tag) {
    schema.articleSection = post.primary_tag.name;
  }

  // Add keywords from tags (only if non-empty)
  if (keywords.length > 0) {
    schema.keywords = keywords;
  }

  // Add about topics (only if non-empty)
  if (aboutTopics.length > 0) {
    schema.about = aboutTopics;
  }

  // Add mentions of tools/platforms (only if non-empty)
  // Using Thing type with description to avoid Google Rich Results validation errors
  if (mentions.length > 0) {
    schema.mentions = mentions.map(m => ({
      '@type': m.type,
      name: m.name,
      description: m.description,
    }));
  }

  // Add image if available
  if (post.feature_image) {
    schema.image = {
      '@type': 'ImageObject',
      url: post.feature_image,
      caption: post.feature_image_alt || post.title,
    };
  }

  // Add word count and reading time
  if (post.reading_time) {
    schema.wordCount = post.reading_time * 200;
    schema.timeRequired = `PT${post.reading_time}M`;
  }

  // TechArticle-specific properties
  if (tagSlugs.has('tech-article')) {
    schema.proficiencyLevel = 'Beginner';
  }

  // LearningResource-specific properties
  if (tagSlugs.has('learning-resource') && aboutTopics.length > 0) {
    schema.teaches = aboutTopics[0];
  }

  // Citations for external source references
  if (citations && citations.length > 0) {
    schema.citation = citations.map(c => ({
      '@type': 'CreativeWork',
      name: c.name,
      url: c.url,
    }));
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
    author: {
      '@id': `${BASE_URL}/#dan-cartwright`,
    },
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    image: post.feature_image,
  };
}

// ============================================
// SMART FAQ DETECTION & PARSING
// ============================================

// Question words that indicate a question heading
const QUESTION_WORDS = [
  'what', 'why', 'how', 'when', 'where', 'who', 
  'can', 'is', 'are', 'do', 'does', 'will', 'should', 'which',
  'could', 'would', 'have', 'has', 'was', 'were'
];

/**
 * Check if text starts with a question word, ends with ?, or starts with Q:
 */
function isQuestion(text: string): boolean {
  const trimmed = text.trim().toLowerCase();
  
  // Ends with question mark
  if (trimmed.endsWith('?')) return true;
  
  // Starts with Q: or Q.
  if (/^q[:.]\s*/i.test(trimmed)) return true;
  
  // Starts with a question word
  const firstWord = trimmed.split(/\s+/)[0];
  return QUESTION_WORDS.includes(firstWord);
}

/**
 * Remove Q: prefix from question text
 */
function cleanQuestionText(text: string): string {
  return text.replace(/^Q[:.]\s*/i, '').trim();
}

/**
 * Smart FAQ extraction from HTML content
 * Detects multiple patterns:
 * - H2/H3 headings that are questions (start with question word or end with ?)
 * - Q: Question? / A: Answer patterns (bold or headings)
 * - <h2>FAQ</h2> or <h2>Frequently Asked Questions</h2> sections
 * - Definition lists <dt> and <dd>
 */
export function extractFAQsFromContent(html: string): FAQItem[] {
  if (!html) return [];
  
  const faqs: FAQItem[] = [];
  const addedQuestions = new Set<string>();
  
  // Helper to add FAQ without duplicates
  const addFAQ = (question: string, answer: string) => {
    // Clean the question (remove Q: prefix if present)
    let cleanQuestion = stripHtmlToText(question);
    cleanQuestion = cleanQuestionText(cleanQuestion);
    
    // Clean the answer (remove A: prefix if present)
    let cleanAnswer = stripHtmlToText(answer);
    cleanAnswer = cleanAnswer.replace(/^A[:.]\s*/i, '').trim();
    
    if (
      cleanQuestion && 
      cleanAnswer && 
      cleanQuestion.length > 10 && 
      cleanAnswer.length > 20 &&
      !addedQuestions.has(cleanQuestion.toLowerCase())
    ) {
      faqs.push({ question: cleanQuestion, answer: cleanAnswer });
      addedQuestions.add(cleanQuestion.toLowerCase());
    }
  };
  
  // Pattern 1: H2/H3 that are questions followed by content until next heading
  // Matches: <h2>What is AI?</h2><p>AI is...</p>
  // Also matches: <h3>Q: What is AI?</h3><p>A: AI is...</p>
  const headingQuestionPattern = /<h([23])[^>]*>([\s\S]*?)<\/h\1>([\s\S]*?)(?=<h[123]|$)/gi;
  let match;
  
  while ((match = headingQuestionPattern.exec(html)) !== null) {
    const headingText = stripHtmlToText(match[2]).trim();
    const contentAfter = match[3];
    
    if (isQuestion(headingText)) {
      // Get content until next heading (first paragraph or all paragraphs)
      const answerMatch = contentAfter.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
      if (answerMatch) {
        // Get all paragraphs as the answer (max 3)
        const allParagraphs = contentAfter.match(/<p[^>]*>[\s\S]*?<\/p>/gi);
        const answer = allParagraphs 
          ? allParagraphs.slice(0, 3).join(' ')
          : answerMatch[1];
        addFAQ(headingText, answer);
      }
    }
  }
  
  // Pattern 2: Bold Q:/A: in paragraphs
  // Matches: <p><strong>Q: Question?</strong></p><p><strong>A:</strong> Answer</p>
  // Also matches: <p><strong>Q:</strong> Question?</p><p><strong>A:</strong> Answer</p>
  const boldQAPattern = /<p[^>]*>\s*<(?:strong|b)>\s*Q[:.]\s*([^<]*(?:<\/(?:strong|b)>[^<]*)?)<\/(?:strong|b)>([^<]*)<\/p>\s*<p[^>]*>\s*(?:<(?:strong|b)>\s*)?A[:.]\s*(?:<\/(?:strong|b)>\s*)?([\s\S]*?)<\/p>/gi;
  
  while ((match = boldQAPattern.exec(html)) !== null) {
    const question = (match[1] + match[2]).trim();
    const answer = match[3].trim();
    addFAQ(question, answer);
  }
  
  // Pattern 3: Explicit Q:/A: format (inline)
  // Matches: <strong>Q:</strong> Question? <strong>A:</strong> Answer
  const qaExplicitPattern = /<(?:strong|b)>\s*Q[:.]\s*<\/(?:strong|b)>\s*([^<]+(?:<(?!strong|b)[^>]+>[^<]*)*?)(?:<(?:strong|b)>\s*A[:.]\s*<\/(?:strong|b)>|<br\s*\/?>)\s*([\s\S]*?)(?=<(?:strong|b)>\s*Q[:.]\s*<\/(?:strong|b)>|<h[123]|$)/gi;
  
  while ((match = qaExplicitPattern.exec(html)) !== null) {
    addFAQ(match[1], match[2]);
  }
  
  // Pattern 4: Definition lists
  // Matches: <dt>Question?</dt><dd>Answer</dd>
  const dtPattern = /<dt[^>]*>([\s\S]*?)<\/dt>\s*<dd[^>]*>([\s\S]*?)<\/dd>/gi;
  
  while ((match = dtPattern.exec(html)) !== null) {
    const question = match[1];
    const answer = match[2];
    if (isQuestion(stripHtmlToText(question))) {
      addFAQ(question, answer);
    }
  }
  
  // Pattern 5: FAQ section - find FAQ heading and extract all Q&A within
  const faqSectionPattern = /<h[23][^>]*>(?:[^<]*(?:FAQ|Frequently Asked Questions?)[^<]*)<\/h[23]>([\s\S]*?)(?=<h[12]|$)/gi;
  
  while ((match = faqSectionPattern.exec(html)) !== null) {
    const sectionContent = match[1];
    
    // Extract Q: questions from this section (bold paragraphs or H3/H4)
    const sectionQPattern = /<(?:h[34][^>]*|p[^>]*>\s*<(?:strong|b))>Q[:.]\s*([\s\S]*?)(?:<\/h[34]|<\/(?:strong|b)>\s*<\/p)>[\s\S]*?<p[^>]*>(?:\s*<(?:strong|b)>)?\s*A[:.]\s*(?:<\/(?:strong|b)>\s*)?([\s\S]*?)<\/p>/gi;
    let sectionMatch;
    
    while ((sectionMatch = sectionQPattern.exec(sectionContent)) !== null) {
      addFAQ(sectionMatch[1], sectionMatch[2]);
    }
    
    // Also try regular headings in the section
    const sectionHeadingPattern = /<h([34])[^>]*>([^<]+)<\/h\1>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
    
    while ((sectionMatch = sectionHeadingPattern.exec(sectionContent)) !== null) {
      addFAQ(sectionMatch[2], sectionMatch[3]);
    }
  }
  
  return faqs;
}

/**
 * Check if a post should have FAQ schema generated
 * Returns true if 2+ FAQs are detected
 */
export function postHasFAQContent(post: GhostPost): boolean {
  // Quick check for FAQ tag
  if (post.tags?.some(t => 
    t.slug === 'faq' || 
    t.name.toLowerCase() === 'faq' ||
    t.name.toLowerCase().includes('frequently asked')
  )) {
    return true;
  }
  
  // Check content for FAQ patterns
  if (post.html) {
    const faqs = extractFAQsFromContent(post.html);
    return faqs.length >= 2;
  }
  
  return false;
}

/**
 * Generate FAQ schema for a blog post if it has FAQ content
 * Only generates if 2+ FAQs are found
 */
export function generateBlogFAQSchema(post: GhostPost): Record<string, unknown> | null {
  const faqs = extractFAQsFromContent(post.html || '');
  
  // Require at least 2 FAQs
  if (faqs.length < 2) return null;
  
  return generateFAQSchema(faqs);
}

// ============================================
// SMART HOWTO DETECTION & PARSING
// ============================================

// Sequence words that indicate steps
const SEQUENCE_WORDS = [
  'first', 'second', 'third', 'fourth', 'fifth', 
  'next', 'then', 'finally', 'lastly', 'afterwards',
  'begin by', 'start by', 'start with', 'begin with'
];

/**
 * Check if a post should have HowTo schema
 * Triggers on title patterns, tags, or content structure
 */
export function postHasHowToContent(post: GhostPost): boolean {
  const howToTags = ['tutorial', 'how-to', 'howto', 'guide', 'step-by-step', 'walkthrough'];
  const titleLower = post.title.toLowerCase();
  
  // Check tags
  if (post.tags?.some(t => 
    howToTags.includes(t.slug.toLowerCase()) || 
    howToTags.some(ht => t.name.toLowerCase().includes(ht))
  )) {
    return true;
  }
  
  // Check title patterns
  if (
    titleLower.startsWith('how to') ||
    titleLower.includes('guide') ||
    titleLower.includes('tutorial') ||
    titleLower.includes('step-by-step') ||
    titleLower.includes('walkthrough')
  ) {
    return true;
  }
  
  return false;
}

/**
 * Smart HowTo step extraction from HTML content
 * Detects multiple patterns:
 * - H2/H3 starting with "Step 1", "Step 2", etc.
 * - H2/H3 starting with numbers: "1.", "2.", "3."
 * - Ordered lists <ol><li>
 * - Headings with sequence words: "First,", "Next,", "Finally,"
 */
export function extractHowToFromContent(
  html: string, 
  title: string
): HowToStep[] {
  if (!html) return [];
  
  const steps: HowToStep[] = [];
  let match;
  
  // Pattern 1: "Step N:" or "Step N." or "Step N -" in headings
  // Matches: <h2>Step 1: Configure settings</h2><p>Details...</p>
  const stepHeadingPattern = /<h([23])[^>]*>\s*(?:Step\s*)?(\d+)[\s:.–-]+([^<]+)<\/h\1>([\s\S]*?)(?=<h[123]|$)/gi;
  
  while ((match = stepHeadingPattern.exec(html)) !== null) {
    const stepName = stripHtmlToText(match[3]);
    const contentAfter = match[4];
    
    // Get first paragraph(s) as step description
    const paragraphs = contentAfter.match(/<p[^>]*>[\s\S]*?<\/p>/gi);
    const stepText = paragraphs 
      ? stripHtmlToText(paragraphs.slice(0, 2).join(' '))
      : '';
    
    if (stepName && stepText.length > 10) {
      steps.push({ name: stepName, text: stepText });
    }
  }
  
  // Pattern 2: Numbered headings without "Step" prefix
  // Matches: <h3>1. Configure settings</h3>
  if (steps.length === 0) {
    const numberedHeadingPattern = /<h([23])[^>]*>\s*(\d+)[.)]\s*([^<]+)<\/h\1>([\s\S]*?)(?=<h[123]|$)/gi;
    
    while ((match = numberedHeadingPattern.exec(html)) !== null) {
      const stepName = stripHtmlToText(match[3]);
      const contentAfter = match[4];
      
      const paragraphs = contentAfter.match(/<p[^>]*>[\s\S]*?<\/p>/gi);
      const stepText = paragraphs 
        ? stripHtmlToText(paragraphs.slice(0, 2).join(' '))
        : '';
      
      if (stepName && stepText.length > 10) {
        steps.push({ name: stepName, text: stepText });
      }
    }
  }
  
  // Pattern 3: Ordered list items (if no step headings found)
  // Matches: <ol><li>Do this first</li><li>Then do this</li></ol>
  if (steps.length === 0) {
    const olPattern = /<ol[^>]*>([\s\S]*?)<\/ol>/gi;
    
    while ((match = olPattern.exec(html)) !== null) {
      const olContent = match[1];
      const liPattern = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let liMatch;
      let stepNum = 1;
      
      while ((liMatch = liPattern.exec(olContent)) !== null) {
        const content = stripHtmlToText(liMatch[1]);
        if (content.length > 15) {
          // Try to split into name and description
          const parts = content.split(/[:.–-]\s+/);
          if (parts.length > 1 && parts[0].length < 50) {
            steps.push({
              name: parts[0].trim(),
              text: parts.slice(1).join('. ').trim(),
            });
          } else {
            steps.push({
              name: `Step ${stepNum}`,
              text: content,
            });
          }
          stepNum++;
        }
      }
      
      // Only use first meaningful ordered list with 3+ items
      if (steps.length >= 3) break;
    }
  }
  
  // Pattern 4: Sequence word headings
  // Matches: <h3>First, configure your settings</h3>
  if (steps.length === 0) {
    for (const word of SEQUENCE_WORDS) {
      const seqPattern = new RegExp(
        `<h([23])[^>]*>\\s*(${word}[,:]?\\s+[^<]+)<\\/h\\1>([\\s\\S]*?)(?=<h[123]|$)`,
        'gi'
      );
      
      while ((match = seqPattern.exec(html)) !== null) {
        const headingText = stripHtmlToText(match[2]);
        const contentAfter = match[3];
        
        const paragraphs = contentAfter.match(/<p[^>]*>[\s\S]*?<\/p>/gi);
        const stepText = paragraphs 
          ? stripHtmlToText(paragraphs.slice(0, 2).join(' '))
          : '';
        
        // Remove the sequence word from the step name
        const stepName = headingText.replace(new RegExp(`^${word}[,:]?\\s*`, 'i'), '').trim();
        
        if (stepName && stepText.length > 10) {
          steps.push({ name: stepName || headingText, text: stepText });
        }
      }
    }
  }
  
  return steps;
}

/**
 * Generate HowTo schema for a blog post if it has tutorial content
 * Only generates if 2+ steps are found
 */
export function generateBlogHowToSchema(
  post: GhostPost,
  url: string
): Record<string, unknown> | null {
  if (!postHasHowToContent(post)) return null;
  
  const steps = extractHowToFromContent(post.html || '', post.title);
  
  // Require at least 2 steps
  if (steps.length < 2) return null;
  
  const schema: Record<string, unknown> = {
    '@type': 'HowTo',
    '@id': `${url}/#howto`,
    name: post.title,
    description: post.excerpt || post.custom_excerpt || `Learn ${post.title}`,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
  
  // Add image if available
  if (post.feature_image) {
    schema.image = {
      '@type': 'ImageObject',
      url: post.feature_image,
    };
  }
  
  // Add estimated time if available
  if (post.reading_time) {
    schema.totalTime = `PT${post.reading_time}M`;
  }
  
  return schema;
}

// ============================================
// SPEAKABLE SCHEMA
// ============================================

/**
 * Returns a SpeakableSpecification object to embed as a property on
 * existing schemas (BlogPosting, WebPage, etc.)
 */
export function generateSpeakableSchema(cssSelectors: string[]) {
  return {
    '@type': 'SpeakableSpecification',
    cssSelector: cssSelectors,
  };
}

// ============================================
// OFFER SCHEMA (for pricing)
// ============================================

export function generateOfferSchema(
  name: string,
  description: string,
  priceRange: string,
  currency: string = 'GBP'
) {
  return {
    '@type': 'Offer',
    name,
    description,
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: currency,
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
// WEBPAGE + FAQPAGE COMBINED SCHEMA
// ============================================

/**
 * Generates a combined WebPage + FAQPage schema for service landing pages
 * Used for pages like /ai-website-design, /schema-markup, /ai-seo-services
 */
export function generateWebPageFAQPageSchema(
  url: string,
  name: string,
  description: string,
  faqs: FAQItem[],
  serviceId?: string,
  speakableCssSelectors?: string[]
) {
  const pageUrl = url.replace(/\/$/, '');
  const schema: Record<string, unknown> = {
    '@type': 'WebPage',
    '@id': `${pageUrl}/#webpage`,
    url,
    name,
    description,
    inLanguage: 'en-GB',
    isPartOf: { '@id': `${BASE_URL}/#website` },
    about: serviceId ? { '@id': serviceId } : { '@id': `${BASE_URL}/#organization` },
    breadcrumb: { '@id': `${pageUrl}/#breadcrumb` },
  };

  if (speakableCssSelectors && speakableCssSelectors.length > 0) {
    schema.speakable = generateSpeakableSchema(speakableCssSelectors);
  }

  return schema;
}

// ============================================
// LOCAL SERVICE SCHEMA (for local landing pages)
// ============================================

export interface AreaServedItem {
  type: 'AdministrativeArea' | 'City' | 'Country' | 'State';
  name: string;
}

export interface ServiceOffer {
  name: string;
  price: string;
}

/**
 * Generates Service schema with local areaServed targeting
 * Used for local pages like /web-design-somerset, /web-design-bath, /web-design-bristol
 */
export function generateLocalServiceSchema(
  name: string,
  alternateNames: string[],
  description: string,
  url: string,
  areaServed: AreaServedItem[],
  offers?: ServiceOffer[],
  serviceType: string = 'Web Design',
  currency: string = 'GBP'
) {
  const schema: Record<string, unknown> = {
    '@type': 'Service',
    '@id': `${url}/#service`,
    name,
    alternateName: alternateNames,
    description,
    provider: { '@id': `${BASE_URL}/#organization` },
    serviceType,
    areaServed: areaServed.map((area) => ({
      '@type': area.type,
      name: area.name,
    })),
  };

  if (offers && offers.length > 0) {
    schema.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: `${name} Packages`,
      itemListElement: offers.map((offer) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: offer.name,
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: offer.price,
          priceCurrency: currency,
        },
      })),
    };
  }

  return schema;
}

/**
 * Generates a LocalBusiness schema variant for local landing pages
 * Uses a page-scoped @id (…/path/#local-business) so e.g. web-design-bristol and
 * seo-bristol do not both emit the same #local-bristol fragment on the apex URL.
 * References the parent Organization via parentOrganization.
 */
export function generateLocalBusinessSchema(
  areaName: string,
  areaServed: AreaServedItem[],
  pageUrl: string
) {
  const pageBase = pageUrl.replace(/\/$/, '');
  return {
    '@type': 'LocalBusiness',
    '@id': `${pageBase}/#local-business`,
    name: `ScopeSite Digital Studios - ${areaName}`,
    description: `AI-first web design agency serving ${areaName}. Based in Frome, Somerset.`,
    parentOrganization: { '@id': `${BASE_URL}/#organization` },
    telephone: '+441373311339',
    email: 'support@scopesite.co.uk',
    url: pageBase,
    priceRange: '££-£££',
    currenciesAccepted: 'GBP',
    paymentAccepted: 'Bank Transfer, Credit Card',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '4 Horse Close',
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
    areaServed: areaServed.map((area) => ({
      '@type': area.type,
      name: area.name,
    })),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
  };
}

/**
 * Generates an Organization reference for US-market pages.
 * ScopeSite has a UK office and serves US clients remotely, so these pages
 * should not claim a separate US LocalBusiness location.
 */
export function generateUSOrganizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'ScopeSite Digital Studios',
    legalName: 'ScopeSite Digital Studios Ltd',
    description:
      'AI-first web design agency based in the UK, serving businesses across the United States.',
    telephone: '+441373311339',
    email: 'dan@scopesite.co.uk',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      '@id': `${BASE_URL}/#logo`,
      url: `${BASE_URL}/images/logo-icon.svg`,
      contentUrl: `${BASE_URL}/images/logo-icon.svg`,
      name: 'ScopeSite Digital Studios Logo',
      width: 512,
      height: 512,
    },
    currenciesAccepted: 'USD',
    paymentAccepted: 'Bank Transfer, Credit Card',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '4 Horse Close',
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
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
  };
}

// ============================================
// LANDING PAGE SCHEMA HELPER
// ============================================

/**
 * Helper to generate complete schema graph for a landing page
 * Combines WebPage+FAQPage, Service, and Breadcrumb schemas
 */
export function generateLandingPageSchema(
  url: string,
  pageName: string,
  pageTitle: string,
  pageDescription: string,
  faqs: FAQItem[],
  service: {
    name: string;
    alternateNames?: string[];
    description: string;
  },
  isLocal?: {
    areaName: string;
    areas: AreaServedItem[];
    offers?: ServiceOffer[];
  },
  serviceOptions?: {
    isRelatedTo?: Array<{ '@id': string }>;
    availableChannel?: Record<string, unknown>[];
    potentialAction?: Record<string, unknown>;
    /** National Service only — replaces legacy hard-coded default */
    serviceType?: string;
    category?: string;
    offers?: Record<string, unknown> | Record<string, unknown>[];
  },
  speakableCssSelectors?: string[]
) {
  const schemas: Record<string, unknown>[] = [];

  // 1. WebPage + FAQPage combined
  schemas.push(
    generateWebPageFAQPageSchema(
      url,
      pageTitle,
      pageDescription,
      faqs,
      `${url}/#service`,
      speakableCssSelectors
    )
  );

  if (faqs.length > 0) {
    schemas.push(generateFAQSchema(faqs));
  }

  // 2. Service schema (local or national)
  const serviceExtras: Record<string, unknown> = {};
  if (serviceOptions?.isRelatedTo) serviceExtras.isRelatedTo = serviceOptions.isRelatedTo;
  if (serviceOptions?.availableChannel) serviceExtras.availableChannel = serviceOptions.availableChannel;
  if (serviceOptions?.potentialAction) serviceExtras.potentialAction = serviceOptions.potentialAction;

  if (isLocal) {
    schemas.push({
      ...generateLocalServiceSchema(
        service.name,
        service.alternateNames || [],
        service.description,
        url,
        isLocal.areas,
        isLocal.offers
      ),
      ...serviceExtras,
    });
  } else {
    const nationalService: Record<string, unknown> = {
      '@type': 'Service',
      '@id': `${url}/#service`,
      url,
      name: service.name,
      alternateName: service.alternateNames || [],
      description: service.description,
      provider: { '@id': `${BASE_URL}/#organization` },
      serviceType: serviceOptions?.serviceType ?? 'Professional services',
      areaServed: {
        '@type': 'Country',
        name: 'United Kingdom',
      },
      ...serviceExtras,
    };
    if (serviceOptions?.category) {
      nationalService.category = serviceOptions.category;
    }
    if (serviceOptions?.offers) {
      nationalService.offers = serviceOptions.offers;
    }
    schemas.push(nationalService);
  }

  // 3. Breadcrumb
  schemas.push(
    generateBreadcrumbSchema([
      { name: 'Home', url: BASE_URL },
      { name: pageName, url },
    ])
  );

  return wrapInGraph(schemas);
}

// ============================================
// GRAPH WRAPPER
// ============================================

export function generateImageObjectSchema(options: {
  contentUrl: string;
  name: string;
  description: string;
  width: number;
  height: number;
  id?: string;
}) {
  const schema: Record<string, unknown> = {
    '@type': 'ImageObject',
    contentUrl: options.contentUrl,
    url: options.contentUrl,
    name: options.name,
    description: options.description,
    width: options.width,
    height: options.height,
    inLanguage: 'en-GB',
  };

  if (options.id) {
    schema['@id'] = options.id;
  }

  return schema;
}

export function wrapInGraph(schemas: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  };
}

// ============================================
// SCHEMA-DRIVEN PUBLIC PRICING
// ============================================
//
// `generatePricingSchema()` and `generatePricingQuoteCalculatorWebApplicationSchema()`
// publish the same eleven canonical UK offers: Wix Starter/Pro/Enterprise (pay in full),
// Ultra Fast SSR (from base price), AI SEO standalone retainer, Territory Command
// Standard & Premium, Wix WaaS & SSR WaaS, Smart Forms, and AI Chatbot.
// Numeric values are read from PRICING_CONFIG, VOICE_SPEC, and ADDON_CATALOG.

interface OfferGbpOptions {
  /** Optional short identifier for @id disambiguation */
  id?: string;
  /** Availability URL; defaults to InStock */
  availability?: string;
}

/**
 * Build a one-time-price GBP Offer. Price is a single number, never a range.
 */
function offerGbp(
  name: string,
  price: number,
  description: string,
  options: OfferGbpOptions = {}
): Record<string, unknown> {
  return {
    '@type': 'Offer',
    ...(options.id ? { '@id': `${BASE_URL}/pricing#offer-${options.id}` } : {}),
    name,
    description,
    price: String(price),
    priceCurrency: 'GBP',
    availability: options.availability ?? 'https://schema.org/InStock',
    seller: { '@id': `${BASE_URL}/#organization` },
  };
}

interface OfferMonthlyOptions extends OfferGbpOptions {
  /**
   * Minimum-term commitment as ISO 8601 duration, e.g. 'P6M' or 'P12M'.
   * When set, produces an `eligibleDuration` QuantitativeValue in months.
   */
  minimumTerm?: 'P6M' | 'P12M';
  /** Optional warranty/guarantee description — rendered as WarrantyPromise */
  warranty?: string;
}

/**
 * Build a recurring-monthly GBP Offer with proper UnitPriceSpecification.
 * Used for V.O.I.C.E retainer tiers and LLM Brain managed subscription.
 */
function offerMonthlyGbp(
  name: string,
  monthlyPrice: number,
  description: string,
  options: OfferMonthlyOptions = {}
): Record<string, unknown> {
  const offer: Record<string, unknown> = {
    '@type': 'Offer',
    ...(options.id ? { '@id': `${BASE_URL}/pricing#offer-${options.id}` } : {}),
    name,
    description,
    price: String(monthlyPrice),
    priceCurrency: 'GBP',
    availability: options.availability ?? 'https://schema.org/InStock',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: String(monthlyPrice),
      priceCurrency: 'GBP',
      billingDuration: 'P1M',
      unitCode: 'MON',
      referenceQuantity: {
        '@type': 'QuantitativeValue',
        value: 1,
        unitCode: 'MON',
      },
    },
    seller: { '@id': `${BASE_URL}/#organization` },
  };

  if (options.minimumTerm) {
    const months = options.minimumTerm === 'P12M' ? 12 : 6;
    offer.eligibleDuration = {
      '@type': 'QuantitativeValue',
      value: months,
      unitCode: 'MON',
      minValue: months,
    };
  }

  if (options.warranty) {
    offer.warranty = {
      '@type': 'WarrantyPromise',
      durationOfWarranty: {
        '@type': 'QuantitativeValue',
        value: options.minimumTerm === 'P12M' ? 12 : 6,
        unitCode: 'MON',
      },
      description: options.warranty,
    };
  }

  return offer;
}

/** Customer-facing warranty text for JSON-LD (matches T&Cs v5 clause 14.4; no internal product codenames). */
const AI_SEARCH_PERFORMANCE_GUARANTEE_WARRANTY =
  'AI Search Performance Guarantee: for clients on an active AI SEO Retainer or Territory Command, ScopeSite guarantees an AI Search Performance Score of 80 or above. After a 3-month build-up window, if your score falls below 80 in any measured month and you meet the plan conditions, you pay nothing for that month’s retainer fee.';

const UK_PRICING_PAGE_URL = `${BASE_URL}/pricing`;

function pricingMonthlyUnitSpec(price: number, name?: string): Record<string, unknown> {
  const spec: Record<string, unknown> = {
    '@type': 'UnitPriceSpecification',
    price: String(price),
    priceCurrency: 'GBP',
    billingDuration: 'P1M',
    unitCode: 'MON',
    referenceQuantity: {
      '@type': 'QuantitativeValue',
      value: 1,
      unitCode: 'MON',
    },
  };
  if (name) spec.name = name;
  return spec;
}

/**
 * Eleven canonical UK pricing offers for /pricing — shared by Service JSON-LD and WebApplication JSON-LD.
 * Numeric values are read from PRICING_CONFIG / VOICE_SPEC / ADDON_CATALOG (not hardcoded).
 */
export function buildCanonicalUkPricingOffers(pageUrl: string): Record<string, unknown>[] {
  const seller = { '@id': `${BASE_URL}/#organization` };
  const {
    baseWebsite: { starter, professional, enterprise },
    ssrWebsite: { base: ssrBase },
    waas,
    perPageRate,
  } = PRICING_CONFIG;

  const smartFormsPrice = ADDON_CATALOG.smartForms.price;
  const aiChatbotPrice = ADDON_CATALOG.aiChatbot.price;

  return [
    {
      '@type': 'Offer',
      '@id': `${BASE_URL}/pricing#offer-wix-starter-pif`,
      name: 'Wix Studio Starter (Pay In Full)',
      description:
        'Wix Studio build, up to 5 pages (Manage Yourself After Build). One-off price before any pay-in-full discount.',
      price: String(starter),
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
      url: pageUrl,
      seller,
      eligibleCustomerType: 'Business OR Sole Trader',
    },
    {
      '@type': 'Offer',
      '@id': `${BASE_URL}/pricing#offer-wix-professional-pif`,
      name: 'Wix Studio Professional (Pay In Full)',
      description:
        'Wix Studio build, 6–10 pages (Manage Yourself After Build). One-off price before any pay-in-full discount.',
      price: String(professional),
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
      url: pageUrl,
      seller,
      eligibleCustomerType: 'Business OR Sole Trader',
    },
    {
      '@type': 'Offer',
      '@id': `${BASE_URL}/pricing#offer-wix-enterprise-pif`,
      name: 'Wix Studio Enterprise (Pay In Full from £7,500)',
      description: `Wix Studio build from 11+ pages. Base from £${enterprise.toLocaleString('en-GB')} plus £${perPageRate} per page above 10 (Manage Yourself After Build). One-off price before any pay-in-full discount.`,
      price: String(enterprise),
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
      url: pageUrl,
      seller,
      eligibleCustomerType: 'Business OR Sole Trader',
    },
    {
      '@type': 'Offer',
      '@id': `${BASE_URL}/pricing#offer-ssr-pif`,
      name: 'Ultra Fast SSR (Pay In Full from £2,000)',
      description:
        'Ultra Fast server-side rendered website (AI Visible Premium). From £2,000 for up to 5 pages; per-page increments apply for larger sites up to the standard calculator ceiling. AI SEO methodology bundled on SSR builds.',
      price: String(ssrBase),
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
      url: pageUrl,
      seller,
      eligibleCustomerType: 'Business OR Sole Trader',
    },
    {
      '@type': 'Offer',
      '@id': `${BASE_URL}/pricing#offer-ai-seo-standalone`,
      name: 'AI SEO Retainer (Standalone)',
      description: `£${VOICE_SPEC.setupFee} one-off setup fee plus £${VOICE_SPEC.monthlyPrice} per calendar month. Minimum commitment 6 or 12 months (chosen at signup). Includes ongoing AI Search Performance work, schema and entity optimisation, and monthly reporting across major AI assistants and AI Overviews.`,
      availability: 'https://schema.org/InStock',
      url: pageUrl,
      seller,
      eligibleCustomerType: 'Business',
      priceSpecification: [
        {
          '@type': 'UnitPriceSpecification',
          name: 'Setup fee',
          price: String(VOICE_SPEC.setupFee),
          priceCurrency: 'GBP',
        },
        pricingMonthlyUnitSpec(VOICE_SPEC.monthlyPrice, 'Monthly retainer'),
      ],
      warranty: {
        '@type': 'WarrantyPromise',
        description: AI_SEARCH_PERFORMANCE_GUARANTEE_WARRANTY,
      },
    },
    {
      '@type': 'Offer',
      '@id': `${BASE_URL}/pricing#offer-territory-standard`,
      name: 'Territory Command Standard',
      description:
        'Postcode-exclusive AI SEO and lead-generation product. £750 setup plus £500 per calendar month; 12-month minimum term.',
      availability: 'https://schema.org/InStock',
      url: pageUrl,
      seller,
      eligibleCustomerType: 'Business',
      priceSpecification: [
        {
          '@type': 'UnitPriceSpecification',
          name: 'Setup fee',
          price: '750',
          priceCurrency: 'GBP',
        },
        pricingMonthlyUnitSpec(500, 'Monthly retainer'),
      ],
      warranty: {
        '@type': 'WarrantyPromise',
        description: AI_SEARCH_PERFORMANCE_GUARANTEE_WARRANTY,
      },
    },
    {
      '@type': 'Offer',
      '@id': `${BASE_URL}/pricing#offer-territory-premium`,
      name: 'Territory Command Premium',
      description:
        'Postcode-exclusive AI SEO and lead-generation product for high-competition areas. £1,250 setup plus £750 per calendar month; 12-month minimum term.',
      availability: 'https://schema.org/InStock',
      url: pageUrl,
      seller,
      eligibleCustomerType: 'Business',
      priceSpecification: [
        {
          '@type': 'UnitPriceSpecification',
          name: 'Setup fee',
          price: '1250',
          priceCurrency: 'GBP',
        },
        pricingMonthlyUnitSpec(750, 'Monthly retainer'),
      ],
      warranty: {
        '@type': 'WarrantyPromise',
        description: AI_SEARCH_PERFORMANCE_GUARANTEE_WARRANTY,
      },
    },
    {
      '@type': 'Offer',
      '@id': `${BASE_URL}/pricing#offer-waas-wix-starter`,
      name: 'Wix Studio Starter WaaS (Website-as-a-Service)',
      description: `Website-as-a-Service on Wix Studio Starter (up to 5 pages). £${waas.setupFee} setup plus £${waas.monthlyFee} per month on a 30-day rolling subscription; no minimum term beyond notice. ScopeSite retains ownership of the build during the subscription; client holds a licence to use the site. Buyout fee £${waas.buyoutFees.wixStarter.toLocaleString('en-GB')} if you later want to own the asset outright.`,
      availability: 'https://schema.org/InStock',
      url: pageUrl,
      seller: {
        '@type': 'Organization',
        name: 'ScopeSite Digital Studios',
        url: BASE_URL,
      },
      eligibleCustomerType: 'Sole Trader OR Business',
      priceSpecification: [
        {
          '@type': 'UnitPriceSpecification',
          name: 'Setup fee',
          price: String(waas.setupFee),
          priceCurrency: 'GBP',
        },
        pricingMonthlyUnitSpec(waas.monthlyFee, 'Monthly subscription'),
      ],
    },
    {
      '@type': 'Offer',
      '@id': `${BASE_URL}/pricing#offer-waas-ssr`,
      name: 'Ultra Fast SSR WaaS (Website-as-a-Service)',
      description: `Website-as-a-Service on Ultra Fast SSR builds up to ${waas.ssrPageCap} pages. £${waas.setupFee} setup plus £${waas.monthlyFee} per month on a 30-day rolling subscription; no minimum term beyond notice. ScopeSite retains ownership of the build during the subscription. Flat buyout tiers: £${waas.buyoutFees.ssrBase.toLocaleString('en-GB')} (≤5 pages), £${waas.buyoutFees.ssrPlus.toLocaleString('en-GB')} (6–10 pages), £${waas.buyoutFees.ssrPremium.toLocaleString('en-GB')} (11–20 pages).`,
      availability: 'https://schema.org/InStock',
      url: pageUrl,
      seller: {
        '@type': 'Organization',
        name: 'ScopeSite Digital Studios',
        url: BASE_URL,
      },
      eligibleCustomerType: 'Sole Trader OR Business',
      priceSpecification: [
        {
          '@type': 'UnitPriceSpecification',
          name: 'Setup fee',
          price: String(waas.setupFee),
          priceCurrency: 'GBP',
        },
        pricingMonthlyUnitSpec(waas.monthlyFee, 'Monthly subscription'),
      ],
    },
    {
      '@type': 'Offer',
      '@id': `${BASE_URL}/pricing#offer-addon-smart-forms`,
      name: 'Smart Forms Add-On',
      description: ADDON_CATALOG.smartForms.label,
      price: String(smartFormsPrice),
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
      url: pageUrl,
      seller,
      eligibleCustomerType: 'Business OR Sole Trader',
    },
    {
      '@type': 'Offer',
      '@id': `${BASE_URL}/pricing#offer-addon-ai-chatbot`,
      name: 'AI Chatbot Add-On',
      description: ADDON_CATALOG.aiChatbot.label,
      price: String(aiChatbotPrice),
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
      url: pageUrl,
      seller,
      eligibleCustomerType: 'Business OR Sole Trader',
    },
  ];
}

/**
 * WebApplication JSON-LD for the Quote Calculator — canonical 11-offer list (T&Cs v5 + WaaS).
 */
export function generatePricingQuoteCalculatorWebApplicationSchema(): Record<string, unknown> {
  return {
    '@type': 'WebApplication',
    name: 'ScopeSite Quote Calculator',
    url: UK_PRICING_PAGE_URL,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'Interactive quote calculator for Wix Studio builds, Ultra Fast SSR, Website-as-a-Service (WaaS), AI SEO retainers, Territory Command, and selected add-ons. Deterministic pricing rules are published at /llms-full.txt.',
    offers: buildCanonicalUkPricingOffers(UK_PRICING_PAGE_URL),
  };
}

/**
 * Build a complete Service + Offer[] JSON-LD for the /pricing page.
 * Offers match the WebApplication quote calculator list (11 canonical products).
 */
export function generatePricingSchema(): Record<string, unknown> {
  const offers = buildCanonicalUkPricingOffers(UK_PRICING_PAGE_URL);

  return {
    '@type': 'Service',
    '@id': `${BASE_URL}/pricing/#service`,
    url: UK_PRICING_PAGE_URL,
    name: 'AI Visibility and Web Design Services',
    serviceType: 'Web design and AI visibility pricing',
    category: 'Pricing',
    description:
      'Transparent UK pricing for Wix Studio builds, Ultra Fast SSR websites, Website-as-a-Service (WaaS), standalone AI SEO retainers, Territory Command postcode exclusivity, and selected add-ons. Values mirror the on-site Quote Calculator and published rules.',
    provider: { '@id': `${BASE_URL}/#organization` },
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
    offers,
  };
}

// Simple GBP formatter that works at module evaluation time (the public
// `formatCurrency` helper in calculate-quote.ts depends on Intl, which is
// fine but we want to keep schema.ts lean). Non-breaking space between £ and
// digits matches how GBP is typically written in marketing copy.
function formatGbpStatic(amount: number): string {
  return `£${amount.toLocaleString('en-GB')}`;
}

