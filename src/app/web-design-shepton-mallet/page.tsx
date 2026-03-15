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

const faqItems = [
  { question: "Is there a web designer near Shepton Mallet?", answer: "Yes. ScopeSite is based just 15 minutes away in Frome. We work with businesses across Shepton Mallet and the surrounding Somerset area. Face-to-face meetings are easy to arrange." },
  { question: "How much does web design cost for a small business?", answer: "Our packages start from £2,625 for a simple site. Most Shepton Mallet businesses invest between £5,000 and £9,000 depending on complexity. That's well below what Bristol or Bath agencies charge." },
  { question: "What is AI-ready web design?", answer: "AI-ready means your site is built with server-side rendering, structured schema markup, and content designed to be understood by AI platforms like ChatGPT and Google AI Overviews. It's how businesses get found in 2026." },
  { question: "Do you work with small businesses in Shepton Mallet?", answer: "Yes. Most of our clients are small and medium businesses. We understand the Shepton Mallet market, from independent shops to businesses connected to the Royal Bath and West Showground." },
  { question: "What technology do you use?", answer: "We build on Next.js with server-side rendering. No WordPress, no page builders. This gives you sub-2-second load times, 100/100 Lighthouse scores, and proper AI visibility." },
  { question: "How long does a web design project take?", answer: "Typically 4-6 weeks from brief to launch. We agree a specific timeline upfront and stick to it." },
  { question: "Can you help with local SEO for Shepton Mallet?", answer: "Yes. Local SEO is built into every project. That includes Google Business Profile optimisation, local schema markup, citation building, and content structured for 'near me' searches." },
  { question: "Will my website work on mobile?", answer: "Every site we build is mobile-first. Over 60% of local searches happen on mobile, so your site is designed for phones and tablets before anything else." },
  { question: "Do you offer payment plans?", answer: "Yes. 50% upfront, 50% on completion is standard. Monthly plans are available for larger projects." },
  { question: "What guarantee do you offer?", answer: "100% schema validation guarantee. We put specific load time and accessibility scores in writing before you commit." },
];

const problemPoints = [
  {
    title: "Outdated websites that don't reflect your business",
    description: "Shepton Mallet has a strong community of independent businesses, from shops around the market cross to enterprises near the Royal Bath and West Showground. Too many are stuck with dated WordPress sites that load slowly and look like they were built a decade ago."
  },
  {
    title: "Invisible to AI search and voice assistants",
    description: "When someone asks ChatGPT 'Where can I find a good business in Shepton Mallet?' or uses voice search on their phone, your site needs structured data to appear. Most local sites don't have it, which means they're missing out entirely."
  },
  {
    title: "Paying too much for too little",
    description: "Bristol and Bath agencies charge premium rates but treat Shepton Mallet as an afterthought. You end up paying city prices for a generic site built by someone who has never set foot in the town."
  },
];

const solutionFeatures = [
  { title: "15 minutes from Shepton Mallet", description: "Based in Frome, local to Somerset, available for face-to-face meetings" },
  { title: "AI-ready from day one", description: "Schema markup, SSR, and structured content so AI platforms recommend your business" },
  { title: "Built for local businesses", description: "Designed for independent shops, service providers, and the businesses that make Shepton Mallet tick" },
  { title: "Fair pricing", description: "From £2,625. No Bristol agency markups for a Somerset town." },
];

const whatYouGetCards = [
  {
    title: "Professional Design",
    icon: Palette,
    items: [
      "Custom design reflecting your brand",
      "Mobile-first responsive layout",
      "Designed for local businesses",
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
      "Shepton Mallet local schema",
      "Citation building for Somerset",
      "Maps integration",
    ],
  },
];

const proofStats = [
  { value: 15, suffix: "+", label: "Somerset Clients" },
  { value: 1.4, suffix: "s", label: "Average Load Time" },
  { value: 89, suffix: "%", label: "AI Recommendation Rate" },
  { value: 4.9, suffix: "/5", label: "Client Satisfaction" },
];

const sheptonMalletTowns = [
  'Shepton Mallet Town Centre',
  'Pilton',
  'Glastonbury',
  'Wells',
  'Croscombe',
  'Doulting',
  'Evercreech',
  'Frome',
];

export default function WebDesignSheptonMalletPage() {
  return (
    <>
      <LandingHero
        badge="Shepton Mallet Web Design"
        badgeIcon={<MapPin className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="WEB DESIGN SHEPTON MALLET:"
        headline="AI-READY WEBSITES FOR LOCAL BUSINESSES"
        subheadline="AI-optimised websites for Shepton Mallet businesses, built by ScopeSite."
        bodyCopy={
          <>
            <p className="mb-4">
              Shepton Mallet is a town with real character. Home to the Royal Bath and West Showground, Kilver Court, and a proud cider heritage, it&apos;s a place where independent businesses matter. Your website should do that reputation justice.
            </p>
            <p className="mb-4">
              But looking good isn&apos;t enough any more. Your site needs to work for AI search too.
            </p>
            <p>
              When people ask ChatGPT or Google for local recommendations, structured data decides who gets mentioned. ScopeSite builds websites that get your Shepton Mallet business found by search engines, AI platforms, and voice assistants. We&apos;re based 15 minutes away in Frome, veteran-owned, and priced fairly.
            </p>
          </>
        }
      />

      <LandingProblem
        title="SHEPTON MALLET BUSINESSES DESERVE BETTER"
        intro="Shepton Mallet has a thriving local economy, but many businesses are being let down by their websites:"
        problems={problemPoints}
        conclusion={{
          title: "Shepton Mallet Deserves:",
          text: "Web design from someone local who understands the town, charges fairly, and builds for how people actually search in 2026."
        }}
      />

      <LandingSolution
        title="WEB DESIGN THAT WORKS FOR SHEPTON MALLET"
        features={solutionFeatures}
        layout="table"
      />

      <LandingWhatYouGet
        title="WHAT'S INCLUDED IN SHEPTON MALLET WEB DESIGN"
        cards={whatYouGetCards}
        columns={4}
      />

      <LandingAreasServed
        title="SERVING SHEPTON MALLET AND SURROUNDING AREAS"
        homeBase="Frome"
        towns={sheptonMalletTowns}
        theme="dark"
      />

      <LandingProof
        title="RESULTS FOR SOMERSET BUSINESSES"
        stats={proofStats}
        theme="light"
      />

      <LandingCaseStudy 
        title="See What AI-First Design Delivers"
        quote="A UK business went from invisible to #1 AI-recommended in 6 weeks using our V.O.I.C.E™ methodology"
        theme="dark" 
      />

      <LandingRelatedServices
        title="MORE SERVICES NEAR SHEPTON MALLET"
        services={[
          {
            title: "V.O.I.C.E™ AI Visibility",
            description: "Get recommended by ChatGPT, Perplexity, and AI assistants using our proprietary methodology.",
            href: "/voice"
          },
          {
            title: "Pricing",
            description: "Transparent pricing for all our web design packages.",
            href: "/pricing"
          },
          {
            title: "Web Design Somerset",
            description: "Our county-wide web design service for Somerset businesses.",
            href: "/web-design-somerset"
          },
        ]}
        theme="light"
      />

      <FAQSection
        title="SHEPTON MALLET WEB DESIGN: YOUR QUESTIONS ANSWERED"
        items={faqItems}
        theme="light"
      />

      <LandingCTA
        title="LET'S BUILD SOMETHING FOR SHEPTON MALLET"
        description="Get an instant quote in 60 seconds, or book a call for a proper conversation about what your Shepton Mallet business needs."
        footnote="No obligation • Transparent pricing • Veteran-owned"
      />
    </>
  );
}
