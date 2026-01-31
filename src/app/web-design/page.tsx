'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { 
  Zap, 
  Brain, 
  Code2,
  Globe,
  Shield,
  Cpu,
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
  Check,
  ExternalLink,
  Server,
  Activity,
  HardHat,
  Factory
} from 'lucide-react';
import { 
  AnimatedCounter, 
  TypeWriter, 
  FadeInOnScroll, 
  StaggerContainer, 
  StaggerItem,
  LighthouseGauge,
  CSRCodeBlock,
  SSRCodeBlock,
  SchemaVisualization
} from '@/components/animations';
import { SpeedTestComparison } from '@/components/SpeedTestComparison';

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
        <p className="text-muted leading-relaxed whitespace-pre-line">{answer}</p>
      </div>
    </div>
  );
}

// Feature Cards Data - Outcome-focused, not tech-focused
const features = [
  {
    title: 'LOADS INSTANTLY',
    description: 'Your site loads in under half a second - among the fastest business websites in the UK. Visitors see your content before they\'ve finished blinking. Most competitors\' sites take 4-8 seconds. That gap costs them customers.',
    icon: Zap,
    stat: '0.5',
    statLabel: 'seconds',
  },
  {
    title: 'VISIBLE TO AI ASSISTANTS',
    description: 'AEO (Answer Engine Optimisation) built in from day one. When someone asks ChatGPT, Siri, or Perplexity for a recommendation in your industry, your site is readable and citable. Most of your competitors\' sites aren\'t.',
    icon: Brain,
    stat: '4+',
    statLabel: 'AI platforms',
  },
  {
    title: 'SEARCH ENGINES UNDERSTAND YOU',
    description: 'AI SEO that actually works. Your business name, services, opening hours, reviews, location - all structured so Google and AI assistants get it right. No wrong phone numbers. No outdated info. Automatically.',
    icon: Code2,
  },
  {
    title: 'YOU CAN UPDATE IT YOURSELF',
    description: 'Add blog posts, update services, change team bios - all from a clean editor that\'s actually pleasant to use. No WordPress plugin nightmares. No calling us for every small change.',
    icon: Server,
  },
  {
    title: 'FAST FROM ANYWHERE',
    description: 'AEO-focused websites need speed. Your site loads at the same speed whether your customer is in Somerset, central London, or checking on their phone in a bad signal area. Same speed. Every time.',
    icon: Globe,
    stat: '300+',
    statLabel: 'edge locations',
  },
  {
    title: 'BUILT FOR WHERE SEARCH IS GOING',
    description: 'AI SEO isn\'t the future - it\'s now. AI assistants are answering more questions than ever. Your site won\'t need rebuilding when the next shift happens - it\'s already there.',
    icon: Shield,
  },
];

// Process Steps Data with animation types
const processSteps = [
  {
    number: '01',
    title: 'DISCOVERY CALL',
    description: 'We\'ll chat about your business, your goals, and what\'s not working right now. No sales pitch - just honest advice about what you actually need.',
    duration: '30 minutes',
    icon: MessageCircle,
    animation: 'ring' as const,
  },
  {
    number: '02',
    title: 'STRATEGY & PLANNING',
    description: 'We map out your site structure, content requirements, and technical specifications. You\'ll know exactly what\'s being built before we write a single line of code.',
    duration: '1-2 weeks',
    icon: ClipboardList,
    animation: 'write' as const,
  },
  {
    number: '03',
    title: 'DESIGN & DEVELOPMENT',
    description: 'Your site comes to life in Next.js. We build in stages so you can see progress and give feedback throughout - no big reveal where you hate everything.',
    duration: '2-4 weeks',
    icon: Code,
    animation: 'type' as const,
  },
  {
    number: '04',
    title: 'OPTIMISATION & TESTING',
    description: 'Lighthouse audits, mobile checks, schema validation, AI crawler tests. We don\'t launch until every metric hits our quality threshold.',
    duration: '1 week',
    icon: CheckCircle,
    animation: 'check' as const,
  },
  {
    number: '05',
    title: 'LAUNCH & SUPPORT',
    description: 'Your site goes live on Vercel\'s edge network. We handle deployment, train you on the CMS, and stick around to make sure everything runs smoothly.',
    duration: 'Ongoing',
    icon: Rocket,
    animation: 'launch' as const,
  },
];

// Animation variants for process icons
const iconAnimations = {
  ring: {
    rotate: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2 }
  },
  write: {
    y: [0, -2, 0],
    transition: { duration: 0.3, repeat: Infinity, repeatDelay: 0.5 }
  },
  type: {
    opacity: [1, 0.5, 1],
    transition: { duration: 0.8, repeat: Infinity }
  },
  check: {
    scale: [1, 1.2, 1],
    transition: { duration: 0.6, repeat: Infinity, repeatDelay: 1.5 }
  },
  launch: {
    y: [0, -3, 0],
    rotate: [0, -5, 5, 0],
    transition: { duration: 1, repeat: Infinity, repeatDelay: 1 }
  },
};

// Industries Data
const industries = [
  {
    title: 'Legal & Financial',
    description: 'Solicitors, accountants, wealth managers - where your website is the first thing clients check before calling',
    icon: Briefcase,
  },
  {
    title: 'B2B Professional Services',
    description: 'Marketing agencies, sales consultancies, B2B service providers - where a shit website costs you the client before you even speak to them',
    icon: Building2,
  },
  {
    title: 'Health & Wellness',
    description: 'Clinics, therapists, private practices - GDPR compliant, booking-ready, built to convert browsers into patients',
    icon: Heart,
  },
  {
    title: 'E-commerce & Retail',
    description: 'Online shops losing £thousands to slow load times - we fix that',
    icon: ShoppingCart,
  },
  {
    title: 'Hospitality & Leisure',
    description: 'Restaurants, hotels, venues - menus, bookings, events - all working seamlessly',
    icon: UtensilsCrossed,
  },
  {
    title: 'Construction & Development',
    description: 'Builders, developers, contractors - project portfolios, compliance docs, tenders - built to win you the big contracts',
    icon: HardHat,
  },
];

// FAQ Data - buyer anxiety first, tech questions last
const faqItems = [
  {
    question: 'How long does it take to build a website?',
    answer: 'Most projects take 4-8 weeks from kickoff to launch. Simple brochure sites are faster; complex builds with custom features take longer. We\'ll give you an accurate timeline in your quote — and we stick to it.',
  },
  {
    question: 'How much does a website cost?',
    answer: 'Our websites start from £8,000 for established businesses. We also offer monthly payment plans with no credit checks and no interest — spreading the cost over 6, 12, or 24 months. You\'ll get an instant quote in under 2 minutes on our pricing page.',
  },
  {
    question: 'What if I\'m not happy with the design?',
    answer: 'We build in stages with feedback checkpoints, so you\'re never surprised by a finished product you hate. If something\'s not right, we fix it. We\'re not done until you\'re genuinely happy — that\'s not a slogan, it\'s how we work.',
  },
  {
    question: 'What happens after my website launches?',
    answer: 'We don\'t disappear. All packages include ongoing maintenance, security patches, performance monitoring, and support when you need changes. You focus on your business; we keep your site running perfectly.',
  },
  {
    question: 'Do I need to provide all the content?',
    answer: 'We work with whatever you\'ve got. Content ready? Great. Nothing prepared? We offer copywriting services or can guide you through exactly what\'s needed. Most clients land somewhere in the middle.',
  },
  {
    question: 'Will my website work on mobile?',
    answer: 'We design mobile-first — over 60% of traffic is on phones now. Your site will look and perform brilliantly on everything from an iPhone SE to a 4K monitor.',
  },
  {
    question: 'What about hosting and domains?',
    answer: 'Included. Your site runs on Vercel\'s global edge network — the same infrastructure behind Stripe, Notion, and Nike. We handle domains, SSL certificates, and ongoing maintenance. No hidden hosting fees.',
  },
  {
    question: 'Can you help with SEO and AI visibility?',
    answer: 'Every site has bulletproof technical SEO built in — proper meta tags, structured data, XML sitemaps, optimised images, fast load times. For ongoing content strategy and getting recommended by ChatGPT, Claude, and Perplexity, check out our V.O.I.C.E™ service.',
  },
  {
    question: 'What technology do you use and why does it matter?',
    answer: 'We build with Next.js and deploy on Vercel\'s edge network. Unlike WordPress or Wix sites, ours are Server-Side Rendered — meaning AI crawlers can actually read your content. This is why our clients show up when someone asks ChatGPT for recommendations. The tech matters, but only because of what it delivers: speed, visibility, and results.',
  },
];

// Payment Plan Features
const paymentFeatures = [
  '6, 12, or 24 month payment plans',
  'Fixed monthly payments - no surprises',
  'Includes ongoing maintenance and support',
  'Start building now, pay as you grow',
];

// Technical metrics with comparisons
const technicalMetrics = [
  { label: 'First Contentful Paint', value: '0.3', unit: 's', description: 'Your content appears in 0.3s - most sites take 2-4 seconds' },
  { label: 'Largest Contentful Paint', value: '0.6', unit: 's', description: 'Main content loads in 0.6s - competitors average 4+ seconds' },
  { label: 'Time to First Byte', value: '<100', unit: 'ms', description: 'Server responds in under 100ms - most sites take 500ms+' },
  { label: 'Cumulative Layout Shift', value: '0', unit: '', description: 'Zero layout shift - no annoying content jumping' },
];

export default function WebDesignPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const processRef = useRef<HTMLDivElement>(null);
  const processInView = useInView(processRef, { once: true, margin: '-100px' });

  return (
    <>
      {/* Hero Section with animated background */}
      <section className="bg-brand-navy text-white py-section min-h-[85vh] flex items-center relative overflow-hidden">
        {/* Animated grid background */}
        <div 
          className="absolute inset-0 opacity-[0.03] animate-grid-flow"
          style={{
            backgroundImage: `linear-gradient(rgba(236,182,21,0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(236,182,21,0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Gradient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-brand-gold/10 rounded-full blur-[150px] animate-glow-pulse" />
        
        <div className="container-content relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Performance Badge */}
            <FadeInOnScroll delay={0.2}>
              <div className="inline-flex items-center gap-3 bg-brand-gold/10 border border-brand-gold/30 rounded-full px-5 py-2 mb-8">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand-gold" />
                  <span className="text-brand-gold font-medium text-sm">Faster than 99% of UK business websites</span>
                </div>
              </div>
            </FadeInOnScroll>
            
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-headline text-white mb-4">
              <span className="text-brand-gold block mb-2">
                <TypeWriter 
                  text="WEBSITES THAT GET FOUND" 
                  speed={60} 
                  delay={200}
                />
              </span>
              <span className="block">BY GOOGLE AND BY AI</span>
            </h1>
            
            <FadeInOnScroll delay={0.8}>
              <p className="text-xl md:text-2xl text-white/90 font-medium mb-6">
                Built for how people actually search in 2026. Your customers are asking ChatGPT, Siri, and Perplexity for recommendations. Our sites show up.
              </p>
            </FadeInOnScroll>
            
            <FadeInOnScroll delay={1}>
              <p className="text-body-lg text-white/70 mb-10 max-w-3xl mx-auto">
                Most business websites were built for Google circa 2018. They still rank - sometimes. 
                But when someone asks an AI assistant &apos;who&apos;s the best [your service] near me?&apos;, 
                your site doesn&apos;t exist. We build websites that work for both.
              </p>
            </FadeInOnScroll>
            
            <FadeInOnScroll delay={1.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pricing" className="btn-primary inline-flex items-center gap-2 group">
                  Get Your Instant Quote
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <a href="#why-ssr" className="btn-secondary">
                  See The Difference
                </a>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Speed Test - Make them feel the pain early */}
      <section className="section-white border-b border-brand-navy/10">
        <div className="container-content">
          <FadeInOnScroll>
            <div className="text-center mb-8">
              <h2 className="text-brand-navy mb-4 text-xl sm:text-2xl md:text-h2">How Fast Is Your Website?</h2>
              <p className="text-brand-navy/70 max-w-2xl mx-auto">
                Test your current site against our standards. Takes about 30 seconds.
              </p>
            </div>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.2}>
            <div className="max-w-3xl mx-auto">
              <SpeedTestComparison />
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Built for Businesses Like Yours - Moved up for buyer recognition */}
      <section className="section-white">
        <div className="container-content">
          <FadeInOnScroll>
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-brand-navy mb-4 text-xl sm:text-2xl md:text-h2">Built for Businesses Like Yours</h2>
              <p className="text-brand-navy/70 max-w-2xl mx-auto">
                Established UK businesses investing £8-15K in a website that actually works
              </p>
            </div>
          </FadeInOnScroll>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12" staggerDelay={0.1}>
            {industries.map((industry) => (
              <StaggerItem key={industry.title}>
                <div
                  className="p-8 rounded-2xl bg-white border-l-4 border-l-brand-gold border border-brand-navy/10
                    shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-brand-gold/40 
                    transition-all duration-300 h-full"
                >
                  <div className="mb-5 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10">
                    <industry.icon className="w-7 h-7 text-brand-gold" />
                  </div>
                  <h3 className="text-brand-navy font-bold text-lg mb-3">{industry.title}</h3>
                  <p className="text-brand-navy/70 leading-relaxed">{industry.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          
          <FadeInOnScroll>
            <div className="text-center">
              <p className="text-brand-navy/60 mb-4">
                Don&apos;t see your industry? We probably still work with it.
              </p>
              <Link href="/book" className="text-brand-gold hover:text-brand-gold/80 font-medium inline-flex items-center gap-2 transition-colors">
                Get in touch
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Two Front Doors Section */}
      <section id="why-ssr" className="section-white relative overflow-hidden scroll-mt-32">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(10,27,54,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(10,27,54,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        <div className="container-content relative z-10">
          <FadeInOnScroll>
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-brand-navy mb-4 text-xl sm:text-2xl md:text-h2">Your Website Has Two Front Doors</h2>
              <p className="text-brand-navy/70 max-w-2xl mx-auto">
                Is one of them locked?
              </p>
            </div>
          </FadeInOnScroll>
          
          {/* Two Front Doors Analogy */}
          <FadeInOnScroll delay={0.2}>
            <div className="max-w-4xl mx-auto mb-12">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Door 1 - Google */}
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
                  <div className="text-6xl mb-4">🚪✨</div>
                  <h3 className="text-brand-navy font-bold text-xl mb-3">The Google Door</h3>
                  <p className="text-brand-navy/70">
                    Lights on, door open, welcome mat out. Google&apos;s been visiting for years - most websites handle this fine.
                  </p>
                  <div className="mt-4 inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                    ✓ Usually Open
                  </div>
                </div>
                
                {/* Door 2 - AI */}
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
                  <div className="text-6xl mb-4">🚫🚪</div>
                  <h3 className="text-brand-navy font-bold text-xl mb-3">The AI Door</h3>
                  <p className="text-brand-navy/70">
                    Shutters down, lights off. When ChatGPT or Perplexity knocks, they get a locked door and an empty room.
                  </p>
                  <div className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    ✗ Closed on Most Sites
                  </div>
                </div>
              </div>
            </div>
          </FadeInOnScroll>
          
          {/* The Point */}
          <FadeInOnScroll delay={0.3}>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-brand-navy text-lg mb-4">
                <strong>Google and AI assistants visit your site differently.</strong> Most websites only open the door for Google. 
                When ChatGPT or Perplexity knocks, they get a locked door and an empty room.
              </p>
              <p className="text-brand-gold font-bold text-xl">
                Our sites open both doors, every time.
              </p>
            </div>
          </FadeInOnScroll>
          
          {/* Technical Details Collapsible */}
          <FadeInOnScroll delay={0.4}>
            <div className="max-w-4xl mx-auto">
              <details className="group bg-brand-navy/[0.02] border border-brand-navy/10 rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-brand-navy/[0.04] transition-colors">
                  <div className="flex items-center gap-3">
                    <Code2 className="w-5 h-5 text-brand-gold" />
                    <span className="text-brand-navy font-medium">For the technically curious - see why this works</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-brand-navy/50 transition-transform group-open:rotate-180" />
                </summary>
                <div className="p-6 pt-0 border-t border-brand-navy/10">
                  <p className="text-brand-navy/70 mb-6 text-center">
                    The technical difference: Server-Side Rendering vs Client-Side Rendering
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-brand-navy/60 mb-3 text-center">❌ Client-Side Rendered (Wix/WordPress)</p>
                      <CSRCodeBlock className="h-full" />
                    </div>
                    <div>
                      <p className="text-sm text-brand-navy/60 mb-3 text-center">✅ Server-Side Rendered (Next.js)</p>
                      <SSRCodeBlock className="h-full" delay={500} />
                    </div>
                  </div>
                </div>
              </details>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="bg-brand-navy py-section relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(236,182,21,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        <div className="container-content relative z-10">
          <FadeInOnScroll>
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">What You Actually Get</h2>
              <p className="text-white-muted max-w-2xl mx-auto">Every site we build includes these as standard</p>
            </div>
          </FadeInOnScroll>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
            {features.map((feature) => (
              <StaggerItem key={feature.title}>
                <div className="group card-dark-hover h-full">
                  <div className="mb-6 icon-box w-14 h-14 bg-brand-gold/10 group-hover:bg-brand-gold/20">
                    <feature.icon className="w-7 h-7 text-brand-gold" />
                  </div>
                  {feature.stat && (
                    <div className="absolute top-6 right-6 flex items-center gap-1">
                      <span className="text-2xl font-bold text-brand-gold">{feature.stat}</span>
                      <span className="text-xs text-white/50">{feature.statLabel}</span>
                    </div>
                  )}
                  <h3 className="text-white text-lg font-bold mb-3">{feature.title}</h3>
                  <p className="text-white-light">{feature.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Technical Proof Section */}
      <section className="section-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-brand-navy/[0.02] to-transparent" />
        
        <div className="container-content relative z-10">
          <FadeInOnScroll>
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-brand-navy mb-4 text-xl sm:text-2xl md:text-h2">Technical Proof</h2>
              <p className="text-muted max-w-2xl mx-auto">Real numbers. Exposed to scrutiny. Not just promises.</p>
            </div>
          </FadeInOnScroll>
          
          {/* Lighthouse Gauges */}
          <FadeInOnScroll delay={0.2}>
            <div className="bg-brand-navy rounded-2xl p-8 md:p-12 mb-12">
              <h3 className="text-white text-center font-bold mb-2">Lighthouse Scores</h3>
              <p className="text-white/60 text-center text-sm mb-8">
                Lighthouse is Google&apos;s own website quality test. 100 is the maximum score. Most UK business websites score between 30 and 60.
              </p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                <LighthouseGauge score={100} label="Performance" delay={0} />
                <LighthouseGauge score={100} label="Accessibility" delay={0.2} />
                <LighthouseGauge score={100} label="Best Practices" delay={0.4} />
                <LighthouseGauge score={100} label="SEO" delay={0.6} />
              </div>
              <p className="text-center text-white/50 text-sm mt-8">
                Actual scores from scopesite.co.uk - 
                <a 
                  href="https://pagespeed.web.dev/analysis/https-scopesite-co-uk/your-report-id" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-gold hover:underline ml-1 inline-flex items-center gap-1"
                >
                  verify on PageSpeed Insights
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </FadeInOnScroll>
          
          {/* Core Web Vitals */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" staggerDelay={0.1}>
            {technicalMetrics.map((metric) => (
              <StaggerItem key={metric.label}>
                <div className="bg-brand-navy/[0.03] border border-brand-navy/10 rounded-xl p-6 text-center
                  hover:border-brand-gold/30 hover:bg-brand-gold/[0.02] transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-bold text-brand-navy mb-1">
                    <AnimatedCounter 
                      value={parseFloat(metric.value.replace('<', ''))} 
                      suffix={metric.unit}
                      prefix={metric.value.includes('<') ? '<' : ''}
                      decimals={metric.value.includes('.') ? 1 : 0}
                    />
                  </div>
                  <div className="text-brand-navy font-medium mb-2">{metric.label}</div>
                  <div className="text-brand-navy/50 text-sm">{metric.description}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          
          {/* Schema Visualization */}
          <FadeInOnScroll delay={0.3}>
            <div className="bg-brand-navy rounded-2xl p-8 md:p-12">
              <p className="text-white/60 text-center text-sm mb-6">
                This is how Google and AI assistants understand your business — every entity connected and validated.
              </p>
              <SchemaVisualization />
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="bg-brand-navy py-16 relative overflow-hidden">
        <div className="container-content relative z-10">
          <FadeInOnScroll>
            <div className="text-center mb-8">
              <h3 className="text-white font-bold mb-2">Built With Industry-Leading Technology</h3>
              <p className="text-white/50 text-sm mb-4">The same stack trusted by</p>
              {/* Trusted By Logos */}
              <div className="flex justify-center items-center gap-8 md:gap-12">
                {/* Stripe */}
                <div className="opacity-40 hover:opacity-70 transition-opacity">
                  <img 
                    src="/images/stripe_logo_webdesign_page.svg" 
                    alt="Stripe" 
                    className="h-12 w-auto"
                  />
                </div>
                {/* Notion */}
                <div className="opacity-40 hover:opacity-70 transition-opacity">
                  <svg className="h-10 w-auto text-white" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M6.017 4.313l55.333 -4.087c6.797 -0.583 8.543 -0.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 0.193 -6.023 -0.39 -8.16 -3.113L3.3 79.94c-2.333 -3.113 -3.3 -5.443 -3.3 -8.167V11.113c0 -3.497 1.553 -6.413 6.017 -6.8z"/>
                    <path fill="#0A1B36" d="M61.35 0.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723 0.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257 -3.89c5.433 -0.387 6.99 -2.917 6.99 -7.193V20.64c0 -2.21 -0.873 -2.847 -3.443 -4.733L74.167 3.143c-4.273 -3.107 -6.02 -3.5 -12.817 -2.917zM25.92 19.523c-5.247 0.353 -6.437 0.433 -9.417 -1.99L8.927 11.507c-0.77 -0.78 -0.383 -1.753 1.557 -1.947l53.193 -3.887c4.467 -0.39 6.793 1.167 8.54 2.527l9.123 6.61c0.39 0.197 1.36 1.36 0.193 1.36l-54.933 3.307 -0.68 0.047zM19.803 88.3V30.367c0 -2.53 0.777 -3.697 3.103 -3.893L86 22.78c2.14 -0.193 3.107 1.167 3.107 3.693v57.547c0 2.53 -0.39 4.67 -3.883 4.863l-60.377 3.5c-3.493 0.193 -5.043 -0.97 -5.043 -4.083zm59.6 -54.827c0.387 1.75 0 3.5 -1.75 3.7l-2.91 0.577v42.773c-2.527 1.36 -4.853 2.137 -6.797 2.137 -3.107 0 -3.883 -0.973 -6.21 -3.887l-19.03 -29.94v28.967l6.02 1.363s0 3.5 -4.857 3.5l-13.39 0.777c-0.39 -0.78 0 -2.723 1.357 -3.11l3.497 -0.97v-38.3L30.48 40.667c-0.39 -1.75 0.58 -4.277 3.3 -4.473l14.367 -0.967 19.8 30.327v-26.83l-5.047 -0.58c-0.39 -2.143 1.163 -3.7 3.103 -3.89l13.4 -0.78z"/>
                  </svg>
                </div>
                {/* Nike */}
                <div className="opacity-40 hover:opacity-70 transition-opacity">
                  <img 
                    src="/images/ike_tick_webdesign_page.svg" 
                    alt="Nike" 
                    className="h-9 w-auto"
                  />
                </div>
              </div>
            </div>
          </FadeInOnScroll>
          
          <FadeInOnScroll delay={0.2}>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              {/* Next.js */}
              <motion.div 
                className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 group cursor-pointer"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
              >
                <svg className="w-8 h-8 text-white" viewBox="0 0 180 180" fill="currentColor">
                  <mask id="mask0" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
                    <circle cx="90" cy="90" r="90" fill="white"/>
                  </mask>
                  <g mask="url(#mask0)">
                    <circle cx="90" cy="90" r="90" fill="currentColor"/>
                    <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0)"/>
                    <rect x="115" y="54" width="12" height="72" fill="url(#paint1)"/>
                  </g>
                  <defs>
                    <linearGradient id="paint0" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="black"/>
                      <stop offset="1" stopColor="black" stopOpacity="0"/>
                    </linearGradient>
                    <linearGradient id="paint1" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
                      <stop stopColor="black"/>
                      <stop offset="1" stopColor="black" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span className="font-medium text-white">Next.js 16</span>
              </motion.div>
              
              {/* Vercel */}
              <motion.div 
                className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 group cursor-pointer"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <svg className="w-6 h-6 text-white" viewBox="0 0 76 65" fill="currentColor">
                  <path d="M37.5274 0L75.0548 65H0L37.5274 0Z"/>
                </svg>
                <span className="font-medium text-white">Vercel</span>
              </motion.div>
              
              {/* React */}
              <motion.div 
                className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 group cursor-pointer"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <svg className="w-8 h-8 text-[#61DAFB] group-hover:text-[#61DAFB]" viewBox="-11.5 -10.232 23 20.463" fill="currentColor">
                  <circle r="2.05"/>
                  <g stroke="currentColor" fill="none">
                    <ellipse rx="11" ry="4.2"/>
                    <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
                    <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
                  </g>
                </svg>
                <span className="font-medium text-white">React 19</span>
              </motion.div>
              
              {/* Tailwind */}
              <motion.div 
                className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 group cursor-pointer"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              >
                <svg className="w-8 h-8 text-[#38BDF8] group-hover:text-[#38BDF8]" viewBox="0 0 54 33" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"/>
                </svg>
                <span className="font-medium text-white">Tailwind CSS</span>
              </motion.div>
              
              {/* Ghost */}
              <motion.div 
                className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 group cursor-pointer"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              >
                <Cpu className="w-6 h-6 text-white group-hover:text-white" />
                <span className="font-medium text-white">Ghost CMS</span>
              </motion.div>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Our Process Section */}
      <section id="process" className="section-white scroll-mt-32" ref={processRef}>
        <div className="container-content">
          <FadeInOnScroll>
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-brand-navy mb-4 text-xl sm:text-2xl md:text-h2">How We Build Your SSR Website</h2>
              <p className="text-brand-navy/70 max-w-2xl mx-auto">
                From first call to launch - no surprises
              </p>
            </div>
          </FadeInOnScroll>
          
          {/* Timeline */}
          <div className="relative max-w-4xl mx-auto">
            {/* Animated Connecting Line - Desktop */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-brand-navy/10 -translate-x-1/2">
              <motion.div
                className="w-full bg-brand-gold origin-top"
                initial={{ height: 0 }}
                animate={processInView ? { height: '100%' } : { height: 0 }}
                transition={{ duration: 2, ease: 'easeOut' }}
              />
            </div>
            
            {processSteps.map((step, index) => (
              <FadeInOnScroll 
                key={step.number} 
                delay={index * 0.15}
                direction={index % 2 === 0 ? 'left' : 'right'}
              >
                <div className={`relative flex flex-col lg:flex-row items-center gap-8 mb-12 last:mb-0 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}>
                  {/* Content Card */}
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className="bg-brand-navy/[0.02] backdrop-blur-sm border border-brand-navy/10 rounded-2xl p-6
                      hover:border-brand-gold/30 hover:bg-brand-gold/[0.02] transition-all duration-300 group">
                      <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? 'lg:justify-end' : ''}`}>
                        <motion.div
                          animate={iconAnimations[step.animation]}
                          className="text-brand-gold"
                        >
                          <step.icon className="w-5 h-5" />
                        </motion.div>
                        <h3 className="text-brand-navy font-bold">{step.title}</h3>
                      </div>
                      <p className="text-brand-navy/60 mb-3">{step.description}</p>
                      <span className="inline-block text-brand-gold text-sm font-medium">
                        {step.duration}
                      </span>
                    </div>
                  </div>
                  
                  {/* Number Circle */}
                  <motion.div 
                    className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-brand-gold 
                      flex items-center justify-center font-headline text-brand-navy text-xl"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={processInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.2 + 0.5,
                      type: 'spring',
                      stiffness: 200
                    }}
                    style={{
                      boxShadow: '0 0 30px rgba(236,182,21,0.4)'
                    }}
                  >
                    {step.number}
                  </motion.div>
                  
                  {/* Spacer for alternating layout */}
                  <div className="flex-1 hidden lg:block" />
                </div>
              </FadeInOnScroll>
            ))}
          </div>
          
          <FadeInOnScroll delay={0.8}>
            <div className="text-center mt-16">
              <Link href="/pricing" className="btn-primary inline-flex items-center gap-2">
                Ready to Start? Get Your Quote
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Flexible Payments Section */}
      <section className="bg-brand-navy py-section relative overflow-hidden">
        {/* Gold accent gradient */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-gold/5 to-transparent" />
        
        <div className="container-content relative z-10">
          <div className="max-w-4xl mx-auto">
            <FadeInOnScroll>
              <div className="text-center mb-8 md:mb-10">
                <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">Pay Monthly, Spread the Cost</h2>
                <p className="text-white/70">
                  Premium SSR web design without the upfront hit
                </p>
              </div>
            </FadeInOnScroll>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <FadeInOnScroll delay={0.2} direction="left">
                <div>
                  <p className="text-body-lg text-white/80 mb-6">
                    We know dropping thousands upfront isn&apos;t always realistic - especially when 
                    you&apos;re investing in your business growth. That&apos;s why we offer flexible 
                    payment plans that let you spread the cost over 6, 12, or 24 months.
                  </p>
                  <p className="text-white/60 mb-8">
                    No credit checks, no finance companies, no interest. Just straightforward 
                    monthly payments that fit your budget.
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {paymentFeatures.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-brand-gold flex-shrink-0" />
                        <span className="text-white/70">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeInOnScroll>
              
              <FadeInOnScroll delay={0.4} direction="right">
                <div className="bg-brand-graphite/50 border border-white/10 rounded-2xl p-8 text-center"
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
              </FadeInOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <FadeInOnScroll>
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">Frequently Asked Questions</h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Straight answers about timelines, costs, and what you actually get.
              </p>
            </div>
          </FadeInOnScroll>
          
          <FadeInOnScroll delay={0.2}>
            <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 md:p-8">
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
          </FadeInOnScroll>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section-white relative overflow-hidden">
        {/* Gold accent glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[100px]" />
        
        <div className="container-content relative z-10 text-center">
          <FadeInOnScroll>
            <h2 className="text-brand-navy mb-4 text-xl sm:text-2xl md:text-h2">Ready for an SSR Website That AI Can See?</h2>
          </FadeInOnScroll>
          
          <FadeInOnScroll delay={0.2}>
            <p className="text-brand-navy/70 mb-10 max-w-2xl mx-auto">
              Get your instant quote in under 2 minutes. See exactly what it costs, 
              including monthly payment options.
            </p>
          </FadeInOnScroll>
          
          <FadeInOnScroll delay={0.4}>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Link 
                href="/pricing" 
                className="btn-primary inline-flex items-center gap-2 group animate-counter-glow"
              >
                Get Your Instant Quote
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/book" className="btn-secondary">
                Book a Call First
              </Link>
            </div>
          </FadeInOnScroll>
          
          <FadeInOnScroll delay={0.6}>
            <p className="text-brand-navy/50 text-sm">
              No obligation • Transparent pricing • Veteran-owned
            </p>
          </FadeInOnScroll>
        </div>
      </section>
    </>
  );
}
