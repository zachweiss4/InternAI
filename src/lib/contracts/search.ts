import { z } from 'zod';

export const SearchQuerySchema = z.object({
  query: z.string().min(1).max(500),
});

export const SearchFiltersSchema = z.object({
  role: z.string().optional(),
  location: z.string().optional(),
  company: z.string().optional(),
  season: z.enum(['summer', 'fall']).optional(),
  profileMatch: z.boolean().optional(),
  includeNonUs: z.boolean().optional(),
  sort: z.enum(['relevance', 'newest']).optional(),
  salaryMin: z.number().optional(),
  modality: z.enum(['remote', 'hybrid', 'on-site']).optional(),
  keywords: z.array(z.string()).default([]),
});

export const InternshipResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  location: z.string(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  modality: z.enum(['remote', 'hybrid', 'on-site']).optional(),
  applyUrl: z.string().url(),
  postedAt: z.string().nullable(),
  matchScore: z.number().min(0).max(100).optional(),
  seasonMatch: z.enum(['summer', 'fall']).optional(),
  fitReasons: z.array(z.string()).optional(),
  description: z.string().optional(),
  source: z.string().optional(),
});

export const SearchResponseSchema = z.object({
  results: z.array(InternshipResultSchema),
  filters: SearchFiltersSchema,
  total: z.number(),
});

export const PaywallResponseSchema = z.object({
  paywallReason: z.enum(['unauthenticated', 'quota_exceeded']),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type SearchFilters = z.infer<typeof SearchFiltersSchema>;
export type InternshipResult = z.infer<typeof InternshipResultSchema>;
export type SearchResponse = z.infer<typeof SearchResponseSchema>;
export type PaywallResponse = z.infer<typeof PaywallResponseSchema>;
