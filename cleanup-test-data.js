#!/usr/bin/env node

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanup() {
  try {
    console.log('🧹 Iniciando limpeza de dados de teste...\n');

    // Delete all verification tokens first (foreign key constraint)
    const tokensDeleted = await prisma.tokenVerificacao.deleteMany({});
    console.log(`✅ ${tokensDeleted.count} tokens de verificação deletados`);

    // Delete all test users
    const usuariosDeleted = await prisma.usuario.deleteMany({});
    console.log(`✅ ${usuariosDeleted.count} usuários deletados`);

    console.log('\n🎉 Banco de dados limpo com sucesso!\n');
    
    // Show remaining users
    const usuariosRestantes = await prisma.usuario.findMany({
      select: { id: true, nome: true, email: true, ativo: true }
    });
    
    console.log('Usuários restantes no banco:');
    if (usuariosRestantes.length === 0) {
      console.log('  ❌ Nenhum usuário encontrado');
    } else {
      usuariosRestantes.forEach(u => {
        console.log(`  • ${u.nome} (${u.email}) - Ativo: ${u.ativo}`);
      });
    }

  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

cleanup();
