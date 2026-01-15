const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function criarOuAtualizarHotel() {
  try {
    console.log('🏨 Criando/atualizando hotel Solar de Penha...\n');

    const hotel = await prisma.hotel.upsert({
      where: { id: '1' },
      update: {
        nome: 'Solar de Penha',
        descricao: 'Pousada Solar de Penha',
        endereco: 'Estrada Principal',
        cidade: 'Penha',
        estado: 'SC',
        cep: '88000-000',
        telefone: '(47) 3366-0000',
        email: 'contato@soliardepenha.com.br'
      },
      create: {
        id: '1',
        nome: 'Solar de Penha',
        descricao: 'Pousada Solar de Penha',
        endereco: 'Estrada Principal',
        cidade: 'Penha',
        estado: 'SC',
        cep: '88000-000',
        telefone: '(47) 3366-0000',
        email: 'contato@soliardepenha.com.br'
      }
    });

    console.log('✅ Hotel criado/atualizado:');
    console.log(`   ID: ${hotel.id}`);
    console.log(`   Nome: ${hotel.nome}`);

    // Atualizar hotel padrão na configuração
    const config = await prisma.configuracaoPousada.upsert({
      where: { hotelId: '1' },
      update: {},
      create: {
        hotelId: '1',
        horaCheckIn: '15:00',
        horaCheckOut: '11:00',
        templateConfirmacao: 'Sua reserva foi confirmada!',
        templateCancelamento: 'Sua reserva foi cancelada.'
      }
    });

    console.log('✅ Configuração criada para o hotel');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

criarOuAtualizarHotel();
