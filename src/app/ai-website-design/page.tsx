'use client';

import { Brain, Code2, Server, Shield, Zap, Bot, FileCode, HeadphonesIcon } from 'lucide-react';
import {
  LandingHero,
  LandingProblem,
  LandingSolution,
  LandingWhatYouGet,
  LandingProof,
  FAQSection,
  LandingCTA,
} from '@/components/landing';

// FAQ Data
const faqItems = [
  {
    question: "What's the difference between AI website design and regular web design?",
    answer: "Regular web design focuses on how humans see your site. AI website design focuses on how machines read it. We add schema markup, entity relationships, and structured content that AI platforms can understand. Without this, AI literally cannot recommend your business because it doesn't know what you do or where you operate."
  },
  {
    question: "Will my website still look good to human visitors?",
    answer: "Absolutely. The AI optimisation happens in the code, not the design. Your visitors see a beautiful, fast, easy-to-use website. The AI layer works behind the scenes, making your content machine-readable without affecting the visual experience."
  },
  {
    question: "How long before I see results from AI-optimised design?",
    answer: "Most clients see AI recommendation improvements within 4-8 weeks. AI platforms need time to re-crawl and process your new structured data. Unlike traditional SEO that can take 6-12 months, AI visibility tends to improve faster because the signals are clearer."
  },
  {
    question: "Do I need to replace my entire website?",
    answer: "Not always. If your current site is built on solid foundations, we can add the AI visibility layer without a complete rebuild. However, if you're on an older platform or have significant technical debt, a rebuild is often more cost-effective than retrofitting."
  },
  {
    question: "What's schema markup and why does it matter?",
    answer: "Schema markup is code that tells AI exactly what your content means. Instead of AI guessing that 'John Smith' is a person, schema explicitly states 'This is a person, they're the founder of this business, they offer these services.' Without schema, AI is guessing. With it, AI knows."
  },
  {
    question: "Which AI platforms will my website work with?",
    answer: "We optimise for ChatGPT, Perplexity, Claude, Google's AI Overviews, Bing Copilot, and voice assistants like Siri, Alexa, and Google Assistant. Our approach ensures compatibility across all major AI platforms because we follow universal structured data standards."
  },
  {
    question: "How much does AI website design cost?",
    answer: "Our AI website design packages start from £2,625 for a simple site. Most businesses invest between £5,000-£9,000 for a full AI-optimised website with all the bells and whistles. Use our instant quote calculator for a specific price based on your requirements."
  },
  {
    question: "Can you add AI optimisation to my existing website?",
    answer: "Yes, if your platform supports custom code. We offer V.O.I.C.E™ optimisation as a standalone service for existing websites. This adds schema markup, entity relationships, and AI crawler configuration without rebuilding your entire site."
  },
  {
    question: "What CMS do you use for AI websites?",
    answer: "We build on Next.js with server-side rendering, not WordPress. WordPress sites are slower, harder to optimise, and more vulnerable to security issues. Next.js gives us complete control over the code, faster load times, and better AI crawler access."
  },
  {
    question: "How do you measure AI visibility success?",
    answer: "We track direct AI mentions (when ChatGPT recommends you), schema validation scores, AI crawler access logs, and voice search appearances. We also monitor traditional metrics like rankings and traffic, but AI recommendation is the primary success metric."
  },
  {
    question: "Is AI website design just a fad?",
    answer: "The shift to AI-powered search is accelerating, not slowing. ChatGPT has over 100 million users. Voice search handles 58% of local queries. Google is integrating AI Overviews into search results. This isn't a trend - it's the new reality of how people find businesses."
  },
  {
    question: "What industries benefit most from AI website design?",
    answer: "Service businesses with local presence see the biggest gains - trades, professional services, healthcare, hospitality, and retail. Any business where people search 'best X near me' or 'who should I hire for Y' benefits from AI optimisation."
  },
  {
    question: "Do you offer ongoing maintenance?",
    answer: "Yes. Schema standards evolve, AI platforms update their algorithms, and your business changes. We offer maintenance packages that keep your AI visibility current and monitor for any issues. Most clients choose our monthly support option."
  },
  {
    question: "How is this different from traditional SEO?",
    answer: "Traditional SEO optimises for keyword rankings in Google's blue links. AI website design optimises for recommendation in AI answer engines. Both matter, but the AI side is growing faster. We include both in our approach because you need visibility everywhere."
  },
  {
    question: "What happens during the design process?",
    answer: "We start with an AI visibility audit of your current situation, then move to wireframes and design approval, development with schema implementation, testing across AI platforms, and finally launch with monitoring. The whole process typically takes 4-6 weeks."
  },
  {
    question: "Can I update the website myself after launch?",
    answer: "Yes. We provide training on how to update content while maintaining AI optimisation. For clients who prefer hands-off management, we offer content update services. Either way, you're never locked in or dependent on us."
  },
  {
    question: "What guarantee do you offer?",
    answer: "We guarantee 100% schema validation against Schema.org standards. If your markup doesn't validate, we fix it at no cost. We also guarantee specific load time and accessibility scores in writing before you commit."
  },
];

// Problem points
const problemPoints = [
  {
    title: "AI Can't Parse Your Content",
    description: "Your website's code is a mess of divs and spans that mean nothing to AI crawlers."
  },
  {
    title: "No Entity Recognition",
    description: "AI doesn't know your business is related to your industry, location, or services."
  },
  {
    title: "Zero Recommendation Potential",
    description: "Even if AI finds you, there's nothing signalling that you're worth recommending."
  },
];

// Solution features
const solutionFeatures = [
  {
    title: "Schema Engineering",
    description: "15+ schema types implemented correctly, validated against Schema.org standards",
    icon: FileCode,
  },
  {
    title: "Entity Mapping",
    description: "Your business connected to industry, location, and service entities AI recognises",
    icon: Brain,
  },
  {
    title: "Content Architecture",
    description: "Information structured for AI extraction and voice search responses",
    icon: Code2,
  },
  {
    title: "Crawler Optimisation",
    description: "GPTBot, ClaudeBot, and PerplexityBot welcomed and guided properly",
    icon: Bot,
  },
];

// What you get cards
const whatYouGetCards = [
  {
    title: "Technical Foundation",
    icon: Server,
    items: [
      "Server-side rendered Next.js build (not WordPress)",
      "Sub-2-second load times",
      "100% Lighthouse accessibility score",
      "Mobile-first responsive design",
      "HTTPS with proper security headers",
    ],
  },
  {
    title: "AI Visibility Layer",
    icon: Brain,
    items: [
      "Complete schema markup implementation",
      "Entity relationship mapping",
      "Structured data for all content types",
      "AI crawler access configuration",
      "robots.txt and llms.txt optimisation",
    ],
  },
  {
    title: "Conversion Engineering",
    icon: Zap,
    items: [
      "Clear calls-to-action throughout",
      "Form optimisation for higher completion",
      "Trust signals properly implemented",
      "Local business information schema",
      "Review and testimonial markup",
    ],
  },
  {
    title: "Ongoing Support",
    icon: HeadphonesIcon,
    items: [
      "Schema validation monitoring",
      "AI visibility tracking",
      "Monthly performance reports",
      "Priority support access",
      "Content update guidance",
    ],
  },
];

// Proof stats
const proofStats = [
  { value: 89, suffix: "%", label: "AI Recommendation Rate", description: "of our clients get recommended by ChatGPT" },
  { value: 1.4, suffix: "s", label: "Average Load Time", description: "faster than 94% of UK websites" },
  { value: 100, suffix: "%", label: "Schema Validation", description: "all markup validates against Schema.org" },
  { value: 4.9, suffix: "/5", label: "Client Satisfaction", description: "average rating across all projects" },
];

export default function AIWebsiteDesignPage() {
  return (
    <>
      {/* Hero Section */}
      <LandingHero
        badge="AI-First Design"
        badgeIcon={<Brain className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="AI WEBSITE DESIGN"
        headline="THAT ACTUALLY GETS FOUND"
        subheadline="Most websites are invisible to ChatGPT. Yours won't be."
        bodyCopy={
          <>
            <p className="mb-4">
              Here&apos;s the uncomfortable truth about your current website: ChatGPT doesn&apos;t know you exist.
            </p>
            <p className="mb-4">
              Neither does Perplexity. Or Claude. Or any of the AI platforms that are rapidly replacing traditional Google searches. Your beautifully designed website? To AI, it&apos;s just a mess of code it can&apos;t understand.
            </p>
            <p>
              AI website design isn&apos;t about making things look pretty with generative AI tools. It&apos;s about building websites that AI platforms can read, understand, and recommend to their users. That&apos;s what we do.
            </p>
          </>
        }
      />

      {/* Problem Section */}
      <LandingProblem
        title="YOUR WEBSITE'S INVISIBLE TO 73% OF SEARCHERS"
        intro="Voice search now accounts for 58% of local searches. AI-powered answer engines are handling 40% of informational queries. And that number's climbing every month."
        problems={problemPoints}
        conclusion={{
          title: "The Result:",
          text: "Someone asks ChatGPT 'Who's the best accountant in Bristol?' and your business doesn't even get mentioned. Not because you're not good enough. Because ChatGPT literally cannot understand your website."
        }}
      />

      {/* Solution Section */}
      <LandingSolution
        title="AI-FIRST DESIGN THAT MACHINES UNDERSTAND"
        intro="We don't just build websites. We engineer them for AI comprehension using our V.O.I.C.E™ methodology - Voice Optimisation for Intelligent Conversational Engines."
        features={solutionFeatures}
        columns={4}
      />

      {/* What You Get Section */}
      <LandingWhatYouGet
        title="WHAT'S INCLUDED IN AI WEBSITE DESIGN"
        intro="Every AI website we build includes:"
        cards={whatYouGetCards}
        columns={4}
      />

      {/* Proof Section */}
      <LandingProof
        title="THE NUMBERS DON'T LIE"
        stats={proofStats}
        quote={{
          text: "Within 3 weeks of launching our new site, we were being recommended by ChatGPT for 'best wedding photographer Somerset'. That never happened with our old site.",
          author: "Sarah Mitchell, Mitchell Wedding Photography"
        }}
        theme="dark"
      />

      {/* FAQ Section */}
      <FAQSection
        title="AI WEBSITE DESIGN: YOUR QUESTIONS ANSWERED"
        items={faqItems}
        theme="light"
      />

      {/* Final CTA Section */}
      <LandingCTA
        title="READY TO BE RECOMMENDED BY AI?"
        description="Every day you wait, your competitors are getting mentioned by ChatGPT instead of you. Every voice search, every AI query, every 'who should I hire' question - they're finding someone else. Let's fix that."
        footnote="No obligation • Transparent pricing • Veteran-owned"
      />
    </>
  );
}
