import { beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

let matchesLocationFilter: typeof import('@/lib/search/internships').matchesLocationFilter;

beforeAll(async () => {
  ({ matchesLocationFilter } = await import('@/lib/search/internships'));
});

describe('United States location filtering', () => {
  it('keeps U.S. and remote listings', () => {
    expect(matchesLocationFilter('New York, NY', 'United States', 'on-site')).toBe(true);
    expect(matchesLocationFilter('Remote', 'United States', 'remote')).toBe(true);
  });

  it('keeps ambiguous company-site locations instead of hiding valid U.S. jobs', () => {
    expect(matchesLocationFilter('Mountain View', 'United States', 'on-site')).toBe(true);
    expect(matchesLocationFilter('See posting', 'United States', 'on-site')).toBe(true);
  });

  it('rejects explicitly foreign locations', () => {
    expect(matchesLocationFilter('Toronto, Canada', 'United States', 'on-site')).toBe(false);
    expect(matchesLocationFilter('London, United Kingdom', 'United States', 'on-site')).toBe(false);
    expect(matchesLocationFilter('FR-Paris', 'United States', 'on-site')).toBe(false);
    expect(matchesLocationFilter('Canada', 'United States', 'remote')).toBe(false);
  });

  it('keeps state filters strict', () => {
    expect(matchesLocationFilter('Miami, FL', 'Florida', 'on-site')).toBe(true);
    expect(matchesLocationFilter('See posting', 'Florida', 'on-site')).toBe(false);
  });
});
