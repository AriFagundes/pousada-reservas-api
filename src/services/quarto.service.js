const prisma = require("../config/prisma");

async function criar(dados) {
    const { numero, hotelId, tipoQuartoId, andar, observacoes } = dados;

    if (!numero || !hotelId || !tipoQuartoId) {
        throw new Error("Número, hotel e tipo de quarto são obrigatórios");
    }

    // Verifica se o hotel existe
    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
    if (!hotel) {
        throw new Error("Hotel não encontrado");
    }

    // Verifica se o tipo de quarto existe
    const tipoQuarto = await prisma.tipoQuarto.findUnique({ where: { id: tipoQuartoId } });
    if (!tipoQuarto) {
        throw new Error("Tipo de quarto não encontrado");
    }

    return prisma.quarto.create({
        data: {
            numero,
            hotelId,
            tipoQuartoId,
            andar: andar ? parseInt(andar) : null,
            observacoes
        },
        include: {
            hotel: true,
            tipoQuarto: true
        }
    });
}

async function listar(hotelId) {
    const where = {};
    if (hotelId) {
        where.hotelId = hotelId;
    }

    return prisma.quarto.findMany({
        where,
        include: {
            hotel: true,
            tipoQuarto: true
        },
        orderBy: [
            { hotelId: 'asc' },
            { numero: 'asc' }
        ]
    });
}

async function buscarPorId(id) {
    const quarto = await prisma.quarto.findUnique({
        where: { id },
        include: {
            hotel: true,
            tipoQuarto: true,
            reservas: {
                where: {
                    status: {
                        in: ['CONFIRMADA']
                    }
                },
                orderBy: { dataCheckIn: 'desc' }
            }
        }
    });

    if (!quarto) {
        throw new Error("Quarto não encontrado");
    }

    return quarto;
}

async function verificarDisponibilidade(hotelId, dataCheckIn, dataCheckOut, tipoQuartoId) {
    if (!hotelId || !dataCheckIn || !dataCheckOut) {
        throw new Error("Hotel, data de check-in e check-out são obrigatórios");
    }

    const checkIn = new Date(dataCheckIn);
    const checkOut = new Date(dataCheckOut);

    if (checkIn >= checkOut) {
        throw new Error("Data de check-out deve ser posterior ao check-in");
    }

    // Busca todos os quartos do hotel e tipo (se especificado)
    const where = {
        hotelId,
        status: 'DISPONIVEL'
    };

    if (tipoQuartoId) {
        where.tipoQuartoId = tipoQuartoId;
    }

    const todosQuartos = await prisma.quarto.findMany({
        where,
        include: {
            tipoQuarto: true,
            reservas: {
                where: {
                    status: {
                        in: ['CONFIRMADA']
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
            }
        }
    });

    // Filtra quartos sem reservas conflitantes
    const quartosDisponiveis = todosQuartos.filter(quarto => quarto.reservas.length === 0);

    return quartosDisponiveis;
}

async function atualizar(id, dados) {
    await buscarPorId(id);

    if (dados.andar) {
        dados.andar = parseInt(dados.andar);
    }

    return prisma.quarto.update({
        where: { id },
        data: dados,
        include: {
            hotel: true,
            tipoQuarto: true
        }
    });
}

async function deletar(id) {
    await buscarPorId(id);

    return prisma.quarto.delete({
        where: { id }
    });
}

module.exports = {
    criar,
    listar,
    buscarPorId,
    verificarDisponibilidade,
    atualizar,
    deletar
};
