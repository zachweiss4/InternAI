// @:framework-owned - DO NOT EDIT. Code installed by /modules/better-auth@0.5.0. Drift = commit rejected.
// Protected core (db/secret/baseURL, admin plugin) + owner-admin grant, composed with the app's
// own databaseHooks. Configure auth in @/lib/auth-config (user-owned).

import 'server-only';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin } from 'better-auth/plugins';
import { authConfig } from '@/lib/auth-config';
import { prisma } from '@/lib/db';
import { env } from '@/lib/env';

// Compose the owner-admin grant with the app's hooks — don't overwrite them.
const appHooks = authConfig.databaseHooks;

function originOf(value?: string | null): string | null {
  if (!value) return null;
  try {
    const withProtocol = value.startsWith('http') ? value : `https://${value}`;
    return new URL(withProtocol).origin;
  } catch {
    return null;
  }
}

function trustedOriginsFromRequest(request?: Request): string[] {
  const origin = request?.headers.get('origin');
  const forwardedHost = request?.headers.get('x-forwarded-host');
  const host = request?.headers.get('host');
  const forwardedProto = request?.headers.get('x-forwarded-proto') ?? 'https';

  return [
    originOf(env.BETTER_AUTH_URL),
    originOf(env.NEXT_PUBLIC_APP_URL),
    originOf(process.env.VERCEL_URL),
    originOf(origin),
    forwardedHost ? originOf(`${forwardedProto}://${forwardedHost}`) : null,
    host ? originOf(`${forwardedProto}://${host}`) : null,
    'http://localhost:3000',
    'http://localhost:3008',
  ].filter((value): value is string => Boolean(value));
}

export const auth = betterAuth({
  ...authConfig,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: (request) => trustedOriginsFromRequest(request),
  databaseHooks: {
    ...appHooks,
    user: {
      ...appHooks?.user,
      create: {
        ...appHooks?.user?.create,
        before: async (user, ctx) => {
          const r = await appHooks?.user?.create?.before?.(user, ctx);
          if (r === false) return false;
          const base = r && typeof r === 'object' && 'data' in r ? r.data : user;
          const owner = env.OWNER_EMAIL?.toLowerCase();
          if (owner && user.email.toLowerCase() === owner) {
            return { data: { ...base, role: 'admin' } };
          }
          return r;
        },
      },
    },
  },
  plugins: [
    admin({
      defaultRole: 'user',
      adminRoles: ['admin'],
    }),
    ...(authConfig.plugins ?? []),
  ],
});
