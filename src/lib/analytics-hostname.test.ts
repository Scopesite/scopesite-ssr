import { describe, expect, it } from 'vitest';
import { isProductionAnalyticsHostname } from './analytics-hostname';

describe('GA production hostname boundary', () => {
  it.each(['scopesite.co.uk', 'www.scopesite.co.uk', 'SCOPESITE.CO.UK'])('accepts %s', (hostname) => {
    expect(isProductionAnalyticsHostname(hostname)).toBe(true);
  });

  it.each([
    'localhost',
    '127.0.0.1',
    'scopesite-ssr.vercel.app',
    'scopesite-ssr-preview-scopesite.vercel.app',
    'preview.scopesite.co.uk',
    'scopesite.co.uk.example.com',
    'recruitmentwebdesign.com',
    '',
  ])('rejects %s', (hostname) => {
    expect(isProductionAnalyticsHostname(hostname)).toBe(false);
  });
});
