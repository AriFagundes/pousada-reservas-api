const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// ⚠️ ATENÇÃO: Estes endpoints são APENAS para desenvolvimento
// Em produção, proteja com autenticação de admin ou remova

router.post('/limpar-dados-teste', adminController.limparDadosTeste);
router.post('/deletar-usuario', adminController.deletarUsuario);

module.exports = router;
