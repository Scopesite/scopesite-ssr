/**
 * @vitest-environment jsdom
 */
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import MobileMenu from './MobileMenu';

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

vi.mock('next/image', () => ({
  default: (props: { alt: string }) => <img alt={props.alt} />,
}));

afterEach(() => {
  cleanup();
  document.getElementById('mobile-sheet-overflow')?.remove();
});

describe('Mobile menu sheet scroll', () => {
  it('scrolls this sheet and keeps the close control sticky', () => {
    const style = document.createElement('style');
    style.id = 'mobile-sheet-overflow';
    style.textContent = '.overflow-y-auto { overflow-y: auto; } .sticky { position: sticky; }';
    document.head.appendChild(style);

    render(<MobileMenu open onOpenChange={() => undefined} />);

    const dialog = screen.getByRole('dialog', { name: 'Navigation Menu' });
    expect(dialog.classList.contains('overflow-y-auto')).toBe(true);
    expect(dialog.classList.contains('max-h-dvh')).toBe(true);
    expect(getComputedStyle(dialog).overflowY).toBe('auto');

    const quote = screen.getByRole('link', { name: 'Get Instant Quote' });
    expect(dialog.contains(quote)).toBe(true);

    const close = screen.getByRole('button', { name: 'Close' });
    expect(dialog.contains(close)).toBe(true);
    expect(close.classList.contains('sticky')).toBe(true);
    expect(close.classList.contains('absolute')).toBe(false);
    expect(getComputedStyle(close).position).toBe('sticky');
  });
});
