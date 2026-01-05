import { NextRequest, NextResponse } from 'next/server';
import { getQuote, updateQuoteProgress, submitQuote } from '@/lib/quote-storage';
import { addContactToList, removeContactFromList, updateContactAttributes, BREVO_LISTS } from '@/lib/brevo';
import { updateQuoteInSheet } from '@/lib/google-sheets';

/**
 * GET /api/quote/[id]
 * 
 * Retrieve a quote by its token (for restoring session from URL)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const quote = getQuote(id);

    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      );
    }

    // Don't return submitted quotes (they can't be edited)
    if (quote.status === 'submitted') {
      return NextResponse.json({
        success: true,
        quote: {
          id: quote.id,
          email: quote.email,
          status: quote.status,
          submittedAt: quote.submittedAt,
        },
        isSubmitted: true,
      });
    }

    return NextResponse.json({
      success: true,
      quote: {
        id: quote.id,
        email: quote.email,
        status: quote.status,
        currentStep: quote.currentStep,
        selections: quote.selections,
        contact: quote.contact,
      },
      isSubmitted: false,
    });
  } catch (error) {
    console.error('Quote fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quote' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/quote/[id]
 * 
 * Update quote progress (called on step changes)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { currentStep, selections, contact, submit, pricing } = body;

    // If this is a final submission
    if (submit === true) {
      const quote = submitQuote(id);
      if (!quote) {
        return NextResponse.json(
          { success: false, error: 'Quote not found' },
          { status: 404 }
        );
      }

      // Build Brevo contact attributes
      const brevoAttributes: Record<string, string | number | null> = {
        FULL_NAME: quote.contact.name || contact?.name || '',
        PHONE: quote.contact.phone || contact?.phone || null,
        COMPANY_NAME: quote.contact.company || contact?.company || null,
        QUOTE_ID: quote.id,
        QUOTE_URL: `https://scopesite.co.uk/pricing?q=${quote.id}`,
        QUOTE_TOTAL: pricing?.selectedTotal ?? 0,
        QUOTE_MONTHLY: pricing?.monthlyPayment ?? null,
        QUOTE_PACKAGE: pricing?.packageType || 'Starter',
        QUOTE_PAYMENT_TYPE: pricing?.paymentType || 'One-off',
        QUOTE_DATE: new Date().toISOString().split('T')[0],
        QUOTE_NOTES: quote.contact.message || contact?.message || null,
      };

      // Update Brevo: contact attributes and list membership (non-blocking)
      Promise.all([
        updateContactAttributes(quote.email, brevoAttributes),
        addContactToList(quote.email, BREVO_LISTS.QUOTE_COMPLETED),
        removeContactFromList(quote.email, BREVO_LISTS.QUOTE_STARTED),
      ]).catch((err) => {
        console.error('Failed to update Brevo on quote completion:', err);
      });

      // Update Google Sheets row (non-blocking)
      updateQuoteInSheet({
        quoteId: quote.id,
        email: quote.email,
        fullName: quote.contact.name || '',
        phone: quote.contact.phone || '',
        company: quote.contact.company || '',
        message: quote.contact.message || '',
        projectType: quote.selections.projectType || '',
        pages: quote.selections.scope?.pageCount || 0,
        ecommerce: quote.selections.scope?.ecommerce || 'none',
        webApp: quote.selections.scope?.webApp || 'none',
        hasBlog: quote.selections.scope?.hasBlog || false,
        hasComplexForms: quote.selections.scope?.hasComplexForms || false,
        hasAutomation: quote.selections.scope?.hasAutomation || false,
        voice: quote.selections.addOns?.voice || false,
        branding: quote.selections.addOns?.branding || false,
        research: quote.selections.addOns?.research || false,
        videoLong: quote.selections.addOns?.videoLong || 0,
        videoShortBundle: quote.selections.addOns?.videoShortBundle || false,
        imageLibrary: quote.selections.addOns?.imageLibrary || false,
        paymentType: quote.selections.paymentPreference || 'twelve',
        total: pricing?.selectedTotal ?? 0,
        monthly: pricing?.monthlyPayment ?? null,
        quoteUrl: `https://scopesite.co.uk/pricing?q=${quote.id}`,
      });

      return NextResponse.json({
        success: true,
        quoteId: quote.id,
        status: quote.status,
      });
    }

    // Otherwise update progress
    const quote = updateQuoteProgress(id, {
      currentStep,
      selections,
      contact,
    });

    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      quoteId: quote.id,
      currentStep: quote.currentStep,
      status: quote.status,
    });
  } catch (error) {
    console.error('Quote update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update quote' },
      { status: 500 }
    );
  }
}

