import 'server-only';
import { headers } from 'next/headers';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

const CreatePromoCodeRequest = z.object({
  code: z
    .string()
    .trim()
    .min(4)
    .max(40)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .optional(),
  plan: z.enum(['basic', 'premium']).default('premium'),
  months: z.number().int().min(1).max(120).default(12),
  maxRedemptions: z.number().int().min(1).max(1000).default(1),
  expiresAt: z.string().datetime().nullable().optional(),
  note: z.string().trim().max(200).nullable().optional(),
});

function makeCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'INTERN-';
  for (let i = 0; i < 8; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

async function requireAdminApi(): Promise<
  | { user: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>['user'] }
  | { response: Response }
> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { response: Response.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  const ownerEmail = env.OWNER_EMAIL?.toLowerCase();
  const isOwner = ownerEmail && session.user.email.toLowerCase() === ownerEmail;
  if (session.user.role !== 'admin' && !isOwner) {
    return { response: Response.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  if (isOwner && session.user.role !== 'admin') {
    await prisma.user
      .update({ where: { id: session.user.id }, data: { role: 'admin' } })
      .catch(() => {});
  }
  return { user: session.user };
}

function promoPayload(promo: {
  id: string;
  code: string;
  plan: string;
  months: number;
  maxRedemptions: number;
  redeemedCount: number;
  note: string | null;
  expiresAt: Date | null;
  disabledAt: Date | null;
  createdAt: Date;
}) {
  return {
    id: promo.id,
    code: promo.code,
    plan: promo.plan,
    months: promo.months,
    maxRedemptions: promo.maxRedemptions,
    redeemedCount: promo.redeemedCount,
    note: promo.note,
    expiresAt: promo.expiresAt?.toISOString() ?? null,
    disabledAt: promo.disabledAt?.toISOString() ?? null,
    createdAt: promo.createdAt.toISOString(),
  };
}

export async function GET() {
  const authResult = await requireAdminApi();
  if ('response' in authResult) return authResult.response;

  const codes = await prisma.subscriptionPromoCode.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return Response.json({ codes: codes.map(promoPayload) });
}

export async function POST(req: Request) {
  const authResult = await requireAdminApi();
  if ('response' in authResult) return authResult.response;

  const json = await req.json().catch(() => null);
  const parsed = CreatePromoCodeRequest.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const requestedCode = parsed.data.code?.toUpperCase();
  const code = requestedCode ?? makeCode();
  const promo = await prisma.subscriptionPromoCode
    .create({
      data: {
        code,
        plan: parsed.data.plan,
        months: parsed.data.months,
        maxRedemptions: parsed.data.maxRedemptions,
        expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
        note: parsed.data.note || null,
        createdBy: authResult.user.id,
      },
    })
    .catch((error: unknown) => {
      if (
        typeof error === 'object' &&
        error &&
        'code' in error &&
        (error as { code?: string }).code === 'P2002'
      ) {
        return null;
      }
      throw error;
    });

  if (!promo) {
    return Response.json({ error: 'That code already exists' }, { status: 409 });
  }

  return Response.json({ code: promoPayload(promo) });
}

export async function DELETE(req: Request) {
  const authResult = await requireAdminApi();
  if ('response' in authResult) return authResult.response;

  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code')?.trim().toUpperCase();
  if (!code) {
    return Response.json({ error: 'Missing code' }, { status: 400 });
  }

  const promo = await prisma.subscriptionPromoCode.update({
    where: { code },
    data: { disabledAt: new Date() },
  });

  return Response.json({ code: promoPayload(promo) });
}
