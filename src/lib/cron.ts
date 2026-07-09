import 'server-only';

export function assertCronAuthorized(req: Request): Response | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) return null;

  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}

export function escapeHtml(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
