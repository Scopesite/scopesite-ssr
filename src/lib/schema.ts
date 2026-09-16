/**
 * JSON-LD Schema Generator Functions
 * 
 * Generates structured data for SEO and AI visibility.
 * All schemas use @id references to create a linked graph.
 */

import { GhostPost } from './ghost';
import { ADDON_CATALOG, PRICING_CONFIG, VOICE_SPEC } from './pricing-config';
import type { GlossaryTerm } from './glossary-db';

const BASE_URL = 'https://scopesite.co.uk';

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
