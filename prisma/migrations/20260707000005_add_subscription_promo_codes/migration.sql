-- CreateTable
CREATE TABLE "SubscriptionPromoCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'premium',
    "months" INTEGER NOT NULL DEFAULT 12,
    "maxRedemptions" INTEGER NOT NULL DEFAULT 1,
    "redeemedCount" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT,
    "createdBy" TEXT,
    "expiresAt" TIMESTAMP(3),
    "disabledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPromoCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPromoRedemption" (
    "id" TEXT NOT NULL,
    "codeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionPromoRedemption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPromoCode_code_key" ON "SubscriptionPromoCode"("code");

-- CreateIndex
CREATE INDEX "SubscriptionPromoCode_code_idx" ON "SubscriptionPromoCode"("code");

-- CreateIndex
CREATE INDEX "SubscriptionPromoCode_disabledAt_expiresAt_idx" ON "SubscriptionPromoCode"("disabledAt", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPromoRedemption_codeId_userId_key" ON "SubscriptionPromoRedemption"("codeId", "userId");

-- CreateIndex
CREATE INDEX "SubscriptionPromoRedemption_userId_idx" ON "SubscriptionPromoRedemption"("userId");

-- CreateIndex
CREATE INDEX "SubscriptionPromoRedemption_codeId_idx" ON "SubscriptionPromoRedemption"("codeId");
