const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteUsers() {
  try {
    const deleted = await prisma.usuario.deleteMany({});
    console.log(`✅ ${deleted.count} usuários deletados`);
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

deleteUsers();
