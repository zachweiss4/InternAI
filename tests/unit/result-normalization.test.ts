import { describe, expect, it } from 'vitest';
import {
  formatPostingAge,
  normalizePostingDate,
  normalizeUnixPostingDate,
  postingDateTimestamp,
} from '@/lib/search/result-normalization';

const NOW = Date.UTC(2026, 6, 8, 16, 0, 0);

describe('posting date normalization', () => {
  it('preserves valid provider dates', () => {
    expect(normalizePostingDate('2026-07-02T12:00:00Z', NOW)).toBe('2026-07-02T12:00:00.000Z');
  });

  it('converts relative provider dates', () => {
    expect(normalizePostingDate('3 days ago', NOW)).toBe('2026-07-05T16:00:00.000Z');
    expect(normalizePostingDate('an hour ago', NOW)).toBe('2026-07-08T15:00:00.000Z');
  });

  it('does not pretend missing or invalid dates were posted today', () => {
    expect(normalizePostingDate(undefined, NOW)).toBeNull();
    expect(normalizePostingDate('Recently posted', NOW)).toBeNull();
    expect(formatPostingAge(null, NOW)).toBe('Date not provided');
  });

  it('normalizes Unix seconds and places unknown dates last', () => {
    expect(normalizeUnixPostingDate(NOW / 1000, NOW)).toBe('2026-07-08T16:00:00.000Z');
    expect(postingDateTimestamp(null)).toBe(0);
  });
});
