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
  { question: "Why choose a Somerset web designer for Burnham-on-Sea?", answer: "We're based in Frome, Somerset. We understand the coastal tourism market, the holiday park economy, and what Burnham-on-Sea businesses need. Local knowledge, fair pricing, and face-to-face meetings." },
  { question: "How much does web design for Burnham-on-Sea businesses cost?", answer: "Our packages start from £2,625. Most local businesses invest £5,000-£9,000. That's well below what Bristol or Exeter agencies charge for comparable work." },
  { question: "Do you understand Burnham-on-Sea's tourism market?", answer: "Yes. Burnham-on-Sea's economy is driven by coastal tourism, holiday parks, hospitality, and independent retail. We understand seasonal search patterns and how to keep your business visible year-round." },
  { question: "Can you help holiday parks and accommodation businesses?", answer: "Absolutely. Tourism and hospitality businesses benefit hugely from AI visibility. When someone asks ChatGPT 'Where to stay near Burnham-on-Sea?', proper schema markup determines whether your business gets mentioned." },
  { question: "What makes your approach different?", answer: "We build on Next.js, not WordPress. Our sites load in under 2 seconds, score 100/100 on Lighthouse, and are optimised for AI search platforms including ChatGPT, Perplexity, and voice assistants." },
  { question: "How long does a project take?", answer: "Typically 4-6 weeks from brief to launch. Specific timelines agreed upfront and respected." },
  { question: "Can you help with local SEO for Burnham-on-Sea?", answer: "Yes. Local SEO is part of every project: Google Business Profile optimisation, local schema markup, citation building, and content optimised for coastal tourism searches." },
  { question: "Do you offer ongoing support?", answer: "30 days post-launch support is included. Monthly maintenance packages from £150/month. We don't disappear after launch." },
  { question: "Do you offer payment plans?", answer: "Yes. 50% upfront, 50% on completion. Monthly plans available for larger projects." },
  { question: "What guarantee do you offer?", answer: "100% schema validation guarantee. Specific load time and accessibility scores in writing before you commit." },
];

const problemPoints = [
  {
    title: "Seasonal businesses stuck with year-round invisible websites",
    description: "Burnham-on-Sea's economy peaks in summer, but visitors start researching months before they arrive. If your website doesn't show up when tourists ask ChatGPT or Google about Burnham-on-Sea accommodation and activities, you're losing bookings before the season even starts."
  },
  {
    title: "Holiday parks with websites slower than dial-up",
    description: "Most holiday park and hospitality websites in the Burnham-on-Sea area are bloated WordPress builds with image galleries that take 5+ seconds to load. Visitors on mobile (most of them) bounce before they even see your pricing."
  },
  {
    title: "Local businesses paying Exeter or Bristol prices",
    description: "The nearest web agencies are in Bristol or Exeter, and they charge accordingly. Burnham-on-Sea businesses end up paying city agency rates for someone who doesn't know the difference between Highbridge and Huntspill."
  },
];

const solutionFeatures = [
  { title: "Based in Somerset", description: "Local to you, available for face-to-face meetings" },
  { title: "Tourism-ready AI optimisation", description: "Get recommended when visitors research Burnham-on-Sea" },
  { title: "Lightning-fast performance", description: "Sub-2-second load times on mobile, where your visitors browse" },
  { title: "Fair pricing", description: "From £2,625 - not Bristol or Exeter agency rates" },
];

const whatYouGetCards = [
  {
    title: "Professional Design",
    iconNode: <Palette className="w-6 h-6 text-brand-gold" />,
    items: [
      "Custom design for your brand",
      "Mobile-first responsive",
      "Tourism-optimised galleries",
      "Booking integration ready",
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
    title: "Local & Tourism SEO",
    iconNode: <Map className="w-6 h-6 text-brand-gold" />,
    items: [
      "Google Business Profile optimisation",
      "Coastal tourism schema",
      "Seasonal content strategy",
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

const burnhamAreas = [
  'Burnham-on-Sea',
  'Highbridge',
  'Berrow',
  'Brean',
  'Brent Knoll',
  'East Huntspill',
  'Bridgwater',
  'Weston-super-Mare',
];

export default function WebDesignBurnhamOnSeaPage() {
  return (
    <>
      <LandingHero
        badge="Burnham-on-Sea Web Design"
        badgeIcon={<MapPin className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="WEB DESIGN IN BURNHAM-ON-SEA"
        headline=""
        subheadline="AI-optimised websites for coastal tourism, hospitality, and local businesses."
        bodyCopy={
          <>
            <p className="mb-4">
              Burnham-on-Sea&apos;s economy runs on tourism, holiday parks, and the independent businesses that serve visitors and locals alike. Your website needs to work as hard as you do - especially during the months when visitors are planning their trips.
            </p>
            <p className="mb-4">
              The problem? Most Burnham-on-Sea businesses have websites that are slow, generic, and completely invisible to the AI tools visitors now use to plan their stays.
            </p>
            <p>
              ScopeSite builds AI-optimised websites that get Burnham-on-Sea businesses found by ChatGPT, Google, and voice assistants. Based in Frome, Somerset - not a distant city agency, but local enough for face-to-face meetings and fair pricing.
            </p>
          </>
        }
      />

      <LandingProblem
        title="BURNHAM-ON-SEA'S WEB DESIGN GAP"
        intro="Coastal towns like Burnham-on-Sea face unique digital challenges:"
        problems={problemPoints}
        conclusion={{
          title: "What Burnham-on-Sea Needs:",
          text: "A web design partner who understands coastal tourism, builds fast modern websites, and charges fairly. That's ScopeSite."
        }}
      />

      <LandingSolution
        title="WEB DESIGN BUILT FOR BURNHAM-ON-SEA"
        features={solutionFeatures}
        layout="table"
      />

      <LandingWhatYouGet
        title="WHAT'S INCLUDED FOR BURNHAM-ON-SEA BUSINESSES"
        cards={whatYouGetCards}
        columns={4}
      />

      <LandingAreasServed
        title="SERVING BURNHAM-ON-SEA AND THE COAST"
        homeBase="Frome"
        towns={burnhamAreas}
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
        title="MORE SERVICES FOR THE SOMERSET COAST"
        services={[
          {
            title: "V.O.I.C.E™ AI Visibility",
            description: "Get recommended by ChatGPT, Perplexity, and AI assistants using our proprietary methodology.",
            href: "/voice"
          },
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
            title: "Web Design Bristol",
            description: "Serving businesses across Bristol",
            href: "/web-design-bristol"
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
        title="BURNHAM-ON-SEA WEB DESIGN: YOUR QUESTIONS ANSWERED"
        items={faqItems}
        theme="light"
      />

      <LandingCTA
        title="LET'S GET BURNHAM-ON-SEA FOUND ONLINE"
        description="Get an instant quote in 60 seconds, or book a call for a proper conversation about what your business needs."
        footnote="No obligation • Transparent pricing • Veteran-owned"
      />
    </>
  );
}
