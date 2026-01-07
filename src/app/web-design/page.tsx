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
  Activity
} from 'lucide-react';
import { 
  AnimatedCounter, 
  TypeWriter, 
  FadeInOnScroll, 
  StaggerContainer, 
  StaggerItem,
  LighthouseGauge,
  SSRComparison,
  CSRCodeBlock,
  SSRCodeBlock,
  SchemaVisualization
} from '@/components/animations';

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
        <p className="text-brand-navy/70 leading-relaxed whitespace-pre-line">{answer}</p>
      </div>
    </div>
  );
}

// SSR-Specific Feature Cards Data
const features = [
  {
    title: '100/100 PERFORMANCE',
    description: 'Lighthouse perfect scores. Sub-second load times. Core Web Vitals crushed. Not "optimised" - perfected.',
    icon: Zap,
    stat: '100',
    statLabel: 'Lighthouse',
  },
  {
    title: 'AI-CRAWLER READY',
    description: 'GPTBot, ClaudeBot, PerplexityBot - they all see your content instantly. No JavaScript execution required. SSR means AI visibility from day one.',
    icon: Brain,
  },
  {
    title: 'AUTO-GENERATED SCHEMA',
    description: 'Rich structured data on every page - BlogPosting, FAQPage, HowTo, Organization - all generated automatically. No manual injection, no errors.',
    icon: Code2,
  },
  {
    title: 'HEADLESS CMS',
    description: 'Ghost CMS for content, Next.js for delivery. Write in a clean editor, publish to a blazing-fast frontend. Best of both worlds.',
    icon: Server,
  },
  {
    title: 'EDGE DEPLOYMENT',
    description: "Vercel's global edge network. Your site loads fast whether your visitor is in London, New York, or Tokyo.",
    icon: Globe,
  },
  {
    title: 'FUTURE-PROOF',
    description: 'While others scramble to retrofit AI compatibility, your site is already built for where search is going.',
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
    description: 'Online shops that need to convert browsers into buyers with blazing-fast page loads',
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

// Updated FAQ Data with SSR focus
const faqItems = [
  {
    question: 'What technology do you use?',
    answer: `We build with Next.js and deploy on Vercel's edge network. This isn't a preference - it's a technical decision based on what actually works for AI visibility.

Most agencies use WordPress with plugins or drag-and-drop builders like Wix. These are client-side rendered, meaning AI crawlers can't read the content properly. Our sites are Server-Side Rendered - the full page is delivered as HTML, ready for humans AND AI crawlers instantly.

For content management, we use Ghost CMS as a headless backend. You get a clean, fast editor without the bloat of WordPress.`,
  },
  {
    question: 'What is Server-Side Rendering (SSR)?',
    answer: `SSR means your website's content is generated on the server before it reaches the browser. When someone (or an AI crawler) requests a page, they get the complete HTML immediately - no waiting for JavaScript to load and render.

Traditional websites built on Wix, Squarespace, or WordPress with heavy plugins often use Client-Side Rendering. The browser receives a mostly empty page, then JavaScript downloads and builds the content. AI crawlers can't execute JavaScript, so they see... nothing.

With SSR, GPTBot, ClaudeBot, and Perplexity see exactly what your human visitors see - instantly.`,
  },
  {
    question: 'How long does it take to build a website?',
    answer: 'Most projects take 4-8 weeks from kickoff to launch. Simple brochure sites are faster, complex builds with custom functionality take longer. We\'ll give you an accurate timeline in your quote based on exactly what you need.',
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
    question: 'What about hosting and domains?',
    answer: 'Your site is deployed to Vercel\'s global edge network - the same infrastructure used by companies like Stripe, Notion, and McDonald\'s. We handle domain configuration, SSL certificates, and ongoing maintenance. It\'s all included.',
  },
  {
    question: 'What happens after my website launches?',
    answer: 'We don\'t disappear. All our packages include ongoing maintenance and support. We handle updates, security patches, performance monitoring, and are on hand when you need changes. You focus on running your business.',
  },
  {
    question: 'Can you help with SEO and AI visibility?',
    answer: 'Your site will have bulletproof technical SEO built in from day one - proper meta tags, structured data, XML sitemaps, optimised images, and fast load times. For ongoing content strategy and AI visibility optimization, check out our V.O.I.C.E™ service.',
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

// Technical metrics
const technicalMetrics = [
  { label: 'First Contentful Paint', value: '0.3', unit: 's', description: 'Content appears almost instantly' },
  { label: 'Largest Contentful Paint', value: '0.6', unit: 's', description: 'Main content fully loaded' },
  { label: 'Time to First Byte', value: '<100', unit: 'ms', description: 'Server responds in milliseconds' },
  { label: 'Cumulative Layout Shift', value: '0', unit: '', description: 'Zero layout jumping' },
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
            {/* Lighthouse Score Badge */}
            <FadeInOnScroll delay={0.2}>
              <div className="inline-flex items-center gap-3 bg-brand-gold/10 border border-brand-gold/30 rounded-full px-5 py-2 mb-8">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-brand-gold" />
                  <span className="text-white/80 text-sm">Lighthouse Score:</span>
                </div>
                <span className="text-brand-gold font-bold text-lg">
                  <AnimatedCounter value={100} duration={1.5} delay={0.5} />
                  /100
                </span>
              </div>
            </FadeInOnScroll>
            
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-headline text-white mb-4">
              <span className="text-brand-gold block mb-2">
                <TypeWriter 
                  text="FAST WEBSITES" 
                  speed={80} 
                  delay={200}
                />
              </span>
              <span className="block">THAT AI CAN ACTUALLY SEE</span>
            </h1>
            
            <FadeInOnScroll delay={0.8}>
              <p className="text-xl md:text-2xl text-white/90 font-medium mb-6">
                Server-Side Rendered (SSR). AI-Optimised. Blazing Fast.
              </p>
            </FadeInOnScroll>
            
            <FadeInOnScroll delay={1}>
              <p className="text-body-lg text-white/70 mb-6 max-w-3xl mx-auto">
                Most websites are invisible to ChatGPT, Claude, and Perplexity. They&apos;re built with 
                client-side JavaScript that AI crawlers can&apos;t execute. Your beautiful content? 
                The AI sees an empty page.
              </p>
            </FadeInOnScroll>
            
            <FadeInOnScroll delay={1.2}>
              <p className="text-body text-white/60 mb-10 max-w-3xl mx-auto">
                We build Server-Side Rendered websites on Next.js that deliver fully-formed HTML 
                on every request. AI crawlers get your complete content instantly. 
                No JavaScript required. No waiting. No invisibility.
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

      {/* Why SSR Section */}
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
              <h2 className="text-brand-navy mb-4 text-xl sm:text-2xl md:text-h2">Why Server-Side Rendering?</h2>
              <p className="text-brand-navy/70 max-w-2xl mx-auto">
                See the difference between traditional websites and SSR
              </p>
            </div>
          </FadeInOnScroll>
          
          {/* Problem statement */}
          <FadeInOnScroll delay={0.2}>
            <div className="max-w-3xl mx-auto mb-12 text-center">
              <p className="text-brand-navy/80 text-lg mb-4">
                <strong className="text-brand-navy">The Problem:</strong> Most websites (Wix, Squarespace, WordPress with heavy plugins) 
                are client-side rendered. AI crawlers (GPTBot, ClaudeBot, PerplexityBot) can&apos;t execute JavaScript. 
                They see a blank page or skeleton content.
              </p>
              <p className="text-brand-navy/80 text-lg">
                <strong className="text-brand-navy">The Solution:</strong> Server-Side Rendering delivers fully-formed HTML 
                on first request. No JavaScript required. AI crawlers get the complete page instantly. 
                Your content is readable, indexable, and citable by AI assistants.
              </p>
            </div>
          </FadeInOnScroll>
          
          {/* Interactive Comparison */}
          <SSRComparison className="max-w-5xl mx-auto" />
          
          {/* Code Block Comparison */}
          <FadeInOnScroll delay={0.4}>
            <div className="mt-16 max-w-5xl mx-auto">
              <h3 className="text-brand-navy font-bold text-xl text-center mb-8">See The Raw HTML Difference</h3>
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
              <p className="text-white/70 max-w-2xl mx-auto">
                SSR-specific benefits that set your site apart
              </p>
            </div>
          </FadeInOnScroll>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
            {features.map((feature) => (
              <StaggerItem key={feature.title}>
                <div
                  className="group relative p-8 rounded-2xl transition-all duration-400 ease-out
                    bg-brand-graphite/50 backdrop-blur-sm
                    border border-white/10
                    hover:translate-y-[-8px]
                    hover:shadow-[0_0_40px_rgba(236,182,21,0.2)]
                    hover:border-brand-gold/40
                    h-full"
                >
                  {/* Icon */}
                  <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl 
                    bg-brand-gold/10 group-hover:bg-brand-gold/20 transition-all duration-400
                    group-hover:scale-110">
                    <feature.icon className="w-7 h-7 text-brand-gold transition-all duration-400 group-hover:drop-shadow-[0_0_8px_rgba(236,182,21,0.6)]" />
                  </div>
                  
                  {/* Stat badge for performance card */}
                  {feature.stat && (
                    <div className="absolute top-6 right-6 flex items-center gap-1">
                      <span className="text-2xl font-bold text-brand-gold">{feature.stat}</span>
                      <span className="text-xs text-white/50">{feature.statLabel}</span>
                    </div>
                  )}
                  
                  {/* Content */}
                  <h3 className="text-white text-lg font-bold mb-3">{feature.title}</h3>
                  <p className="text-white/60">{feature.description}</p>
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
              <p className="text-brand-navy/70 max-w-2xl mx-auto">
                Real metrics from our SSR sites - not just promises
              </p>
            </div>
          </FadeInOnScroll>
          
          {/* Lighthouse Gauges */}
          <FadeInOnScroll delay={0.2}>
            <div className="bg-brand-navy rounded-2xl p-8 md:p-12 mb-12">
              <h3 className="text-white text-center font-bold mb-8">Lighthouse Scores</h3>
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
            <div className="bg-brand-navy rounded-2xl p-8 md:p-12 mb-12">
              <SchemaVisualization />
            </div>
          </FadeInOnScroll>
          
          {/* Test Your Site CTA */}
          <FadeInOnScroll delay={0.4}>
            <div className="text-center">
              <p className="text-brand-navy/70 mb-4">Want to see how your current site performs?</p>
              <a 
                href="https://pagespeed.web.dev/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2 animate-counter-glow"
              >
                <Activity className="w-5 h-5" />
                Test Your Site&apos;s Speed
                <ExternalLink className="w-4 h-4" />
              </a>
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
              <p className="text-white/50 text-sm">The same stack trusted by Stripe, Notion, and Nike</p>
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
                <Cpu className="w-6 h-6 text-[#15171A] group-hover:text-white" />
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

      {/* Who We Work With Section */}
      <section className="section-white">
        <div className="container-content">
          <FadeInOnScroll>
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-brand-navy mb-4 text-xl sm:text-2xl md:text-h2">Built for Businesses Like Yours</h2>
              <p className="text-brand-navy/70 max-w-2xl mx-auto">
                We specialise in UK service businesses that need results, not excuses
              </p>
            </div>
          </FadeInOnScroll>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" staggerDelay={0.1}>
            {industries.map((industry) => (
              <StaggerItem key={industry.title}>
                <div
                  className="p-6 rounded-2xl bg-brand-navy/[0.02] border border-brand-navy/10
                    hover:border-brand-gold/30 hover:bg-brand-gold/[0.02] transition-all duration-300"
                >
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10">
                    <industry.icon className="w-6 h-6 text-brand-gold" />
                  </div>
                  <h3 className="text-brand-navy font-bold mb-2">{industry.title}</h3>
                  <p className="text-brand-navy/60 text-sm">{industry.description}</p>
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

      {/* FAQ Section */}
      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <FadeInOnScroll>
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">Frequently Asked Questions</h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Straight answers about SSR, our tech stack, and how we work
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
