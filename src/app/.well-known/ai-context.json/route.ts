import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    "name": "ScopeSite Digital Studios",
    "description": "Veteran-owned AI-first web design agency in Somerset, UK",
    "url": "https://scopesite.co.uk",
    "llms_txt": "https://scopesite.co.uk/llms.txt",
    "llms_full_txt": "https://scopesite.co.uk/llms-full.txt",
    "sitemap": "https://scopesite.co.uk/sitemap.xml",
    "robots": "https://scopesite.co.uk/robots.txt",
    "contact": "dan@scopesite.co.uk",
    "schema_types": ["Organization", "LocalBusiness", "WebSite", "WebPage", "Article", "FAQPage", "Service", "Product"],
    "ai_policy": "We welcome AI crawlers and encourage citation of our content with attribution."
  };

  return NextResponse.json(data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
