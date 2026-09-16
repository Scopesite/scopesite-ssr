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

export function generateOrganizationSchema() {
  return {
    '@type': ['Organization', 'LocalBusiness', 'ProfessionalService'],
    '@id': `${BASE_URL}/#organization`,
    name: 'ScopeSite Digital Studios',
    legalName: 'SCOPESITE LTD',
    description: 'Veteran-owned AI-first web design agency in Somerset, UK. We build fast, HTML-first websites optimised for Google, ChatGPT, Claude, Perplexity and Google AI Overviews using our AI visibility methodology.',
    url: BASE_URL,
    telephone: '+441373311339',
    email: 'support@scopesite.co.uk',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Frome',
      addressRegion: 'Somerset',
      addressCountry: 'GB',
    },
    areaServed: [
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'United States' },
    ],
    founder: generateFounderPersonSchema(),
    foundingDate: '2024-12-01',
  };
}
