import type {
  AlertCreateType,
  AlertResponseType,
  AlertSeasonType,
  AlertTimeframeType,
  AlertUpdateType,
} from '@/lib/contracts/alerts';

const MAX_ALERT_ITEMS = 25;

export function uniqueTrimmed(values: string[]): string[] {
  const seen = new Set<string>();
  const cleaned: string[] = [];

  for (const value of values) {
    const name = value.trim();
    const key = name.toLowerCase();
    if (!name || seen.has(key)) continue;
    seen.add(key);
    cleaned.push(name);
    if (cleaned.length >= MAX_ALERT_ITEMS) break;
  }

  return cleaned;
}

export function normalizeAlertInput(input: AlertCreateType | AlertUpdateType): {
  companyNames: string[];
  fieldNames: string[];
  field: string | null;
  location: string | null;
  locations: string[];
  season: AlertSeasonType | null;
  timeframe: AlertTimeframeType;
} {
  const fieldNames = uniqueTrimmed([...(input.fieldNames ?? []), input.field ?? '']);
  const locations = uniqueTrimmed([...(input.locations ?? []), input.location ?? '']);

  return {
    companyNames: uniqueTrimmed(input.companyNames ?? []),
    fieldNames,
    field: fieldNames[0] ?? null,
    location: locations[0] ?? null,
    locations,
    season: input.season === 'summer' || input.season === 'fall' ? input.season : null,
    timeframe: input.timeframe ?? 'daily',
  };
}

export function serializeJobAlert(row: {
  id: string;
  companyNames: string[];
  fieldNames?: string[];
  field: string | null;
  location: string | null;
  locations?: string[];
  season?: string | null;
  timeframe?: string;
  createdAt: Date;
  lastCheckedAt?: Date | null;
  lastNotifiedAt: Date | null;
}): AlertResponseType {
  const fieldNames = row.fieldNames?.length ? row.fieldNames : row.field ? [row.field] : [];
  const locations = row.locations?.length ? row.locations : row.location ? [row.location] : [];

  return {
    id: row.id,
    companyNames: row.companyNames,
    fieldNames,
    field: row.field,
    location: row.location,
    locations,
    season: row.season === 'summer' || row.season === 'fall' ? row.season : null,
    timeframe:
      row.timeframe === 'three_days' || row.timeframe === 'weekly' ? row.timeframe : 'daily',
    createdAt: row.createdAt.toISOString(),
    lastCheckedAt: row.lastCheckedAt?.toISOString() ?? null,
    lastNotifiedAt: row.lastNotifiedAt?.toISOString() ?? null,
  };
}
