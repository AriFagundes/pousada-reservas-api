const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function criarTudoSolarPenha() {
  try {
    console.log('🏗️ Criando Solar de Penha completo...\n');
    
    // 1. Criar Hotel
    const hotel = await prisma.hotel.create({
      data: {
        id: 'solar-penha',
        nome: 'Solar de Penha',
        endereco: 'Próximo ao Beto Carrero World',
        cidade: 'Penha',
        estado: 'SC',
        telefone: '(47) 9782-8637',
        email: 'contato@solardepenha.com.br',
        descricao: 'Pousada aconchegante próxima ao Beto Carrero World'
      }
    });
    console.log('✅ Hotel criado:', hotel.nome);

    // 2. Criar Tipos de Quarto
    const tipoMaster = await prisma.tipoQuarto.create({
      data: {
        id: 'suite-master-luxo',
        nome: 'Suíte Master Luxo',
        descricao: 'Um refúgio de sofisticação com vista privilegiada.',
        capacidadePessoas: 2,
        precoBase: 450.00
      }
    });

    const tipoFamilia = await prisma.tipoQuarto.create({
      data: {
        id: 'suite-familia-conforto',
        nome: 'Suíte Família Conforto',
        descricao: 'Espaço planejado para famílias.',
        capacidadePessoas: 4,
        precoBase: 580.00
      }
    });

    const tipoStandard = await prisma.tipoQuarto.create({
      data: {
        id: 'standard-solar',
        nome: 'Standard Solar',
        descricao: 'Conforto essencial com melhor custo-benefício.',
        capacidadePessoas: 3,
        precoBase: 320.00
      }
    });
    console.log('✅ 3 tipos de quarto criados');

    // 3. Criar Quartos
    const quartos = [];
    
    // Suítes Master (101-103)
    for (let i = 101; i <= 103; i++) {
      const q = await prisma.quarto.create({
        data: {
          numero: i.toString(),
          andar: 1,
          status: 'DISPONIVEL',
          hotelId: hotel.id,
          tipoQuartoId: tipoMaster.id
        }
      });
      quartos.push(q);
    }

    // Suítes Família (201-203)
    for (let i = 201; i <= 203; i++) {
      const q = await prisma.quarto.create({
        data: {
          numero: i.toString(),
          andar: 2,
          status: 'DISPONIVEL',
          hotelId: hotel.id,
          tipoQuartoId: tipoFamilia.id
        }
      });
      quartos.push(q);
    }

    // Standard (301-303)
    for (let i = 301; i <= 303; i++) {
      const q = await prisma.quarto.create({
        data: {
          numero: i.toString(),
          andar: 3,
          status: 'DISPONIVEL',
          hotelId: hotel.id,
          tipoQuartoId: tipoStandard.id
        }
      });
      quartos.push(q);
    }
    console.log('✅ 9 quartos criados');

    // 4. Criar Configuração
    const config = await prisma.configuracaoPousada.create({
      data: {
        hotelId: hotel.id,
        horaCheckIn: '14:00',
        horaCheckOut: '12:00',
        prazoDiasConfirmacaoReserva: 3,
        regras: 'Check-in às 14h, Check-out às 12h. Silêncio após 22h.',
        templateConfirmacao: 'Olá {{nome}}! Sua reserva no Solar de Penha foi confirmada para {{data}}. Aguardamos você!',
        templateCancelamento: 'Olá {{nome}}, sua reserva para {{data}} foi cancelada.',
        templateLembrete: 'Olá {{nome}}! Lembre-se: check-in amanhã, {{data}}!'
      }
    });
    console.log('✅ Configuração criada');

    // 5. Vincular usuário
    const usuario = await prisma.usuario.update({
      where: { email: 'admin@hotel.com' },
      data: { hotelId: hotel.id, ativo: true }
    });
    console.log('✅ Usuário admin vinculado ao hotel\n');

    console.log('🎉 SOLAR DE PENHA PRONTO!');
    console.log('\n📧 Login: admin@hotel.com');
    console.log('🔑 Senha: 123456');
    console.log('🏨 Hotel: Solar de Penha');

  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️ Hotel já existe! Tentando apenas vincular usuário...');
      try {
        const usuario = await prisma.usuario.update({
          where: { email: 'admin@hotel.com' },
          data: { hotelId: 'solar-penha', ativo: true }
        });
        console.log('✅ Usuário vinculado!');
        console.log('\n📧 Login: admin@hotel.com');
        console.log('🔑 Senha: 123456');
      } catch (e) {
        console.error('❌ Erro ao vincular:', e.message);
      }
    } else {
      console.error('❌ Erro:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

criarTudoSolarPenha();
