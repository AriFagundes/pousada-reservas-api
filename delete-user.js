#!/usr/bin/env node

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteSpecificUser() {
  try {
    const email = 'aricontato1@gmail.com';
    console.log(`🗑️  Deletando usuário: ${email}\n`);

    // First delete tokens for this user
    const user = await prisma.usuario.findUnique({
      where: { email },
      include: { tokensVerificacao: true }
    });

    if (!user) {
      console.log(`❌ Usuário ${email} não encontrado!`);
      return;
    }

    // Delete tokens
    if (user.tokensVerificacao && user.tokensVerificacao.length > 0) {
      await prisma.tokenVerificacao.deleteMany({
        where: { usuarioId: user.id }
      });
      console.log(`✅ ${user.tokensVerificacao.length} token(s) deletado(s)`);
    }

    // Delete user
    await prisma.usuario.delete({
      where: { email }
    });

    console.log(`✅ Usuário ${email} deletado com sucesso!\n`);

    // Show remaining users
    const usuarios = await prisma.usuario.findMany({
      select: { id: true, nome: true, email: true, ativo: true }
    });

    console.log(`📋 Usuários restantes: ${usuarios.length}`);
    usuarios.forEach(u => {
      console.log(`  • ${u.nome} (${u.email})`);
    });

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

deleteSpecificUser();
