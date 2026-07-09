import 'server-only';
import { requireAuth, type SessionUser } from '@/lib/require-auth';

export async function POST(req: Request) {
  let _user: SessionUser;
  try {
    _user = await requireAuth(req);
  } catch (res) {
    return res as Response;
  }

  const body = await req.text();
  const upstream = new URL('/api/ai/chat', req.url);
  const upstreamRes = await fetch(upstream.toString(), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
  });

  return new Response(upstreamRes.body, {
    status: upstreamRes.status,
    headers: {
      'content-type': upstreamRes.headers.get('content-type') ?? 'text/event-stream',
      'cache-control': 'no-cache',
      'x-accel-buffering': 'no',
    },
  });
}
