import { WHAT_YOU_GET } from '@/lib/territory/copy';

export function WhatYouGetSection() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-headline text-3xl sm:text-4xl text-brand-navy text-center mb-12">
          {WHAT_YOU_GET.sectionTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {WHAT_YOU_GET.cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl bg-white p-6 lg:p-8 border border-slate-200 shadow-sm"
            >
              <h3 className="font-headline text-xl text-brand-navy mb-3">{card.title}</h3>
              <p className="text-base text-slate-700 leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhatYouGetSection;
