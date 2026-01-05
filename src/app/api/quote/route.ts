import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { request: quoteRequest, result } = body;

    // Log the quote submission (in production, save to database)
    console.log('=== NEW QUOTE SUBMISSION ===');
    console.log('Quote ID:', result.id);
    console.log('Email:', quoteRequest.contact?.email);
    console.log('Name:', quoteRequest.contact?.name);
    console.log('Company:', quoteRequest.contact?.company || 'N/A');
    console.log('Phone:', quoteRequest.contact?.phone || 'N/A');
    console.log('Project Type:', quoteRequest.projectType);
    console.log('Payment Preference:', quoteRequest.paymentPreference);
    console.log('Total:', result.selected?.totalOverTerm);
    console.log('=== END QUOTE ===');

    // TODO: In production:
    // 1. Save to database
    // 2. Send confirmation email to customer
    // 3. Notify sales team
    // 4. Create CRM entry

    return NextResponse.json({
      success: true,
      quoteId: result.id,
      message: 'Quote submitted successfully',
    });
  } catch (error) {
    console.error('Quote submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit quote' },
      { status: 500 }
    );
  }
}

