import 'server-only';
import {
  SavedInternshipCreate,
  SavedInternshipListResponse,
  SavedInternshipResponse,
} from '@/lib/contracts/saved';
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
    const rows = await prisma.savedInternship.findMany({
      where: { userId: user.id },
      orderBy: { savedAt: 'desc' },
    });
    return Response.json(
      SavedInternshipListResponse.parse({
        saved: rows.map((r) => ({
          id: r.id,
          jobId: r.jobId,
          jobData: r.jobData as Record<string, unknown>,
          savedAt: r.savedAt.toISOString(),
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
  const parsed = SavedInternshipCreate.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { jobId, jobData } = parsed.data;
  try {
    const row = await prisma.savedInternship.upsert({
      where: { userId_jobId: { userId: user.id, jobId } },
      update: { jobData },
      create: { userId: user.id, jobId, jobData },
    });
    return Response.json(
      SavedInternshipResponse.parse({
        id: row.id,
        jobId: row.jobId,
        jobData: row.jobData as Record<string, unknown>,
        savedAt: row.savedAt.toISOString(),
      }),
      { status: 201 },
    );
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
