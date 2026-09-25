/**
 * @vitest-environment jsdom
 */
import type { ReactNode } from 'react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Navigation } from './Navigation';
import { RWD_DESTINATIONS } from '@/lib/rwd-outbound';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

afterEach(() => {
  cleanup();
});

describe('Services dropdown keyboard access', () => {
  it('opens from the button, exposes the recruitment link, and closes on Escape', () => {
    render(<Navigation variant="header" />);
    const button = screen.getByRole('button', { name: 'Services' });
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('aria-controls')).toBe('header-services-menu');

    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');

    const recruitment = screen.getByRole('link', { name: 'Recruitment websites for UK agencies' });
    expect(recruitment.getAttribute('href')).toBe(RWD_DESTINATIONS.home);
    expect(screen.getByRole('link', { name: 'Web Design' }).getAttribute('href')).toBe('/web-design');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button);
  });

  it('keeps the mobile services routes behind the same toggle', () => {
    render(<Navigation variant="mobile" />);
    const button = screen.getByRole('button', { name: 'Services' });
    expect(screen.queryByRole('link', { name: 'Custom Web Apps' })).toBeNull();
    fireEvent.click(button);
    expect(screen.getByRole('link', { name: 'Custom Web Apps' }).getAttribute('href')).toBe('/web-apps');
    expect(screen.getByRole('link', { name: 'Recruitment websites for UK agencies' }).getAttribute('href')).toBe(
      RWD_DESTINATIONS.home
    );
    fireEvent.keyDown(button, { key: 'Escape' });
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });
});
