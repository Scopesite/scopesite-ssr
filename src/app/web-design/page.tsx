'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Zap, 
  Brain, 
  Smartphone, 
  Target, 
  Search, 
  Shield,
  ArrowRight,
  ChevronDown,
  MessageCircle,
  ClipboardList,
  Code,
  CheckCircle,
  Rocket,
  Wrench,
  Briefcase,
  Heart,
  ShoppingCart,
  UtensilsCrossed,
  Building2,
  Check
} from 'lucide-react';

// FAQ Accordion Component for light background
function FAQItem({ question, answer, isOpen, onClick }: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onClick: () => void;
}) {
  return (
    <div className="border-b border-brand-navy/10 last:border-b-0">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-brand-navy font-medium text-lg pr-8">{question}</span>
        <ChevronDown 
          className={`w-6 h-6 text-brand-gold transition-transform duration-300 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? 'max-h-[500px] pb-6' : 'max-h-0'
        }`}
      >
        <p className="text-brand-navy/70 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

// Feature Cards Data
const features = [
  {
    title: 'LIGHTNING FAST',
    description: 'Core Web Vitals optimised from day one. Your visitors won\'t wait around - 53% leave if a page takes longer than 3 seconds to load.',
    icon: Zap,
  },
  {
    title: 'AI-READY',
    description: 'V.O.I.C.E™ optimisation included. Your site won\'t just rank on Google - it\'ll be recommended by ChatGPT, Siri, and every AI assistant that matters.',
    icon: Brain,
  },
  {
    title: 'MOBILE-FIRST',
    description: '60% of your traffic is on mobile. We design for phones first, then scale up - not the other way around like most agencies.',
    icon: Smartphone,
  },
  {
    title: 'CONVERSION FOCUSED',
    description: 'Pretty websites don\'t pay bills. Every element is designed to turn visitors into enquiries, leads, and paying customers.',
    icon: Target,
  },
  {
    title: 'SEO BUILT-IN',
    description: 'Proper technical SEO from the ground up. Not a bolt-on afterthought - baked into the architecture from day one.',
    icon: Search,
  },
  {
    title: 'MILITARY PRECISION',
    description: 'Veteran-owned, deadline-driven, no excuses. We deliver on time, every time, with transparent communication throughout.',
    icon: Shield,
  },
];

// Process Steps Data
const processSteps = [
  {
    number: '01',
    title: 'DISCOVERY CALL',
    description: 'We\'ll chat about your business, your goals, and what\'s not working right now. No sales pitch - just honest advice about what you actually need.',
    duration: '30 minutes',
    icon: MessageCircle,
  },
  {
    number: '02',
    title: 'STRATEGY & PLANNING',
    description: 'We map out your site structure, content requirements, and technical specifications. You\'ll know exactly what\'s being built before we write a single line of code.',
    duration: '1-2 weeks',
    icon: ClipboardList,
  },
  {
    number: '03',
    title: 'DESIGN & DEVELOPMENT',
    description: 'Your site comes to life. We build in stages so you can see progress and give feedback throughout - no big reveal where you hate everything.',
    duration: '2-4 weeks',
    icon: Code,
  },
  {
    number: '04',
    title: 'OPTIMISATION & TESTING',
    description: 'Speed testing, mobile checks, SEO audit, AI visibility scan. We don\'t launch until everything passes our quality checklist.',
    duration: '1 week',
    icon: CheckCircle,
  },
  {
    number: '05',
    title: 'LAUNCH & SUPPORT',
    description: 'Your site goes live. We handle the technical bits, train you on updates, and stick around to make sure everything runs smoothly.',
    duration: 'Ongoing',
    icon: Rocket,
  },
];

// Industries Data
const industries = [
  {
    title: 'Tradespeople & Home Services',
    description: 'Plumbers, electricians, builders - local businesses that need to be found when people search \'near me\'',
    icon: Wrench,
  },
  {
    title: 'Professional Services',
    description: 'Accountants, solicitors, consultants - businesses where trust and credibility matter',
    icon: Briefcase,
  },
  {
    title: 'Health & Wellness',
    description: 'Clinics, therapists, fitness professionals - GDPR compliant, booking-ready websites',
    icon: Heart,
  },
  {
    title: 'E-commerce & Retail',
    description: 'Online shops that need to convert browsers into buyers - Shopify, WooCommerce, custom builds',
    icon: ShoppingCart,
  },
  {
    title: 'Hospitality & Leisure',
    description: 'Restaurants, hotels, venues - reservation systems, menus, event booking',
    icon: UtensilsCrossed,
  },
  {
    title: 'B2B & Manufacturing',
    description: 'Complex businesses with technical products - catalogues, specifications, quote requests',
    icon: Building2,
  },
];

// FAQ Data
const faqItems = [
  {
    question: 'How long does it take to build a website?',
    answer: 'Most projects take 4-8 weeks from kickoff to launch. Simple brochure sites are faster, complex e-commerce takes longer. We\'ll give you an accurate timeline in your quote based on exactly what you need.',
  },
  {
    question: 'Do I need to provide all the content?',
    answer: 'We can work with whatever you\'ve got. If you have content ready, great. If not, we offer copywriting services or can guide you through what\'s needed. Most clients land somewhere in the middle.',
  },
  {
    question: 'Will my website work on mobile?',
    answer: 'Absolutely - we design mobile-first. Over 60% of web traffic is now on phones, so we build for mobile screens first and scale up to desktop. Your site will look great on everything from an iPhone to a widescreen monitor.',
  },
  {
    question: 'What platform do you build on?',
    answer: 'It depends on your needs. We work with WordPress, Wix, Shopify, and custom-coded solutions. We\'ll recommend the best fit based on your requirements, technical ability, and growth plans - not what\'s easiest for us.',
  },
  {
    question: 'Do you help with hosting and domains?',
    answer: 'Yes. We can set up hosting, register domains, configure emails - all the technical bits. It\'s included in our ongoing support, so you don\'t need to become an IT expert overnight.',
  },
  {
    question: 'What happens after my website launches?',
    answer: 'We don\'t disappear. All our packages include ongoing maintenance and support. We handle updates, security, backups, and are on hand when you need changes. You focus on running your business.',
  },
  {
    question: 'Can you help with SEO after the site is built?',
    answer: 'Your site will have solid technical SEO built in from the start. For ongoing SEO work - content, link building, monthly optimisation - we offer separate packages or can recommend trusted partners.',
  },
  {
    question: 'What\'s V.O.I.C.E™ and do I need it?',
    answer: 'V.O.I.C.E™ is our AI visibility system that makes your site findable by ChatGPT, Siri, and other AI assistants - not just Google. It\'s increasingly important as more people use AI for recommendations. We can add it to any package.',
  },
  {
    question: 'What if I\'m not happy with the design?',
    answer: 'We build in stages with checkpoints for feedback, so you\'re never surprised by a finished product you hate. If something\'s not right, we fix it. We\'re not done until you\'re genuinely happy with the result.',
  },
];

// Payment Plan Features
const paymentFeatures = [
  '6, 12, or 24 month payment plans',
  'Fixed monthly payments - no surprises',
  'Includes ongoing maintenance and support',
  'Start building now, pay as you grow',
];

export default function WebDesignPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-section min-h-[70vh] flex items-center">
        <div className="container-content">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-headline text-white mb-4">
              <span className="text-brand-gold">WEBSITES</span> THAT ACTUALLY WORK
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium mb-8">
              Not just pretty - fast, visible, and built to convert
            </p>
            <p className="text-body-lg text-white/70 mb-6 max-w-3xl mx-auto">
              Most UK businesses get burned by web designers who focus on aesthetics over performance. 
              You end up with a beautiful site that loads like a sloth, doesn&apos;t show up on Google, 
              and couldn&apos;t convert a visitor if their life depended on it. We build websites differently.
            </p>
            <p className="text-body text-white/60 mb-10 max-w-3xl mx-auto">
              Every site we build is optimised for speed, search engines, AND the new wave of AI assistants. 
              Whether someone finds you on Google, asks ChatGPT for recommendations, or uses voice search - 
              your website will be ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing" className="btn-primary inline-flex items-center gap-2">
                Get Your Instant Quote
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#process" className="btn-secondary">
                See Our Process
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different Section */}
      <section className="section-white relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(10,27,54,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(10,27,54,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        <div className="container-content relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-brand-navy mb-4 text-xl sm:text-2xl md:text-h2">Web Design Without the Bull$#!t</h2>
            <p className="text-brand-navy/70 max-w-2xl mx-auto">
              What you actually get when you work with us
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
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
                {/* Icon */}
                <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl 
                  bg-brand-navy/5 group-hover:bg-brand-gold/10 transition-all duration-400
                  group-hover:scale-110">
                  <feature.icon className="w-7 h-7 text-brand-navy group-hover:text-brand-gold transition-colors duration-400" />
                </div>
                
                {/* Content */}
                <h3 className="text-brand-navy text-lg font-bold mb-3">{feature.title}</h3>
                <p className="text-brand-navy/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section id="process" className="bg-brand-navy py-section scroll-mt-32">
        <div className="container-content">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">How We Build Your Website</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              From first call to launch - no surprises
            </p>
          </div>
          
          {/* Timeline */}
          <div className="relative max-w-4xl mx-auto">
            {/* Connecting Line - Desktop */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-brand-gold/30 -translate-x-1/2" />
            
            {processSteps.map((step, index) => (
              <div key={step.number} className={`relative flex flex-col lg:flex-row items-center gap-8 mb-12 last:mb-0 ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              }`}>
                {/* Content Card */}
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                  <div className="bg-brand-graphite/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6
                    hover:border-brand-gold/30 transition-all duration-300">
                    <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? 'lg:justify-end' : ''}`}>
                      <step.icon className="w-5 h-5 text-brand-gold" />
                      <h3 className="text-white font-bold">{step.title}</h3>
                    </div>
                    <p className="text-white/60 mb-3">{step.description}</p>
                    <span className="inline-block text-brand-gold text-sm font-medium">
                      {step.duration}
                    </span>
                  </div>
                </div>
                
                {/* Number Circle */}
                <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-brand-gold 
                  flex items-center justify-center font-headline text-brand-navy text-xl
                  shadow-[0_0_30px_rgba(236,182,21,0.4)]">
                  {step.number}
                </div>
                
                {/* Spacer for alternating layout */}
                <div className="flex-1 hidden lg:block" />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link href="/pricing" className="btn-primary inline-flex items-center gap-2">
              Ready to Start? Get Your Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Flexible Payments Section */}
      <section className="section-white relative overflow-hidden">
        {/* Gold accent gradient */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-gold/5 to-transparent" />
        
        <div className="container-content relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-brand-navy mb-4 text-xl sm:text-2xl md:text-h2">Pay Monthly, Spread the Cost</h2>
              <p className="text-brand-navy/70">
                Premium web design without the upfront hit
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-body-lg text-brand-navy/80 mb-6">
                  We know dropping thousands upfront isn&apos;t always realistic - especially when 
                  you&apos;re investing in your business growth. That&apos;s why we offer flexible 
                  payment plans that let you spread the cost over 6, 12, or 24 months.
                </p>
                <p className="text-brand-navy/60 mb-8">
                  No credit checks, no finance companies, no interest. Just straightforward 
                  monthly payments that fit your budget.
                </p>
                
                <ul className="space-y-3 mb-8">
                  {paymentFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-brand-gold flex-shrink-0" />
                      <span className="text-brand-navy/70">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-brand-navy rounded-2xl p-8 text-center"
                style={{
                  boxShadow: '0 0 60px rgba(236,182,21,0.15)'
                }}>
                <h3 className="text-white text-xl font-bold mb-4">See Your Monthly Cost</h3>
                <p className="text-white/60 mb-6">
                  Get an instant quote with exact monthly payment options
                </p>
                <Link 
                  href="/pricing" 
                  className="btn-primary w-full justify-center inline-flex items-center gap-2"
                >
                  Calculate Your Monthly Payment
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="text-white/40 text-sm mt-4">
                  Instant quote • No obligation • See exact monthly costs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Work With Section */}
      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">Built for Businesses Like Yours</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              We specialise in UK service businesses that need results, not excuses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {industries.map((industry) => (
              <div
                key={industry.title}
                className="p-6 rounded-2xl bg-brand-graphite/30 border border-white/10
                  hover:border-brand-gold/30 hover:bg-brand-graphite/50 transition-all duration-300"
              >
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10">
                  <industry.icon className="w-6 h-6 text-brand-gold" />
                </div>
                <h3 className="text-white font-bold mb-2">{industry.title}</h3>
                <p className="text-white/60 text-sm">{industry.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-white/60 mb-4">
              Don&apos;t see your industry? We probably still work with it.
            </p>
            <Link href="/book" className="text-brand-gold hover:text-brand-gold/80 font-medium inline-flex items-center gap-2 transition-colors">
              Get in touch
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-white">
        <div className="container-content">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-brand-navy mb-4 text-xl sm:text-2xl md:text-h2">Frequently Asked Questions</h2>
            <p className="text-brand-navy/70 max-w-2xl mx-auto">
              Straight answers, no waffle
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {faqItems.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-brand-navy py-section relative overflow-hidden">
        {/* Gold accent glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[100px]" />
        
        <div className="container-content relative z-10 text-center">
          <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">Ready to Get a Website That Actually Works?</h2>
          <p className="text-white/70 mb-10 max-w-2xl mx-auto">
            Get your instant quote in under 2 minutes. See exactly what it costs, 
            including monthly payment options.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link href="/pricing" className="btn-primary inline-flex items-center gap-2">
              Get Your Instant Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/book" className="btn-secondary-light">
              Book a Call First
            </Link>
          </div>
          <p className="text-white/50 text-sm">
            No obligation • Transparent pricing • Veteran-owned
          </p>
        </div>
      </section>
    </>
  );
}



