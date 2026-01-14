const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const setupController = require('../controllers/setup.controller');

// ⚠️ ATENÇÃO: Estes endpoints são APENAS para desenvolvimento
// Em produção, proteja com autenticação de admin ou remova

router.post('/limpar-dados-teste', adminController.limparDadosTeste);
router.post('/deletar-usuario', adminController.deletarUsuario);
router.post('/criar-dados-iniciais', setupController.criarDadosIniciais);

module.exports = router;
