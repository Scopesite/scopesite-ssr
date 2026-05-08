import { describe, expect, it } from 'vitest';
import {
  extractPostcodeArea,
  isBareUkPostcodeArea,
  isValidUkPostcodeInput,
  shouldSkipPostcodesIoLiveValidation,
} from './postcodeNormalize';

describe('isBareUkPostcodeArea', () => {
  it('accepts two-letter pilot-style areas', () => {
    expect(isBareUkPostcodeArea('WV')).toBe(true);
    expect(isBareUkPostcodeArea('EC')).toBe(true);
    expect(isBareUkPostcodeArea('SW')).toBe(true);
  });

  it('accepts single-letter areas', () => {
    expect(isBareUkPostcodeArea('B')).toBe(true);
    expect(isBareUkPostcodeArea('M')).toBe(true);
  });

  it('rejects outward codes that include digits', () => {
    expect(isBareUkPostcodeArea('WV1')).toBe(false);
    expect(isBareUkPostcodeArea('B1')).toBe(false);
  });
});

describe('isValidUkPostcodeInput', () => {
  it('accepts bare area, district, and full formats', () => {
    expect(isValidUkPostcodeInput('wv')).toBe(true);
    expect(isValidUkPostcodeInput('WV1')).toBe(true);
    expect(isValidUkPostcodeInput('WV155HJ')).toBe(true);
    expect(isValidUkPostcodeInput('WV15 5HJ')).toBe(true);
    expect(isValidUkPostcodeInput('  sw1a1aa ')).toBe(true);
  });

  it('rejects empty and nonsense', () => {
    expect(isValidUkPostcodeInput('')).toBe(false);
    expect(isValidUkPostcodeInput('   ')).toBe(false);
    expect(isValidUkPostcodeInput('ZZ99')).toBe(false);
  });
});

describe('extractPostcodeArea', () => {
  it('maps all WV variants to WV', () => {
    expect(extractPostcodeArea('wv')).toBe('WV');
    expect(extractPostcodeArea('WV1')).toBe('WV');
    expect(extractPostcodeArea('wv155hj')).toBe('WV');
    expect(extractPostcodeArea('WV15 5HJ')).toBe('WV');
  });

  it('extracts London-style areas', () => {
    expect(extractPostcodeArea('EC1A 1BB')).toBe('EC');
    expect(extractPostcodeArea('SW1A1AA')).toBe('SW');
  });

  it('extracts single-letter areas from districts', () => {
    expect(extractPostcodeArea('B1 1AA')).toBe('B');
    expect(extractPostcodeArea('M1 1AE')).toBe('M');
  });

  it('returns null for invalid input', () => {
    expect(extractPostcodeArea('')).toBe(null);
    expect(extractPostcodeArea('nope')).toBe(null);
  });
});

describe('shouldSkipPostcodesIoLiveValidation', () => {
  it('skips live validate for district-only and bare area', () => {
    expect(shouldSkipPostcodesIoLiveValidation('WV')).toBe(true);
    expect(shouldSkipPostcodesIoLiveValidation('BS20')).toBe(true);
  });

  it('does not skip for plausible full postcodes', () => {
    expect(shouldSkipPostcodesIoLiveValidation('WV15 5HJ')).toBe(false);
  });
});

describe('search bar resolution parity (integration-style)', () => {
  it('normalises four WV search shapes to the same area key', () => {
    const keys = ['WV', 'WV1', 'WV155HJ', 'WV15 5HJ'].map((s) => extractPostcodeArea(s));
    expect(keys.every((k) => k === 'WV')).toBe(true);
  });
});
