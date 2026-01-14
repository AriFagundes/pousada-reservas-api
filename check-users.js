#!/usr/bin/env node

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('📋 Verificando usuários no banco...\n');

    const usuarios = await prisma.usuario.findMany({
      select: { id: true, nome: true, email: true, ativo: true, createdAt: true }
    });

    if (usuarios.length === 0) {
      console.log('✅ Nenhum usuário encontrado no banco!');
    } else {
      console.log(`Encontrados ${usuarios.length} usuário(s):\n`);
      usuarios.forEach((u, i) => {
        console.log(`${i + 1}. ${u.nome} (${u.email})`);
        console.log(`   Ativo: ${u.ativo}, Criado: ${new Date(u.createdAt).toLocaleString('pt-BR')}`);
      });
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
