const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function criarReservasTeste() {
  try {
    console.log('🎯 Criando reservas de teste...\n');

    // 1. Criar clientes de teste
    const cliente1 = await prisma.cliente.upsert({
      where: { email: 'joao@email.com' },
      update: {},
      create: {
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '(11) 98765-4321',
        cpf: '123.456.789-00'
      }
    });

    const cliente2 = await prisma.cliente.upsert({
      where: { email: 'maria@email.com' },
      update: {},
      create: {
        nome: 'Maria Santos',
        email: 'maria@email.com',
        telefone: '(11) 97654-3210',
        cpf: '987.654.321-00'
      }
    });

    const cliente3 = await prisma.cliente.upsert({
      where: { email: 'carlos@email.com' },
      update: {},
      create: {
        nome: 'Carlos Oliveira',
        email: 'carlos@email.com',
        telefone: '(11) 96543-2109',
        cpf: '456.789.123-00'
      }
    });

    console.log('✅ 3 clientes criados');

    // 2. Buscar quartos
    const quartos = await prisma.quarto.findMany({
      where: { hotelId: 'solar-penha' },
      include: { tipoQuarto: true }
    });

    if (quartos.length === 0) {
      console.log('❌ Nenhum quarto encontrado!');
      return;
    }

    // 3. Criar reservas com diferentes status e datas
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    
    const doisDias = new Date(hoje);
    doisDias.setDate(doisDias.getDate() + 2);
    
    const semanaFutura = new Date(hoje);
    semanaFutura.setDate(semanaFutura.getDate() + 7);

    // Reserva 1: PENDENTE - Check-in amanhã
    const reserva1 = await prisma.reserva.create({
      data: {
        clienteId: cliente1.id,
        quartoId: quartos[0].id,
        hotelId: 'solar-penha',
        dataCheckIn: amanha,
        dataCheckOut: doisDias,
        numeroPessoas: 2,
        valorTotal: quartos[0].tipoQuarto.precoBase * 1, // 1 dia
        status: 'PENDENTE',
        observacoes: 'Pediu quarto no térreo'
      }
    });
    console.log(`✅ Reserva PENDENTE criada - ${cliente1.nome} - Quarto ${quartos[0].numero}`);

    // Reserva 2: CONFIRMADA - Check-in hoje
    const reserva2 = await prisma.reserva.create({
      data: {
        clienteId: cliente2.id,
        quartoId: quartos[3].id,
        hotelId: 'solar-penha',
        dataCheckIn: hoje,
        dataCheckOut: amanha,
        numeroPessoas: 4,
        valorTotal: quartos[3].tipoQuarto.precoBase * 1,
        status: 'CONFIRMADA',
        dataConfirmacao: hoje
      }
    });
    console.log(`✅ Reserva CONFIRMADA criada - ${cliente2.nome} - Quarto ${quartos[3].numero}`);

    // Reserva 3: CONFIRMADA - Semana que vem
    const duasSemanas = new Date(semanaFutura);
    duasSemanas.setDate(duasSemanas.getDate() + 7);
    
    const reserva3 = await prisma.reserva.create({
      data: {
        clienteId: cliente3.id,
        quartoId: quartos[6].id,
        hotelId: 'solar-penha',
        dataCheckIn: semanaFutura,
        dataCheckOut: duasSemanas,
        numeroPessoas: 3,
        valorTotal: quartos[6].tipoQuarto.precoBase * 7, // 7 dias
        status: 'CONFIRMADA',
        dataConfirmacao: hoje
      }
    });
    console.log(`✅ Reserva CONFIRMADA criada - ${cliente3.nome} - Quarto ${quartos[6].numero}`);

    console.log('\n🎉 RESERVAS DE TESTE CRIADAS COM SUCESSO!');
    console.log('\n📋 Resumo:');
    console.log(`- 1 reserva PENDENTE (check-in amanhã)`);
    console.log(`- 1 reserva CONFIRMADA (check-in hoje)`);
    console.log(`- 1 reserva CONFIRMADA (check-in daqui a 7 dias)`);
    console.log('\n🚀 Agora você pode testar o dashboard!\n');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

criarReservasTeste();
