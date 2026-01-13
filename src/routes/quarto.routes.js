const express = require("express");
const router = express.Router();
const quartoController = require("../controllers/quarto.controller");

router.post("/", quartoController.criar);
router.get("/", quartoController.listar);
router.get("/disponibilidade", quartoController.verificarDisponibilidade);
router.get("/:id", quartoController.buscarPorId);
router.put("/:id", quartoController.atualizar);
router.delete("/:id", quartoController.deletar);

module.exports = router;
