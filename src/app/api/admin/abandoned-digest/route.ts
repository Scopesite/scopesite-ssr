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
import { formatQuoteSelectionsSnapshotHtml, ukPricingStepLabel } from '@/lib/quote-selection-summary';

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

    const digestItems: AbandonedDigestItem[] = abandonedQuotes.map((quote) => {
      const selections = quote.selections as Record<string, unknown>;
      const serviceType =
        (selections?.serviceType as string) || (selections?.projectType as string) || undefined;
      const isUS = !!selections?.serviceType;
      const legalCompanyName =
        selections.entityType === 'limited' && typeof selections.companyName === 'string'
          ? selections.companyName.trim() || null
          : null;

      return {
        email: quote.email,
        serviceType,
        stepReached: quote.currentStep,
        stepLabel: isUS ? `Step ${quote.currentStep}` : ukPricingStepLabel(quote.currentStep),
        lastActivity: quote.updatedAt,
        locale: isUS ? 'us' : 'uk',
        quoteId: quote.id,
        resumeUrl: isUS
          ? `https://scopesite.co.uk/us/quote?q=${quote.id}`
          : `https://scopesite.co.uk/pricing?q=${quote.id}`,
        legalCompanyName,
        selectionSnapshotHtml: formatQuoteSelectionsSnapshotHtml(selections),
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
