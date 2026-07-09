import 'server-only';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/require-auth';
import { verifyCheckoutSession } from '@/lib/stripe-billing/client';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  let user: Awaited<ReturnType<typeof requireAuth>>;
  try {
    user = await requireAuth(req);
  } catch (res) {
    return res as Response;
  }

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');
  if (!sessionId) {
    return Response.json({ error: 'Missing session_id' }, { status: 400 });
  }

  // Idempotent: already fulfilled for this session
  const existing = await prisma.userSubscription.findUnique({
    where: { checkoutSessionId: sessionId },
  });
  if (existing) {
    return Response.json({ status: 'fulfilled', plan: existing.plan });
  }

  const result = await verifyCheckoutSession({ sessionId });
  if (!result.verified) {
    return Response.json({ status: 'pending' });
  }

  const plan = result.payment?.plan ?? 'basic';

  // Derive currentPeriodEnd: 30 days from now as approximation
  const currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await prisma.userSubscription.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      plan,
      status: 'active',
      checkoutSessionId: sessionId,
      currentPeriodEnd,
    },
    update: {
      plan,
      status: 'active',
      checkoutSessionId: sessionId,
      currentPeriodEnd,
    },
  });

  return Response.json({ status: 'fulfilled', plan });
}
