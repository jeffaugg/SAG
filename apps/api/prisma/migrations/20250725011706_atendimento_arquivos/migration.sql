/*
  Warnings:

  - You are about to drop the column `unidadeId` on the `atendimentos` table. All the data in the column will be lost.
  - You are about to drop the column `unidadeType` on the `atendimentos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "atendimentos" DROP CONSTRAINT "atendimentos_unidadeId_fkey";

-- DropIndex
DROP INDEX "atendimentos_unidadeType_unidadeId_idx";

-- AlterTable
ALTER TABLE "atendimentos" DROP COLUMN "unidadeId",
DROP COLUMN "unidadeType",
ADD COLUMN     "policlinicaId" UUID,
ADD COLUMN     "ubsId" UUID;

-- DropEnum
DROP TYPE "UnidadeType";

-- CreateTable
CREATE TABLE "atendimentos_arquivos" (
    "id" UUID NOT NULL,
    "atendimentoId" UUID NOT NULL,
    "arquivoUrl" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "atendimentos_arquivos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_arquivo_atendimento_id" ON "atendimentos_arquivos"("atendimentoId");

-- AddForeignKey
ALTER TABLE "atendimentos" ADD CONSTRAINT "atendimentos_ubsId_fkey" FOREIGN KEY ("ubsId") REFERENCES "ubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atendimentos" ADD CONSTRAINT "atendimentos_policlinicaId_fkey" FOREIGN KEY ("policlinicaId") REFERENCES "policlinica"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atendimentos_arquivos" ADD CONSTRAINT "atendimentos_arquivos_atendimentoId_fkey" FOREIGN KEY ("atendimentoId") REFERENCES "atendimentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
