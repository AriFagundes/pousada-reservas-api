-- Resolve failed migration by manually applying what it was trying to do
-- This handles the IF NOT EXISTS for safety

-- Add columns to reservas if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservas' AND column_name = 'dataConfirmacao'
    ) THEN
        ALTER TABLE "reservas" ADD COLUMN "dataConfirmacao" TIMESTAMP(3);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservas' AND column_name = 'dataPrazoConfirmacao'
    ) THEN
        ALTER TABLE "reservas" ADD COLUMN "dataPrazoConfirmacao" TIMESTAMP(3);
    END IF;
END $$;

-- Create auditoria_reservas table if it doesn't exist
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

-- Create configuracoes_pousadas table if it doesn't exist
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

-- Create unique index if it doesn't exist
CREATE UNIQUE INDEX IF NOT EXISTS "configuracoes_pousadas_hotelId_key" ON "configuracoes_pousadas"("hotelId");

-- Add foreign keys if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'auditoria_reservas_reservaId_fkey'
    ) THEN
        ALTER TABLE "auditoria_reservas" ADD CONSTRAINT "auditoria_reservas_reservaId_fkey" 
        FOREIGN KEY ("reservaId") REFERENCES "reservas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'configuracoes_pousadas_hotelId_fkey'
    ) THEN
        ALTER TABLE "configuracoes_pousadas" ADD CONSTRAINT "configuracoes_pousadas_hotelId_fkey" 
        FOREIGN KEY ("hotelId") REFERENCES "hoteis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
