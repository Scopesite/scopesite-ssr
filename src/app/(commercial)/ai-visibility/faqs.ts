import type { FAQItem } from '@/lib/schema';

// Shared by the visible FAQ and JSON-LD to prevent content drift.
export const faqItems: FAQItem[] = [
  {
    question: 'What is AI visibility?',
    answer:
      'AI visibility is how well AI platforms understand, cite, and recommend your business. When someone asks ChatGPT or Perplexity for help in your market, your AI visibility decides if you are part of the answer.',
  },
  {
    question: 'How do I check if AI can find my business?',
    answer:
      "Test specific buyer questions in the relevant assistants and record the date, query, search mode, answer and citations. Use a technical website scan to investigate access or content problems separately. One answer or one score is not a complete baseline.",
  },
  {
    question: 'Why is my website not showing up in ChatGPT?',
    answer:
      'Often the site loads content with JavaScript after the page shell. AI crawlers may skip that step and see a blank page. Missing structured data, weak entity signals, or blocked crawlers are the other usual causes.',
  },
  {
    question: 'What does the AI visibility scan do?',
    answer:
      "A technical scan checks the website evidence it can retrieve, including content, structured data and access signals. A score does not show that an assistant searched for, cited or recommended your business. Those outcomes need separate, dated checks of actual answers.",
  },
  {
    question: 'Does AI visibility replace SEO?',
    answer:
      'No. Classic SEO targets rankings. AI visibility targets citations inside AI answers. The same technical work, fast HTML plus structured facts, helps both.',
  },
  {
    question: 'Which AI platforms matter?',
    answer:
      "We assess relevant search and retrieval routes for ChatGPT, Claude, Perplexity, Gemini and Google AI Overviews separately. Their behaviour differs. Clear HTML and accurate structured data are useful foundations, but neither guarantees a citation or the same result across providers.",
  },
  {
    question: 'How long does it take to become AI visible?',
    answer:
      "There is no reliable timetable for a citation or recommendation. We can check a technical repair as soon as it is live, then monitor dated searches and referrals over time. Results vary by provider, query, competition and the sources available to the assistant.",
  },
  {
    question: 'What is LLM visibility?',
    answer:
      'It is another name for AI visibility. It focuses on how large language models represent you in retrieval and answers.',
  },
  {
    question: 'Can I track AI visibility over time?',
    answer:
      'Yes. On retainers we monitor citations, schema health, crawler access, and reporting monthly. Standalone AI SEO is £750 setup and £500 per month on a 6- or 12-month commitment.',
  },
];
