/**
 * Brevo transactional SMS
 */

import { normalizePhoneE164 } from './phone';

const BREVO_SMS_URL = 'https://api.brevo.com/v3/transactionalSMS/sms';

export async function sendSms(opts: {
  to: string;
  body: string;
  type?: 'transactional' | 'marketing';
}): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY;
  const sender = process.env.BREVO_SMS_SENDER;

  if (!apiKey || !sender) {
    return { success: false, error: 'SMS not configured (missing BREVO_API_KEY or BREVO_SMS_SENDER)' };
  }

  const recipient = normalizePhoneE164(opts.to);
  if (!recipient) {
    return { success: false, error: 'Invalid phone number' };
  }

  const body = opts.body.trim().slice(0, 320);
  if (!body) {
    return { success: false, error: 'Empty message body' };
  }

  try {
    const response = await fetch(BREVO_SMS_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender,
        recipient,
        content: body,
        type: opts.type ?? 'transactional',
        unicodeEnabled: false,
      }),
    });

    if (response.ok || response.status === 201) {
      return { success: true };
    }

    const errorData = (await response.json().catch(() => ({}))) as { message?: string };
    console.error('Brevo SMS error:', errorData);
    return { success: false, error: errorData.message || 'Failed to send SMS' };
  } catch (error) {
    console.error('Brevo SMS exception:', error);
    return { success: false, error: 'Failed to connect to Brevo SMS' };
  }
}
