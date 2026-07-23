/*
  Warnings:

  - You are about to drop the column `estacionamentoId` on the `Permanencia` table. All the data in the column will be lost.
  - You are about to drop the column `valorPago` on the `Permanencia` table. All the data in the column will be lost.
  - You are about to drop the `Estacionamento` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `vagaId` to the `Permanencia` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoVaga" AS ENUM ('COMUM', 'IDOSO', 'PCD', 'MOTO');

-- DropForeignKey
ALTER TABLE "Permanencia" DROP CONSTRAINT "Permanencia_estacionamentoId_fkey";

-- AlterTable
ALTER TABLE "Permanencia" DROP COLUMN "estacionamentoId",
DROP COLUMN "valorPago",
ADD COLUMN     "vagaId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Estacionamento";

-- CreateTable
CREATE TABLE "Setor" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Setor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vaga" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "tipo" "TipoVaga" NOT NULL,
    "setorId" INTEGER NOT NULL,

    CONSTRAINT "Vaga_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Permanencia" ADD CONSTRAINT "Permanencia_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaga" ADD CONSTRAINT "Vaga_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "Setor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
