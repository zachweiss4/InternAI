import 'server-only';
import { z } from 'zod';
import { requireAuth } from '@/lib/require-auth';

export const dynamic = 'force-dynamic';

const CheckoutRequest = z.object({
  plan: z.enum(['basic', 'premium']),
});

function priceIdForPlan(plan: 'basic' | 'premium') {
  return plan === 'basic' ? process.env.STRIPE_BASIC_PRICE_ID : process.env.STRIPE_PREMIUM_PRICE_ID;
}

export async function POST(req: Request) {
  let user: Awaited<ReturnType<typeof requireAuth>>;
  try {
    user = await requireAuth(req);
  } catch (res) {
    return res as Response;
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return Response.json({ error: 'Stripe is not configured' }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const parsed = CheckoutRequest.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const priceId = priceIdForPlan(parsed.data.plan);
  if (!priceId) {
    return Response.json({ error: `${parsed.data.plan} price is not configured` }, { status: 503 });
  }

  const { default: Stripe } = await import('stripe');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/+$/, '');

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/pricing`,
    metadata: {
      userId: user.id,
      plan: parsed.data.plan,
    },
  });

  return Response.json({ url: session.url });
}
