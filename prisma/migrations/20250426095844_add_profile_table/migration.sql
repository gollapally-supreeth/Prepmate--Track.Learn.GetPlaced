-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT,
    "username" TEXT,
    "contact" TEXT,
    "dob" TIMESTAMP(3),
    "status" TEXT,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "linkedin" TEXT,
    "github" TEXT,
    "twitter" TEXT,
    "website" TEXT,
    "educations" JSONB,
    "skills" JSONB,
    "projects" JSONB,
    "experience" JSONB,
    "badges" JSONB,
    "events" JSONB,
    "learningPath" JSONB,
    "progress" JSONB,
    "settings" JSONB,
    "activityFeed" JSONB,
    "quickActions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
