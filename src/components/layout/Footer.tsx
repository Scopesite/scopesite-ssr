'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin } from 'lucide-react';

const FOOTER_LINKS = {
  services: [
    { label: 'Web Design', href: '/web-design' },
    { label: 'AI Website Design', href: '/ai-website-design' },
    { label: 'AI SEO Services', href: '/ai-seo-services' },
    { label: 'Schema Markup', href: '/schema-markup' },
    { label: 'V.O.I.C.E™ AI Visibility', href: '/voice' },
    { label: 'Custom Web Apps', href: '/web-apps' },
    { label: 'Pricing', href: '/pricing' },
  ],
  localServices: [
    { label: 'Web Design Somerset', href: '/web-design-somerset' },
    { label: 'Web Design Bath', href: '/web-design-bath' },
    { label: 'Web Design Bristol', href: '/web-design-bristol' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Case Studies', href: '/case-studies/h4tlt' },
    { label: 'Blog', href: '/blog' },
    { label: 'Book a Call', href: '/book' },
    { label: 'Client Login', href: 'https://accounts.scopesite.co.uk/sign-in' },
    { label: 'Sign Up as Client', href: 'https://accounts.scopesite.co.uk/sign-up' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms-and-conditions' },
    { label: 'Cookie Policy', href: '/privacy-policy#8-cookies-and-tracking' },
    { label: 'Accessibility', href: '/accessibility-statement' },
  ],
};

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/scopesite/',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/scopesite',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/follow_scopesite_graphics/',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
      </svg>
    ),
  },
];

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Don't render main footer in portal
  if (pathname?.startsWith('/portal')) {
    return null;
  }

  return (
    <footer className="bg-navy-gradient text-white" aria-label="Site footer">
      {/* Main Footer Content */}
      <div className="container-content py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <Image
                src="/images/logo-icon.svg"
                alt=""
                width={48}
                height={48}
                className="transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <span className="font-headline text-white text-2xl tracking-tight">
                SCOPESITE
              </span>
            </Link>
            <p className="text-white/70 text-body mb-6 max-w-sm">
              Veteran-owned UK web design agency specializing in AI visibility 
              and GEO optimization. We build websites that get found by humans 
              and AI alike.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="tel:+441373311339"
                className="flex items-center gap-3 text-white/80 hover:text-brand-gold transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>01373 311339</span>
              </a>
              <a
                href="mailto:support@scopesite.co.uk"
                className="flex items-center gap-3 text-white/80 hover:text-brand-gold transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>support@scopesite.co.uk</span>
              </a>
              <div className="flex items-center gap-3 text-white/80">
                <MapPin className="w-4 h-4" />
                <span>Frome, Somerset, UK</span>
              </div>
            </div>
          </div>

          {/* Services Links */}
          <nav aria-labelledby="footer-services-heading">
            <h3 id="footer-services-heading" className="font-body font-bold text-white text-body-lg mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 text-body-sm hover:text-brand-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Local Services Sub-section */}
            <h4 className="font-body font-semibold text-white/80 text-body-sm mt-6 mb-3">
              Local Services
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.localServices.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 text-body-sm hover:text-brand-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company Links */}
          <nav aria-labelledby="footer-company-heading">
            <h3 id="footer-company-heading" className="font-body font-bold text-white text-body-lg mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 text-body-sm hover:text-brand-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal Links */}
          <div>
            <nav aria-labelledby="footer-legal-heading">
              <h3 id="footer-legal-heading" className="font-body font-bold text-white text-body-lg mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                {FOOTER_LINKS.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/70 text-body-sm hover:text-brand-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Veteran Badge */}
            <div className="mt-6 pt-6 border-t border-brand-graphite">
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-brand-graphite/50 rounded-lg">
                <span className="text-brand-gold text-lg" aria-hidden="true">&#9733;</span>
                <span className="text-white/90 text-caption font-medium">
                  Veteran Owned
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-brand-graphite">
        <div className="container-content py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-white/60 text-body-sm text-center sm:text-left">
              &copy; {currentYear} ScopeSite Digital Studios. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-brand-gold transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

