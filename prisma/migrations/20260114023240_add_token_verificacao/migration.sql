-- AlterTable
ALTER TABLE "usuarios" ALTER COLUMN "ativo" SET DEFAULT false;

-- CreateTable
CREATE TABLE "tokens_verificacao" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_verificacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tokens_verificacao_token_key" ON "tokens_verificacao"("token");

-- AddForeignKey
ALTER TABLE "tokens_verificacao" ADD CONSTRAINT "tokens_verificacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
