import 'server-only';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/require-auth';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request) {
  let user: Awaited<ReturnType<typeof requireAuth>>;
  try {
    user = await requireAuth(req);
  } catch (res) {
    return res as Response;
  }

  await prisma.userSubscription.upsert({
    where: { userId: user.id },
    create: { userId: user.id, plan: 'free', status: 'cancelled' },
    update: { status: 'cancelled' },
  });

  return Response.json({ success: true });
}
