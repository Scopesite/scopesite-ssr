'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Navigation } from './Navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isPortal = pathname?.startsWith('/portal');

  // Don't render main header in portal - it has its own nav
  if (isPortal) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 group shrink-0" aria-label="ScopeSite - Go to homepage">
            <Image
              src="/images/logo-icon.svg"
              alt=""
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

          {/* Desktop Navigation */}
          <Navigation
            className="hidden lg:flex items-center gap-8"
            variant="header"
          />

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Button
              asChild
              className="bg-brand-gold text-brand-navy hover:bg-white hover:text-brand-navy shadow-button font-body font-bold px-5 py-2 whitespace-nowrap"
            >
              <Link href="/pricing">Get Instant Quote</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-2 border-brand-gold text-brand-gold bg-transparent hover:bg-brand-gold hover:text-brand-navy font-body font-bold px-5 py-2 whitespace-nowrap"
            >
              <Link href="/book">Book Strategy Call</Link>
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-brand-gold hover:bg-transparent h-20 w-20 [&_svg]:!h-14 [&_svg]:!w-14"
                aria-label="Open menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:w-80 bg-brand-navy border-brand-graphite"
            >
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex items-center justify-center gap-4 pt-4 pb-10 border-b border-brand-graphite">
                  <Image
                    src="/images/logo-icon.svg"
                    alt=""
                    width={60}
                    height={60}
                  />
                  <span className="font-headline text-brand-gold text-2xl tracking-tight">
                    SCOPESITE
                  </span>
                </div>
              </SheetHeader>

              {/* Mobile Navigation */}
              <Navigation
                className="flex flex-col items-center gap-8 my-12"
                variant="mobile"
                onLinkClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Mobile CTA - Primary only */}
              <div className="pt-6 border-t border-brand-graphite">
                <Button
                  asChild
                  className="w-full bg-brand-gold text-brand-navy hover:bg-brand-navy hover:text-white shadow-button font-body font-bold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href="/pricing">Get Instant Quote</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

