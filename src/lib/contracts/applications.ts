import { z } from 'zod';

export const ApplicationStatusEnum = z.enum(['Applied', 'Interviewing', 'Rejected', 'Offer']);

export const ApplicationCreate = z.object({
  jobId: z.string().min(1),
  jobTitle: z.string().min(1),
  company: z.string().min(1),
  applyUrl: z.string().url(),
});

export const ApplicationStatusUpdate = z.object({
  status: ApplicationStatusEnum,
});

export const ApplicationResponse = z.object({
  id: z.string(),
  jobId: z.string(),
  jobTitle: z.string(),
  company: z.string(),
  applyUrl: z.string().url(),
  status: ApplicationStatusEnum,
  appliedAt: z.string(),
  updatedAt: z.string(),
});

export const ApplicationsListResponse = z.object({
  applications: z.array(ApplicationResponse),
});

export type ApplicationCreateType = z.infer<typeof ApplicationCreate>;
export type ApplicationStatusUpdateType = z.infer<typeof ApplicationStatusUpdate>;
export type ApplicationResponseType = z.infer<typeof ApplicationResponse>;
