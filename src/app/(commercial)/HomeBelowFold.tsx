'use client';

import Link from 'next/link';
import { Globe, Sparkles, Code, ArrowRight, Star, FileCode, Brain, Briefcase } from 'lucide-react';
import { motion, Variants } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { FadeInOnScroll, StaggerContainer, StaggerItem } from '@/components/animations';
import { GoogleIcon } from '@/components/icons';
import { VOICE_SCANNER_URL } from '@/lib/voice-urls';

const services = [
  {
    title: 'Websites AI systems trust',
    description:
      'Server-rendered sites that load fast and read clean, so assistants can cite you instead of skipping you.',
    icon: Globe,
    href: '/web-design',
    cta: 'Web design',
  },
  {
    title: 'Recruitment website design',
    description:
      'UK agencies: schema-first builds, live jobs boards, Google for Jobs, and a demo you can click through today.',
    icon: Briefcase,
    href: '/recruitment-website-design',
    cta: 'Recruitment builds',
  },
  {
    title: 'AI visibility scan',
    description: 'Free score across the checks that decide whether AI can see you at all.',
    icon: Sparkles,
    href: '/voice',
    cta: 'Run the scan',
  },
  {
    title: 'Structured data that tells the truth',
    description:
      'Hand-built schema so machines know what you do, where you are, and why you are legitimate.',
    icon: FileCode,
    href: '/schema-markup',
    cta: 'Schema services',
  },
  {
    title: 'Custom web apps',
    description: 'Portals, calculators, booking flows, anything that should live on your domain.',
    icon: Code,
    href: '/web-apps',
    cta: 'Web apps',
  },
  {
    title: 'LLM Brain',
    description:
      'Persistent memory for Claude and ChatGPT. Stop re-briefing every chat. Your database, your rules.',
    icon: Brain,
    href: '/llm-brain',
    cta: 'LLM Brain',
  },
];

const areaLinks = [
  { name: 'Web Design Somerset', href: '/web-design-somerset' },
  { name: 'Web Design Bristol', href: '/web-design-bristol' },
  { name: 'Web Design Bath', href: '/web-design-bath' },
  { name: 'Web Design Glastonbury', href: '/web-design-glastonbury' },
  { name: 'Web Design Burnham-on-Sea', href: '/web-design-burnham-on-sea' },
  { name: 'SEO Somerset', href: '/seo-somerset' },
  { name: 'SEO Bristol', href: '/seo-bristol' },
];

// Animation variants
const cardHoverVariants: Variants = {
  rest: { 
    y: 0,
    boxShadow: '0 4px 24px rgba(10,27,54,0.08)',
  },
  hover: { 
    y: -8,
    boxShadow: '0 0 40px rgba(236,182,21,0.25)',
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

const iconHoverVariants: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

const testimonialVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

interface Review {
  author: string;
  reviewBody: string;
  datePublished: string;
}

interface HomeBelowFoldProps {
  reviews: Review[];
}

export function HomeBelowFold({ reviews }: HomeBelowFoldProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      <section className="bg-brand-navy/5 py-section border-b border-brand-navy/10" aria-labelledby="case-heading">
        <div className="container-content max-w-5xl mx-auto">
          <FadeInOnScroll>
            <h2 id="case-heading" className="text-brand-navy text-2xl sm:text-3xl font-bold mb-4 text-center">
              From invisible to recommended
            </h2>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.05}>
            <p className="text-muted text-center max-w-2xl mx-auto mb-10">
              H4TLT (Hearing 4 The Long Term) had a typical brochure site. After a full Ultra Fast rebuild with
              structured data and AI SEO tuning, they reached number one AI recommendations across ChatGPT,
              Perplexity, Claude, and Gemini for their category.
            </p>
          </FadeInOnScroll>
          <div className="grid md:grid-cols-2 gap-6">
            <FadeInOnScroll delay={0.1}>
              <div className="rounded-2xl border border-brand-navy/15 bg-white p-8 shadow-sm h-full">
                <h3 className="text-brand-navy font-bold text-lg mb-4">Before</h3>
                <ul className="text-muted text-sm space-y-2 list-disc pl-5">
                  <li>Wix-style delivery AI crawlers struggled to parse</li>
                  <li>Little structured data, lots of guesswork for machines</li>
                  <li>Slow loads, weak signals, not in AI answers</li>
                </ul>
              </div>
            </FadeInOnScroll>
            <FadeInOnScroll delay={0.15}>
              <div className="rounded-2xl border-2 border-brand-gold/30 bg-white p-8 shadow-sm h-full">
                <h3 className="text-brand-navy font-bold text-lg mb-4">After</h3>
                <ul className="text-muted text-sm space-y-2 list-disc pl-5">
                  <li>Ultra Fast Next.js, HTML delivered ready to read</li>
                  <li>Full structured data graph, validated</li>
                  <li>AI SEO tuned, number one mentions on major AI platforms</li>
                </ul>
                <Link
                  href="/case-studies/h4tlt"
                  className="inline-flex items-center gap-2 mt-6 text-brand-navy font-semibold hover:text-brand-gold-accessible underline underline-offset-4"
                >
                  Read the case study
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </Link>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-white relative overflow-hidden" aria-labelledby="services-heading">
        <div className="absolute inset-0 opacity-[0.03] bg-grid" aria-hidden="true" />
        
        <div className="container-content text-center relative z-10">
          <FadeInOnScroll>
            <h2 id="services-heading" className="text-brand-navy mb-4 text-2xl sm:text-3xl md:text-h2">
              What we actually do
            </h2>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.1}>
            <p className="text-muted mb-12 max-w-2xl mx-auto">
              Outcomes first. If you want the technical spec sheet, it is on each service page. Here is the
              short version.
            </p>
          </FadeInOnScroll>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto" staggerDelay={0.15}>
            {services.map((service) => (
              <StaggerItem key={service.title}>
                {prefersReducedMotion ? (
                  <div
                    className="group relative p-8 rounded-2xl transition-all duration-300
                      bg-white backdrop-blur-sm
                      border border-brand-navy/10
                      hover:translate-y-[-8px]
                      hover:shadow-[0_0_40px_rgba(236,182,21,0.25)]
                      hover:border-brand-gold/50"
                    style={{
                      boxShadow: '0 4px 24px rgba(10,27,54,0.08)'
                    }}
                  >
                    <ServiceCardContent service={service} />
                  </div>
                ) : (
                  <motion.div
                    className="group relative p-8 rounded-2xl
                      bg-white backdrop-blur-sm
                      border border-brand-navy/10
                      hover:border-brand-gold/50"
                    variants={cardHoverVariants}
                    initial="rest"
                    whileHover="hover"
                  >
                    <ServiceCardContent service={service} isAnimated />
                  </motion.div>
                )}
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-brand-navy to-brand-navy/95 relative overflow-hidden" aria-labelledby="testimonials-heading">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" aria-hidden="true" />
        
        <div className="container-content relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <FadeInOnScroll>
              <div className="inline-flex flex-col sm:flex-row items-center gap-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full px-4 py-2 mb-6">
                <div className="flex" role="img" aria-label="5 star rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold fill-brand-gold" aria-hidden="true" />
                  ))}
                </div>
                <span className="text-white font-medium text-sm sm:text-base">6 five-star reviews on Google</span>
              </div>
            </FadeInOnScroll>
            <FadeInOnScroll delay={0.1}>
              <h2 id="testimonials-heading" className="text-white mb-4 text-2xl sm:text-3xl md:text-h2">
                What clients say
              </h2>
            </FadeInOnScroll>
            <FadeInOnScroll delay={0.2}>
              <p className="text-white max-w-2xl mx-auto">
                Short version: we show up, we explain things in English, and we deliver.
              </p>
            </FadeInOnScroll>
          </div>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
            {reviews.map((review, index) => (
              <StaggerItem key={index}>
                {prefersReducedMotion ? (
                  <TestimonialCard review={review} />
                ) : (
                  <motion.div
                    variants={testimonialVariants}
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <TestimonialCard review={review} />
                  </motion.div>
                )}
              </StaggerItem>
            ))}
          </StaggerContainer>
          
          {/* Google badge */}
          <FadeInOnScroll delay={0.3}>
            <div className="mt-10 text-center">
              <a 
                href="https://g.page/r/CRrwXXb-9sE3EAE" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-3"
              >
                <GoogleIcon />
                View all reviews on Google
              </a>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      <section className="bg-brand-navy py-12" aria-labelledby="areas-heading-below">
        <div className="container-content">
          <FadeInOnScroll>
            <h2 id="areas-heading-below" className="text-white text-xl sm:text-2xl font-bold mb-3 text-center">
              AI-first web design, local roots
            </h2>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.05}>
            <p className="text-white/70 text-center max-w-2xl mx-auto mb-8 text-sm">
              Frome and Somerset first, Bath, Bristol, and nationwide for the right projects.
            </p>
          </FadeInOnScroll>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {areaLinks.map((area) => (
              <Link
                key={area.href}
                href={area.href}
                className="btn block text-center px-3 py-2 rounded-full border-2 border-white/20 bg-white/5 !text-brand-gold font-bold no-underline shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] hover:border-brand-gold/50 hover:shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2),0_0_12px_rgba(236,182,21,0.15)] transition-all duration-300 text-xs drop-shadow-[0_0_6px_rgba(236,182,21,0.4)] whitespace-nowrap"
              >
                {area.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-navy" aria-labelledby="cta-heading">
        <div className="container-content text-center">
          <FadeInOnScroll>
            <h2 id="cta-heading" className="text-white mb-4 text-2xl sm:text-3xl md:text-h2">
              Ready when you are
            </h2>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.1}>
            <p className="text-white mb-8 max-w-xl mx-auto">
              No obligation, no hard sell. Run the free scan or book a call and we will talk honestly about
              whether we are a fit.
            </p>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.2}>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href={VOICE_SCANNER_URL} className="btn-primary" target="_blank" rel="noopener noreferrer">
                Get your free AI visibility scan
              </a>
              <Link href="/book" className="btn-secondary-light">
                Book a discovery call
              </Link>
            </div>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.25}>
            <p className="text-white/50 text-sm mt-8">
              Veteran-owned. Military precision. Zero bullshit.
            </p>
          </FadeInOnScroll>
        </div>
      </section>
    </>
  );
}

// Service card content component
interface ServiceCardContentProps {
  service: typeof services[0];
  isAnimated?: boolean;
}

function ServiceCardContent({ service, isAnimated }: ServiceCardContentProps) {
  const IconComponent = service.icon;
  
  return (
    <>
      {/* Gradient overlay on hover */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(236,182,21,0.05) 0%, transparent 50%, rgba(10,27,54,0.02) 100%)',
        }}
        aria-hidden="true"
      />
      
      {/* Icon */}
      {isAnimated ? (
        <motion.div 
          className="relative mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-brand-navy/5 
            group-hover:bg-brand-gold/10 transition-colors duration-300"
          variants={iconHoverVariants}
        >
          <IconComponent 
            className="w-8 h-8 text-brand-navy group-hover:text-brand-gold transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(236,182,21,0.6)]" 
            aria-hidden="true"
          />
        </motion.div>
      ) : (
        <div 
          className="relative mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-brand-navy/5 
            group-hover:bg-brand-gold/10 transition-all duration-300
            group-hover:scale-110"
        >
          <IconComponent 
            className="w-8 h-8 text-brand-navy group-hover:text-brand-gold transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(236,182,21,0.6)]" 
            aria-hidden="true"
          />
        </div>
      )}
      
      {/* Content */}
      <h3 className="text-brand-navy text-xl font-bold mb-3">{service.title}</h3>
      <p className="text-brand-navy/70 mb-6">{service.description}</p>
      
      {/* CTA Button */}
      <Link 
        href={service.href}
        className="btn inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
          bg-brand-gold border border-brand-gold
          text-brand-navy text-base font-semibold
          transition-all duration-200 hover:bg-brand-orange hover:border-brand-orange no-underline"
        style={{
          boxShadow: '0 4px 12px rgba(236,182,21,0.3)'
        }}
      >
        {service.cta}
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </Link>
    </>
  );
}

// Testimonial card component
interface TestimonialCardProps {
  review: Review;
}

function TestimonialCard({ review }: TestimonialCardProps) {
  return (
    <article 
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 
        hover:bg-white/10 hover:border-brand-gold/30 transition-all duration-300 h-full"
    >
      {/* Stars */}
      <div className="flex gap-1 mb-4" role="img" aria-label="5 star rating">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-brand-gold fill-brand-gold" aria-hidden="true" />
        ))}
      </div>
      
      {/* Review text */}
      <p className="text-white/90 text-sm leading-relaxed mb-4">
        &ldquo;{review.reviewBody}&rdquo;
      </p>
      
      {/* Author */}
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
  );
}

export default HomeBelowFold;

