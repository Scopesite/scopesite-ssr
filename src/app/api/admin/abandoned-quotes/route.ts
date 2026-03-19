/**
 * Abandoned Quote Recovery API
 *
 * Detects quotes older than 24 hours that are still in 'started' or 'in_progress' status.
 * Moves contacts from QUOTE_STARTED to QUOTE_ABANDONED in Brevo and sends recovery emails.
 *
 * Triggered via Vercel Cron every 6 hours or manually via admin panel.
 *
 * POST /api/admin/abandoned-quotes
 * Header: x-admin-key: YOUR_ADMIN_KEY  (or triggered by Vercel Cron with CRON_SECRET)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAbandonedQuotes, updateQuoteProgress } from '@/lib/quote-storage';
import { addContactToList, removeContactFromList, BREVO_LISTS } from '@/lib/brevo';
import { sendAbandonedQuoteEmail } from '@/lib/email';

function isAuthorized(request: NextRequest): boolean {
  const adminKey = request.headers.get('x-admin-key');
  const cronSecret = request.headers.get('authorization');

  if (adminKey && adminKey === process.env.ADMIN_SECRET_KEY) return true;
  if (cronSecret && cronSecret === `Bearer ${process.env.CRON_SECRET}`) return true;
  return false;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const abandonedQuotes = await getAbandonedQuotes(1440);

    if (abandonedQuotes.length === 0) {
      return NextResponse.json({
        success: true,
        processed: 0,
        message: 'No abandoned quotes found',
      });
    }

    const results: { email: string; status: string }[] = [];

    for (const quote of abandonedQuotes) {
      try {
        const selections = quote.selections as Record<string, unknown>;
        const serviceType = (selections?.serviceType as string) || (selections?.projectType as string) || undefined;
        const isUS = !!selections?.serviceType;

        await updateQuoteProgress(quote.id, { status: 'abandoned' });

        await removeContactFromList(quote.email, BREVO_LISTS.QUOTE_STARTED).catch(() => {});
        await addContactToList(quote.email, BREVO_LISTS.QUOTE_ABANDONED).catch(() => {});

        await sendAbandonedQuoteEmail({
          email: quote.email,
          name: quote.contact?.name || undefined,
          quoteToken: quote.id,
          serviceType,
          stepReached: quote.currentStep,
          locale: isUS ? 'us' : 'uk',
        });

        results.push({ email: quote.email, status: 'processed' });
      } catch (err) {
        console.error(`[Abandoned] Failed to process quote ${quote.id}:`, err);
        results.push({ email: quote.email, status: 'error' });
      }
    }

    const processed = results.filter(r => r.status === 'processed').length;
    const errors = results.filter(r => r.status === 'error').length;

    console.log(`[Abandoned] Processed ${processed} quotes, ${errors} errors`);

    return NextResponse.json({
      success: true,
      processed,
      errors,
      total: abandonedQuotes.length,
    });
  } catch (error) {
    console.error('[Abandoned] Route error:', error);
    return NextResponse.json(
      { error: 'Failed to process abandoned quotes' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const abandonedQuotes = await getAbandonedQuotes(1440);
    return NextResponse.json({
      count: abandonedQuotes.length,
      quotes: abandonedQuotes.map(q => ({
        id: q.id,
        email: q.email,
        step: q.currentStep,
        status: q.status,
        lastActivity: q.updatedAt,
      })),
    });
  } catch (error) {
    console.error('[Abandoned] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch abandoned quotes' },
      { status: 500 }
    );
  }
}
