'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FadeInOnScroll } from '@/components/animations';

interface LandingCTAProps {
  title: string;
  description?: string;
  primaryCTA?: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  theme?: 'light' | 'dark';
  footnote?: string;
  className?: string;
}

export function LandingCTA({
  title,
  description,
  primaryCTA = { text: 'Get Instant Quote', href: '/pricing' },
  secondaryCTA = { text: 'Book Strategy Call', href: '/book' },
  theme = 'dark',
  footnote,
  className = '',
}: LandingCTAProps) {
  const isDark = theme === 'dark';

  return (
    <section className={`${isDark ? 'bg-brand-navy' : 'section-white'} py-section relative overflow-hidden ${className}`}>
      {/* Gold accent glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] ${
        isDark ? 'bg-brand-gold/10' : 'bg-brand-gold/5'
      } rounded-full blur-[100px]`} />
      
      <div className="container-content relative z-10 text-center">
        <FadeInOnScroll>
          <h2 className={`${isDark ? 'text-white' : 'text-brand-navy'} mb-4 text-xl sm:text-2xl md:text-h2`}>
            {title}
          </h2>
        </FadeInOnScroll>
        
        {description && (
          <FadeInOnScroll delay={0.2}>
            <p className={`${isDark ? 'text-white/70' : 'text-brand-navy/70'} mb-10 max-w-2xl mx-auto`}>
              {description}
            </p>
          </FadeInOnScroll>
        )}
        
        <FadeInOnScroll delay={0.4}>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link 
              href={primaryCTA.href} 
              className="btn-primary inline-flex items-center gap-2 group animate-counter-glow"
            >
              {primaryCTA.text}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href={secondaryCTA.href} className="btn-secondary">
              {secondaryCTA.text}
            </Link>
          </div>
        </FadeInOnScroll>
        
        {footnote && (
          <FadeInOnScroll delay={0.6}>
            <p className={`${isDark ? 'text-white/50' : 'text-brand-navy/50'} text-sm`}>
              {footnote}
            </p>
          </FadeInOnScroll>
        )}
      </div>
    </section>
  );
}
