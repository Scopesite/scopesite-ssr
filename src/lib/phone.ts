/**
 * Normalise phone numbers to E.164 for SMS delivery.
 * UK default: leading 0 becomes +44.
 */

export function normalizePhoneE164(raw: string): string | null {
  if (!raw || typeof raw !== 'string') {
    return null;
  }

  let cleaned = raw.replace(/[\s().-]/g, '');

  if (cleaned.startsWith('00')) {
    cleaned = `+${cleaned.slice(2)}`;
  }

  if (cleaned.startsWith('0') && !cleaned.startsWith('00')) {
    cleaned = `+44${cleaned.slice(1)}`;
  }

  if (!cleaned.startsWith('+')) {
    if (/^\d{10,15}$/.test(cleaned)) {
      cleaned = `+${cleaned}`;
    } else {
      return null;
    }
  }

  const digits = cleaned.slice(1);
  if (!/^\d{7,15}$/.test(digits)) {
    return null;
  }

  return `+${digits}`;
}
