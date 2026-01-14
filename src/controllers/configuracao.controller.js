const configuracaoService = require("../services/configuracao.service");
const prisma = require("../config/prisma");

// GET /configuracoes/:hotelId - Obter configurações
async function obterConfiguracao(req, res) {
  try {
    const { hotelId } = req.params;

    if (!hotelId) {
      return res.status(400).json({ error: "hotelId é obrigatório" });
    }

    const config = await configuracaoService.obterConfiguracao(hotelId);
    res.json(config);
  } catch (erro) {
    console.error("Erro ao obter configurações:", erro);
    res.status(500).json({ error: "Erro ao obter configurações" });
  }
}

// PUT /configuracoes/:hotelId - Atualizar configurações
async function atualizarConfiguracao(req, res) {
  try {
    const { hotelId } = req.params;
    const dados = req.body;

    if (!hotelId) {
      return res.status(400).json({ error: "hotelId é obrigatório" });
    }

    // Garantir que existe configuração
    await configuracaoService.obterConfiguracao(hotelId);

    const config = await configuracaoService.atualizarConfiguracao(hotelId, dados);
    res.json(config);
  } catch (erro) {
    console.error("Erro ao atualizar configurações:", erro);
    res.status(500).json({ error: "Erro ao atualizar configurações" });
  }
}

module.exports = {
  obterConfiguracao,
  atualizarConfiguracao
};
