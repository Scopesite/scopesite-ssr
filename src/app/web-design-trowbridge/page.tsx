import { MapPin, Palette, Server, Brain, Map } from 'lucide-react';
import { LandingHero } from '@/components/landing';
import {
  DynamicLandingProblem as LandingProblem,
  DynamicLandingSolution as LandingSolution,
  DynamicLandingWhatYouGet as LandingWhatYouGet,
  DynamicLandingProof as LandingProof,
  DynamicLandingRelatedServices as LandingRelatedServices,
  DynamicLandingCaseStudy as LandingCaseStudy,
  DynamicFAQSection as FAQSection,
  DynamicLandingCTA as LandingCTA,
  DynamicLandingAreasServed as LandingAreasServed,
} from '@/components/landing/below-fold-dynamic';

const faqItems = [
  { question: "Is there a good web designer near Trowbridge?", answer: "ScopeSite is based just 12 miles away in Frome. We work with businesses across Trowbridge and Wiltshire, offering face-to-face meetings, local knowledge, and transparent published pricing from £1,875 (client-managed) or £2,000 (Ultra Fast)." },
  { question: "How much does a website cost in Trowbridge?", answer: "Published pricing starts at £1,875 or £2,000. Most Trowbridge projects land around £4,000 to £8,000. That is well below typical Bath and Bristol quotes. Use our calculator for an exact figure." },
  { question: "Do you work with Wiltshire businesses?", answer: "Yes. Trowbridge is the county town of Wiltshire, and we serve businesses across the whole county. From Trowbridge itself to Melksham, Devizes, Bradford-on-Avon, and beyond." },
  { question: "What makes your websites different from WordPress?", answer: "We build on Next.js, not WordPress. That means sub-2-second load times, 100/100 Lighthouse scores, and proper AI optimisation. Most Trowbridge businesses are still running slow WordPress sites that AI platforms can't read properly." },
  { question: "Can you help my Trowbridge business get found on AI search?", answer: "Yes. We build every site with structured schema markup and content designed for AI platforms like ChatGPT, Perplexity, and voice assistants. When someone asks 'Who does web design near Trowbridge?', your business should be the answer." },
  { question: "How long does a web design project take?", answer: "Typically 4-6 weeks from brief to launch. We agree on a specific timeline upfront and stick to it." },
  { question: "Will you meet in person?", answer: "Absolutely. We're 12 miles from Trowbridge and happy to meet at your premises or locally." },
  { question: "Do you help with local SEO for Trowbridge?", answer: "Yes. Local SEO is built into every project: Google Business Profile optimisation, local schema markup, citation building, and content structured for 'near me' searches." },
  { question: "Do you offer payment plans?", answer: "Yes. 50% upfront, 50% on completion is standard. Monthly plans available for larger projects." },
  { question: "What guarantee do you offer?", answer: "100% schema validation guarantee. Specific load time and accessibility scores in writing before you commit." },
];

const problemPoints = [
  {
    title: "Slow, outdated websites that don't represent your business",
    description: "Trowbridge has a thriving local business community, from the Shires shopping park to independent retailers across the town centre. But too many are stuck with WordPress sites that load slowly, look dated, and fail to stand out."
  },
  {
    title: "Invisible to customers searching with AI",
    description: "When someone asks ChatGPT or a voice assistant for recommendations near Trowbridge, your business needs structured data to appear. Most local websites lack schema markup entirely, which means AI platforms skip over them."
  },
  {
    title: "Overpaying Bristol and Bath agencies who don't know the area",
    description: "Agencies in Bristol and Bath charge a premium and treat Wiltshire towns as an afterthought. They don't understand Trowbridge's local economy or the businesses that make the county town tick."
  },
];

const solutionFeatures = [
  { title: "12 miles from Trowbridge", description: "Based in Frome, local to the area, available for face-to-face meetings" },
  { title: "AI-first approach", description: "Your business gets recommended by ChatGPT and voice assistants" },
  { title: "Built for Wiltshire businesses", description: "We understand the local market and what works here" },
  { title: "Fair pricing", description: "From £1,875 or £2,000 Ultra Fast. Not Bristol agency rates for Trowbridge businesses" },
];

const whatYouGetCards = [
  {
    title: "Professional Design",
    iconNode: <Palette className="w-6 h-6 text-brand-gold" />,
    items: [
      "Custom design reflecting your brand",
      "Mobile-first responsive layout",
      "Conversion-optimised pages",
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
      "AI SEO tuning",
      "Voice search configuration",
      "ChatGPT recommendation testing",
    ],
  },
  {
    title: "Local SEO",
    iconNode: <Map className="w-6 h-6 text-brand-gold" />,
    items: [
      "Google Business Profile optimisation",
      "Trowbridge local schema",
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

const trowbridgeAreas = [
  'Trowbridge Town Centre',
  'Hilperton',
  'Staverton',
  'Bradford-on-Avon',
  'Melksham',
  'Westbury',
  'Devizes',
  'Frome',
];

export default function WebDesignTrowbridgePage() {
  return (
    <>
      <LandingHero
        badge="Trowbridge Web Design"
        badgeIcon={<MapPin className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="WEB DESIGN TROWBRIDGE:"
        headline="MODERN WEBSITES BUILT NEAR YOU"
        subheadline="AI-optimised websites for Trowbridge and Wiltshire businesses."
        bodyCopy={
          <>
            <p className="mb-4">
              Trowbridge is the county town of Wiltshire, with a strong local business community built around the Shires retail park, the town centre, and a growing number of independent traders. Your website should work as hard as you do.
            </p>
            <p className="mb-4">
              But looking good isn&apos;t enough any more.
            </p>
            <p>
              Customers are using ChatGPT, Google, and voice assistants to find local businesses. If your site isn&apos;t built for AI search, you&apos;re missing out. ScopeSite builds websites that get Trowbridge businesses found by all of them. Based just 12 miles away in Frome, veteran-owned, and priced fairly.
            </p>
          </>
        }
      />

      <LandingProblem
        title="TROWBRIDGE BUSINESSES DESERVE BETTER"
        intro="Trowbridge has the businesses. The websites haven't caught up yet. Here's what we keep seeing:"
        problems={problemPoints}
        conclusion={{
          title: "Trowbridge Deserves:",
          text: "Web design from someone nearby who understands the area, charges fairly, and builds for how people actually search in 2026."
        }}
      />

      <LandingSolution
        title="WEB DESIGN THAT WORKS FOR TROWBRIDGE"
        features={solutionFeatures}
        layout="table"
      />

      <LandingWhatYouGet
        title="WHAT'S INCLUDED IN TROWBRIDGE WEB DESIGN"
        cards={whatYouGetCards}
        columns={4}
      />

      <LandingAreasServed
        title="SERVING TROWBRIDGE AND SURROUNDING AREAS"
        homeBase="Frome"
        towns={trowbridgeAreas}
        theme="dark"
      />

      <LandingProof
        title="RESULTS FOR LOCAL BUSINESSES"
        stats={proofStats}
        theme="light"
      />

      <LandingCaseStudy 
        title="See What AI-First Design Delivers"
        quote="A UK business went from invisible to #1 AI-recommended in 6 weeks using our AI visibility methodology"
        theme="dark" 
      />

      <LandingRelatedServices
        title="MORE SERVICES FOR TROWBRIDGE"
        services={[
          {
            title: "AI visibility",
            description: "Get recommended by ChatGPT, Perplexity, and AI assistants using our proprietary methodology.",
            href: "/voice"
          },
          {
            title: "Pricing",
            description: "Transparent pricing for all our web design packages.",
            href: "/pricing"
          },
          {
            title: "AI Website Design",
            description: "Websites built from the ground up for AI search visibility.",
            href: "/ai-website-design"
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
        title="TROWBRIDGE WEB DESIGN: YOUR QUESTIONS ANSWERED"
        items={faqItems}
        theme="light"
      />

      <LandingCTA
        title="LET'S BUILD SOMETHING FOR TROWBRIDGE"
        description="Get an instant quote in 60 seconds, or book a call for a proper conversation about what your Trowbridge business needs."
        footnote="No obligation • Transparent pricing • Veteran-owned"
      />
    </>
  );
}
