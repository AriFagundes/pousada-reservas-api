const authService = require("../services/auth.service");

async function login(req, res) {
    try {
        const { email, senha } = req.body;
        const resultado = await authService.login(email, senha);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function register(req, res) {
    try {
        const usuario = await authService.register(req.body);
        res.status(201).json({ 
            message: 'Usuário criado com sucesso! Verifique seu email para ativar a conta.',
            usuario 
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function verificarEmail(req, res) {
    try {
        const { token } = req.params;
        const usuario = await authService.verificarEmail(token);
        res.json({ 
            message: 'Email verificado com sucesso! Sua conta está ativa.',
            usuario 
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function reenviarEmailVerificacao(req, res) {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email é obrigatório' });
        }

        const resultado = await authService.reenviarEmailVerificacao(email);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function me(req, res) {
    try {
        const userId = req.userId;
        const usuario = await authService.buscarPorId(userId);
        res.json(usuario);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = { login, register, verificarEmail, reenviarEmailVerificacao, me };
