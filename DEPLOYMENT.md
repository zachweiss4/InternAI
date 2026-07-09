# Deploy InternAI To Vercel

Use this checklist when moving the app to a new Vercel project.

## 1. Create The GitHub Repo

Create an empty GitHub repository, then from this folder run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## 2. Import Into Vercel

1. Go to Vercel.
2. Click **Add New Project**.
3. Import the GitHub repo.
4. Framework preset: **Next.js**.
5. Build command: `npm run vercel-build`.
6. Install command: leave the Vercel default, or set `pnpm install --frozen-lockfile`.

## 3. Add A Database

Use a Vercel Postgres provider such as Neon.

Recommended:

- Region: closest to the Vercel deployment region and most users, usually `us-east-1` for a US launch
- Environments: Production and Preview
- Variable name: `DATABASE_URL`
- URL type: pooled/regular connection URL for the app

Prisma migrations run during `npm run vercel-build`.

## 4. Add Environment Variables

Required:

```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=generate-a-long-random-secret
NEXT_PUBLIC_APP_URL=https://YOUR_DOMAIN.vercel.app
BETTER_AUTH_URL=https://YOUR_DOMAIN.vercel.app
```

Recommended:

```env
ADZUNA_APP_ID=your-adzuna-app-id
ADZUNA_APP_KEY=your-adzuna-app-key
SERPAPI_API_KEY=your-serpapi-key
THEIRSTACK_API_KEY=your-theirstack-api-key
OPENAI_API_KEY=your-openai-api-key
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
RESEND_API_KEY=your-resend-api-key
RESEND_FROM=InternAI <support@internai.dev>
STRIPE_SECRET_KEY=sk_live_or_test_...
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...
CRON_SECRET=generate-a-random-cron-secret
OWNER_EMAIL=your-admin-email@example.com
```

Sensitive variables:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `ADZUNA_APP_KEY`
- `SERPAPI_API_KEY`
- `THEIRSTACK_API_KEY`
- `OPENAI_API_KEY`
- `BLOB_READ_WRITE_TOKEN`
- `RESEND_API_KEY`
- `STRIPE_SECRET_KEY`
- `CRON_SECRET`

Not sensitive:

- `NEXT_PUBLIC_APP_URL`
- `BETTER_AUTH_URL`
- `RESEND_FROM`
- `OWNER_EMAIL`
- `ADZUNA_APP_ID`
- Stripe price IDs

## 5. Stripe Setup

Create two recurring monthly prices:

- Basic: `$5/month`
- Premium: `$10/month`

Copy the price IDs into:

```env
STRIPE_BASIC_PRICE_ID=
STRIPE_PREMIUM_PRICE_ID=
```

## 6. Email Setup

For production, send app emails from:

```env
RESEND_FROM=InternAI <support@internai.dev>
```

Verify `internai.dev` in Resend before using this sender in production. Zoho can handle the
`support@internai.dev` inbox, but Resend still needs its own DNS verification to send app emails
from that address.

## 7. Cron Setup

The repo includes Vercel cron routes in `vercel.json`:

- `/api/cron/application-reminders` daily at 9 AM UTC
- `/api/cron/weekly-digest` Mondays at 8 AM UTC
- `/api/cron/job-alerts` daily at 8 AM UTC

If `CRON_SECRET` is set, manual tests need the header:

```bash
curl -i -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://YOUR_DOMAIN.vercel.app/api/cron/job-alerts
```

## 8. Admin Account

Set:

```env
OWNER_EMAIL=your-email@example.com
```

Create an account with that same email in the app. That account can access admin-only premium tools.

## 9. Final Checks

After deployment:

1. Create a user account.
2. Search for a company without entering a role.
3. Save an internship.
4. Upload a resume.
5. Create a job alert.
6. Run the job alert cron test.
7. Test Stripe checkout in test mode before switching to live keys.
