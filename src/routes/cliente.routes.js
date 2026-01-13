const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/cliente.controller");

router.post("/", clienteController.criar);
router.get("/", clienteController.listar);
router.get("/:id", clienteController.buscarPorId);
router.get("/email/:email", clienteController.buscarPorEmail);
router.put("/:id", clienteController.atualizar);
router.delete("/:id", clienteController.deletar);

module.exports = router;
