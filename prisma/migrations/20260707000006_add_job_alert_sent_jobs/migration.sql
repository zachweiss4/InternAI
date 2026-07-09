-- Track which job postings have already been emailed for each alert.
CREATE TABLE "JobAlertSentJob" (
    "id" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobAlertSentJob_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "JobAlertSentJob_alertId_jobId_key" ON "JobAlertSentJob"("alertId", "jobId");
CREATE INDEX "JobAlertSentJob_alertId_idx" ON "JobAlertSentJob"("alertId");
CREATE INDEX "JobAlertSentJob_sentAt_idx" ON "JobAlertSentJob"("sentAt");
