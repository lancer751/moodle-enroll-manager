/*
  Warnings:

  - A unique constraint covering the columns `[moodleId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `student` ADD COLUMN `moodleId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Student_moodleId_key` ON `Student`(`moodleId`);
