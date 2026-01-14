const prisma = require("../config/prisma");

// ATENÇÃO: Este endpoint é APENAS para desenvolvimento/testes
// Em produção, adicione autenticação de admin ou remova completamente

async function limparDadosTeste(req, res) {
    try {
        const { senhaAdmin } = req.body;
        
        // Senha de segurança - mude isso!
        const SENHA_ADMIN = process.env.ADMIN_PASSWORD || 'admin123';
        
        if (senhaAdmin !== SENHA_ADMIN) {
            return res.status(401).json({ message: 'Acesso negado' });
        }

        // Delete tokens first (foreign key constraint)
        const tokensDeleted = await prisma.tokenVerificacao.deleteMany({});
        
        // Delete all users
        const usuariosDeleted = await prisma.usuario.deleteMany({});

        res.json({
            message: 'Dados de teste deletados com sucesso',
            tokensDeleted: tokensDeleted.count,
            usuariosDeleted: usuariosDeleted.count
        });
    } catch (error) {
        console.error('❌ Erro ao limpar dados:', error);
        res.status(500).json({ message: 'Erro ao limpar dados de teste' });
    }
}

async function deletarUsuario(req, res) {
    try {
        const { email, senhaAdmin } = req.body;
        
        const SENHA_ADMIN = process.env.ADMIN_PASSWORD || 'admin123';
        
        if (senhaAdmin !== SENHA_ADMIN) {
            return res.status(401).json({ message: 'Acesso negado' });
        }

        if (!email) {
            return res.status(400).json({ message: 'Email é obrigatório' });
        }

        // Busca usuário
        const usuario = await prisma.usuario.findUnique({
            where: { email },
            include: { tokensVerificacao: true }
        });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Delete tokens
        if (usuario.tokensVerificacao && usuario.tokensVerificacao.length > 0) {
            await prisma.tokenVerificacao.deleteMany({
                where: { usuarioId: usuario.id }
            });
        }

        // Delete user
        await prisma.usuario.delete({
            where: { email }
        });

        res.json({
            message: `Usuário ${email} deletado com sucesso`
        });
    } catch (error) {
        console.error('❌ Erro ao deletar usuário:', error);
        res.status(500).json({ message: 'Erro ao deletar usuário' });
    }
}

module.exports = {
    limparDadosTeste,
    deletarUsuario
};
