const prisma = require("../config/prisma");

async function criar(dados) {
    const { nome, cnpj, endereco, cidade, estado, cep, telefone, email, descricao } = dados;

    if (!nome || !endereco || !cidade || !estado) {
        throw new Error("Nome, endereço, cidade e estado são obrigatórios");
    }

    return prisma.hotel.create({
        data: {
            nome,
            cnpj,
            endereco,
            cidade,
            estado,
            cep,
            telefone,
            email,
            descricao
        }
    });
}

async function listar() {
    return prisma.hotel.findMany({
        where: { ativo: true },
        include: {
            quartos: {
                include: {
                    tipoQuarto: true
                }
            }
        },
        orderBy: { nome: 'asc' }
    });
}

async function buscarPorId(id) {
    const hotel = await prisma.hotel.findUnique({
        where: { id },
        include: {
            quartos: {
                include: {
                    tipoQuarto: true
                }
            }
        }
    });

    if (!hotel) {
        throw new Error("Hotel não encontrado");
    }

    return hotel;
}

async function atualizar(id, dados) {
    await buscarPorId(id);

    return prisma.hotel.update({
        where: { id },
        data: dados
    });
}

async function deletar(id) {
    await buscarPorId(id);

    return prisma.hotel.update({
        where: { id },
        data: { ativo: false }
    });
}

module.exports = {
    criar,
    listar,
    buscarPorId,
    atualizar,
    deletar
};
