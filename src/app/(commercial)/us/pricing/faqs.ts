import type { FAQItem } from '@/lib/schema';

// Shared by the visible FAQ and JSON-LD to prevent content drift.
export const faqItems: FAQItem[] = [
  {
    question: 'Why is US pricing different from UK pricing?',
    answer:
      'US pricing reflects the American market. We benchmark against US-based AI visibility agencies, account for USD currency differences, and tailor our research to US search patterns and competitor data. The deliverables are the same high standard, but the pricing is set for the market you operate in.',
  },
  {
    question: 'Can I start with the audit and upgrade later?',
    answer:
      'Yes. Many US clients begin with the $2,500 AI Visibility Audit to understand where they stand. If you move to Tier 2 (AI-Ready Website) within 60 days, the full audit fee is credited toward your project cost.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept ACH bank transfers, wire transfers, and all major credit cards. All invoices are issued in USD. Payment terms are 50% upfront and 50% on completion for project work. Retainers are billed monthly in advance.',
  },
  {
    question: 'Is there a contract for the retainer?',
    answer:
      'The AI Visibility Retainer has a 3-month minimum commitment. After that, it rolls month-to-month with 30 days written notice to cancel. There are no long-term lock-ins or early termination fees after the initial period.',
  },
];
