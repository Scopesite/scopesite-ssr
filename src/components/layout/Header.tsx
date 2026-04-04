'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navigation } from './Navigation';
import { cn } from '@/lib/utils';

const MobileMenu = dynamic(() => import('./MobileMenu'), { ssr: false });

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isPortal = pathname?.startsWith('/portal');
  const isUS = pathname?.startsWith('/us');

  useEffect(() => {
    if (isPortal) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPortal]);

  if (isPortal) {
    return null;
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'transition-all duration-300',
        isScrolled
          ? 'bg-brand-navy/95 backdrop-blur-md shadow-lg'
          : 'bg-brand-navy'
      )}
    >
      <div className="container-content">
        <div className="flex items-center justify-between h-32">
          <Link href="/" className="flex items-center gap-4 group shrink-0" aria-label="ScopeSite - Go to homepage">
            <Image
              src="/images/logo-icon.svg"
              alt="ScopeSite Digital Studios logo"
              width={100}
              height={100}
              className="transition-transform group-hover:scale-105"
              priority
            />
            <span className={cn(
              "font-headline text-[50px] leading-none tracking-tight hidden sm:block whitespace-nowrap transition-colors",
              isHome ? "text-brand-gold" : "text-white group-hover:text-brand-gold"
            )}>
              SCOPESITE
            </span>
          </Link>

          <Navigation
            className="hidden lg:flex items-center gap-5 xl:gap-8"
            variant="header"
          />

          <div className="hidden lg:flex items-center shrink-0">
            <Button
              asChild
              className="bg-brand-gold text-brand-navy hover:bg-white hover:text-brand-navy shadow-button font-body font-bold px-5 py-2 whitespace-nowrap"
            >
              <Link href={isUS ? '/us/quote' : '/pricing'}>Get a Quote</Link>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:text-brand-gold hover:bg-transparent h-20 w-20 [&_svg]:!h-14 [&_svg]:!w-14"
            aria-label="Open menu"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu />
          </Button>

          {isMobileMenuOpen && (
            <MobileMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen} />
          )}
        </div>
      </div>
    </header>
  );
}

