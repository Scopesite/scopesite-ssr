import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://scopesite.co.uk';

const PRICES = {
  setup: {
    priceId: 'price_1TIZxqC2FmRRiMA09JPCnes5',
    mode: 'payment' as const,
  },
  managed: {
    priceId: 'price_1TIZxwC2FmRRiMA0gMsa75Eo',
    mode: 'subscription' as const,
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const plan = body?.plan;

    if (plan !== 'setup' && plan !== 'managed') {
      return NextResponse.json(
        { error: 'Invalid plan. Must be "setup" or "managed".' },
        { status: 400 }
      );
    }

    const { priceId, mode } = PRICES[plan as keyof typeof PRICES];

    const session = await getStripe().checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      ...(plan === 'setup' && { allow_promotion_codes: true }),
      success_url: `${BASE_URL}/llm-brain/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/llm-brain`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session.' },
      { status: 500 }
    );
  }
}
