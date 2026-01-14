const express = require("express");
const router = express.Router();
const configuracaoController = require("../controllers/configuracao.controller");

// GET /configuracoes/:hotelId - Obter configurações da pousada
router.get("/:hotelId", configuracaoController.obterConfiguracao);

// PUT /configuracoes/:hotelId - Atualizar configurações
router.put("/:hotelId", configuracaoController.atualizarConfiguracao);

module.exports = router;
