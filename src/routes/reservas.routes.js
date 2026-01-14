const express = require("express");
const router = express.Router();
const reservasController = require("../controllers/reservas.controller");

// Novo: Endpoint público para criar reserva via formulário
router.post("/criar-reserva", reservasController.criarViaFormulario);

router.post("/", reservasController.criar);
router.get("/", reservasController.listar);
router.get("/:id", reservasController.buscarPorId);
router.put("/:id", reservasController.atualizar);
router.delete("/:id", reservasController.deletar);
router.patch("/:id/cancelar", reservasController.cancelar);
router.patch("/:id/confirmar", reservasController.confirmar);
router.patch("/:id/no-show", reservasController.marcarNoShow);
router.patch("/:id/check-in", reservasController.checkIn);
router.patch("/:id/check-out", reservasController.checkOut);

module.exports = router;

