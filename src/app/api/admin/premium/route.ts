import 'server-only';
import { headers } from 'next/headers';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

const PremiumGrantRequest = z.object({
  email: z.string().email(),
  plan: z.enum(['basic', 'premium']).default('premium'),
  months: z.number().int().min(1).max(120).default(12),
});

async function requireAdminApi(): Promise<Response | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const ownerEmail = env.OWNER_EMAIL?.toLowerCase();
  const isOwner = ownerEmail && session.user.email.toLowerCase() === ownerEmail;
  if (session.user.role !== 'admin' && !isOwner) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (isOwner && session.user.role !== 'admin') {
    await prisma.user
      .update({ where: { id: session.user.id }, data: { role: 'admin' } })
      .catch(() => {});
  }
  return null;
}

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

export async function GET(req: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email')?.trim().toLowerCase();
  if (!email) {
    return Response.json({ error: 'Missing email' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return Response.json({ found: false });
  }

  const subscription = await prisma.userSubscription.findUnique({
    where: { userId: user.id },
  });

  return Response.json({
    found: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role ?? 'user',
    },
    subscription: subscription ? subscriptionPayload(subscription) : null,
  });
}

export async function POST(req: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const json = await req.json().catch(() => null);
  const parsed = PremiumGrantRequest.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return Response.json({ error: 'No user found with that email' }, { status: 404 });
  }

  const currentPeriodEnd = new Date();
  currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + parsed.data.months);

  const subscription = await prisma.userSubscription.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      plan: parsed.data.plan,
      status: 'active',
      currentPeriodEnd,
    },
    update: {
      plan: parsed.data.plan,
      status: 'active',
      currentPeriodEnd,
    },
  });

  return Response.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role ?? 'user',
    },
    subscription: subscriptionPayload(subscription),
  });
}

export async function DELETE(req: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email')?.trim().toLowerCase();
  if (!email) {
    return Response.json({ error: 'Missing email' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return Response.json({ error: 'No user found with that email' }, { status: 404 });
  }

  const subscription = await prisma.userSubscription.upsert({
    where: { userId: user.id },
    create: { userId: user.id, plan: 'free', status: 'cancelled' },
    update: {
      plan: 'free',
      status: 'cancelled',
      currentPeriodEnd: null,
      checkoutSessionId: null,
    },
  });

  return Response.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role ?? 'user',
    },
    subscription: subscriptionPayload(subscription),
  });
}
