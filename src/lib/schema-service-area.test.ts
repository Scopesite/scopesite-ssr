import { describe, expect, it } from 'vitest';
import {
  generateLeanOrganizationSchema,
  generateLocalServiceSchema,
  generateOrganizationSchema,
} from './schema';

function assertNoStreetOrCoordinates(value: unknown) {
  const blob = JSON.stringify(value);
  expect(blob).not.toMatch(/streetAddress/);
  expect(blob).not.toMatch(/"@type":"GeoCoordinates"/);
  expect(blob).not.toMatch(/"@type":"GeoCircle"/);
  expect(blob).not.toMatch(/geoMidpoint/);
  expect(blob).not.toMatch(/Horse Close/);
  expect(blob).not.toMatch(/51\.2308/);
  expect(blob).not.toMatch(/-2\.3201/);
  expect(blob).not.toMatch(/51\.2672/);
  expect(blob).not.toMatch(/google\.com\/maps\/place/);
}

describe('ScopeSite service-area schema', () => {
  it.each([
    ['commercial', generateOrganizationSchema],
    ['content', generateLeanOrganizationSchema],
  ] as const)('keeps %s identity references free of private coordinates and software repositories', (_name, generate) => {
    const organization = generate();
    assertNoStreetOrCoordinates(organization);
    expect(organization['@id']).toBe('https://scopesite.co.uk/#organization');
    expect(organization.brand).toContainEqual({
      '@type': 'Brand',
      '@id': 'https://recruitmentwebdesign.com/#brand',
      name: 'Recruitment Web Design',
      url: 'https://recruitmentwebdesign.com',
    });
    expect(organization.sameAs.some((url) => url.includes('recruitmentwebdesign.com'))).toBe(false);
    for (const reference of organization.sameAs) {
      const url = new URL(reference);
      if (url.hostname === 'github.com') {
        // A repository identifies a software project, not its operating business.
        expect(url.pathname.split('/').filter(Boolean).length).toBeLessThanOrEqual(1);
      }
    }
  });

  it('emits Organization identity without a street or coordinates', () => {
    const organization = generateOrganizationSchema();
    assertNoStreetOrCoordinates(organization);
    expect(organization['@id']).toBe('https://scopesite.co.uk/#organization');
    expect(organization.legalName).toBe('SCOPESITE LTD');
    expect(organization.telephone).toBe('+441373311339');
    expect(organization.email).toBe('support@scopesite.co.uk');
    expect(organization.address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'Frome',
      addressRegion: 'Somerset',
      addressCountry: 'GB',
    });
    expect(organization.areaServed).toEqual([
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'United States' },
    ]);
  });

  it('describes regional work as a service of the existing operator, not a branch', () => {
    const local = generateLocalServiceSchema(
      'Web Design Bristol',
      [],
      'Web design services available to Bristol businesses.',
      'https://scopesite.co.uk/web-design-bristol',
      [{ type: 'City', name: 'Bristol' }],
    );
    assertNoStreetOrCoordinates(local);
    expect(local['@type']).toBe('Service');
    expect(local['@id']).toBe('https://scopesite.co.uk/web-design-bristol/#service');
    expect(local.provider).toEqual({ '@id': 'https://scopesite.co.uk/#organization' });
    expect(local.areaServed).toEqual([{ '@type': 'City', name: 'Bristol' }]);
    expect(local).not.toHaveProperty('address');
    expect(local).not.toHaveProperty('parentOrganization');
  });
});
