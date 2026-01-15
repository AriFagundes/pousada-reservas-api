const prisma = require("../config/prisma");
const { enviarEmailVerificacao, enviarEmailBoasVindas } = require('./email.service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-key-super-seguro-mude-isso-em-producao';

async function login(email, senha) {
    if (!email || !senha) {
        throw new Error("Email e senha são obrigatórios");
    }

    // Busca usuário por email
    const usuario = await prisma.usuario.findUnique({
        where: { email },
        include: { hotel: true }
    });

    if (!usuario) {
        throw new Error("Credenciais inválidas");
    }

    // Verifica se a conta está ativa
    if (!usuario.ativo) {
        throw new Error("Conta não verificada. Verifique seu email.");
    }

    // Compara senha com hash armazenado
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
        throw new Error("Credenciais inválidas");
    }

    // Retorna dados do usuário (sem a senha)
    const { senha: _, ...usuarioSemSenha } = usuario;
    
    // Gera JWT token com hotelId
    const token = jwt.sign(
        { 
            id: usuario.id, 
            email: usuario.email, 
            role: usuario.role,
            hotelId: usuario.hotelId 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    return {
        usuario: usuarioSemSenha,
        token
    };
}

async function register(dados) {
    const { nome, email, senha, hotelId, role = 'RECEPCIONISTA' } = dados;

    if (!nome || !email || !senha) {
        throw new Error("Nome, email e senha são obrigatórios");
    }

    if (senha.length < 6) {
        throw new Error("A senha deve ter no mínimo 6 caracteres");
    }

    // Verifica se email já existe
    const usuarioExistente = await prisma.usuario.findUnique({
        where: { email }
    });

    if (usuarioExistente) {
        throw new Error("Email já cadastrado");
    }

    // Verifica se hotel existe
    if (hotelId) {
        const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
        if (!hotel) {
            throw new Error("Hotel não encontrado");
        }
    }

    // Hash da senha com bcrypt
    const senhaHash = await bcrypt.hash(senha, 10);

    // Cria usuário
    const novoUsuario = await prisma.usuario.create({
        data: {
            nome,
            email,
            senha: senhaHash,  // Armazena hash ao invés de senha plana
            hotelId,
            role,
            ativo: false  // Inativo até verificar email
        },
        include: { hotel: true }
    });

    // Gera token único de verificação
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Expira em 24h

    // Salva token no banco
    await prisma.tokenVerificacao.create({
        data: {
            token,
            usuarioId: novoUsuario.id,
            expiresAt
        }
    });

    // Envia email de verificação
    await enviarEmailVerificacao(email, nome, token);

    const { senha: _, ...usuarioSemSenha } = novoUsuario;

    return usuarioSemSenha;
}

async function verificarEmail(token) {
    // Busca token no banco
    const tokenVerificacao = await prisma.tokenVerificacao.findUnique({
        where: { token },
        include: { usuario: true }
    });

    if (!tokenVerificacao) {
        throw new Error('Token inválido ou expirado');
    }

    // Verifica se o token expirou
    if (new Date() > tokenVerificacao.expiresAt) {
        // Remove token expirado
        await prisma.tokenVerificacao.delete({
            where: { id: tokenVerificacao.id }
        });
        throw new Error('Token expirado. Solicite um novo email de verificação.');
    }

    // Ativa o usuário
    const usuario = await prisma.usuario.update({
        where: { id: tokenVerificacao.usuarioId },
        data: { ativo: true }
    });

    // Remove o token usado
    await prisma.tokenVerificacao.delete({
        where: { id: tokenVerificacao.id }
    });

    // Envia email de boas-vindas
    await enviarEmailBoasVindas(usuario.email, usuario.nome);

    const { senha: _, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
}

async function reenviarEmailVerificacao(email) {
    // Busca usuário por email
    const usuario = await prisma.usuario.findUnique({
        where: { email }
    });

    if (!usuario) {
        throw new Error('Email não encontrado');
    }

    if (usuario.ativo) {
        throw new Error('Esta conta já está ativa');
    }

    // Remove tokens anteriores
    await prisma.tokenVerificacao.deleteMany({
        where: { usuarioId: usuario.id }
    });

    // Gera novo token de verificação
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Salva novo token
    await prisma.tokenVerificacao.create({
        data: {
            token,
            usuarioId: usuario.id,
            expiresAt
        }
    });

    // Envia email de verificação novamente
    await enviarEmailVerificacao(email, usuario.nome, token);

    return { message: 'Email de verificação reenviado com sucesso' };
}

async function buscarPorId(id) {
    const usuario = await prisma.usuario.findUnique({
        where: { id },
        include: { hotel: true }
    });

    if (!usuario) {
        throw new Error("Usuário não encontrado");
    }

    const { senha: _, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
}

// Middleware para verificar JWT
function verificarToken(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido ou expirado' });
    }
}

module.exports = { 
    login, 
    register, 
    verificarEmail, 
    reenviarEmailVerificacao,
    buscarPorId,
    verificarToken,
    JWT_SECRET
};
