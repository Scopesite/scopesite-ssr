import { GUARANTEE } from '@/lib/territory/copy';

export function GuaranteeSection() {
  return (
    <section className="bg-brand-navy py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-headline text-3xl sm:text-4xl text-brand-gold mb-8">
          {GUARANTEE.sectionTitle}
        </h2>
        <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-brand-gold/30 p-8 lg:p-10 text-left">
          <p className="text-lg text-white leading-relaxed mb-4">{GUARANTEE.body}</p>
          <p className="text-base text-white/80 leading-relaxed">{GUARANTEE.secondaryBody}</p>
        </div>
      </div>
    </section>
  );
}

export default GuaranteeSection;
