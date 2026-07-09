-- Add the 9 columns that the initial migration omitted but the Prisma schema declares
ALTER TABLE "UserProfile" ADD COLUMN "jobKeywords"        TEXT;
ALTER TABLE "UserProfile" ADD COLUMN "resumeText"         TEXT;
ALTER TABLE "UserProfile" ADD COLUMN "major"               TEXT;
ALTER TABLE "UserProfile" ADD COLUMN "gpa"                 DOUBLE PRECISION;
ALTER TABLE "UserProfile" ADD COLUMN "skills"              TEXT;
ALTER TABLE "UserProfile" ADD COLUMN "targetRoles"        TEXT;
ALTER TABLE "UserProfile" ADD COLUMN "targetLocations"    TEXT;
ALTER TABLE "UserProfile" ADD COLUMN "salaryExpectations" INTEGER;
ALTER TABLE "UserProfile" ADD COLUMN "sponsorshipRequired" BOOLEAN;