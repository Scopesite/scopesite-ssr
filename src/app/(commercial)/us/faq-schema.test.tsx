/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { ReactNode } from 'react';
import USPage from './page';
import USLayout from './layout';
import USServicesLayout from './services/layout';
import { faqItems } from './faqs';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

afterEach(cleanup);

function faqNodes(container: ParentNode) {
  return [...container.querySelectorAll('script[type="application/ld+json"]')]
    .flatMap(script => {
      const data = JSON.parse(script.textContent || '{}');
      return data['@graph'] || [data];
    })
    .filter(node => [node['@type']].flat().includes('FAQPage'));
}

describe('US homepage FAQ evidence', () => {
  it('includes exactly one complete FAQPage in the initial HTML', () => {
    const html = renderToStaticMarkup(<USLayout><USPage /></USLayout>);
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const nodes = faqNodes(doc);
    expect(nodes).toHaveLength(1);
    expect(nodes[0]['@id']).toBe('https://scopesite.co.uk/us/#webpage');
    expect(nodes[0].mainEntity.map((item: { name: string; acceptedAnswer: { text: string } }) => ({
      question: item.name, answer: item.acceptedAnswer.text,
    }))).toEqual(faqItems);
    expect(faqItems).toHaveLength(4);
  });

  it('opens each visible answer with exactly the same wording as its schema', () => {
    const { container } = render(<USPage />);
    const entities = faqNodes(container)[0].mainEntity;
    for (const entity of entities) {
      const button = screen.getByRole('button', { name: entity.name });
      expect(button.getAttribute('aria-expanded')).toBe('false');
      fireEvent.click(button);
      expect(button.getAttribute('aria-expanded')).toBe('true');
      expect(screen.getByText(entity.acceptedAnswer.text)).toBeTruthy();
    }
  });

  it('does not leak homepage questions into nested US service pages', () => {
    const html = renderToStaticMarkup(<USLayout><USServicesLayout><p>Service page</p></USServicesLayout></USLayout>);
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const nodes = faqNodes(doc);
    expect(nodes).toHaveLength(1);
    expect(nodes[0]['@id']).toBe('https://scopesite.co.uk/us/services/#webpage');
    for (const faq of faqItems) expect(html).not.toContain(faq.question);
  });
});
