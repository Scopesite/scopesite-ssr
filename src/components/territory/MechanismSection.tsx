import { MECHANISM } from '@/lib/territory/copy';

export function MechanismSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-headline text-3xl sm:text-4xl text-brand-navy text-center mb-12">
          {MECHANISM.sectionTitle}
        </h2>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" aria-label="How Territory Command works">
          {MECHANISM.cards.map((card) => (
            <li
              key={card.number}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 lg:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="flex shrink-0 aspect-square h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-brand-gold font-headline text-lg">
                  {card.number}
                </span>
                <h3 className="font-body font-black text-xl text-brand-navy tracking-tight">
                  {card.title}
                </h3>
              </div>
              <p className="text-base text-slate-700 leading-relaxed">{card.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default MechanismSection;
