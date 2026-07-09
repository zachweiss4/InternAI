import 'server-only';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/require-auth';
import { searchInternships } from '@/lib/search/internships';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const FREE_DAILY_LIMIT = 3;
function utcDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location')?.trim() || null;
  const company = searchParams.get('company')?.trim() || null;
  const q = searchParams.get('q')?.trim() || (company ? 'internship' : '');
  if (!q && !company) {
    return NextResponse.json({ error: 'Missing ?q= param or company filter' }, { status: 400 });
  }

  const user = await getSessionUser();
  let isPaid = false;

  if (user) {
    const subscription = await prisma.userSubscription.findUnique({
      where: { userId: user.id },
    });

    isPaid =
      subscription?.status === 'active' &&
      (subscription?.plan === 'basic' || subscription?.plan === 'premium');

    if (!isPaid) {
      const today = utcDateString();
      const quota = await prisma.searchQuota.findUnique({
        where: { userId_date: { userId: user.id, date: today } },
      });
      if ((quota?.count ?? 0) >= FREE_DAILY_LIMIT) {
        return NextResponse.json({ paywallReason: 'quota_exceeded' }, { status: 402 });
      }
    }
  }

  const seasonParam = searchParams.get('season');
  const season = seasonParam === 'summer' || seasonParam === 'fall' ? seasonParam : null;
  const sortParam = searchParams.get('sort');
  const sort = sortParam === 'newest' ? 'newest' : 'relevance';
  const profileMatch = searchParams.get('profileMatch') === 'true';
  const profile =
    user && profileMatch
      ? await prisma.userProfile.findUnique({
          where: { userId: user.id },
          select: {
            university: true,
            graduationYear: true,
            jobKeywords: true,
            resumeText: true,
            major: true,
            gpa: true,
            skills: true,
            targetRoles: true,
            targetLocations: true,
            sponsorshipRequired: true,
          },
        })
      : null;
  const jobs = await searchInternships({ query: q, location, company, season, sort, profile });

  if (user && !isPaid) {
    const today = utcDateString();
    await prisma.searchQuota.upsert({
      where: { userId_date: { userId: user.id, date: today } },
      create: { userId: user.id, date: today, count: 1 },
      update: { count: { increment: 1 } },
    });
  }

  return NextResponse.json({
    results: jobs,
    total: jobs.length,
    filters: {
      location: location ?? undefined,
      company: company ?? undefined,
      season: season ?? undefined,
      profileMatch: profileMatch || undefined,
      sort,
      role: q,
      keywords: ['internship', 'student', 'early career'],
    },
  });
}
