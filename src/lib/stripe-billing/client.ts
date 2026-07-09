// Server-only helpers for Stripe billing.

import 'server-only';
import { env } from '@/lib/env';
import {
  type CheckoutVerificationResult,
  checkoutVerificationResultSchema,
  type SubscriptionStatusResult,
  subscriptionStatusResultSchema,
} from '@/lib/stripe-billing/schema';

export class StripeBillingConfigurationError extends Error {
  constructor(message = 'Stripe billing is not configured for this app.') {
    super(message);
    this.name = 'StripeBillingConfigurationError';
  }
}

export interface VerifyCheckoutSessionInput {
  sessionId: string;
}

export interface GetSubscriptionStatusInput {
  email: string;
}

async function getStripeCheckoutVerification(
  sessionId: string,
): Promise<CheckoutVerificationResult> {
  if (!env.STRIPE_SECRET_KEY) {
    throw new StripeBillingConfigurationError(
      'Stripe billing is not configured. Set STRIPE_SECRET_KEY.',
    );
  }

  const { default: Stripe } = await import('stripe');
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items.data.price.product'],
  });

  const isPaid = session.payment_status === 'paid' || session.status === 'complete';
  const lineItem = session.line_items?.data[0];
  const product = lineItem?.price?.product;
  const productName =
    typeof product === 'object' && product && 'name' in product ? product.name : undefined;

  return checkoutVerificationResultSchema.parse({
    verified: isPaid,
    payment: isPaid
      ? {
          amount_usd: (session.amount_total ?? 0) / 100,
          customer_email: session.customer_details?.email ?? session.customer_email ?? null,
          plan:
            session.metadata?.plan === 'basic' || session.metadata?.plan === 'premium'
              ? session.metadata.plan
              : null,
          product_name: productName ?? null,
          paid_at: session.created ? new Date(session.created * 1000).toISOString() : null,
        }
      : undefined,
  });
}

export async function verifyCheckoutSession(
  input: VerifyCheckoutSessionInput,
): Promise<CheckoutVerificationResult> {
  return getStripeCheckoutVerification(input.sessionId);
}

export async function getSubscriptionStatus(
  input: GetSubscriptionStatusInput,
): Promise<SubscriptionStatusResult> {
  return subscriptionStatusResultSchema.parse({
    active: false,
    customer_email: input.email,
  });
}
