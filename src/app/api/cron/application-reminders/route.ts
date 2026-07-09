import 'server-only';
import { assertCronAuthorized, escapeHtml } from '@/lib/cron';
import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/email/send';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: Request) {
  const unauthorized = assertCronAuthorized(req);
  if (unauthorized) return unauthorized;

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const staleApplications = await prisma.jobApplication.findMany({
    where: {
      status: 'Applied',
      updatedAt: { lt: sevenDaysAgo },
    },
  });

  if (staleApplications.length === 0) {
    return Response.json({ sent: 0, checked: 0 });
  }

  const userIds = [...new Set(staleApplications.map((app) => app.userId))];
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, email: true, name: true },
  });
  const userMap = new Map(users.map((user) => [user.id, user]));

  let sent = 0;
  for (const app of staleApplications) {
    const user = userMap.get(app.userId);
    if (!user?.email) continue;

    const subject = `Did you hear back from ${app.company}?`;
    const html = [
      '<div style="max-width:560px;margin:0 auto;padding:24px;font-family:Arial,Helvetica,sans-serif;">',
      `<h1 style="margin:0 0 16px;color:#111111;font-size:22px;">Did you hear back from ${escapeHtml(app.company)}?</h1>`,
      `<p style="margin:0 0 16px;color:#333333;font-size:15px;line-height:1.6;">Hi ${escapeHtml(user.name ?? 'there')},</p>`,
      `<p style="margin:0 0 16px;color:#333333;font-size:15px;line-height:1.6;">It's been over a week since you applied to <strong>${escapeHtml(app.jobTitle)}</strong> at <strong>${escapeHtml(app.company)}</strong>. Did you hear back?</p>`,
      `<p style="margin:24px 0 0;"><a href="${env.NEXT_PUBLIC_APP_URL}/applications" style="display:inline-block;padding:10px 20px;background:#111111;color:#ffffff;text-decoration:none;font-size:15px;">Update application status</a></p>`,
      '<div style="margin-top:24px;padding-top:16px;border-top:1px solid #e5e5e5;color:#999999;font-size:12px;">You received this because you have an InternAI account.</div>',
      '</div>',
    ].join('');

    await sendEmail({
      to: user.email,
      subject,
      html,
      text: `Hi ${user.name ?? 'there'},\n\nIt's been over a week since you applied to ${app.jobTitle} at ${app.company}. Update your status here: ${env.NEXT_PUBLIC_APP_URL}/applications\n\n- InternAI`,
    }).catch((err) => {
      console.error(`Failed to send reminder to ${user.email}:`, err);
    });
    sent++;
  }

  return Response.json({ sent, checked: staleApplications.length });
}
