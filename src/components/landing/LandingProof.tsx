'use client';

import { FadeInOnScroll, AnimatedCounter, StaggerContainer, StaggerItem } from '@/components/animations';

interface Stat {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  description?: string;
}

interface LandingProofProps {
  title?: string;
  subtitle?: string;
  stats: Stat[];
  quote?: {
    text: string;
    author?: string;
  };
  theme?: 'light' | 'dark';
  className?: string;
}

export function LandingProof({
  title = 'Proof That It Works',
  subtitle,
  stats,
  quote,
  theme = 'dark',
  className = '',
}: LandingProofProps) {
  const isDark = theme === 'dark';

  return (
    <section className={`${isDark ? 'bg-brand-navy' : 'section-white'} py-section ${className}`}>
      <div className="container-content">
        <FadeInOnScroll>
          <div className="text-center mb-8 md:mb-12">
            <h2 className={`${isDark ? 'text-white' : 'text-brand-navy'} mb-4 text-xl sm:text-2xl md:text-h2`}>
              {title}
            </h2>
            {subtitle && (
              <p className={`${isDark ? 'text-white/70' : 'text-brand-navy/70'} max-w-2xl mx-auto`}>
                {subtitle}
              </p>
            )}
          </div>
        </FadeInOnScroll>

        <StaggerContainer 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-10" 
          staggerDelay={0.1}
        >
          {stats.map((stat, index) => (
            <StaggerItem key={index}>
              <div className={`text-center p-6 rounded-xl ${
                isDark 
                  ? 'bg-brand-graphite/50 border border-white/10' 
                  : 'bg-brand-navy/[0.03] border border-brand-navy/10'
              }`}>
                <div className={`text-3xl md:text-4xl font-bold mb-2 ${
                  isDark ? 'text-brand-gold' : 'text-brand-gold-accessible'
                }`}>
                  <AnimatedCounter 
                    value={stat.value} 
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </div>
                <div className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-brand-navy'}`}>
                  {stat.label}
                </div>
                {stat.description && (
                  <div className={`text-sm ${isDark ? 'text-white/60' : 'text-brand-navy/60'}`}>
                    {stat.description}
                  </div>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {quote && (
          <FadeInOnScroll delay={0.4}>
            <div className={`max-w-3xl mx-auto text-center p-8 rounded-xl ${
              isDark 
                ? 'bg-brand-graphite/30 border border-white/10' 
                : 'bg-brand-navy/[0.02] border border-brand-navy/10'
            }`}>
              <blockquote className={`text-lg italic ${isDark ? 'text-white/90' : 'text-brand-navy/90'}`}>
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              {quote.author && (
                <cite className={`block mt-4 not-italic font-medium ${
                  isDark ? 'text-brand-gold' : 'text-brand-gold-accessible'
                }`}>
                  — {quote.author}
                </cite>
              )}
            </div>
          </FadeInOnScroll>
        )}
      </div>
    </section>
  );
}
