const prisma = require("../config/prisma");

// Obter cards da visão geral
async function obterVisaoGeral(hotelId) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);

  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - hoje.getDay());

  const fimSemana = new Date(inicioSemana);
  fimSemana.setDate(inicioSemana.getDate() + 6);
  fimSemana.setHours(23, 59, 59, 999);

  // Reservas de hoje
  const reservasHoje = await prisma.reserva.findMany({
    where: {
      hotelId,
      dataCheckIn: { gte: hoje, lt: amanha },
      status: { in: ['CONFIRMADA', 'PENDENTE'] }
    },
    include: {
      cliente: true,
      quarto: { include: { tipoQuarto: true } }
    }
  });

  // Reservas de amanhã
  const reservasAmanha = await prisma.reserva.findMany({
    where: {
      hotelId,
      dataCheckIn: { gte: amanha, lt: new Date(amanha.getTime() + 86400000) },
      status: { in: ['CONFIRMADA', 'PENDENTE'] }
    },
    include: {
      cliente: true,
      quarto: { include: { tipoQuarto: true } }
    }
  });

  // Reservas pendentes
  const reservasPendentes = await prisma.reserva.findMany({
    where: {
      hotelId,
      status: 'PENDENTE',
      dataCheckIn: { gte: hoje }
    },
    include: {
      cliente: true,
      quarto: { include: { tipoQuarto: true } }
    },
    orderBy: { dataPrazoConfirmacao: 'asc' }
  });

  // Calcular taxa de ocupação da semana
  const totalQuartos = await prisma.quarto.count({
    where: { hotelId, status: { not: 'INATIVO' } }
  });

  const diasSemana = 7;
  const capacidadeTotal = totalQuartos * diasSemana;

  // Contar dias de ocupação (apenas CONFIRMADAS bloqueiam)
  const reservasConfirmadas = await prisma.reserva.findMany({
    where: {
      hotelId,
      status: 'CONFIRMADA',
      dataCheckIn: { lt: fimSemana },
      dataCheckOut: { gt: inicioSemana }
    }
  });

  let diasOcupados = 0;
  reservasConfirmadas.forEach(reserva => {
    const checkIn = new Date(reserva.dataCheckIn);
    const checkOut = new Date(reserva.dataCheckOut);

    let inicio = checkIn < inicioSemana ? inicioSemana : checkIn;
    let fim = checkOut > fimSemana ? fimSemana : checkOut;

    const dias = Math.ceil((fim - inicio) / (1000 * 60 * 60 * 24));
    diasOcupados += dias;
  });

  const taxaOcupacao = capacidadeTotal > 0 ? Math.round((diasOcupados / capacidadeTotal) * 100) : 0;

  return {
    reservasHoje: {
      total: reservasHoje.length,
      confirmadas: reservasHoje.filter(r => r.status === 'CONFIRMADA').length,
      pendentes: reservasHoje.filter(r => r.status === 'PENDENTE').length,
      dados: reservasHoje
    },
    reservasAmanha: {
      total: reservasAmanha.length,
      confirmadas: reservasAmanha.filter(r => r.status === 'CONFIRMADA').length,
      pendentes: reservasAmanha.filter(r => r.status === 'PENDENTE').length,
      dados: reservasAmanha
    },
    reservasPendentes: {
      total: reservasPendentes.length,
      dados: reservasPendentes
    },
    taxaOcupacao,
    estatisticas: {
      totalQuartos,
      diasOcupados,
      capacidadeTotal
    }
  };
}

// Obter eventos do calendário
async function obterEventosCalendario(hotelId, mes, ano) {
  const inicioMes = new Date(ano, mes - 1, 1);
  const fimMes = new Date(ano, mes, 0, 23, 59, 59, 999);

  const reservas = await prisma.reserva.findMany({
    where: {
      hotelId,
      dataCheckIn: { lt: fimMes },
      dataCheckOut: { gt: inicioMes },
      status: { in: ['CONFIRMADA', 'PENDENTE', 'NO_SHOW'] }
    },
    include: {
      cliente: true,
      quarto: { include: { tipoQuarto: true } }
    }
  });

  // Agrupar por dia
  const eventosPorDia = {};

  for (let i = 1; i <= new Date(ano, mes, 0).getDate(); i++) {
    eventosPorDia[i] = {
      dia: i,
      confirmadas: 0,
      pendentes: 0,
      noShow: 0,
      reservas: []
    };
  }

  reservas.forEach(reserva => {
    const checkIn = new Date(reserva.dataCheckIn);
    const checkOut = new Date(reserva.dataCheckOut);

    for (let d = Math.max(1, checkIn.getDate()); d < checkOut.getDate(); d++) {
      if (d <= new Date(ano, mes, 0).getDate()) {
        if (!eventosPorDia[d]) {
          eventosPorDia[d] = {
            dia: d,
            confirmadas: 0,
            pendentes: 0,
            noShow: 0,
            reservas: []
          };
        }

        if (reserva.status === 'CONFIRMADA') {
          eventosPorDia[d].confirmadas++;
        } else if (reserva.status === 'PENDENTE') {
          eventosPorDia[d].pendentes++;
        } else if (reserva.status === 'NO_SHOW') {
          eventosPorDia[d].noShow++;
        }

        if (!eventosPorDia[d].reservas.find(r => r.id === reserva.id)) {
          eventosPorDia[d].reservas.push({
            id: reserva.id,
            cliente: reserva.cliente.nome,
            status: reserva.status,
            checkIn: reserva.dataCheckIn,
            checkOut: reserva.dataCheckOut
          });
        }
      }
    }
  });

  return Object.values(eventosPorDia);
}

// Obter auditoria de uma reserva
async function obterAuditoriaReserva(reservaId) {
  return await prisma.auditoriaReserva.findMany({
    where: { reservaId },
    orderBy: { createdAt: 'desc' }
  });
}

module.exports = {
  obterVisaoGeral,
  obterEventosCalendario,
  obterAuditoriaReserva
};
