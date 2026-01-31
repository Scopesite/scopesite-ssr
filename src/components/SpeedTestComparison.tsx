'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface SpeedTestResult {
  performanceScore: number;
  fcp: number;
  lcp: number;
  ttfb: number;
  cls: number;
  url: string;
}

// Our benchmark scores
const OUR_SCORES = {
  performanceScore: 100,
  fcp: 0.3,
  lcp: 0.6,
  ttfb: 100,
  cls: 0,
};

// Check if URL is our own site
function isOurSite(url: string): boolean {
  const normalizedUrl = url.toLowerCase();
  return normalizedUrl.includes('scopesite.co.uk') || normalizedUrl.includes('scopesite.com');
}

function MetricComparison({
  label,
  theirValue,
  ourValue,
  unit,
  higherIsBetter = false,
}: {
  label: string;
  theirValue: number;
  ourValue: number;
  unit: string;
  higherIsBetter?: boolean;
}) {
  // For metrics where LOWER is better (FCP, LCP, TTFB, CLS)
  // theyAreBetter = their value <= our value
  // For metrics where HIGHER is better (Performance Score)
  // theyAreBetter = their value >= our value
  
  const theyAreBetter = higherIsBetter 
    ? theirValue >= ourValue 
    : theirValue <= ourValue;
  
  const theyAreWorse = higherIsBetter
    ? theirValue < ourValue
    : theirValue > ourValue;

  return (
    <div className="grid grid-cols-3 gap-4 items-center py-4 border-b border-brand-navy/10 last:border-b-0">
      <div className="text-brand-navy/70 text-sm font-medium">{label}</div>
      <div className={`text-center font-bold text-lg ${
        theyAreWorse ? 'text-red-600' : theyAreBetter ? 'text-green-600' : 'text-brand-navy'
      }`}>
        {theirValue}{unit}
        {theyAreWorse && <XCircle className="w-4 h-4 inline ml-2 text-red-500" />}
        {theyAreBetter && <CheckCircle className="w-4 h-4 inline ml-2 text-green-500" />}
      </div>
      <div className="text-center font-bold text-lg text-brand-gold">
        {ourValue}{unit}
        <CheckCircle className="w-4 h-4 inline ml-2 text-green-500" />
      </div>
    </div>
  );
}

export function SpeedTestComparison() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SpeedTestResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/speed-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to test website');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-navy/10 shadow-xl overflow-hidden"
      style={{ boxShadow: '0 25px 50px -12px rgba(10, 27, 54, 0.15)' }}>
      
      {/* Form Section */}
      <div className="p-8 md:p-10">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter your website URL (e.g., example.com)"
              className="flex-1 px-5 py-4 rounded-xl border-2 border-brand-navy/20 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 outline-none transition-all text-lg"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 px-8 py-4 text-lg animate-pulse-subtle"
              style={{ animation: loading ? 'none' : 'pulse-subtle 2s ease-in-out infinite' }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analysing...
                </>
              ) : (
                'Test My Site'
              )}
            </button>
          </div>
          
          {/* Context text */}
          <p className="text-brand-navy/50 text-sm text-center mb-6">
            Tests run on mobile with simulated 4G throttling — the same conditions Google uses for rankings. 
            Scores can vary ±10% between tests, so run 3-5 times and average for accuracy.
          </p>
          
          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-2 text-brand-navy/40">
            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-xs font-medium">Powered by Google PageSpeed Insights</span>
          </div>
        </form>
        
        {loading && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-3 bg-brand-navy/5 rounded-full px-6 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-brand-gold" />
              <span className="text-brand-navy/70">Running full PageSpeed analysis... This takes 15-30 seconds</span>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="mt-6">
            <div className="bg-red-50 rounded-xl p-4 flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="border-t border-brand-navy/10 p-8 md:p-10 bg-gradient-to-b from-brand-navy/[0.02] to-transparent">
          {/* Check if they tested our site */}
          {isOurSite(result.url) ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">👋</div>
              <h4 className="text-brand-navy font-bold text-xl mb-2">That&apos;s us!</h4>
              <p className="text-brand-navy/70 mb-6">
                Try testing your own website to see how it compares to our standards.
              </p>
              <button
                onClick={() => {
                  setResult(null);
                  setUrl('');
                }}
                className="btn-secondary"
              >
                Test a Different Site
              </button>
            </div>
          ) : (
            <>
              {/* Score Header */}
              <div className="grid grid-cols-3 gap-4 mb-6 pb-4 border-b-2 border-brand-navy/20">
                <div className="text-brand-navy/70 font-medium">Metric</div>
                <div className="text-center text-brand-navy font-bold">Your Site</div>
                <div className="text-center text-brand-gold font-bold">Our Sites</div>
              </div>

              {/* Performance Score - Big */}
              <div className="grid grid-cols-3 gap-4 items-center py-6 border-b border-brand-navy/10 bg-brand-navy/[0.02] -mx-6 px-6 mb-4">
                <div className="text-brand-navy font-bold">Performance Score</div>
                <div className={`text-center font-bold text-3xl ${
                  result.performanceScore < OUR_SCORES.performanceScore ? 'text-red-600' : 'text-green-600'
                }`}>
                  {result.performanceScore}
                  <span className="text-lg">/100</span>
                </div>
                <div className="text-center font-bold text-3xl text-brand-gold">
                  {OUR_SCORES.performanceScore}
                  <span className="text-lg">/100</span>
                </div>
              </div>

              {/* Individual Metrics - Lower is better for all these */}
              <MetricComparison
                label="First Contentful Paint"
                theirValue={result.fcp}
                ourValue={OUR_SCORES.fcp}
                unit="s"
                higherIsBetter={false}
              />
              <MetricComparison
                label="Largest Contentful Paint"
                theirValue={result.lcp}
                ourValue={OUR_SCORES.lcp}
                unit="s"
                higherIsBetter={false}
              />
              <MetricComparison
                label="Time to First Byte"
                theirValue={result.ttfb}
                ourValue={OUR_SCORES.ttfb}
                unit="ms"
                higherIsBetter={false}
              />
              <MetricComparison
                label="Layout Shift"
                theirValue={result.cls}
                ourValue={OUR_SCORES.cls}
                unit=""
                higherIsBetter={false}
              />

              {/* CTA */}
              <div className="mt-8 text-center">
                <p className="text-brand-navy/70 mb-4">
                  {result.performanceScore >= 90 
                    ? "Solid score — but is it consistent? And can AI assistants actually see your content?"
                    : result.performanceScore >= 70
                      ? "Room for improvement. Speed directly impacts your Google rankings and conversion rates."
                      : "Your website is costing you customers. Every second of delay loses 7% of conversions."
                  }
                </p>
                <Link 
                  href="/pricing" 
                  className="btn-primary inline-flex items-center gap-2 group"
                >
                  Want Scores Like Ours? Get a Quote
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
}

export default SpeedTestComparison;
