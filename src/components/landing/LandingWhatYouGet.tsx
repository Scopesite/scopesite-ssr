'use client';

import { FadeInOnScroll, StaggerContainer, StaggerItem } from '@/components/animations';
import { LucideIcon, Check } from 'lucide-react';

interface FeatureCard {
  title: string;
  items: string[];
  icon?: LucideIcon;
}

interface LandingWhatYouGetProps {
  title: string;
  intro?: string;
  cards: FeatureCard[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function LandingWhatYouGet({
  title,
  intro,
  cards,
  columns = 4,
  className = '',
}: LandingWhatYouGetProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className={`section-white ${className}`}>
      <div className="container-content">
        <FadeInOnScroll>
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-brand-navy mb-4 text-xl sm:text-2xl md:text-h2">
              {title}
            </h2>
            {intro && (
              <p className="text-brand-navy/70 max-w-2xl mx-auto">
                {intro}
              </p>
            )}
          </div>
        </FadeInOnScroll>

        <StaggerContainer className={`grid grid-cols-1 ${gridCols[columns]} gap-6`} staggerDelay={0.1}>
          {cards.map((card, index) => (
            <StaggerItem key={index}>
              <div className="card-hover h-full">
                {card.icon && (
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10">
                    <card.icon className="w-6 h-6 text-brand-gold" />
                  </div>
                )}
                <h3 className="text-brand-navy font-bold text-lg mb-4">
                  {card.title}
                </h3>
                <ul className="space-y-2">
                  {card.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                      <span className="text-brand-navy/70 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
