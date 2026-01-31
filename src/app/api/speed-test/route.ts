import { NextRequest, NextResponse } from 'next/server';
import { sendSpeedTestLeadNotification } from '@/lib/email';

// Vercel function config - extend timeout to 120 seconds for 3 parallel API calls
export const maxDuration = 120;

interface PageSpeedResult {
  performanceScore: number;
  fcp: number; // First Contentful Paint in seconds
  lcp: number; // Largest Contentful Paint in seconds
  ttfb: number; // Time to First Byte in ms
  cls: number; // Cumulative Layout Shift
  url: string;
  runsCompleted?: number; // How many test runs were averaged
}

interface SingleRunResult {
  performanceScore: number;
  fcp: number;
  lcp: number;
  ttfb: number;
  cls: number;
}

const NUM_RUNS = 3; // Number of test runs to average
const API_TIMEOUT = 60000; // 60 second timeout per run

/**
 * Normalize URL by following redirects to get the final destination
 */
async function normalizeUrl(inputUrl: string): Promise<string> {
  try {
    // Use HEAD request to follow redirects without downloading content
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(inputUrl, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    // Return the final URL after all redirects
    return response.url;
  } catch {
    // If HEAD fails, return original URL
    return inputUrl;
  }
}

/**
 * Run a single PageSpeed test
 */
async function runPageSpeedTest(url: string, apiKey: string): Promise<SingleRunResult | null> {
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile&category=performance`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('PageSpeed API error:', await response.text());
      return null;
    }

    const data = await response.json();
    const lighthouseResult = data.lighthouseResult;
    const audits = lighthouseResult?.audits;
    const categories = lighthouseResult?.categories;

    return {
      performanceScore: (categories?.performance?.score || 0) * 100,
      fcp: (audits?.['first-contentful-paint']?.numericValue || 0) / 1000,
      lcp: (audits?.['largest-contentful-paint']?.numericValue || 0) / 1000,
      ttfb: audits?.['server-response-time']?.numericValue || 0,
      cls: audits?.['cumulative-layout-shift']?.numericValue || 0,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('PageSpeed test run failed:', error);
    return null;
  }
}

/**
 * Average multiple test results, excluding outliers
 */
function averageResults(results: SingleRunResult[]): SingleRunResult {
  if (results.length === 0) {
    throw new Error('No valid results to average');
  }

  if (results.length === 1) {
    return results[0];
  }

  // For 3+ results, drop the worst performance score and average the rest
  // This reduces impact of anomalous slow runs
  if (results.length >= 3) {
    const sorted = [...results].sort((a, b) => b.performanceScore - a.performanceScore);
    results = sorted.slice(0, -1); // Drop the worst (last) result
  }

  const sum = results.reduce(
    (acc, r) => ({
      performanceScore: acc.performanceScore + r.performanceScore,
      fcp: acc.fcp + r.fcp,
      lcp: acc.lcp + r.lcp,
      ttfb: acc.ttfb + r.ttfb,
      cls: acc.cls + r.cls,
    }),
    { performanceScore: 0, fcp: 0, lcp: 0, ttfb: 0, cls: 0 }
  );

  const count = results.length;
  return {
    performanceScore: sum.performanceScore / count,
    fcp: sum.fcp / count,
    lcp: sum.lcp / count,
    ttfb: sum.ttfb / count,
    cls: sum.cls / count,
  };
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
    let inputUrl: string;
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      inputUrl = parsed.toString();
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

    // Normalize URL by following redirects to get final destination
    // This ensures we test the same URL the user would actually land on
    const finalUrl = await normalizeUrl(inputUrl);
    console.log(`[SpeedTest] Testing: ${finalUrl} (original: ${inputUrl})`);

    // Run multiple tests in parallel for speed
    const testPromises = Array(NUM_RUNS)
      .fill(null)
      .map(() => runPageSpeedTest(finalUrl, apiKey));

    const testResults = await Promise.all(testPromises);
    const validResults = testResults.filter((r): r is SingleRunResult => r !== null);

    if (validResults.length === 0) {
      return NextResponse.json(
        { error: 'Failed to analyze website. Please check the URL and try again.' },
        { status: 500 }
      );
    }

    // Average the results (dropping worst outlier if 3+ runs)
    const averaged = averageResults(validResults);

    const result: PageSpeedResult = {
      performanceScore: Math.round(averaged.performanceScore),
      fcp: parseFloat(averaged.fcp.toFixed(1)),
      lcp: parseFloat(averaged.lcp.toFixed(1)),
      ttfb: Math.round(averaged.ttfb),
      cls: parseFloat(averaged.cls.toFixed(3)),
      url: finalUrl,
      runsCompleted: validResults.length,
    };

    console.log(`[SpeedTest] Result for ${finalUrl}: Score ${result.performanceScore} (${validResults.length} runs averaged)`);

    // Send lead notification email (skip if it's our own site)
    const parsedFinalUrl = new URL(finalUrl);
    const isOurSite = parsedFinalUrl.hostname.includes('scopesite.co.uk') || parsedFinalUrl.hostname.includes('scopesite.com');
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
