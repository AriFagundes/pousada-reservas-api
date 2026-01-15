const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function criarConfiguracaoHotel() {
  try {
    const config = await prisma.configuracaoPousada.upsert({
      where: { hotelId: 'solar-penha' },
      update: {},
      create: {
        hotelId: 'solar-penha',
        horaCheckIn: '14:00',
        horaCheckOut: '12:00',
        prazoDiasConfirmacaoReserva: 3,
        regras: 'Check-in às 14h, Check-out às 12h. Silêncio após 22h.',
        templateConfirmacao: 'Olá {{nome}}! Sua reserva no Solar de Penha foi confirmada para {{data}}. Chegue a partir das {{horario_checkin}}. Aguardamos você!',
        templateCancelamento: 'Olá {{nome}}, sua reserva para {{data}} foi cancelada conforme solicitado.',
        templateLembrete: 'Olá {{nome}}! Lembre-se: seu check-in no Solar de Penha é amanhã, {{data}}. Chegue a partir das {{horario_checkin}}!'
      }
    });
    
    console.log('✅ Configuração criada para Solar de Penha!');
    console.log(config);
    
    // Agora vincular usuário
    const usuario = await prisma.usuario.update({
      where: { email: 'admin@hotel.com' },
      data: { hotelId: 'solar-penha' }
    });
    
    console.log('\n✅ Usuário vinculado ao Solar de Penha!');
    console.log(usuario);
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

criarConfiguracaoHotel();
