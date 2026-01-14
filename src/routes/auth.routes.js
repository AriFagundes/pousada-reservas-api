const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verificarToken } = require("../services/auth.service");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get('/verificar-email/:token', authController.verificarEmail);
router.post('/reenviar-email', authController.reenviarEmailVerificacao);
router.get("/me", verificarToken, authController.me);

module.exports = router;
