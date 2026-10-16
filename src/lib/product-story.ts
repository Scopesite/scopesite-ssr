/**
 * Product naming checked 16 October 2026 against the authorised CAFMO launch
 * and its live account, page, model-answer and review acceptance.
 * Keep agency services, legacy scanner credits and CAFMO subscriptions separate.
 */
export const CAFMO_PRODUCT_STORY = {
  name: 'CAFMO',
  expandedName: 'Can AI Find Me Online',
  url: 'https://canaifindme.online',
  applicationId: 'https://canaifindme.online/#application',
  legacyUrl: 'https://voice.scopesite.co.uk',
  description:
    'CAFMO means Can AI Find Me Online, ScopeSite’s live application for checking website pages, inspecting model answers and keeping a saved improvement plan. V.O.I.C.E. is the underlying methodology and engine name.',
  availability:
    'CAFMO is live at canaifindme.online with monthly plans. The earlier scanner remains at voice.scopesite.co.uk, with its existing accounts and credits kept separate. Purchased legacy credits do not expire and are not automatically converted into subscriptions.',
  measurement:
    'A page check examines the website evidence it can retrieve. Its findings do not give a percentage chance of an AI recommendation, or show that every assistant has searched for or cited your business.',
} as const;

export const AI_VISIBILITY_FAQS = [
  {
    question: 'What is the AI visibility methodology?',
    answer: 'V.O.I.C.E. is ScopeSite’s methodology for checking readable HTML, structured facts, crawler access and useful answers. We repair the problems we find and measure the result. An AI provider still decides what to retrieve and cite.',
  },
  { question: 'What is CAFMO, and where is the earlier scanner?', answer: `${CAFMO_PRODUCT_STORY.description} ${CAFMO_PRODUCT_STORY.availability}` },
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
    answer: 'ScopeSite’s pricing page sets out the agency’s AI SEO services and its terms page explains the AI Search Performance Guarantee. CAFMO lists its own monthly plans and terms at canaifindme.online. Agency services, CAFMO subscriptions and legacy scanner credits are separate purchases.',
  },
  {
    question: 'Is this only for Somerset businesses?',
    answer: 'ScopeSite is based near Frome in Somerset and works with businesses across the UK. Recruitment Web Design is our specialist website service for recruitment agencies.',
  },
];
