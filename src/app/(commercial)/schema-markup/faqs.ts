import type { FAQItem } from '@/lib/schema';

// Shared by the visible FAQ and JSON-LD to prevent content drift.
export const faqItems: FAQItem[] = [
  {
    question: "What exactly is schema markup?",
    answer: "Schema markup describes people, organisations, services and other things using a shared vocabulary. We usually publish it as JSON-LD. It can state your business details and relationships explicitly, alongside the same facts on the page. Each receiving system decides whether and how to use it."
  },
  {
    question: "Why can't I just use a WordPress plugin for schema?",
    answer: "You can. A plugin can provide useful structured data when it represents the business accurately. We inspect its output for conflicting identities, missing relationships and unsupported claims, then extend or replace it where the evidence calls for a change. The generated markup matters more than the tool that produced it."
  },
  {
    question: "How do I know if my current schema is working?",
    answer: "Check the rendered JSON-LD with the Schema.org validator, then compare its facts and relationships with the visible page. Validation catches vocabulary problems; it does not prove factual accuracy, indexing or AI use. Google’s Rich Results Test is a separate check for Google-supported search features."
  },
  {
    question: "What's the difference between Google's validation tool and Schema.org validator?",
    answer: "The Schema.org validator checks markup against the shared vocabulary. Google’s Rich Results Test checks eligibility for the search features Google supports. We use both for their respective jobs. Neither tells us which properties another AI provider uses or whether it will cite the page."
  },
  {
    question: "How long does schema implementation take?",
    answer: "Typically 2-5 days depending on your site's complexity and how much existing schema needs fixing. Simple sites with clean code take less time. Sites with plugin-generated schema garbage or complex entity relationships take longer. We'll give you a specific timeline after auditing your current setup."
  },
  {
    question: "Will schema markup help my Google rankings?",
    answer: "Accurate structured data can help Google interpret content and make eligible pages available for supported search features. Validation alone does not establish a ranking benefit or guarantee a rich result. Other search and AI providers have their own systems, which need separate checks."
  },
  {
    question: "What platforms can you implement schema on?",
    answer: "Any platform that allows custom code injection: WordPress, Shopify, Wix, Squarespace, custom builds, Next.js, you name it. If you can add code to your site, we can implement schema. Some platforms make it easier than others, but none are impossible."
  },
  {
    question: "Do you fix existing broken schema?",
    answer: "Yes. We start every project with a full audit of existing schema. If there's salvageable work, we fix and extend it. If it's fundamentally broken (which is common with plugin-generated markup), we replace it entirely. Either way, you end up with working schema."
  },
  {
    question: "What's JSON-LD and why do you use it?",
    answer: "JSON-LD (JavaScript Object Notation for Linked Data) is the recommended format for schema markup. It sits in a script tag, separate from your visible content, making it easier to maintain and less likely to break. Google explicitly recommends JSON-LD over other formats like Microdata or RDFa."
  },
  {
    question: "How do entity relationships work in schema?",
    answer: "Stable @id references connect descriptions of the same entity. A Service can identify its provider, and an Organisation can identify its founder or brand. We use a separate LocalBusiness node only for a real business or branch. Serving a town does not create an office there."
  },
  {
    question: "What's speakable schema and do I need it?",
    answer: "Speakable markup identifies passages suitable for text-to-speech. Support depends on the receiving application. It is not a universal requirement for Siri, Alexa or AI recommendations. We check the intended use before adding it."
  },
  {
    question: "Can schema markup help with voice search?",
    answer: "Accurate business details and clear answers are useful for people and machines. Structured data can describe those facts explicitly, but voice assistants use different sources and retrieval systems. We check the relevant assistant rather than treating valid schema as proof of voice-search visibility."
  },
  {
    question: "What's your 100% validation guarantee?",
    answer: "If any schema we implement doesn't pass Schema.org validation, we fix it at no additional cost. No questions, no excuses. We stand behind our work because we know it's done properly. This guarantee is in writing before you commit."
  },
  {
    question: "Do you provide documentation of what you implement?",
    answer: "Yes. Every project includes full documentation explaining what schema types we implemented, how they're connected, where they're located in your code, and why we made specific decisions. You'll never be left wondering what we did or how to maintain it."
  },
  {
    question: "How much does schema markup implementation cost?",
    answer: "Standalone schema implementation starts from £750 for straightforward sites. Complex sites with multiple locations, services, or extensive existing schema issues cost more. Most projects fall between £750-£2,000. Our quote calculator gives you a specific price based on your requirements."
  },
  {
    question: "Will I need to update the schema over time?",
    answer: "Schema standards evolve slowly, so major updates are rare. However, when your business information changes (new services, updated hours, additional locations), the schema should be updated too. We offer maintenance packages or can train your team to make basic updates."
  },
  {
    question: "What if I'm already working with another SEO agency?",
    answer: "We work alongside other agencies all the time. Schema implementation is specialised work that most general SEO agencies outsource anyway. We can implement schema while your existing agency handles other aspects of your digital marketing. No conflict, no drama."
  },
];
