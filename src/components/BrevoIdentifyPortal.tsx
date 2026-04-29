/**
 * Associates the Brevo tracker cookie with the signed-in Clerk user’s email
 * (required for Brevo “identify your users” verification).
 *
 * Must render under ClerkProvider (portal layout only in this app).
 */

'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';

type BrevoIdentifyPayload = {
  identifiers: { email_id: string };
  attributes?: Record<string, string>;
};

export function BrevoIdentifyPortal() {
  const { user, isLoaded } = useUser();
  const lastIdentifiedEmail = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !process.env.NEXT_PUBLIC_BREVO_CLIENT_KEY) return;

    if (!user) {
      lastIdentifiedEmail.current = null;
      return;
    }

    const email =
      user.primaryEmailAddress?.emailAddress ??
      user.emailAddresses?.[0]?.emailAddress;

    if (!email || lastIdentifiedEmail.current === email) return;
    lastIdentifiedEmail.current = email;

    const w = window as Window & { Brevo?: unknown[] };
    w.Brevo = w.Brevo || [];

    const attributes: Record<string, string> = {};
    if (user?.firstName) attributes.FIRSTNAME = user.firstName;
    if (user?.lastName) attributes.LASTNAME = user.lastName;

    const payload: BrevoIdentifyPayload = {
      identifiers: { email_id: email },
      ...(Object.keys(attributes).length > 0 ? { attributes } : {}),
    };

    w.Brevo.push(['identify', payload]);
  }, [isLoaded, user]);

  return null;
}
