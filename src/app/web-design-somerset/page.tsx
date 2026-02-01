'use client';

import { MapPin, Palette, Server, Brain, Map } from 'lucide-react';
import {
  LandingHero,
  LandingProblem,
  LandingSolution,
  LandingWhatYouGet,
  LandingProof,
  LandingRelatedServices,
  LandingCaseStudy,
  FAQSection,
  LandingCTA,
  LandingAreasServed,
} from '@/components/landing';

// FAQ Data
const faqItems = [
  { question: "Why choose a Somerset-based web designer?", answer: "Local matters. We understand Somerset's business landscape, we're available for face-to-face meetings, and we're invested in the local economy. When you call, a real person in Frome answers." },
  { question: "How much does web design in Somerset cost?", answer: "Our packages start from £2,625 for a simple site. Most local businesses invest £5,000-£9,000. That's 25% below typical agency rates." },
  { question: "Do you only work with Somerset businesses?", answer: "No, we work UK-wide. But Somerset is home, and we enjoy working with local businesses where we can meet face-to-face." },
  { question: "Can you help with Google Business Profile?", answer: "Yes. Local SEO is part of every Somerset web design package including GBP optimisation, NAP consistency, and local schema markup." },
  { question: "What makes you different from other Somerset agencies?", answer: "We build for AI visibility using V.O.I.C.E™ methodology. Most Somerset web designers haven't heard of AI SEO. Plus, we build on Next.js, not WordPress." },
  { question: "How long does a project take?", answer: "Typically 4-6 weeks from brief to launch. Military precision means deadlines are deadlines." },
  { question: "Will you meet in person?", answer: "Absolutely. We're based in Frome and happy to meet anywhere in Somerset." },
  { question: "Do you work with specific industries?", answer: "We work across all industries but have experience with Somerset tourism, trades, professional services, and retail." },
  { question: "What ongoing support do you offer?", answer: "30 days post-launch support included. Monthly maintenance packages from £150/month after that." },
  { question: "What if I already have a website?", answer: "We can rebuild or optimise existing sites. We'll assess honestly and recommend the most cost-effective path." },
  { question: "Do you offer payment plans?", answer: "Yes. 50% upfront, 50% on completion. Monthly plans available for larger projects." },
  { question: "What's included in training?", answer: "Every project includes a recorded training session on content updates and enquiry management." },
  { question: "How do you handle revisions?", answer: "Two rounds included. Additional revisions at £60/hour with full transparency." },
  { question: "Can you help with content writing?", answer: "Yes. We can write copy or structure what you provide for AI optimisation." },
  { question: "What's the benefit of Next.js over WordPress?", answer: "Speed, security, and AI optimisation. WordPress averages 3-4 seconds load time. Our sites load under 2 seconds." },
  { question: "Are you actually based in Somerset?", answer: "Yes - 4 Horse Close, Frome, Somerset, BA11. Veteran-owned, locally registered." },
  { question: "What guarantee do you offer?", answer: "100% schema validation guarantee. Specific load time and accessibility scores in writing before you commit." },
];

// Problem points
const problemPoints = [
  {
    title: "Option 1: The Local Freelancer",
    description: "Nice enough, charges reasonable rates, but builds everything on WordPress templates. Your site looks exactly like every other local business. No AI optimisation, no schema markup. You might rank eventually, but AI doesn't know you exist."
  },
  {
    title: "Option 2: The Bristol/Bath Agency",
    description: "Charges London prices without London results. £10K for a WordPress site with some custom styling. They'll talk about 'digital transformation' while delivering template-based work."
  },
  {
    title: "Option 3: DIY Website Builders",
    description: "Wix, Squarespace, GoDaddy - fine for a hobby, terrible for a business. Slow, bloated, impossible to optimise for AI."
  },
];

// Solution features
const solutionFeatures = [
  { title: "Based in Frome", description: "Face-to-face meetings, local understanding, someone who answers the phone" },
  { title: "AI-First Approach", description: "Your site gets recommended by ChatGPT, not just indexed by Google" },
  { title: "Military Precision", description: "Deadlines met, budgets respected, no surprises" },
  { title: "Fair Pricing", description: "25% below typical agency rates - no London overheads" },
];

// What you get cards
const whatYouGetCards = [
  {
    title: "Professional Design",
    icon: Palette,
    items: [
      "Custom design (not templates)",
      "Mobile-first responsive",
      "Your brand colours throughout",
      "Professional photography guidance",
    ],
  },
  {
    title: "Technical Excellence",
    icon: Server,
    items: [
      "Next.js server-side rendering",
      "Sub-2-second load times",
      "100% Lighthouse accessibility",
      "SSL security certificate",
    ],
  },
  {
    title: "AI Visibility",
    icon: Brain,
    items: [
      "Complete schema markup",
      "V.O.I.C.E™ optimisation",
      "Voice search configuration",
      "ChatGPT recommendation testing",
    ],
  },
  {
    title: "Local SEO",
    icon: Map,
    items: [
      "Google Business Profile optimisation",
      "Local schema with Somerset targeting",
      "Citation building for Somerset directories",
      "Maps integration",
    ],
  },
];

// Proof stats
const proofStats = [
  { value: 15, suffix: "+", label: "Somerset Clients" },
  { value: 1.4, suffix: "s", label: "Average Load Time" },
  { value: 89, suffix: "%", label: "AI Recommendation Rate" },
  { value: 4.9, suffix: "/5", label: "Client Satisfaction" },
];

// Towns served
const somersetTowns = [
  'Frome',
  'Taunton',
  'Yeovil',
  'Bridgwater',
  'Glastonbury',
  'Wells',
  'Shepton Mallet',
  'Street',
  'Chard',
  'Weston-super-Mare',
  'Minehead',
  'Burnham-on-Sea',
  'Wellington',
  'Ilminster',
];

export default function WebDesignSomersetPage() {
  return (
    <>
      {/* Hero Section */}
      <LandingHero
        badge="Somerset's AI-First Agency"
        badgeIcon={<MapPin className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="WEB DESIGN SOMERSET:"
        headline="WEBSITES THAT GET RECOMMENDED"
        subheadline="Based in Frome. Building websites that ChatGPT actually recommends."
        bodyCopy={
          <>
            <p className="mb-4">
              Most Somerset web designers are still building websites for 2019. Pretty designs that load slowly, rank nowhere, and are completely invisible to AI.
            </p>
            <p className="mb-4">
              We&apos;re doing something different.
            </p>
            <p>
              ScopeSite is a Somerset web design agency that builds websites for the AI era. When someone asks ChatGPT &quot;Who&apos;s the best [your service] in Somerset?&quot;, our clients are the ones getting mentioned. We&apos;re based in Frome, veteran-owned, and we&apos;ve been in your shoes - running a local business in Somerset where every customer matters.
            </p>
          </>
        }
      />

      {/* Problem Section */}
      <LandingProblem
        title="THE SOMERSET WEB DESIGN PROBLEM"
        intro="Somerset businesses have three options for web design. None of them are great:"
        problems={problemPoints}
        conclusion={{
          title: "What Somerset Actually Needs:",
          text: "A web design agency that understands local business, charges fair prices, and builds sites that work in 2026. That's why we started ScopeSite in Frome."
        }}
      />

      {/* Solution Section */}
      <LandingSolution
        title="SOMERSET WEB DESIGN THAT WORKS DIFFERENTLY"
        features={solutionFeatures}
        layout="table"
      />

      {/* What You Get Section */}
      <LandingWhatYouGet
        title="WHAT'S INCLUDED IN SOMERSET WEB DESIGN"
        cards={whatYouGetCards}
        columns={4}
      />

      {/* Areas Served */}
      <LandingAreasServed
        title="SERVING BUSINESSES ACROSS SOMERSET"
        homeBase="Frome"
        towns={somersetTowns}
        theme="dark"
      />

      {/* Proof Section */}
      <LandingProof
        title="SOMERSET WEB DESIGN RESULTS"
        stats={proofStats}
        theme="light"
      />

      {/* Case Study Section */}
      <LandingCaseStudy 
        title="See What AI-First Design Delivers"
        quote="A UK business went from invisible to #1 AI-recommended in 6 weeks using our V.O.I.C.E™ methodology"
        theme="dark" 
      />

      {/* Related Services Section */}
      <LandingRelatedServices
        title="MORE SERVICES FOR SOMERSET BUSINESSES"
        services={[
          {
            title: "AI Website Design",
            description: "Websites engineered for ChatGPT and AI recommendations",
            href: "/ai-website-design"
          },
          {
            title: "Web Design Bath",
            description: "Serving businesses across Bath and surrounds",
            href: "/web-design-bath"
          },
          {
            title: "Web Design Bristol",
            description: "Tech-forward web design for Bristol businesses",
            href: "/web-design-bristol"
          },
        ]}
        theme="light"
      />

      {/* FAQ Section */}
      <FAQSection
        title="SOMERSET WEB DESIGN: YOUR QUESTIONS ANSWERED"
        items={faqItems}
        theme="light"
      />

      {/* Final CTA Section */}
      <LandingCTA
        title="LET'S BUILD SOMETHING PROPER"
        description="Get an instant quote in 60 seconds, or book a call for a proper conversation about what your business needs."
        footnote="No obligation • Transparent pricing • Veteran-owned"
      />
    </>
  );
}
