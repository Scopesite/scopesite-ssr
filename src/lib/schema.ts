/**
 * JSON-LD Schema Generator Functions
 * 
 * Generates structured data for SEO and AI visibility.
 * All schemas use @id references to create a linked graph.
 */

import { GhostPost } from './ghost';

const BASE_URL = 'https://scopesite.co.uk';

// ============================================
// TYPES
// ============================================

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ServiceItem {
  name: string;
  description: string;
  url?: string;
}

export interface HowToStep {
  name: string;
  text: string;
}

// ============================================
// ORGANIZATION SCHEMA
// ============================================

export function generateOrganizationSchema() {
  return {
    '@type': ['Organization', 'LocalBusiness', 'ProfessionalService'],
    '@id': `${BASE_URL}/#organization`,
    name: 'ScopeSite Digital Studios',
    legalName: 'ScopeSite Digital Studios Ltd',
    description:
      'Veteran-owned AI-first web design agency specializing in making UK businesses visible to ChatGPT, Claude, and AI search platforms using the V.O.I.C.E™ methodology.',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/images/logo-icon.svg`,
      width: 512,
      height: 512,
    },
    image: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
    telephone: '+441373311339',
    email: 'support@scopesite.co.uk',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '4 Horse Close',
      addressLocality: 'Frome',
      addressRegion: 'Somerset',
      postalCode: 'BA11',
      addressCountry: 'GB',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '51.2308',
      longitude: '-2.3201',
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'United Kingdom',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Somerset',
      },
    ],
    founder: {
      '@type': 'Person',
      '@id': `${BASE_URL}/#founder`,
      name: 'Dan Cartwright',
      jobTitle: 'Founder & Director',
      description:
        'British Army veteran and web design specialist with 6 years CAMHS experience',
    },
    foundingDate: '2024-12',
    priceRange: '££',
    currenciesAccepted: 'GBP',
    paymentAccepted: 'Credit Card, Bank Transfer, Payment Plans',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
    sameAs: [
      'https://www.linkedin.com/company/scopesite',
      'https://www.facebook.com/scopesite',
      'https://www.instagram.com/scopesite',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Web Design Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'AI-First Web Design',
            description: 'Websites optimized for ChatGPT and AI search visibility',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'V.O.I.C.E™ AI Visibility Optimization',
            description:
              'Comprehensive AI search optimization using our proprietary methodology',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Custom Web Applications',
            description: 'Bespoke business tools and web applications',
          },
        },
      ],
    },
    knowsAbout: [
      'AI Search Optimization',
      'ChatGPT Business Recommendations',
      'Voice Search Optimization',
      'JSON-LD Schema Markup',
      'Next.js Development',
      'Web Design',
      'SEO',
    ],
    slogan: 'Making UK Businesses Visible to AI',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '6',
      reviewCount: '6',
    },
  };
}

// ============================================
// WEBSITE SCHEMA
// ============================================

export function generateWebsiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'ScopeSite Digital Studios',
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    inLanguage: 'en-GB',
  };
}

// ============================================
// BREADCRUMB SCHEMA
// ============================================

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${items[items.length - 1]?.url || BASE_URL}/#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ============================================
// FAQ SCHEMA
// ============================================

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ============================================
// SERVICE SCHEMA
// ============================================

export function generateServiceSchema(
  name: string,
  description: string,
  url: string,
  additionalType?: string
) {
  return {
    '@type': additionalType || 'Service',
    '@id': `${url}/#service`,
    name,
    description,
    url,
    provider: {
      '@id': `${BASE_URL}/#organization`,
    },
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
  };
}

// ============================================
// PROFESSIONAL SERVICE SCHEMA
// ============================================

export function generateProfessionalServiceSchema(
  name: string,
  description: string,
  url: string,
  services: ServiceItem[]
) {
  return {
    '@type': 'ProfessionalService',
    '@id': `${url}/#service`,
    name,
    description,
    url,
    provider: {
      '@id': `${BASE_URL}/#organization`,
    },
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${name} Services`,
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          description: service.description,
          url: service.url,
        },
      })),
    },
  };
}

// ============================================
// HOWTO SCHEMA
// ============================================

export function generateHowToSchema(
  name: string,
  description: string,
  steps: HowToStep[]
) {
  return {
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

// ============================================
// PERSON SCHEMA
// ============================================

export function generatePersonSchema(
  name: string,
  jobTitle: string,
  description: string,
  image?: string
) {
  return {
    '@type': 'Person',
    '@id': `${BASE_URL}/#${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    jobTitle,
    description,
    image: image || `${BASE_URL}/images/dan-headshot.webp`,
    worksFor: {
      '@id': `${BASE_URL}/#organization`,
    },
  };
}

// ============================================
// ABOUT PAGE SCHEMA
// ============================================

export function generateAboutPageSchema(url: string) {
  return {
    '@type': 'AboutPage',
    '@id': `${url}/#webpage`,
    url,
    name: 'About ScopeSite Digital Studios',
    description:
      'Learn about ScopeSite, a veteran-owned AI-first web design agency based in Somerset, UK.',
    isPartOf: {
      '@id': `${BASE_URL}/#website`,
    },
    about: {
      '@id': `${BASE_URL}/#organization`,
    },
  };
}

// ============================================
// CONTACT PAGE SCHEMA
// ============================================

export function generateContactPageSchema(url: string) {
  return {
    '@type': 'ContactPage',
    '@id': `${url}/#webpage`,
    url,
    name: 'Book a Strategy Call',
    description:
      'Book a free 30-minute strategy call with Dan Cartwright, director of ScopeSite.',
    isPartOf: {
      '@id': `${BASE_URL}/#website`,
    },
  };
}

// ============================================
// SCHEDULE ACTION SCHEMA
// ============================================

export function generateScheduleActionSchema() {
  return {
    '@type': 'ScheduleAction',
    name: 'Book a Strategy Call',
    description: 'Schedule a free 30-minute consultation with ScopeSite',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/book`,
      actionPlatform: [
        'http://schema.org/DesktopWebPlatform',
        'http://schema.org/MobileWebPlatform',
      ],
    },
    agent: {
      '@id': `${BASE_URL}/#organization`,
    },
  };
}

// ============================================
// BLOG SCHEMA
// ============================================

export function generateBlogSchema(url: string) {
  return {
    '@type': 'Blog',
    '@id': `${url}/#blog`,
    url,
    name: 'ScopeSite Blog',
    description:
      'AI visibility insights, web design tips, and practical advice for UK businesses.',
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    inLanguage: 'en-GB',
  };
}

// ============================================
// COLLECTION PAGE SCHEMA
// ============================================

export function generateCollectionPageSchema(url: string, name: string) {
  return {
    '@type': 'CollectionPage',
    '@id': `${url}/#webpage`,
    url,
    name,
    isPartOf: {
      '@id': `${BASE_URL}/#website`,
    },
  };
}

// ============================================
// BLOG POSTING SCHEMA (Enhanced for GEO)
// ============================================

// Known tools/platforms to detect in content for mentions
const KNOWN_MENTIONS = [
  { name: 'ChatGPT', category: 'AI Assistant' },
  { name: 'GPT-4', category: 'AI Model' },
  { name: 'Claude', category: 'AI Assistant' },
  { name: 'Perplexity', category: 'AI Search Engine' },
  { name: 'Google', category: 'Search Engine' },
  { name: 'Bing', category: 'Search Engine' },
  { name: 'GPTBot', category: 'Web Crawler' },
  { name: 'PerplexityBot', category: 'Web Crawler' },
  { name: 'ClaudeBot', category: 'Web Crawler' },
  { name: 'WordPress', category: 'CMS' },
  { name: 'Wix', category: 'Website Builder' },
  { name: 'Squarespace', category: 'Website Builder' },
  { name: 'Shopify', category: 'E-commerce Platform' },
  { name: 'Next.js', category: 'Web Framework' },
  { name: 'React', category: 'JavaScript Library' },
  { name: 'Siri', category: 'AI Assistant' },
  { name: 'Alexa', category: 'AI Assistant' },
  { name: 'Schema.org', category: 'Specification' },
  { name: 'JSON-LD', category: 'Data Format' },
];

// Detect mentions in post content
function detectMentions(html: string): Array<{ name: string; category: string }> {
  if (!html) return [];
  const mentions: Array<{ name: string; category: string }> = [];
  const contentLower = html.toLowerCase();
  
  for (const item of KNOWN_MENTIONS) {
    if (contentLower.includes(item.name.toLowerCase())) {
      mentions.push(item);
    }
  }
  
  return mentions;
}

// Generate about topics from tags
function generateAboutTopics(post: GhostPost): Array<Record<string, string>> {
  const topics: Array<Record<string, string>> = [];
  
  if (post.tags) {
    for (const tag of post.tags) {
      topics.push({
        '@type': 'Thing',
        name: tag.name,
      });
    }
  }
  
  return topics;
}

export function generateBlogPostingSchema(post: GhostPost, url: string) {
  // Extract keywords from tags
  const keywords = post.tags?.map(t => t.name) || [];
  
  // Detect mentions in content
  const mentions = detectMentions(post.html || '');
  
  // Generate about topics
  const aboutTopics = generateAboutTopics(post);

  const schema: Record<string, unknown> = {
    '@type': 'BlogPosting',
    '@id': `${url}/#article`,
    headline: post.title,
    description: post.excerpt || post.custom_excerpt,
    url,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    inLanguage: 'en-GB',
    isAccessibleForFree: true,
    isPartOf: {
      '@id': `${BASE_URL}/blog/#blog`,
    },
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    // Author linked by @id to the founder defined in Organization schema
    author: {
      '@id': `${BASE_URL}/#founder`,
    },
  };

  // Add articleSection from primary tag
  if (post.primary_tag) {
    schema.articleSection = post.primary_tag.name;
  }

  // Add keywords from tags
  if (keywords.length > 0) {
    schema.keywords = keywords;
  }

  // Add about topics
  if (aboutTopics.length > 0) {
    schema.about = aboutTopics;
  }

  // Add mentions of tools/platforms
  if (mentions.length > 0) {
    schema.mentions = mentions.map(m => ({
      '@type': 'SoftwareApplication',
      name: m.name,
      applicationCategory: m.category,
    }));
  }

  // Add image if available
  if (post.feature_image) {
    schema.image = {
      '@type': 'ImageObject',
      url: post.feature_image,
      caption: post.feature_image_alt || post.title,
    };
  }

  // Add word count estimate based on reading time (avg 200 words/min)
  if (post.reading_time) {
    schema.wordCount = post.reading_time * 200;
    schema.timeRequired = `PT${post.reading_time}M`;
  }

  return schema;
}

// ============================================
// ARTICLE SCHEMA
// ============================================

export function generateArticleSchema(post: GhostPost, url: string) {
  return {
    '@type': 'Article',
    '@id': `${url}/#article`,
    headline: post.title,
    description: post.excerpt || post.custom_excerpt,
    url,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      '@id': `${BASE_URL}/#founder`,
    },
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    image: post.feature_image,
  };
}

// ============================================
// BLOG FAQ PARSING & SCHEMA
// ============================================

/**
 * Check if a post should have FAQ schema
 * Returns true if post has 'faq' tag or contains FAQ-style content
 */
export function postHasFAQContent(post: GhostPost): boolean {
  // Check for 'faq' tag
  if (post.tags?.some(t => t.slug === 'faq' || t.name.toLowerCase() === 'faq')) {
    return true;
  }
  
  // Check for FAQ patterns in content (questions followed by answers)
  if (post.html) {
    // Look for FAQ section markers or Q&A patterns
    const faqPatterns = [
      /<h[23][^>]*>.*?(FAQ|Frequently Asked|Questions)/i,
      /<strong>Q[:.]/i,
      /class="faq/i,
    ];
    return faqPatterns.some(pattern => pattern.test(post.html || ''));
  }
  
  return false;
}

/**
 * Parse FAQs from post HTML content
 * Looks for patterns like:
 * - <h3>Question?</h3><p>Answer</p>
 * - <strong>Q: Question?</strong><p>Answer</p>
 * - Elements with FAQ-related classes
 */
export function parseFAQsFromHTML(html: string): FAQItem[] {
  if (!html) return [];
  
  const faqs: FAQItem[] = [];
  
  // Pattern 1: h2/h3 questions followed by p answers
  // Match questions ending with ? in h2/h3 tags
  const headingPattern = /<h[23][^>]*>([^<]*\?)<\/h[23]>\s*<p>([^<]+(?:<[^>]+>[^<]*)*)<\/p>/gi;
  let match;
  
  while ((match = headingPattern.exec(html)) !== null) {
    const question = match[1].trim();
    // Strip HTML tags from answer
    const answer = match[2].replace(/<[^>]+>/g, '').trim();
    
    if (question && answer && question.length > 10 && answer.length > 20) {
      faqs.push({ question, answer });
    }
  }
  
  // Pattern 2: Q:/A: format
  const qaPattern = /<(?:strong|b)>\s*Q[:.]\s*([^<]+\?)\s*<\/(?:strong|b)>[\s\S]*?<(?:strong|b)>\s*A[:.]\s*<\/(?:strong|b)>\s*([^<]+)/gi;
  
  while ((match = qaPattern.exec(html)) !== null) {
    const question = match[1].trim();
    const answer = match[2].trim();
    
    if (question && answer && !faqs.some(f => f.question === question)) {
      faqs.push({ question, answer });
    }
  }
  
  return faqs;
}

/**
 * Generate FAQ schema for a blog post if it has FAQ content
 */
export function generateBlogFAQSchema(post: GhostPost): Record<string, unknown> | null {
  if (!postHasFAQContent(post)) return null;
  
  const faqs = parseFAQsFromHTML(post.html || '');
  if (faqs.length === 0) return null;
  
  return generateFAQSchema(faqs);
}

// ============================================
// BLOG HOWTO PARSING & SCHEMA
// ============================================

/**
 * Check if a post should have HowTo schema
 * Returns true if post has 'tutorial', 'how-to', or 'guide' tag
 */
export function postHasHowToContent(post: GhostPost): boolean {
  const howToTags = ['tutorial', 'how-to', 'howto', 'guide', 'step-by-step'];
  
  if (post.tags?.some(t => 
    howToTags.includes(t.slug.toLowerCase()) || 
    howToTags.some(ht => t.name.toLowerCase().includes(ht))
  )) {
    return true;
  }
  
  // Check title for "How to" pattern
  if (post.title.toLowerCase().startsWith('how to')) {
    return true;
  }
  
  return false;
}

/**
 * Parse HowTo steps from post HTML content
 * Looks for patterns like:
 * - <h2>Step 1: Do something</h2><p>Details</p>
 * - <ol><li>Step content</li></ol>
 * - Numbered sections
 */
export function parseHowToStepsFromHTML(html: string): HowToStep[] {
  if (!html) return [];
  
  const steps: HowToStep[] = [];
  
  // Pattern 1: "Step N:" in headings
  const stepHeadingPattern = /<h[23][^>]*>(?:Step\s*)?(\d+)[:.]\s*([^<]+)<\/h[23]>\s*<p>([^<]+(?:<[^>]+>[^<]*)*)<\/p>/gi;
  let match;
  
  while ((match = stepHeadingPattern.exec(html)) !== null) {
    const name = match[2].trim();
    const text = match[3].replace(/<[^>]+>/g, '').trim();
    
    if (name && text) {
      steps.push({ name, text });
    }
  }
  
  // Pattern 2: Ordered list items (if no step headings found)
  if (steps.length === 0) {
    const olPattern = /<ol[^>]*>([\s\S]*?)<\/ol>/gi;
    const liPattern = /<li[^>]*>(?:<[^>]+>)*([^<]+)/gi;
    
    while ((match = olPattern.exec(html)) !== null) {
      const olContent = match[1];
      let liMatch;
      let stepNum = 1;
      
      while ((liMatch = liPattern.exec(olContent)) !== null) {
        const content = liMatch[1].trim();
        if (content.length > 10) {
          steps.push({
            name: `Step ${stepNum}`,
            text: content,
          });
          stepNum++;
        }
      }
      
      // Only use first meaningful ordered list
      if (steps.length >= 3) break;
    }
  }
  
  return steps;
}

/**
 * Generate HowTo schema for a blog post if it has tutorial content
 */
export function generateBlogHowToSchema(
  post: GhostPost,
  url: string
): Record<string, unknown> | null {
  if (!postHasHowToContent(post)) return null;
  
  const steps = parseHowToStepsFromHTML(post.html || '');
  if (steps.length < 2) return null;
  
  return {
    '@type': 'HowTo',
    '@id': `${url}/#howto`,
    name: post.title,
    description: post.excerpt || post.custom_excerpt || `Learn ${post.title}`,
    image: post.feature_image ? {
      '@type': 'ImageObject',
      url: post.feature_image,
    } : undefined,
    totalTime: post.reading_time ? `PT${post.reading_time}M` : undefined,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

// ============================================
// SPEAKABLE SCHEMA (Deprecated - causes validation issues)
// ============================================

/**
 * @deprecated Speakable schema causes validation errors with Ghost HTML
 * Use only if you have full control over the HTML structure
 */
export function generateSpeakableSchema(url: string, cssSelectors: string[]) {
  return {
    '@type': 'WebPage',
    '@id': url,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: cssSelectors,
    },
  };
}

// ============================================
// OFFER SCHEMA (for pricing)
// ============================================

export function generateOfferSchema(
  name: string,
  description: string,
  priceRange: string
) {
  return {
    '@type': 'Offer',
    name,
    description,
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: 'GBP',
      price: priceRange,
    },
    seller: {
      '@id': `${BASE_URL}/#organization`,
    },
  };
}

// ============================================
// REVIEW SCHEMA
// ============================================

export interface ReviewData {
  author: string;
  reviewBody: string;
  datePublished?: string;
  ratingValue?: number;
}

export function generateReviewSchema(review: ReviewData) {
  return {
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author,
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.ratingValue || 5,
      bestRating: 5,
      worstRating: 1,
    },
    itemReviewed: {
      '@id': `${BASE_URL}/#organization`,
    },
  };
}

export function generateReviewsSchema(reviews: ReviewData[]) {
  return reviews.map((review) => generateReviewSchema(review));
}

// ============================================
// GRAPH WRAPPER
// ============================================

export function wrapInGraph(schemas: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  };
}

