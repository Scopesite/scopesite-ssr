/**
 * Product naming checked 16 October 2026 against CAFMO-001, the public host,
 * and Scopesite/voice PR26 (b17da72). Updating this copy does not launch PR26.
 * Keep agency services, the legacy scanner and the replacement's plans separate.
 */
export const CAFMO_PRODUCT_STORY = {
  name: 'CAFMO',
  expandedName: 'Can AI Find Me Online',
  url: 'https://canaifindme.online',
  description:
    'CAFMO means Can AI Find Me Online. It is ScopeSite’s AI visibility product, currently being rebuilt. V.O.I.C.E. is the underlying methodology and engine name.',
  availability:
    'The public scanner still uses the earlier V.O.I.C.E. interface while the replacement CAFMO application is in development. Its existing account and credit arrangements are separate from the replacement’s future subscription plans.',
  measurement:
    'A technical scan checks the website evidence it can retrieve. Its score is not a percentage chance of an AI recommendation, and does not show that every assistant has searched for or cited your business.',
} as const;

export const AI_VISIBILITY_FAQS = [
  {
    question: 'What is the AI visibility methodology?',
    answer: 'V.O.I.C.E. is ScopeSite’s methodology for checking readable HTML, structured facts, crawler access and useful answers. We repair the problems we find and measure the result. An AI provider still decides what to retrieve and cite.',
  },
  { question: 'What is CAFMO, and why does the scanner still say V.O.I.C.E.?', answer: `${CAFMO_PRODUCT_STORY.description} ${CAFMO_PRODUCT_STORY.availability}` },
  { question: 'Does a scan prove that AI recommends my business?', answer: CAFMO_PRODUCT_STORY.measurement },
  {
    question: 'Who built the methodology?',
    answer: 'Dan Cartwright, founder of ScopeSite Digital Studios and a British Army veteran. ScopeSite builds websites and web systems for UK businesses, with recruitment agencies as its main focus.',
  },
  {
    question: 'How is this different from traditional SEO?',
    answer: 'Search visibility and AI answers overlap, but providers use different retrieval systems and sometimes answer without a fresh web search. We check the relevant routes separately, alongside the technical SEO work your site already needs.',
  },
  {
    question: 'Where can I see your client evidence?',
    answer: 'Our published H4TLT case study covers ScopeSite’s work with Hear 4 The Long Term, a workplace hearing surveillance business. Read the case study for the scope and evidence; it is not a promise of the same result for every business.',
  },
  {
    question: 'Where are the service prices and guarantee terms?',
    answer: 'ScopeSite’s pricing page sets out the agency’s AI SEO services and its terms page explains the AI Search Performance Guarantee. These are agency services, separate from scanner credits and any future CAFMO subscription.',
  },
  {
    question: 'Is this only for Somerset businesses?',
    answer: 'ScopeSite is based near Frome in Somerset and works with businesses across the UK. Recruitment Web Design is our specialist website service for recruitment agencies.',
  },
];
