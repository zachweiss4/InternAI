import 'server-only';
import { prisma } from '@/lib/db';
import { requireAuth, type SessionUser } from '@/lib/require-auth';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  let user: SessionUser;
  try {
    user = await requireAuth(req);
  } catch (res) {
    return res as Response;
  }

  const { id } = await params;

  try {
    await prisma.savedInternship.deleteMany({
      where: { id, userId: user.id },
    });
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
