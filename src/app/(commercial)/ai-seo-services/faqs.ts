import type { FAQItem } from '@/lib/schema';

// Shared by the visible FAQ and JSON-LD to prevent content drift.
export const faqItems: FAQItem[] = [
  {
    question: 'What AI SEO services do you offer?',
    answer:
      'We cover the full stack: AI visibility scans, Ultra Fast website rebuilds when needed, structured data so facts are auto-formatted for AI to read, entity signals, content layout for AI extraction, and crawler access files such as robots.txt, llms.txt, and ai-context.json.',
  },
  {
    question: 'Do I need a new website for AI SEO?',
    answer:
      "An audit comes first. We check what the initial HTML contains, how the rendered page behaves, whether access is blocked and whether the business facts are accurate. Many sites can be improved in place. A rebuild needs a specific technical or business reason.",
  },
  {
    question: 'What is an AI visibility scan?',
    answer:
      "A technical scan checks the website evidence it can retrieve, including content, structured data and access signals. A score does not show that an assistant searched for, cited or recommended your business. Those outcomes need separate, dated checks of actual answers.",
  },
  {
    question: 'How does structured data help AI find my business?',
    answer:
      'Structured data spells out services, prices, locations, and credentials in a machine-friendly way. That cuts guesswork for AI and search engines.',
  },
  {
    question: 'What is entity building and why does it matter?',
    answer:
      "We make the business’s identity consistent across its website and verified profiles, and describe real relationships in structured data. Third-party knowledge bases have their own inclusion rules. We do not promise a Wikidata entry or a Google Knowledge Graph listing.",
  },
  {
    question: 'Can you improve my existing Wix, WordPress, or Squarespace site?',
    answer:
      "We inspect the live implementation before deciding. These platforms can expose useful HTML and structured data, and many problems can be fixed in place. We recommend a rebuild only where identified limitations prevent the work the business needs.",
  },
  {
    question: 'What is an AI visibility retainer?',
    answer:
      'It is ongoing AI SEO: we watch citations, refresh structured data, add AI-friendly content, and adjust as models change. Standalone pricing is a £750 setup and £500 per month on a 6- or 12-month commitment.',
  },
  {
    question: 'How quickly will I see results?',
    answer:
      "There is no reliable timetable for a citation or recommendation. We can check a technical repair as soon as it is live, then monitor dated searches and referrals over time. Results vary by provider, query, competition and the sources available to the assistant.",
  },
];
