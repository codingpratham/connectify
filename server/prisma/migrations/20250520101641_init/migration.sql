/*
  Warnings:

  - Made the column `status` on table `FriendRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FriendRequest" ALTER COLUMN "status" SET NOT NULL;
