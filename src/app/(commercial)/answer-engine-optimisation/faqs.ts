import type { FAQItem } from '@/lib/schema';

// Shared by the visible FAQ and JSON-LD to prevent content drift.
export const faqItems: FAQItem[] = [
  {
    question: "What is answer engine optimisation (AEO)?",
    answer: "Answer Engine Optimisation (AEO) is the process of structuring your website and content so that AI-powered answer engines (like ChatGPT, Perplexity, and Claude) can easily extract facts and cite your business as the definitive answer to a user's question, rather than just providing a link to your site."
  },
  {
    question: "How is AEO different from SEO?",
    answer: "SEO addresses visibility in search results. AEO focuses on whether answer systems can find and use accurate answers to the questions buyers ask. The work overlaps, including readable pages and clear business facts. We assess each provider separately rather than assuming one universal ranking formula."
  },
  {
    question: "What is the difference between AEO and GEO?",
    answer: "AEO (Answer Engine Optimisation) and GEO (Generative Engine Optimisation) are often used interchangeably. Both focus on optimising for AI platforms rather than traditional search engines. At ScopeSite, we view AEO as the specific tactic of structuring content to be the 'answer', while GEO encompasses the broader technical architecture required for AI visibility."
  },
  {
    question: "Which AI platforms does AEO target?",
    answer: "We assess relevant search and retrieval routes for ChatGPT, Claude, Perplexity, Gemini and Google AI Overviews separately. Their behaviour differs. Clear HTML and accurate structured data are useful foundations, but neither guarantees a citation or the same result across providers."
  },
  {
    question: "How do I know if my business appears in AI answers?",
    answer: "Record the exact question, date, provider and whether web search was enabled, then save the answer and its source links. Repeat a defined set of buyer questions over time. A technical scan can identify site issues, but it cannot replace this record of actual answers."
  },
  {
    question: "Can AEO work alongside traditional SEO?",
    answer: "Yes. Readable content, clear business facts and accessible pages support both programmes of work. We check search visibility and AI answers separately, because a result in one does not prove a result in the other."
  },
  {
    question: "What technical changes does AEO require?",
    answer: "We first inspect the HTML, rendered page, structured data and crawler access. Repairs depend on what is wrong. Search, training and user-requested bots need separate consideration. An llms.txt file can provide a curated index for tools that use it, but we do not treat it as a universal requirement or evidence of a citation."
  },
  {
    question: "How much does answer engine optimisation cost?",
    answer:
      'Our standard AEO / AI SEO retainer is £500 per month with a £750 one-time setup. If your site needs a full AI-first rebuild, project pricing is on our pricing page via the instant quote calculator.',
  },
  {
    question: "What results can I expect from AEO?",
    answer: "There is no reliable timetable for a citation or recommendation. We can check a technical repair as soon as it is live, then monitor dated searches and referrals over time. Results vary by provider, query, competition and the sources available to the assistant."
  }
];
