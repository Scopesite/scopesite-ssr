'use client';

import { FadeInOnScroll, StaggerContainer, StaggerItem } from '@/components/animations';
import { MapPin } from 'lucide-react';

interface LandingAreasServedProps {
  title: string;
  homeBase?: string;
  towns: string[];
  theme?: 'light' | 'dark';
  className?: string;
}

export function LandingAreasServed({
  title,
  homeBase,
  towns,
  theme = 'dark',
  className = '',
}: LandingAreasServedProps) {
  const isDark = theme === 'dark';

  return (
    <section className={`${isDark ? 'bg-brand-navy' : 'section-white'} py-section ${className}`}>
      <div className="container-content">
        <FadeInOnScroll>
          <div className="text-center mb-8">
            <h2 className={`${isDark ? 'text-white' : 'text-brand-navy'} mb-4 text-xl sm:text-2xl md:text-h2`}>
              {title}
            </h2>
          </div>
        </FadeInOnScroll>

        <StaggerContainer 
          className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto" 
          staggerDelay={0.03}
        >
          {towns.map((town, index) => {
            const isHome = homeBase && town === homeBase;
            return (
              <StaggerItem key={index}>
                <div className={`inline-flex items-center justify-center gap-2 min-w-[140px] px-5 py-2.5 rounded-full border-2 transition-all duration-300 ${
                  isHome 
                    ? 'bg-brand-gold text-brand-navy font-extrabold border-white/40 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2),0_2px_8px_rgba(236,182,21,0.3)]' 
                    : isDark 
                      ? 'bg-white/5 text-brand-gold font-bold border-white/20 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] hover:border-brand-gold/50 hover:shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2),0_0_12px_rgba(236,182,21,0.15)]' 
                      : 'bg-brand-navy/5 text-brand-gold font-bold border-brand-navy/15 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)] hover:border-brand-gold/40 hover:shadow-[inset_0_-2px_4px_rgba(0,0,0,0.08),0_0_12px_rgba(236,182,21,0.1)]'
                }`}>
                  {isHome && <MapPin className="w-4 h-4" />}
                  <span className={isHome ? '' : 'drop-shadow-[0_0_6px_rgba(236,182,21,0.4)]'}>{town}</span>
                  {isHome && <span className="text-xs">(home base)</span>}
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
