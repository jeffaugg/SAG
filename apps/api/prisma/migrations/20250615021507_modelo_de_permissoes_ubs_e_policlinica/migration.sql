/*
  Warnings:

  - You are about to drop the `Paciente` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Paciente";

-- CreateTable
CREATE TABLE "pacientes" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "telefone" TEXT,
    "endereco" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissoes_policlinica" (
    "id" UUID NOT NULL,
    "pacienteCpf" TEXT NOT NULL,
    "policlinicaCNES" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "permissoes_policlinica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissoes_ubs" (
    "id" UUID NOT NULL,
    "pacienteCpf" TEXT NOT NULL,
    "ubsCNES" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "permissoes_ubs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pacientes_cpf_key" ON "pacientes"("cpf");

-- CreateIndex
CREATE INDEX "idx_permissoes_policlinica_paciente_cpf" ON "permissoes_policlinica"("pacienteCpf");

-- CreateIndex
CREATE INDEX "idx_permissoes_policlinica_policlinica_cnes" ON "permissoes_policlinica"("policlinicaCNES");

-- CreateIndex
CREATE UNIQUE INDEX "permissoes_policlinica_pacienteCpf_policlinicaCNES_key" ON "permissoes_policlinica"("pacienteCpf", "policlinicaCNES");

-- CreateIndex
CREATE INDEX "idx_permissoes_ubs_paciente_cpf" ON "permissoes_ubs"("pacienteCpf");

-- CreateIndex
CREATE INDEX "idx_permissoes_ubs_ubs_cnes" ON "permissoes_ubs"("ubsCNES");

-- CreateIndex
CREATE UNIQUE INDEX "permissoes_ubs_pacienteCpf_ubsCNES_key" ON "permissoes_ubs"("pacienteCpf", "ubsCNES");

-- AddForeignKey
ALTER TABLE "permissoes_policlinica" ADD CONSTRAINT "permissoes_policlinica_pacienteCpf_fkey" FOREIGN KEY ("pacienteCpf") REFERENCES "pacientes"("cpf") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissoes_policlinica" ADD CONSTRAINT "permissoes_policlinica_policlinicaCNES_fkey" FOREIGN KEY ("policlinicaCNES") REFERENCES "policlinica"("cnes") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissoes_ubs" ADD CONSTRAINT "permissoes_ubs_pacienteCpf_fkey" FOREIGN KEY ("pacienteCpf") REFERENCES "pacientes"("cpf") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissoes_ubs" ADD CONSTRAINT "permissoes_ubs_ubsCNES_fkey" FOREIGN KEY ("ubsCNES") REFERENCES "ubs"("cnes") ON DELETE NO ACTION ON UPDATE CASCADE;
