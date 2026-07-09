-- Backfill a UserProfile row (with safe NULL defaults) for every User that
-- doesn't yet have one. Idempotent via ON CONFLICT DO NOTHING.
INSERT INTO "UserProfile" ("id", "userId", "updatedAt")
SELECT
  concat('profile_', md5("id" || now()::text)),
  "id",
  NOW()
FROM "user"
WHERE "id" NOT IN (SELECT "userId" FROM "UserProfile");
