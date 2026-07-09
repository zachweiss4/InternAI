import 'server-only';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/require-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  let user: Awaited<ReturnType<typeof requireAuth>>;
  try {
    user = await requireAuth(req);
  } catch (res) {
    return res as Response;
  }

  const subscription = await prisma.userSubscription.findUnique({
    where: { userId: user.id },
  });

  return Response.json({
    plan: subscription?.plan ?? 'free',
    status: subscription?.status ?? 'none',
    currentPeriodEnd: subscription?.currentPeriodEnd?.toISOString() ?? null,
  });
}
