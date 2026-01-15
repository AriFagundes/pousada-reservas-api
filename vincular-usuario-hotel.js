const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function vincularUsuario() {
  try {
    const usuario = await prisma.usuario.update({
      where: { email: 'admin@hotel.com' },
      data: { hotelId: 'solar-penha' }
    });
    
    console.log('✅ Usuário vinculado ao Solar de Penha!');
    console.log(usuario);
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

vincularUsuario();
