-- CreateEnum
CREATE TYPE "EligibilityCriteriaType" AS ENUM ('NATIONALITY', 'DEGREE_LEVEL', 'MIN_GPA', 'LANGUAGE_TEST', 'ACADEMIC_FIELD', 'OTHER');

-- DropForeignKey
ALTER TABLE "_ScholarshipPrograms" DROP CONSTRAINT "_ScholarshipPrograms_A_fkey";

-- DropForeignKey
ALTER TABLE "_ScholarshipPrograms" DROP CONSTRAINT "_ScholarshipPrograms_B_fkey";

-- AlterTable
ALTER TABLE "ComparisonList" DROP COLUMN "entityIds",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "academicFieldId" TEXT,
ADD COLUMN     "majorId" TEXT;

-- DropTable
DROP TABLE "_ScholarshipPrograms";

-- CreateTable
CREATE TABLE "UniversityRanking" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "rankType" TEXT NOT NULL DEFAULT 'global',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UniversityRanking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UniversityAccreditation" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuingBody" TEXT,
    "year" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UniversityAccreditation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UniversityGallery" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UniversityGallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UniversityIntake" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "applicationDeadline" TIMESTAMP(3) NOT NULL,
    "status" "AdmissionStatus" NOT NULL DEFAULT 'OPEN',

    CONSTRAINT "UniversityIntake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicField" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AcademicField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Major" (
    "id" TEXT NOT NULL,
    "academicFieldId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Major_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScholarshipEligibility" (
    "id" TEXT NOT NULL,
    "scholarshipId" TEXT NOT NULL,
    "criteriaType" "EligibilityCriteriaType" NOT NULL,
    "value" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "ScholarshipEligibility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScholarshipUniversity" (
    "id" TEXT NOT NULL,
    "scholarshipId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,

    CONSTRAINT "ScholarshipUniversity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScholarshipProgram" (
    "id" TEXT NOT NULL,
    "scholarshipId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,

    CONSTRAINT "ScholarshipProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComparisonItem" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComparisonItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UniversityRanking_universityId_idx" ON "UniversityRanking"("universityId");

-- CreateIndex
CREATE INDEX "UniversityAccreditation_universityId_idx" ON "UniversityAccreditation"("universityId");

-- CreateIndex
CREATE INDEX "UniversityGallery_universityId_idx" ON "UniversityGallery"("universityId");

-- CreateIndex
CREATE INDEX "UniversityIntake_universityId_idx" ON "UniversityIntake"("universityId");

-- CreateIndex
CREATE INDEX "UniversityIntake_applicationDeadline_idx" ON "UniversityIntake"("applicationDeadline");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicField_key_key" ON "AcademicField"("key");

-- CreateIndex
CREATE INDEX "AcademicField_key_idx" ON "AcademicField"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Major_key_key" ON "Major"("key");

-- CreateIndex
CREATE INDEX "Major_academicFieldId_idx" ON "Major"("academicFieldId");

-- CreateIndex
CREATE INDEX "ScholarshipEligibility_scholarshipId_idx" ON "ScholarshipEligibility"("scholarshipId");

-- CreateIndex
CREATE INDEX "ScholarshipUniversity_universityId_idx" ON "ScholarshipUniversity"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "ScholarshipUniversity_scholarshipId_universityId_key" ON "ScholarshipUniversity"("scholarshipId", "universityId");

-- CreateIndex
CREATE INDEX "ScholarshipProgram_programId_idx" ON "ScholarshipProgram"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "ScholarshipProgram_scholarshipId_programId_key" ON "ScholarshipProgram"("scholarshipId", "programId");

-- CreateIndex
CREATE INDEX "ComparisonItem_listId_idx" ON "ComparisonItem"("listId");

-- CreateIndex
CREATE UNIQUE INDEX "ComparisonItem_listId_entityId_key" ON "ComparisonItem"("listId", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "ComparisonList_userId_entityType_key" ON "ComparisonList"("userId", "entityType");

-- CreateIndex
CREATE INDEX "Program_academicFieldId_idx" ON "Program"("academicFieldId");

-- CreateIndex
CREATE INDEX "Program_majorId_idx" ON "Program"("majorId");

-- AddForeignKey
ALTER TABLE "UniversityRanking" ADD CONSTRAINT "UniversityRanking_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityAccreditation" ADD CONSTRAINT "UniversityAccreditation_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityGallery" ADD CONSTRAINT "UniversityGallery_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityIntake" ADD CONSTRAINT "UniversityIntake_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Major" ADD CONSTRAINT "Major_academicFieldId_fkey" FOREIGN KEY ("academicFieldId") REFERENCES "AcademicField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_academicFieldId_fkey" FOREIGN KEY ("academicFieldId") REFERENCES "AcademicField"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarshipEligibility" ADD CONSTRAINT "ScholarshipEligibility_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "Scholarship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarshipUniversity" ADD CONSTRAINT "ScholarshipUniversity_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "Scholarship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarshipUniversity" ADD CONSTRAINT "ScholarshipUniversity_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarshipProgram" ADD CONSTRAINT "ScholarshipProgram_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "Scholarship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarshipProgram" ADD CONSTRAINT "ScholarshipProgram_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComparisonItem" ADD CONSTRAINT "ComparisonItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "ComparisonList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

