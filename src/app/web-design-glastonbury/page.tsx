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
  { question: "Why choose a local web designer near Glastonbury?", answer: "We're based in Frome, 25 minutes from Glastonbury. We understand the town's unique mix of tourism, independent retail, and creative businesses. Face-to-face meetings, local knowledge, and fair pricing." },
  { question: "How much does web design in Glastonbury cost?", answer: "Our packages start from £2,625 for a simple site. Most Glastonbury businesses invest £5,000-£9,000 depending on complexity. That's significantly below Bristol and Bath agency rates." },
  { question: "Do you understand Glastonbury's market?", answer: "Yes. Glastonbury has a unique economy driven by tourism, festivals, alternative health, independent retail, and creative industries. We've worked with businesses across these sectors and understand their specific needs." },
  { question: "Can you help tourism businesses in Glastonbury?", answer: "Absolutely. Tourism businesses benefit hugely from AI visibility. When someone asks ChatGPT 'What should I visit in Glastonbury?', proper schema markup and content structure determines whether your business gets mentioned." },
  { question: "What makes your web design different?", answer: "We build on Next.js, not WordPress. Our sites load in under 2 seconds, score 100/100 on Lighthouse, and are optimised for AI search platforms. Most Glastonbury businesses are still on slow WordPress sites." },
  { question: "How long does a Glastonbury web design project take?", answer: "Typically 4-6 weeks from brief to launch. We set a specific timeline and stick to it." },
  { question: "Will you meet in person?", answer: "Yes. We're 25 minutes from Glastonbury and happy to meet at your premises or a local spot." },
  { question: "Can you help with local SEO for Glastonbury?", answer: "Yes. Local SEO is built into every project: Google Business Profile optimisation, local schema markup, citation building, and content structured for 'near me' searches." },
  { question: "Do you offer payment plans?", answer: "Yes. 50% upfront, 50% on completion is standard. Monthly plans available for larger projects." },
  { question: "What guarantee do you offer?", answer: "100% schema validation guarantee. Specific load time and accessibility scores in writing before you commit." },
];

const problemPoints = [
  {
    title: "Generic templates that look like every other shop on the High Street",
    description: "Most Glastonbury businesses end up with WordPress sites that look identical to their neighbours. Same themes, same layouts, same slow load times. In a town that thrives on being unique, your website shouldn't look like a template."
  },
  {
    title: "Invisible to the tourists researching their trip",
    description: "Glastonbury draws visitors from across the world. They're asking ChatGPT, Google, and voice assistants 'What to do in Glastonbury' before they arrive. If your business isn't structured for AI search, you're invisible to these visitors before they even set foot in town."
  },
  {
    title: "Paying Bristol prices for someone who doesn't get Glastonbury",
    description: "Bristol agencies charge premium rates and treat Glastonbury as 'just another Somerset town'. They don't understand the festival economy, the pilgrimage tourism, or the independent creative scene that makes this market different."
  },
];

const solutionFeatures = [
  { title: "25 minutes from Glastonbury", description: "Based in Frome, local to Somerset, available for face-to-face meetings" },
  { title: "AI-first approach", description: "Your business gets recommended by ChatGPT and voice assistants" },
  { title: "Tourism-ready design", description: "Structured for the visitors researching before they arrive" },
  { title: "Fair pricing", description: "From £2,625 - not Bristol agency rates for Glastonbury businesses" },
];

const whatYouGetCards = [
  {
    title: "Professional Design",
    icon: Palette,
    items: [
      "Custom design reflecting your brand",
      "Mobile-first responsive",
      "Tourism-optimised layouts",
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
      "V.O.I.C.E\u2122 optimisation",
      "Voice search configuration",
      "ChatGPT recommendation testing",
    ],
  },
  {
    title: "Local SEO",
    icon: Map,
    items: [
      "Google Business Profile optimisation",
      "Glastonbury local schema",
      "Tourism-focused citation building",
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

const glastonburyAreas = [
  'Glastonbury Town Centre',
  'Street',
  'Wells',
  'Shepton Mallet',
  'Somerton',
  'Castle Cary',
  'Bruton',
  'Pilton',
];

export default function WebDesignGlastonburyPage() {
  return (
    <>
      <LandingHero
        badge="Glastonbury Web Design"
        badgeIcon={<MapPin className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="WEB DESIGN IN GLASTONBURY"
        headline=""
        subheadline="AI-optimised websites for Glastonbury's independent businesses."
        bodyCopy={
          <>
            <p className="mb-4">
              Glastonbury isn&apos;t like anywhere else. The town runs on tourism, independent retailers, creative studios, and businesses with stories worth telling. Your website should reflect that - not look like a generic template you could find anywhere.
            </p>
            <p className="mb-4">
              But it also needs to work harder than looking good.
            </p>
            <p>
              When visitors plan their trip to Glastonbury, they&apos;re asking ChatGPT and Google for recommendations. When locals search for services, voice assistants are answering. ScopeSite builds websites that get your Glastonbury business found by all of them. Based in Frome, 25 minutes away, veteran-owned, and priced fairly.
            </p>
          </>
        }
      />

      <LandingProblem
        title="GLASTONBURY BUSINESSES DESERVE BETTER"
        intro="Glastonbury's digital presence doesn't match its reputation. Here's what we keep seeing:"
        problems={problemPoints}
        conclusion={{
          title: "Glastonbury Deserves:",
          text: "Web design from someone who understands the town, charges fairly, and builds for how people actually search in 2026."
        }}
      />

      <LandingSolution
        title="WEB DESIGN THAT WORKS FOR GLASTONBURY"
        features={solutionFeatures}
        layout="table"
      />

      <LandingWhatYouGet
        title="WHAT'S INCLUDED IN GLASTONBURY WEB DESIGN"
        cards={whatYouGetCards}
        columns={4}
      />

      <LandingAreasServed
        title="SERVING GLASTONBURY AND SURROUNDING AREAS"
        homeBase="Frome"
        towns={glastonburyAreas}
        theme="dark"
      />

      <LandingProof
        title="RESULTS FOR SOMERSET BUSINESSES"
        stats={proofStats}
        theme="light"
      />

      <LandingCaseStudy 
        title="See What AI-First Design Delivers"
        quote="A UK business went from invisible to #1 AI-recommended in 6 weeks using our V.O.I.C.E\u2122 methodology"
        theme="dark" 
      />

      <LandingRelatedServices
        title="MORE SERVICES NEAR GLASTONBURY"
        services={[
          {
            title: "Web Design Somerset",
            description: "Our county-wide web design service",
            href: "/web-design-somerset"
          },
          {
            title: "SEO Somerset",
            description: "AI-powered search optimisation for Somerset",
            href: "/seo-somerset"
          },
          {
            title: "Web Design Bath",
            description: "Serving businesses across Bath and surrounds",
            href: "/web-design-bath"
          },
        ]}
        theme="light"
      />

      <FAQSection
        title="GLASTONBURY WEB DESIGN: YOUR QUESTIONS ANSWERED"
        items={faqItems}
        theme="light"
      />

      <LandingCTA
        title="LET'S BUILD SOMETHING FOR GLASTONBURY"
        description="Get an instant quote in 60 seconds, or book a call for a proper conversation about what your Glastonbury business needs."
        footnote="No obligation \u2022 Transparent pricing \u2022 Veteran-owned"
      />
    </>
  );
}
