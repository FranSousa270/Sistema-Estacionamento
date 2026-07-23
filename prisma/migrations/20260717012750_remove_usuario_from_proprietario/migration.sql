/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `Proprietario` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Proprietario" DROP CONSTRAINT "Proprietario_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Proprietario" DROP COLUMN "usuarioId";
