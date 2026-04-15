'use client';

import { FadeInOnScroll, StaggerContainer, StaggerItem } from '@/components/animations';
import { LucideIcon } from 'lucide-react';

interface SolutionFeature {
  title: string;
  description: string;
  icon?: LucideIcon;
  iconNode?: React.ReactNode;
}

interface LandingSolutionProps {
  title: string;
  intro?: string;
  features: SolutionFeature[];
  layout?: 'grid' | 'table';
  columns?: 2 | 3 | 4;
  className?: string;
}

export function LandingSolution({
  title,
  intro,
  features,
  layout = 'grid',
  columns = 4,
  className = '',
}: LandingSolutionProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className={`bg-brand-navy py-section relative overflow-hidden ${className}`}>
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(236,182,21,0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="container-content relative z-10">
        <FadeInOnScroll>
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">
              {title}
            </h2>
            {intro && (
              <p className="text-white/70 max-w-2xl mx-auto">
                {intro}
              </p>
            )}
          </div>
        </FadeInOnScroll>

        {layout === 'table' ? (
          <FadeInOnScroll delay={0.2}>
            <div className="max-w-4xl mx-auto overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-4 px-4 text-brand-gold font-bold">Feature</th>
                    <th className="text-left py-4 px-4 text-brand-gold font-bold">What It Means For You</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, index) => (
                    <tr key={index} className="border-b border-white/10 last:border-b-0">
                      <td className="py-4 px-4 text-white font-bold align-top">
                        {feature.title}
                      </td>
                      <td className="py-4 px-4 text-white/70">
                        {feature.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeInOnScroll>
        ) : (
          <StaggerContainer className={`grid grid-cols-1 ${gridCols[columns]} gap-6`} staggerDelay={0.1}>
            {features.map((feature, index) => (
              <StaggerItem key={index}>
                <div className="card-dark-hover h-full">
                  {(feature.icon || feature.iconNode) && (
                    <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10">
                      {feature.iconNode ? feature.iconNode : (feature.icon && <feature.icon className="w-6 h-6 text-brand-gold" />)}
                    </div>
                  )}
                  <h3 className="text-white font-bold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/70">
                    {feature.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}
