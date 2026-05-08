/**
 * POST /api/territory/apply
 *
 * Accepts three payload shapes, discriminated by `entryType`:
 *
 *   { entryType: 'seat', seatId, sectorSlug, ...contact }
 *     -> existing 48h-hold flow: verifies seat is available, atomically
 *        inserts the application AND flips the seat to pending, returns
 *        { applicationId, pendingUntil }.
 *
 *   { entryType: 'sector', postcode, sectorSlug, ...contact }
 *     -> known-sector seat-less flow: the sector exists in
 *        territory.sectors and the postcode is an active pilot
 *        territory, but we intentionally do NOT flip a seat (typical
 *        case is not-yet-activated seats from the bulk import). Plain
 *        INSERT with entry_type='sector'. Returns
 *        { applicationId, pendingUntil: null }.
 *
 *   { entryType: 'freeform', postcode, freeformIndustry, ...contact }
 *     -> seat-less flow with no sector row at all: plain INSERT with
 *        entry_type='freeform'. Returns
 *        { applicationId, pendingUntil: null }.
 *
 * Shared behaviour across all three paths:
 *   - Zod discriminated-union validation
 *   - 24h email dedup (contact_email + status in received/qualified)
 *   - Admin email to dan@scopesite.co.uk (branched on entryType)
 *   - Confirmation email to the applicant (branched on entryType)
 *   - HubSpot stub (Phase A: console.warn only)
 *   - Identical response shape + redirect target (/territory/confirmed)
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createApplication,
  createFreeformApplication,
  createSectorApplication,
  getApplicationById,
  getSectorBySlug,
  getSeatFullById,
  hasRecentApplicationByEmail,
} from '@/lib/territory/queries';
import { resolvePriceLockForPostcode } from '@/lib/territory/postcodePricing';
import {
  normalisePostcode,
  isPlausibleUkPostcode,
  toPostcodeDistrict,
} from '@/lib/territory/postcode';
import { pushToHubSpot } from '@/lib/territory/hubspot-stub';
import {
  sendTerritoryAdminNotification,
  sendTerritoryApplicationConfirmation,
} from '@/lib/email';

export const runtime = 'nodejs';

const sharedFields = {
  firmName: z.string().trim().min(1).max(200),
  contactName: z.string().trim().min(1).max(200),
  contactRole: z.string().trim().max(100).optional().nullable(),
  contactEmail: z.string().trim().toLowerCase().email().max(320),
  contactPhone: z.string().trim().max(50).optional().nullable(),
  websiteUrl: z.string().trim().max(500).optional().nullable(),
  firmPostcode: z.string().trim().min(2).max(12),
  aiVisibilityApproach: z.string().trim().max(100).optional().nullable(),
  additionalContext: z.string().trim().max(5000).optional().nullable(),
} as const;

const SeatBody = z.object({
  entryType: z.literal('seat'),
  seatId: z.string().uuid(),
  sectorSlug: z.string().trim().toLowerCase().min(1).max(100),
  ...sharedFields,
});

const SectorBody = z.object({
  entryType: z.literal('sector'),
  postcode: z.string().trim().min(2).max(12),
  sectorSlug: z.string().trim().toLowerCase().min(1).max(100),
  ...sharedFields,
});

const FreeformBody = z.object({
  entryType: z.literal('freeform'),
  postcode: z.string().trim().min(2).max(12),
  freeformIndustry: z.string().trim().min(1).max(120),
  ...sharedFields,
});

const Body = z.discriminatedUnion('entryType', [
  SeatBody,
  SectorBody,
  FreeformBody,
]);

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

  // Applicant's firm postcode (shared across all three paths).
  const firmPostcode = normalisePostcode(data.firmPostcode);
  if (!isPlausibleUkPostcode(firmPostcode)) {
    return NextResponse.json({ error: 'Invalid postcode' }, { status: 400 });
  }

  // Dedup applies to all three paths. One active application per email per 24h.
  try {
    if (await hasRecentApplicationByEmail(data.contactEmail)) {
      return NextResponse.json(
        {
          error:
            'An application from this email is already in review. Please wait for a response before submitting again.',
        },
        { status: 429 },
      );
    }
  } catch (err) {
    console.error('[territory/apply] dedup query failed:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }

  // -------------------------------------------------------------------------
  // SEAT PATH
  // -------------------------------------------------------------------------
  if (data.entryType === 'seat') {
    let seatResult: { applicationId: string; pendingUntil: string } | null;
    try {
      const seatPreview = await getSeatFullById(data.seatId);
      if (!seatPreview || seatPreview.state !== 'available') {
        return NextResponse.json({ error: 'seat_unavailable' }, { status: 409 });
      }
      const priceLock = await resolvePriceLockForPostcode(seatPreview.postcode_district);
      seatResult = await createApplication({
        seatId: data.seatId,
        firmName: data.firmName,
        contactName: data.contactName,
        contactRole: data.contactRole ?? null,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone ?? null,
        websiteUrl: data.websiteUrl ?? null,
        firmPostcode,
        sectorSlug: data.sectorSlug,
        aiVisibilityApproach: data.aiVisibilityApproach ?? null,
        additionalContext: data.additionalContext ?? null,
        lockedMonthlyPriceGbp: priceLock.lockedMonthlyPriceGbp,
        lockedSetupFeeGbp: priceLock.lockedSetupFeeGbp,
        lockedPromotionId: priceLock.lockedPromotionId,
      });
    } catch (err) {
      console.error('[territory/apply] createApplication failed:', err);
      return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }

    if (!seatResult) {
      return NextResponse.json({ error: 'seat_unavailable' }, { status: 409 });
    }

    const [application, seatFull] = await Promise.all([
      getApplicationById(seatResult.applicationId),
      getSeatFullById(data.seatId),
    ]);

    if (application) {
      try {
        await pushToHubSpot(application);
      } catch (err) {
        console.error('[territory/apply] HubSpot stub call failed:', err);
      }
    }

    let confirmationEmailSent = false;
    let adminEmailSent = false;
    if (application && seatFull) {
      const emailCtx = {
        entryType: 'seat' as const,
        applicationId: application.id,
        firmName: application.firm_name,
        contactName: application.contact_name,
        contactRole: application.contact_role,
        contactEmail: application.contact_email,
        contactPhone: application.contact_phone,
        websiteUrl: application.website_url,
        firmPostcode: application.firm_postcode,
        sectorSlug: seatFull.sector_slug,
        sectorLabel: seatFull.sector_label,
        postcodeDistrict: seatFull.postcode_district,
        aiVisibilityApproach: application.ai_visibility_approach,
        additionalContext: application.additional_context,
        pendingUntil: seatResult.pendingUntil as string | null,
      };
      const [adminSent, applicantSent] = await Promise.all([
        sendTerritoryAdminNotification(emailCtx).catch((e) => {
          console.error('[territory/apply] admin email failed:', e);
          return false;
        }),
        sendTerritoryApplicationConfirmation(emailCtx).catch((e) => {
          console.error('[territory/apply] applicant email failed:', e);
          return false;
        }),
      ]);
      adminEmailSent = adminSent;
      confirmationEmailSent = applicantSent;
    }

    return NextResponse.json({
      ok: true,
      applicationId: seatResult.applicationId,
      pendingUntil: seatResult.pendingUntil,
      confirmationEmailSent,
      adminEmailSent,
    });
  }

  // -------------------------------------------------------------------------
  // SECTOR + FREEFORM PATHS: shared postcode validation.
  // -------------------------------------------------------------------------
  const targetPostcode = normalisePostcode(data.postcode);
  if (!isPlausibleUkPostcode(targetPostcode)) {
    return NextResponse.json(
      { error: 'Invalid target postcode' },
      { status: 400 },
    );
  }
  const requestedPostcodeDistrict = toPostcodeDistrict(targetPostcode);

  // -------------------------------------------------------------------------
  // SECTOR PATH
  // -------------------------------------------------------------------------
  if (data.entryType === 'sector') {
    const sector = await getSectorBySlug(data.sectorSlug);
    if (!sector) {
      return NextResponse.json({ error: 'Unknown sector' }, { status: 400 });
    }

    let sectorResult: { applicationId: string };
    try {
      const priceLock = await resolvePriceLockForPostcode(requestedPostcodeDistrict);
      sectorResult = await createSectorApplication({
        firmName: data.firmName,
        contactName: data.contactName,
        contactRole: data.contactRole ?? null,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone ?? null,
        websiteUrl: data.websiteUrl ?? null,
        firmPostcode,
        sectorSlug: sector.slug,
        requestedPostcodeDistrict,
        aiVisibilityApproach: data.aiVisibilityApproach ?? null,
        additionalContext: data.additionalContext ?? null,
        lockedMonthlyPriceGbp: priceLock.lockedMonthlyPriceGbp,
        lockedSetupFeeGbp: priceLock.lockedSetupFeeGbp,
        lockedPromotionId: priceLock.lockedPromotionId,
      });
    } catch (err) {
      console.error('[territory/apply] createSectorApplication failed:', err);
      return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }

    const application = await getApplicationById(sectorResult.applicationId);
    if (application) {
      try {
        await pushToHubSpot(application);
      } catch (err) {
        console.error('[territory/apply] HubSpot stub call failed:', err);
      }
    }

    let confirmationEmailSent = false;
    let adminEmailSent = false;
    if (application) {
      const emailCtx = {
        entryType: 'sector' as const,
        applicationId: application.id,
        firmName: application.firm_name,
        contactName: application.contact_name,
        contactRole: application.contact_role,
        contactEmail: application.contact_email,
        contactPhone: application.contact_phone,
        websiteUrl: application.website_url,
        firmPostcode: application.firm_postcode,
        sectorSlug: sector.slug,
        sectorLabel: sector.label,
        postcodeDistrict: requestedPostcodeDistrict,
        aiVisibilityApproach: application.ai_visibility_approach,
        additionalContext: application.additional_context,
        pendingUntil: null as string | null,
      };
      const [adminSent, applicantSent] = await Promise.all([
        sendTerritoryAdminNotification(emailCtx).catch((e) => {
          console.error('[territory/apply] admin email failed:', e);
          return false;
        }),
        sendTerritoryApplicationConfirmation(emailCtx).catch((e) => {
          console.error('[territory/apply] applicant email failed:', e);
          return false;
        }),
      ]);
      adminEmailSent = adminSent;
      confirmationEmailSent = applicantSent;
    }

    return NextResponse.json({
      ok: true,
      applicationId: sectorResult.applicationId,
      pendingUntil: null,
      confirmationEmailSent,
      adminEmailSent,
    });
  }

  // -------------------------------------------------------------------------
  // FREEFORM PATH
  // -------------------------------------------------------------------------
  let freeformResult: { applicationId: string };
  try {
    const priceLock = await resolvePriceLockForPostcode(requestedPostcodeDistrict);
    freeformResult = await createFreeformApplication({
      firmName: data.firmName,
      contactName: data.contactName,
      contactRole: data.contactRole ?? null,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone ?? null,
      websiteUrl: data.websiteUrl ?? null,
      firmPostcode,
      requestedPostcodeDistrict,
      freeformIndustry: data.freeformIndustry,
      aiVisibilityApproach: data.aiVisibilityApproach ?? null,
      additionalContext: data.additionalContext ?? null,
      lockedMonthlyPriceGbp: priceLock.lockedMonthlyPriceGbp,
      lockedSetupFeeGbp: priceLock.lockedSetupFeeGbp,
      lockedPromotionId: priceLock.lockedPromotionId,
    });
  } catch (err) {
    console.error('[territory/apply] createFreeformApplication failed:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }

  const application = await getApplicationById(freeformResult.applicationId);

  if (application) {
    try {
      await pushToHubSpot(application);
    } catch (err) {
      console.error('[territory/apply] HubSpot stub call failed:', err);
    }
  }

  let confirmationEmailSent = false;
  let adminEmailSent = false;
  if (application) {
    const emailCtx = {
      entryType: 'freeform' as const,
      applicationId: application.id,
      firmName: application.firm_name,
      contactName: application.contact_name,
      contactRole: application.contact_role,
      contactEmail: application.contact_email,
      contactPhone: application.contact_phone,
      websiteUrl: application.website_url,
      firmPostcode: application.firm_postcode,
      // For the email templates, treat the freeform industry text as the
      // "sector label" so all existing ${sectorLabel} interpolations read
      // cleanly. Slug is unknown because freeform has no sector row.
      sectorSlug: null,
      sectorLabel: data.freeformIndustry,
      postcodeDistrict: requestedPostcodeDistrict,
      aiVisibilityApproach: application.ai_visibility_approach,
      additionalContext: application.additional_context,
      pendingUntil: null as string | null,
    };
    const [adminSent, applicantSent] = await Promise.all([
      sendTerritoryAdminNotification(emailCtx).catch((e) => {
        console.error('[territory/apply] admin email failed:', e);
        return false;
      }),
      sendTerritoryApplicationConfirmation(emailCtx).catch((e) => {
        console.error('[territory/apply] applicant email failed:', e);
        return false;
      }),
    ]);
    adminEmailSent = adminSent;
    confirmationEmailSent = applicantSent;
  }

  return NextResponse.json({
    ok: true,
    applicationId: freeformResult.applicationId,
    pendingUntil: null,
    confirmationEmailSent,
    adminEmailSent,
  });
}
