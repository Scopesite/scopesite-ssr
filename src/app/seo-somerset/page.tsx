import { MapPin, Search, Brain, Shield, Map } from 'lucide-react';
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
  { question: "What does SEO in Somerset actually cost?", answer: "Our SEO work is built into every web design project. Standalone SEO audits start from £500. Ongoing SEO retainers from £300/month. We price based on work, not postcodes." },
  { question: "Do I need SEO if I already have a website?", answer: "If your website isn't showing up when someone Googles your service in Somerset, yes. And if ChatGPT doesn't mention you when asked about your industry locally, you're already behind." },
  { question: "What's the difference between SEO and AI optimisation?", answer: "Traditional SEO focuses on Google rankings. AI optimisation (what we call GEO and AEO) ensures your business gets recommended by ChatGPT, Perplexity, Claude, and voice assistants. We do both." },
  { question: "How long does SEO take to show results?", answer: "Technical SEO improvements (speed, schema, structure) show impact within weeks. Content-driven ranking improvements typically take 3-6 months. AI visibility improvements can happen faster because the field is less competitive." },
  { question: "Can you help with Google Business Profile?", answer: "Yes. GBP optimisation is part of every local SEO engagement. We optimise your profile, manage citations, and ensure NAP consistency across the web." },
  { question: "What is V.O.I.C.E. methodology?", answer: "V.O.I.C.E. stands for Visibility, Optimisation, for Intelligent, Crawler, Engines. It's our proprietary framework for making businesses visible to both traditional search engines and AI platforms." },
  { question: "Do you guarantee first page rankings?", answer: "No. Anyone who guarantees rankings is lying. What we guarantee is technically sound implementation: validated schema, fast load times, proper site structure, and AI-readable content." },
  { question: "Is local SEO different from national SEO?", answer: "Yes. Local SEO targets geographic searches ('plumber in Frome'), uses local schema markup, optimises Google Business Profile, and builds local citations. We specialise in Somerset local SEO." },
  { question: "Will AI search replace Google?", answer: "Not replace, but it's already changing how people find businesses. 58% of local searches now happen through voice. ChatGPT handles 100+ million queries daily. Businesses that optimise for both will win." },
  { question: "Can you audit my current SEO?", answer: "Yes. We offer a free AI visibility audit that checks your site's schema markup, load speed, AI crawler accessibility, and content structure. Book a call and we'll run it live." },
];

const problemPoints = [
  {
    title: "Your SEO agency is optimising for 2019",
    description: "Most SEO agencies in Somerset are still focused on keyword density, backlink schemes, and monthly reports full of vanity metrics. Meanwhile, your potential customers are asking ChatGPT and Perplexity for recommendations instead of scrolling through Google results."
  },
  {
    title: "AI doesn't know your business exists",
    description: "ChatGPT handles over 100 million queries daily. Voice assistants field 58% of local searches. If your website doesn't have proper schema markup, structured content, and AI-readable data, these platforms can't recommend you. Traditional SEO won't fix that."
  },
  {
    title: "Rankings aren't the whole picture anymore",
    description: "You could rank #1 on Google and still lose customers to a competitor that ChatGPT recommends first. The search landscape has changed. Somerset businesses need SEO that covers Google, AI platforms, and voice search."
  },
];

const solutionFeatures = [
  { title: "V.O.I.C.E™ AI Methodology", description: "Get recommended by ChatGPT, not just indexed by Google" },
  { title: "Technical SEO Foundation", description: "Schema markup, SSR, sub-2-second load times" },
  { title: "Local Search Dominance", description: "Google Business Profile, local citations, geographic targeting" },
  { title: "Transparent Reporting", description: "Metrics that matter, not vanity dashboards" },
];

const whatYouGetCards = [
  {
    title: "Technical SEO",
    iconNode: <Search className="w-6 h-6 text-brand-gold" />,
    items: [
      "Complete schema markup validation",
      "Site speed optimisation",
      "Mobile-first indexing",
      "Core Web Vitals tuning",
      "Crawl budget optimisation",
    ],
  },
  {
    title: "AI Visibility (GEO/AEO)",
    iconNode: <Brain className="w-6 h-6 text-brand-gold" />,
    items: [
      "ChatGPT recommendation testing",
      "V.O.I.C.E™ optimisation",
      "AI crawler configuration",
      "Structured data engineering",
      "Voice search optimisation",
    ],
  },
  {
    title: "Content & Authority",
    iconNode: <Shield className="w-6 h-6 text-brand-gold" />,
    items: [
      "Content structure for AI",
      "FAQ schema implementation",
      "Topic cluster strategy",
      "Internal linking architecture",
      "E-E-A-T signal strengthening",
    ],
  },
  {
    title: "Local SEO",
    iconNode: <Map className="w-6 h-6 text-brand-gold" />,
    items: [
      "Google Business Profile optimisation",
      "Somerset-specific local schema",
      "NAP consistency audit",
      "Local citation building",
      "Review management strategy",
    ],
  },
];

const proofStats = [
  { value: 15, suffix: "+", label: "Somerset Clients" },
  { value: 100, suffix: "/100", label: "Lighthouse Scores" },
  { value: 89, suffix: "%", label: "AI Recommendation Rate" },
  { value: 6, suffix: " weeks", label: "Average Time to AI Visibility" },
];

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

export default function SEOSomersetPage() {
  return (
    <>
      <LandingHero
        badge="Somerset SEO"
        badgeIcon={<MapPin className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="SEO SOMERSET:"
        headline="BUILT FOR AI SEARCH"
        subheadline="Search optimisation that goes beyond Google rankings."
        bodyCopy={
          <>
            <p className="mb-4">
              Somerset SEO has a problem. Most agencies here are still playing the same game they played five years ago: stuff keywords, buy links, send you a report you don&apos;t understand, and charge you monthly for the privilege.
            </p>
            <p className="mb-4">
              The search landscape has changed.
            </p>
            <p>
              ScopeSite delivers SEO services in Somerset that cover the full picture: Google rankings, AI recommendations, and voice search visibility. Our V.O.I.C.E™ methodology gets your business found by ChatGPT, Perplexity, and Google. Based in Frome, veteran-owned, and transparent about everything we do.
            </p>
          </>
        }
      />

      <LandingProblem
        title="SOMERSET SEO IS STUCK IN THE PAST"
        intro="Search engine optimisation in Somerset hasn't kept pace with how people actually search in 2026. Here's what's going wrong:"
        problems={problemPoints}
        conclusion={{
          title: "The Bottom Line:",
          text: "Somerset businesses need SEO that covers Google, AI platforms, and voice search. That's what V.O.I.C.E™ delivers."
        }}
      />

      <LandingSolution
        title="SEO THAT ACTUALLY WORKS IN 2026"
        intro="Our V.O.I.C.E™ methodology covers every way your customers search for businesses like yours:"
        features={solutionFeatures}
        layout="table"
      />

      <LandingWhatYouGet
        title="WHAT'S INCLUDED IN SOMERSET SEO"
        cards={whatYouGetCards}
        columns={4}
      />

      <LandingAreasServed
        title="SEO SERVICES ACROSS SOMERSET"
        homeBase="Frome"
        towns={somersetTowns}
        theme="dark"
      />

      <LandingProof
        title="SOMERSET SEO RESULTS"
        stats={proofStats}
        quote={{
          text: "We'd been paying an SEO agency £500/month for two years with nothing to show for it. ScopeSite rebuilt our site on Next.js, implemented proper schema markup, and within six weeks ChatGPT was recommending us. That's never happened before.",
          author: "Professional Services, Somerset"
        }}
        theme="light"
      />

      <LandingCaseStudy 
        title="V.O.I.C.E™ Gets Somerset Results"
        quote="From invisible to #1 AI-recommended in 6 weeks using our proprietary methodology"
        theme="dark" 
      />

      <LandingRelatedServices
        title="MORE SERVICES FOR SOMERSET"
        services={[
          {
            title: "V.O.I.C.E™ Methodology",
            description: "Our AI visibility framework explained in full",
            href: "/voice"
          },
          {
            title: "Web Design Somerset",
            description: "AI-first websites for Somerset businesses",
            href: "/web-design-somerset"
          },
          {
            title: "AI SEO Services",
            description: "National AI search optimisation services",
            href: "/ai-seo-services"
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
        title="SOMERSET SEO: YOUR QUESTIONS ANSWERED"
        items={faqItems}
        theme="light"
      />

      <LandingCTA
        title="GET FOUND BY AI AND GOOGLE"
        description="Stop paying for SEO that only targets half the search landscape. Get a free AI visibility audit and find out exactly where your Somerset business stands."
        footnote="No obligation • Free AI audit • Veteran-owned"
      />
    </>
  );
}
