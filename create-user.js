const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function criarUsuario() {
  try {
    const user = await prisma.usuario.create({
      data: {
        nome: 'Admin',
        email: 'admin@hotel.com',
        senha: '123456',
        role: 'ADMIN',
        ativo: true
      }
    });
    
    console.log('✅ Usuário criado com sucesso:', user);
    console.log('\n📧 Email: admin@hotel.com');
    console.log('🔑 Senha: 123456');
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Usuário já existe!');
    } else {
      console.error('❌ Erro ao criar usuário:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

criarUsuario();
