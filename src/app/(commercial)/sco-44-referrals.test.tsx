/**
 * @vitest-environment jsdom
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Header } from '@/components/layout/Header';
import MobileMenu from '@/components/layout/MobileMenu';
import { NAV_LINKS, SERVICES_LINKS } from '@/components/layout/Navigation';
import { RwdOutboundLink } from '@/components/rwd/RwdOutboundLink';
import { RWD_DESTINATIONS, sanitizeRwdOutboundEvent } from '@/lib/rwd-outbound';
import { RWD_DESTINATION, scopeSiteFilter } from '@/lib/ghost';
import RecruitmentWebsiteDesignPage from './recruitment-website-design/page';
import Home from './page';

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

vi.mock('./HomeBelowFoldWrapper', () => ({
  HomeBelowFoldWrapper: () => null,
}));

afterEach(() => {
  cleanup();
  document.getElementById('mobile-sheet-overflow')?.remove();
});

function expectSameTabSpecialistLink(link: HTMLElement, href: string) {
  expect(link.getAttribute('href')).toBe(href);
  expect(link.getAttribute('href')).not.toContain('?');
  expect(link.getAttribute('target')).toBeNull();
  expect(link.getAttribute('rel')).toBeNull();
}

describe('SCO-44 protected header and hero CTAs', () => {
  it('keeps the desktop pink recruitment button on the specialist homepage', () => {
    render(<Header />);
    const recruitment = screen.getByRole('link', { name: 'Work In Recruitment?' });
    expectSameTabSpecialistLink(recruitment, RWD_DESTINATIONS.home);
    expect(recruitment.className).toContain('bg-[#f71663]');
    expect(screen.queryByRole('link', { name: 'Live Quote Builder' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Free AI Visibility Scan' })).toBeNull();
  });

  it('keeps the mobile pink recruitment button on the specialist homepage', () => {
    render(<MobileMenu open onOpenChange={() => undefined} />);
    const recruitment = screen.getByRole('link', { name: 'Work In Recruitment?' });
    expectSameTabSpecialistLink(recruitment, RWD_DESTINATIONS.home);
    expect(recruitment.className).toContain('bg-[#f71663]');
  });

  it('keeps the homepage hero on Live Quote Builder and the free scan', () => {
    render(<Home />);
    const quote = screen.getByRole('link', { name: 'Live Quote Builder' });
    expect(quote.getAttribute('href')).toBe('/pricing');
    expect(quote.getAttribute('target')).toBeNull();

    const scan = screen.getByRole('link', { name: 'Free AI Visibility Scan' });
    expect(scan.getAttribute('href')).toBe('https://canaifindme.online');
    expect(scan.getAttribute('target')).toBe('_blank');
    expect(scan.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('does not promote explainers in the primary menu', () => {
    const labels = [...NAV_LINKS, ...SERVICES_LINKS].map((link) => link.label);
    expect(labels).not.toContain('Work In Recruitment?');
    expect(labels.some((label) => /explainer/i.test(label))).toBe(false);
    expect(SERVICES_LINKS.some((link) => link.href.includes('/explainers'))).toBe(false);
  });
});

describe('SCO-44 discreet RWD explainer referrals', () => {
  it('allowlists the live AI discovery explainer', () => {
    expect(RWD_DESTINATIONS.ai_discovery).toBe('https://recruitmentwebdesign.com/explainers/ai-discovery');
    expect(
      sanitizeRwdOutboundEvent({
        page: 'recruitment_intro',
        placement: 'body',
        destination: 'ai_discovery',
      })
    ).toEqual({
      page: 'recruitment_intro',
      placement: 'body',
      destination: 'ai_discovery',
    });
  });

  it('keeps first-party explainer links crawlable and same-tab', () => {
    render(
      <RwdOutboundLink page="ai_visibility" placement="body" destination="ai_discovery">
        how to improve a recruitment website&apos;s chances of appearing in AI answers
      </RwdOutboundLink>
    );
    const link = screen.getByRole('link', {
      name: "how to improve a recruitment website's chances of appearing in AI answers",
    });
    expectSameTabSpecialistLink(link, RWD_DESTINATIONS.ai_discovery);
  });

  it('adds two contextual body links on the recruitment service page', () => {
    render(<RecruitmentWebsiteDesignPage />);

    const specialist = screen.getByRole('link', { name: 'Recruitment Web Design' });
    expectSameTabSpecialistLink(specialist, RWD_DESTINATIONS.home);
    expect(specialist.closest('#relationship-heading') || specialist.closest('section')).toBeTruthy();

    const explainer = screen.getByRole('link', {
      name: "how to improve a recruitment website's chances of appearing in AI answers",
    });
    expectSameTabSpecialistLink(explainer, RWD_DESTINATIONS.ai_discovery);

    expect(screen.getByRole('link', { name: 'See current recruitment demos' })).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'Work In Recruitment?' })).toBeNull();
  });

  it('adds one contextual explainer link on the AI visibility page', () => {
    const source = readFileSync(path.join(__dirname, 'ai-visibility/page.tsx'), 'utf8');
    expect(source).toContain('destination="ai_visibility"');
    expect(source).toContain('destination="ai_discovery"');
    expect(source).toContain("how to improve a recruitment website&apos;s chances of appearing in AI answers");
    expect((source.match(/destination="ai_discovery"/g) ?? []).length).toBe(1);
  });

  it('adds no more than three new contextual body referrals', () => {
    const recruitment = readFileSync(path.join(__dirname, 'recruitment-website-design/page.tsx'), 'utf8');
    const aiVisibility = readFileSync(path.join(__dirname, 'ai-visibility/page.tsx'), 'utf8');
    const homeBody = (recruitment.match(/destination="home"/g) ?? []).length;
    const discoveryBody =
      (recruitment.match(/destination="ai_discovery"/g) ?? []).length +
      (aiVisibility.match(/destination="ai_discovery"/g) ?? []).length;
    expect(homeBody).toBe(1);
    expect(discoveryBody).toBe(2);
    expect(homeBody + discoveryBody).toBe(3);
  });
});

describe('SCO-44 Ghost inverse destination filter', () => {
  it('retains the parent exclusion of hash-site-recruitmentwebdesign', () => {
    expect(RWD_DESTINATION).toBe('hash-site-recruitmentwebdesign');
    expect(scopeSiteFilter()).toBe(`tag:-${RWD_DESTINATION}+visibility:public`);
    expect(scopeSiteFilter('tag:ai')).toBe(
      `tag:-${RWD_DESTINATION}+visibility:public+(tag:ai)`
    );
  });
});
