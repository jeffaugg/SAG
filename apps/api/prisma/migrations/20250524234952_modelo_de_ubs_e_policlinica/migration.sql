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

-- AddForeignKey
ALTER TABLE "usuarios_policlinica" ADD CONSTRAINT "usuarios_policlinica_cnes_fkey" FOREIGN KEY ("cnes") REFERENCES "policlinica"("cnes") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_policlinica" ADD CONSTRAINT "usuarios_policlinica_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_ubs" ADD CONSTRAINT "usuarios_ubs_cnes_fkey" FOREIGN KEY ("cnes") REFERENCES "ubs"("cnes") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_ubs" ADD CONSTRAINT "usuarios_ubs_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
