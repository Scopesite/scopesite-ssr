'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RwdOutboundLink } from '@/components/rwd/RwdOutboundLink';
import { RWD_DESTINATIONS, type RwdDestinationCategory, type RwdPageCategory, type RwdPlacementCategory } from '@/lib/rwd-outbound';

export interface NavLink {
  label: string;
  href: string;
  /** Distinct styling for the Services hub row (e.g. All Services →) */
  variant?: 'hub';
  outbound?: {
    page: RwdPageCategory;
    placement: RwdPlacementCategory;
    destination: RwdDestinationCategory;
  };
}

export const SERVICES_LINKS: NavLink[] = [
  {
    label: 'Recruitment websites for UK agencies',
    href: RWD_DESTINATIONS.home,
    outbound: { page: 'nav', placement: 'nav', destination: 'home' },
  },
  { label: 'Web Design', href: '/web-design' },
  { label: 'AI Website Design', href: '/ai-website-design' },
  { label: 'Custom Web Apps', href: '/web-apps' },
  { label: 'LLM Brain', href: '/llm-brain' },
  { label: 'Schema Markup', href: '/schema-markup' },
  { label: 'AI SEO Services', href: '/ai-seo-services' },
  { label: 'All Services →', href: '/services', variant: 'hub' },
];

export const NAV_LINKS: NavLink[] = [
  { label: 'AI Visibility', href: '/voice' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'Case Studies', href: '/case-studies' },
];

const HOME_LINK: NavLink = { label: 'Home', href: '/' };

interface NavigationProps {
  className?: string;
  linkClassName?: string;
  onLinkClick?: () => void;
  variant?: 'header' | 'footer' | 'mobile';
}

export function Navigation({
  className,
  linkClassName,
  onLinkClick,
  variant = 'header',
}: NavigationProps) {
  const pathname = usePathname();
  const isUS = pathname?.startsWith('/us');
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);

  const closeServices = (restoreFocus = false) => {
    setIsServicesOpen(false);
    if (restoreFocus) servicesButtonRef.current?.focus();
  };

  const fineHover = () => {
    if (typeof window.matchMedia !== 'function') return false;
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  };

  useEffect(() => {
    if (variant !== 'header' || !isServicesOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      closeServices(true);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isServicesOpen, variant]);

  const localeLinks = useMemo(() => {
    if (!isUS) return NAV_LINKS;
    return NAV_LINKS.map((link) => {
      if (link.href === '/pricing') return { ...link, href: '/us/quote' };
      return link;
    });
  }, [isUS]);

  const links = variant === 'mobile' ? [HOME_LINK, ...localeLinks] : localeLinks;

  const navLabel = variant === 'mobile' ? 'Mobile navigation' : 'Main navigation';

  return (
    <nav className={className} aria-label={navLabel}>
      {variant === 'header' && (
        <div
          ref={servicesRef}
          className="relative"
          onMouseEnter={() => {
            if (fineHover()) setIsServicesOpen(true);
          }}
          onMouseLeave={() => {
            if (fineHover()) setIsServicesOpen(false);
          }}
          onBlur={(event) => {
            const next = event.relatedTarget;
            if (next instanceof Node && servicesRef.current?.contains(next)) return;
            setIsServicesOpen(false);
          }}
        >
          <button
            ref={servicesButtonRef}
            type="button"
            className={cn(
              'flex items-center gap-1 transition-colors duration-200',
              'text-white font-body font-medium whitespace-nowrap',
              'hover:text-brand-gold',
              linkClassName
            )}
            aria-haspopup="true"
            aria-expanded={isServicesOpen}
            aria-controls="header-services-menu"
            onClick={() => setIsServicesOpen((open) => !open)}
          >
            Services
            <ChevronDown
              className={cn('w-4 h-4 transition-transform', isServicesOpen && 'rotate-180')}
            />
          </button>

          <div
            id="header-services-menu"
            className={cn(
              'absolute top-full left-0 pt-4 transition-all duration-200 z-50',
              isServicesOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            )}
          >
            <div className="bg-brand-navy border border-brand-graphite rounded-lg shadow-xl py-2 min-w-[260px]">
              {SERVICES_LINKS.map((link) => {
                const isHub = link.variant === 'hub';
                const isActive = pathname === link.href;
                const className = cn(
                  'block px-4 py-2 text-sm font-body transition-colors',
                  isHub && 'border-t border-white/10 mt-1 pt-3 hover:bg-white/5',
                  isHub &&
                    (isActive ? 'text-brand-gold bg-white/5' : 'text-white/55 hover:text-brand-gold'),
                  !isHub &&
                    (isActive
                      ? 'text-brand-gold bg-white/5'
                      : 'text-white/80 hover:text-brand-gold hover:bg-white/5')
                );
                if (link.outbound) {
                  return (
                    <RwdOutboundLink
                      key={link.href}
                      destination={link.outbound.destination}
                      page={link.outbound.page}
                      placement={link.outbound.placement}
                      className={className}
                    >
                      {link.label}
                    </RwdOutboundLink>
                  );
                }
                return (
                  <Link key={link.href} href={link.href} onClick={onLinkClick} className={className}>
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {variant === 'mobile' && (
        <div className="w-full flex flex-col items-center">
          <button
            type="button"
            onClick={() => setIsServicesOpen(!isServicesOpen)}
            className={cn(
              'flex items-center gap-2 transition-colors duration-200 w-full justify-center',
              'text-white font-body font-medium text-lg',
              'hover:text-brand-gold',
              linkClassName
            )}
            aria-expanded={isServicesOpen}
            aria-controls="mobile-services-menu"
            onKeyDown={(event) => {
              if (event.key === 'Escape' && isServicesOpen) {
                event.preventDefault();
                setIsServicesOpen(false);
              }
            }}
          >
            Services
            <ChevronDown
              className={cn('w-5 h-5 transition-transform', isServicesOpen && 'rotate-180')}
            />
          </button>

          <div
            id="mobile-services-menu"
            className={cn(
              'overflow-hidden transition-all duration-300 w-full flex flex-col items-center',
              isServicesOpen ? 'max-h-[520px] mt-4 opacity-100' : 'max-h-0 opacity-0'
            )}
            hidden={!isServicesOpen}
          >
            {SERVICES_LINKS.map((link) => {
              const isHub = link.variant === 'hub';
              const isActive = pathname === link.href;
              const className = cn(
                'block py-2 text-base font-body transition-colors w-full text-center',
                isHub && 'border-t border-white/10 mt-2 pt-3',
                isHub && (isActive ? 'text-brand-gold' : 'text-white/50 hover:text-brand-gold'),
                !isHub && (isActive ? 'text-brand-gold' : 'text-white/70 hover:text-brand-gold')
              );
              if (link.outbound) {
                return (
                  <RwdOutboundLink
                    key={link.href}
                    destination={link.outbound.destination}
                    page={link.outbound.page}
                    placement={link.outbound.placement}
                    className={className}
                  >
                    {link.label}
                  </RwdOutboundLink>
                );
              }
              return (
                <Link key={link.href} href={link.href} onClick={onLinkClick} className={className}>
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'transition-colors duration-200',
              variant === 'header' && [
                'text-white font-body font-medium whitespace-nowrap',
                isActive ? 'text-brand-gold' : 'hover:text-brand-gold',
              ],
              variant === 'footer' && [
                'text-white/80 font-body text-body-sm',
                'hover:text-brand-gold',
              ],
              variant === 'mobile' && [
                'text-white font-body font-medium text-lg',
                isActive ? 'text-brand-gold' : 'hover:text-brand-gold',
              ],
              linkClassName
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
