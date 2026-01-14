-- CreateEnum
CREATE TYPE "RoleUsuario" AS ENUM ('ADMIN', 'GERENTE', 'RECEPCIONISTA');

-- AlterTable
ALTER TABLE "reservas" ADD COLUMN     "dataConfirmacao" TIMESTAMP(3),
ADD COLUMN     "dataPrazoConfirmacao" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "hotelId" TEXT,
    "role" "RoleUsuario" NOT NULL DEFAULT 'RECEPCIONISTA',
    "ativo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens_verificacao" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_verificacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditoria_reservas" (
    "id" TEXT NOT NULL,
    "reservaId" TEXT NOT NULL,
    "usuarioId" TEXT,
    "statusAnterior" "StatusReserva" NOT NULL,
    "statusNovo" "StatusReserva" NOT NULL,
    "descricao" TEXT,
    "ipAdress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditoria_reservas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracoes_pousadas" (
    "id" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "horaCheckIn" TEXT NOT NULL DEFAULT '14:00',
    "horaCheckOut" TEXT NOT NULL DEFAULT '12:00',
    "regras" TEXT,
    "prazoDiasConfirmacaoReserva" INTEGER NOT NULL DEFAULT 3,
    "templateConfirmacao" TEXT,
    "templateCancelamento" TEXT,
    "templateLembrete" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracoes_pousadas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_verificacao_token_key" ON "tokens_verificacao"("token");

-- CreateIndex
CREATE UNIQUE INDEX "configuracoes_pousadas_hotelId_key" ON "configuracoes_pousadas"("hotelId");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hoteis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens_verificacao" ADD CONSTRAINT "tokens_verificacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditoria_reservas" ADD CONSTRAINT "auditoria_reservas_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "reservas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuracoes_pousadas" ADD CONSTRAINT "configuracoes_pousadas_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hoteis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
