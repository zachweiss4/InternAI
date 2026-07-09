import 'server-only';
import { ProfileResponse, ProfileUpdate } from '@/lib/contracts/profile';
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
    const profile = await prisma.userProfile.findUnique({ where: { userId: user.id } });
    return Response.json(
      ProfileResponse.parse({
        userId: user.id,
        email: user.email,
        name: profile?.name ?? user.name ?? null,
        university: profile?.university ?? null,
        graduationYear: profile?.graduationYear ?? null,
        jobKeywords: profile?.jobKeywords ?? null,
        resumeText: profile?.resumeText ?? null,
        major: profile?.major ?? null,
        gpa: profile?.gpa ?? null,
        skills: profile?.skills ?? null,
        targetRoles: profile?.targetRoles ?? null,
        targetLocations: profile?.targetLocations ?? null,
        salaryExpectations: profile?.salaryExpectations ?? null,
        sponsorshipRequired: profile?.sponsorshipRequired ?? null,
      }),
    );
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  let user: SessionUser;
  try {
    user = await requireAuth(req);
  } catch (res) {
    return res as Response;
  }

  const body = await req.json().catch(() => null);
  const parsed = ProfileUpdate.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  try {
    const profile = await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: data,
      create: { userId: user.id, ...data },
    });
    return Response.json(
      ProfileResponse.parse({
        userId: user.id,
        email: user.email,
        name: profile.name ?? user.name ?? null,
        university: profile.university ?? null,
        graduationYear: profile.graduationYear ?? null,
        jobKeywords: profile.jobKeywords ?? null,
        resumeText: profile.resumeText ?? null,
        major: profile.major ?? null,
        gpa: profile.gpa ?? null,
        skills: profile.skills ?? null,
        targetRoles: profile.targetRoles ?? null,
        targetLocations: profile.targetLocations ?? null,
        salaryExpectations: profile.salaryExpectations ?? null,
        sponsorshipRequired: profile.sponsorshipRequired ?? null,
      }),
    );
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
