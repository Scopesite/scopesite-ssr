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
        'Exclusive AI visibility engineering by postcode and sector. One firm holds each territory for 24 months. Includes unlimited PRO V.O.I.C.E. scans, monthly Sit-Rep, continuous visibility engineering, and an outcome guarantee of V.O.I.C.E. score above 80 per 100 or the next month is free.',
      areaServed: { '@type': 'Country', name: 'United Kingdom' },
      audience: {
        '@type': 'BusinessAudience',
        audienceType: 'Professional Services Firms',
      },
      offers: { '@id': `${TERRITORY_URL}/#offer` },
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
              name: 'Unlimited PRO V.O.I.C.E. Scans',
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
                'V.O.I.C.E. score above 80 per 100 monthly, or next month free plus engineering to target',
            },
          },
        ],
      },
    },
    {
      '@type': 'Offer',
      '@id': `${TERRITORY_URL}/#offer`,
      name: 'Territory Command Monthly Representation',
      price: '500',
      priceCurrency: 'GBP',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '500',
        priceCurrency: 'GBP',
        referenceQuantity: {
          '@type': 'QuantitativeValue',
          value: '1',
          unitCode: 'MON',
        },
        priceType: 'MinimumPrice',
      },
      availability: 'https://schema.org/LimitedAvailability',
      eligibleRegion: { '@type': 'Country', name: 'United Kingdom' },
      eligibleCustomerType: 'https://schema.org/Business',
      seller: { '@id': `${BASE_URL}/#organization` },
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
