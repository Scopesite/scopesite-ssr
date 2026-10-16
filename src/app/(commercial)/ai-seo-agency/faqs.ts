import type { FAQItem } from '@/lib/schema';

// Shared by the visible FAQ and JSON-LD to prevent content drift.
export const faqItems: FAQItem[] = [
  {
    question: "What is an AI SEO agency?",
    answer: "An AI SEO agency reviews how search and AI services can access and interpret information about a business. Our work includes readable content, accurate structured data and provider-specific access checks. Actual mentions and citations are measured separately; a technical repair does not guarantee a recommendation."
  },
  {
    question: "How is AI SEO different from traditional SEO?",
    answer: "Search visibility and AI answers overlap. An assistant may retrieve search results, fetch a page or answer from information already in its model. We check accessible content, factual clarity and entity relationships alongside ordinary SEO, then measure the actual answers separately."
  },
  {
    question: "Can my current website be optimised for AI search?",
    answer: "Often, yes. We inspect the HTML response, rendered page, access rules and existing structured data before recommending changes. A platform name alone does not tell us what a crawler receives. A rebuild needs an identified technical reason."
  },
  {
    question: "How long does it take to appear in AI recommendations?",
    answer: "There is no reliable timetable for a citation or recommendation. We can check a technical repair as soon as it is live, then monitor dated searches and referrals over time. Results vary by provider, query, competition and the sources available to the assistant."
  },
  {
    question: "Do you work with businesses outside Somerset?",
    answer: "Yes. We are based in Frome, Somerset, and work with businesses across the UK. The technical review is applied to your website, while answer checks need questions, locations and providers that are relevant to your market."
  },
  {
    question: "What does AI SEO cost?",
    answer:
      'Our standard AI SEO retainer is £500 per month with a £750 one-time setup. New AI-first website projects are priced separately — use the instant quote calculator on our pricing page.',
  },
  {
    question: "How do you measure AI SEO results?",
    answer: "We record actual citations and mentions using dated queries, provider names and whether web search was enabled. We also check referrals where analytics can identify them. Schema validation and crawler access are technical checks, not substitutes for those outcomes."
  },
  {
    question: "What AI platforms do you optimise for?",
    answer: "We assess relevant search and retrieval routes for ChatGPT, Claude, Perplexity, Gemini and Google AI Overviews separately. Their behaviour differs. Clear HTML and accurate structured data are useful foundations, but neither guarantees a citation or the same result across providers."
  }
];
