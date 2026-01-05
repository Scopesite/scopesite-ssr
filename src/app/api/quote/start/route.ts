import { NextRequest, NextResponse } from 'next/server';
import { createQuote } from '@/lib/quote-storage';
import { addContactToList, BREVO_LISTS } from '@/lib/brevo';
import { createQuoteInSheet } from '@/lib/google-sheets';

/**
 * POST /api/quote/start
 * 
 * Create a new quote when user submits their email (Step 1)
 * Returns existing in-progress quote if one exists for this email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const result = createQuote(normalizedEmail);

    // Check if quote limit exceeded
    if (result.limitExceeded) {
      return NextResponse.json({
        success: false,
        limitExceeded: true,
        quotesUsed: result.quotesUsed,
        error: 'Quote limit reached',
      });
    }

    const quote = result.quote!;

    // Add contact to Quote Started list in Brevo (non-blocking)
    addContactToList(normalizedEmail, BREVO_LISTS.QUOTE_STARTED).catch((err) => {
      console.error('Failed to add contact to Quote Started list:', err);
    });

    // Create row in Google Sheet (non-blocking)
    createQuoteInSheet(quote.id, normalizedEmail);

    return NextResponse.json({
      success: true,
      quoteId: quote.id,
      isExisting: quote.currentStep > 1, // Let client know if this is a resumed quote
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

