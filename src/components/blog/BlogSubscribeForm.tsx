'use client';

import { FormEvent, useState } from 'react';

type SubmissionStatus = 'idle' | 'success' | 'error';

export function BlogSubscribeForm() {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await fetch('/api/blog/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, website }),
      });

      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok || !result.success) {
        setStatus('error');
        setMessage(result.error || 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
      setMessage(result.message || 'Thanks for subscribing.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="section-white border-t border-brand-navy/10">
      <div className="container-content">
        <div className="mx-auto max-w-3xl rounded-2xl border border-brand-gold/30 bg-brand-navy p-6 text-white shadow-[0_4px_24px_rgba(10,27,54,0.12)] md:p-8">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h2 className="mb-2 text-2xl text-white">Subscribe to New Blogs</h2>
              <p className="text-sm leading-relaxed text-white/70">
                Get new ScopeSite articles as they are released. No noise, just useful AI visibility and SSR website insight.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:min-w-[22rem]">
              <label htmlFor="blog-subscribe-email" className="sr-only">
                Email address
              </label>
              <input
                id="blog-subscribe-email"
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                autoComplete="email"
                required
                className="w-full rounded-lg border-2 border-brand-gold bg-white px-4 py-3 text-brand-navy placeholder:text-brand-navy/50 focus-visible:ring-brand-gold focus-visible:ring-offset-brand-navy"
              />
              <label htmlFor="blog-subscribe-website" className="sr-only" aria-hidden="true">
                Website
              </label>
              <input
                id="blog-subscribe-website"
                type="text"
                name="website"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
              {message && (
                <p
                  className={status === 'success' ? 'text-sm text-brand-gold' : 'text-sm text-red-200'}
                  role={status === 'error' ? 'alert' : 'status'}
                  aria-live="polite"
                >
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BlogSubscribeForm;
