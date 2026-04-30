'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FadeInOnScroll, TypeWriter } from '@/components/animations';

interface LandingHeroProps {
  badge?: string;
  badgeIcon?: React.ReactNode;
  headline: string;
  headlineHighlight?: string;
  subheadline: string;
  bodyCopy: string | React.ReactNode;
  primaryCTA?: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  useTypewriter?: boolean;
}

export function LandingHero({
  badge,
  badgeIcon,
  headline,
  headlineHighlight,
  subheadline,
  bodyCopy,
  primaryCTA = { text: 'Get Instant Quote', href: '/pricing' },
  secondaryCTA = { text: 'Book Strategy Call', href: '/book' },
  useTypewriter = false,
}: LandingHeroProps) {
  return (
    <section className="bg-brand-navy text-white py-section min-h-[85vh] flex items-center relative overflow-hidden">
      {/* Animated grid background */}
      <div 
        className="absolute inset-0 opacity-[0.03] animate-grid-flow max-md:animate-none motion-reduce:animate-none"
        style={{
          backgroundImage: `linear-gradient(rgba(236,182,21,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(236,182,21,0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Gradient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-brand-gold/10 rounded-full blur-[150px] animate-glow-pulse max-md:animate-none motion-reduce:animate-none" />
      
      <div className="container-content relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge: static on mobile (no opacity-0 wait); motion from md up */}
          {badge && (
            <>
              <div className="md:hidden mb-8">
                <div className="inline-flex items-center gap-3 bg-brand-gold/10 border border-brand-gold/30 rounded-full px-5 py-2">
                  <div className="flex items-center gap-2">
                    {badgeIcon}
                    <span className="text-brand-gold font-medium text-sm">{badge}</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <FadeInOnScroll delay={0.2}>
                  <div className="inline-flex items-center gap-3 bg-brand-gold/10 border border-brand-gold/30 rounded-full px-5 py-2 mb-8">
                    <div className="flex items-center gap-2">
                      {badgeIcon}
                      <span className="text-brand-gold font-medium text-sm">{badge}</span>
                    </div>
                  </div>
                </FadeInOnScroll>
              </div>
            </>
          )}
          
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-headline text-white mb-4">
            {headlineHighlight ? (
              <>
                <span className="text-brand-gold block mb-2">
                  {useTypewriter ? (
                    <TypeWriter text={headlineHighlight} speed={60} delay={200} />
                  ) : (
                    headlineHighlight
                  )}
                </span>
                <span className="block">{headline}</span>
              </>
            ) : (
              <span className="text-brand-gold">
                {useTypewriter ? (
                  <TypeWriter text={headline} speed={60} delay={200} />
                ) : (
                  headline
                )}
              </span>
            )}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 font-medium mb-6">
            {subheadline}
          </p>

          <div className="hero-description text-body-lg text-white/70 mb-10 max-w-3xl mx-auto">
            {typeof bodyCopy === 'string' ? <p>{bodyCopy}</p> : bodyCopy}
          </div>
          
          <div className="md:hidden flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={primaryCTA.href} className="btn-primary inline-flex items-center gap-2 group">
              {primaryCTA.text}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href={secondaryCTA.href} className="btn-secondary">
              {secondaryCTA.text}
            </Link>
          </div>
          <div className="hidden md:block">
            <FadeInOnScroll delay={1.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={primaryCTA.href} className="btn-primary inline-flex items-center gap-2 group">
                  {primaryCTA.text}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href={secondaryCTA.href} className="btn-secondary">
                  {secondaryCTA.text}
                </Link>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
