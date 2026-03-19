/**
 * Abandoned Quote Daily Digest
 *
 * Sends a summary email to admin with all abandoned quotes from the past 24 hours.
 * Groups by step abandoned and service type for quick analysis.
 *
 * Triggered via Vercel Cron daily at 8am or manually.
 *
 * POST /api/admin/abandoned-digest
 * Header: x-admin-key: YOUR_ADMIN_KEY  (or triggered by Vercel Cron with CRON_SECRET)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAbandonedQuotes } from '@/lib/quote-storage';
import { sendAbandonedQuoteDigest } from '@/lib/email';
import type { AbandonedDigestItem } from '@/lib/email';

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
      console.log('[Digest] No abandoned quotes in the last 24 hours');
      return NextResponse.json({
        success: true,
        sent: false,
        message: 'No abandoned quotes to report',
      });
    }

    const digestItems: AbandonedDigestItem[] = abandonedQuotes.map(quote => {
      const selections = quote.selections as Record<string, unknown>;
      const serviceType = (selections?.serviceType as string) || (selections?.projectType as string) || undefined;
      const isUS = !!selections?.serviceType;

      return {
        email: quote.email,
        serviceType,
        stepReached: quote.currentStep,
        lastActivity: quote.updatedAt,
        locale: isUS ? 'us' : 'uk',
      };
    });

    const sent = await sendAbandonedQuoteDigest(digestItems);

    return NextResponse.json({
      success: true,
      sent,
      count: digestItems.length,
    });
  } catch (error) {
    console.error('[Digest] Route error:', error);
    return NextResponse.json(
      { error: 'Failed to send digest' },
      { status: 500 }
    );
  }
}
