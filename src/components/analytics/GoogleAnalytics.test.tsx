/** @vitest-environment jsdom */
import { cleanup, render, waitFor } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const host = vi.hoisted(() => ({ production: false }));

vi.mock('@/lib/analytics-hostname', () => ({
  isProductionAnalyticsHostname: () => host.production,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/recruitment-website-design',
  useSearchParams: () => new URLSearchParams('source=test'),
}));

vi.mock('next/script', () => ({
  default: ({ children, strategy, ...props }: { children?: ReactNode; strategy?: string; src?: string; id?: string }) => (
    <script data-strategy={strategy} {...props}>{children}</script>
  ),
}));

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST');
  host.production = false;
  window.gtag = vi.fn();
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe('GA production host boundary', () => {
  it('does not load scripts or send a route event on other hosts', async () => {
    const { default: GoogleAnalytics } = await import('./GoogleAnalytics');
    const { container } = render(<GoogleAnalytics />);
    expect(container.querySelectorAll('script')).toHaveLength(0);
    expect(window.gtag).not.toHaveBeenCalled();
  });

  it('retains the production script configuration and route tracking', async () => {
    host.production = true;
    const { default: GoogleAnalytics } = await import('./GoogleAnalytics');
    const { container } = render(<GoogleAnalytics />);
    expect(container.querySelector('script[src]')?.getAttribute('src')).toBe('https://www.googletagmanager.com/gtag/js?id=G-TEST');
    expect(container.querySelector('#ga4-init')?.textContent).toContain('anonymize_ip: true');
    expect(container.querySelector('script[src]')?.getAttribute('data-strategy')).toBe('lazyOnload');
    await waitFor(() => expect(window.gtag).toHaveBeenCalledWith('config', 'G-TEST', {
      page_path: '/recruitment-website-design?source=test',
    }));
  });

  it('waits for the browser hostname before emitting tracker markup', async () => {
    host.production = true;
    const { default: GoogleAnalytics } = await import('./GoogleAnalytics');
    expect(renderToStaticMarkup(<GoogleAnalytics />)).toBe('');
    expect(window.gtag).not.toHaveBeenCalled();
  });

  it('retains disabled tracking when no measurement ID is configured', async () => {
    host.production = true;
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', '');
    const { default: GoogleAnalytics } = await import('./GoogleAnalytics');
    const { container } = render(<GoogleAnalytics />);
    expect(container.querySelectorAll('script')).toHaveLength(0);
    expect(window.gtag).not.toHaveBeenCalled();
  });
});
