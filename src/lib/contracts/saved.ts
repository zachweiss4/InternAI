import { z } from 'zod';

export const JobDataSchema = z.object({
  title: z.string(),
  company: z.string(),
  location: z.string(),
  applyUrl: z.string().url(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  modality: z.enum(['remote', 'hybrid', 'on-site']).optional(),
  description: z.string().optional(),
  matchScore: z.number().optional(),
});

export const SavedInternshipCreate = z.object({
  jobId: z.string().min(1),
  jobData: JobDataSchema,
});

export const SavedInternshipResponse = z.object({
  id: z.string(),
  jobId: z.string(),
  jobData: JobDataSchema,
  savedAt: z.string(),
});

export const SavedInternshipListResponse = z.object({
  saved: z.array(SavedInternshipResponse),
});

export type JobDataType = z.infer<typeof JobDataSchema>;
export type SavedInternshipCreateType = z.infer<typeof SavedInternshipCreate>;
export type SavedInternshipResponseType = z.infer<typeof SavedInternshipResponse>;
