'use client';

import { Search, Bot, FileCode, BarChart3, Eye, Mic, FileText, TrendingUp } from 'lucide-react';
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
} from '@/components/landing';
import { FadeInOnScroll } from '@/components/animations';

// FAQ Data
const faqItems = [
  {
    question: "What's the difference between traditional SEO and AI SEO?",
    answer: "Traditional SEO focuses on Google rankings through keywords, backlinks, and on-page optimisation. AI SEO focuses on getting recommended by AI platforms through schema markup, entity relationships, and content structure. Both matter, but they require different approaches. You can rank #1 on Google and still be invisible to ChatGPT."
  },
  {
    question: "How do you get ChatGPT to recommend my business?",
    answer: "ChatGPT uses structured data, entity recognition, and content signals to decide which businesses to recommend. We implement schema markup that explicitly describes your business, services, location, and credentials. We structure your content so ChatGPT can extract clear answers. And we ensure AI crawlers can access and understand your site."
  },
  {
    question: "How long does AI SEO take to show results?",
    answer: "Most clients see improvements in AI recommendations within 4-8 weeks. AI platforms re-crawl and update their understanding faster than traditional Google indexing. However, building strong entity recognition in knowledge graphs is an ongoing process that improves over time."
  },
  {
    question: "Do I still need traditional SEO if I do AI SEO?",
    answer: "Yes. Google isn't going away, and many people still use traditional search. AI SEO and traditional SEO complement each other - good schema markup helps Google too, and quality content works across all platforms. We recommend doing both, which is why our packages include elements of each."
  },
  {
    question: "What AI platforms do you optimise for?",
    answer: "We optimise for ChatGPT, Perplexity, Claude, Google's AI Overviews, Bing Copilot, and voice assistants including Siri, Alexa, and Google Assistant. Our approach uses universal structured data standards that work across all platforms rather than trying to game individual systems."
  },
  {
    question: "How do you measure AI SEO success?",
    answer: "We track direct AI mentions (when ChatGPT recommends you by name), voice search appearances, schema validation scores, and AI crawler access logs. We also benchmark against competitors' AI visibility. Traditional metrics like rankings and traffic matter too, but AI recommendation is our primary success metric."
  },
  {
    question: "What's the V.O.I.C.E™ methodology?",
    answer: "V.O.I.C.E™ stands for Voice Optimisation for Intelligent Conversational Engines. It's our proprietary framework for making businesses visible to AI platforms. It covers Vector Optimisation, Optimised Intelligence, Intelligent Architecture, Crawler Engineering, and Embedding Excellence - each addressing a different aspect of AI visibility."
  },
  {
    question: "How much does AI SEO cost?",
    answer: "AI SEO packages start from £750/month for ongoing optimisation. One-time implementations for smaller projects start from £1,500. The exact cost depends on your site's current state, competition level, and goals. Our quote calculator gives you a specific price based on your requirements."
  },
  {
    question: "Can you help with voice search specifically?",
    answer: "Yes. Voice search optimisation is a core part of our AI SEO services. We implement speakable schema markup, optimise content for conversational queries, and structure FAQ sections for voice assistant extraction. Voice search accounts for 58% of local searches - it's not optional anymore."
  },
  {
    question: "What if my industry is very competitive?",
    answer: "Competitive industries often benefit most from AI SEO because fewer competitors are doing it properly. While everyone fights over Google rankings, the AI recommendation space is relatively uncrowded. Getting in early on AI optimisation gives you an advantage that's hard for competitors to replicate quickly."
  },
  {
    question: "Do you work with e-commerce businesses?",
    answer: "Yes. E-commerce AI SEO includes Product schema, Offer schema, AggregateRating schema, and FAQ schema for product pages. We optimise for product-related AI queries like 'best X for Y' and 'where to buy Z'. The principles are the same, but the implementation is tailored to e-commerce needs."
  },
  {
    question: "What's included in your AI visibility audit?",
    answer: "Our audit checks how ChatGPT currently describes your business, your schema markup status, AI crawler access configuration, competitor AI visibility, voice search phrase opportunities, and knowledge graph presence. You get a detailed report with specific recommendations and priority actions."
  },
  {
    question: "How often do you report on results?",
    answer: "Monthly reports are standard, covering AI visibility metrics, schema validation status, new AI mentions detected, and recommendations for continued improvement. We also provide quarterly strategy reviews to adjust our approach based on results and any changes in the AI landscape."
  },
  {
    question: "Can AI SEO help with local business visibility?",
    answer: "Absolutely. Local businesses see some of the biggest gains from AI SEO because local searches are heavily shifting to voice assistants and AI. When someone asks 'Who's the best plumber near me?', proper LocalBusiness schema and entity relationships determine whether you get mentioned."
  },
  {
    question: "What makes your approach different from other AI SEO agencies?",
    answer: "Most agencies claiming to do AI SEO are just adding schema plugins and calling it done. We hand-code all schema markup, build proper entity relationships, validate against Schema.org standards (not just Google's limited tool), and actually test AI recommendations. Our 100% schema validation guarantee is unique in the industry."
  },
  {
    question: "Do I need a new website for AI SEO to work?",
    answer: "Not necessarily. If your current site allows custom code, we can implement AI optimisation without rebuilding. However, some platforms severely limit what's possible. During the audit, we'll tell you honestly whether your current setup can support proper AI SEO or if a rebuild makes more sense."
  },
  {
    question: "What guarantee do you offer?",
    answer: "We guarantee 100% schema validation against Schema.org standards. We also guarantee specific deliverables in writing before you commit - audit completion, schema implementation, and ongoing monitoring. We can't guarantee specific ChatGPT rankings (no one legitimately can), but we guarantee the work that creates visibility."
  },
];

// Problem points
const problemPoints = [
  {
    title: "Get you mentioned in AI-generated answers",
    description: "Traditional SEO can't make ChatGPT or Perplexity recommend you by name."
  },
  {
    title: "Make voice assistants recommend you",
    description: "58% of local searches happen through voice - and Siri doesn't care about your Google ranking."
  },
  {
    title: "Build entity recognition in knowledge graphs",
    description: "AI needs to understand what your business IS, not just find keywords on your pages."
  },
  {
    title: "Create the structured signals AI uses to evaluate trust",
    description: "You can be #1 on Google and completely invisible to AI. Thousands of businesses are discovering this the hard way."
  },
];

// V.O.I.C.E methodology table
const voiceMethodology = [
  {
    title: "V - Vector Optimisation",
    description: "Content structured for AI embedding and retrieval",
  },
  {
    title: "O - Optimised Intelligence",
    description: "Schema markup that tells AI exactly what you do",
  },
  {
    title: "I - Intelligent Architecture",
    description: "Site structure AI crawlers can navigate and understand",
  },
  {
    title: "C - Crawler Engineering",
    description: "Proper access for GPTBot, ClaudeBot, PerplexityBot",
  },
  {
    title: "E - Embedding Excellence",
    description: "Content that gets captured in AI training data",
  },
];

// Solution features
const solutionFeatures = [
  {
    title: "AI Visibility Audit",
    description: "Complete analysis of how AI currently sees your business",
    icon: Eye,
  },
  {
    title: "Schema Implementation",
    description: "15+ schema types with proper entity relationships",
    icon: FileCode,
  },
  {
    title: "Content Optimisation",
    description: "Restructuring content for AI extraction and voice search",
    icon: FileText,
  },
  {
    title: "Ongoing Monitoring",
    description: "Tracking AI mentions, voice search appearances, and recommendations",
    icon: BarChart3,
  },
];

// What you get cards
const whatYouGetCards = [
  {
    title: "AI Visibility Foundation",
    icon: Eye,
    items: [
      "Complete AI visibility audit",
      "ChatGPT recommendation testing",
      "Voice search phrase research",
      "Competitor AI visibility analysis",
      "Knowledge graph mapping",
    ],
  },
  {
    title: "Technical Implementation",
    icon: FileCode,
    items: [
      "Schema markup implementation",
      "Entity relationship engineering",
      "AI crawler configuration",
      "robots.txt and llms.txt optimisation",
      "Speakable markup for voice search",
    ],
  },
  {
    title: "Content Optimisation",
    icon: FileText,
    items: [
      "Content restructuring for AI extraction",
      "FAQ development for featured snippets",
      "Question-answer formatting",
      "Conversational keyword targeting",
      "Voice search phrase optimisation",
    ],
  },
  {
    title: "Monitoring & Reporting",
    icon: TrendingUp,
    items: [
      "Monthly AI visibility reports",
      "ChatGPT mention tracking",
      "Schema validation monitoring",
      "Voice search appearance tracking",
      "Competitor AI visibility benchmarking",
    ],
  },
];

// Proof stats
const proofStats = [
  { value: 89, suffix: "%", label: "ChatGPT Recommendation Rate", description: "of our clients get recommended by ChatGPT" },
  { value: 73, suffix: "%", label: "Voice Search Visibility", description: "improvement in voice search appearances" },
  { value: 15, suffix: "+", label: "Schema Types Implemented", description: "per client on average" },
  { value: 40, suffix: "+", label: "Client Industries", description: "different sectors optimised" },
];

export default function AISEOServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <LandingHero
        badge="AI Search Specialists"
        badgeIcon={<Search className="w-4 h-4 text-brand-gold" />}
        headlineHighlight="AI SEO SERVICES"
        headline="THAT MAKE AI RECOMMEND YOU"
        subheadline="Traditional SEO gets you ranked. AI SEO gets you recommended."
        bodyCopy={
          <>
            <p className="mb-4">
              Google isn&apos;t the only search engine anymore. ChatGPT answers questions. Perplexity provides research. Claude writes recommendations. Voice assistants tell people who to call.
            </p>
            <p className="mb-4">
              And none of them care about your keyword rankings.
            </p>
            <p>
              AI SEO is a completely different discipline. It&apos;s not about stuffing keywords into meta tags or building dodgy backlinks. It&apos;s about structuring your content so AI understands your expertise, trusts your business, and recommends you when someone asks for help.
            </p>
          </>
        }
      />

      {/* Problem Section */}
      <LandingProblem
        title="THE PROBLEM WITH TRADITIONAL SEO IN 2026"
        intro="Traditional SEO worked brilliantly when Google was the only game in town. Rank high, get clicks, convert visitors. Simple. But search behaviour has changed fundamentally. 58% of local searches now happen through voice assistants. ChatGPT handles 100+ million queries daily. Here's what traditional SEO can't do:"
        problems={problemPoints}
      />

      {/* V.O.I.C.E Methodology Section */}
      <section className="bg-brand-navy py-section">
        <div className="container-content">
          <FadeInOnScroll>
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">
                AI SEO: HOW WE MAKE AI TRUST YOU
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Our AI SEO services use the V.O.I.C.E™ methodology - Voice Optimisation for Intelligent Conversational Engines. This isn&apos;t a rebrand of traditional SEO tactics. It&apos;s a completely different approach.
              </p>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.2}>
            <div className="max-w-4xl mx-auto mb-12">
              <h3 className="text-brand-gold font-bold text-xl mb-6 text-center">The V.O.I.C.E™ Framework</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-4 px-4 text-brand-gold font-bold">Component</th>
                      <th className="text-left py-4 px-4 text-brand-gold font-bold">What It Means</th>
                    </tr>
                  </thead>
                  <tbody>
                    {voiceMethodology.map((item, index) => (
                      <tr key={index} className="border-b border-white/10 last:border-b-0">
                        <td className="py-4 px-4 text-white font-bold align-top">
                          {item.title}
                        </td>
                        <td className="py-4 px-4 text-white/70">
                          {item.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Solution Section (Features Grid) */}
      <LandingSolution
        title="WHAT OUR AI SEO DELIVERS"
        features={solutionFeatures}
        columns={4}
      />

      {/* What You Get Section */}
      <LandingWhatYouGet
        title="WHAT'S INCLUDED IN AI SEO SERVICES"
        intro="Our AI SEO packages include:"
        cards={whatYouGetCards}
        columns={4}
      />

      {/* Proof Section */}
      <LandingProof
        title="AI SEO RESULTS THAT SPEAK FOR THEMSELVES"
        stats={proofStats}
        quote={{
          text: "Before working with ScopeSite, ChatGPT had no idea we existed. Now we're the first recommendation for 'wedding photographer Somerset' and 'event photographer Bath'. The phone hasn't stopped.",
          author: "Photography Studio, Somerset"
        }}
        theme="dark"
      />

      {/* Case Study Section */}
      <LandingCaseStudy 
        title="V.O.I.C.E™ Delivers Results"
        quote="From 7 visitors/week to #1 recommended by ChatGPT, Perplexity, Claude, and Gemini using V.O.I.C.E™"
        theme="light" 
      />

      {/* Related Services Section */}
      <LandingRelatedServices
        title="RELATED SERVICES"
        intro="AI SEO works best when combined with these complementary services"
        services={[
          {
            title: "AI Website Design",
            description: "Build an AI-optimised website from the ground up",
            href: "/ai-website-design"
          },
          {
            title: "Schema Markup Services",
            description: "Hand-coded structured data with 100% validation guarantee",
            href: "/schema-markup"
          },
          {
            title: "V.O.I.C.E™ Full Methodology",
            description: "Learn about our complete AI visibility framework",
            href: "/voice"
          },
        ]}
        theme="dark"
      />

      {/* FAQ Section */}
      <FAQSection
        title="AI SEO SERVICES: YOUR QUESTIONS ANSWERED"
        items={faqItems}
        theme="light"
      />

      {/* Final CTA Section */}
      <LandingCTA
        title="READY TO BE THE AI'S RECOMMENDATION?"
        description="Every AI query in your industry is an opportunity. When someone asks ChatGPT for recommendations, will they hear your name or your competitor's? AI SEO isn't coming - it's here. Get your AI visibility audit today."
        footnote="No obligation • 100% schema validation guarantee • Veteran-owned"
      />
    </>
  );
}
