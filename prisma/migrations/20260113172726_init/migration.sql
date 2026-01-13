-- CreateEnum
CREATE TYPE "StatusQuarto" AS ENUM ('DISPONIVEL', 'OCUPADO', 'MANUTENCAO', 'INATIVO');

-- CreateEnum
CREATE TYPE "StatusReserva" AS ENUM ('PENDENTE', 'CONFIRMADA', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELADA');

-- CreateTable
CREATE TABLE "hoteis" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT,
    "endereco" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cep" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hoteis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_quartos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "capacidadePessoas" INTEGER NOT NULL,
    "precoBase" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipos_quartos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quartos" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "tipoQuartoId" TEXT NOT NULL,
    "andar" INTEGER,
    "status" "StatusQuarto" NOT NULL DEFAULT 'DISPONIVEL',
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quartos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "cpf" TEXT,
    "dataNascimento" TIMESTAMP(3),
    "endereco" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "cep" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "quartoId" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "dataCheckIn" TIMESTAMP(3) NOT NULL,
    "dataCheckOut" TIMESTAMP(3) NOT NULL,
    "numeroPessoas" INTEGER NOT NULL,
    "valorTotal" DECIMAL(10,2) NOT NULL,
    "valorPago" DECIMAL(10,2) DEFAULT 0,
    "status" "StatusReserva" NOT NULL DEFAULT 'PENDENTE',
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hoteis_cnpj_key" ON "hoteis"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "quartos_hotelId_numero_key" ON "quartos"("hotelId", "numero");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_email_key" ON "clientes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_cpf_key" ON "clientes"("cpf");

-- AddForeignKey
ALTER TABLE "quartos" ADD CONSTRAINT "quartos_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hoteis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quartos" ADD CONSTRAINT "quartos_tipoQuartoId_fkey" FOREIGN KEY ("tipoQuartoId") REFERENCES "tipos_quartos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_quartoId_fkey" FOREIGN KEY ("quartoId") REFERENCES "quartos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hoteis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
