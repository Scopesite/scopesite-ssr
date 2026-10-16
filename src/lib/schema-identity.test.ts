import { describe, expect, it } from 'vitest';
import {
  generateFounderPersonSchema,
  generateLeanOrganizationSchema,
  generateOrganizationSchema,
} from './schema';

describe('ScopeSite company and founder identity boundaries', () => {
  it.each([
    ['commercial', generateOrganizationSchema],
    ['content', generateLeanOrganizationSchema],
  ] as const)('uses company references for the %s agency identity', (_name, generate) => {
    const agency = generate();
    expect(agency['@id']).toBe('https://scopesite.co.uk/#organization');
    expect(agency.sameAs).toContain('https://www.linkedin.com/company/106028304');
    expect(agency.sameAs).toContain('https://find-and-update.company-information.service.gov.uk/company/16130355');
    expect(agency.sameAs.filter(reference => {
      const url = new URL(reference);
      return url.hostname.replace(/^www\./, '') === 'linkedin.com' && url.pathname.startsWith('/in/');
    })).toEqual([]);
  });

  it('retains the separate founder profile and employment relationship', () => {
    const founder = generateFounderPersonSchema();
    expect(founder['@type']).toBe('Person');
    expect(founder['@id']).toBe('https://scopesite.co.uk/#dan-cartwright');
    expect(founder.sameAs).toEqual(['https://www.linkedin.com/in/dan-cartwright-scopesite']);
    expect(founder.worksFor).toEqual({ '@id': 'https://scopesite.co.uk/#organization' });
    expect(generateOrganizationSchema().founder).toEqual(founder);
  });
});
