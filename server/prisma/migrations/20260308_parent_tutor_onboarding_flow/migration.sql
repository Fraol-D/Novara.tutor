-- CreateEnum
CREATE TYPE "TutorApplicationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ProficiencyLevel" AS ENUM ('NATIVE', 'FLUENT', 'COMFORTABLE');

-- CreateEnum
CREATE TYPE "EducationType" AS ENUM ('HIGH_SCHOOL', 'COLLEGE', 'OTHER_CERTIFICATION');

-- CreateEnum
CREATE TYPE "ExperienceType" AS ENUM ('TEACHING', 'WORK');

-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "PackagePlan" AS ENUM ('GROW', 'THRIVE', 'EXCEL');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('MASTERY', 'PREREQUISITE');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('PARENT', 'TUTOR', 'ADMIN');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_branchId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_branchId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_tutorId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_branchId_fkey";

-- DropForeignKey
ALTER TABLE "Tutor" DROP CONSTRAINT "Tutor_branchId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_branchId_fkey";

-- DropIndex
DROP INDEX "User_branchId_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "branchId",
DROP COLUMN "fullName",
ADD COLUMN     "country" TEXT,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "profilePictureUrl" TEXT,
ADD COLUMN     "setupCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "setupStep" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "state" TEXT,
ALTER COLUMN "role" DROP NOT NULL,
ALTER COLUMN "role" DROP DEFAULT;

-- DropTable
DROP TABLE "Branch";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "Student";

-- DropTable
DROP TABLE "Tutor";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "StudentStatus";

-- CreateTable
CREATE TABLE "ParentChild" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "grade" TEXT,
    "country" TEXT,
    "state" TEXT,
    "schoolInUsa" BOOLEAN,
    "packagePlan" "PackagePlan",
    "profilePictureUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentChild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildTimeSlot" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "day" "Weekday" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Local',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChildTimeSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "TutorApplicationStatus" NOT NULL DEFAULT 'DRAFT',
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TutorApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LanguageSkill" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "proficiency" "ProficiencyLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LanguageSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationEntry" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "type" "EducationType" NOT NULL,
    "institutionName" TEXT NOT NULL,
    "studyArea" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "completedYear" INTEGER,
    "graduated" BOOLEAN NOT NULL DEFAULT false,
    "transcriptUrl" TEXT,
    "certificateUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EducationEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceEntry" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "type" "ExperienceType" NOT NULL,
    "organizationName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "currentlyWorking" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExperienceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorAvailability" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "day" "Weekday" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Local',
    "totalHours" DECIMAL(4,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TutorAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LanguageDemoVideo" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "languageSkillId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LanguageDemoVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicSyllabus" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "country" TEXT,
    "state" TEXT,
    "grade" TEXT,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicSyllabus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicRoadmap" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "country" TEXT,
    "state" TEXT,
    "grade" TEXT,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicRoadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentReport" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "type" "ReportType" NOT NULL,
    "subject" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "score" INTEGER,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssessmentReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ParentChild_parentId_idx" ON "ParentChild"("parentId");

-- CreateIndex
CREATE INDEX "ChildTimeSlot_childId_idx" ON "ChildTimeSlot"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "TutorApplication_userId_key" ON "TutorApplication"("userId");

-- CreateIndex
CREATE INDEX "LanguageSkill_applicationId_idx" ON "LanguageSkill"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "LanguageSkill_applicationId_language_key" ON "LanguageSkill"("applicationId", "language");

-- CreateIndex
CREATE INDEX "EducationEntry_applicationId_idx" ON "EducationEntry"("applicationId");

-- CreateIndex
CREATE INDEX "ExperienceEntry_applicationId_idx" ON "ExperienceEntry"("applicationId");

-- CreateIndex
CREATE INDEX "TutorAvailability_applicationId_idx" ON "TutorAvailability"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "LanguageDemoVideo_languageSkillId_key" ON "LanguageDemoVideo"("languageSkillId");

-- CreateIndex
CREATE INDEX "LanguageDemoVideo_applicationId_idx" ON "LanguageDemoVideo"("applicationId");

-- CreateIndex
CREATE INDEX "AcademicSyllabus_childId_idx" ON "AcademicSyllabus"("childId");

-- CreateIndex
CREATE INDEX "AcademicRoadmap_childId_idx" ON "AcademicRoadmap"("childId");

-- CreateIndex
CREATE INDEX "AssessmentReport_parentId_idx" ON "AssessmentReport"("parentId");

-- CreateIndex
CREATE INDEX "AssessmentReport_childId_idx" ON "AssessmentReport"("childId");

-- AddForeignKey
ALTER TABLE "ParentChild" ADD CONSTRAINT "ParentChild_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildTimeSlot" ADD CONSTRAINT "ChildTimeSlot_childId_fkey" FOREIGN KEY ("childId") REFERENCES "ParentChild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorApplication" ADD CONSTRAINT "TutorApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LanguageSkill" ADD CONSTRAINT "LanguageSkill_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "TutorApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationEntry" ADD CONSTRAINT "EducationEntry_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "TutorApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceEntry" ADD CONSTRAINT "ExperienceEntry_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "TutorApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorAvailability" ADD CONSTRAINT "TutorAvailability_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "TutorApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LanguageDemoVideo" ADD CONSTRAINT "LanguageDemoVideo_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "TutorApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LanguageDemoVideo" ADD CONSTRAINT "LanguageDemoVideo_languageSkillId_fkey" FOREIGN KEY ("languageSkillId") REFERENCES "LanguageSkill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicSyllabus" ADD CONSTRAINT "AcademicSyllabus_childId_fkey" FOREIGN KEY ("childId") REFERENCES "ParentChild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicRoadmap" ADD CONSTRAINT "AcademicRoadmap_childId_fkey" FOREIGN KEY ("childId") REFERENCES "ParentChild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentReport" ADD CONSTRAINT "AssessmentReport_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentReport" ADD CONSTRAINT "AssessmentReport_childId_fkey" FOREIGN KEY ("childId") REFERENCES "ParentChild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

