/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `Onboarding` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Onboarding" DROP COLUMN "avatarUrl";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT;
