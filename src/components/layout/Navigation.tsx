'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Web Design', href: '/web-design' },
  { label: 'V.O.I.C.E™', href: '/voice' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
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
  variant = 'header' 
}: NavigationProps) {
  const pathname = usePathname();
  const isUS = pathname?.startsWith('/us');

  const localeLinks = useMemo(() => {
    if (!isUS) return NAV_LINKS;
    return NAV_LINKS.map((link) => {
      if (link.href === '/pricing') return { ...link, href: '/us/quote' };
      return link;
    });
  }, [isUS]);

  const links = variant === 'mobile' ? [HOME_LINK, ...localeLinks] : localeLinks;

  // Determine aria-label based on variant
  const navLabel = variant === 'mobile' ? 'Mobile navigation' : 'Main navigation';

  return (
    <nav className={className} aria-label={navLabel}>
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

