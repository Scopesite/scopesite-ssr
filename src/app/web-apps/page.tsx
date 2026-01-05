'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Calculator,
  ClipboardCheck,
  Users,
  Calendar,
  MessageSquare,
  BarChart3,
  Search,
  PenTool,
  Code,
  Rocket,
  ArrowRight,
  ChevronDown,
  X,
  Check,
  Wrench,
  Heart,
  Briefcase,
  ShoppingCart,
  Building,
  PartyPopper
} from 'lucide-react';

// FAQ Accordion Component
function FAQItem({ question, answer, isOpen, onClick }: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onClick: () => void;
}) {
  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-white font-medium text-lg pr-8">{question}</span>
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
        <p className="text-white/70 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

// App Types Data
const appTypes = [
  {
    title: 'ADVANCED QUOTE BUILDERS',
    description: 'Multi-step quote generators with conditional logic, payment term calculations, and instant PDF delivery. Turn tyre-kickers into paying customers with transparent, professional pricing tools.',
    example: 'Used by service businesses to automate pricing',
    icon: Calculator,
  },
  {
    title: 'COMPLIANCE & ASSESSMENT TOOLS',
    description: 'Health & safety audits, regulatory compliance checkers, risk assessments, accessibility audits. Input data, get instant scores and actionable reports.',
    example: 'Built for healthcare, construction, and regulated industries',
    icon: ClipboardCheck,
  },
  {
    title: 'CLIENT PORTALS',
    description: 'Branded dashboards where clients log in, track project progress, upload files, view invoices, and approve work. Kill the email chaos.',
    example: 'Perfect for agencies, consultants, and service providers',
    icon: Users,
  },
  {
    title: 'BOOKING & SCHEDULING SYSTEMS',
    description: 'Beyond basic calendar embeds. Multi-resource booking, staff allocation, equipment scheduling, automated reminders, and payment integration.',
    example: 'Salons, clinics, venues, and hire companies',
    icon: Calendar,
  },
  {
    title: 'AI-POWERED CHATBOTS',
    description: 'Not generic ChatGPT embeds. Chatbots trained on YOUR business, YOUR products, YOUR FAQs. Actually useful customer service that sounds like you.',
    example: '24/7 support without 24/7 staff costs',
    icon: MessageSquare,
  },
  {
    title: 'DATA DASHBOARDS',
    description: 'Pull data from multiple sources, visualise it beautifully, make better decisions. Sales figures, marketing metrics, operational KPIs - all in one place.',
    example: 'For businesses drowning in spreadsheets',
    icon: BarChart3,
  },
];

// Process Steps Data
const processSteps = [
  {
    title: 'DISCOVERY',
    description: 'Tell us what\'s broken. What process takes too long? What\'s held together with spreadsheets? Where do customers drop off? We find the real problem.',
    icon: Search,
  },
  {
    title: 'DESIGN',
    description: 'We map out exactly how your app will work - every screen, every button, every decision point. You\'ll see it before we build it.',
    icon: PenTool,
  },
  {
    title: 'DEVELOP',
    description: 'We build it. Clean code, mobile-responsive, integrated with your existing systems. No black box - you own everything.',
    icon: Code,
  },
  {
    title: 'DEPLOY & SUPPORT',
    description: 'Launch, train your team, and stick around. We don\'t disappear after go-live. When you need changes, we\'re here.',
    icon: Rocket,
  },
];

// Off-the-shelf vs Custom comparison
const offShelfProblems = [
  'Monthly subscriptions that add up forever',
  'Features you don\'t need, missing features you do',
  'Their branding, their limitations, their rules',
  'Data stored on someone else\'s servers',
  '"Almost" works for your workflow',
  'Dependent on their roadmap and pricing changes',
];

const customBenefits = [
  'One-time build, you own it forever',
  'Exactly the features you need, nothing more',
  'Your branding, your rules, your way',
  'Your data, your control, your security',
  'Built around YOUR actual workflow',
  'Evolves when YOU need it to',
];

// Technologies
const technologies = [
  { name: 'React & Next.js', description: 'Fast, scalable frontends' },
  { name: 'Node.js', description: 'Powerful backend logic' },
  { name: 'PostgreSQL & MongoDB', description: 'Reliable data storage' },
  { name: 'Stripe & GoCardless', description: 'Secure payment processing' },
  { name: 'AI Integration', description: 'OpenAI, Claude, custom models' },
  { name: 'Wix Velo', description: 'For Wix-native advanced functionality' },
  { name: 'Fillout & Typeform', description: 'Advanced form logic' },
  { name: 'Zapier & Make', description: 'Automation and integrations' },
  { name: 'Railway & Vercel', description: 'Reliable hosting' },
];

// Use Cases
const useCases = [
  {
    industry: 'TRADESPEOPLE',
    description: 'Job costing calculator that factors in materials, labour, travel, and margin - spits out a professional quote PDF in seconds',
    icon: Wrench,
  },
  {
    industry: 'HEALTHCARE',
    description: 'Patient intake forms with conditional logic, consent collection, appointment booking, and secure record storage',
    icon: Heart,
  },
  {
    industry: 'PROFESSIONAL SERVICES',
    description: 'Client portal with project milestones, document approval workflows, and integrated invoicing',
    icon: Briefcase,
  },
  {
    industry: 'E-COMMERCE',
    description: 'Product configurator that lets customers build custom items with real-time pricing updates',
    icon: ShoppingCart,
  },
  {
    industry: 'PROPERTY',
    description: 'Rental yield calculator, property comparison tool, or tenant application system with reference checking',
    icon: Building,
  },
  {
    industry: 'EVENTS',
    description: 'Registration system with ticket tiers, dietary requirements, session selection, and automated confirmation emails',
    icon: PartyPopper,
  },
];

// FAQ Data
const faqItems = [
  {
    question: 'How much does a custom web app cost?',
    answer: 'It depends entirely on complexity. A simple calculator might be £1,500-3,000. A full client portal with authentication could be £5,000-15,000+. We scope every project individually and give you a fixed quote before starting - no surprises.',
  },
  {
    question: 'How long does it take to build?',
    answer: 'Simple tools take 2-4 weeks. Complex applications with multiple integrations can take 2-3 months. We\'ll give you a realistic timeline based on your specific requirements.',
  },
  {
    question: 'Will I own the code?',
    answer: 'Yes. 100%. We build it, you own it. No licensing fees, no ongoing royalties. It\'s yours.',
  },
  {
    question: 'Can you integrate with our existing systems?',
    answer: 'Usually, yes. We work with most CRMs, payment processors, accounting software, and third-party APIs. If there\'s an API, we can probably connect to it.',
  },
  {
    question: 'Do I need technical knowledge to use it?',
    answer: 'No. We build admin interfaces that anyone can use. If you can use Facebook, you can use what we build. We also provide training and documentation.',
  },
  {
    question: 'What if I need changes after launch?',
    answer: 'We offer ongoing support packages, or you can pay for changes as needed. Because you own the code, you could also hire any developer to modify it - you\'re not locked in.',
  },
  {
    question: 'Can you rebuild something we already have but better?',
    answer: 'Absolutely. If you\'ve got a clunky tool that\'s frustrating your team or customers, we can rebuild it properly. Often costs less than you\'d think.',
  },
  {
    question: 'What if I\'m not sure exactly what I need?',
    answer: 'That\'s normal. Book a discovery call and we\'ll help you figure it out. Sometimes what you think you need and what you actually need are different - we\'ll be honest about that.',
  },
];

export default function WebAppsPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-section min-h-[70vh] flex items-center">
        <div className="container-content">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-headline text-white mb-4">
              <span className="text-brand-gold">CUSTOM WEB APPS</span> THAT ACTUALLY DO SOMETHING
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium mb-8">
              Beyond websites - functional tools that automate, calculate, and simplify
            </p>
            <p className="text-body-lg text-white/70 mb-6 max-w-3xl mx-auto">
              Most web agencies stop at pretty pages. We build the tools your business actually needs - 
              quote calculators that close deals, compliance checkers that save hours, client portals 
              that kill email chaos. If you&apos;ve got a process that&apos;s currently held together with 
              spreadsheets and prayers, we can fix that.
            </p>
            <p className="text-body text-white/60 mb-10 max-w-3xl mx-auto">
              Every app we build is designed for YOUR workflow, YOUR customers, and YOUR specific 
              requirements. No off-the-shelf plugins that almost work. No compromise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="btn-primary inline-flex items-center gap-2">
                Discuss Your Project
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#examples" className="btn-secondary">
                See What We Build
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What We Build Section */}
      <section id="examples" className="section-white relative overflow-hidden scroll-mt-32">
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
            <h2 className="text-brand-navy mb-4 text-xl sm:text-2xl md:text-h2">Tools That Solve Real Problems</h2>
            <p className="text-brand-navy/70 max-w-2xl mx-auto">
              Not features for the sake of features - solutions that save time and make money
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {appTypes.map((app) => (
              <div
                key={app.title}
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
                  <app.icon className="w-7 h-7 text-brand-navy group-hover:text-brand-gold transition-colors duration-400" />
                </div>
                
                {/* Content */}
                <h3 className="text-brand-navy text-lg font-bold mb-3">{app.title}</h3>
                <p className="text-brand-navy/60 mb-4">{app.description}</p>
                <p className="text-brand-navy/50 text-sm font-medium">{app.example}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">From Problem to Solution</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              We don&apos;t just code - we solve
            </p>
          </div>
          
          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {processSteps.map((step, index) => (
              <div key={step.title} className="relative">
                {/* Connector line - desktop only */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-brand-gold/30 -translate-y-1/2 z-0" />
                )}
                
                <div className="relative z-10 text-center">
                  {/* Icon Circle */}
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full 
                    bg-brand-graphite border-2 border-brand-gold/50 mb-6
                    shadow-[0_0_30px_rgba(236,182,21,0.2)]">
                    <step.icon className="w-8 h-8 text-brand-gold" />
                  </div>
                  
                  {/* Step Number */}
                  <div className="text-brand-gold text-sm font-bold mb-2">STEP {index + 1}</div>
                  
                  {/* Content */}
                  <h3 className="text-white font-bold mb-3">{step.title}</h3>
                  <p className="text-white/60 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/book" className="btn-primary inline-flex items-center gap-2">
              Let&apos;s Talk About Your Project
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Custom vs Off-the-Shelf Section */}
      <section className="section-white">
        <div className="container-content">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-brand-navy mb-4 text-xl sm:text-2xl md:text-h2">Why Build Custom?</h2>
            <p className="text-brand-navy/70 max-w-2xl mx-auto">
              When plugins and SaaS tools aren&apos;t cutting it
            </p>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            {/* VS Badge - desktop only */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
              w-12 h-12 rounded-full bg-brand-navy text-white font-bold text-sm
              items-center justify-center z-10 shadow-lg">
              VS
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Off-the-shelf column */}
              <div className="p-10 rounded-2xl bg-red-50 border border-red-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <X className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="text-brand-navy font-bold text-xl">OFF-THE-SHELF TOOLS</h3>
                </div>
                <ul className="space-y-4">
                  {offShelfProblems.map((problem) => (
                    <li key={problem} className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-brand-navy/70">{problem}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Custom column */}
              <div className="p-10 rounded-2xl bg-emerald-50 border border-emerald-200"
                style={{
                  boxShadow: '0 0 40px rgba(16,185,129,0.15)'
                }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Check className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h3 className="text-brand-navy font-bold text-xl">CUSTOM BUILT FOR YOU</h3>
                </div>
                <ul className="space-y-4">
                  {customBenefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-brand-navy/70">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/book" className="btn-primary inline-flex items-center gap-2">
              Get a Quote for Your Custom App
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">Built on Solid Foundations</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Modern tech stack, future-proof solutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto mb-8">
            {technologies.map((tech) => (
              <div 
                key={tech.name}
                className="p-5 rounded-xl bg-brand-graphite/50 border border-white/10
                  hover:border-brand-gold/30 transition-colors duration-300"
              >
                <div className="text-white font-bold mb-1">{tech.name}</div>
                <div className="text-white/50 text-sm">{tech.description}</div>
              </div>
            ))}
          </div>
          
          <p className="text-center text-white/50 text-sm">
            We choose the right tools for YOUR project - not whatever&apos;s trendy
          </p>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="section-white">
        <div className="container-content">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-brand-navy mb-4 text-xl sm:text-2xl md:text-h2">What Could You Build?</h2>
            <p className="text-brand-navy/70 max-w-2xl mx-auto">
              Real problems we&apos;ve solved for businesses like yours
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {useCases.map((useCase) => (
              <div
                key={useCase.industry}
                className="p-6 rounded-2xl bg-white border border-brand-navy/10
                  hover:border-brand-gold/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-gold/10 flex items-center justify-center">
                    <useCase.icon className="w-5 h-5 text-brand-gold" />
                  </div>
                  <h3 className="text-brand-navy font-bold">{useCase.industry}</h3>
                </div>
                <p className="text-brand-navy/60 text-sm">{useCase.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-brand-navy/60 mb-4">
              Don&apos;t see your industry? Tell us what you need.
            </p>
            <Link href="/book" className="text-brand-navy font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all">
              Get in touch
              <ArrowRight className="w-4 h-4 text-brand-gold" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">Frequently Asked Questions</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Straight answers about custom development
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
      <section className="section-white">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <div className="bg-brand-navy rounded-2xl p-10 text-center"
              style={{
                boxShadow: '0 0 60px rgba(236,182,21,0.15)'
              }}>
              <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">Got a Process That Needs Fixing?</h2>
              <p className="text-white/70 mb-8 max-w-xl mx-auto">
                Tell us what&apos;s broken. We&apos;ll tell you if we can fix it - and what it would cost.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                <Link href="/book" className="btn-primary inline-flex items-center gap-2">
                  Book a Discovery Call
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/book" className="btn-secondary-light">
                  Send Us a Brief
                </Link>
              </div>
              <p className="text-white/50 text-sm">
                No obligation • Fixed-price quotes • Veteran-owned
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

