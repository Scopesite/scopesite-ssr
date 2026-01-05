import Link from 'next/link';
import Image from 'next/image';
import { Globe, Sparkles, Code, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-brand-navy text-white min-h-[80vh] overflow-hidden">
        <div className="container-content relative min-h-[80vh]">
          {/* Text Content - Left Side */}
          <div className="relative z-10 flex items-center min-h-[80vh] py-section">
            <div className="text-center md:text-left w-full md:max-w-[55%] lg:max-w-[50%]">
              <div className="badge-gold-lg mb-6 mx-auto md:mx-0">Veteran Owned &amp; Operated</div>
              <h1 className="text-[5.5rem] md:text-display text-white mb-6 leading-[0.95]">
                <span className="text-brand-gold block">WEBSITES</span>
                <span className="block">THAT GET</span>
                <span className="block">FOUND</span>
              </h1>
              <p className="text-body-lg text-white/80 mb-8 max-w-md lg:max-w-lg mx-auto md:mx-0">
                We build AI-optimized websites that rank in both traditional search 
                and AI assistants like ChatGPT and Claude. No bullshit. Just results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/pricing" className="btn-primary">
                  Get Instant Quote
                </Link>
                <Link href="/book" className="btn-secondary">
                  Book Strategy Call
                </Link>
              </div>
            </div>
          </div>
          
          {/* Hero Image - Positioned Right, Anchored Bottom */}
          <div className="hidden md:block absolute bottom-0 right-[-8%] lg:right-[-5%] w-[55%] lg:w-[52%] h-[75%] lg:h-[80%] animate-slide-in-right">
            <Image
              src="/images/scopesite-websites-found-hero-ai.webp"
              alt="AI-optimized websites that get found in search and AI assistants"
              width={2000}
              height={2000}
              className="absolute bottom-0 right-0 w-full h-full object-contain object-right-bottom"
              priority
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-white relative overflow-hidden">
        {/* Subtle background grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(10,27,54,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(10,27,54,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        <div className="container-content text-center relative z-10">
          <h2 className="text-brand-navy mb-4">OUR SERVICES</h2>
          <p className="text-brand-navy/70 mb-12 max-w-2xl mx-auto">
            From stunning web design to AI visibility optimization, we&apos;ve got 
            everything you need to dominate online.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Web Design',
                description: 'Beautiful, responsive websites built with SSR for maximum visibility.',
                icon: Globe,
                href: '/web-design',
              },
              {
                title: 'V.O.I.C.E™',
                description: 'AI visibility optimization so ChatGPT and Claude recommend you.',
                icon: Sparkles,
                href: '/voice',
              },
              {
                title: 'Custom Web Apps',
                description: 'Bespoke tools and applications built to automate your business workflows.',
                icon: Code,
                href: '/web-apps',
              },
            ].map((service) => (
              <div
                key={service.title}
                className="group relative p-8 rounded-2xl transition-all duration-400 ease-out
                  bg-white backdrop-blur-sm
                  border border-brand-navy/10
                  hover:translate-y-[-12px]
                  hover:shadow-[0_0_40px_rgba(236,182,21,0.25)]
                  hover:border-brand-gold/50"
                style={{
                  boxShadow: '0 4px 24px rgba(10,27,54,0.08)'
                }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(236,182,21,0.05) 0%, transparent 50%, rgba(10,27,54,0.02) 100%)',
                  }}
                />
                
                {/* Icon */}
                <div className="relative mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-brand-navy/5 
                  group-hover:bg-brand-gold/10 transition-all duration-400
                  group-hover:scale-110">
                  <service.icon className="w-8 h-8 text-brand-navy group-hover:text-brand-gold transition-all duration-400 group-hover:drop-shadow-[0_0_8px_rgba(236,182,21,0.6)]" />
                </div>
                
                {/* Content */}
                <h3 className="text-brand-navy text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-brand-navy/60 mb-6">{service.description}</p>
                
                {/* CTA Button - Navy glass style */}
                <Link 
                  href={service.href}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                    bg-brand-navy/90 backdrop-blur-sm
                    border border-white/10
                    text-white text-sm font-medium
                    transition-all duration-300"
                  style={{
                    boxShadow: '0 4px 12px rgba(10,27,54,0.3), inset 0 1px 1px rgba(255,255,255,0.1)'
                  }}
                >
                  Learn more
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-navy">
        <div className="container-content text-center">
          <h2 className="text-white mb-4">READY TO GET STARTED?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
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
