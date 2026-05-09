/**
 * Territory Command - Schema.org JSON-LD graph.
 *
 * Mirrors docs/territory_command/01_MASTER_BUILD_DOCUMENT.md section 5.
 * Injected via <JsonLd> on /territory.
 *
 * NO Wikidata references in sameAs arrays (entity Q138866631 was deleted
 * on 6 April 2026, tracked in a separate Cursor task).
 */

import { FAQ } from './copy';

const BASE_URL = 'https://scopesite.co.uk';
const TERRITORY_URL = `${BASE_URL}/territory`;

const territoryOfferSeller = { '@id': `${BASE_URL}/#organization` };

/** Standard (green) and Premium (purple) tiers — published prices match pricing engine v2.1. */
function territoryTierOffers(): Record<string, unknown>[] {
  return [
    {
      '@type': 'Offer',
      '@id': `${TERRITORY_URL}/#offer-standard-setup`,
      name: 'Territory Command Standard (setup)',
      description: 'One-time setup for standard territories. Includes Ultra Fast build, AI SEO, postcode exclusivity.',
      price: '750',
      priceCurrency: 'GBP',
      availability: 'https://schema.org/LimitedAvailability',
      eligibleRegion: { '@type': 'Country', name: 'United Kingdom' },
      eligibleCustomerType: 'https://schema.org/Business',
      seller: territoryOfferSeller,
    },
    {
      '@type': 'Offer',
      '@id': `${TERRITORY_URL}/#offer-standard-monthly`,
      name: 'Territory Command Standard (monthly)',
      description: 'Monthly representation for standard territories.',
      price: '500',
      priceCurrency: 'GBP',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '500',
        priceCurrency: 'GBP',
        billingDuration: 'P1M',
        unitCode: 'MON',
      },
      availability: 'https://schema.org/LimitedAvailability',
      eligibleRegion: { '@type': 'Country', name: 'United Kingdom' },
      eligibleCustomerType: 'https://schema.org/Business',
      seller: territoryOfferSeller,
    },
    {
      '@type': 'Offer',
      '@id': `${TERRITORY_URL}/#offer-premium-setup`,
      name: 'Territory Command Premium (setup)',
      description: 'One-time setup for premium high-competition territories. Includes Ultra Fast build, AI SEO, postcode exclusivity.',
      price: '1250',
      priceCurrency: 'GBP',
      availability: 'https://schema.org/LimitedAvailability',
      eligibleRegion: { '@type': 'Country', name: 'United Kingdom' },
      eligibleCustomerType: 'https://schema.org/Business',
      seller: territoryOfferSeller,
    },
    {
      '@type': 'Offer',
      '@id': `${TERRITORY_URL}/#offer-premium-monthly`,
      name: 'Territory Command Premium (monthly)',
      description: 'Monthly representation for premium territories.',
      price: '750',
      priceCurrency: 'GBP',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '750',
        priceCurrency: 'GBP',
        billingDuration: 'P1M',
        unitCode: 'MON',
      },
      availability: 'https://schema.org/LimitedAvailability',
      eligibleRegion: { '@type': 'Country', name: 'United Kingdom' },
      eligibleCustomerType: 'https://schema.org/Business',
      seller: territoryOfferSeller,
    },
  ];
}

export function generateTerritoryJsonLd(): Record<string, unknown>[] {
  return [
    {
      '@type': 'WebPage',
      '@id': `${TERRITORY_URL}/#webpage`,
      url: TERRITORY_URL,
      name: 'Territory Command - Exclusive AI Visibility Representation by Postcode',
      description:
        'One firm per postcode per sector. Exclusive AI visibility engineering with an outcome guarantee. Check whether your territory is available.',
      inLanguage: 'en-GB',
      isPartOf: { '@id': `${BASE_URL}/#website` },
      about: { '@id': `${TERRITORY_URL}/#service` },
      breadcrumb: { '@id': `${TERRITORY_URL}/#breadcrumb` },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/images/territory/territory-command-og.png`,
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${TERRITORY_URL}/#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${BASE_URL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Territory Command',
          item: TERRITORY_URL,
        },
      ],
    },
    {
      '@type': 'Service',
      '@id': `${TERRITORY_URL}/#service`,
      name: 'Territory Command',
      alternateName: 'Exclusive AI Visibility Representation',
      serviceType: 'AI Visibility Engineering',
      provider: { '@id': `${BASE_URL}/#organization` },
      description:
        'Exclusive AI visibility engineering by postcode and sector. One firm holds each territory for 24 months. Includes unlimited PRO AI visibility scans, monthly Sit-Rep, continuous visibility engineering, and an outcome guarantee of AI visibility score above 80 per 100 or the next month is free.',
      areaServed: { '@type': 'Country', name: 'United Kingdom' },
      audience: {
        '@type': 'BusinessAudience',
        audienceType: 'Professional Services Firms',
      },
      offers: territoryTierOffers(),
      termsOfService: `${BASE_URL}/terms-and-conditions`,
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Territory Command Inclusions',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Exclusive Territorial Claim',
              description: 'One firm per postcode per sector for 24 months',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Unlimited PRO AI Visibility Scans',
              description:
                'Full scanner access on the client domain throughout the engagement',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Monthly Sit-Rep',
              description:
                'Situation report on AI visibility delivered every calendar month',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Outcome Guarantee',
              description:
                'AI visibility score above 80 per 100 monthly, or next month free plus engineering to target',
            },
          },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${TERRITORY_URL}/#faq`,
      mainEntity: FAQ.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    },
  ];
}
