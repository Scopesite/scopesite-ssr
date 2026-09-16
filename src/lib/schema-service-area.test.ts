import { describe, expect, it } from 'vitest';
import { generateLocalBusinessSchema, generateOrganizationSchema } from './schema';

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

  it('emits LocalBusiness variants without a street or coordinates', () => {
    const local = generateLocalBusinessSchema(
      'Bristol',
      [{ type: 'City', name: 'Bristol' }],
      'https://scopesite.co.uk/web-design-bristol'
    );
    assertNoStreetOrCoordinates(local);
    expect(local.parentOrganization).toEqual({ '@id': 'https://scopesite.co.uk/#organization' });
    expect(local.address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'Frome',
      addressRegion: 'Somerset',
      addressCountry: 'GB',
    });
  });
});
