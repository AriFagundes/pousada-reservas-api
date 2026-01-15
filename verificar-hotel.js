const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verificarHotel() {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: 'solar-penha' }
    });
    console.log('Hotel:', hotel);
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarHotel();
