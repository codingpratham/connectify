/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Onboarding` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Onboarding" DROP CONSTRAINT "Onboarding_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarUrl",
DROP COLUMN "name",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "profilePic" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Onboarding";
