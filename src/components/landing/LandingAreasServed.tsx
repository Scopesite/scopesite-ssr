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
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  isHome 
                    ? 'bg-brand-gold text-brand-navy font-bold' 
                    : isDark 
                      ? 'bg-white/10 text-white hover:bg-white/20' 
                      : 'bg-brand-navy/5 text-brand-navy hover:bg-brand-navy/10'
                }`}>
                  {isHome && <MapPin className="w-4 h-4" />}
                  <span>{town}</span>
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
