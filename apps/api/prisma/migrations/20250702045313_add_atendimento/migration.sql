/*
  Warnings:

  - You are about to drop the `Atendimento` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Atendimento" DROP CONSTRAINT "Atendimento_gestacaoId_fkey";

-- DropForeignKey
ALTER TABLE "Atendimento" DROP CONSTRAINT "Atendimento_medicoId_fkey";

-- DropForeignKey
ALTER TABLE "Atendimento" DROP CONSTRAINT "Atendimento_unidadeId_fkey";

-- DropTable
DROP TABLE "Atendimento";

-- CreateTable
CREATE TABLE "atendimentos" (
    "id" UUID NOT NULL,
    "unidadeId" UUID NOT NULL,
    "unidadeType" "UnidadeType" NOT NULL,
    "medicoId" UUID NOT NULL,
    "gestacaoId" UUID NOT NULL,
    "descricao" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "atendimentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "atendimentos_unidadeType_unidadeId_idx" ON "atendimentos"("unidadeType", "unidadeId");

-- CreateIndex
CREATE INDEX "atendimentos_medicoId_idx" ON "atendimentos"("medicoId");

-- CreateIndex
CREATE INDEX "atendimentos_gestacaoId_idx" ON "atendimentos"("gestacaoId");

-- AddForeignKey
ALTER TABLE "atendimentos" ADD CONSTRAINT "atendimentos_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "ubs"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atendimentos" ADD CONSTRAINT "atendimentos_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atendimentos" ADD CONSTRAINT "atendimentos_gestacaoId_fkey" FOREIGN KEY ("gestacaoId") REFERENCES "gestacoes"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
