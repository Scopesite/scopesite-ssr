import { NextRequest, NextResponse } from 'next/server';
import { sendSpeedTestLeadNotification } from '@/lib/email';

interface PageSpeedResult {
  performanceScore: number;
  fcp: number; // First Contentful Paint in seconds
  lcp: number; // Largest Contentful Paint in seconds
  ttfb: number; // Time to First Byte in ms
  cls: number; // Cumulative Layout Shift
  url: string;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    let validUrl: URL;
    try {
      validUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
    if (!apiKey) {
      console.error('GOOGLE_PAGESPEED_API_KEY not configured');
      return NextResponse.json(
        { error: 'Speed test service unavailable' },
        { status: 503 }
      );
    }

    // Call Google PageSpeed Insights API
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(validUrl.toString())}&key=${apiKey}&strategy=mobile&category=performance`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('PageSpeed API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to analyze website. Please check the URL and try again.' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract the metrics we need
    const lighthouseResult = data.lighthouseResult;
    const audits = lighthouseResult?.audits;
    const categories = lighthouseResult?.categories;

    const result: PageSpeedResult = {
      performanceScore: Math.round((categories?.performance?.score || 0) * 100),
      fcp: parseFloat(((audits?.['first-contentful-paint']?.numericValue || 0) / 1000).toFixed(1)),
      lcp: parseFloat(((audits?.['largest-contentful-paint']?.numericValue || 0) / 1000).toFixed(1)),
      ttfb: Math.round(audits?.['server-response-time']?.numericValue || 0),
      cls: parseFloat((audits?.['cumulative-layout-shift']?.numericValue || 0).toFixed(3)),
      url: validUrl.toString(),
    };

    // Send lead notification email (skip if it's our own site)
    const isOurSite = validUrl.hostname.includes('scopesite.co.uk') || validUrl.hostname.includes('scopesite.com');
    if (!isOurSite) {
      // Fire and forget - don't wait for email to send
      sendSpeedTestLeadNotification(result).catch(err => {
        console.error('Failed to send speed test lead email:', err);
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Speed test error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
