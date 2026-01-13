const prisma = require("../config/prisma");

async function criar(dados) {
    const { clienteId, quartoId, hotelId, dataCheckIn, dataCheckOut, numeroPessoas, observacoes } = dados;

    if (!clienteId || !quartoId || !hotelId || !dataCheckIn || !dataCheckOut || !numeroPessoas) {
        throw new Error("Todos os campos obrigatórios devem ser preenchidos");
    }

    const checkIn = new Date(dataCheckIn);
    const checkOut = new Date(dataCheckOut);

    // Validações de datas
    if (checkIn >= checkOut) {
        throw new Error("Data de check-out deve ser posterior ao check-in");
    }

    if (checkIn < new Date()) {
        throw new Error("Data de check-in não pode ser no passado");
    }

    // Verifica se o cliente existe
    const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });
    if (!cliente) {
        throw new Error("Cliente não encontrado");
    }

    // Verifica se o quarto existe e busca informações
    const quarto = await prisma.quarto.findUnique({
        where: { id: quartoId },
        include: { tipoQuarto: true }
    });

    if (!quarto) {
        throw new Error("Quarto não encontrado");
    }

    if (quarto.status !== 'DISPONIVEL') {
        throw new Error("Quarto não está disponível");
    }

    // Verifica se o número de pessoas excede a capacidade
    if (numeroPessoas > quarto.tipoQuarto.capacidadePessoas) {
        throw new Error(`O quarto suporta no máximo ${quarto.tipoQuarto.capacidadePessoas} pessoas`);
    }

    // Verifica disponibilidade do quarto nas datas
    const reservasConflitantes = await prisma.reserva.findMany({
        where: {
            quartoId,
            status: {
                in: ['CONFIRMADA', 'CHECKED_IN']
            },
            OR: [
                {
                    AND: [
                        { dataCheckIn: { lte: checkIn } },
                        { dataCheckOut: { gt: checkIn } }
                    ]
                },
                {
                    AND: [
                        { dataCheckIn: { lt: checkOut } },
                        { dataCheckOut: { gte: checkOut } }
                    ]
                },
                {
                    AND: [
                        { dataCheckIn: { gte: checkIn } },
                        { dataCheckOut: { lte: checkOut } }
                    ]
                }
            ]
        }
    });

    if (reservasConflitantes.length > 0) {
        throw new Error("Quarto não disponível para as datas selecionadas");
    }

    // Calcula o valor total
    const dias = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const valorTotal = parseFloat(quarto.tipoQuarto.precoBase) * dias;

    // Cria a reserva
    return prisma.reserva.create({
        data: {
            clienteId,
            quartoId,
            hotelId,
            dataCheckIn: checkIn,
            dataCheckOut: checkOut,
            numeroPessoas: parseInt(numeroPessoas),
            valorTotal,
            observacoes
        },
        include: {
            cliente: true,
            quarto: {
                include: {
                    tipoQuarto: true
                }
            },
            hotel: true
        }
    });
}

async function listar(filtros = {}) {
    const where = {};

    if (filtros.hotelId) {
        where.hotelId = filtros.hotelId;
    }

    if (filtros.clienteId) {
        where.clienteId = filtros.clienteId;
    }

    if (filtros.status) {
        where.status = filtros.status;
    }

    return prisma.reserva.findMany({
        where,
        include: {
            cliente: true,
            quarto: {
                include: {
                    tipoQuarto: true
                }
            },
            hotel: true
        },
        orderBy: { dataCheckIn: 'desc' }
    });
}

async function buscarPorId(id) {
    const reserva = await prisma.reserva.findUnique({
        where: { id },
        include: {
            cliente: true,
            quarto: {
                include: {
                    tipoQuarto: true
                }
            },
            hotel: true
        }
    });

    if (!reserva) {
        throw new Error("Reserva não encontrada");
    }

    return reserva;
}

async function atualizar(id, dados) {
    const reserva = await buscarPorId(id);

    // Não permite atualizar reservas canceladas ou finalizadas
    if (reserva.status === 'CANCELADA' || reserva.status === 'CHECKED_OUT') {
        throw new Error("Não é possível atualizar uma reserva cancelada ou finalizada");
    }

    // Se está mudando datas, recalcula o valor
    if (dados.dataCheckIn || dados.dataCheckOut) {
        const checkIn = dados.dataCheckIn ? new Date(dados.dataCheckIn) : reserva.dataCheckIn;
        const checkOut = dados.dataCheckOut ? new Date(dados.dataCheckOut) : reserva.dataCheckOut;

        if (checkIn >= checkOut) {
            throw new Error("Data de check-out deve ser posterior ao check-in");
        }

        const dias = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        dados.valorTotal = parseFloat(reserva.quarto.tipoQuarto.precoBase) * dias;
        dados.dataCheckIn = checkIn;
        dados.dataCheckOut = checkOut;
    }

    if (dados.numeroPessoas) {
        dados.numeroPessoas = parseInt(dados.numeroPessoas);
    }

    return prisma.reserva.update({
        where: { id },
        data: dados,
        include: {
            cliente: true,
            quarto: {
                include: {
                    tipoQuarto: true
                }
            },
            hotel: true
        }
    });
}

async function cancelar(id) {
    const reserva = await buscarPorId(id);

    if (reserva.status === 'CANCELADA') {
        throw new Error("Reserva já está cancelada");
    }

    if (reserva.status === 'CHECKED_OUT') {
        throw new Error("Não é possível cancelar uma reserva finalizada");
    }

    return prisma.reserva.update({
        where: { id },
        data: { status: 'CANCELADA' },
        include: {
            cliente: true,
            quarto: true,
            hotel: true
        }
    });
}

async function confirmar(id) {
    const reserva = await buscarPorId(id);

    if (reserva.status !== 'PENDENTE') {
        throw new Error("Apenas reservas pendentes podem ser confirmadas");
    }

    return prisma.reserva.update({
        where: { id },
        data: { status: 'CONFIRMADA' },
        include: {
            cliente: true,
            quarto: true,
            hotel: true
        }
    });
}

async function checkIn(id) {
    const reserva = await buscarPorId(id);

    if (reserva.status !== 'CONFIRMADA') {
        throw new Error("Apenas reservas confirmadas podem fazer check-in");
    }

    // Atualiza status da reserva e do quarto
    const [reservaAtualizada] = await prisma.$transaction([
        prisma.reserva.update({
            where: { id },
            data: { status: 'CHECKED_IN' },
            include: {
                cliente: true,
                quarto: true,
                hotel: true
            }
        }),
        prisma.quarto.update({
            where: { id: reserva.quartoId },
            data: { status: 'OCUPADO' }
        })
    ]);

    return reservaAtualizada;
}

async function checkOut(id) {
    const reserva = await buscarPorId(id);

    if (reserva.status !== 'CHECKED_IN') {
        throw new Error("Apenas reservas com check-in podem fazer check-out");
    }

    // Atualiza status da reserva e do quarto
    const [reservaAtualizada] = await prisma.$transaction([
        prisma.reserva.update({
            where: { id },
            data: { status: 'CHECKED_OUT' },
            include: {
                cliente: true,
                quarto: true,
                hotel: true
            }
        }),
        prisma.quarto.update({
            where: { id: reserva.quartoId },
            data: { status: 'DISPONIVEL' }
        })
    ]);

    return reservaAtualizada;
}

module.exports = {
    criar,
    listar,
    buscarPorId,
    atualizar,
    cancelar,
    confirmar,
    checkIn,
    checkOut
};
