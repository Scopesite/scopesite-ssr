'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';

export type CaseStudySector = 'health' | 'recruitment';

export interface CaseStudyListItem {
  title: string;
  client: string;
  slug: string;
  description: string;
  metrics: { label: string; value: string }[];
  sector: CaseStudySector;
}

const CHIPS: { id: 'all' | CaseStudySector; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'health', label: 'Health' },
  { id: 'recruitment', label: 'Recruitment' },
];

export function CaseStudyListWithFilters({ caseStudies }: { caseStudies: CaseStudyListItem[] }) {
  const [sector, setSector] = useState<'all' | CaseStudySector>('all');

  const filtered = useMemo(() => {
    if (sector === 'all') return caseStudies;
    return caseStudies.filter((cs) => cs.sector === sector);
  }, [caseStudies, sector]);

  return (
    <div className="container-content">
      <div className="flex flex-wrap justify-center gap-2 mb-10" role="tablist" aria-label="Filter case studies by sector">
        {CHIPS.map((chip) => {
          const selected = sector === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setSector(chip.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors border ${
                selected
                  ? 'bg-brand-navy text-white border-brand-navy'
                  : 'bg-white text-brand-navy border-brand-navy/15 hover:border-brand-gold'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="max-w-xl mx-auto text-center rounded-2xl border border-brand-navy/10 bg-brand-navy/5 p-10">
          <p className="text-brand-navy font-bold text-lg mb-3">No published recruitment case study yet</p>
          <p className="text-muted mb-6">
            The first write-up is on its way. Meanwhile, see how we approach recruitment website design, live jobs
            schema, and the JobBoard Sonar demo.
          </p>
          <Link
            href="/recruitment-website-design"
            className="inline-flex items-center gap-2 text-brand-gold font-semibold hover:underline"
          >
            Recruitment website design
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((cs) => (
            <Link
              key={cs.slug}
              href={`/case-studies/${cs.slug}`}
              className="group flex flex-col bg-white rounded-2xl border border-brand-navy/10 overflow-hidden hover:shadow-card transition-all duration-300"
            >
              <div className="p-8 flex-1 flex flex-col">
                <div className="text-brand-gold font-bold text-sm tracking-wider uppercase mb-3">{cs.client}</div>
                <h2 className="text-xl font-bold text-brand-navy mb-4 group-hover:text-brand-gold-accessible transition-colors">
                  {cs.title}
                </h2>
                <p className="text-muted mb-8 flex-1">{cs.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-brand-navy/10">
                  {cs.metrics.map((metric, i) => (
                    <div key={i}>
                      <div className="text-2xl font-bold text-brand-navy mb-1 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-brand-gold" aria-hidden />
                        {metric.value}
                      </div>
                      <div className="text-xs text-muted font-medium uppercase tracking-wider">{metric.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center text-brand-navy font-bold group-hover:text-brand-gold-accessible transition-colors mt-auto">
                  Read Case Study
                  <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" aria-hidden />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
