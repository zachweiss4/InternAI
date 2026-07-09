# InternAI

InternAI is a Next.js app for finding internships, saving opportunities, tracking applications, analyzing resumes, and sending daily internship alerts.

## Features

- Internship search focused on company career and early-career pages, with Adzuna and SerpAPI as optional coverage providers
- Company-first search, including searches where the user picks a company without entering a role
- Filters for role, company, location, season, ordering, and optional resume/profile matching
- Saved internships and application tracking
- User auth with Better Auth and Prisma
- Resume upload, parsing, scoring, and improvement suggestions
- Daily job alerts that notify users only about newly discovered matching internships
- Stripe checkout for paid plans
- Promo codes and an admin-only premium access tool for beta testers or free accounts
- Vercel cron routes for reminders, weekly digest, and job alerts

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Prisma 6
- PostgreSQL, tested with Neon on Vercel
- Better Auth
- Stripe
- Resend
- Vercel Blob
- Tailwind CSS
- Biome
- Vitest

## Local Setup

Install Node.js 20+ and pnpm 11.

```bash
pnpm install
cp .env.example .env.local
```

Fill in the required variables in `.env.local`, then run:

```bash
pnpm db:migrate:dev
pnpm dev
```

Open `http://localhost:3000`.

## Required Environment Variables

For production on Vercel, set these at minimum:

```env
DATABASE_URL=
BETTER_AUTH_SECRET=
NEXT_PUBLIC_APP_URL=
BETTER_AUTH_URL=
```

Recommended production variables:

```env
ADZUNA_APP_ID=
ADZUNA_APP_KEY=
SERPAPI_API_KEY=
OPENAI_API_KEY=
BLOB_READ_WRITE_TOKEN=
RESEND_API_KEY=
RESEND_FROM=
STRIPE_SECRET_KEY=
STRIPE_BASIC_PRICE_ID=
STRIPE_PREMIUM_PRICE_ID=
CRON_SECRET=
OWNER_EMAIL=
```

Do not commit `.env.local` or any real secrets. This repo only includes `.env.example`.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full Vercel deployment checklist.

## Useful Commands

```bash
pnpm dev
pnpm typecheck
pnpm build
pnpm db:migrate:deploy
pnpm db:studio
```

## Notes

LinkedIn and Indeed result links are intentionally excluded for now because the app is not scraping those platforms directly. The search system prioritizes company career pages and verified public sources.
