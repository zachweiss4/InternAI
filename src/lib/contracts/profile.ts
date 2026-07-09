import { z } from 'zod';

export const ProfileResponse = z.object({
  userId: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  university: z.string().nullable(),
  graduationYear: z.number().int().nullable(),
  jobKeywords: z.string().nullable(),
  resumeText: z.string().nullable(),
  major: z.string().nullable(),
  gpa: z.number().nullable(),
  skills: z.string().nullable(),
  targetRoles: z.string().nullable(),
  targetLocations: z.string().nullable(),
  salaryExpectations: z.number().int().nullable(),
  sponsorshipRequired: z.boolean().nullable(),
});

export type ProfileResponseType = z.infer<typeof ProfileResponse>;

export const ProfileUpdate = z.object({
  name: z.string().min(1).optional(),
  university: z.string().optional(),
  graduationYear: z.number().int().min(1900).max(2100).optional(),
  jobKeywords: z.string().optional(),
  resumeText: z.string().optional(),
  major: z.string().optional(),
  gpa: z.number().min(0).max(4).optional(),
  skills: z.string().optional(),
  targetRoles: z.string().optional(),
  targetLocations: z.string().optional(),
  salaryExpectations: z.number().int().min(0).optional(),
  sponsorshipRequired: z.boolean().optional(),
});

export type ProfileUpdateType = z.infer<typeof ProfileUpdate>;
