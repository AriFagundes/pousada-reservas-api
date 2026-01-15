const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deletarReservasTeste() {
  try {
    console.log('🗑️  Deletando reservas de teste...\n');

    // Deletar todas as reservas do hotel Solar de Penha
    const reservasDeletadas = await prisma.reserva.deleteMany({
      where: {
        quarto: {
          hotelId: 'solar-penha'
        }
      }
    });

    console.log(`✅ ${reservasDeletadas.count} reservas deletadas`);

    // Deletar clientes de teste
    const clientesDeletados = await prisma.cliente.deleteMany({
      where: {
        email: {
          in: ['joao@email.com', 'maria@email.com', 'carlos@email.com']
        }
      }
    });

    console.log(`✅ ${clientesDeletados.count} clientes de teste deletados`);

    console.log('\n✨ Limpeza completa! Agora você pode fazer o teste real.');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

deletarReservasTeste();
