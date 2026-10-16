import { describe, expect, it } from 'vitest';
import {
  generateLandingPageSchema,
  generateVOICESoftwareApplicationSchema,
  generateWebPageFAQPageSchema,
  generateWebsiteSchema,
} from './schema';

const url = 'https://scopesite.co.uk/example';
const faqs = [{ question: 'Where do you work?', answer: 'We serve Bristol from our Frome base.' }];

describe('landing-page structured data', () => {
  it('keeps the page identity and includes its supplied questions and answers', () => {
    const page = generateWebPageFAQPageSchema(url, 'Example', 'Description', faqs);
    expect(page['@id']).toBe(`${url}/#webpage`);
    expect(page['@type']).toEqual(['WebPage', 'FAQPage']);
    expect(page.mainEntity).toEqual([{
      '@type': 'Question',
      name: faqs[0].question,
      acceptedAnswer: { '@type': 'Answer', text: faqs[0].answer },
    }]);
  });

  it('does not claim FAQ content when no questions are supplied', () => {
    const page = generateWebPageFAQPageSchema(url, 'Example', 'Description', []);
    expect(page['@type']).toBe('WebPage');
    expect(page).not.toHaveProperty('mainEntity');
  });

  it('emits only one FAQ page in the full landing-page graph', () => {
    const graph = generateLandingPageSchema(url, 'Example', 'Example', 'Description', faqs, {
      name: 'Web design', description: 'Website design services.',
    });
    const pages = graph['@graph'].filter((node) =>
      [node['@type']].flat().includes('FAQPage')
    );
    expect(pages).toHaveLength(1);
    expect(pages[0]['@id']).toBe(`${url}/#webpage`);
  });

  it('does not attach additionalProperty outside its supported types to a WebSite', () => {
    expect(generateWebsiteSchema()).not.toHaveProperty('additionalProperty');
  });

  it('uses the live application identity without importing agency offers', () => {
    const product = generateVOICESoftwareApplicationSchema();
    expect(product['@id']).toBe('https://canaifindme.online/#application');
    expect(product.name).toBe('CAFMO (Can AI Find Me Online)');
    expect(product.url).toBe('https://canaifindme.online');
    expect(product.description).toContain('live application');
    expect(product).not.toHaveProperty('offers');
    expect(product).not.toHaveProperty('potentialAction');
  });
});
