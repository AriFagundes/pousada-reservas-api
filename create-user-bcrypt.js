const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function criarNovoUsuario() {
  try {
    const senhaHash = await bcrypt.hash('123456', 10);
    
    const user = await prisma.usuario.create({
      data: {
        nome: 'Admin',
        email: 'admin@hotel.com',
        senha: senhaHash,
        role: 'ADMIN',
        ativo: true  // Já ativado para poder fazer login
      }
    });
    
    console.log('✅ Usuário criado com sucesso com senha hasheada:');
    console.log('📧 Email: admin@hotel.com');
    console.log('🔑 Senha: 123456');
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

criarNovoUsuario();
