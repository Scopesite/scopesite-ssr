'use client';

import { FadeInOnScroll } from '@/components/animations';

interface ProblemPoint {
  title: string;
  description: string;
}

interface LandingProblemProps {
  title: string;
  intro?: string;
  problems: ProblemPoint[];
  conclusion?: {
    title?: string;
    text: string;
  };
  className?: string;
}

export function LandingProblem({
  title,
  intro,
  problems,
  conclusion,
  className = '',
}: LandingProblemProps) {
  return (
    <section className={`section-white ${className}`}>
      <div className="container-content">
        <FadeInOnScroll>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-brand-navy mb-6 text-xl sm:text-2xl md:text-h2 text-center md:text-left">
              {title}
            </h2>
            
            {intro && (
              <p className="text-brand-navy/70 text-lg mb-8">
                {intro}
              </p>
            )}
            
            <div className="space-y-8">
              {problems.map((problem, index) => (
                <div key={index} className="border-l-4 border-brand-gold pl-6">
                  <h3 className="text-brand-navy font-bold text-lg mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-brand-navy/70 leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              ))}
            </div>
            
            {conclusion && (
              <div className="mt-10 p-6 bg-brand-navy/[0.03] rounded-xl border border-brand-navy/10">
                {conclusion.title && (
                  <h3 className="text-brand-navy font-bold text-lg mb-2">
                    {conclusion.title}
                  </h3>
                )}
                <p className="text-brand-navy/80 font-medium">
                  {conclusion.text}
                </p>
              </div>
            )}
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
