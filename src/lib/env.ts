// @:shared — edit only through declared slots. Code installed by /template-next@0.3.0.
//
// Typed env via @t3-oss/env-nextjs.
//
// Modules contribute env vars via their manifest `contributions` block.
// The installer regenerates this file's slots between the markers below.
// Hand-editing outside those slots is rejected by the ownership validator.
//
// The `no-secrets-in-client-bundle` validator scans the build output and rejects
// the install if any non-NEXT_PUBLIC_ env name appears in client chunks.

import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    // D24: Prisma is the framework-native DB client. DATABASE_URL is injected
    // by the deployment host and points at the app's Postgres database.
    DATABASE_URL: z.string().url(),
    OPENAI_API_KEY: z.string().min(1).optional(),
    OPENAI_BASE_URL: z.string().url().default('https://api.openai.com/v1'),
    ADZUNA_APP_ID: z.string().min(1).optional(),
    ADZUNA_APP_KEY: z.string().min(1).optional(),
    SERPAPI_API_KEY: z.string().min(1).optional(),
    JSEARCH_API_KEY: z.string().min(1).optional(),
    BRIGHTDATA_API_KEY: z.string().min(1).optional(),
    BRIGHTDATA_SERP_ZONE: z.string().min(1).default('serp_api1'),
    THEIRSTACK_API_KEY: z.string().min(1).optional(),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z
      .string()
      .url()
      .default(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
    OWNER_EMAIL: z.string().email().optional(),
    RESEND_API_KEY: z.string().min(1).optional(),
    RESEND_FROM: z.string().min(1).default('InternAI <support@internai.dev>'),
    STRIPE_SECRET_KEY: z.string().min(1).optional(),
    STRIPE_BASIC_PRICE_ID: z.string().min(1).optional(),
    STRIPE_PREMIUM_PRICE_ID: z.string().min(1).optional(),
  },

  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
    // Base for @/lib/api-client + proxy.ts connect-src. Default-empty
    // (unset) means same-origin `/api`; set only for an external API origin.
    NEXT_PUBLIC_API_URL: z.string().url().optional(),
    // @:slot env_vars_client start
    // Modules append NEXT_PUBLIC_* env vars here at install time.
    // @:slot env_vars_client end
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
    ADZUNA_APP_ID: process.env.ADZUNA_APP_ID,
    ADZUNA_APP_KEY: process.env.ADZUNA_APP_KEY,
    SERPAPI_API_KEY: process.env.SERPAPI_API_KEY,
    JSEARCH_API_KEY: process.env.JSEARCH_API_KEY,
    BRIGHTDATA_API_KEY: process.env.BRIGHTDATA_API_KEY,
    BRIGHTDATA_SERP_ZONE: process.env.BRIGHTDATA_SERP_ZONE,
    THEIRSTACK_API_KEY: process.env.THEIRSTACK_API_KEY,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    OWNER_EMAIL: process.env.OWNER_EMAIL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM: process.env.RESEND_FROM,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_BASIC_PRICE_ID: process.env.STRIPE_BASIC_PRICE_ID,
    STRIPE_PREMIUM_PRICE_ID: process.env.STRIPE_PREMIUM_PRICE_ID,
  },
  emptyStringAsUndefined: true,
  // SKIP_ENV_VALIDATION=1 bypasses validation for envless builds (lint/CI/local).
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
