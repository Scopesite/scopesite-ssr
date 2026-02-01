'use client';

import { MapPin, Code2, Brain, Shield, Map } from 'lucide-react';
import {
  LandingHero,
  LandingProblem,
  LandingSolution,
  LandingWhatYouGet,
  LandingProof,
  FAQSection,
  LandingCTA,
  LandingAreasServed,
} from '@/components/landing';

// FAQ Data
const faqItems = [
  { question: "Why choose a Somerset agency for Bristol web design?", answer: "Because Bristol agencies charge Bristol prices for work we do better at fairer rates. We're 40 minutes away - close enough for regular face-to-face meetings, but without Harbourside rent built into your quote. Better tech, better value." },
  { question: "How do your prices compare to Bristol agencies?", answer: "Our packages start from £2,625. Bristol agencies typically charge £10,000-£20,000 for comparable work. We're not cutting corners - we just don't have Bristol overheads and we don't pad quotes with 'discovery phases' and 'brand workshops'." },
  { question: "Will you meet Bristol clients in person?", answer: "Yes. We're in Bristol regularly and happy to meet at your office, a coffee shop, or co-working space. Initial consultations, design reviews, training - whatever works for you. 40 minutes is nothing." },
  { question: "Do you work with Bristol tech companies?", answer: "Yes, and they're often our favourite clients. They understand why Next.js matters, why WordPress is a liability, and why AI visibility is the future. We speak the same technical language." },
  { question: "What makes you different from Bristol web agencies?", answer: "Technology and honesty. We build on Next.js (like Nike, Netflix, TikTok), not WordPress. We optimise for AI visibility, not just Google rankings. And we price based on work, not postcode." },
  { question: "How long does a Bristol web design project take?", answer: "Typically 4-6 weeks from brief to launch. Complex projects take longer, simple ones can be faster. We give you a specific timeline and stick to it - no Bristol agency vagueness." },
  { question: "Can you help Bristol startups?", answer: "Absolutely. Startups need fast, scalable, professional sites that don't cost their entire seed round. Our tech stack (Next.js, React, Vercel) is exactly what modern startups should be building on." },
  { question: "What about ongoing support?", answer: "30 days post-launch support is included. Monthly maintenance from £150/month after that. We're not going to abandon you after launch like some Bristol agencies do." },
  { question: "Can you redesign our existing Bristol business website?", answer: "Yes. We can rebuild from scratch or add AI optimisation to existing sites on compatible platforms. We'll assess honestly and recommend the most cost-effective approach." },
  { question: "Do you understand Bristol's market?", answer: "Yes. Bristol's a unique mix of tech startups, creative agencies, aerospace, professional services, and independent businesses. We've worked across these sectors and understand what each needs." },
  { question: "Why Next.js instead of WordPress?", answer: "Speed, security, and AI optimisation. WordPress sites average 3-4 seconds load time and are constant hacking targets. Next.js gives us sub-2-second loads, enterprise security, and complete control for AI visibility." },
  { question: "Can you help with Bristol local SEO?", answer: "Yes. Local SEO is built into every project - Google Business Profile, local schema markup, citations, and content structured for 'near me' and voice searches specific to Bristol areas." },
  { question: "Do you offer payment plans?", answer: "Yes. 50% upfront, 50% on completion is standard. Monthly payment plans available for larger projects - we understand Bristol startup cash flow." },
  { question: "What industries do you work with in Bristol?", answer: "All industries, but we have particular experience with Bristol tech companies, professional services, creative agencies, hospitality, and e-commerce businesses." },
  { question: "How do revisions work?", answer: "Two rounds of design revisions included. Additional revisions at £60/hour with full transparency about when we're approaching that point." },
  { question: "What guarantee do you offer?", answer: "100% schema validation guarantee. Specific load time and accessibility scores in writing before you commit. We deliver what we promise." },
  { question: "Why not just hire a Bristol freelancer?", answer: "You can - many are talented. But freelancers rarely have AI optimisation expertise, and availability can be unpredictable. We offer agency capability with freelancer-friendly pricing and guaranteed delivery." },
];

// Problem points
const problemPoints = [
  {
    title: "WordPress with a premium theme (that cost them £59)",
    description: "Most Bristol web design agencies charge £10,000-£20,000 and deliver WordPress with a premium theme, custom colour scheme and your logo, stock photos you've seen on 50 other sites, 'SEO optimisation' that means they installed Yoast, and monthly fees to keep the lights on."
  },
  {
    title: "No idea how to make sites visible to AI",
    description: "Meanwhile, the world's moved on. 58% of local searches happen through voice. ChatGPT handles 100+ million queries daily. Your competitor in London is getting recommended by ChatGPT while your expensive Bristol website might as well not exist to AI platforms."
  },
];

// Solution comparison
const solutionFeatures = [
  { title: "Next.js server-side rendering", description: "WordPress with 47 plugins" },
  { title: "Sub-2-second load times", description: "4-6 seconds 'because plugins'" },
  { title: "Full AI visibility engineering", description: "'What's schema markup?'" },
  { title: "Fixed pricing, no surprises", description: "'It'll cost more than quoted'" },
  { title: "Schema.org validated", description: "Yoast says it's fine" },
];

// What you get cards
const whatYouGetCards = [
  {
    title: "Modern Development",
    icon: Code2,
    items: [
      "Next.js 16 server-side rendering",
      "React 19 components",
      "Tailwind CSS styling",
      "Sub-2-second load times",
      "Mobile-first responsive",
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
      "AI crawler configuration",
    ],
  },
  {
    title: "Technical Excellence",
    icon: Shield,
    items: [
      "100% Lighthouse scores",
      "Enterprise-grade security",
      "GDPR compliance",
      "SSL certificates",
      "Performance monitoring",
    ],
  },
  {
    title: "Local SEO",
    icon: Map,
    items: [
      "Google Business Profile optimisation",
      "Bristol-specific local schema",
      "Citation building",
      "Review management",
      "Maps integration",
    ],
  },
];

// Proof stats
const proofStats = [
  { value: 12, suffix: "+", label: "Bristol Area Clients" },
  { value: 1.4, suffix: "s", label: "Average Load Time" },
  { value: 89, suffix: "%", label: "AI Recommendation Rate" },
  { value: 4.9, suffix: "/5", label: "Client Satisfaction" },
];

// Bristol areas served
const bristolAreas = [
  'Bristol City Centre',
  'Harbourside',
  'Clifton',
  'Redcliffe',
  'Temple',
  'Stokes Croft',
  'Bedminster',
  'Southville',
  'Filton',
  'Bradley Stoke',
  'Portishead',
  'Clevedon',
];

export default function WebDesignBristolPage() {
  return (
    <>
      {/* Hero Section */}
      <LandingHero
        badge="Bristol's AI-First Alternative"
        badgeIcon={<MapPin className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="WEB DESIGN BRISTOL:"
        headline="BUILT FOR AI, PRICED FAIRLY"
        subheadline="Tech-forward web design without the Bristol agency markup."
        bodyCopy={
          <>
            <p className="mb-4">
              Bristol&apos;s got more web agencies than coffee shops. Most of them are still building WordPress sites and calling it &quot;cutting edge&quot;. They&apos;ll charge you £15K, deliver a template with your colours, and wonder why ChatGPT has no idea you exist.
            </p>
            <p className="mb-4">
              We build differently.
            </p>
            <p>
              ScopeSite creates AI-optimised websites that get Bristol businesses recommended by ChatGPT, Perplexity, and voice assistants. We&apos;re based in Somerset, 40 minutes from Bristol city centre. Close enough for face-to-face meetings, far enough to not charge you Bristol agency rates.
            </p>
          </>
        }
      />

      {/* Problem Section */}
      <LandingProblem
        title="BRISTOL'S WEB DESIGN SCENE HAS A PROBLEM"
        intro="Bristol fancies itself a tech hub. And it is - there's genuine talent here. But the web design market? It's stuck in 2018."
        problems={problemPoints}
        conclusion={{
          title: "The Real Problem:",
          text: "Bristol businesses are paying premium prices for technology that's already obsolete."
        }}
      />

      {/* Solution Section */}
      <LandingSolution
        title="BRISTOL WEB DESIGN FOR THE AI ERA"
        intro="Bristol's tech scene gets it. Startups and scale-ups here understand that the future is AI-first. Here's how we compare to typical Bristol agencies:"
        features={solutionFeatures}
        layout="table"
      />

      {/* What You Get Section */}
      <LandingWhatYouGet
        title="WHAT'S INCLUDED IN BRISTOL WEB DESIGN"
        cards={whatYouGetCards}
        columns={4}
      />

      {/* Areas Served */}
      <LandingAreasServed
        title="SERVING BUSINESSES ACROSS BRISTOL"
        towns={bristolAreas}
        theme="dark"
      />

      {/* Proof Section */}
      <LandingProof
        title="BRISTOL WEB DESIGN RESULTS"
        stats={proofStats}
        quote={{
          text: "We'd been quoted £18K by Bristol agencies for what turned out to be WordPress templates. ScopeSite delivered a proper Next.js build with full AI optimisation for a third of that. Our site now gets mentioned by ChatGPT - the expensive agencies couldn't even explain what that meant.",
          author: "Tech Startup, Bristol"
        }}
        theme="light"
      />

      {/* FAQ Section */}
      <FAQSection
        title="BRISTOL WEB DESIGN: YOUR QUESTIONS ANSWERED"
        items={faqItems}
        theme="light"
      />

      {/* Final CTA Section */}
      <LandingCTA
        title="BRISTOL DESERVES BETTER WEB DESIGN"
        description="Stop paying Bristol agency prices for 2018 technology. Get AI-optimised websites built on modern tech stacks, priced fairly, delivered on time. Find out exactly what your Bristol business website should cost - in 60 seconds."
        footnote="No obligation • Transparent pricing • Veteran-owned"
      />
    </>
  );
}
