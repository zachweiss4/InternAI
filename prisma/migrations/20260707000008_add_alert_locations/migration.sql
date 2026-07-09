ALTER TABLE "JobAlert"
ADD COLUMN "locations" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "JobAlert"
SET "locations" = ARRAY["location"]
WHERE "location" IS NOT NULL
  AND "location" <> ''
  AND cardinality("locations") = 0;
