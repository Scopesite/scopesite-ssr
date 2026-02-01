'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FadeInOnScroll, StaggerContainer, StaggerItem } from '@/components/animations';

interface RelatedService {
  title: string;
  description: string;
  href: string;
}

interface LandingRelatedServicesProps {
  title?: string;
  intro?: string;
  services: RelatedService[];
  theme?: 'light' | 'dark';
  className?: string;
}

export function LandingRelatedServices({
  title = 'Related Services',
  intro,
  services,
  theme = 'light',
  className = '',
}: LandingRelatedServicesProps) {
  const isDark = theme === 'dark';

  return (
    <section className={`py-16 ${isDark ? 'bg-brand-navy' : 'bg-slate-50'} ${className}`}>
      <div className="container-content">
        <FadeInOnScroll>
          <div className="text-center mb-10">
            <h2 className={`text-2xl sm:text-3xl mb-4 ${isDark ? 'text-white' : 'text-brand-navy'}`}>
              {title}
            </h2>
            {intro && (
              <p className={`max-w-2xl mx-auto ${isDark ? 'text-white/70' : 'text-muted'}`}>
                {intro}
              </p>
            )}
          </div>
        </FadeInOnScroll>

        <StaggerContainer 
          className={`grid grid-cols-1 ${services.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6 max-w-4xl mx-auto`}
          staggerDelay={0.1}
        >
          {services.map((service, index) => (
            <StaggerItem key={index}>
              <Link 
                href={service.href}
                className={`block p-6 rounded-xl border transition-all hover:scale-[1.02] ${
                  isDark 
                    ? 'bg-white/5 border-white/10 hover:border-brand-gold/50' 
                    : 'bg-white border-slate-200 hover:border-brand-gold shadow-sm hover:shadow-md'
                }`}
              >
                <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-brand-navy'}`}>
                  {service.title}
                </h3>
                <p className={`text-sm mb-4 ${isDark ? 'text-white/60' : 'text-muted'}`}>
                  {service.description}
                </p>
                <span className={`inline-flex items-center gap-2 text-sm font-medium ${
                  isDark ? 'text-brand-gold' : 'text-brand-navy'
                }`}>
                  Learn more <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
