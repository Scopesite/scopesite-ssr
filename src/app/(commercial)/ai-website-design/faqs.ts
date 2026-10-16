import type { FAQItem } from '@/lib/schema';

// Shared by the visible FAQ and JSON-LD to prevent content drift.
export const faqItems: FAQItem[] = [
  {
    question: "What's the difference between AI website design and regular web design?",
    answer: "We build for the visitor and check how the website exposes its content to machines. That includes useful HTML, accurate schema and clear service information. These repairs make the site easier to inspect, but each provider still decides what to retrieve and recommend."
  },
  {
    question: "Will my website still look good to human visitors?",
    answer: "Absolutely. The AI optimisation happens in the code, not the design. Your visitors see a beautiful, fast, easy-to-use website. The AI layer works behind the scenes, making your content machine-readable without affecting the visual experience."
  },
  {
    question: "How long before I see results from AI-optimised design?",
    answer: "There is no reliable timetable for a citation or recommendation. We can check a technical repair as soon as it is live, then monitor dated searches and referrals over time. Results vary by provider, query, competition and the sources available to the assistant."
  },
  {
    question: "Do I need to replace my entire website?",
    answer: "Not always. If your current site is built on solid foundations, we can add the AI visibility layer without a complete rebuild. However, if you're on an older platform or have significant technical debt, a rebuild is often more cost-effective than retrofitting."
  },
  {
    question: "What's schema markup and why does it matter?",
    answer: "Schema describes business facts and relationships using a shared vocabulary. It can connect a service to its provider or a person to a real role. We check those facts against the page; each receiving system decides whether and how to use them."
  },
  {
    question: "Which AI platforms will my website work with?",
    answer: "We assess relevant search and retrieval routes for ChatGPT, Claude, Perplexity, Gemini and Google AI Overviews separately. Their behaviour differs. Clear HTML and accurate structured data are useful foundations, but neither guarantees a citation or the same result across providers."
  },
  {
    question: "How much does AI website design cost?",
    answer: "Published pricing starts at £1,875 for a small client-managed build, or £2,000 for our Ultra Fast AI visible build. Most fuller builds land around £4,000 to £8,000 after pages and add-ons. Use our instant quote calculator for a specific figure."
  },
  {
    question: "Can you add AI optimisation to my existing website?",
    answer: "Yes, if your platform supports custom code. We offer AI SEO tuning as a standalone service for existing websites. This adds schema markup, entity relationships, and AI crawler configuration without rebuilding your entire site."
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
    answer: "Search engines and AI assistants both form part of how people find information. We focus on accessible pages and accurate business facts, then measure the channels that matter to your buyers. A prediction about future AI adoption is not a substitute for evidence from your site."
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
