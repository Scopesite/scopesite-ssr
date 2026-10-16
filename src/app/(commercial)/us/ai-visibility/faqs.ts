import { CAFMO_PRODUCT_STORY } from '@/lib/product-story';
import type { FAQItem } from '@/lib/schema';

// Shared by the visible FAQ and JSON-LD to prevent content drift.
export const faqItems: FAQItem[] = [
  {
    question: 'What does the AI visibility scan actually check?',
    answer:
      "A technical scan checks the website evidence it can retrieve, including content, structured data and access signals. A score does not show that an assistant searched for, cited or recommended your business. Those outcomes need separate, dated checks of actual answers.",
  },
  {
    question: 'Where can I check current scanner access?',
    answer:
      `${CAFMO_PRODUCT_STORY.availability} Check the existing scanner for current access and credit terms.`,
  },
  {
    question: 'What is Answer Engine Optimization?',
    answer:
      'Answer Engine Optimization (AEO) is the practice of structuring your website so AI platforms like ChatGPT, Perplexity, Google AI Overviews, and Claude can read, understand, and cite your content. It is different from traditional SEO. SEO gets you ranked in search results. AEO work aims to make information easier to find and use in answers. Providers decide what to retrieve and cite; recommendations are not guaranteed.',
  },
  {
    question: 'Can the AI visibility scanner check any website?',
    answer:
      "It can attempt to inspect a public website. Authentication, access restrictions, JavaScript dependencies and fetch failures can limit what it retrieves. A failed or partial scan should be recorded as a coverage gap rather than proof that the business is invisible to every AI system.",
  },
  {
    question: 'My site scores well on Google PageSpeed. Why would I need this?',
    answer:
      "PageSpeed Insights measures loading performance, layout stability and interactivity. Those results do not establish what an assistant retrieved or cited. A technical visibility scan checks different site evidence, while actual citations still need separate checks of the relevant assistant.",
  },
];
