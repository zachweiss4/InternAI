import { beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

let matchesLocationFilter: typeof import('@/lib/search/internships').matchesLocationFilter;
let matchesSearchLocationPolicy: typeof import('@/lib/search/internships').matchesSearchLocationPolicy;

beforeAll(async () => {
  ({ matchesLocationFilter, matchesSearchLocationPolicy } = await import(
    '@/lib/search/internships'
  ));
});

describe('United States location filtering', () => {
  it('keeps U.S. and remote listings', () => {
    expect(matchesLocationFilter('New York, NY', 'United States', 'on-site')).toBe(true);
    expect(matchesLocationFilter('Remote', 'United States', 'remote')).toBe(true);
  });

  it('keeps ambiguous company-site locations instead of hiding valid U.S. jobs', () => {
    expect(matchesLocationFilter('Mountain View', 'United States', 'on-site')).toBe(true);
    expect(matchesLocationFilter('See posting', 'United States', 'on-site')).toBe(true);
    expect(matchesLocationFilter('Multiple locations', 'United States', 'on-site')).toBe(true);
    expect(matchesLocationFilter('Location flexible', 'United States', 'hybrid')).toBe(true);
  });

  it('rejects explicitly foreign locations', () => {
    expect(matchesLocationFilter('Toronto, Canada', 'United States', 'on-site')).toBe(false);
    expect(matchesLocationFilter('London, United Kingdom', 'United States', 'on-site')).toBe(false);
    expect(matchesLocationFilter('FR-Paris', 'United States', 'on-site')).toBe(false);
    expect(matchesLocationFilter('Canada', 'United States', 'remote')).toBe(false);
    expect(matchesLocationFilter('Bangalore, India', 'United States', 'on-site')).toBe(false);
  });

  it('keeps partially ambiguous foreign-looking locations instead of overblocking', () => {
    expect(matchesLocationFilter('Remote - Canada', 'United States', 'remote')).toBe(true);
    expect(matchesLocationFilter('Hybrid - Toronto, Canada', 'United States', 'hybrid')).toBe(true);
    expect(
      matchesLocationFilter('Multiple locations: London, United Kingdom', 'United States'),
    ).toBe(true);
    expect(matchesLocationFilter('Americas', 'United States', 'on-site')).toBe(true);
  });

  it('does not treat U.S. cities containing country-name fragments as foreign', () => {
    expect(matchesLocationFilter('Indianapolis, IN', 'United States', 'on-site')).toBe(true);
    expect(matchesLocationFilter('Indianapolis', 'United States', 'on-site')).toBe(true);
    expect(matchesSearchLocationPolicy('Indianapolis, IN', {}, 'on-site')).toBe(true);
  });

  it('does not treat U.S. state-code prefixes as foreign country codes', () => {
    expect(matchesLocationFilter('CA - San Francisco', 'United States', 'on-site')).toBe(true);
    expect(matchesLocationFilter('CO - Denver', 'United States', 'on-site')).toBe(true);
    expect(matchesLocationFilter('IN - Indianapolis', 'United States', 'on-site')).toBe(true);
    expect(matchesLocationFilter('GB - London', 'United States', 'on-site')).toBe(false);
  });

  it('keeps state filters strict', () => {
    expect(matchesLocationFilter('Miami, FL', 'Florida', 'on-site')).toBe(true);
    expect(matchesLocationFilter('See posting', 'Florida', 'on-site')).toBe(false);
  });

  it('defaults broad searches to U.S. safe results', () => {
    expect(matchesSearchLocationPolicy('Seattle, WA', {}, 'on-site')).toBe(true);
    expect(matchesSearchLocationPolicy('Remote, United States', {}, 'remote')).toBe(true);
    expect(matchesSearchLocationPolicy('See posting', {}, 'on-site')).toBe(true);
    expect(matchesSearchLocationPolicy('Toronto, Canada', {}, 'on-site')).toBe(false);
    expect(matchesSearchLocationPolicy('London, United Kingdom', {}, 'hybrid')).toBe(false);
  });

  it('keeps remote searches U.S. safe unless worldwide is selected', () => {
    expect(matchesSearchLocationPolicy('Remote', { location: 'Remote' }, 'remote')).toBe(true);
    expect(matchesSearchLocationPolicy('Canada', { location: 'Remote' }, 'remote')).toBe(false);
    expect(
      matchesSearchLocationPolicy('Canada', { location: 'Remote', includeNonUs: true }, 'remote'),
    ).toBe(true);
  });

  it('allows outside-U.S. results only when selected intentionally', () => {
    expect(matchesSearchLocationPolicy('Toronto, Canada', { includeNonUs: true }, 'on-site')).toBe(
      true,
    );
    expect(
      matchesSearchLocationPolicy('London, United Kingdom', { location: 'Worldwide' }, 'hybrid'),
    ).toBe(true);
    expect(
      matchesSearchLocationPolicy('London, United Kingdom', { location: 'London' }, 'hybrid'),
    ).toBe(true);
  });

  it('keeps known U.S. city filters U.S. safe', () => {
    expect(matchesSearchLocationPolicy('Boston, MA', { location: 'Boston' }, 'on-site')).toBe(true);
    expect(matchesSearchLocationPolicy('Boston', { location: 'Boston' }, 'on-site')).toBe(true);
    expect(
      matchesSearchLocationPolicy('Boston, United Kingdom', { location: 'Boston' }, 'on-site'),
    ).toBe(false);
    expect(
      matchesSearchLocationPolicy('Seattle, United Kingdom', { location: 'Seattle' }, 'on-site'),
    ).toBe(false);
  });
});
