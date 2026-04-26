import { NextRequest, NextResponse } from 'next/server';
import { sendBlogSubscriptionNotification } from '@/lib/email';

interface BlogSubscribeRequest {
  email?: unknown;
  website?: unknown;
}

function normalizeEmail(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BlogSubscribeRequest;
    const email = normalizeEmail(body.email);

    // Hidden honeypot field: real users never fill this in.
    if (typeof body.website === 'string' && body.website.trim().length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Thanks for subscribing.',
      });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter a valid email address.',
        },
        { status: 400 }
      );
    }

    const sent = await sendBlogSubscriptionNotification({ email });

    if (!sent) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subscription failed. Please try again.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Thanks for subscribing.',
    });
  } catch (error) {
    console.error('Blog subscription error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Subscription failed. Please try again.',
      },
      { status: 500 }
    );
  }
}
