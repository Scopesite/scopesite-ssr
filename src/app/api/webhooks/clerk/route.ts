/**
 * Clerk Webhook Handler
 * 
 * Handles Clerk webhook events for user lifecycle management.
 * 
 * Events handled:
 * - user.created: Link new user to existing client by email
 */

import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { linkClerkUserToClient, logActivity, getClientByEmail, updateClient } from '@/lib/portal-db';
import { isTrelloConfigured } from '@/lib/trello';
import { ensureClientTrelloList } from '@/lib/portal-trello';

export async function POST(request: NextRequest) {
  // Get the webhook secret from environment
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  // Get the headers
  const svix_id = request.headers.get('svix-id');
  const svix_timestamp = request.headers.get('svix-timestamp');
  const svix_signature = request.headers.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: 'Missing svix headers' },
      { status: 400 }
    );
  }

  // Get the body
  const payload = await request.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json(
      { error: 'Invalid webhook signature' },
      { status: 400 }
    );
  }

  // Handle the webhook event
  const eventType = evt.type;

  switch (eventType) {
    case 'user.created':
      await handleUserCreated(evt.data);
      break;
    case 'user.updated':
      // Could handle email changes here if needed
      break;
    case 'user.deleted':
      // Could handle cleanup here if needed
      break;
  }

  return NextResponse.json({ received: true });
}

/**
 * Handle user.created event - link Clerk user to client record
 */
async function handleUserCreated(data: {
  id: string;
  email_addresses?: { email_address: string; id: string }[];
  first_name?: string | null;
  last_name?: string | null;
}) {
  const clerkUserId = data.id;
  const primaryEmail = data.email_addresses?.[0]?.email_address;

  if (!primaryEmail) {
    console.warn('User created without email address:', clerkUserId);
    return;
  }

  // Try to link this user to an existing client
  let client = await linkClerkUserToClient(primaryEmail, clerkUserId);

  if (client) {
    console.log(`Linked Clerk user ${clerkUserId} to client ${client.id} (${client.company_name})`);

    // Open Trello list for new requests (creates one if missing or archived)
    if (isTrelloConfigured()) {
      try {
        client = await ensureClientTrelloList(client);
      } catch (trelloError) {
        console.error('Failed to ensure Trello list on sign-in:', trelloError);
      }
    }

    // Log the link activity
    await logActivity({
      client_id: client.id,
      action_type: 'client_created',
      description: `Portal account activated for ${primaryEmail}`,
      actor_type: 'system',
      actor_name: 'System',
      metadata: {
        clerk_user_id: clerkUserId,
        email: primaryEmail,
      },
    });
  } else {
    // Check if client exists but was already linked
    const existingClient = await getClientByEmail(primaryEmail);
    
    if (existingClient && existingClient.clerk_user_id) {
      console.log(`User ${clerkUserId} email ${primaryEmail} already linked to client ${existingClient.id}`);
    } else if (existingClient) {
      console.warn(`Could not link user ${clerkUserId} to client - unexpected state`);
    } else {
      console.log(`No client found for email ${primaryEmail} - user may need manual setup`);
    }
  }
}

// Clerk also sends GET to verify the endpoint
export async function GET() {
  return NextResponse.json({ status: 'Clerk webhook endpoint active' });
}
