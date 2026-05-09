/**
 * Human-readable UK /pricing quote selections for admin emails (abandoned digest, partial lead alerts).
 */

import {
  ADDON_CATALOG,
  INTENT_PATH_COPY,
  PRICING_LABELS,
} from '@/lib/pricing-config';
import type { EcommerceSize, IntentAddOnKey, PaymentPreference, QuoteIntent, WebAppSize } from '@/types/pricing';

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** UK calculator steps (after entity gate) — matches QuoteCalculator STEPS order */
const UK_STEP_LABELS: Record<number, string> = {
  1: 'Legal entity',
  2: 'Welcome',
  3: 'Existing site',
  4: 'Your goal',
  5: 'Build type',
  6: 'Scope',
  7: 'Add-ons',
  8: 'Payment plan',
  9: 'Summary',
};

export function ukPricingStepLabel(step: number): string {
  return UK_STEP_LABELS[step] || `Step ${step}`;
}

/**
 * HTML fragment (no outer wrapper) listing captured UK quote selections.
 * For US calculator rows (`selections.serviceType`), returns a short placeholder.
 */
export function formatQuoteSelectionsSnapshotHtml(selections: Record<string, unknown>): string {
  if (selections.serviceType != null) {
    return `<p style="margin:0;color:#555;font-size:13px;line-height:1.5;">US quote path — detailed snapshot not expanded here.</p>`;
  }

  const lines: string[] = [];

  const entityType = selections.entityType;
  if (entityType === 'limited') {
    const raw = selections.companyName;
    if (typeof raw === 'string' && raw.trim()) {
      lines.push(`<strong>Legal company (Ltd/LLP):</strong> ${esc(raw.trim())}`);
    } else {
      lines.push('<strong>Legal entity:</strong> Limited company / LLP (name not entered yet)');
    }
  } else if (entityType === 'sole_trader') {
    lines.push('<strong>Legal entity:</strong> Sole trader / individual');
  } else if (entityType != null) {
    lines.push(`<strong>Legal entity:</strong> ${esc(String(entityType))}`);
  }

  if (typeof selections.hasExistingSite === 'boolean') {
    lines.push(`<strong>Existing site (40% discount path):</strong> ${selections.hasExistingSite ? 'Yes' : 'No'}`);
  }

  const intent = selections.intent as QuoteIntent | undefined;
  if (intent && INTENT_PATH_COPY[intent]) {
    lines.push(`<strong>Goal:</strong> ${esc(INTENT_PATH_COPY[intent].title)}`);
  }

  const projectType = selections.projectType as string | undefined;
  if (projectType === 'ssr') {
    lines.push(`<strong>Build type:</strong> ${esc(PRICING_LABELS.projectTypes.ssr)}`);
  } else if (projectType === 'clientManaged') {
    lines.push(`<strong>Build type:</strong> ${esc(PRICING_LABELS.projectTypes.clientManaged)}`);
  } else if (projectType) {
    lines.push(`<strong>Build type:</strong> ${esc(projectType)}`);
  }

  const scope = selections.scope as Record<string, unknown> | undefined;
  if (scope && typeof scope === 'object') {
    if (typeof scope.pageCount === 'number') {
      lines.push(`<strong>Pages:</strong> ${scope.pageCount}`);
    }
    const ec = scope.ecommerce as EcommerceSize | undefined;
    if (ec && PRICING_LABELS.ecommerce[ec]) {
      lines.push(`<strong>E-commerce:</strong> ${esc(PRICING_LABELS.ecommerce[ec])}`);
    }
    const wa = scope.webApp as WebAppSize | undefined;
    if (wa && PRICING_LABELS.webApps[wa]) {
      lines.push(`<strong>Custom web app:</strong> ${esc(PRICING_LABELS.webApps[wa])}`);
    }
    if (scope.hasBlog === true) lines.push('<strong>Blog / news:</strong> Yes');
    if (scope.hasComplexForms === true) {
      lines.push(`<strong>Forms:</strong> ${esc(PRICING_LABELS.addOns.complexForms)}`);
    }
    if (scope.hasAutomation === true) {
      lines.push(`<strong>Automation:</strong> ${esc(PRICING_LABELS.addOns.automationSetup)}`);
    }
  }

  const addOns = selections.addOns as Record<string, unknown> | undefined;
  if (addOns && typeof addOns === 'object') {
    const picked: string[] = [];
    for (const key of Object.keys(ADDON_CATALOG) as IntentAddOnKey[]) {
      if (addOns[key] === true) {
        picked.push(ADDON_CATALOG[key].label);
      }
    }
    if (addOns.voice === true) {
      picked.push(PRICING_LABELS.addOns.voice);
    }
    const videoLong = addOns.videoLong;
    if (typeof videoLong === 'number' && videoLong > 0) {
      picked.push(`${PRICING_LABELS.addOns.videoLong} ×${videoLong}`);
    }
    if (picked.length > 0) {
      lines.push(`<strong>Add-ons:</strong> ${picked.map(esc).join(', ')}`);
    }
  }

  const paymentPreference = selections.paymentPreference as PaymentPreference | undefined;
  if (paymentPreference && PRICING_LABELS.payments[paymentPreference]) {
    lines.push(`<strong>Payment preference:</strong> ${esc(PRICING_LABELS.payments[paymentPreference])}`);
  }

  if (lines.length === 0) {
    return '<p style="margin:0;color:#777;font-size:13px;">No detailed selections recorded yet.</p>';
  }

  return `<ul style="margin:8px 0 0 18px;padding:0;color:#333;font-size:13px;line-height:1.55;">${lines
    .map((line) => `<li style="margin-bottom:4px;">${line}</li>`)
    .join('')}</ul>`;
}
