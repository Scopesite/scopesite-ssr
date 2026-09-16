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
  };
}

export function generateLeanOrganizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'ScopeSite Digital Studios',
    legalName: 'SCOPESITE LTD',
    url: BASE_URL,
    foundingDate: '2024-12-01',
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

export function generateFounderPersonSchema() {
  return {
    '@type': 'Person',
    '@id': `${BASE_URL}/#dan-cartwright`,
    name: 'Dan Cartwright',
    jobTitle: 'Founder & Director',
    description: 'British Army veteran and founder of ScopeSite Digital Studios. Leads our AI visibility methodology for AI search.',
    worksFor: { '@id': `${BASE_URL}/#organization` },
    url: `${BASE_URL}/about`,
    image: [`${BASE_URL}/images/dan-headshot.webp`],
    sameAs: ['https://www.linkedin.com/in/dan-cartwright-scopesite'],
    knowsAbout: ['AI Search Optimisation', 'HTML-first web delivery', 'Next.js', 'AI visibility methodology', 'Structured data', 'Schema Markup', 'Generative Engine Optimisation', 'AI Visibility', 'Answer Engine Optimisation', 'Web Design', 'Recruitment Websites', 'Entity SEO'],
    knowsLanguage: 'en-GB',
  };
}

export function generateWebsiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'ScopeSite Digital Studios',
    publisher: { '@id': `${BASE_URL}/#organization` },
    inLanguage: 'en-GB',
  };
}

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

export function generateFAQSchema(faqs: FAQItem[], options?: { id?: string; inLanguage?: string }) {
  return {
    '@type': 'FAQPage',
    ...(options?.id ? { '@id': options.id } : {}),
    ...(options?.inLanguage ? { inLanguage: options.inLanguage } : {}),
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function generateServiceSchema(name: string, description: string, url: string, additionalType?: string, options?: Record<string, unknown>) {
  const schema: Record<string, unknown> = {
    '@type': additionalType || 'Service',
    '@id': `${url}/#service`,
    name,
    description,
    url,
    provider: { '@id': `${BASE_URL}/#organization` },
    areaServed: { '@type': 'Country', name: 'United Kingdom' },
  };
  if (options) Object.assign(schema, options);
  return schema;
}

export function generateWebPageSchema(title: string, description: string, url: string) {
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

export function generateBlogSchema(url: string) {
  return {
    '@type': 'Blog',
    '@id': `${url}/#blog`,
    url,
    name: 'ScopeSite Blog',
    description: 'AI visibility insights, web design tips, and practical advice for UK businesses.',
    publisher: { '@id': `${BASE_URL}/#organization` },
    inLanguage: 'en-GB',
  };
}

export function generateCollectionPageSchema(url: string, name: string) {
  return {
    '@type': 'CollectionPage',
    '@id': `${url}/#webpage`,
    url,
    name,
    isPartOf: { '@id': `${BASE_URL}/#website` },
  };
}

export function generateItemListSchema(id: string, name: string, items: Array<{ '@id'?: string; '@type'?: string | string[]; [key: string]: unknown }>) {
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

export function generateSpeakableSchema(cssSelectors: string[]) {
  return { '@type': 'SpeakableSpecification', cssSelector: cssSelectors };
}

export function generateLocalBusinessSchema(areaName: string, areaServed: Array<{ type: string; name: string }>, pageUrl: string) {
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
      addressLocality: 'Frome',
      addressRegion: 'Somerset',
      addressCountry: 'GB',
    },
    areaServed: areaServed.map((area) => ({ '@type': area.type, name: area.name })),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
  };
}

export function wrapInGraph(schemas: Record<string, unknown>[]) {
  return { '@context': 'https://schema.org', '@graph': schemas };
}
