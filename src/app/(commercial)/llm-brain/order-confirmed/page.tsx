import Link from 'next/link';
import { CircleCheckBig } from 'lucide-react';
import { getStripe } from '@/lib/stripe';

interface OrderConfirmedProps {
  searchParams: Promise<{ session_id?: string }>;
}

async function getSessionDetails(sessionId: string) {
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    const lineItem = session.line_items?.data[0];
    const productName = lineItem?.description || 'LLM Brain';
    const amount = session.amount_total
      ? `£${(session.amount_total / 100).toFixed(2)}`
      : null;
    const email = session.customer_details?.email || null;
    const isSubscription = session.mode === 'subscription';

    return { productName, amount, email, isSubscription };
  } catch {
    return null;
  }
}

export default async function OrderConfirmedPage({ searchParams }: OrderConfirmedProps) {
  const { session_id } = await searchParams;
  const details = session_id ? await getSessionDetails(session_id) : null;

  return (
    <section className="bg-brand-navy min-h-[80vh] flex items-center py-section">
      <div className="container-content">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm max-w-lg mx-auto text-center">
          <div className="flex justify-center mb-6">
            <CircleCheckBig className="w-16 h-16 text-teal-500" aria-hidden />
          </div>

          <h1 className="text-brand-navy font-headline text-2xl sm:text-3xl mb-2">
            Order Confirmed
          </h1>
          <p className="text-brand-navy/70 text-lg mb-6">Thank you for your purchase</p>

          {details && (
            <div className="bg-brand-navy/5 rounded-xl p-5 mb-6 text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-navy/60">Product</span>
                <span className="text-brand-navy font-medium">{details.productName}</span>
              </div>
              {details.amount && (
                <div className="flex justify-between">
                  <span className="text-brand-navy/60">
                    {details.isSubscription ? 'Amount per month' : 'Amount paid'}
                  </span>
                  <span className="text-brand-navy font-medium">{details.amount}</span>
                </div>
              )}
              {details.email && (
                <div className="flex justify-between">
                  <span className="text-brand-navy/60">Email</span>
                  <span className="text-brand-navy font-medium">{details.email}</span>
                </div>
              )}
            </div>
          )}

          <p className="text-brand-navy/70 text-sm leading-relaxed mb-8">
            Your LLM Brain setup has been confirmed. We will be in touch within 24 hours
            (during working days, Monday to Friday) to get everything up and running. If you
            have any questions in the meantime, drop us a message on{' '}
            <a
              href="https://www.linkedin.com/in/scopesite"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-brand-gold-accessible"
            >
              LinkedIn
            </a>{' '}
            or email us at{' '}
            <a
              href="mailto:dan@scopesite.co.uk"
              className="underline hover:text-brand-gold-accessible"
            >
              dan@scopesite.co.uk
            </a>
            .
          </p>

          <div className="space-y-3">
            <Link href="/" className="btn-primary w-full text-center block">
              Back to ScopeSite
            </Link>
            <a
              href="https://www.linkedin.com/in/scopesite"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-brand-navy/60 text-sm hover:text-brand-gold-accessible underline"
            >
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
