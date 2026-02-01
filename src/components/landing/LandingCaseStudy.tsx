'use client';

import Link from 'next/link';
import { ArrowRight, Quote } from 'lucide-react';
import { FadeInOnScroll } from '@/components/animations';

interface LandingCaseStudyProps {
  title?: string;
  stat?: string;
  statLabel?: string;
  quote?: string;
  linkText?: string;
  href?: string;
  theme?: 'light' | 'dark';
  className?: string;
}

export function LandingCaseStudy({
  title = 'See V.O.I.C.E™ in Action',
  stat = '#1',
  statLabel = 'AI-recommended in 6 weeks',
  quote = 'From 7 visitors/week to #1 recommended by ChatGPT, Perplexity, Claude, and Gemini',
  linkText = 'Read the H4TLT Case Study',
  href = '/case-studies/h4tlt',
  theme = 'light',
  className = '',
}: LandingCaseStudyProps) {
  const isDark = theme === 'dark';

  return (
    <section className={`py-16 ${isDark ? 'bg-brand-navy' : 'bg-white'} ${className}`}>
      <div className="container-content">
        <FadeInOnScroll>
          <div className={`max-w-3xl mx-auto rounded-2xl p-8 md:p-10 border ${
            isDark 
              ? 'bg-white/5 border-white/10' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Stat Badge - larger circle with better text fit */}
              <div className="flex-shrink-0 text-center">
                <div className={`inline-flex flex-col items-center justify-center w-28 h-28 rounded-full ${
                  isDark ? 'bg-brand-gold/20' : 'bg-brand-navy/10'
                }`}>
                  <div className={`text-3xl font-bold leading-none ${isDark ? 'text-brand-gold' : 'text-brand-navy'}`}>
                    {stat}
                  </div>
                  <div className={`text-[10px] leading-tight mt-1 max-w-[80px] ${isDark ? 'text-brand-gold/80' : 'text-muted'}`}>
                    {statLabel}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-brand-navy'}`}>
                  {title}
                </h3>
                <p className={`mb-4 flex items-start gap-2 ${isDark ? 'text-white/70' : 'text-muted'}`}>
                  <Quote className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-50" />
                  {quote}
                </p>
                <Link 
                  href={href}
                  className={`inline-flex items-center gap-2 font-semibold no-underline transition-all ${
                    isDark 
                      ? 'text-brand-gold hover:text-white drop-shadow-[0_0_8px_rgba(236,182,21,0.6)]' 
                      : 'text-brand-navy hover:text-brand-navy/80'
                  }`}
                >
                  {linkText}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
