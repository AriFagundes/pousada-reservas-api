const prisma = require("../config/prisma");

// Obter configurações da pousada
async function obterConfiguracao(hotelId) {
  let config = await prisma.configuracaoPousada.findUnique({
    where: { hotelId }
  });

  if (!config) {
    // Criar com valores padrão
    config = await prisma.configuracaoPousada.create({
      data: {
        hotelId,
        horaCheckIn: "14:00",
        horaCheckOut: "12:00",
        prazoDiasConfirmacaoReserva: 3,
        templateConfirmacao: "Olá {{nome}}! 🎉\n\nReserva confirmada para {{data}}\nHóspedes: {{pessoas}}\n\nHorário check-in: {{horario_checkin}}\n\n{{regras}}\n\nQualquer dúvida, estamos à disposição!",
        templateCancelamento: "Olá {{nome}}!\n\nLamentamos, mas sua reserva para {{data}} foi cancelada.\n\nQualquer dúvida, nos contate!",
        templateLembrete: "Olá {{nome}}! 👋\n\nLembrete: você tem reserva conosco para {{data}}.\nCheck-in às {{horario_checkin}}.\n\nAté logo!"
      }
    });
  }

  return config;
}

// Atualizar configurações
async function atualizarConfiguracao(hotelId, dados) {
  return await prisma.configuracaoPousada.update({
    where: { hotelId },
    data: {
      horaCheckIn: dados.horaCheckIn || undefined,
      horaCheckOut: dados.horaCheckOut || undefined,
      regras: dados.regras || undefined,
      prazoDiasConfirmacaoReserva: dados.prazoDiasConfirmacaoReserva || undefined,
      templateConfirmacao: dados.templateConfirmacao || undefined,
      templateCancelamento: dados.templateCancelamento || undefined,
      templateLembrete: dados.templateLembrete || undefined
    }
  });
}

// Processar template com variáveis
function processarTemplate(template, variaveis) {
  let resultado = template;

  Object.keys(variaveis).forEach(chave => {
    resultado = resultado.replace(new RegExp(`{{${chave}}}`, 'g'), variaveis[chave]);
  });

  return resultado;
}

module.exports = {
  obterConfiguracao,
  atualizarConfiguracao,
  processarTemplate
};
