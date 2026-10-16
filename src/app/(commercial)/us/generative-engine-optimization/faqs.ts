import type { FAQItem } from '@/lib/schema';

// Shared by the visible FAQ and JSON-LD to prevent content drift.
export const faqItems: FAQItem[] = [
  {
    question: "What is generative engine optimization?",
    answer: "Generative engine optimization is the practice of structuring your website, schema and content so that generative AI models (ChatGPT, Claude, Gemini and Perplexity) cite your business when someone asks a question in your field. Traditional SEO targets a list of ten blue links. GEO targets the one or two sources the model actually names in its answer."
  },
  {
    question: "What is the difference between GEO and SEO?",
    answer: "SEO addresses visibility in search results. GEO addresses how a business appears in generative answers and their citations. They share work on useful content, accessible pages and reliable business information. Provider-specific retrieval and answer checks show where extra work is needed."
  },
  {
    question: "What is the difference between GEO and AEO?",
    answer: "AEO (answer engine optimization) is about being the single extracted answer to a specific question. GEO (generative engine optimization) is broader, covering every technical and content signal that influences whether a generative model trusts and cites your brand. In practice the two overlap heavily, and most agency briefs use the terms interchangeably."
  },
  {
    question: "How do AI models decide which businesses to recommend?",
    answer: "There is no single published rulebook across providers. An answer can draw on model training, search results or retrieved pages, depending on the product and query. We make business facts clear and accessible, then test what each system actually retrieves and cites. Schema or a knowledge-graph entry alone does not secure a recommendation."
  },
  {
    question: "Do I need GEO if I already have SEO?",
    answer: "A useful first step is to check whether the searches and assistants your buyers use can find and represent your business accurately. Existing SEO may already support that. We address evidenced gaps in access, content and identity, then monitor the relevant AI answers separately."
  },
  {
    question: "Which AI platforms does generative engine optimization target?",
    answer: "We assess relevant search and retrieval routes for ChatGPT, Claude, Perplexity, Gemini and Google AI Overviews separately. Their behaviour differs. Clear HTML and accurate structured data are useful foundations, but neither guarantees a citation or the same result across providers."
  },
  {
    question: "How long does generative engine optimization take to work?",
    answer: "There is no reliable timetable for a citation or recommendation. We can check a technical repair as soon as it is live, then monitor dated searches and referrals over time. Results vary by provider, query, competition and the sources available to the assistant."
  },
  {
    question: "How much does a generative engine optimization agency cost?",
    answer: "Our GEO retainers start at $1,000 per month, covering ongoing schema maintenance, entity work, citation tracking and monthly reporting. A full AI-first website rebuild, if your current site blocks AI crawlers, starts at $3,500 as a one-off. The quote calculator at /us/pricing gives you an exact figure."
  }
];
