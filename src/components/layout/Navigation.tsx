'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NavLink {
  label: string;
  href: string;
  /** Distinct styling for the Services hub row (e.g. All Services →) */
  variant?: 'hub';
}

export const SERVICES_LINKS: NavLink[] = [
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
  { label: 'Territory', href: '/territory' },
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
        <div className="relative group">
          <button
            className={cn(
              'flex items-center gap-1 transition-colors duration-200',
              'text-white font-body font-medium whitespace-nowrap',
              'hover:text-brand-gold',
              linkClassName
            )}
            aria-haspopup="true"
            aria-expanded={isServicesOpen}
          >
            Services
            <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
          </button>

          <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="bg-brand-navy border border-brand-graphite rounded-lg shadow-xl py-2 min-w-[260px]">
              {SERVICES_LINKS.map((link) => {
                const isHub = link.variant === 'hub';
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onLinkClick}
                    className={cn(
                      'block px-4 py-2 text-sm font-body transition-colors',
                      isHub &&
                        'border-t border-white/10 mt-1 pt-3 hover:bg-white/5',
                      isHub &&
                        (isActive
                          ? 'text-brand-gold bg-white/5'
                          : 'text-white/55 hover:text-brand-gold'),
                      !isHub &&
                        (isActive
                          ? 'text-brand-gold bg-white/5'
                          : 'text-white/80 hover:text-brand-gold hover:bg-white/5')
                    )}
                  >
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
          >
            Services
            <ChevronDown
              className={cn('w-5 h-5 transition-transform', isServicesOpen && 'rotate-180')}
            />
          </button>

          <div
            className={cn(
              'overflow-hidden transition-all duration-300 w-full flex flex-col items-center',
              isServicesOpen ? 'max-h-[520px] mt-4 opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            {SERVICES_LINKS.map((link) => {
              const isHub = link.variant === 'hub';
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onLinkClick}
                  className={cn(
                    'block py-2 text-base font-body transition-colors w-full text-center',
                    isHub && 'border-t border-white/10 mt-2 pt-3',
                    isHub &&
                      (isActive ? 'text-brand-gold' : 'text-white/50 hover:text-brand-gold'),
                    !isHub && (isActive ? 'text-brand-gold' : 'text-white/70 hover:text-brand-gold')
                  )}
                >
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
