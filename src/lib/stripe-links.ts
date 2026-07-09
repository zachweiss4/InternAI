// Stripe checkout URLs for each subscription tier.
// On Vercel, create Stripe Payment Links with a success URL like:
//   https://your-domain.com/payment/success?session_id={CHECKOUT_SESSION_ID}
// Then set these as NEXT_PUBLIC_STRIPE_BASIC_URL and NEXT_PUBLIC_STRIPE_PREMIUM_URL.
export const BASIC_PLAN_URL: string | null = process.env.NEXT_PUBLIC_STRIPE_BASIC_URL ?? null;
export const PREMIUM_PLAN_URL: string | null = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_URL ?? null;
