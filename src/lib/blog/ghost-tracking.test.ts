import { describe, expect, it } from 'vitest';
import { stripGhostTrackingParams } from '@/lib/ghost';

describe('Ghost link tracking cleanup', () => {
  it('preserves question marks, ampersands and attribute text outside anchor hrefs', () => {
    const html = '<p>Can they find you? Does the answer help? Research & development.</p><img alt="Which one?" src="/image?ref=keep"/><a title="Why?" href="/guide?ref=scopesite-digital-studios.ghost.io">What next?</a>';
    expect(stripGhostTrackingParams(html)).toBe('<p>Can they find you? Does the answer help? Research & development.</p><img alt="Which one?" src="/image?ref=keep"/><a title="Why?" href="/guide">What next?</a>');
  });
  it.each([
    ['https://example.com/guide?ref=scopesite-digital-studios.ghost.io&campaign=employers#fees', 'https://example.com/guide?campaign=employers#fees'],
    ['/guide?campaign=employers&amp;ref=scopesite-digital-studios.ghost.io&amp;q=pay%26conditions#details', '/guide?campaign=employers&amp;q=pay%26conditions#details'],
    ['../guide?ref=scopesite-digital-studios.ghost.io#next', '../guide#next'],
    ['/guide?q=what%3F&REF=scopesite-digital-studios.ghost.io', '/guide?q=what%3F'],
    ['/guide?q=one&q=two&ref=scopesite-digital-studios.ghost.io', '/guide?q=one&q=two'],
    ['/guide?ref=partner%2Fsummer&ref=scopesite-digital-studios.ghost.io#next', '/guide?ref=partner%2Fsummer#next'],
    ['/guide?ref=scopesite-digital-studios%2Eghost%2Eio&code=ABC%2B123', '/guide?code=ABC%2B123'],
  ])('retains other parameters and fragments: %s', (before, after) => {
    expect(stripGhostTrackingParams(`<a href='${before}'>Read</a>`)).toBe(`<a href='${after}'>Read</a>`);
  });
  it.each(['https://[broken?ref=scopesite-digital-studios.ghost.io', '/bad%ZZ?ref=scopesite-digital-studios.ghost.io', 'mailto:hello@example.com?ref=keep', '/guide?q=help?#ref=keep', '#section?ref=keep'])('leaves malformed, non-web or untracked URLs intact: %s', (href) => {
    const html = `<a href="${href}">Read?</a>`;
    expect(stripGhostTrackingParams(html)).toBe(html);
  });
  it('preserves legitimate referral links and literal URL examples', () => {
    const html = '<p>Example: /guide?ref=scopesite-digital-studios.ghost.io. What happens?</p><a href="/guide?ref=partner%2Fsummer&next=%2Fapply#fees">Read?</a>';
    expect(stripGhostTrackingParams(html)).toBe(html);
  });
  it('preserves data-href and quoted href-looking text in other anchor attributes', () => {
    const html = '<a data-href="/guide?ref=scopesite-digital-studios.ghost.io" title="Use href=\'/example?ref=scopesite-digital-studios.ghost.io\'" href="/real?ref=scopesite-digital-studios.ghost.io#next">Read?</a>';
    expect(stripGhostTrackingParams(html)).toBe('<a data-href="/guide?ref=scopesite-digital-studios.ghost.io" title="Use href=\'/example?ref=scopesite-digital-studios.ghost.io\'" href="/real#next">Read?</a>');
  });
  it('does not repair raw whitespace in a malformed URL', () => {
    const html = '<a href="/a broken path?ref=scopesite-digital-studios.ghost.io">Read?</a>';
    expect(stripGhostTrackingParams(html)).toBe(html);
  });
});
