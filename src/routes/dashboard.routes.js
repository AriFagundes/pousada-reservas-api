const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");

// GET /dashboard/visao-geral - Cards de visão geral
router.get("/visao-geral", dashboardController.obterVisaoGeral);

// GET /dashboard/calendario - Eventos do calendário
router.get("/calendario", dashboardController.obterCalendario);

// GET /dashboard/auditoria/:reservaId - Histórico de auditoria
router.get("/auditoria/:reservaId", dashboardController.obterAuditoria);

module.exports = router;
