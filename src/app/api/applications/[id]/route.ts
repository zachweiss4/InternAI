import 'server-only';
import { ApplicationResponse, ApplicationStatusUpdate } from '@/lib/contracts/applications';
import { prisma } from '@/lib/db';
import { requireAuth, type SessionUser } from '@/lib/require-auth';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  let user: SessionUser;
  try {
    user = await requireAuth(req);
  } catch (res) {
    return res as Response;
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = ApplicationStatusUpdate.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const result = await prisma.jobApplication.updateMany({
      where: { id, userId: user.id },
      data: { status: parsed.data.status },
    });
    if (result.count === 0) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
    const row = await prisma.jobApplication.findUnique({ where: { id } });
    if (!row) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
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
    );
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
