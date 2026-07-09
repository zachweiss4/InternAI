import 'server-only';
import {
  ApplicationCreate,
  ApplicationResponse,
  ApplicationsListResponse,
} from '@/lib/contracts/applications';
import { prisma } from '@/lib/db';
import { requireAuth, type SessionUser } from '@/lib/require-auth';

export async function GET(req: Request) {
  let user: SessionUser;
  try {
    user = await requireAuth(req);
  } catch (res) {
    return res as Response;
  }

  try {
    const rows = await prisma.jobApplication.findMany({
      where: { userId: user.id },
      orderBy: { appliedAt: 'desc' },
    });
    return Response.json(
      ApplicationsListResponse.parse({
        applications: rows.map((r) => ({
          id: r.id,
          jobId: r.jobId,
          jobTitle: r.jobTitle,
          company: r.company,
          applyUrl: r.applyUrl,
          status: r.status,
          appliedAt: r.appliedAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        })),
      }),
    );
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let user: SessionUser;
  try {
    user = await requireAuth(req);
  } catch (res) {
    return res as Response;
  }

  const body = await req.json().catch(() => null);
  const parsed = ApplicationCreate.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { jobId, jobTitle, company, applyUrl } = parsed.data;
  try {
    const row = await prisma.jobApplication.upsert({
      where: { userId_jobId: { userId: user.id, jobId } },
      update: {},
      create: { userId: user.id, jobId, jobTitle, company, applyUrl },
    });
    return Response.json(
      ApplicationResponse.parse({
        id: row.id,
        jobId: row.jobId,
        jobTitle: row.jobTitle,
        company: row.company,
        applyUrl: row.applyUrl,
        status: row.status,
        appliedAt: row.appliedAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      }),
      { status: 201 },
    );
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
