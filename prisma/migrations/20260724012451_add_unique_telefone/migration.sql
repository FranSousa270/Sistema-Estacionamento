/*
  Warnings:

  - A unique constraint covering the columns `[telefone]` on the table `Proprietario` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Proprietario_telefone_key" ON "Proprietario"("telefone");
