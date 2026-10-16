import type { GhostPost } from '@/lib/ghost';
import { CAFMO_PRODUCT_STORY } from '@/lib/product-story';

/**
 * Repository-owned corrections to three published legacy scanner articles.
 * Applied centrally before cards, metadata, article HTML and extracted schema.
 * Ghost Content API is read-only; the original CMS articles remain historical.
 * Retire each override after its corrected copy is reconciled in Ghost.
 * Source receipt: docs/product-story-reconciliation-2026-10-16.md.
 */
const REVIEW_DATE = '2026-10-16T19:50:00.000Z';
const status = `<h2>CAFMO and the earlier scanner</h2>
<p>${CAFMO_PRODUCT_STORY.description} ${CAFMO_PRODUCT_STORY.availability}</p>
<p>${CAFMO_PRODUCT_STORY.measurement}</p>
<p>Use <a href="https://canaifindme.online/pricing">CAFMO’s monthly plans</a> for the live application, or the <a href="https://voice.scopesite.co.uk/pricing">earlier scanner’s pricing page</a> for existing credits. ScopeSite’s <a href="https://scopesite.co.uk/pricing">agency services</a> are a separate purchase.</p>`;
const notice = `<p><strong>Updated 16 October 2026.</strong> This revision replaces the older product and competitor comparison. Previous per-scan prices and “cheapest” claims are not a current CAFMO subscription offer.</p>`;
const sources = `<h2>Sources and further checks</h2><ul>
<li><a href="https://developers.openai.com/api/docs/bots">OpenAI crawler roles and controls</a></li>
<li><a href="https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler">Anthropic crawler roles and controls</a></li>
<li><a href="https://docs.perplexity.ai/docs/resources/perplexity-crawlers">Perplexity crawler and user-fetch guidance</a></li>
<li><a href="https://llmstxt.org/">The llms.txt proposal</a></li>
<li><a href="https://recruitmentwebdesign.com/explainers/ai-discovery">Recruitment Web Design: a practical multi-provider discovery method</a></li>
</ul>`;

type Correction = { title: string; description: string; html: string };
const corrections: Record<string, Correction> = {
  'ai-visibility-scan-cost': {
    title: 'What does an AI visibility scan cost, and what are you buying?',
    description: 'Compare technical audits, observed AI answers and ongoing monitoring by their actual scope. Includes the current CAFMO and earlier scanner distinction.',
    html: `${notice}
<p class="key-takeaway">The useful price is the cost of the work you need, with its coverage and limits attached. A page audit, one answer to one prompt and a month of repeated monitoring are different units. Dividing each subscription by a number labelled “credits” will not make them equivalent.</p>
<p>A recruitment agency owner wants to know whether the website helps employers find the right desk. The software catalogue offers a score, a graph, a report and six ways to spend a credit. Somewhere between those things, somebody needs to explain what was actually checked.</p>
<h2>Start with the question the purchase should answer</h2>
<p>If the problem is whether your website exposes its services, company details and vacancy information clearly, start with a technical audit. Its scope should identify the URLs fetched, whether scripts were rendered, which facts were extracted and which checks could not run.</p>
<p>If you want to know whether an assistant names your agency when asked for a supplier, you need recorded answers. Ask which consumer product or API was used, the exact prompts, country or location, dates, cited sources and repeat frequency. An API response and a signed-in consumer session can be different observations.</p>
<p>If the question is whether the work creates useful enquiries, website analytics and the enquiry record have to join the discussion. A citation count will not tell you whether the caller needed a recruitment partner or wanted to sell you printer toner.</p>
<h2>Compare the bill against the same unit</h2>
<p>Write down the total charge for the period, the useful checks included, limits per domain, the number of providers and the repeat schedule. Check whether failed requests consume an allowance and whether reports, exports or extra users cost more. Record renewal and cancellation terms from the actual offer.</p>
<p>For a one-off website audit, compare the total price and the work required to act on it. For monitoring, compare the same set of questions, providers and dates over the same period. “One prompt” might be a saved question run repeatedly; “one scan” might inspect a single URL. Treating both as one check creates arithmetic with a very confident face.</p>
<p>Unused capacity matters too. A large allowance has little practical value if you only need a small number of checks, while a low entry price can become expensive when every useful export is another purchase. None of this establishes a universal cheapest tool.</p>
${status}
<h2>What should a useful report contain?</h2>
<ul><li>The exact pages or questions checked, with dates and sources.</li><li>A distinction between observed facts, estimated metrics and generated suggestions.</li><li>Explicit unavailable or failed checks, rather than a reassuring zero.</li><li>Repairs linked to the evidence they address, with enough detail to review the recommendation.</li><li>A way to repeat the measurement after a change without changing the question halfway through.</li></ul>
<p>For recruitment work, start with the employer service page, the relevant sector page and a genuine vacancy journey. Our <a href="https://recruitmentwebdesign.com/ai-search-visibility">recruitment AI visibility service</a> explains how those checks fit the website build and its existing ATS.</p>
<h2>Does paying more guarantee an AI recommendation?</h2>
<p>No. Better evidence and broader monitoring can improve the information available to you. Each provider still decides what to retrieve and cite, and answers vary. Buy a defined investigation or repair, then measure the outcome you care about.</p>
${sources}`,
  },
  'cheapest-ai-visibility-checker': {
    title: 'How to compare AI visibility checkers before paying for one',
    description: 'A practical comparison checklist for evidence, coverage, access, reporting and cost, with the distinction between CAFMO and the earlier scanner.',
    html: `${notice}
<p class="key-takeaway">Compare tools on the same job: technical website evidence, observed assistant answers or repeated monitoring. Ask to see the evidence behind the score before comparing the price. ScopeSite is not making a current market-wide “cheapest” claim.</p>
<p>A dashboard can produce a splendid number without answering the question you asked. For a recruitment director, the question might be whether hiring managers can find the engineering desk, understand its experience and get hold of someone. A large green circle needs rather more explanation than its colour.</p>
<h2>What did the tool actually inspect?</h2>
<p>A technical checker might fetch the initial HTML, render the page in a browser, inspect robots rules or ask a third-party service for metrics. Those methods see different things. A browser-rendered audit does not prove that a crawler which skips scripts received the same content.</p>
<p>Ask for the checked URLs, the fetch method and the time of the check. If the tool inspected a homepage, its findings should not become a verdict on every vacancy page, every subdomain and the entire business.</p>
<h2>What does “AI mentions” mean?</h2>
<p>It might mean an actual saved answer from an assistant, a search result containing your name, or a model assessing a supplied list of URLs. Each can be useful, but the report needs to identify which happened. A model judging candidate pages has not thereby reproduced the answer a hiring manager saw in ChatGPT.</p>
<p>Look for the prompt, provider, product or API, date, visible answer and cited sources. A mention and a citation are separate observations. Neither proves a visit or an enquiry, and a citation does not expose every step of the provider’s retrieval process.</p>
<h2>Can you investigate a poor result?</h2>
<p>Useful findings point to something you can inspect. A blocked request needs its status and route. A contradictory business name needs the conflicting page or field. A schema issue needs the relevant markup and validation context. “Improve your authority” is a particularly economical report to produce.</p>
<p>Generated fixes also need review. Suggested JSON-LD must describe the real business and visible page, without manufacturing an office, a review or a current vacancy. Getting through a syntax validator is only one part of that check.</p>
<h2>Are access controls explained properly?</h2>
<p>OpenAI and Anthropic document different roles for search, potential model training and user-directed requests. Perplexity distinguishes its search crawler from user-requested fetching. A report should state the specific agent and rule it checked instead of treating “AI blocked” as one universal switch.</p>
<p>An llms.txt file can provide a curated map for tools that choose to read it. It does not replace robots.txt, authentication or visible page content, and its presence does not prove a citation benefit.</p>
<h2>Can you compare the commercial scope?</h2>
<p>Check the total charge, the useful allowance, provider coverage, repeats, domains, exports and cancellation terms. Do not compare a saved prompt with a single-page scan as though both vendors sold the same unit. Our <a href="/blog/ai-visibility-scan-cost">guide to scan costs</a> works through that distinction.</p>
${status}
<h2>A sensible recruitment starting point</h2>
<p>Choose a real employer question and the page that should answer it. Check that the specialism, geography, proof and next step agree, then record what the selected assistant actually returns. The <a href="https://recruitmentwebdesign.com/explainers/ai-discovery">recruitment AI discovery guide</a> sets out those separate observations.</p>
<p>A tool earns its place when its evidence helps you make the next decision. The number of animated charts is less important.</p>
${sources}`,
  },
  'free-ai-visibility-tools': {
    title: 'Free AI visibility checks: what you can learn before buying a tool',
    description: 'Check readable pages, business identity, crawler access and actual assistant answers. Understand the limits of free checks and CAFMO’s current plans and access.',
    html: `${notice}
<p class="key-takeaway">You can begin with public pages and a small, recorded set of buyer questions. Check what each method observes and keep failures visible. A technical pass, an assistant mention and a qualified enquiry are different results.</p>
<p>Before buying another dashboard, write down the question. For a recruitment agency it might be, “Can an employer tell which engineering roles we cover?” That can be investigated. “Are we winning at AI?” has enough room in it for an entire sales department.</p>
<h2>Check the public page first</h2>
<p>Read the service page as a prospective employer. Can you identify the specialism, the area served, who supplies the service and how to enquire? Then inspect the first HTML response as well as the finished browser page. Important facts should remain available to readers that do not execute the site’s scripts.</p>
<p>Inspect the structured data against the visible page. Company and trading names should agree, product brands should remain distinct, and links should lead to the thing their labels promise. An invented branch office is still invented when it has valid JSON syntax.</p>
<h2>Check access by role</h2>
<p>Look at the actual robots groups and response headers for the pages you want discovered. Separate search crawling, potential training and user-directed fetching using the relevant provider’s current documentation. A robots check alone does not establish what a firewall serves to a verified crawler.</p>
<p>Keep account pages and private previews private. Discovery work should help the right reader reach public information, without making a customer report or account token available to everyone else.</p>
<h2>Record a few useful answers</h2>
<p>Use questions a hiring manager could actually ask: a supplier for the relevant roles and location, what the agency does, what evidence supports its claims, and how to start a conversation. Record the wording before the test.</p>
<p>Save the date, product, mode, relevant location settings, answer and cited URLs. Run a separate test where you supply your page and ask factual questions. That second test checks whether the information can be extracted; it does not show that the assistant would have found the website unaided.</p>
<p>Keep an absent answer, an inaccessible product and a tool error as different results. Repeating the question until your firm appears makes a pleasant screenshot, but leaves the original question unanswered.</p>
<h2>What about free scanners and trials?</h2>
<p>Read the current offer before using one: what is included, whether an account or payment card is needed, whether a trial renews and what happens to the supplied data. This article no longer ranks competing products from an old pricing snapshot or promises their current free allowances.</p>
<p>A free technical report can help identify the next page to inspect. Check whether a score is calculated from website signals, whether external metrics were returned successfully and which suggestions were generated by a model. An unanswered check should not silently become a favourable result.</p>
${status}
<h2>When is a paid tool useful?</h2>
<p>Repeated questions across several products and dates soon create admin work. A tool can be worth paying for when it preserves the evidence, repeats the agreed method and makes material changes easy to investigate. Compare it against the work it saves and the decisions it supports.</p>
<p>If the immediate problem is a contradictory service page, fix that page first. If the question is whether visibility produces business, keep consent-based analytics and actual enquiry outcomes alongside the answer observations. A screenshot of a recommendation does not book a client meeting.</p>
<p>Our <a href="https://recruitmentwebdesign.com/explainers/ai-discovery">recruitment discovery guide</a> provides a fuller method, and the <a href="/blog/ai-visibility-scan-cost">scan-cost guide</a> explains how to compare paid scope.</p>
${sources}`,
  },
};

export function applyProductEditorialCorrection(post: GhostPost): GhostPost {
  const correction = corrections[post.slug];
  if (!correction) return post;
  // A later CMS revision must not be silently replaced with this dated repair.
  if (Date.parse(post.updated_at) > Date.parse(REVIEW_DATE)) return post;
  const { title, description, html } = correction;
  return {
    ...post,
    title,
    html,
    excerpt: description,
    custom_excerpt: description,
    meta_title: title,
    meta_description: description,
    og_title: title,
    og_description: description,
    twitter_title: title,
    twitter_description: description,
    // Earlier artwork contains the withdrawn price and comparison claims.
    feature_image: undefined,
    feature_image_alt: undefined,
    og_image: undefined,
    twitter_image: undefined,
    updated_at: REVIEW_DATE,
    reading_time: Math.max(1, Math.ceil(html.replace(/<[^>]*>/g, ' ').split(/\s+/).length / 200)),
  };
}
