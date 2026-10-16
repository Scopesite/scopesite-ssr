import type { FAQItem } from '@/lib/schema';

// Shared by the visible FAQ and JSON-LD to prevent content drift.
export const faqItems: FAQItem[] = [
  {
    question: 'What is server-side rendering and why does it matter for AI?',
    answer:
      "Server-side rendering delivers page content in the initial HTML. Client-side rendering can require JavaScript before that content appears. Search crawlers, user-requested fetches and browser agents have different capabilities, so we test the actual response and access rules. Delivering useful HTML reduces that dependency; it does not guarantee an AI recommendation.",
  },
  {
    question: 'Do you work with e-commerce sites?',
    answer:
      'Yes. We build custom e-commerce sites with Product, Offer, and Review schema markup so AI platforms can read your catalog, understand pricing, and surface your products in recommendations. E-commerce projects typically fall at the higher end of our Tier 2 pricing.',
  },
  {
    question: 'What CMS do you use?',
    answer:
      'We use headless CMS platforms like Ghost and Sanity, connected to a Next.js front end. This separates your content management from your presentation layer, giving you an easy editing experience while keeping your site fast, secure, and fully optimized for AI visibility.',
  },
  {
    question: 'How long does a typical project take?',
    answer:
      'A standard website build takes 6 to 8 weeks from kickoff to launch. Complex projects with custom functionality or large content migrations typically take 8 to 12 weeks. Our AI Visibility Audit is delivered within 5 business days.',
  },
];
