-- CreateTable
CREATE TABLE "Article" (
    "slug" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "chipColor" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorAvatarUrl" TEXT NOT NULL,
    "publishedAtLabel" TEXT NOT NULL,
    "timeAgoLabel" TEXT NOT NULL,
    "heroImageUrl" TEXT,
    "heroImageAlt" TEXT NOT NULL,
    "body" JSONB NOT NULL,
    "breakdown" TEXT[],
    "relatedSlug" TEXT,
    "source" TEXT,
    "submissionId" TEXT,
    "sortOrder" SERIAL NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Fact" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "chipColor" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sources" TEXT[],
    "sortOrder" SERIAL NOT NULL,

    CONSTRAINT "Fact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampusEvent" (
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "chipColor" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" SERIAL NOT NULL,

    CONSTRAINT "CampusEvent_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Tip" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "urgency" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "evidenceUrl" TEXT,
    "receivedAt" TEXT NOT NULL,

    CONSTRAINT "Tip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "receivedAt" TEXT NOT NULL,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscriber" (
    "email" TEXT NOT NULL,
    "subscribedAt" TEXT NOT NULL,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "tickerItems" TEXT[],
    "breakingHeadlines" TEXT[],

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "matricNumber" TEXT,
    "walletBalanceNaira" INTEGER NOT NULL DEFAULT 0,
    "subscribed" BOOLEAN NOT NULL DEFAULT false,
    "sessionVersion" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsSubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "evidenceNote" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "aiReason" TEXT NOT NULL,
    "payoutNaira" INTEGER NOT NULL,
    "submittedAt" TEXT NOT NULL,
    "articleSlug" TEXT,
    "overriddenByAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NewsSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "NewsSubmission" ADD CONSTRAINT "NewsSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
