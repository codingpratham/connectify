/*
  Warnings:

  - You are about to drop the column `loacation` on the `Onboarding` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Onboarding` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `location` to the `Onboarding` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Onboarding" DROP COLUMN "loacation",
ADD COLUMN     "location" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isOnboarded" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Onboarding_userId_key" ON "Onboarding"("userId");
