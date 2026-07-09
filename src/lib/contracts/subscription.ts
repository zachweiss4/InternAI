import { z } from 'zod';

export const SubscriptionStatusSchema = z.object({
  plan: z.enum(['free', 'basic', 'premium']),
  status: z.enum(['active', 'cancelled', 'past_due', 'none']),
  currentPeriodEnd: z.string().nullable(),
});

export const PollResponseSchema = z.object({
  status: z.enum(['pending', 'fulfilled']),
  plan: z.enum(['free', 'basic', 'premium']).optional(),
});

export const PaywallResponseSchema = z.object({
  paywallReason: z.enum(['unauthenticated', 'quota_exceeded']),
});

export type SubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>;
export type PollResponse = z.infer<typeof PollResponseSchema>;
export type PaywallResponse = z.infer<typeof PaywallResponseSchema>;
