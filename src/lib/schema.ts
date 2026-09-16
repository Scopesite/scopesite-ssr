/**
 * JSON-LD Schema Generator Functions
 * 
 * Generates structured data for SEO and AI visibility.
 * All schemas use @id references to create a linked graph.
 */

import { GhostPost } from './ghost';
import { ADDON_CATALOG, PRICING_CONFIG, VOICE_SPEC } from './pricing-config';
import type { GlossaryTerm } from './glossary-db';

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
    legalName: 'SCOPESITE LTD',
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
      addressLocality: 'Frome',
      addressRegion: 'Somerset',
      addressCountry: 'GB',
    },
    areaServed: [
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
    award: [
      'MoD Employer Recognition Scheme Bronze Award 2026',
      'Armed Forces Covenant signatory',
      'British Veteran Owned: verified member',
      'Veteran Owned UK: verified member',
    ],
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
      'https://github.com/Scopesite/scopesite-ssr',
      'https://github.com/Scopesite/voice',
      'https://www.trustpilot.com/review/scopesite.co.uk',
    ],
  };
}
