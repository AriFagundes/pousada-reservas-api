-- CreateEnum
CREATE TYPE "StatusReserva" AS ENUM ('PENDENTE', 'CONFIRMADA', 'CANCELADA', 'NO_SHOW', 'FINALIZADA');

-- AlterTable (add new columns to Reserva)
ALTER TABLE "reservas" 
ADD COLUMN "dataConfirmacao" TIMESTAMP(3),
ADD COLUMN "dataPrazoConfirmacao" TIMESTAMP(3),
MODIFY "status" "StatusReserva" NOT NULL DEFAULT 'PENDENTE';

-- CreateTable AuditoriaReserva
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

-- CreateTable ConfiguracaoPousada
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
CREATE UNIQUE INDEX "configuracoes_pousadas_hotelId_key" ON "configuracoes_pousadas"("hotelId");

-- AddForeignKey
ALTER TABLE "auditoria_reservas" ADD CONSTRAINT "auditoria_reservas_reservaId_fkey" 
FOREIGN KEY ("reservaId") REFERENCES "reservas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuracoes_pousadas" ADD CONSTRAINT "configuracoes_pousadas_hotelId_fkey" 
FOREIGN KEY ("hotelId") REFERENCES "hoteis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing data (update status enum values)
UPDATE "reservas" 
SET "status" = 'FINALIZADA' 
WHERE "status" = 'CHECKED_OUT';

UPDATE "reservas" 
SET "status" = 'CONFIRMADA' 
WHERE "status" = 'CHECKED_IN';

-- Insert default configurations for existing hotels (optional)
-- Uncomment if you want to auto-create configs for all existing hotels
-- INSERT INTO "configuracoes_pousadas" ("id", "hotelId", "horaCheckIn", "horaCheckOut", "regras", "prazoDiasConfirmacaoReserva", "templateConfirmacao", "templateCancelamento", "templateLembrete", "createdAt", "updatedAt")
-- SELECT gen_random_uuid(), "id", '14:00', '12:00', '', 3, '', '', '', NOW(), NOW()
-- FROM "hoteis"
-- WHERE "id" NOT IN (SELECT "hotelId" FROM "configuracoes_pousadas");
