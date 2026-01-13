const prisma = require("../config/prisma");

async function criar(dados) {
    const { nome, descricao, capacidadePessoas, precoBase } = dados;

    if (!nome || !capacidadePessoas || !precoBase) {
        throw new Error("Nome, capacidade e preço base são obrigatórios");
    }

    return prisma.tipoQuarto.create({
        data: {
            nome,
            descricao,
            capacidadePessoas: parseInt(capacidadePessoas),
            precoBase: parseFloat(precoBase)
        }
    });
}

async function listar() {
    return prisma.tipoQuarto.findMany({
        include: {
            quartos: true
        },
        orderBy: { nome: 'asc' }
    });
}

async function buscarPorId(id) {
    const tipoQuarto = await prisma.tipoQuarto.findUnique({
        where: { id },
        include: {
            quartos: {
                include: {
                    hotel: true
                }
            }
        }
    });

    if (!tipoQuarto) {
        throw new Error("Tipo de quarto não encontrado");
    }

    return tipoQuarto;
}

async function atualizar(id, dados) {
    await buscarPorId(id);

    if (dados.capacidadePessoas) {
        dados.capacidadePessoas = parseInt(dados.capacidadePessoas);
    }
    if (dados.precoBase) {
        dados.precoBase = parseFloat(dados.precoBase);
    }

    return prisma.tipoQuarto.update({
        where: { id },
        data: dados
    });
}

async function deletar(id) {
    await buscarPorId(id);

    return prisma.tipoQuarto.delete({
        where: { id }
    });
}

module.exports = {
    criar,
    listar,
    buscarPorId,
    atualizar,
    deletar
};
