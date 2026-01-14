const dashboardService = require("../services/dashboard.service");

// GET /dashboard/visao-geral - Obter cards da visão geral
async function obterVisaoGeral(req, res) {
  try {
    const { hotelId } = req.query;

    if (!hotelId) {
      return res.status(400).json({ error: "hotelId é obrigatório" });
    }

    const dados = await dashboardService.obterVisaoGeral(hotelId);
    res.json(dados);
  } catch (erro) {
    console.error("Erro ao obter visão geral:", erro);
    res.status(500).json({ error: "Erro ao obter dados do dashboard" });
  }
}

// GET /dashboard/calendario - Obter eventos do calendário
async function obterCalendario(req, res) {
  try {
    const { hotelId, mes, ano } = req.query;

    if (!hotelId || !mes || !ano) {
      return res.status(400).json({ error: "hotelId, mes e ano são obrigatórios" });
    }

    const dados = await dashboardService.obterEventosCalendario(
      hotelId,
      parseInt(mes),
      parseInt(ano)
    );
    res.json(dados);
  } catch (erro) {
    console.error("Erro ao obter calendário:", erro);
    res.status(500).json({ error: "Erro ao obter calendário" });
  }
}

// GET /dashboard/auditoria/:reservaId - Obter auditoria de uma reserva
async function obterAuditoria(req, res) {
  try {
    const { reservaId } = req.params;

    if (!reservaId) {
      return res.status(400).json({ error: "reservaId é obrigatório" });
    }

    const auditoria = await dashboardService.obterAuditoriaReserva(reservaId);
    res.json(auditoria);
  } catch (erro) {
    console.error("Erro ao obter auditoria:", erro);
    res.status(500).json({ error: "Erro ao obter auditoria" });
  }
}

module.exports = {
  obterVisaoGeral,
  obterCalendario,
  obterAuditoria
};
