'use client';

import { useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Menu, X, Bell } from 'lucide-react';

interface PortalNavProps {
  userName: string;
  userEmail: string;
  isAdmin: boolean;
  companyName?: string;
}

export function PortalNav({ userName, isAdmin, companyName }: PortalNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-navy border-b border-brand-graphite">
      <div className="px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo & Company */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden text-white p-2 -ml-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo - links back to main website */}
            <a href="https://scopesite.co.uk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
              <span className="font-headline text-lg text-white">SCOPESITE</span>
              <span className="hidden sm:inline text-white/50 text-sm">|</span>
              <span className="hidden sm:inline text-white/70 text-sm">Portal</span>
            </a>

            {/* Company name badge */}
            {companyName && (
              <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-sm font-medium">
                {companyName}
              </span>
            )}
          </div>

          {/* Right side - Actions & User */}
          <div className="flex items-center gap-4">
            {/* Admin badge */}
            {isAdmin && (
              <Link
                href="/portal/admin/dashboard"
                className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-brand-orange/20 text-brand-orange text-sm font-medium hover:bg-brand-orange/30 transition-colors"
              >
                Admin
              </Link>
            )}

            {/* Notifications */}
            <button
              type="button"
              className="relative text-white/70 hover:text-white p-2 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {/* Notification dot - uncomment when there are notifications */}
              {/* <span className="absolute top-1 right-1 w-2 h-2 bg-brand-gold rounded-full" /> */}
            </button>

            {/* User menu */}
            <div className="flex items-center gap-3">
              <span className="hidden md:block text-white/70 text-sm">
                {userName}
              </span>
              <UserButton
                afterSignOutUrl="https://scopesite.co.uk"
                appearance={{
                  elements: {
                    avatarBox: 'w-9 h-9',
                    userButtonPopoverCard: 'shadow-xl',
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 top-16 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}
