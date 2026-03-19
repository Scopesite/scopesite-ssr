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
        className="w-full sm:w-80 bg-brand-navy border-brand-graphite"
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
            <span className="font-headline text-brand-gold text-2xl tracking-tight">
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
          <Button
            asChild
            className="w-full bg-brand-gold text-brand-navy hover:bg-brand-navy hover:text-white shadow-button font-body font-bold"
            onClick={() => onOpenChange(false)}
          >
            <Link href={isUS ? '/us/quote' : '/pricing'}>Get Instant Quote</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
