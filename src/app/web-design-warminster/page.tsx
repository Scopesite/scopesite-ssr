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
  { question: "Who does web design near Warminster?", answer: "ScopeSite is based 20 minutes away in Frome. We work with businesses across Warminster and Wiltshire, offering face-to-face meetings, local knowledge, and transparent pricing from £2,625." },
  { question: "How much does a website cost in Warminster?", answer: "Our packages start from £2,625 for a simple site. Most Warminster businesses invest between £5,000 and £9,000 depending on complexity. That's well below Bath and Salisbury agency rates." },
  { question: "Can you help my Warminster business get found online?", answer: "Yes. We build every site with AI visibility in mind. Structured schema markup, content designed for ChatGPT and voice assistants, plus local SEO so you appear in 'near me' searches around Warminster." },
  { question: "What makes your websites different from WordPress?", answer: "We build on Next.js, not WordPress. That means sub-2-second load times, 100/100 Lighthouse scores, and proper AI optimisation. Most Warminster businesses are still running slow WordPress sites that AI platforms can't read properly." },
  { question: "Do you understand the Warminster area?", answer: "Yes. We're based in Frome, just down the A362. We know Warminster's mix of local businesses, its military community, and the town's position between Bath and Salisbury. We build websites that reflect what makes the area unique." },
  { question: "How long does a web design project take?", answer: "Typically 4-6 weeks from brief to launch. We agree on a specific timeline upfront and stick to it." },
  { question: "Will you meet in person?", answer: "Absolutely. We're 20 minutes from Warminster and happy to meet at your premises or locally." },
  { question: "Do you help with local SEO for Warminster?", answer: "Yes. Local SEO is built into every project: Google Business Profile optimisation, local schema markup, citation building, and content structured for 'near me' searches." },
  { question: "Do you offer payment plans?", answer: "Yes. 50% upfront, 50% on completion is standard. Monthly plans available for larger projects." },
  { question: "What guarantee do you offer?", answer: "100% schema validation guarantee. Specific load time and accessibility scores in writing before you commit." },
];

const problemPoints = [
  {
    title: "Websites that don't reflect the quality of your business",
    description: "Warminster has a strong mix of independent shops, service businesses, and professionals serving the local and military communities. But many are stuck with dated WordPress sites that load slowly and fail to make a good first impression."
  },
  {
    title: "Invisible to AI search and voice assistants",
    description: "When someone asks ChatGPT for recommendations near Warminster, or uses a voice assistant to find a local service, your business needs structured data to appear. Most local websites lack schema markup entirely, so AI platforms skip over them."
  },
  {
    title: "Paying Bath or Salisbury prices for agencies that don't know Warminster",
    description: "Agencies in Bath and Salisbury charge premium rates and treat smaller Wiltshire towns as an afterthought. They don't understand Warminster's community, its military connections, or the businesses along the high street."
  },
];

const solutionFeatures = [
  { title: "20 minutes from Warminster", description: "Based in Frome, just down the A362, available for face-to-face meetings" },
  { title: "AI-first approach", description: "Your business gets recommended by ChatGPT and voice assistants" },
  { title: "Built for local businesses", description: "We understand Warminster and the wider Wiltshire area" },
  { title: "Fair pricing", description: "From £2,625. Not Bath agency rates for Warminster businesses" },
];

const whatYouGetCards = [
  {
    title: "Professional Design",
    icon: Palette,
    items: [
      "Custom design reflecting your brand",
      "Mobile-first responsive layout",
      "Conversion-optimised pages",
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
      "Warminster local schema",
      "Wiltshire citation building",
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

const warminsterAreas = [
  'Warminster Town Centre',
  'Westbury',
  'Frome',
  'Longleat',
  'Maiden Bradley',
  'Heytesbury',
  'Codford',
  'Sutton Veny',
];

export default function WebDesignWarminsterPage() {
  return (
    <>
      <LandingHero
        badge="Warminster Web Design"
        badgeIcon={<MapPin className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="WEB DESIGN WARMINSTER:"
        headline="WEBSITES BUILT FOR AI VISIBILITY"
        subheadline="AI-optimised websites for Warminster and Wiltshire businesses."
        bodyCopy={
          <>
            <p className="mb-4">
              Warminster sits between Bath and Salisbury, with a proud high street, a strong military community from the garrison, and local businesses that serve both the town and surrounding villages. Your website should do your business justice.
            </p>
            <p className="mb-4">
              But a good-looking site isn&apos;t enough on its own.
            </p>
            <p>
              Customers are asking ChatGPT, Google, and voice assistants to find local businesses. If your site isn&apos;t structured for AI search, you&apos;re invisible to them. ScopeSite builds websites that get Warminster businesses found by all of them. Based 20 minutes away in Frome, veteran-owned, and priced fairly.
            </p>
          </>
        }
      />

      <LandingProblem
        title="WARMINSTER BUSINESSES DESERVE BETTER"
        intro="Warminster has the businesses. The websites haven't caught up yet. Here's what we keep seeing:"
        problems={problemPoints}
        conclusion={{
          title: "Warminster Deserves:",
          text: "Web design from someone nearby who understands the area, charges fairly, and builds for how people actually search in 2026."
        }}
      />

      <LandingSolution
        title="WEB DESIGN THAT WORKS FOR WARMINSTER"
        features={solutionFeatures}
        layout="table"
      />

      <LandingWhatYouGet
        title="WHAT'S INCLUDED IN WARMINSTER WEB DESIGN"
        cards={whatYouGetCards}
        columns={4}
      />

      <LandingAreasServed
        title="SERVING WARMINSTER AND SURROUNDING AREAS"
        homeBase="Frome"
        towns={warminsterAreas}
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
        title="MORE SERVICES FOR WARMINSTER"
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
            title: "Web Design Frome",
            description: "Our home base. Web design for Frome and surrounding areas.",
            href: "/web-design-frome"
          },
        ]}
        theme="light"
      />

      <FAQSection
        title="WARMINSTER WEB DESIGN: YOUR QUESTIONS ANSWERED"
        items={faqItems}
        theme="light"
      />

      <LandingCTA
        title="LET'S BUILD SOMETHING FOR WARMINSTER"
        description="Get an instant quote in 60 seconds, or book a call for a proper conversation about what your Warminster business needs."
        footnote="No obligation • Transparent pricing • Veteran-owned"
      />
    </>
  );
}
