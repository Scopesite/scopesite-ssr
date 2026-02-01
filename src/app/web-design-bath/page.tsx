'use client';

import { MapPin, Palette, Server, Brain, Map } from 'lucide-react';
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
  { question: "Why choose a Somerset agency for Bath web design?", answer: "Because you get Bath-quality work without Bath-agency prices. We're 25 minutes away in Frome - close enough for face-to-face meetings, but without the overheads that Bath agencies bake into their quotes. Same expertise, better value." },
  { question: "How do your prices compare to Bath web design agencies?", answer: "Our packages start from £2,625. That's typically 40-60% less than comparable Bath agencies charge for similar (often inferior) work. We can charge less because we don't have Bath city centre rent built into our quotes." },
  { question: "Will you meet clients in Bath?", answer: "Absolutely. We're happy to meet anywhere in Bath - your office, a coffee shop, wherever works. We're just 25 minutes away and regularly meet Bath clients in person for consultations, design reviews, and training sessions." },
  { question: "What makes your web design different from Bath agencies?", answer: "Two things: AI optimisation and honest pricing. We build for ChatGPT and voice search visibility - something most Bath agencies don't understand. And we price based on actual work, not Bath postcode premiums." },
  { question: "Can you help Bath tourism businesses?", answer: "Yes. Tourism is a significant part of Bath's economy and we understand its specific needs - booking integration, seasonal content, multilingual considerations, and visibility for 'things to do in Bath' type searches." },
  { question: "How long does a Bath web design project take?", answer: "Typically 4-6 weeks from brief to launch. We give you a specific timeline upfront and we stick to it. No Bath agency vagueness about 'sometime next quarter'." },
  { question: "Do you understand Bath's business market?", answer: "Yes. Bath has a unique mix of heritage tourism, professional services (especially legal and financial), independent retail, and hospitality. We've worked with businesses across these sectors and understand what works locally." },
  { question: "What about ongoing support after launch?", answer: "30 days post-launch support is included with every project. After that, monthly maintenance packages start from £150/month. You're never abandoned after launch." },
  { question: "Can you help with existing Bath business websites?", answer: "Yes. We can either rebuild from scratch or add AI optimisation to existing sites if they're on compatible platforms. We'll assess your current site honestly and recommend the most cost-effective approach." },
  { question: "Do you offer payment plans?", answer: "Yes. Standard terms are 50% upfront, 50% on completion. For larger projects, we can arrange monthly payment plans that work for your cash flow." },
  { question: "What CMS do you use?", answer: "We build on Next.js with headless CMS options, not WordPress. This means faster sites, better security, and proper AI optimisation that WordPress simply can't achieve." },
  { question: "Can you help Bath businesses rank locally?", answer: "Yes. Local SEO is built into every project - Google Business Profile optimisation, local schema markup, citation building, and content structured for 'near me' and voice searches." },
  { question: "What industries in Bath do you work with?", answer: "We work across all industries but have particular experience with Bath professional services, tourism and hospitality, independent retail, and wellness businesses." },
  { question: "How do revisions work?", answer: "Two rounds of design revisions are included. Additional revisions are charged at £60/hour, but we're always transparent about when we're approaching that point." },
  { question: "Do you provide training?", answer: "Yes. Every project includes a recorded training session covering content updates, blog posts, and enquiry management. You'll be confident managing your site independently." },
  { question: "What guarantee do you offer?", answer: "100% schema validation guarantee. We also guarantee specific load time and accessibility scores in writing before you commit. If we don't deliver, we fix it at no cost." },
  { question: "Why shouldn't I just use a Bath agency?", answer: "You can - but you'll likely pay 40-60% more for similar or worse results. Bath agencies charge premium prices for their postcode, not their expertise. We charge for actual work delivered." },
];

// Problem points
const problemPoints = [
  {
    title: "A WordPress site built on a theme they use for everyone",
    description: "The typical Bath web agency charges £8,000-£15,000 for a website. For that money, you get a WordPress site, some custom colours and your logo, stock photography that appears on 47 other websites, zero AI optimisation, and ongoing fees to fix things that shouldn't break."
  },
  {
    title: "No AI optimisation - they've never heard of it",
    description: "Meanwhile, your website should load in under 2 seconds (theirs take 4-6), get recommended by ChatGPT (theirs are invisible), convert visitors into customers (theirs look pretty but don't perform), and actually be built custom, not themed."
  },
];

// Solution features
const solutionFeatures = [
  { title: "AI-First Development", description: "Your business gets recommended by ChatGPT, Perplexity, and voice assistants" },
  { title: "Next.js (Not WordPress)", description: "Sub-2-second load times, better security, no plugin nightmares" },
  { title: "Somerset Base", description: "Bath-quality service without Bath-agency overhead costs" },
  { title: "Military Precision", description: "Fixed quotes, met deadlines, no scope creep surprises" },
];

// What you get cards
const whatYouGetCards = [
  {
    title: "Premium Design",
    icon: Palette,
    items: [
      "Bespoke design (genuinely custom)",
      "Mobile-first responsive",
      "Professional typography",
      "Your brand, not a template",
      "Photography direction included",
    ],
  },
  {
    title: "Technical Excellence",
    icon: Server,
    items: [
      "Next.js server-side rendering",
      "Sub-2-second load times",
      "100% Lighthouse scores",
      "Enterprise-grade security",
      "GDPR compliance built-in",
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
      "AI crawler access setup",
    ],
  },
  {
    title: "Local SEO",
    icon: Map,
    items: [
      "Google Business Profile optimisation",
      "Bath-specific local schema",
      "Citation building",
      "Review management setup",
      "Maps integration",
    ],
  },
];

// Proof stats
const proofStats = [
  { value: 8, suffix: "+", label: "Bath Area Clients" },
  { value: 1.4, suffix: "s", label: "Average Load Time" },
  { value: 89, suffix: "%", label: "AI Recommendation Rate" },
  { value: 4.9, suffix: "/5", label: "Client Satisfaction" },
];

// Towns served
const bathAreas = [
  'Bath City Centre',
  'Lansdown',
  'Widcombe',
  'Bathwick',
  'Oldfield Park',
  'Keynsham',
  'Midsomer Norton',
  'Radstock',
  'Bradford-on-Avon',
];

export default function WebDesignBathPage() {
  return (
    <>
      {/* Hero Section */}
      <LandingHero
        badge="Bath's AI-First Alternative"
        badgeIcon={<MapPin className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="WEB DESIGN BATH:"
        headline="PREMIUM WITHOUT THE PRICE TAG"
        subheadline="Bath quality. Somerset prices. AI visibility included."
        bodyCopy={
          <>
            <p className="mb-4">
              Bath has no shortage of web design agencies. Most of them charge London rates for Bristol-quality work, talk endlessly about &quot;brand experiences&quot;, and deliver WordPress templates you could have bought for £47.
            </p>
            <p className="mb-4">
              We&apos;re the alternative.
            </p>
            <p>
              ScopeSite builds AI-optimised websites that actually get your Bath business recommended by ChatGPT and voice assistants. We&apos;re based just down the road in Frome, which means you get face-to-face service without Bath agency overheads baked into your quote.
            </p>
          </>
        }
      />

      {/* Problem Section */}
      <LandingProblem
        title="THE BATH WEB DESIGN MARKET IS BROKEN"
        intro="Bath's web design scene has a problem: agencies here think 'premium location' means 'premium prices', regardless of what they actually deliver."
        problems={problemPoints}
        conclusion={{
          text: "Bath businesses deserve better than overpriced templates dressed up as 'bespoke solutions'."
        }}
      />

      {/* Solution Section */}
      <LandingSolution
        title="BATH WEB DESIGN THAT'S ACTUALLY WORTH IT"
        intro="We understand Bath's market - the mix of tourism, professional services, retail, and hospitality that makes this city unique."
        features={solutionFeatures}
        layout="table"
      />

      {/* What You Get Section */}
      <LandingWhatYouGet
        title="WHAT'S INCLUDED IN BATH WEB DESIGN"
        cards={whatYouGetCards}
        columns={4}
      />

      {/* Areas Served */}
      <LandingAreasServed
        title="SERVING BATH AND SURROUNDING AREAS"
        towns={bathAreas}
        theme="dark"
      />

      {/* Proof Section */}
      <LandingProof
        title="BATH WEB DESIGN RESULTS"
        stats={proofStats}
        quote={{
          text: "After being quoted £12K by a Bath agency for basically a template, ScopeSite delivered a genuinely custom site for less than half that. And it actually gets us found on ChatGPT - something the expensive agency had never even mentioned.",
          author: "Professional Services Client, Bath"
        }}
        theme="light"
      />

      {/* FAQ Section */}
      <FAQSection
        title="BATH WEB DESIGN: YOUR QUESTIONS ANSWERED"
        items={faqItems}
        theme="light"
      />

      {/* Final CTA Section */}
      <LandingCTA
        title="BATH DESERVES BETTER WEB DESIGN"
        description="Stop overpaying for underwhelming websites. Get a quote that reflects actual work, not agency postcode premiums. See exactly what your Bath business website should cost - in 60 seconds."
        footnote="No obligation • Transparent pricing • Veteran-owned"
      />
    </>
  );
}
