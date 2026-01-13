const express = require("express");
const router = express.Router();
const tipoQuartoController = require("../controllers/tipoQuarto.controller");

router.post("/", tipoQuartoController.criar);
router.get("/", tipoQuartoController.listar);
router.get("/:id", tipoQuartoController.buscarPorId);
router.put("/:id", tipoQuartoController.atualizar);
router.delete("/:id", tipoQuartoController.deletar);

module.exports = router;
