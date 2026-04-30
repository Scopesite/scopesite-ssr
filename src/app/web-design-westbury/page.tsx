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
  { question: "Who is the best web designer near Westbury?", answer: "ScopeSite is based just 15 minutes away in Frome. We specialise in AI-optimised websites for local businesses, with 100/100 Lighthouse scores and structured schema markup as standard." },
  { question: "How much does a website cost for a small business in Westbury?", answer: "Our packages start from £2,625 for a simple site. Most Westbury businesses invest between £5,000 and £9,000 depending on complexity. That's well below what Bath or Salisbury agencies charge." },
  { question: "Do you serve Wiltshire as well as Somerset?", answer: "Yes. Westbury sits right on the Somerset/Wiltshire border, and we serve businesses across both counties. We're based in Frome, which is just 15 minutes from Westbury along the A362." },
  { question: "What technology do you use?", answer: "We build on Next.js with server-side rendering. No WordPress, no page builders. This gives you sub-2-second load times, 100/100 Lighthouse scores, and proper AI visibility." },
  { question: "What is AI-optimised web design?", answer: "AI-optimised means your site is built with structured schema markup, server-side rendering, and content designed to be understood by AI platforms like ChatGPT and Google AI Overviews. It's how local businesses get found in 2026." },
  { question: "How long does a web design project take?", answer: "Typically 4-6 weeks from brief to launch. We agree a specific timeline upfront and stick to it." },
  { question: "Can you help with local SEO for Westbury?", answer: "Yes. Local SEO is built into every project. That includes Google Business Profile optimisation, local schema markup, citation building, and content structured for 'near me' searches across Westbury and Wiltshire." },
  { question: "Will you meet in person?", answer: "Yes. We're 15 minutes from Westbury and happy to meet at your premises or a local spot. We also work with businesses along the A350 corridor, from Trowbridge to Warminster." },
  { question: "Do you offer payment plans?", answer: "Yes. 50% upfront, 50% on completion is standard. Monthly plans are available for larger projects." },
  { question: "What guarantee do you offer?", answer: "100% schema validation guarantee. We put specific load time and accessibility scores in writing before you commit." },
];

const problemPoints = [
  {
    title: "Generic websites that don't stand out in a competitive market",
    description: "Westbury sits on the A350 corridor between Trowbridge and Warminster. Businesses here compete with larger towns on both sides. A template WordPress site isn't going to cut it when your neighbours are investing in proper design."
  },
  {
    title: "Invisible to AI search and voice assistants",
    description: "When someone asks 'Find a good business near Westbury' through ChatGPT or a voice assistant, structured data determines who gets mentioned. Most Westbury business websites have no schema markup at all, which means they're missing out on an entirely new search channel."
  },
  {
    title: "Overpaying for agencies that don't know the area",
    description: "Bath and Salisbury agencies charge premium rates but treat Westbury as a pin on a map. You end up paying city prices for a generic site built by someone who doesn't understand the local market or the Wiltshire/Somerset border economy."
  },
];

const solutionFeatures = [
  { title: "15 minutes from Westbury", description: "Based in Frome, right across the county border, available for face-to-face meetings" },
  { title: "AI-optimised as standard", description: "Schema markup, SSR, and structured content so AI platforms recommend your business" },
  { title: "Built for Wiltshire businesses", description: "Designed for the local businesses along the A350 corridor and beyond" },
  { title: "Fair pricing", description: "From £2,625. No Bath or Salisbury agency markups." },
];

const whatYouGetCards = [
  {
    title: "Professional Design",
    iconNode: <Palette className="w-6 h-6 text-brand-gold" />,
    items: [
      "Custom design reflecting your brand",
      "Mobile-first responsive layout",
      "Designed for local businesses",
      "Professional photography guidance",
    ],
  },
  {
    title: "Technical Excellence",
    iconNode: <Server className="w-6 h-6 text-brand-gold" />,
    items: [
      "Next.js server-side rendering",
      "Sub-2-second load times",
      "100% Lighthouse accessibility",
      "SSL security certificate",
    ],
  },
  {
    title: "AI Visibility",
    iconNode: <Brain className="w-6 h-6 text-brand-gold" />,
    items: [
      "Complete schema markup",
      "V.O.I.C.E™ optimisation",
      "Voice search configuration",
      "ChatGPT recommendation testing",
    ],
  },
  {
    title: "Local SEO",
    iconNode: <Map className="w-6 h-6 text-brand-gold" />,
    items: [
      "Google Business Profile optimisation",
      "Westbury and Wiltshire local schema",
      "Citation building across both counties",
      "Maps integration",
    ],
  },
];

const proofStats = [
  { value: 15, suffix: "+", label: "Local Clients" },
  { value: 1.4, suffix: "s", label: "Average Load Time" },
  { value: 89, suffix: "%", label: "AI Recommendation Rate" },
  { value: 4.9, suffix: "/5", label: "Client Satisfaction" },
];

const westburyTowns = [
  'Westbury Town Centre',
  'Warminster',
  'Trowbridge',
  'Frome',
  'Bratton',
  'Dilton Marsh',
  'Chapmanslade',
  'Steeple Ashton',
];

export default function WebDesignWestburyPage() {
  return (
    <>
      <LandingHero
        badge="Westbury Web Design"
        badgeIcon={<MapPin className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="WEB DESIGN WESTBURY:"
        headline="PROFESSIONAL WEBSITES FOR WILTSHIRE BUSINESSES"
        subheadline="AI-optimised websites for Westbury businesses, built by ScopeSite."
        bodyCopy={
          <>
            <p className="mb-4">
              Westbury is a growing Wiltshire town with a strong local economy. From businesses near the famous White Horse to shops in the town centre and enterprises along the A350 corridor towards Trowbridge, there&apos;s real ambition here. Your website should match it.
            </p>
            <p className="mb-4">
              But a good-looking site isn&apos;t enough on its own any more.
            </p>
            <p>
              When people search for local services, they&apos;re increasingly asking AI assistants and voice search for answers. Structured data and proper markup decide who gets recommended. ScopeSite builds websites that get your Westbury business found by search engines, AI platforms, and voice assistants. We&apos;re based just 15 minutes away in Frome, veteran-owned, and priced fairly.
            </p>
          </>
        }
      />

      <LandingProblem
        title="WESTBURY BUSINESSES DESERVE BETTER"
        intro="Westbury's local businesses are being let down by their online presence. Here's what we keep seeing:"
        problems={problemPoints}
        conclusion={{
          title: "Westbury Deserves:",
          text: "Web design from someone nearby who understands the local market, charges fairly, and builds for how people actually search in 2026."
        }}
      />

      <LandingSolution
        title="WEB DESIGN THAT WORKS FOR WESTBURY"
        features={solutionFeatures}
        layout="table"
      />

      <LandingWhatYouGet
        title="WHAT'S INCLUDED IN WESTBURY WEB DESIGN"
        cards={whatYouGetCards}
        columns={4}
      />

      <LandingAreasServed
        title="SERVING WESTBURY AND SURROUNDING AREAS"
        homeBase="Frome"
        towns={westburyTowns}
        theme="dark"
      />

      <LandingProof
        title="RESULTS FOR LOCAL BUSINESSES"
        stats={proofStats}
        theme="light"
      />

      <LandingCaseStudy 
        title="See What AI-First Design Delivers"
        quote="A UK business went from invisible to #1 AI-recommended in 6 weeks using our V.O.I.C.E™ methodology"
        theme="dark" 
      />

      <LandingRelatedServices
        title="MORE SERVICES NEAR WESTBURY"
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
            title: "Web Design Trowbridge",
            description: "Web design for businesses in neighbouring Trowbridge.",
            href: "/web-design-trowbridge"
          },
          {
            title: "Generative Engine Optimisation",
            description: "Get cited by ChatGPT, Claude, Gemini and Perplexity, not just ranked on Google.",
            href: "/generative-engine-optimisation"
          },
        ]}
        theme="light"
      />

      <FAQSection
        title="WESTBURY WEB DESIGN: YOUR QUESTIONS ANSWERED"
        items={faqItems}
        theme="light"
      />

      <LandingCTA
        title="LET'S BUILD SOMETHING FOR WESTBURY"
        description="Get an instant quote in 60 seconds, or book a call for a proper conversation about what your Westbury business needs."
        footnote="No obligation • Transparent pricing • Veteran-owned"
      />
    </>
  );
}
