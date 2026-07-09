import 'server-only';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/require-auth';

export const dynamic = 'force-dynamic';

const RedeemPromoCodeRequest = z.object({
  code: z.string().trim().min(1).max(80),
});

function subscriptionPayload(subscription: {
  plan: string;
  status: string;
  currentPeriodEnd: Date | null;
}) {
  return {
    plan: subscription.plan,
    status: subscription.status,
    currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
  };
}

export async function POST(req: Request) {
  let user: Awaited<ReturnType<typeof requireAuth>>;
  try {
    user = await requireAuth(req);
  } catch (res) {
    return res as Response;
  }

  const json = await req.json().catch(() => null);
  const parsed = RedeemPromoCodeRequest.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: 'Enter a valid code' }, { status: 400 });
  }

  const code = parsed.data.code.trim().toUpperCase();
  const now = new Date();

  try {
    const subscription = await prisma.$transaction(async (tx) => {
      const promo = await tx.subscriptionPromoCode.findUnique({ where: { code } });
      if (!promo || promo.disabledAt) {
        throw new Error('invalid_code');
      }
      if (promo.expiresAt && promo.expiresAt.getTime() < now.getTime()) {
        throw new Error('expired_code');
      }
      if (promo.redeemedCount >= promo.maxRedemptions) {
        throw new Error('fully_redeemed');
      }

      const previousRedemption = await tx.subscriptionPromoRedemption.findUnique({
        where: { codeId_userId: { codeId: promo.id, userId: user.id } },
      });
      if (previousRedemption) {
        throw new Error('already_redeemed');
      }

      await tx.subscriptionPromoRedemption.create({
        data: { codeId: promo.id, userId: user.id },
      });
      await tx.subscriptionPromoCode.update({
        where: { id: promo.id },
        data: { redeemedCount: { increment: 1 } },
      });

      const existingSubscription = await tx.userSubscription.findUnique({
        where: { userId: user.id },
      });
      const extensionBase =
        existingSubscription?.currentPeriodEnd &&
        existingSubscription.currentPeriodEnd.getTime() > now.getTime()
          ? existingSubscription.currentPeriodEnd
          : now;
      const currentPeriodEnd = new Date(extensionBase);
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + promo.months);

      return tx.userSubscription.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          plan: promo.plan,
          status: 'active',
          currentPeriodEnd,
        },
        update: {
          plan: promo.plan,
          status: 'active',
          currentPeriodEnd,
        },
      });
    });

    return Response.json({ subscription: subscriptionPayload(subscription) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'redeem_failed';
    const errors: Record<string, string> = {
      invalid_code: 'That code is not valid.',
      expired_code: 'That code has expired.',
      fully_redeemed: 'That code has already been fully used.',
      already_redeemed: 'You already redeemed that code.',
    };
    return Response.json({ error: errors[message] ?? 'Could not redeem that code.' }, { status: 400 });
  }
}
