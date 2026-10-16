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
import { faqItems } from './faqs';
import { websiteEvidenceChecks as proofStats } from '@/lib/website-evidence-checks';

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
  { title: "Fair pricing", description: "From £1,875 or £2,000 Ultra Fast. Not Bath agency rates for Warminster businesses" },
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
      "Warminster local schema",
      "Wiltshire citation building",
      "Maps integration",
    ],
  },
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
        title="WHAT WE CHECK"
        stats={proofStats}
        theme="light"
      />

      <LandingCaseStudy 
        title="H4TLT case study"
        description="Read about our work with H4TLT, a workplace hearing surveillance provider."
        theme="dark" 
      />

      <LandingRelatedServices
        title="MORE SERVICES FOR WARMINSTER"
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
            title: "Web Design Frome",
            description: "Our home base. Web design for Frome and surrounding areas.",
            href: "/web-design-frome"
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
