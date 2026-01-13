const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotel.controller");

router.post("/", hotelController.criar);
router.get("/", hotelController.listar);
router.get("/:id", hotelController.buscarPorId);
router.put("/:id", hotelController.atualizar);
router.delete("/:id", hotelController.deletar);

module.exports = router;
