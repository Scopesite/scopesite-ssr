/**
 * Territory Command - HubSpot stub (Phase A).
 *
 * Real HubSpot integration is deferred to Phase B. This file exists so that
 * the Phase A apply route already has the wiring in place - one function
 * swap and we're live.
 *
 * Phase B plan (NOT implemented here):
 *   - Direct fetch() to HubSpot Private App API
 *   - Pipeline: "Territory Command"
 *   - Stage: "Application Received"
 *   - Two calls: POST contact, POST deal linked to contact
 *   - One env var: HUBSPOT_PRIVATE_APP_TOKEN
 *
 * Do NOT install @hubspot/api-client. Do NOT add HubSpot env vars in Phase A.
 */

import type { Application } from './types';

export interface HubSpotStubResult {
  stubbed: true;
  firmName: string;
  email: string;
  territory: string;
}

export async function pushToHubSpot(
  application: Application,
): Promise<HubSpotStubResult> {
  const payload: HubSpotStubResult = {
    stubbed: true,
    firmName: application.firm_name,
    email: application.contact_email,
    territory: `${application.firm_postcode} ${application.sector_slug}`,
  };

  console.warn('[territory/apply] HubSpot stub called, would push:', payload);
  return payload;
}
