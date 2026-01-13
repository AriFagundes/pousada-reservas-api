const prisma = require("../config/prisma");

async function criar(dados) {
    const { nome, email, telefone, cpf, dataNascimento, endereco, cidade, estado, cep, observacoes } = dados;

    if (!nome || !email || !telefone) {
        throw new Error("Nome, email e telefone são obrigatórios");
    }

    // Verifica se já existe cliente com esse email
    const clienteExistente = await prisma.cliente.findUnique({
        where: { email }
    });

    if (clienteExistente) {
        throw new Error("Já existe um cliente com este email");
    }

    // Verifica CPF se informado
    if (cpf) {
        const cpfExistente = await prisma.cliente.findUnique({
            where: { cpf }
        });

        if (cpfExistente) {
            throw new Error("Já existe um cliente com este CPF");
        }
    }

    return prisma.cliente.create({
        data: {
            nome,
            email,
            telefone,
            cpf,
            dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
            endereco,
            cidade,
            estado,
            cep,
            observacoes
        }
    });
}

async function listar() {
    return prisma.cliente.findMany({
        include: {
            reservas: {
                include: {
                    hotel: true,
                    quarto: true
                },
                orderBy: { dataCheckIn: 'desc' },
                take: 5
            }
        },
        orderBy: { nome: 'asc' }
    });
}

async function buscarPorId(id) {
    const cliente = await prisma.cliente.findUnique({
        where: { id },
        include: {
            reservas: {
                include: {
                    hotel: true,
                    quarto: {
                        include: {
                            tipoQuarto: true
                        }
                    }
                },
                orderBy: { dataCheckIn: 'desc' }
            }
        }
    });

    if (!cliente) {
        throw new Error("Cliente não encontrado");
    }

    return cliente;
}

async function buscarPorEmail(email) {
    const cliente = await prisma.cliente.findUnique({
        where: { email },
        include: {
            reservas: {
                include: {
                    hotel: true,
                    quarto: true
                },
                orderBy: { dataCheckIn: 'desc' }
            }
        }
    });

    if (!cliente) {
        throw new Error("Cliente não encontrado");
    }

    return cliente;
}

async function atualizar(id, dados) {
    await buscarPorId(id);

    // Se está atualizando email, verifica se já existe
    if (dados.email) {
        const clienteExistente = await prisma.cliente.findUnique({
            where: { email: dados.email }
        });

        if (clienteExistente && clienteExistente.id !== id) {
            throw new Error("Já existe um cliente com este email");
        }
    }

    // Se está atualizando CPF, verifica se já existe
    if (dados.cpf) {
        const cpfExistente = await prisma.cliente.findUnique({
            where: { cpf: dados.cpf }
        });

        if (cpfExistente && cpfExistente.id !== id) {
            throw new Error("Já existe um cliente com este CPF");
        }
    }

    if (dados.dataNascimento) {
        dados.dataNascimento = new Date(dados.dataNascimento);
    }

    return prisma.cliente.update({
        where: { id },
        data: dados
    });
}

async function deletar(id) {
    await buscarPorId(id);

    // Verifica se tem reservas ativas
    const reservasAtivas = await prisma.reserva.count({
        where: {
            clienteId: id,
            status: {
                in: ['PENDENTE', 'CONFIRMADA', 'CHECKED_IN']
            }
        }
    });

    if (reservasAtivas > 0) {
        throw new Error("Não é possível excluir cliente com reservas ativas");
    }

    return prisma.cliente.delete({
        where: { id }
    });
}

module.exports = {
    criar,
    listar,
    buscarPorId,
    buscarPorEmail,
    atualizar,
    deletar
};
