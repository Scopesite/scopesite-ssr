import { NextRequest, NextResponse } from 'next/server';
import { createQuote, updateQuoteProgress } from '@/lib/quote-storage';
import { addContactToList, BREVO_LISTS } from '@/lib/brevo';
import { createQuoteInSheet } from '@/lib/google-sheets';
import {
  sendQuoteStartedAdminNotification,
  sendQuoteStartedConfirmation,
} from '@/lib/email';
import type { ProjectType } from '@/types/pricing';
import { PRICING_LABELS } from '@/lib/pricing-config';

/**
 * POST /api/quote/start
 *
 * Create a new quote when the user submits the email capture modal (step 2 → 3
 * interstitial). Returns the existing in-progress quote if one exists for this
 * email (idempotent resume).
 *
 * Body:
 *   - email: string (required)
 *   - websiteUrl?: string — optional prospect website for free Pro Scan
 *   - projectType?: ProjectType — project type chosen on step 2
 *
 * On FRESH quote creation (isNew === true):
 *   - Persists websiteUrl + projectType + currentStep=2 so the row has the
 *     page-2 state even if the prospect bails from here.
 *   - Fires warm-lead emails (dan@ + prospect) non-blocking. These DO NOT fire
 *     when an existing quote is resumed — server-side dedupe guard.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, websiteUrl, projectType } = body as {
      email?: string;
      websiteUrl?: string;
      projectType?: ProjectType;
    };

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedWebsiteUrl =
      typeof websiteUrl === 'string' ? websiteUrl.trim() : '';
    const result = await createQuote(normalizedEmail);

    if (result.limitExceeded) {
      return NextResponse.json({
        success: false,
        limitExceeded: true,
        quotesUsed: result.quotesUsed,
        error: 'Quote limit reached',
      });
    }

    const quote = result.quote!;
    const quoteUrl = `https://scopesite.co.uk/pricing?q=${quote.id}`;

    // Fresh quote: persist page-2 state so we capture projectType + URL even
    // if the lead bails from here. Also fire warm-lead emails ONCE.
    if (result.isNew) {
      // Persist projectType (selections) + websiteUrl (contact). We advance the
      // stored currentStep to 2 so the status flips from 'started' -> 'in_progress'
      // on the very first update (matches quote-storage auto-status logic).
      if (projectType || normalizedWebsiteUrl) {
        await updateQuoteProgress(quote.id, {
          currentStep: 2,
          ...(projectType ? { selections: { projectType } } : {}),
          ...(normalizedWebsiteUrl
            ? { contact: { websiteUrl: normalizedWebsiteUrl } }
            : {}),
        });
      }

      // Non-blocking warm-lead emails — these are the ONLY place they fire.
      // Both helpers are idempotent per quote row because they're only called
      // when createQuote returned isNew === true.
      const projectTypeLabel = projectType
        ? PRICING_LABELS.projectTypes[projectType]
        : undefined;

      Promise.allSettled([
        sendQuoteStartedAdminNotification({
          quoteId: quote.id,
          email: normalizedEmail,
          websiteUrl: normalizedWebsiteUrl || undefined,
          projectType: projectTypeLabel,
          quoteUrl,
        }),
        sendQuoteStartedConfirmation({
          quoteId: quote.id,
          email: normalizedEmail,
          websiteUrl: normalizedWebsiteUrl || undefined,
          projectType: projectTypeLabel,
          quoteUrl,
        }),
      ]).then((results) => {
        results.forEach((r, i) => {
          const label = i === 0 ? 'admin' : 'prospect';
          if (r.status === 'rejected') {
            console.error(`[Quote ${quote.id}] Warm-lead ${label} email failed:`, r.reason);
          }
        });
      });
    }

    // Add contact to Quote Started list in Brevo (idempotent — safe to call
    // again on resume; Brevo dedupes memberships at the API level).
    addContactToList(normalizedEmail, BREVO_LISTS.QUOTE_STARTED).catch((err) => {
      console.error('Failed to add contact to Quote Started list:', err);
    });

    // Create row in Google Sheet (non-blocking). Only for fresh quotes — a
    // resume shouldn't duplicate the row.
    if (result.isNew) {
      createQuoteInSheet(quote.id, normalizedEmail);
    }

    return NextResponse.json({
      success: true,
      quoteId: quote.id,
      isExisting: quote.currentStep > 1,
      currentStep: quote.currentStep,
      selections: quote.selections,
      contact: quote.contact,
      quotesUsed: result.quotesUsed,
    });
  } catch (error) {
    console.error('Quote start error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create quote' },
      { status: 500 }
    );
  }
}
