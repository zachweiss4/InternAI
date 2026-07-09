import { z } from 'zod';

export const AlertTimeframe = z.enum(['daily', 'three_days', 'weekly']);
export const AlertSeason = z.enum(['summer', 'fall']);

export const AlertCreate = z.object({
  companyNames: z.array(z.string().min(1)).optional().default([]),
  fieldNames: z.array(z.string().min(1)).optional().default([]),
  field: z.string().optional(),
  location: z.string().optional(),
  locations: z.array(z.string().min(1)).optional().default([]),
  season: AlertSeason.optional().nullable(),
  timeframe: AlertTimeframe.optional().default('daily'),
});

export const AlertUpdate = AlertCreate;

export const AlertResponse = z.object({
  id: z.string(),
  companyNames: z.array(z.string()),
  fieldNames: z.array(z.string()),
  field: z.string().nullable(),
  location: z.string().nullable(),
  locations: z.array(z.string()),
  season: AlertSeason.nullable(),
  timeframe: AlertTimeframe,
  createdAt: z.string(),
  lastCheckedAt: z.string().nullable(),
  lastNotifiedAt: z.string().nullable(),
});

export const AlertsListResponse = z.object({
  alerts: z.array(AlertResponse),
});

export type AlertCreateType = z.infer<typeof AlertCreate>;
export type AlertUpdateType = z.infer<typeof AlertUpdate>;
export type AlertResponseType = z.infer<typeof AlertResponse>;
export type AlertSeasonType = z.infer<typeof AlertSeason>;
export type AlertTimeframeType = z.infer<typeof AlertTimeframe>;
