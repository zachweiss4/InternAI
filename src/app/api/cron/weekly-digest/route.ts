import 'server-only';
import { assertCronAuthorized, escapeHtml } from '@/lib/cron';
import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/email/send';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface AdzunaJob {
  title?: string;
  redirect_url?: string;
  company?: { display_name?: string };
}

async function fetchJobs(keywords: string): Promise<AdzunaJob[]> {
  if (!env.ADZUNA_APP_ID || !env.ADZUNA_APP_KEY) {
    return [];
  }

  const params = new URLSearchParams({
    app_id: env.ADZUNA_APP_ID,
    app_key: env.ADZUNA_APP_KEY,
    results_per_page: '5',
    what: keywords,
  });
  const res = await fetch(`https://api.adzuna.com/v1/api/jobs/us/search/1?${params.toString()}`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { results?: AdzunaJob[] };
  return (data.results ?? []).slice(0, 5);
}

export async function GET(req: Request) {
  const unauthorized = assertCronAuthorized(req);
  if (unauthorized) return unauthorized;

  const profiles = await prisma.userProfile.findMany();
  if (profiles.length === 0) {
    return Response.json({ sent: 0, checked: 0 });
  }

  const userIds = [...new Set(profiles.map((profile) => profile.userId))];
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, email: true, name: true },
  });
  const userMap = new Map(users.map((user) => [user.id, user]));

  let sent = 0;
  for (const profile of profiles) {
    const user = userMap.get(profile.userId);
    if (!user?.email) continue;

    const keywords = profile.jobKeywords || profile.targetRoles || 'software internship';
    const jobs = await fetchJobs(keywords).catch(() => []);
    if (jobs.length === 0) continue;

    const jobItems = jobs
      .map(
        (job) =>
          `<li style="margin-bottom:12px;"><a href="${escapeHtml(job.redirect_url ?? env.NEXT_PUBLIC_APP_URL)}" style="color:#111111;font-weight:600;text-decoration:underline;">${escapeHtml(job.title ?? 'Internship')}</a> at ${escapeHtml(job.company?.display_name ?? 'Unknown')}</li>`,
      )
      .join('');

    const html = [
      '<div style="max-width:560px;margin:0 auto;padding:24px;font-family:Arial,Helvetica,sans-serif;">',
      '<h1 style="margin:0 0 16px;color:#111111;font-size:22px;">Your weekly internship digest</h1>',
      `<p style="margin:0 0 16px;color:#333333;font-size:15px;line-height:1.6;">Hi ${escapeHtml(user.name ?? 'there')}, here are new roles matching <strong>${escapeHtml(keywords)}</strong>:</p>`,
      `<ul style="padding-left:20px;color:#333333;font-size:15px;line-height:1.6;">${jobItems}</ul>`,
      `<p style="margin:24px 0 0;"><a href="${env.NEXT_PUBLIC_APP_URL}/search" style="display:inline-block;padding:10px 20px;background:#111111;color:#ffffff;text-decoration:none;font-size:15px;">Search more internships</a></p>`,
      '<div style="margin-top:24px;padding-top:16px;border-top:1px solid #e5e5e5;color:#999999;font-size:12px;">You received this because you have an InternAI account.</div>',
      '</div>',
    ].join('');

    await sendEmail({
      to: user.email,
      subject: `Your weekly internship digest - ${keywords}`,
      html,
      text: `Hi ${user.name ?? 'there'},\n\nHere are ${jobs.length} new internships matching "${keywords}". Search more: ${env.NEXT_PUBLIC_APP_URL}/search\n\n- InternAI`,
    });
    sent++;
  }

  return Response.json({ sent, checked: profiles.length });
}
