import { describe, expect, it } from 'vitest';
import { shouldPromptBulkSectorConfirm } from './sectorBulkConfirm';

describe('shouldPromptBulkSectorConfirm', () => {
  it('returns true for 10 or more', () => {
    expect(shouldPromptBulkSectorConfirm(10)).toBe(true);
    expect(shouldPromptBulkSectorConfirm(100)).toBe(true);
  });

  it('returns false below 10', () => {
    expect(shouldPromptBulkSectorConfirm(9)).toBe(false);
    expect(shouldPromptBulkSectorConfirm(0)).toBe(false);
  });
});
