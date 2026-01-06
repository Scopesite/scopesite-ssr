import Link from 'next/link';
import { Globe, Sparkles, Code, ArrowRight, Star } from 'lucide-react';

// Service card data
const services = [
  {
    title: 'Web Design',
    description: 'Beautiful, responsive websites built with SSR for maximum visibility.',
    icon: Globe,
    href: '/web-design',
    cta: 'Explore Web Design',
  },
  {
    title: 'V.O.I.C.E™',
    description: 'AI visibility optimization so ChatGPT and Claude recommend you.',
    icon: Sparkles,
    href: '/voice',
    cta: 'Discover V.O.I.C.E™',
  },
  {
    title: 'Custom Web Apps',
    description: 'Bespoke tools and applications built to automate your business workflows.',
    icon: Code,
    href: '/web-apps',
    cta: 'Explore Web Apps',
  },
];

interface Review {
  author: string;
  reviewBody: string;
  datePublished: string;
}

interface HomeBelowFoldStaticProps {
  reviews: Review[];
}

/**
 * Static version of below-fold content - NO Framer Motion
 * Used on mobile for better performance (smaller JS bundle)
 */
export function HomeBelowFoldStatic({ reviews }: HomeBelowFoldStaticProps) {
  return (
    <>
      {/* Services Section */}
      <section className="section-white relative overflow-hidden" aria-labelledby="services-heading">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          aria-hidden="true"
          style={{
            backgroundImage: `linear-gradient(rgba(10,27,54,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(10,27,54,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        <div className="container-content text-center relative z-10">
          <h2 id="services-heading" className="text-brand-navy mb-4 text-2xl sm:text-3xl md:text-h2">OUR SERVICES</h2>
          <p className="text-brand-navy/70 mb-12 max-w-2xl mx-auto">
            From stunning web design to AI visibility optimization, we&apos;ve got 
            everything you need to dominate online.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.title}
                  className="group relative p-8 rounded-2xl transition-all duration-300
                    bg-white backdrop-blur-sm
                    border border-brand-navy/10
                    hover:translate-y-[-8px]
                    hover:shadow-[0_0_40px_rgba(236,182,21,0.25)]
                    hover:border-brand-gold/50"
                  style={{ boxShadow: '0 4px 24px rgba(10,27,54,0.08)' }}
                >
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, rgba(236,182,21,0.05) 0%, transparent 50%, rgba(10,27,54,0.02) 100%)',
                    }}
                    aria-hidden="true"
                  />
                  
                  <div className="relative mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-brand-navy/5 
                    group-hover:bg-brand-gold/10 transition-all duration-300 group-hover:scale-110">
                    <IconComponent 
                      className="w-8 h-8 text-brand-navy group-hover:text-brand-gold transition-all duration-300" 
                      aria-hidden="true"
                    />
                  </div>
                  
                  <h3 className="text-brand-navy text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-brand-navy/70 mb-6">{service.description}</p>
                  
                  <Link 
                    href={service.href}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                      bg-brand-gold border border-brand-gold
                      text-brand-navy text-base font-semibold transition-all duration-200 hover:bg-brand-orange hover:border-brand-orange"
                    style={{ boxShadow: '0 4px 12px rgba(236,182,21,0.3)' }}
                  >
                    {service.cta}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-brand-navy to-brand-navy/95 relative overflow-hidden" aria-labelledby="testimonials-heading">
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" aria-hidden="true" />
        
        <div className="container-content relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full px-4 py-2 mb-6">
              <div className="flex" role="img" aria-label="5 star rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold fill-brand-gold" aria-hidden="true" />
                ))}
              </div>
              <span className="text-white font-medium text-sm sm:text-base">6 Five-Star Reviews on Google</span>
            </div>
            <h2 id="testimonials-heading" className="text-white mb-4 text-2xl sm:text-3xl md:text-h2">WHAT OUR CLIENTS SAY</h2>
            <p className="text-white max-w-2xl mx-auto">
              Don&apos;t just take our word for it. Here&apos;s what real businesses say about working with ScopeSite.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <article 
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 
                  hover:bg-white/10 hover:border-brand-gold/30 transition-all duration-300 h-full"
              >
                <div className="flex gap-1 mb-4" role="img" aria-label="5 star rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-brand-gold fill-brand-gold" aria-hidden="true" />
                  ))}
                </div>
                
                <p className="text-white/90 text-sm leading-relaxed mb-4">
                  &ldquo;{review.reviewBody}&rdquo;
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center">
                    <span className="text-brand-gold font-bold text-sm" aria-hidden="true">
                      {review.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{review.author}</p>
                    <p className="text-white/80 text-xs">Google Review</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <a 
              href="https://g.page/r/CRrwXXb-9sE3EAE" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white hover:text-brand-gold transition-colors text-sm"
              aria-label="View all reviews on Google (opens in new tab)"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              View all reviews on Google
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-navy" aria-labelledby="cta-heading">
        <div className="container-content text-center">
          <h2 id="cta-heading" className="text-white mb-4 text-2xl sm:text-3xl md:text-h2">READY TO GET STARTED?</h2>
          <p className="text-white mb-8 max-w-xl mx-auto">
            Get an instant quote for your project or book a free strategy call 
            to discuss your needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/pricing" className="btn-primary">
              Get Instant Quote
            </Link>
            <Link href="/voice" className="btn-secondary-light">
              Learn About V.O.I.C.E™
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomeBelowFoldStatic;

