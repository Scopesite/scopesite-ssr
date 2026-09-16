import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Briefcase, FileSearch, Sparkles, ArrowRight } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateServiceSchema,
  generateWebPageSchema,
  type FAQItem,
} from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_PATH = '/recruitment-website-design';
const PAGE_URL = `${BASE_URL}${PAGE_PATH}`;
const DEMO_URL = 'https://jobboard-sonar.vercel.app/';
const SPECIALIST_SITE_URL = 'https://recruitmentwebdesign.com';
