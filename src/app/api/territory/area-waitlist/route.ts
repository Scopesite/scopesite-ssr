/**
 * POST /api/territory/area-waitlist
 *
 * Request: { firmName, contactName, contactEmail, postcode?, region?,
 *            sectorSlug, entrySource }
 * Response: { waitlistId }
 *
 * Triggers: inactive map region click, or territory_not_found on a valid
 * UK postcode.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAreaWaitlistEntry, getSectorBySlug } from '@/lib/territory/queries';
import { normalisePostcode, isPlausibleUkPostcode } from '@/lib/territory/postcode';
import { MAP_REGIONS } from '@/lib/territory/map-regions';
import {
  sendAreaWaitlistAdminNotification,
  sendAreaWaitlistConfirmation,
} from '@/lib/email';

export const runtime = 'nodejs';

/**
 * FREEFORM_PREFIX encodes user-typed industry text that doesn't match any
 * row in `territory.sectors`. We store the text directly in
 * `territory.area_waitlist.requested_sector_slug` prefixed with this
 * sentinel so it never collides with a real slug (which matches
 * `[a-z0-9-]+`), and so follow-up queries can filter freeform entries via
 * `requested_sector_slug LIKE '__freeform__:%'`.
 *
 * FOLLOW-UP: once territory.area_waitlist gains an `internal_notes`
 * column (parity with territory.applications), migrate these rows to
 * store the raw freeform text in `internal_notes` with the "Freeform
 * industry: " prefix and null out the sentinel slug.
 */
const FREEFORM_PREFIX = '__freeform__:';
const MAX_SLUG_LEN = 100;

const Body = z
  .object({
    firmName: z.string().trim().min(1).max(200),
    contactName: z.string().trim().min(1).max(200),
    contactEmail: z.string().trim().toLowerCase().email().max(320),
    postcode: z.string().trim().max(12).optional().nullable(),
    region: z.string().trim().max(50).optional().nullable(),
    sectorSlug: z.string().trim().toLowerCase().min(1).max(100).optional().nullable(),
    freeformIndustry: z
      .string()
      .trim()
      .min(1)
      .max(MAX_SLUG_LEN - FREEFORM_PREFIX.length)
      .optional()
      .nullable(),
    entrySource: z.enum(['region_click', 'postcode_not_in_pilot']),
  })
  .refine((v) => v.postcode || v.region, {
    message: 'Either postcode or region is required',
    path: ['postcode'],
  })
  .refine(
    (v) =>
      (!!v.sectorSlug && !v.freeformIndustry) ||
      (!v.sectorSlug && !!v.freeformIndustry),
    {
      message: 'Provide exactly one of sectorSlug or freeformIndustry',
      path: ['sectorSlug'],
    },
  );

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  let postcode: string | null = null;
  if (data.postcode) {
    const p = normalisePostcode(data.postcode);
    if (p && !isPlausibleUkPostcode(p)) {
      return NextResponse.json(
        { error: 'Invalid postcode' },
        { status: 400 },
      );
    }
    postcode = p || null;
  }

  let region: string | null = null;
  if (data.region) {
    if (!Object.prototype.hasOwnProperty.call(MAP_REGIONS, data.region)) {
      return NextResponse.json(
        { error: 'Unknown region' },
        { status: 400 },
      );
    }
    region = data.region;
  }

  try {
    // Resolve sector slug + human-readable label for the DB insert and
    // confirmation email. Two shapes are accepted:
    //
    //   sectorSlug        -> look up the row; reject on miss.
    //   freeformIndustry  -> skip the lookup; store text as a prefixed
    //                        sentinel slug and surface the raw text in the
    //                        email as the sector label.
    let requestedSectorSlug: string;
    let sectorLabel: string;
    if (data.sectorSlug) {
      const sector = await getSectorBySlug(data.sectorSlug);
      if (!sector) {
        return NextResponse.json(
          { error: 'Unknown sector' },
          { status: 400 },
        );
      }
      requestedSectorSlug = sector.slug;
      sectorLabel = sector.label;
    } else if (data.freeformIndustry) {
      const freeformText = data.freeformIndustry;
      const encoded = `${FREEFORM_PREFIX}${freeformText}`;
      requestedSectorSlug =
        encoded.length > MAX_SLUG_LEN
          ? encoded.slice(0, MAX_SLUG_LEN)
          : encoded;
      sectorLabel = freeformText;
    } else {
      // Zod .refine guards against this but keep the defensive branch for
      // total runtime type narrowing.
      return NextResponse.json(
        { error: 'Provide exactly one of sectorSlug or freeformIndustry' },
        { status: 400 },
      );
    }

    const normalisedPostcode = postcode ? postcode.toUpperCase() : null;
    const result = await createAreaWaitlistEntry({
      firmName: data.firmName,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      requestedPostcode: normalisedPostcode,
      requestedRegion: region,
      requestedSectorSlug,
      entrySource: data.entrySource,
    });

    const emailCtx = {
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      firmName: data.firmName,
      requestedPostcode: normalisedPostcode,
      requestedRegion: region,
      regionLabel: region
        ? MAP_REGIONS[region as keyof typeof MAP_REGIONS].label
        : null,
      sectorLabel,
      entrySource: data.entrySource,
    };
    // Fire-and-forget both emails in parallel. The client-facing response
    // shouldn't block on admin-notification delivery.
    void Promise.all([
      sendAreaWaitlistConfirmation(emailCtx).catch((e) =>
        console.error('[territory/area-waitlist] applicant email failed:', e),
      ),
      sendAreaWaitlistAdminNotification(emailCtx).catch((e) =>
        console.error('[territory/area-waitlist] admin email failed:', e),
      ),
    ]);

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error('[territory/area-waitlist] error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
