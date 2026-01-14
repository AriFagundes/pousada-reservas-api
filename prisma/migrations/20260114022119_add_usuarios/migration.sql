-- CreateEnum
CREATE TYPE "RoleUsuario" AS ENUM ('ADMIN', 'GERENTE', 'RECEPCIONISTA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "hotelId" TEXT,
    "role" "RoleUsuario" NOT NULL DEFAULT 'RECEPCIONISTA',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hoteis"("id") ON DELETE SET NULL ON UPDATE CASCADE;
