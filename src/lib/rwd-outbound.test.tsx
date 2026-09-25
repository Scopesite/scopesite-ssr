/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { RwdOutboundLink } from '@/components/rwd/RwdOutboundLink';
import {
  RWD_DESTINATIONS,
  RWD_OUTBOUND_EVENT,
  sanitizeRwdOutboundEvent,
  trackRwdOutbound,
} from '@/lib/rwd-outbound';

function setDoNotTrack(value: string | null) {
  Object.defineProperty(navigator, 'doNotTrack', {
    configurable: true,
    get: () => value,
  });
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  window.gtag = (() => undefined) as Window['gtag'];
  (window as Window & { va?: Window['va'] }).va = undefined;
  setDoNotTrack(null);
  window.localStorage.removeItem('va-disable');
});

describe('sanitizeRwdOutboundEvent', () => {
  it('keeps allowlisted page, placement, and destination category', () => {
    expect(
      sanitizeRwdOutboundEvent({
        page: 'home',
        placement: 'card',
        destination: 'demos',
        href: 'https://recruitmentwebdesign.com/demos?utm=1',
        email: 'owner@agency.co.uk',
      })
    ).toEqual({
      page: 'home',
      placement: 'card',
      destination: 'demos',
    });
  });

  it('drops free text, unknown categories, and query-like values', () => {
    expect(
      sanitizeRwdOutboundEvent({
        page: 'home?ref=secret',
        placement: 'card',
        destination: 'demos',
      })
    ).toBeNull();
    expect(
      sanitizeRwdOutboundEvent({
        page: 'home',
        placement: 'the big pink button',
        destination: 'https://recruitmentwebdesign.com/demos?q=1',
      })
    ).toBeNull();
    expect(sanitizeRwdOutboundEvent(null)).toBeNull();
  });
});

describe('trackRwdOutbound', () => {
  it('does not call analytics when Do Not Track is set', () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    setDoNotTrack('1');
    trackRwdOutbound({ page: 'nav', placement: 'nav', destination: 'home' });
    expect(gtag).not.toHaveBeenCalled();
  });

  it('sends only the three categories when analytics is already loaded', () => {
    const gtag = vi.fn();
    const va = vi.fn();
    window.gtag = gtag;
    window.va = va;
    setDoNotTrack('0');
    trackRwdOutbound({ page: 'footer', placement: 'footer', destination: 'ats' });
    expect(gtag).toHaveBeenCalledWith('event', RWD_OUTBOUND_EVENT, {
      page: 'footer',
      placement: 'footer',
      destination: 'ats',
    });
    expect(va).toHaveBeenCalledWith('event', {
      name: RWD_OUTBOUND_EVENT,
      data: { page: 'footer', placement: 'footer', destination: 'ats' },
    });
    const payload = JSON.stringify(gtag.mock.calls[0]);
    expect(payload).not.toContain('http');
    expect(payload).not.toContain('?');
  });
});

describe('RwdOutboundLink', () => {
  it('keeps a crawlable href and does not wait on tracking', () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    setDoNotTrack('0');
    render(
      <RwdOutboundLink page="recruitment_intro" placement="demo" destination="demos">
        See current recruitment demos
      </RwdOutboundLink>
    );
    const link = screen.getByRole('link', { name: 'See current recruitment demos' });
    expect(link.getAttribute('href')).toBe(RWD_DESTINATIONS.demos);
    expect(link.getAttribute('href')).not.toContain('?');
    expect(link.getAttribute('target')).toBeNull();
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(gtag).toHaveBeenCalledOnce();
  });

  it('still exposes the href when analytics is opted out', () => {
    setDoNotTrack('1');
    render(
      <RwdOutboundLink page="home" placement="hero" destination="home">
        Recruitment websites for UK agencies
      </RwdOutboundLink>
    );
    const link = screen.getByRole('link', { name: 'Recruitment websites for UK agencies' });
    fireEvent.click(link);
    expect(link.getAttribute('href')).toBe(RWD_DESTINATIONS.home);
  });
});
