import { FAQ } from '@/lib/territory/copy';

/**
 * FAQ uses the native <details> element so it works without JavaScript.
 * Matches the JSON-LD FAQPage entities injected via SchemaOrgMarkup.
 */
export function FAQSection() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-headline text-3xl sm:text-4xl text-brand-navy text-center mb-12">
          {FAQ.sectionTitle}
        </h2>
        <div className="space-y-3">
          {FAQ.items.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl bg-white border border-slate-200 p-5 lg:p-6 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-4 font-headline text-lg text-brand-navy">
                <span>{item.q}</span>
                <span
                  aria-hidden="true"
                  className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-navy text-brand-gold text-sm transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 text-base text-slate-700 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
