/**
 * Admin API: Trello Webhook Management
 * 
 * GET - List all webhooks
 * POST - Register a new webhook
 * DELETE - Remove a webhook by ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { listWebhooks, registerWebhook, deleteWebhook, isTrelloConfigured } from '@/lib/trello';

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('x-admin-key');
  return authHeader === ADMIN_SECRET_KEY;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isTrelloConfigured()) {
    return NextResponse.json({ error: 'Trello not configured' }, { status: 400 });
  }

  try {
    const webhooks = await listWebhooks();
    return NextResponse.json({
      success: true,
      webhooks,
      count: webhooks.length,
    });
  } catch (error) {
    console.error('Failed to list webhooks:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isTrelloConfigured()) {
    return NextResponse.json({ error: 'Trello not configured' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const callbackUrl = body.callbackUrl || 'https://scopesite.co.uk/api/webhooks/trello';
    
    const webhook = await registerWebhook(callbackUrl);
    return NextResponse.json({
      success: true,
      webhook,
      message: `Webhook registered with ID: ${webhook.id}`,
    });
  } catch (error) {
    console.error('Failed to register webhook:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const webhookId = searchParams.get('id');
    
    if (!webhookId) {
      return NextResponse.json({ error: 'Webhook ID required' }, { status: 400 });
    }
    
    await deleteWebhook(webhookId);
    return NextResponse.json({
      success: true,
      message: `Webhook ${webhookId} deleted`,
    });
  } catch (error) {
    console.error('Failed to delete webhook:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
