import 'server-only';
import { prisma } from '@/lib/db';

let ensurePromise: Promise<void> | null = null;

async function applyJobAlertSchema(): Promise<void> {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "JobAlert" (
      "id" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "companyNames" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
      "field" TEXT,
      "fieldNames" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
      "location" TEXT,
      "locations" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
      "season" TEXT,
      "timeframe" TEXT NOT NULL DEFAULT 'daily',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "lastCheckedAt" TIMESTAMP(3),
      "lastNotifiedAt" TIMESTAMP(3),
      CONSTRAINT "JobAlert_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`
    ALTER TABLE "JobAlert"
    ADD COLUMN IF NOT EXISTS "companyNames" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    ADD COLUMN IF NOT EXISTS "field" TEXT,
    ADD COLUMN IF NOT EXISTS "fieldNames" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    ADD COLUMN IF NOT EXISTS "location" TEXT,
    ADD COLUMN IF NOT EXISTS "locations" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    ADD COLUMN IF NOT EXISTS "season" TEXT,
    ADD COLUMN IF NOT EXISTS "timeframe" TEXT NOT NULL DEFAULT 'daily',
    ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS "lastCheckedAt" TIMESTAMP(3),
    ADD COLUMN IF NOT EXISTS "lastNotifiedAt" TIMESTAMP(3);
  `);

  await prisma.$executeRawUnsafe(`
    UPDATE "JobAlert"
    SET "fieldNames" = ARRAY["field"]
    WHERE "field" IS NOT NULL
      AND "field" <> ''
      AND cardinality("fieldNames") = 0;
  `);

  await prisma.$executeRawUnsafe(`
    UPDATE "JobAlert"
    SET "locations" = ARRAY["location"]
    WHERE "location" IS NOT NULL
      AND "location" <> ''
      AND cardinality("locations") = 0;
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "JobAlert_userId_idx" ON "JobAlert"("userId");
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "JobAlertSentJob" (
      "id" TEXT NOT NULL,
      "alertId" TEXT NOT NULL,
      "jobId" TEXT NOT NULL,
      "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "JobAlertSentJob_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "JobAlertSentJob_alertId_jobId_key"
    ON "JobAlertSentJob"("alertId", "jobId");
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "JobAlertSentJob_alertId_idx" ON "JobAlertSentJob"("alertId");
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "JobAlertSentJob_sentAt_idx" ON "JobAlertSentJob"("sentAt");
  `);
}

export async function ensureJobAlertSchema(): Promise<void> {
  ensurePromise ??= applyJobAlertSchema().catch((error) => {
    ensurePromise = null;
    throw error;
  });

  return ensurePromise;
}
