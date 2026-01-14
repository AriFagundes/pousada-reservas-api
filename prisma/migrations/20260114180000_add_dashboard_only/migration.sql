-- AlterTable (adiciona colunas se não existirem)
ALTER TABLE "reservas" 
ADD COLUMN IF NOT EXISTS "dataConfirmacao" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "dataPrazoConfirmacao" TIMESTAMP(3);

-- CreateTable auditoria_reservas (só se não existir)
CREATE TABLE IF NOT EXISTS "auditoria_reservas" (
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

-- CreateTable configuracoes_pousadas (só se não existir)
CREATE TABLE IF NOT EXISTS "configuracoes_pousadas" (
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

-- CreateIndex (só se não existir)
CREATE UNIQUE INDEX IF NOT EXISTS "configuracoes_pousadas_hotelId_key" ON "configuracoes_pousadas"("hotelId");

-- AddForeignKey (só se não existir ainda)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'auditoria_reservas_reservaId_fkey'
    ) THEN
        ALTER TABLE "auditoria_reservas" ADD CONSTRAINT "auditoria_reservas_reservaId_fkey" 
        FOREIGN KEY ("reservaId") REFERENCES "reservas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'configuracoes_pousadas_hotelId_fkey'
    ) THEN
        ALTER TABLE "configuracoes_pousadas" ADD CONSTRAINT "configuracoes_pousadas_hotelId_fkey" 
        FOREIGN KEY ("hotelId") REFERENCES "hoteis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
