/**
 * UK pricing calculator (`QuoteCalculator`) — resume step resolution and migrations.
 * Extracted for reuse by `scripts/verify-quote-scenarios.ts`.
 */

export const UK_CALCULATOR_TOTAL_STEPS = 8;

/** Bumped when wizard step indices change (e.g. 9-step → 8-step); skips legacy migrations for new saves. */
export const UK_CALCULATOR_SCHEMA_VERSION = 2;

/** Maps very old 6-step wizard indices to an intermediate 8-step-era numbering (pre–entity-step flows). */
export function mapLegacySixStepToEight(oldStep: number): number {
  if (oldStep <= 1) return oldStep;
  if (oldStep === 2) return 4;
  if (oldStep === 3) return 5;
  if (oldStep === 4) return 6;
  if (oldStep === 5) return 7;
  return 8;
}

/**
 * After removing the "existing site" step (old step 3), stored `currentStep` values from the
 * previous 9-step wizard must decrement by 1 for steps ≥ 3 so mid-flow users land on the
 * equivalent screen. Quotes saved with {@link UK_CALCULATOR_SCHEMA_VERSION} skip this.
 */
export function migrateNineStepWizardToEight(
  storedStep: number,
  schemaVersion: number | undefined
): number {
  let s = storedStep;
  if (!schemaVersion || schemaVersion < UK_CALCULATOR_SCHEMA_VERSION) {
    if (s >= 3) s -= 1;
  }
  return s;
}

export function resolveUkResumeDisplayStep(
  rawDbStep: number,
  selections: Record<string, unknown> | undefined,
  legacyShape: boolean,
  totalSteps: number = UK_CALCULATOR_TOTAL_STEPS
): number {
  let step = rawDbStep;
  if (legacyShape && step > 1) {
    step = mapLegacySixStepToEight(step);
  }
  step = migrateNineStepWizardToEight(step, selections?.calculatorSchemaVersion as number | undefined);
  return Math.max(1, Math.min(step, totalSteps));
}
