/*
  Warnings:

  - The values [COMUM] on the enum `TipoVaga` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `carroId` on the `Permanencia` table. All the data in the column will be lost.
  - You are about to drop the `Carro` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `veiculoId` to the `Permanencia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TipoVaga_new" AS ENUM ('CARRO', 'IDOSO', 'PCD', 'MOTO');
ALTER TABLE "Vaga" ALTER COLUMN "tipo" TYPE "TipoVaga_new" USING ("tipo"::text::"TipoVaga_new");
ALTER TYPE "TipoVaga" RENAME TO "TipoVaga_old";
ALTER TYPE "TipoVaga_new" RENAME TO "TipoVaga";
DROP TYPE "public"."TipoVaga_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Carro" DROP CONSTRAINT "Carro_proprietarioId_fkey";

-- DropForeignKey
ALTER TABLE "Permanencia" DROP CONSTRAINT "Permanencia_carroId_fkey";

-- AlterTable
ALTER TABLE "Permanencia" DROP COLUMN "carroId",
ADD COLUMN     "veiculoId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Carro";

-- CreateTable
CREATE TABLE "Veiculo" (
    "id" SERIAL NOT NULL,
    "modelo" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "proprietarioId" INTEGER NOT NULL,

    CONSTRAINT "Veiculo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Veiculo_placa_key" ON "Veiculo"("placa");

-- AddForeignKey
ALTER TABLE "Veiculo" ADD CONSTRAINT "Veiculo_proprietarioId_fkey" FOREIGN KEY ("proprietarioId") REFERENCES "Proprietario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permanencia" ADD CONSTRAINT "Permanencia_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
