/*
  Warnings:

  - You are about to alter the column `status` on the `enrollment` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(1))`.
  - You are about to alter the column `status` on the `student` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `enrollment` MODIFY `status` ENUM('PENDING', 'WAITING_LIST', 'APPROVED', 'ENROLLED', 'REJECTED', 'CANCELLED', 'DROPPED', 'COMPLETED', 'SUSPENDED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `student` MODIFY `status` ENUM('PENDING', 'WAITING_LIST', 'APPROVED', 'ENROLLED', 'REJECTED', 'CANCELLED', 'DROPPED', 'COMPLETED', 'SUSPENDED') NOT NULL DEFAULT 'PENDING';
