ALTER TABLE "JobAlert"
ADD COLUMN "fieldNames" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "timeframe" TEXT NOT NULL DEFAULT 'daily';

UPDATE "JobAlert"
SET "fieldNames" = ARRAY["field"]
WHERE "field" IS NOT NULL
  AND "field" <> ''
  AND cardinality("fieldNames") = 0;
