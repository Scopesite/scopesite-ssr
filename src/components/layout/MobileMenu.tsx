'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Navigation } from './Navigation';
import { RwdOutboundLink } from '@/components/rwd/RwdOutboundLink';

const recruitmentCtaClass =
  'inline-flex w-full items-center justify-center whitespace-nowrap rounded-md bg-[#f71663] px-5 py-2 text-center font-body text-sm font-bold text-[#0a1429] shadow-button no-underline hover:bg-[#f71663] hover:text-[#0a1429]';

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const pathname = usePathname();
  const isUS = pathname?.startsWith('/us');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        closeClassName="sticky top-4 z-[60] shrink-0 self-end"
        className="flex h-dvh max-h-dvh w-full flex-col overflow-y-auto overscroll-contain bg-brand-navy border-brand-graphite sm:w-80"
      >
        <SheetHeader>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="flex items-center justify-center gap-4 pt-4 pb-10 border-b border-brand-graphite">
            <Image
              src="/images/logo-icon.svg"
              alt="ScopeSite Digital Studios logo"
              width={60}
              height={60}
            />
            <span className="font-brand text-brand-gold text-2xl tracking-tight">
              SCOPESITE
            </span>
          </div>
        </SheetHeader>

        <Navigation
          className="flex flex-col items-center gap-8 my-12"
          variant="mobile"
          onLinkClick={() => onOpenChange(false)}
        />

        <div className="pt-6 border-t border-brand-graphite">
          {isUS ? (
            <Button
              asChild
              className="w-full bg-brand-gold text-brand-navy hover:bg-brand-navy hover:text-white shadow-button font-body font-bold"
              onClick={() => onOpenChange(false)}
            >
              <Link href="/us/quote">Get Instant Quote</Link>
            </Button>
          ) : (
            <RwdOutboundLink
              destination="home"
              page="nav"
              placement="nav"
              className={recruitmentCtaClass}
              onClick={() => onOpenChange(false)}
            >
              Work In Recruitment?
            </RwdOutboundLink>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
