import { z } from 'zod';

export const ResumeRecommendation = z.object({
  title: z.string(),
  query: z.string(),
  reason: z.string(),
});

export const ResumeRewrite = z.object({
  before: z.string(),
  after: z.string(),
  reason: z.string(),
});

export const ResumeAnalysisResponse = z.object({
  score: z.number().int().min(0).max(100),
  summary: z.string(),
  strengths: z.array(z.string()).default([]),
  improvements: z.array(z.string()).default([]),
  rewrites: z.array(ResumeRewrite).default([]),
  recommendedSearches: z.array(ResumeRecommendation).default([]),
  source: z.enum(['ai', 'local']).default('local'),
});

export type ResumeAnalysisResponseType = z.infer<typeof ResumeAnalysisResponse>;
