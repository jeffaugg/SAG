-- CreateEnum
CREATE TYPE "Cargo" AS ENUM ('Enfermeiro', 'Medico', 'ADM');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Pendente', 'Fechado');

-- CreateEnum
CREATE TYPE "UnidadeType" AS ENUM ('UBS', 'POLICLINICA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "cargo" "Cargo" NOT NULL,
    "cpf" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policlinica" (
    "id" UUID NOT NULL,
    "contato" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "localizacao" TEXT NOT NULL,
    "cnes" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "policlinica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios_policlinica" (
    "id" UUID NOT NULL,
    "cnes" TEXT NOT NULL,
    "usuarioId" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "usuarios_policlinica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ubs" (
    "id" UUID NOT NULL,
    "contato" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "localizacao" TEXT NOT NULL,
    "cnes" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios_ubs" (
    "id" UUID NOT NULL,
    "cnes" TEXT NOT NULL,
    "usuarioId" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "usuarios_ubs_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "gestacoes" (
    "id" UUID NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fim" TIMESTAMP(3),
    "status" "Status" NOT NULL,
    "pacienteId" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "gestacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Atendimento" (
    "id" UUID NOT NULL,
    "unidadeId" UUID NOT NULL,
    "unidadeType" "UnidadeType" NOT NULL,
    "medicoId" UUID NOT NULL,
    "gestacaoId" UUID NOT NULL,
    "descricao" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Atendimento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cpf_key" ON "usuarios"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "policlinica_cnes_key" ON "policlinica"("cnes");

-- CreateIndex
CREATE INDEX "idx_policlinica_cnes" ON "usuarios_policlinica"("cnes");

-- CreateIndex
CREATE INDEX "idx_policlinica_usuario_id" ON "usuarios_policlinica"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_policlinica_cnes_usuarioId_key" ON "usuarios_policlinica"("cnes", "usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "ubs_cnes_key" ON "ubs"("cnes");

-- CreateIndex
CREATE INDEX "idx_ubs_cnes" ON "usuarios_ubs"("cnes");

-- CreateIndex
CREATE INDEX "idx_ubs_usuario_id" ON "usuarios_ubs"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_ubs_cnes_usuarioId_key" ON "usuarios_ubs"("cnes", "usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "pacientes_cpf_key" ON "pacientes"("cpf");

-- CreateIndex
CREATE INDEX "Atendimento_unidadeType_unidadeId_idx" ON "Atendimento"("unidadeType", "unidadeId");

-- CreateIndex
CREATE INDEX "Atendimento_medicoId_idx" ON "Atendimento"("medicoId");

-- CreateIndex
CREATE INDEX "Atendimento_gestacaoId_idx" ON "Atendimento"("gestacaoId");

-- AddForeignKey
ALTER TABLE "usuarios_policlinica" ADD CONSTRAINT "usuarios_policlinica_cnes_fkey" FOREIGN KEY ("cnes") REFERENCES "policlinica"("cnes") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_policlinica" ADD CONSTRAINT "usuarios_policlinica_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_ubs" ADD CONSTRAINT "usuarios_ubs_cnes_fkey" FOREIGN KEY ("cnes") REFERENCES "ubs"("cnes") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_ubs" ADD CONSTRAINT "usuarios_ubs_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gestacoes" ADD CONSTRAINT "gestacoes_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atendimento" ADD CONSTRAINT "Atendimento_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "ubs"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atendimento" ADD CONSTRAINT "Atendimento_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atendimento" ADD CONSTRAINT "Atendimento_gestacaoId_fkey" FOREIGN KEY ("gestacaoId") REFERENCES "gestacoes"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
